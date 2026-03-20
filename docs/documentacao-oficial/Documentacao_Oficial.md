# Documentacao Oficial - DiagnosticoAds

Projeto: DiagnosticoAds  
Data: 20/03/2026  
Responsavel tecnico: Taynara Correia de Souza

## 1. Visao geral
O DiagnosticoAds e uma landing page de alta conversao voltada a captacao de leads para diagnostico estrategico de anuncios em marketplaces. O sistema conduz o usuario por uma sequencia de secoes informativas e de prova social, culminando em um formulario que registra o lead em automacao n8n e redireciona para o agendamento no Google Calendar.

## 2. Objetivo do sistema
Garantir uma experiencia de conversao clara e objetiva, capturando dados essenciais do lead, registrando a origem do trafego e direcionando o usuario ao agendamento.

## 3. Escopo
- Renderizacao da landing page em SPA.
- Captura de dados do formulario.
- Captura e persistencia de origem (channel/UTM) no navegador.
- Envio de dados ao webhook n8n.
- Redirecionamento para agendamento.

Fora de escopo:
- Autenticacao de usuarios.
- Back-end proprio.
- Armazenamento local de dados sensiveis.
- Painel administrativo.

## 4. Requisitos funcionais
- Rolagem suave ate o formulario ao clicar no CTA principal.
- Captura obrigatoria de nome, e-mail e WhatsApp.
- Selecao obrigatoria de pelo menos um marketplace.
- Captura da origem via channel/UTM e referrer.
- Envio do payload ao webhook do n8n.
- Redirecionamento ao Google Calendar apos tentativa de envio.

## 5. Requisitos nao funcionais
- Responsividade completa para desktop e mobile.
- Baixa latencia de envio do formulario.
- Compatibilidade com navegadores modernos.
- Codigo organizado por camadas (sections, services, styles).

## 6. Tecnologias
- React 18
- TypeScript
- Vite
- Tailwind CSS v4
- PostCSS
- n8n
- Google Sheets
- Google Calendar

## 7. Fluxo funcional
1. Usuario acessa a landing page.
2. Origem (channel/UTM) e capturada e persistida.
3. Usuario navega pelas secoes e clica no CTA.
4. Usuario envia o formulario.
5. Payload com tracking e enviado ao webhook.
6. Usuario e redirecionado ao agendamento.

## 8. Estrutura de codigo
- src/App.tsx: composicao das secoes.
- src/components/sections: secoes visuais.
- src/styles: estilos globais.
- public/tracking.js: captura de origem (channel/UTM) para paginas estaticas.
- public/htaccess-hostgator.txt: regras para URLs limpas por canal.
- docs/integracao/INTEGRACAO_N8N.md: documentacao da automacao.

## 9. Tracking de origem
- URLs limpas por canal (ex.: `/youtube`, `/instagram`) mapeadas para `?channel=...`.
- Parametros suportados: `channel`, `utm_source`, `utm_medium`, `utm_campaign`.
- Fallback por `document.referrer` e valores padrao (`direto`, `none`).
- Persistencia em `localStorage` sem sobrescrever sessoes ja iniciadas.
- Campos enviados no lead: `channel`, `source`, `medium`, `campaign`, `timestamp`.

## 10. Operacao e build
Instalacao e execucao:
```bash
npm install
npm run dev
```
Build de producao:
```bash
npm run build
```

## 11. Licenca e propriedade
Uso restrito conforme arquivo LICENSE. O projeto e propriedade de Taynara Correia de Souza.
