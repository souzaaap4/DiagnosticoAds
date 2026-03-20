# Integração DiagnósticoAds → n8n → Google Sheets (Leads)

**Data:** 05/03/2026  
**Projeto:** DiagnósticoAds  
**Responsável:** Taynara Souza

---

## 1) Objetivo
Registrar automaticamente os dados do formulário e a origem do tráfego da landing page **DiagnósticoAds** em planilhas do Google Sheets via **n8n**, garantindo:
- Padronização dos campos
- Funil preenchido automaticamente
- Data e hora em formato brasileiro
- Operação de **append** (nova linha a cada envio)

---

## 2) Arquitetura do Fluxo

```
Landing Page (Formulário)
   ↓ POST
n8n Webhook (/webhook/DiagnosticoAds)
   ↓
Code Node (Parse Body + Normalização)
   ↓
Google Sheets (Append Row)
```

---

## 3) Endpoints de Webhook

### Leads (Formulário)
**Produção**
```
https://n8n.srv1095468.hstgr.cloud/webhook/DiagnosticoAds
```

**Teste (apenas quando o fluxo está em execução manual)**
```
https://n8n.srv1095468.hstgr.cloud/webhook-test/DiagnosticoAds
```

> **Importante:** o endpoint `/webhook-test` não funciona em produção.

---

## 4) Payload Enviado pela Landing Page

A landing page envia os dados com os **mesmos nomes das colunas** da planilha:

```json
{
  "Nome completo ": "João Silva",
  "E-mail": "joao@teste.com",
  "WhatsApp": "(11) 99999-9999",
  "Quais marketplaces você anuncia": "Mercado Livre, Amazon",
  "Data de entrada de leads": "05/03/2026",
  "Data": "05/03/2026",
  "Hora": "14:32",
  "Funil": "DiagnosticoAds",
  "channel": "youtube",
  "source": "youtube",
  "medium": "organic",
  "campaign": "canal",
  "timestamp": "2026-03-20T12:34:56.000-03:00"
}
```

> **Obs.:** a coluna “Nome completo ” possui **espaço no final**, por isso o payload mantém o mesmo nome.

---

## 5) Code Node (Parse Body)

Este script garante:
- Parsing correto quando o payload chega como texto
- Normalização de campos
- Funil automático
- Data no formato **dd/mm/aaaa**
- Padronização de tracking (channel/source/medium/campaign)

```js
const raw = $json.body ?? $json;
let data = raw;

if (typeof data === "string") {
  try { data = JSON.parse(data); } catch { data = {}; }
}

if (typeof data !== "object" || data === null || Array.isArray(data)) {
  data = {};
}

const pick = (obj, keys, fallback = "") => {
  for (const key of keys) {
    const val = obj[key];
    if (val !== undefined && val !== null && String(val).trim() !== "") {
      return typeof val === "string" ? val.trim() : String(val);
    }
  }
  return fallback;
};

const nome = pick(data, ["Nome completo", "Nome completo ", "name"], "");
const email = pick(data, ["E-mail", "Email", "email"], "");
const whatsapp = pick(data, ["WhatsApp", "Whatsapp", "whatsapp"], "");

const marketplacesRaw = data["Quais marketplaces você anuncia"] || data.marketplaces || data.marketplace || "";
const marketplaces = Array.isArray(marketplacesRaw)
  ? marketplacesRaw.join(", ")
  : String(marketplacesRaw || "");

// Data em formato BR
const now = new Date();
const dd = String(now.getDate()).padStart(2, "0");
const mm = String(now.getMonth() + 1).padStart(2, "0");
const yyyy = now.getFullYear();
const dateBR = `${dd}/${mm}/${yyyy}`;

const channel = pick(data, ["channel", "canal"], "direto");
const source = pick(data, ["source", "utm_source", "origem"], "direto");
const medium = pick(data, ["medium", "utm_medium"], "none");
const campaign = pick(data, ["campaign", "utm_campaign"], "none");
const timestamp = pick(data, ["timestamp", "ts"], new Date().toISOString());

// Se channel vier vazio mas source existir, usa source como canal
const finalChannel = channel === "direto" && source !== "direto" ? source : channel;

const normalized = {
  "Data de entrada de leads": data["Data de entrada de leads"] || dateBR,
  "Nome completo": nome,
  "E-mail": email,
  "WhatsApp": whatsapp,
  "Quais marketplaces você anuncia": marketplaces,
  "Funil": "DiagnosticoAds",
  "Channel": finalChannel,
  "Source": source,
  "Medium": medium,
  "Campaign": campaign,
  "Timestamp": timestamp,
};

return [{ json: normalized }];
```

---

## 6) Google Sheets (Append)

**Planilha (ID):** 
**Aba:** `DiagnosticoAds`  
**Operação:** `append`  

### Colunas mapeadas
- **Nome completo**
- **E-mail**
- **WhatsApp**
- **Quais marketplaces você anuncia**
- **Data de entrada de leads**
- **Funil**
- **channel**
- **source**
- **medium**
- **campaign**
- **timestamp**

> **Observação crítica:** os nomes das colunas no Google Sheets precisam ser **idênticos** aos nomes enviados no payload (incluindo espaços no final, se existirem).

### Mapeamento recomendado (Define Below)
```text
"Nome completo "  → {{$json["Nome completo "]}}
"E-mail"          → {{$json["E-mail"]}}
"WhatsApp"        → {{$json["WhatsApp"]}}
"Quais marketplaces você anuncia" → {{$json["Quais marketplaces você anuncia"]}}
"Data de entrada de leads" → {{$json["Data de entrada de leads"]}}
"Funil"           → {{$json["Funil"]}}
"channel"         → {{$json["Channel"]}}
"source"          → {{$json["Source"]}}
"medium"          → {{$json["Medium"]}}
"campaign"        → {{$json["Campaign"]}}
"timestamp"       → {{$json["Timestamp"]}}
```

---

## 7) Configuração no Front-end

No front-end, o payload é disparado **antes** do redirecionamento ao Google Calendar.
O envio é feito em **text/plain** para evitar bloqueio de CORS.
O tracking de origem é feito via `public/tracking.js` e URLs limpas via `.htaccess` (ex.: `/youtube`, `/instagram`).

### Endpoint de produção
```
https://n8n.srv1095468.hstgr.cloud/webhook/DiagnosticoAds
```

### Payload enviado (resumo)
```json
{
  "Nome completo ": "...",
  "E-mail": "...",
  "WhatsApp": "...",
  "Quais marketplaces você anuncia": "...",
  "Data de entrada de leads": "dd/mm/aaaa",
  "Data": "dd/mm/aaaa",
  "Hora": "HH:mm",
  "Funil": "DiagnosticoAds",
  "channel": "...",
  "source": "...",
  "medium": "...",
  "campaign": "...",
  "timestamp": "ISO8601"
}
```

> Implementação no front-end:
> - Leads: `src/components/sections/FormSection.tsx`

---

## 8) Checklist de Produção

1. Workflow **ativado** no n8n.
2. URL correta no front-end: `/webhook/DiagnosticoAds`.
3. Node Google Sheets em **append** (não update).
4. Colunas do Sheets com nomes **idênticos** ao payload (incluindo tracking).
5. Deploy atualizado no Vercel/HostGator.

---

## 9) Troubleshooting

### ✅ Funciona no teste, mas não em produção
Verifique:
- Workflow ativo
- URL `/webhook/` (não `/webhook-test/`)
- Deploy atualizado no Vercel

### ✅ Só grava Funil/Data e ignora Nome/E-mail/WhatsApp
Causa: o nome das colunas **não bate exatamente** com o payload.
Confirme:
- `Nome completo ` (com espaço no final)
- `E-mail` (com hífen)
- `WhatsApp` (W maiúsculo)

### ✅ Erro “A 'json' property isn't an object”
O Code Node está retornando algo que não é objeto.
Use `return [{ json: data }];` sempre.

## 10) Manutenção e Evolução

Se futuramente for necessário:
- adicionar novos campos (ex.: status, observacoes)
- gravar dados adicionais (ex.: pagina, origem, campanhas, canais)

Basta:
1. Incluir a coluna na planilha.
2. Enviar o campo no payload.
3. Atualizar o Code Node (se necessário).

---

## Contato
**Taynara Souza**  
Projeto DiagnósticoAds — 05/03/2026
