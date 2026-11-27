# Agência BF — Portfólio de sites cinematográficos

Site estático (HTML + CSS + JS puro) com GSAP, ScrollTrigger e Lenis (já incluídos em `js/vendor/`, sem CDN).

## Rodar localmente

O `js/main.js` usa módulos ES, então **não abre com duplo clique** (`file://`). Use um servidor local:

```
cd agencia-bf
python -m http.server 8000
```

Abra http://localhost:8000. Para publicar, suba a pasta inteira na Vercel, Netlify ou Hostinger (não há build).

## Os 3 níveis

A página mostra Nível 1 (Essencial, R$ 1.500), Nível 2 (Cinematográfico, R$ 3.500) e Nível 3 (Sistema Web, R$ 6.000).
Textos, benefícios, valores e mensagens de WhatsApp de cada nível ficam no `index.html` (assim o Google lê e funciona sem JavaScript).
Ao mudar um valor, altere também o bloco `mapa`, no começo da seção.

- **Nível 1:** a prévia é a imagem `assets/niveis/essencial-referencia.jpg`.
- **Nível 2:** sites reais em iframe; só o selecionado é carregado.
- **Nível 3:** vídeo `assets/niveis/portal-bf.mp4` (recorte da tela, sem áudio) e capa `portal-bf-poster.webp`.

## Como adicionar um novo site no Nível 2

1. Salve um print do site em `assets/portfolio/nome.webp` (vira a miniatura do botão).
2. Em `js/data.js`, acrescente um objeto na lista `sites`:

```js
{
  nome: "Nome do Cliente",
  tipo: "Tipo de negócio · Cidade-UF",
  descricao: "Uma frase curta sobre o site.",
  url: "https://link-do-site.com.br",
  imagem: "assets/portfolio/nome-do-cliente.webp",
  video: "assets/portfolio/nome-do-cliente.mp4"
},
```

O `video` só é usado se o site bloquear iframe: marque `bloqueiaIframe: true` (o navegador não avisa a página sobre o bloqueio, então teste ao adicionar). `tools/gerar-previa.mjs` ajuda a gravar.

## Links (WhatsApp e Instagram)

Estão direto no `index.html` (assim funcionam mesmo sem JavaScript). Para trocar o número, procure por `5551999871257`.

## Antes de publicar

- **Imagem de compartilhamento (WhatsApp):** em `index.html`, troque `content="assets/og.jpg"` por o endereço completo, por exemplo `https://seudominio.com.br/assets/og.jpg`. O WhatsApp só lê endereço absoluto.
- Se quiser, adicione `<link rel="canonical" href="https://seudominio.com.br/">`.

## Estrutura

```
index.html
assets/        logo (moeda), favicon, og.jpg e prints em portfolio/
css/style.css
js/data.js     sites do Nível 2 (edite aqui)
js/main.js     animações e renderização
js/vendor/     gsap, ScrollTrigger e lenis
```

## Acessibilidade e movimento

Com `prefers-reduced-motion: reduce` ficam desligados: abertura, Lenis, parallax, grão animado, poeira, cursor e o início automático do vídeo do Nível 3. Só restam fades simples.
