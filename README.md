# LP DiagnósticoAds — Método P4

> Landing page orgânica para captação de leads do diagnóstico gratuito de Ads em marketplaces.

![Status](https://img.shields.io/badge/status-ativo-22c55e)
![Frontend](https://img.shields.io/badge/frontend-HTML%20%2F%20CSS%20%2F%20JS-1f6feb)
![Build](https://img.shields.io/badge/build-Vite%206-646cff)
![Automação](https://img.shields.io/badge/automacao-n8n%20Webhook-0f766e)
![Deploy](https://img.shields.io/badge/deploy-Vercel%20%2F%20HostGator-7c3aed)

---

## Sobre

Página de captura para o funil `diagnostico-organico` do Método P4. Ao preencher o formulário, o lead é enviado via webhook para o N8N, que registra os dados em 3 abas da planilha Google Sheets (Organico, Banco de Dados e CRM Geral) e redireciona para o link de agendamento.

**URL em produção:** `https://diagnosticoads.metodop4.com.br`

---

## Estrutura do projeto

```
LP-diagnostico/
├── ads.html                  ← página principal (entry do Vite)
├── vite.config.ts
├── package.json
├── vercel.json               ← config deploy Vercel
├── assets/                   ← imagens usadas na página
│   ├── 01.png                ← logo nav
│   ├── 03.png                ← logo footer
│   └── video-thumb-diagnostico.png
├── fonts/static/             ← fonte Sora (6 pesos)
├── public/                   ← copiado direto para dist/
│   ├── robots.txt
│   └── sitemap.xml
├── dist/                     ← build gerado (não versionar)
├── diagnostico-organico-tay/ ← pasta pronta para upload no Hostgator
└── docs/
    ├── relatorio.md                    ← log de todas as alterações
    ├── PADRAO-AUTOMACAO-TRACKING.md    ← template padrão de automação
    ├── PADRAO-SEO.md                   ← template padrão de SEO
    ├── n8n-diagnostico-organico.json   ← workflow N8N (importar via UI)
    ├── setup-organico.gs               ← Apps Script — aba Organico
    └── setup-banco-de-dados.gs         ← Apps Script — aba Banco de Dados
```

---

## Automação

| Item | Valor |
|---|---|
| Webhook | `https://n8n.srv1095468.hstgr.cloud/webhook/Diagnostico-organico` |
| Funil | `diagnostico-organico` |
| Spreadsheet ID | `17uXnW7B3OoyGRgnJUtlV59S_JvaxyZe7A9R8PAJ900E` |
| Redirecionamento | `https://calendar.app.google/zaNXcV4By3HUQuc88` |

**Planilhas gravadas em paralelo:**
- **Organico** — 35 colunas, automação da página orgânica
- **Banco de Dados** — 17 colunas, armazenamento bruto de todos os leads
- **CRM Geral** — visão de vendas, com coluna `Pergunta adicional` combinada

---

## Desenvolvimento

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # gera dist/
```

---

## Deploy

### Vercel
Push para `main` → deploy automático via `vercel.json`.

### Hostgator
1. Rodar `npm run build`
2. Fazer upload da pasta `diagnostico-organico-tay/` para `public_html/` via FTP ou cPanel
3. O `.htaccess` já está configurado para `/diagnostico-organico-tay/`

---

## Documentação

| Arquivo | Descrição |
|---|---|
| `docs/relatorio.md` | Log cronológico de todas as alterações |
| `docs/PADRAO-AUTOMACAO-TRACKING.md` | Template reutilizável de automação para novas páginas |
| `docs/PADRAO-SEO.md` | Template reutilizável de SEO para novas páginas |
| `docs/n8n-diagnostico-organico.json` | Workflow N8N — importar em Import Workflow |
| `docs/setup-organico.gs` | Apps Script para criar/recriar aba Organico |
| `docs/setup-banco-de-dados.gs` | Apps Script para criar/recriar aba Banco de Dados |
