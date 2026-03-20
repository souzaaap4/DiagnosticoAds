# Historico de Versoes - DiagnosticoAds

Projeto: DiagnosticoAds  
Data: 19/03/2026  
Responsavel tecnico: Taynara Correia de Souza

## Versao 1.1.4 - 20/03/2026
- Reintroducao do tracking de origem (channel/UTM) com persistencia em localStorage.
- URLs limpas por canal via .htaccess e script public/tracking.js.
- Lead passa a enviar channel/source/medium/campaign/timestamp para o n8n.
- Ajuste no input de WhatsApp para melhor edicao em mobile.

## Versao 1.1.3 - 20/03/2026
- Remocao completa do tracking e captura de UTMs no front-end.
- Exclusao dos scripts e servicos de tracking (React e HTML estatico).
- Documentacao ajustada para fluxo apenas de leads.

## Versao 1.1.2 - 19/03/2026
- Tracking padronizado com payload source/medium/campaign/content/event/url/timestamp.
- Script de tracking para HTML estatico em public/tracking.js.
- Documentacao atualizada para webhook /webhook/track.

## Versao 1.1.1 - 19/03/2026
- Documentacao atualizada para leads e tracking via n8n.
- Comentarios revisados para refletir webhook de tracking.
- Ajustes de configuracao para webhook de tracking em producao.

## Versao 1.1.0 - 19/03/2026
- Implementacao do sistema de tracking com captura de UTMs.
- Registro de eventos page_load, schedule_click, form_submit e schedule_redirect.
- Servico centralizado de tracking em src/services/tracking.ts.
- Limpeza de dependencias nao utilizadas no package.json.

## Versao 1.0.0 - 19/03/2026
- Reorganizacao da estrutura de src (secoes e App na raiz).
- Atualizacao do redirecionamento de agendamento para Google Calendar.
- Remocao de arquivos e componentes duplicados.
- Documentacao tecnica revisada.

## Versao 0.1.0 - 05/03/2026
- Primeira versao funcional da landing page.
- Integracao inicial com n8n e Google Sheets.
- Definicao das secoes principais e layout responsivo.
