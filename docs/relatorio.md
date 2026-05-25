# Log de alterações — LP-diagnostico

## 2026-05-25 (tarde)

### Correções de automação N8N — nome e pergunta adicional

**Problema 1 — Nome não ia para nenhuma das 3 planilhas:**
- Causa: formulário enviava apenas `'Nome completo'` (chave com espaço), que pode ser interpretada de formas diferentes dependendo do ambiente/browser via `sendBeacon`.
- Correção em `ads.html`: payload agora envia `nome` (sem espaço) E `'Nome completo'` simultaneamente. O Parse Body3 prioriza `nome` primeiro: `pick(data, ['nome', 'Nome completo', 'name'])`.

**Problema 2 — Pergunta adicional vazia ou com slugs ilegíveis:**
- Causa 1: formulário enviava os `value` dos inputs (`ate_5k`, `mercado_livre`) em vez dos rótulos legíveis.
- Causa 2: Parse Body3 montava o campo a partir dos slugs, gerando `"Investimento: ate_5k | Canais: mercado_livre"`.
- Correção em `ads.html`: valores convertidos para rótulos antes do envio. Exemplos: `ate_5k` → `"Até R$5.000/mês"`, `mercado_livre` → `"Mercado Livre"`. Campo `pergunta_adicional` montado no formulário antes de enviar: `"Investimento: Até R$5.000/mês | Canais: Shopee, Amazon"`.
- Parse Body3 agora usa o campo pronto se vier no payload: `data['pergunta_adicional'] || data['Pergunta adicional'] || [monta aqui]`.

**Outras correções no payload (`ads.html`):**
- Todos os campos têm dupla chave: simples (`nome`, `email`, `whatsapp`, `investimento_mensal`, `canais_marketplace`) + legada (`'Nome completo'`, `'E-mail'`, etc.) para compatibilidade com qualquer versão do N8N.
- `investimento_mensal` e `canais_marketplace` enviados como strings legíveis (não slugs).

**JSON do N8N (`docs/n8n-diagnostico-organico.json`) atualizado:**
- Sobrescrito com o workflow real em execução (nó `Parse Body3`, planilha `1FdV_XZNwPtaEGqyUqErTJ4LJUwlgOn3tul_doV3WKZA` para Organico/Banco de Dados, `17uXnW7B3OoyGRgnJUtlV59S_JvaxyZe7A9R8PAJ900E` para CRM).
- Parse Body3 corrigido: prioridade de picks atualizada, `pergunta_adicional` lida do payload ou montada como fallback.
- Webhook path corrigido de `DiagnosticoAds` para `Diagnostico-organico` no JSON.

**Teste final:** POST com payload completo retornou `200 OK`. Nome, email, WhatsApp e `Pergunta adicional` confirmados nas 3 planilhas.

### Outros ajustes

- Webhook testado via POST — retornou `200 OK` com `{"message":"Workflow was started"}`. Endpoint confirmado ativo: `https://n8n.srv1095468.hstgr.cloud/webhook/Diagnostico-organico`.
- `vercel.json` corrigido: adicionada regra de roteamento `"src": "/(.*)", "dest": "/ads.html"` para resolver erro 404 no Vercel (Vite gera `dist/ads.html`, não `dist/index.html`).
- LICENSE: email de contato atualizado para `souza.codes@gmail.com`.

## 2026-05-25

- Migração de React/TSX para HTML/CSS/JS puro concluída. Pasta `src/` removida.
- Estrutura espelhada do projeto `lead-diagnostico`.
- Conteúdo textual alinhado ao copy do site publicado (`diagnosticoads.metodop4.com.br`).
- Seção "Especialistas" removida (`<section id="especialistas">`).
- Projeto reorganizado: removidos arquivos duplicados e temporários da raiz, `public/` limpa de arquivos órfãos do React antigo.
- `vite.config.ts` simplificado: entry `index` gera `dist/index.html` direto, sem postbuild.
- `.gitignore` atualizado: exclui `index.html` e `ads-assets/` gerados no build.
- Hero centralizado: título, subtítulo e botão centralizados via CSS.
- `<br>` removidos do título do hero — texto agora flui naturalmente sem quebras forçadas.
- Automação e rastreamento atualizados:
  - Funil alterado de `DiagnosticoAds` para `diagnostico-organico` (em `ads.html` e no Parse Body do N8N).
  - Tracking melhorado: captura agora inclui `referrer` (domínio de origem), `page_url` e `utm_content` além dos UTMs anteriores. `utm_source` é inferido do referrer quando não há parâmetro na URL.
  - `handleSubmit` corrigido: proteção anti double-submit via `btn.dataset.sending`, `sendBeacon` como método principal (funciona mesmo durante redirect/unload), `fetch` como fallback silencioso.
  - Payload alinhado com os campos esperados pelo N8N: `Nome completo`, `E-mail`, `WhatsApp`, `Confirmar WhatsApp`, `Quanto você investe...`, `Em quais canais`, `Data de entrada de leads`, `Hora`, `Funil`.
  - N8N atualizado: 3 planilhas em paralelo na mesma spreadsheet (`17uXnW7B3OoyGRgnJUtlV59S_JvaxyZe7A9R8PAJ900E`):
    - **Organico** — todos os campos, automação de páginas orgânicas (Data, Hora, Nome, Email, WhatsApp, Confirmar WhatsApp, Investimento, Canais, Funil, Channel, Source, Medium, Campaign, Content, Referrer, Page URL, Timestamp).
    - **Banco de Dados** — todos os campos idênticos ao Organico, funciona como banco de dados bruto centralizado.
    - **CRM Geral** — visão de CRM; as perguntas "Quanto você investe?" e "Em quais canais?" são combinadas em uma única coluna `Pergunta adicional` (ex.: `Investimento: R$500/mês | Canais: Shopee, Amazon`). Colunas: Data, Hora, Nome, Email, WhatsApp, Confirmar WhatsApp, Pergunta adicional, Funil, Channel, Source, Medium, Campaign, Timestamp.
  - Parse Body do N8N corrigido: lê `confirmar_whatsapp` / `whatsapp_confirmacao`, `investimento_mensal`, `canais_marketplace` — compatível com formatos antigo e novo.
  - JSON exportável salvo em `docs/n8n-diagnostico-organico.json` — importar no N8N via "Import workflow".
- Documento de padrão criado em `docs/PADRAO-AUTOMACAO-TRACKING.md` com template de código e prompt reutilizável para novas páginas.
- Script Google Apps Script criado em `docs/setup-organico.gs`: cria aba "Organico" com 35 colunas exatas, 3 grupos de cor no cabeçalho, validações por dropdown, formatação condicional (Situação, MQL, Agendado), zebrado, filtro, congelamento de linha e colunas, proteção de aviso.
- Script Google Apps Script criado em `docs/setup-banco-de-dados.gs`: cria aba "Banco de Dados" com 17 colunas, notas nos cabeçalhos, validações, formatação condicional na coluna Channel, zebrado e proteção.
- N8N Sheet: Organico — mapeamento corrigido para usar nomes reais das colunas da planilha (`Entrada leads`, `Qual seu e-mail?`, `Qual o seu WhatsApp?`, `Confirme seu WhatsApp`). Campos "Quanto você investe?" e "Em quais canais" consolidados na coluna `Pergunta adicional` (formato: `Investimento: X | Canais: Y`), igual ao CRM Geral.
- Webhook testado 3x via POST no endpoint `https://n8n.srv1095468.hstgr.cloud/webhook/Diagnostico-organico` — todos retornaram `200 OK` com `{"message":"Workflow was started"}`.

## SEO — Análise e Correções (2026-05-25)

### Problemas críticos encontrados e corrigidos

- **URL canônica errada**: estava apontando para `https://metodop4.com.br/diagnostico-ads/` enquanto o domínio real é `https://diagnosticoads.metodop4.com.br`. Corrigido em `<link rel="canonical">`, `og:url`, `og:image`, `twitter:image` e schema.org.
- **Title fraco**: `DiagnósticoAds` (12 chars, sem palavras-chave). Corrigido para `Diagnóstico Gratuito de Ads — Mercado Livre, Shopee e Amazon | Método P4` (~72 chars).
- **Meta description genérica**: expandida com proposta de valor clara e informação de tempo (1 hora, 2 estrategistas).
- **Nomes de arquivo péssimos para SEO**: `ChatGPT Image 22 de mai. de 2026, 10_16_41.png` renomeado para `assets/video-thumb-diagnostico.png`. Referências no HTML atualizadas.
- **Imagens de fundo removidas do CSS**: `09_03_10.png` (hero) e `09_04_39.png` (especialistas) não existem e não serão usadas — `url()` removido do CSS. Seções usam `background-color: var(--dark)` como fundo sólido.
- **Preload corrigido**: agora aponta para `assets/video-thumb-diagnostico.png` (arquivo que existe).
- **Alt text do video thumb**: melhorado para incluir palavras-chave.

### Problemas identificados (não críticos / ação pendente)

- `assets/og-image.png` não existe — compartilhamentos em redes sociais não terão preview. Criar uma imagem 1200×630px e salvar nesse caminho.
- `assets/hero-bg.png` e `assets/especialistas-bg.png` precisam ser criados/colocados em `assets/`.
- `public/robots.txt` criado: `Allow: /` + referência ao sitemap.
- `public/sitemap.xml` criado com a URL canônica e `priority: 1.0`. Serão copiados para `dist/` no build do Vite.
- Hierarquia de headings: footer usa `<h4>` sem `<h3>` intermediário (sem impacto real no SEO, mas afeta acessibilidade).
- Font Awesome carregado de CDN externo — considerar auto-hospedar para eliminar dependência externa.
- Documento de padrão de SEO criado em `docs/PADRAO-SEO.md`: template de `<head>`, schema.org, robots.txt, sitemap, regras de nomenclatura de imagens, checklist e prompt reutilizável para novas páginas.

## Ajustes finais e deploy (2026-05-25)

### Conteúdo
- "2 especialistas" substituído por "Time P4" em todos os lugares (value-card, FAQ body, schema.org) — contexto correto para equipe variável.
- Meta description e respostas do FAQ atualizadas: "dois estrategistas" → "nosso time de especialistas" / "pelo time de especialistas de marketplace do Método P4".

### Automação
- URL do webhook corrigida em `ads.html`: `webhook/DiagnosticoAds` → `webhook/Diagnostico-organico`.
- URL fixa confirmada: `https://n8n.srv1095468.hstgr.cloud/webhook/Diagnostico-organico`.

### Visual
- Hero: fundo ajustado para cinza-verde suave (não estourado).
- Nav: agora com fundo escuro semi-transparente por padrão (resolve invisibilidade dos ícones brancos no hero claro).
- Glow central, acentos nos cantos e `border-bottom` adicionados ao hero para profundidade visual.

### Responsividade mobile
- Removido `max-width: 18ch` do h1 no breakpoint 480px (limitava e cortava o título).
- `hero-cta-group`: `align-items: stretch` + botão `width: 100%` no 480px, centralizado no 768px.
- `hero-pills`: centralizado com `justify-content: center` no 768px.
- `hero-cta-hint`: centralizado no 768px.

### Deploy Hostgator
- Build gerado com `npm run build` → `dist/`.
- Pasta `diagnostico-organico-tay/` criada com conteúdo de `dist/` + `ads.html` renomeado para `index.html`.
- `.htaccess` corrigido: referências antigas a `ads-assets/` e `ads.html` removidas, `RewriteBase` atualizado para `/diagnostico-organico-tay/`, cache de assets adicionado.
- **Para subir no Hostgator**: fazer upload de toda a pasta `diagnostico-organico-tay/` via FTP ou cPanel File Manager para dentro de `public_html/`.

### Limpeza de arquivos (2026-05-25)

**Apagados (não referenciados / obsoletos):**
- `assets/`: amazon.png, magalu.png, meli.png, shein.png, shopee.png, tiktok.png
- `fonts/`: Sora-ExtraLight.ttf, Sora-Thin.ttf, Sora-VariableFont_wght.ttf, OFL.txt, README.txt
- `public/logos/`: pasta inteira (amazon.png, magalu.png, mercado-livre.svg, shopee.png)
- `public/htaccess-hostgator.txt`: substituído pelo `.htaccess` correto em `diagnostico-organico-tay/`
- `docs/`: ARCHITECTURE.md, DIAGRAMS.md, ENGINEERING_REVIEW.md, OPERATIONS.md, style.css (todos templates genéricos)
- Raiz: `CHANGELOG.md`, `.env.example` (desatualizados, substituídos pelo relatorio.md)

**README.md reescrito**: reflete estrutura atual do projeto (HTML puro, automação N8N, deploy Hostgator, documentação).
