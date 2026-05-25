# Padrão de Automação e Rastreamento — Método P4

## Visão geral do fluxo

```
Usuário preenche form → handleSubmit → sendBeacon (+ fetch fallback) → Webhook N8N
                                                                             ↓
                                                              Parse Body (normaliza dados)
                                                                             ↓
                                              ┌──────────────┬──────────────┴──────────────┐
                                         Sheet: Organico  Sheet: Banco de Dados    Sheet: CRM Geral
```

---

## 1. Bloco de rastreamento (UTM Capture)

Cole no `<script>` da página, antes do form.

```js
// ── UTM CAPTURE ──
const _utms = (() => {
  const p = new URLSearchParams(window.location.search);
  const ref = document.referrer || 'direto';
  const src = p.get('utm_source') || (ref !== 'direto' ? new URL(ref).hostname : 'direto');
  return {
    channel:      p.get('channel') || p.get('canal') || 'direto',
    utm_source:   src,
    utm_medium:   p.get('utm_medium')   || 'none',
    utm_campaign: p.get('utm_campaign') || 'none',
    utm_content:  p.get('utm_content')  || 'none',
    referrer:     ref,
    page_url:     window.location.href,
    timestamp:    new Date().toISOString(),
  };
})();
```

---

## 2. Constantes do projeto

```js
const WEBHOOK_URL = 'https://n8n.srv1095468.hstgr.cloud/webhook/SEU_PATH_AQUI';
const FUNIL       = 'nome-do-funil-aqui';         // ex: diagnostico-organico, lead-organico
const CALENDAR_URL = 'https://URL_DE_REDIRECIONAMENTO_AQUI';
```

---

## 3. handleSubmit — padrão completo

```js
async function handleSubmit(e) {
  e.preventDefault();
  if (!validateForm()) return;

  // Anti double-submit
  const btn = document.getElementById('btnSubmit');
  if (btn.dataset.sending === '1') return;
  btn.dataset.sending = '1';
  btn.disabled = true;
  btn.textContent = 'ENVIANDO...';

  // Data e hora no momento do envio
  const now = new Date();
  const pad = n => String(n).padStart(2, '0');
  const dataBR = `${pad(now.getDate())}/${pad(now.getMonth() + 1)}/${now.getFullYear()}`;
  const hora   = `${pad(now.getHours())}:${pad(now.getMinutes())}`;

  // Monte o payload com os campos do SEU formulário
  // IMPORTANTE: use os nomes de campo exatamente como o N8N espera (ver seção 5)
  const payload = {
    'Nome completo':    document.getElementById('f-nome').value.trim(),
    'E-mail':           document.getElementById('f-email').value.trim(),
    'WhatsApp':         document.getElementById('f-wpp').value.trim(),
    'Confirmar WhatsApp': document.getElementById('f-wpp2').value.trim(),
    // campos extras da sua página:
    // 'Quanto você investe em publicidade nos marketplaces hoje?': document.getElementById('f-budget').value,
    // 'Em quais canais': [...document.querySelectorAll('#f-canais input:checked')].map(c => c.value),
    'Data de entrada de leads': dataBR,
    'Data':  dataBR,
    'Hora':  hora,
    'Funil': FUNIL,
    channel:     _utms.channel,
    source:      _utms.utm_source,
    medium:      _utms.utm_medium,
    campaign:    _utms.utm_campaign,
    utm_content: _utms.utm_content,
    referrer:    _utms.referrer,
    page_url:    _utms.page_url,
    timestamp:   _utms.timestamp,
  };

  const body = JSON.stringify(payload);

  // sendBeacon: fire-and-forget, garante entrega mesmo durante redirect
  let sent = navigator.sendBeacon
    ? navigator.sendBeacon(WEBHOOK_URL, new Blob([body], { type: 'application/json' }))
    : false;

  // fetch como fallback
  if (!sent) {
    try {
      await fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body,
      });
    } catch (_) { /* webhook offline — redireciona mesmo assim */ }
  }

  window.location.href = CALENDAR_URL;
}
```

---

## 4. N8N — Parse Body padrão

Node Code do N8N. Normaliza o payload recebido e gera o campo `Pergunta adicional`.

```js
const raw = $json.body ?? $json;
let data = raw;

if (typeof data === 'string') {
  try { data = JSON.parse(data); } catch { data = {}; }
}
if (typeof data !== 'object' || data === null || Array.isArray(data)) {
  data = {};
}

const pick = (obj, keys, fallback = '') => {
  for (const key of keys) {
    const val = obj[key];
    if (val !== undefined && val !== null && String(val).trim() !== '') {
      return typeof val === 'string' ? val.trim() : String(val);
    }
  }
  return fallback;
};

const nome      = pick(data, ['Nome completo', 'nome', 'name']);
const email     = pick(data, ['E-mail', 'Email', 'email']);
const whatsapp  = pick(data, ['WhatsApp', 'Whatsapp', 'whatsapp']);
const confirmar = pick(data, ['Confirmar WhatsApp', 'confirmar_whatsapp', 'whatsapp_confirmacao']);

// ── Campos extras — adapte para cada página ──
const investimento = pick(data, [
  'Quanto você investe em publicidade nos marketplaces hoje?',
  'investimento', 'investimento_mensal', 'invest'
]);
const canaisRaw = data['Em quais canais'] || data['canais_marketplace'] || data.canais || '';
const canais = Array.isArray(canaisRaw) ? canaisRaw.join(', ') : String(canaisRaw || '');

// Campo combinado para CRM Geral
const perguntaAdicional = [
  investimento ? `Investimento: ${investimento}` : '',
  canais       ? `Canais: ${canais}` : '',
].filter(Boolean).join(' | ');

const now = new Date();
const pad = n => String(n).padStart(2, '0');
const dateBR    = `${pad(now.getDate())}/${pad(now.getMonth() + 1)}/${now.getFullYear()}`;
const hora      = `${pad(now.getHours())}:${pad(now.getMinutes())}`;

const channel  = pick(data, ['channel', 'canal'], 'direto');
const source   = pick(data, ['source', 'utm_source', 'origem'], 'direto');
const medium   = pick(data, ['medium', 'utm_medium'], 'none');
const campaign = pick(data, ['campaign', 'utm_campaign'], 'none');
const content  = pick(data, ['utm_content', 'content'], 'none');
const referrer = pick(data, ['referrer', 'ref'], '');
const pageUrl  = pick(data, ['page_url', 'url'], '');
const timestamp = pick(data, ['timestamp', 'ts'], new Date().toISOString());
const finalChannel = channel === 'direto' && source !== 'direto' ? source : channel;

return [{ json: {
  'Data de entrada de leads': pick(data, ['Data de entrada de leads', 'Data'], dateBR),
  'Hora':               pick(data, ['Hora'], hora),
  'Nome completo':      nome,
  'E-mail':             email,
  'WhatsApp':           whatsapp,
  'Confirmar WhatsApp': confirmar,
  'Investimento em Ads': investimento,
  'Canais':             canais,
  'Pergunta adicional': perguntaAdicional,
  'Funil':              pick(data, ['Funil'], 'DEFINIR-FUNIL'),
  'Channel':            finalChannel,
  'Source':             source,
  'Medium':             medium,
  'Campaign':           campaign,
  'Content':            content,
  'Referrer':           referrer,
  'Page URL':           pageUrl,
  'Timestamp':          timestamp,
} }];
```

---

## 5. Nomes de campo — referência

Estes são os nomes que o Parse Body reconhece. Use exatamente esses no payload do front-end.

| Campo no payload (front-end) | Campo na planilha |
|---|---|
| `Nome completo` | Nome completo |
| `E-mail` | E-mail |
| `WhatsApp` | WhatsApp |
| `Confirmar WhatsApp` | Confirmar WhatsApp |
| `Quanto você investe em publicidade nos marketplaces hoje?` | Investimento em Ads |
| `Em quais canais` (array) | Canais |
| `Data de entrada de leads` | Data de entrada de leads |
| `Hora` | Hora |
| `Funil` | Funil |
| `channel` | Channel |
| `source` | Source |
| `medium` | Medium |
| `campaign` | Campaign |
| `utm_content` | Content |
| `referrer` | Referrer |
| `page_url` | Page URL |
| `timestamp` | Timestamp |

---

## 6. Estrutura das 3 planilhas (abas na mesma spreadsheet)

| Aba | Propósito | Colunas |
|---|---|---|
| **Organico** | Automação da página orgânica | Todos os campos |
| **Banco de Dados** | Dados brutos centralizados | Todos os campos |
| **CRM Geral** | Uso do time de vendas | Contato + `Pergunta adicional` + UTMs básicos |

**Colunas — Organico e Banco de Dados:**
`Data de entrada de leads` / `Hora` / `Nome completo` / `E-mail` / `WhatsApp` / `Confirmar WhatsApp` / `Investimento em Ads` / `Canais` / `Funil` / `Channel` / `Source` / `Medium` / `Campaign` / `Content` / `Referrer` / `Page URL` / `Timestamp`

**Colunas — CRM Geral:**
`Data de entrada de leads` / `Hora` / `Nome completo` / `E-mail` / `WhatsApp` / `Confirmar WhatsApp` / `Pergunta adicional` / `Funil` / `Channel` / `Source` / `Medium` / `Campaign` / `Timestamp`

---

## 7. Checklist para nova página

- [ ] Copiar bloco UTM Capture (seção 1)
- [ ] Definir `WEBHOOK_URL`, `FUNIL` e `CALENDAR_URL` (seção 2)
- [ ] Copiar `handleSubmit` e adaptar os campos do formulário (seção 3)
- [ ] No N8N: duplicar o workflow e atualizar o path do webhook e o valor hardcoded de `Funil`
- [ ] No N8N: ajustar os campos extras no Parse Body se o formulário tiver perguntas diferentes
- [ ] No Google Sheets: criar as 3 abas com os nomes exatos (`Organico`, `Banco de Dados`, `CRM Geral`)
- [ ] Testar envio local e verificar chegada nas 3 abas

---

## 8. Prompt para IA — implementar esse padrão em nova página

```
Estou criando uma landing page em HTML/CSS/JS puro (sem frameworks).
Preciso implementar o sistema de automação e rastreamento padrão da Método P4.

## Contexto do padrão
- Captura UTMs da URL: channel, utm_source, utm_medium, utm_campaign, utm_content
- Captura referrer (domínio de origem) e page_url automaticamente
- Envia os dados via sendBeacon (principal) + fetch (fallback) para um webhook N8N
- Após envio, redireciona para URL do calendário independente de erro
- Tem proteção anti double-submit

## Constantes a usar nessa página
- WEBHOOK_URL: [COLE A URL DO WEBHOOK N8N AQUI]
- FUNIL: '[NOME DO FUNIL AQUI]'
- CALENDAR_URL: '[URL DE REDIRECIONAMENTO AQUI]'

## Campos do formulário desta página
[LISTE OS CAMPOS AQUI, ex:]
- Nome completo (id: f-nome)
- E-mail (id: f-email)
- WhatsApp com máscara (id: f-wpp)
- Confirmar WhatsApp (id: f-wpp2)
- [OUTROS CAMPOS ESPECÍFICOS DESTA PÁGINA]

## O que preciso
1. Bloco UTM Capture (colocar no início do <script>)
2. As constantes WEBHOOK_URL, FUNIL e CALENDAR_URL
3. handleSubmit completo com:
   - Proteção anti double-submit (btn.dataset.sending)
   - Payload com os nomes de campo corretos (conforme tabela de referência)
   - sendBeacon como método principal
   - fetch como fallback silencioso
   - Redirecionamento para CALENDAR_URL ao final

## Nomes de campo que o N8N Parse Body reconhece
- 'Nome completo', 'E-mail', 'WhatsApp', 'Confirmar WhatsApp'
- 'Quanto você investe em publicidade nos marketplaces hoje?' → Investimento em Ads
- 'Em quais canais' (array) → Canais
- 'Data de entrada de leads', 'Hora', 'Funil'
- channel, source, medium, campaign, utm_content, referrer, page_url, timestamp

Implemente seguindo exatamente esse padrão, sem adicionar bibliotecas externas.
```
