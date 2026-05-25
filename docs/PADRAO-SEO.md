# Padrão de SEO — Método P4

## Visão geral

Cada landing page deve ter:
- `<head>` completo com title, description, canonical, OG e Twitter
- Schema.org (dados estruturados) compatível com o tipo de página
- `public/robots.txt` e `public/sitemap.xml` apontando para o domínio correto
- Nomes de arquivo de imagem sem espaços, datas ou termos genéricos

---

## 1. Bloco `<head>` padrão

Cole no `<head>` de cada página. Substitua os valores marcados com `[...]`.

```html
<!-- ── Básico ── -->
<title>[Palavra-chave principal] — [Benefício ou diferencial] | Método P4</title>
<meta name="description" content="[1-2 frases com proposta de valor clara. Inclua o que o usuário vai receber, como e em quanto tempo. 120–155 caracteres.]">
<meta name="robots" content="index, follow">
<meta name="author" content="Método P4">
<meta name="keywords" content="[5-10 termos relevantes separados por vírgula]">

<!-- ── Canonical ── -->
<link rel="canonical" href="https://[subdominio-ou-path].metodop4.com.br">

<!-- ── Open Graph (WhatsApp, Facebook, LinkedIn) ── -->
<meta property="og:type"        content="website">
<meta property="og:url"         content="https://[subdominio-ou-path].metodop4.com.br">
<meta property="og:title"       content="[mesmo do <title>]">
<meta property="og:description" content="[mesmo do <meta description>]">
<meta property="og:image"       content="https://[subdominio-ou-path].metodop4.com.br/assets/og-image.png">
<meta property="og:image:width"  content="1200">
<meta property="og:image:height" content="630">
<meta property="og:locale"      content="pt_BR">
<meta property="og:site_name"   content="Método P4">

<!-- ── Twitter / X ── -->
<meta name="twitter:card"        content="summary_large_image">
<meta name="twitter:title"       content="[mesmo do <title>]">
<meta name="twitter:description" content="[mesmo do <meta description>]">
<meta name="twitter:image"       content="https://[subdominio-ou-path].metodop4.com.br/assets/og-image.png">

<!-- ── Favicons ── -->
<link rel="icon" type="image/png" href="assets/favicon.png">
<link rel="apple-touch-icon"      href="assets/favicon.png">
```

### Regras do `<title>`
| Regra | Detalhe |
|---|---|
| Comprimento | 50–65 caracteres |
| Estrutura | `[Palavra-chave] — [Diferencial] \| Método P4` |
| Palavra-chave | No início, o que o usuário busca |
| Diferencial | Gratuito, em 1 hora, garantido etc. |

### Regras do `<meta description>`
| Regra | Detalhe |
|---|---|
| Comprimento | 120–155 caracteres |
| Conteúdo | O que o usuário recebe, como funciona, diferencial |
| Evitar | "Saiba mais", "Clique aqui", termos vagos |

---

## 2. Schema.org — Service (padrão para LP de oferta)

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Service",
  "name": "[Nome do serviço]",
  "description": "[Mesma descrição da meta description]",
  "provider": {
    "@type": "Organization",
    "name": "Método P4",
    "url": "https://metodop4.com.br/",
    "sameAs": [
      "https://www.instagram.com/metodop4/",
      "https://www.linkedin.com/company/m%C3%A9todo-p4/",
      "https://www.youtube.com/@gabriel_pim"
    ]
  },
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "BRL",
    "availability": "https://schema.org/LimitedAvailability",
    "category": "Free"
  },
  "url": "https://[subdominio-ou-path].metodop4.com.br"
}
</script>
```

---

## 3. Schema.org — FAQPage (adicionar se a página tiver seção de perguntas)

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "[Pergunta exatamente como aparece na página]",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "[Resposta completa em texto corrido, sem HTML]"
      }
    }
    // repita para cada pergunta do FAQ
  ]
}
</script>
```

> Cada pergunta do FAQ que tiver schema.org pode aparecer diretamente na página de resultados do Google (rich result), aumentando o CTR.

---

## 4. Estrutura de headings

```
h1 — 1 único por página, com a palavra-chave principal
  h2 — seções principais (benefícios, como funciona, FAQ...)
    h3 — subseções quando necessário
```

- **Nunca pular níveis** (ex: h2 → h4 direto)
- **h1 deve conter a palavra-chave mais importante da página**
- Pode ser diferente do `<title>` mas deve ser complementar

---

## 5. Imagens — regras de nomenclatura

| Uso | Nome do arquivo |
|---|---|
| Preview social (OG) | `og-image.png` (1200×630px obrigatório) |
| Hero / fundo de seção | `hero-bg.jpg` ou `hero-bg.png` |
| Thumbnail de vídeo | `video-thumb-[nome-da-pagina].png` |
| Logo / marca | `logo-metodop4.png` |
| Ícones de marketplace | `logo-mercado-livre.png`, `logo-shopee.png` etc. |
| Foto de autoridade | `foto-[nome]-metodop4.jpg` |

**Regras:**
- Sem espaços, acentos ou caracteres especiais no nome
- Sem datas, horas ou IDs gerados automaticamente
- Sempre em minúsculas com hifens
- Adicionar `alt` descritivo em toda `<img>`

---

## 6. `robots.txt` (em `public/robots.txt`)

```
User-agent: *
Allow: /

Sitemap: https://[subdominio-ou-path].metodop4.com.br/sitemap.xml
```

---

## 7. `sitemap.xml` (em `public/sitemap.xml`)

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://[subdominio-ou-path].metodop4.com.br</loc>
    <lastmod>[AAAA-MM-DD]</lastmod>
    <changefreq>monthly</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>
```

> Atualizar `<lastmod>` sempre que houver mudança relevante de conteúdo.

---

## 8. Checklist por página nova

- [ ] `<title>` entre 50–65 chars com palavra-chave no início
- [ ] `<meta description>` entre 120–155 chars com proposta de valor
- [ ] `<link rel="canonical">` apontando para o domínio exato em produção
- [ ] OG tags: `og:url`, `og:title`, `og:description`, `og:image` todos preenchidos
- [ ] `og:image` → arquivo `assets/og-image.png` existente (1200×630px)
- [ ] Twitter tags preenchidas (copiar dos OG)
- [ ] Schema.org `Service` com URL correta
- [ ] Schema.org `FAQPage` se houver seção de perguntas
- [ ] `h1` único, com palavra-chave, sem `<br>` forçados
- [ ] Todas as `<img>` com `alt` descritivo
- [ ] Nomes de arquivo sem espaços, datas ou "ChatGPT"
- [ ] `public/robots.txt` criado com URL do sitemap
- [ ] `public/sitemap.xml` criado com URL canônica e `lastmod` correto
- [ ] Verificar no [Google Rich Results Test](https://search.google.com/test/rich-results) após deploy

---

## 9. Prompt para IA — implementar SEO em nova página

```
Estou criando uma landing page em HTML puro para o Método P4.
Preciso implementar o padrão SEO completo da empresa.

## Dados da página
- URL em produção: [URL COMPLETA AQUI, ex: https://leadorganico.metodop4.com.br]
- Nome do serviço: [ex: Lead Orgânico]
- Palavra-chave principal: [ex: captação de leads orgânicos para marketplace]
- Diferencial/benefício principal: [ex: sem investir em anúncios]
- Público-alvo: [ex: vendedores de marketplace que querem escalar sem depender de ads]

## O que preciso
1. Bloco <head> completo com:
   - <title> de 50–65 chars com palavra-chave no início
   - <meta description> de 120–155 chars com proposta de valor
   - <link rel="canonical"> para a URL exata
   - Todas as tags Open Graph (og:type, og:url, og:title, og:description, og:image, og:image:width, og:image:height, og:locale, og:site_name)
   - Tags Twitter (twitter:card, twitter:title, twitter:description, twitter:image)
   - <meta name="robots" content="index, follow">
   - <meta name="author" content="Método P4">

2. Schema.org Service com:
   - name, description, provider (Método P4 com sameAs das redes sociais)
   - offers com price 0 e availability LimitedAvailability
   - url da página

3. Schema.org FAQPage com as seguintes perguntas e respostas:
   [LISTE AS PERGUNTAS E RESPOSTAS AQUI]

4. Conteúdo do robots.txt para public/robots.txt

5. Conteúdo do sitemap.xml para public/sitemap.xml

## Redes sociais do Método P4 (usar nos sameAs)
- Instagram: https://www.instagram.com/metodop4/
- LinkedIn: https://www.linkedin.com/company/m%C3%A9todo-p4/
- YouTube: https://www.youtube.com/@gabriel_pim

## Regras obrigatórias
- og:image aponta para https://[url]/assets/og-image.png (1200×630px)
- Canonical = URL exata de produção (sem barra no final)
- Title nunca repete "Método P4" no início
- Sem meta keywords duplicadas
- robots.txt e sitemap.xml vão em public/ (copiados para dist/ pelo Vite no build)
```

---

## 10. Referência rápida — domínios Método P4

| Página | Domínio |
|---|---|
| DiagnósticoAds (orgânico) | `diagnosticoads.metodop4.com.br` |
| [próxima página] | `[subdominio].metodop4.com.br` |

> Atualizar esta tabela a cada nova página publicada.
