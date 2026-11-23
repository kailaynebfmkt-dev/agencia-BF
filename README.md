# Agência BF — Portfólio de sites cinematográficos

Site estático (HTML + CSS + JS puro) com GSAP, ScrollTrigger e Lenis (já incluídos em `js/vendor/`, sem CDN).

## Rodar localmente

O `js/main.js` usa módulos ES, então **não abre com duplo clique** (`file://`). Use um servidor local:

```
cd agencia-bf
python -m http.server 8000
```

Abra http://localhost:8000. Para publicar, suba a pasta inteira na Vercel, Netlify ou Hostinger (não há build).

## Como adicionar um novo site no portfólio

1. Tire prints do site novo, empilhados na vertical (largura 800px), e salve em `assets/portfolio/` como `.webp`. Esse é o print que aparece parado.
   Para a **prévia em movimento** (aparece ao passar o mouse), grave o site rolando e salve um `.mp4` de 800x500 no mesmo lugar (`tools/gerar-previa.mjs` automatiza isso; mantenha o arquivo abaixo de ~2 MB).
2. Abra `js/data.js` e acrescente um objeto na lista `sites`:

```js
{
  nome: "Nome do Cliente",
  tipo: "Tipo de negócio · Cidade-UF",
  descricao: "Uma frase curta sobre o site.",
  url: "https://link-do-site.com.br",
  imagem: "assets/portfolio/nome-do-cliente.webp",`n  video: "assets/portfolio/nome-do-cliente.mp4"
},
```

Sem `url`, o botão vira "Link em breve". Sem `video`, o card rola o print no hover. Sem `imagem`, aparece um placeholder roxo com o nome do cliente.
O card "Próxima estreia" fica sempre por último, automaticamente.

## Como alterar os valores (ingressos)

Em `js/data.js`, edite a lista `planos` (`categoria`, `nome`, `valor`, `resumo`, `itens`).
O plano com `destaque: true` vira o ingresso amarelo "Mais pedido" (use em apenas um).

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
js/data.js     sites e valores (edite aqui)
js/main.js     animações e renderização
js/vendor/     gsap, ScrollTrigger e lenis
```

## Acessibilidade e movimento

Com `prefers-reduced-motion: reduce` ficam desligados: abertura, Lenis, parallax, grão animado, poeira, tilt dos ingressos e cursor. Só restam fades simples.
