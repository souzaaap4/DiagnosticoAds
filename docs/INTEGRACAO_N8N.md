# Integração DiagnósticoAds → n8n → Google Sheets

**Data:** 05/03/2026  
**Projeto:** DiagnósticoAds  
**Responsável:** Taynara Souza

---

## 1) Objetivo
Registrar automaticamente os dados do formulário da landing page **DiagnósticoAds** em uma planilha do Google Sheets via **n8n**, garantindo:
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

## 3) Endpoint de Webhook

### Produção
```
https://n8n.srv1095468.hstgr.cloud/webhook/DiagnosticoAds
```

### Teste (apenas quando o fluxo está em execução manual)
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
  "Data de entrada de leads": "05/03/2026",
  "Data": "05/03/2026",
  "Hora": "14:32",
  "Funil": "DiagnosticoAds"
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

```js
const raw = $json.body ?? $json;
let data = raw;

if (typeof data === "string") {
  try { data = JSON.parse(data); } catch { data = {}; }
}

if (typeof data !== "object" || data === null || Array.isArray(data)) {
  data = {};
}

// Campos principais (garante compatibilidade)
const nome = data["Nome completo "] || data["Nome completo"] || data.name || "";
const email = data["E-mail"] || data["Email"] || data.email || "";
const whatsapp = data["WhatsApp"] || data["Whatsapp"] || data.whatsapp || "";

data["Nome completo "] = nome;
data["E-mail"] = email;
data["WhatsApp"] = whatsapp;

// Funil fixo
data["Funil"] = "DiagnosticoAds";

// Data em formato BR
const now = new Date();
const dd = String(now.getDate()).padStart(2, "0");
const mm = String(now.getMonth() + 1).padStart(2, "0");
const yyyy = now.getFullYear();
const dateBR = `${dd}/${mm}/${yyyy}`;

data["Data de entrada de leads"] = data["Data de entrada de leads"] || dateBR;
data["Data"] = data["Data"] || dateBR;
data["Hora"] = data["Hora"] || now.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });

return [{ json: data }];
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
- **Data de entrada de leads**
- **Funil**

> **Observação crítica:** os nomes das colunas no Google Sheets precisam ser **idênticos** aos nomes enviados no payload (incluindo espaços no final, se existirem).

### Mapeamento recomendado (Define Below)
```text
"Nome completo "  → {{$json["Nome completo "]}}
"E-mail"          → {{$json["E-mail"]}}
"WhatsApp"        → {{$json["WhatsApp"]}}
"Data de entrada de leads" → {{$json["Data de entrada de leads"]}}
"Funil"           → {{$json["Funil"]}}
```

---

## 7) Configuração no Front-end

No front-end, o payload é disparado **antes** do redirecionamento ao Calendly.
O envio é feito em **text/plain** para evitar bloqueio de CORS.

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
  "Data de entrada de leads": "dd/mm/aaaa",
  "Data": "dd/mm/aaaa",
  "Hora": "HH:mm",
  "Funil": "DiagnosticoAds"
}
```

---

## 8) Checklist de Produção

1. Workflow **ativado** no n8n.
2. URL correta no front-end: `/webhook/DiagnosticoAds`.
3. Node Google Sheets em **append** (não update).
4. Colunas do Sheets com nomes **idênticos** ao payload.
5. Deploy atualizado no Vercel.

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

---

## 10) Manutenção e Evolução

Se futuramente for necessário:
- adicionar novos campos (ex.: marketplace, UTM, status)
- gravar dados adicionais (ex.: página, origem, campanhas)

Basta:
1. Incluir a coluna na planilha.
2. Enviar o campo no payload.
3. Atualizar o Code Node (se necessário).

---

## Contato
**Taynara Souza**  
Projeto DiagnósticoAds — 05/03/2026
