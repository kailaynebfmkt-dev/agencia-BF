// =====================================================================
//  DADOS DO SITE — edite aqui, sem mexer no HTML.
//  Para adicionar um site novo: copie um objeto da lista `sites` e
//  preencha os campos. Para mudar valores: edite a lista `planos`.
//  Detalhes no README.md
// =====================================================================

export const sites = [
  {
    nome: "Giltec Climatização",
    tipo: "Climatização · Litoral Norte-RS",
    descricao: "Cenas em 3D e movimento pra explicar o sistema VRF e levar o cliente ao orçamento.",
    url: "https://giltec.vercel.app/",
    imagem: "assets/portfolio/giltec.webp",
    video: "assets/portfolio/giltec.mp4"
  },
  {
    nome: "Churrascaria Querência",
    tipo: "Churrascaria · Esteio-RS",
    descricao: "Rolagem que parece filme, cardápio do dia e pedido de delivery a um clique.",
    url: "https://querencia-churrascaria.vercel.app/",
    imagem: "assets/portfolio/querencia.webp",
    video: "assets/portfolio/querencia.mp4"
  },
  {
    nome: "Johny Burger",
    tipo: "Hamburgueria · Tramandaí-RS",
    descricao: "O hambúrguer se monta sozinho na tela e o pedido está a um clique.",
    url: "https://johny-burguer.vercel.app/",
    imagem: "assets/portfolio/johny-burger.webp",
    video: "assets/portfolio/johny-burger.mp4"
  },
  {
    nome: "Braseiro Hamburgueria",
    tipo: "Hamburgueria · Nova Tramandaí-RS",
    descricao: "Hambúrguer de 11 camadas que cai e se monta conforme você rola a página.",
    url: "https://braseiro-burguer.vercel.app/",
    imagem: "assets/portfolio/braseiro.webp",
    video: "assets/portfolio/braseiro.mp4"
  },
  {
    nome: "La Bella Donna",
    tipo: "Pizzaria · Tramandaí-RS",
    descricao: "Queijo esticando em câmera lenta: um site pra dar fome antes da primeira mordida.",
    url: "https://labelladonna-pizzaria-96bnod02d-kailaynebfmkt-7218s-projects.vercel.app/",
    imagem: "assets/portfolio/la-bella-donna.webp",
    video: "assets/portfolio/la-bella-donna.mp4"
  }
  // Modelo para o próximo site (descomente e preencha):
  // { nome: "", tipo: "Tipo de negócio · Cidade-UF", descricao: "", url: "", imagem: "assets/portfolio/nome.webp", video: "assets/portfolio/nome.mp4" },
];

export const planos = [
  {
    categoria: "Entrada · Site institucional",
    nome: "Site que vende",
    valor: "R$ 1.497 a R$ 2.497",
    resumo: "Presença digital e apresentação profissional da sua empresa.",
    itens: ["Apresentação profissional", "Seus serviços", "Fotos do negócio", "Localização", "Botão de WhatsApp"]
  },
  {
    categoria: "Mais comercial · Sistema interativo",
    nome: "Cardápio que vende",
    valor: "R$ 3.497 a R$ 5.497",
    destaque: true,
    resumo: "Catálogo online em que o cliente monta o pedido sozinho.",
    itens: ["Cardápio ou catálogo", "Categorias e produtos", "Carrinho de compras", "Pedidos direto no WhatsApp"]
  },
  {
    categoria: "Avançado · Sistema personalizado",
    nome: "Sistema que administra",
    valor: "R$ 6.000 a R$ 12.000+",
    resumo: "Você no controle de tudo, com um painel feito sob medida.",
    itens: ["Painel administrativo", "Gestão de produtos, categorias e preços", "Gestão de pedidos", "Integrações e funções específicas"]
  }
];
