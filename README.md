# LP DiagnósticoAds

> Landing page para captação e qualificação de leads para o diagnóstico gratuito de Ads em marketplaces — tráfego orgânico.

![Status](https://img.shields.io/badge/status-ativo-22c55e)
![Frontend](https://img.shields.io/badge/frontend-HTML%2FCSS%2FJS-1f6feb)
![Build](https://img.shields.io/badge/build-Vite-646cff)
![Automação](https://img.shields.io/badge/automacao-n8n%20Webhook-0f766e)
![Deploy](https://img.shields.io/badge/deploy-HostGator%2FcPanel-7c3aed)

🌐 **[Ver página ao vivo](https://diagnosticoads.metodop4.com.br/)** · 📁 **[Repositório GitHub](https://github.com/taysouzaa/DiagnosticoAds)**

README de apresentação para GitHub.

## Visão do Projeto

O **LP DiagnósticoAds** foi construído para capturar e qualificar leads de tráfego orgânico para a sessão de diagnóstico gratuita de Ads do Método P4, conectando conteúdo, coleta de dados e automação em um fluxo único.

### O que o sistema resolve

- Evita perda de lead entre formulário e automação.
- Centraliza captação com validação de dados e qualificação por investimento mensal e canais utilizados.
- Preserva origem de tráfego (UTM e referrer) para análise de canais orgânicos.
- Classifica automaticamente o lead como MQL (qualificado) ou não qualificado.

## O Que Foi Desenvolvido

### 1. Captação e Tracking
- Captura de origem (`channel`, `source`, `medium`, `campaign`, `content`, `referrer`, `page_url`) via script de tracking first-touch.
- Persistência de parâmetros UTM no navegador para reaproveitamento no submit.

### 2. Formulário de Qualificação
- Captura de nome, e-mail, WhatsApp e confirmação.
- Perguntas de qualificação: **investimento mensal em ads** e **canais de marketplace utilizados**.
- Validação local de consistência de telefone (WhatsApp e confirmação).
- Interface responsiva para mobile e desktop.

### 3. Lógica de Qualificação (MQL)
- `MQL = "Sim"` quando: alto investimento mensal **e** canais específicos (sem "outros" genéricos).
- `MQL = "Não"` para leads com baixo investimento ou perfil fora do ideal.
- Campo enviado no payload para o webhook n8n.

### 4. Integração com Automação
- Envio de payload para webhook n8n (`/webhook/Diagnostico-organico`).
- Deduplicação por telefone no n8n antes de gravar na planilha.
- Gravação simultânea na aba **organico** e na aba **banco de dados** do Google Sheets.

### 5. Jornada de Conversão
- Sequência de seções orientada à decisão: hero → benefícios → vídeo → quem somos → FAQ.
- Build otimizado com Vite — output em `dist/` para upload no HostGator.

## Stack Técnica

- **Frontend:** HTML5, CSS3, JavaScript (vanilla + Vite build)
- **Build:** Vite (`vite.config.ts`)
- **Integração:** Webhook n8n via **proxy PHP** server-side (`api/lead-proxy.php`) — o segredo do webhook fica no servidor, fora do JS público
- **SEO:** `sitemap.xml`, `robots.txt`
- **Deploy:** HostGator/cPanel — upload manual do conteúdo de `dist/`

## Arquitetura (Resumo)

| Camada | Responsabilidade |
| --- | --- |
| `ads.html` | LP principal (fonte de desenvolvimento) |
| `dist/` | Build gerado pelo Vite — conteúdo para upload |
| `assets/` | Imagens e ícones da LP |
| `fonts/static/` | Fontes Sora utilizadas no build |
| `public/` | Arquivos estáticos copiados direto para `dist/` |
| `docs/` | Workflows n8n, scripts e documentação técnica |
| `TECNICO.md` | Guia técnico de manutenção |

## Funcionamento do Sistema

1. Usuário acessa a LP via canal orgânico (busca, redes sociais, indicação).
2. Tracking first-touch inicializa e persiste UTMs.
3. Usuário preenche formulário com dados e informações de investimento.
4. Aplicação calcula MQL e monta payload com dados + tracking.
5. Payload é enviado para o webhook n8n.
6. n8n deduplica por telefone consultando o banco de dados.
7. Lead é gravado nas abas **organico** e **banco de dados** do Google Sheets.

```mermaid
flowchart TD
    subgraph LP["🌐 Landing Page (navegador)"]
        IN["Inputs do formulário<br/>nome · e-mail · WhatsApp<br/>Investimento + Canais<br/>+ tracking: utm_* · fbclid · src · sck · a_id"]
    end
    subgraph SRV["🔒 Servidor HostGator (cPanel)"]
        PHP["api/lead-proxy.php<br/>anexa header x-p4-webhook-secret"]
    end
    subgraph WF["⚙️ n8n — workflow LP-diagnostico"]
        WH(["▶ TRIGGER · Webhook<br/>POST /webhook/Diagnostico-organico · headerAuth"])
        PARSE["Parse<br/>normaliza telefone · recalcula MQL no servidor<br/>timestamp do servidor · tracking completo"]
        VAL["Validar campos obrigatórios"]
        DVAL{"Lead válido?"}
        READ["Ler banco de dados<br/>HTTP → Google Sheets API · só coluna E"]
        REF["Reformatar leitura"]
        DUP["Filtrar duplicata<br/>dedup por WhatsApp"]
        DDUP{"Duplicata?"}
        FMT["Format lead<br/>calcula Orgânico? (sim/não)"]
        LCRM["Ler CRM"]
        BDUP["Buscar duplicata CRM<br/>e-mail → Telefone 1"]
        DCRM{"Existe no CRM?"}
        PREP["Preparar arquivo"]
        ARC["Arquivar CRM antigo"]
        UPD["Atualizar CRM (in-place)<br/>Funil · Data · MQL · Pergunta"]
        FCRM["Format CRM"]
        NEW["Criar lead no CRM<br/>Telefone 1 · Orgânico?"]
        DESC["Formatar descarte"]
        REG["Registrar descarte"]
    end
    subgraph SHEETS["📊 Google Sheets · credencial Cockpit"]
        SBD[("banco de dados<br/>100% dos leads")]
        SSEG[("aba Organico")]
        SARC[("Archived Leads")]
        SDESC[("Descarte")]
    end
    subgraph CRMBOX["📇 CRM comercial · credencial Cockpit"]
        CRMDB[("aba CRM<br/>Telefone 1 · Orgânico?")]
    end
    subgraph OUT["🔌 Integrações e saídas"]
        GMAIL["✉️ Gmail<br/>alerta de descarte"]
        CONS["p4-consultoria<br/>2ª instância n8n"]
        ERR[["🚨 Error Workflow<br/>Alerta de Erro - Leads"]]
    end

    IN --> PHP
    IN -. 2º destino .-> CONS
    PHP --> WH --> PARSE --> VAL --> DVAL
    DVAL -- inválido --> DESC
    DVAL -- válido --> READ --> REF --> DUP --> DDUP
    DDUP -- duplicata --> DESC
    DDUP -- novo --> FMT
    FMT --> SBD
    FMT --> SSEG
    FMT --> LCRM --> BDUP --> DCRM
    DCRM -- existe --> PREP --> ARC
    ARC --> SARC
    ARC --> UPD --> CRMDB
    DCRM -- novo --> FCRM --> NEW --> CRMDB
    DESC --> REG --> SDESC
    REG --> GMAIL
    READ -. exceção .-> ERR
    SBD -. exceção .-> ERR
    CRMDB -. exceção .-> ERR
```

## Diferenciais de Engenharia

- Tracking first-touch desacoplado da lógica de formulário.
- Qualificação multivariável calculada no frontend (investimento + canais).
- Deduplicação server-side no n8n para evitar leads duplicados.
- Pipeline de build com Vite para versão otimizada de produção.

## Estrutura do Projeto

```text
.
├─ assets/
│  ├─ 01.png
│  ├─ 03.png
│  ├─ equipe-p4.jpg
│  ├─ equipe-p4-reuniao.jpg
│  └─ video-thumb-diagnostico.webp
├─ docs/
│  ├─ n8n-diagnostico-organico.json
│  ├─ n8n-workflow-diagnostico-organico.json
│  ├─ PADRAO-AUTOMACAO-TRACKING.md
│  ├─ PADRAO-SEO.md
│  ├─ relatorio.md
│  ├─ setup-banco-de-dados.gs
│  └─ setup-organico.gs
├─ fonts/
│  └─ static/
│     ├─ Sora-Bold.ttf
│     ├─ Sora-ExtraBold.ttf
│     ├─ Sora-Light.ttf
│     ├─ Sora-Medium.ttf
│     ├─ Sora-Regular.ttf
│     └─ Sora-SemiBold.ttf
├─ public/
│  ├─ htaccess-hostgator.txt
│  ├─ robots.txt
│  └─ sitemap.xml
├─ ads.html
├─ package.json
├─ vite.config.ts
├─ TECNICO.md
└─ LICENSE
```

## Build

```bash
npm install
npm run build
```

## Deploy

- **HostGator/cPanel:** upload manual do conteúdo de `dist/` via Gerenciador de Arquivos ou FTP.

## Automação de leads (estado atual — 2026-07)

O lead **não é mais enviado direto do navegador ao n8n**. A página chama o **proxy PHP**
`api/lead-proxy.php` (mesmo domínio, sem nenhum segredo); o proxy anexa o header de autenticação
`x-p4-webhook-secret` **no servidor** e repassa ao webhook n8n `POST /webhook/Diagnostico-organico`.

O workflow n8n **`LP-diagnostico`** executa o pipeline completo (funil orgânico → aba **Organico**):

- **Valida** os obrigatórios e **deduplica por WhatsApp** — sem descarte silencioso.
- Grava 100% dos leads em `banco de dados` e na aba de segmentação **Organico** (classificação por
  funil pareado).
- Alimenta o **CRM comercial**: dedup por e-mail → `Telefone 1`, arquiva o registro antigo em
  `Archived Leads` e atualiza in-place, ou cria um novo — preenchendo a coluna **`Orgânico?`**
  (`sim`/`não`) conforme a origem do lead.
- **Recalcula MQL no servidor** (nunca confia no cliente) e usa **timestamp do servidor**.
- Captura tracking completo: `utm_source/medium/campaign/content/term/id`, `fbclid`, `src`, `sck`,
  `a_id`, `channel`, `referrer`, `page_url`.
- Registra descartes (inválido/duplicata) na aba `Descarte` e **notifica por e-mail** (Gmail).
- Erros reais caem no **Error Workflow** `Alerta de Erro - Leads`.

📄 Documentação detalhada da automação: a **Sticky Note "Documentação da automação"** dentro do
workflow `LP-diagnostico` no n8n, e — quando presente — o `automation/README.md` do projeto.

## Licença

A licença **permanece inalterada** e segue os termos proprietários definidos em [LICENSE](./LICENSE).
