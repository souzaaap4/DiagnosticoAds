# Arquitetura do Sistema - DiagnosticoAds

Projeto: DiagnosticoAds  
Data: 20/03/2026  
Responsavel tecnico: Taynara Correia de Souza

## 1. Visao arquitetural
O sistema adota arquitetura de aplicacao web estatica com renderizacao no cliente. Nao ha back-end proprio. A persistencia de dados ocorre por integracao com n8n e Google Sheets, e o agendamento e realizado via Google Calendar.

## 2. Componentes principais
- Front-end SPA: React + Vite.
- Tracking de origem: script `public/tracking.js` + regras de URL em `.htaccess`.
- Automacao: n8n (webhook).
- Armazenamento: Google Sheets (leads).
- Agendamento: Google Calendar.
- Midia: YouTube embed.

## 3. Estrutura logica
- App.tsx compoe as secoes.
- Sections: Hero, Analysis, Authority, Scarcity, Form.
- Tracking: captura channel/UTM, persiste em localStorage e injeta no payload do lead.

## 4. Fluxo de dados
1. Usuario acessa a pagina.
2. Tracking identifica origem (channel/UTM) e persiste localmente.
3. Usuario interage com CTA e preenche o formulario.
4. Usuario envia formulario; payload inclui tracking e marketplaces.
5. n8n normaliza dados e grava no Google Sheets (leads).
6. Usuario e redirecionado ao Google Calendar.

## 5. Integracoes externas
- n8n: recepcao do payload via webhook.
- Google Sheets: append de linhas (aba de leads).
- Google Calendar: agendamento.
- YouTube: video incorporado.

## 6. Consideracoes de seguranca
- Apenas dados de origem (channel/UTM) sao armazenados localmente.
- Webhook deve ser protegido por configuracao no n8n e hospedagem.
- Envio em text/plain para reduzir erros de CORS.

## 7. Escalabilidade
- Front-end estatico escalavel por CDN.
- Limites operacionais dependem do throughput do n8n e do Google Sheets.

## 8. Observabilidade
- Tracking leve de origem (channel/UTM) enviado junto ao lead.
