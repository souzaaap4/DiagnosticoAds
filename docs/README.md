# DiagnósticoAds — Landing Page

Landing page de alta conversão para diagnóstico estratégico de anúncios em marketplaces (Mercado Livre, Shopee e Amazon).  
Projeto focado em clareza da proposta, prova social e conversão via formulário com CTA direto.

---

## Visão Geral
Esta página foi desenhada para conduzir o usuário por uma sequência objetiva:
proposta → autoridade → explicação → escassez → formulário → agradecimento.

## Funcionalidades
- CTA principal com scroll suave até o formulário
- Seção “O que será analisado” com pontos claros e objetivos
- Área de autoridade com especialistas e marketplaces atendidos
- Vídeo explicativo com capa personalizada
- Formulário com redirecionamento ao Calendly
- Layout responsivo para mobile e desktop

## Stack
- React + TypeScript
- Vite
- Tailwind CSS (utilitários)

---

## Como rodar localmente

1. Instale as dependências:
```bash
npm install
```

2. Inicie o servidor de desenvolvimento:
```bash
npm run dev
```

3. Build de produção:
```bash
npm run build
```

4. Pré-visualização do build:
```bash
npx vite preview
```
---

## Personalizações rápidas

- **URL do Calendly**: `src/app/components/FormSection.tsx`
- **Capa do vídeo**: `src/assets/video-capa.png`
- **Foto dos especialistas**: `src/assets/especialistas.png`
- **Logos dos marketplaces**: `src/assets/logos/`
- **Cores e fundo**: `src/styles/theme.css` (`--lp-*`)

---

## Documentação técnica

A documentação completa de integração n8n está em:
- `docs/INTEGRACAO_N8N.md`

---

## Estrutura relevante

- `src/app/App.tsx`
- `src/app/components/HeroSection.tsx`
- `src/app/components/AnalysisSection.tsx`
- `src/app/components/AuthoritySection.tsx`
- `src/app/components/ScarcitySection.tsx`
- `src/app/components/FormSection.tsx`
- `src/app/components/FinalCTASection.tsx`
- `src/styles/theme.css`

---

## Responsividade
O layout foi ajustado para mobile e desktop com:
- seções em tela cheia
- tipografia fluida
- espaçamento consistente entre blocos

---

## Autoria
Taynara Souza

---

## Licença
Este projeto está sob a licença MIT. Consulte o arquivo `LICENSE`.
