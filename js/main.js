import { sites } from './data.js';

/* =====================================================================
   Agência BF — Noite de Estreia
   Regras de ouro: o conteúdo é legível sem JS; as animações só melhoram.
   Anima-se apenas transform/opacity.
   ===================================================================== */

const root = document.documentElement;
root.classList.add('js');

const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const fine = matchMedia('(hover: hover) and (pointer: fine)').matches;
const temGsap = typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined';
const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];

const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const dominio = (url) => { try { return new URL(url).hostname.replace(/^www\./, ''); } catch { return ''; } };

/* ---------- 1. Nível 2: sites ao vivo, um de cada vez ---------- */
function setupAoVivo() {
  const caixa = $('#vivo'); const seletor = $('#seletor');
  if (!caixa || !seletor || !sites.length) return;
  const capa = $('#vivo-capa'); const sair = $('#vivo-sair');
  let atual = 0, visivelPerto = false, midia = null;

  seletor.innerHTML = sites.map((s, i) => `
    <button type="button" data-i="${i}" aria-pressed="${i === 0}">
      ${s.imagem ? `<img src="${esc(s.imagem)}" alt="" width="800" height="500" loading="lazy" decoding="async">` : ''}
      <span>${esc(s.nome)}</span>
    </button>`).join('');

  // Em caixas largas o site é aberto como num computador (1366px) e reduzido; no celular, como celular.
  const ajustar = () => {
    if (!midia || midia.tagName !== 'IFRAME') return;
    const w = caixa.clientWidth, h = caixa.clientHeight;
    const virtual = w >= 560 ? Math.max(1366, w) : Math.max(390, w);
    const escala = w / virtual;
    midia.style.width = `${virtual}px`;
    midia.style.height = `${Math.ceil(h / escala)}px`;
    midia.style.transform = `scale(${escala})`;
  };

  const liberar = () => { caixa.classList.add('is-ativo'); sair.hidden = false; $('.cursor')?.classList.remove('is-on'); midia?.focus({ preventScroll: true }); };
  const travar = () => { caixa.classList.remove('is-ativo'); sair.hidden = true; };

  // só o site selecionado é carregado
  const carregar = () => {
    midia?.remove(); midia = null;
    const s = sites[atual];
    if (s.bloqueiaIframe && s.video) {
      midia = Object.assign(document.createElement('video'), { src: s.video, muted: true, loop: true, controls: true, autoplay: !reduce, playsInline: true });
      caixa.classList.add('sem-capa');
    } else {
      midia = document.createElement('iframe');
      midia.title = `Site ${s.nome} ao vivo`;
      midia.allow = 'autoplay; fullscreen';
      midia.src = s.url;
      caixa.classList.remove('sem-capa');
    }
    caixa.insertBefore(midia, capa);
    ajustar();
  };

  const mostrarTexto = () => {
    const s = sites[atual];
    $('#vivo-addr').textContent = dominio(s.url);
    $('#vivo-abrir').href = s.url;
    $('#vivo-desc').textContent = `${s.tipo}. ${s.descricao}`;
    $$('button', seletor).forEach((b, i) => b.setAttribute('aria-pressed', String(i === atual)));
  };

  seletor.addEventListener('click', (e) => {
    const b = e.target.closest('button'); if (!b || +b.dataset.i === atual) return;
    atual = +b.dataset.i; travar(); mostrarTexto();
    if (visivelPerto) carregar();
  });
  capa.addEventListener('click', liberar);
  sair.addEventListener('click', travar);
  // tirar o mouse da prévia devolve a rolagem para a página
  caixa.addEventListener('pointerleave', (e) => { if (e.pointerType === 'mouse') travar(); });
  new ResizeObserver(ajustar).observe(caixa);

  mostrarTexto();
  if (!('IntersectionObserver' in window)) { visivelPerto = true; carregar(); return; }
  // carrega quando a seção se aproxima e libera a memória quando fica longe
  new IntersectionObserver(([e]) => {
    visivelPerto = e.isIntersecting;
    if (visivelPerto && !midia) carregar();
    else if (!visivelPerto && midia) { travar(); midia.remove(); midia = null; }
  }, { rootMargin: '500px 0px' }).observe(caixa);
}

/* ---------- Nível 3: vídeo toca sozinho quando aparece ---------- */
function setupVideoPortal() {
  const v = $('#video-portal'); if (!v || reduce || !('IntersectionObserver' in window)) return;
  v.muted = true;
  let pausadoPeloUsuario = false, pausandoSozinho = false;
  v.addEventListener('pause', () => { if (!pausandoSozinho) pausadoPeloUsuario = true; pausandoSozinho = false; });
  v.addEventListener('play', () => { pausadoPeloUsuario = false; });
  new IntersectionObserver(([e]) => {
    if (e.isIntersecting) { if (!pausadoPeloUsuario) v.play()?.catch(() => {}); }
    else if (!v.paused && !document.fullscreenElement) { pausandoSozinho = true; v.pause(); }
  }, { threshold: .25 }).observe(v);
}

/* poltronas (SVG decorativo) */
function renderSeats() {
  const svg = $('.seats');
  if (!svg) return;
  const seat = (x, y, s, fill, rim) => `
    <g transform="translate(${x} ${y}) scale(${s})">
      <rect x="9" y="0" width="52" height="66" rx="20" fill="${fill}"/>
      <rect x="0" y="34" width="13" height="50" rx="6" fill="${fill}"/>
      <rect x="57" y="34" width="13" height="50" rx="6" fill="${fill}"/>
      <path d="M13 12Q35 -2 57 12" fill="none" stroke="${rim}" stroke-width="2" stroke-linecap="round"/>
    </g>`;
  let out = '<defs><linearGradient id="sf" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1b0a24"/><stop offset="1" stop-color="#0c0510"/></linearGradient></defs>';
  for (let i = -1; i < 21; i++) out += seat(i * 74 + 10, 50, 0.78, '#1d0b27', 'rgba(146,38,169,.35)');
  for (let i = -1; i < 17; i++) out += seat(i * 92 - 16, 88, 1, 'url(#sf)', 'rgba(196,107,219,.5)');
  svg.innerHTML = out;
}

/* ---------- 2. Utilidades de animação ---------- */
function splitWords(el) {
  const walk = (node) => {
    [...node.childNodes].forEach((n) => {
      if (n.nodeType === 3) {
        const frag = document.createDocumentFragment();
        n.textContent.split(/(\s+)/).forEach((p) => {
          if (!p) return;
          if (/^\s+$/.test(p)) { frag.append(' '); return; }
          const w = document.createElement('span'); w.className = 'w';
          const i = document.createElement('span'); i.className = 'wi'; i.textContent = p;
          w.append(i); frag.append(w);
        });
        n.replaceWith(frag);
      } else if (n.nodeType === 1 && !['BR', 'svg'].includes(n.tagName)) walk(n);
    });
  };
  walk(el);
  return $$('.wi', el);
}

/* ---------- 3. Efeitos independentes de GSAP ---------- */
function setupNav() {
  const nav = $('#nav');
  const on = () => nav.classList.toggle('is-solid', scrollY > 40);
  on(); addEventListener('scroll', on, { passive: true });
}

function setupWhatsFloat() {
  const wa = $('.wa-float'); const hero = $('.hero');
  if (!wa || !hero || !('IntersectionObserver' in window)) { wa?.classList.add('is-visible'); return; }
  new IntersectionObserver(([e]) => {
    wa.classList.toggle('is-visible', !e.isIntersecting && e.boundingClientRect.top < 0);
  }).observe(hero);
}

function setupDust() {
  const c = $('.dust'); if (!c || reduce) return;
  const ctx = c.getContext('2d'); if (!ctx) return;
  let w = 0, h = 0, parts = [], rodando = false, last = 0;
  const tamanho = () => {
    const r = c.getBoundingClientRect(); const dpr = Math.min(devicePixelRatio || 1, 2);
    w = r.width; h = r.height; c.width = w * dpr; c.height = h * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const n = w < 700 ? 26 : 56;
    parts = Array.from({ length: n }, () => ({
      y: Math.random() * h, f: Math.random() * 2 - 1, r: Math.random() * 1.3 + .5,
      v: Math.random() * 14 + 5, ph: Math.random() * 6.28, a: Math.random() * .5 + .25,
    }));
  };
  const quadro = (t) => {
    if (!rodando) return;
    const dt = Math.min((t - last) / 1000 || 0, .05); last = t;
    ctx.clearRect(0, 0, w, h);
    for (const p of parts) {
      p.y += p.v * dt; p.ph += dt * 1.4;
      if (p.y > h * .86) { p.y = 0; p.f = Math.random() * 2 - 1; }
      const meia = w * .04 + p.y * .62;               // meia-largura do cone na altura y
      const x = w / 2 + p.f * meia + Math.sin(p.ph) * 6;
      const fade = Math.min(1, p.y / 60) * (1 - p.y / (h * .86));
      ctx.globalAlpha = p.a * fade * (.6 + .4 * Math.sin(p.ph * 1.7));
      ctx.fillStyle = '#e6c2ff';
      ctx.beginPath(); ctx.arc(x, p.y, p.r, 0, 6.283); ctx.fill();
    }
    requestAnimationFrame(quadro);
  };
  tamanho();
  let rt; addEventListener('resize', () => { clearTimeout(rt); rt = setTimeout(tamanho, 200); });
  new IntersectionObserver(([e]) => {
    if (e.isIntersecting && !rodando) { rodando = true; last = performance.now(); requestAnimationFrame(quadro); }
    else if (!e.isIntersecting) rodando = false;
  }).observe($('.hero'));
}

function setupCursor() {
  const cur = $('.cursor'); if (!cur || !fine || reduce || !temGsap) return;
  const qx = gsap.quickTo(cur, 'x', { duration: .45, ease: 'power3.out' });
  const qy = gsap.quickTo(cur, 'y', { duration: .45, ease: 'power3.out' });
  addEventListener('pointermove', (e) => { cur.classList.add('is-on'); qx(e.clientX); qy(e.clientY); }, { passive: true });
  document.addEventListener('mouseleave', () => cur.classList.remove('is-on'));
  // sobre o site ao vivo o ponteiro é do próprio iframe: esconde o cursor da página
  document.addEventListener('pointerover', (e) => { if (e.target.tagName === 'IFRAME') cur.classList.remove('is-on'); });
}

/* ---------- 4. Abertura ---------- */
function abertura() {
  return new Promise((resolve) => {
    const el = $('#intro');
    const terminar = () => { root.classList.remove('intro-on'); el?.remove(); try { sessionStorage.setItem('bf-intro', '1'); } catch {} resolve(); };
    if (!root.classList.contains('intro-on') || !el || !temGsap) { if (el) el.remove(); root.classList.remove('intro-on'); return resolve(); }
    const tl = gsap.timeline({ onComplete: terminar });
    tl.to('.intro-beam', { opacity: .15, duration: .06 })
      .to('.intro-beam', { opacity: .9, duration: .05 })
      .to('.intro-beam', { opacity: .2, duration: .07 })
      .to('.intro-beam', { opacity: 1, duration: .25, ease: 'power2.out' })
      .to('.intro-text', { opacity: 1, duration: .4, ease: 'power3.out' }, .3)
      .to('.intro-text', { opacity: 0, duration: .35, ease: 'power2.in' }, 1.05)
      .fromTo('.intro-coin', { opacity: 0, scale: .86 }, { opacity: 1, scale: 1, duration: .6, ease: 'expo.out' }, 1.1)
      .to(el, { opacity: 0, duration: .5, ease: 'power2.inOut' }, 1.85);
  });
}

/* ---------- 5. Animações de scroll ---------- */
function animar(depoisDaAbertura) {
  gsap.registerPlugin(ScrollTrigger);

  // Lenis (suave) — desligado em movimento reduzido
  if (!reduce && typeof Lenis !== 'undefined') {
    const lenis = new Lenis({ lerp: .1, wheelMultiplier: 1 });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((t) => lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
    window.__lenis = lenis;
  }
  document.querySelectorAll('a[href^="#"]').forEach((a) => a.addEventListener('click', (e) => {
    const id = a.getAttribute('href'); if (id.length < 2) return;
    const alvo = $(id); if (!alvo) return;
    e.preventDefault();
    if (window.__lenis) window.__lenis.scrollTo(alvo, { offset: -60, duration: 1.4 });
    else alvo.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' });
  }));

  // Hero
  const h1 = $('.h-hero');
  if (reduce) {
    gsap.from(['.hero-stage', '.hero-copy'], { opacity: 0, duration: .8, ease: 'power2.out' });
  } else {
    const palavras = splitWords(h1);
    const base = depoisDaAbertura ? 1.75 : 0.1;
    gsap.timeline({ delay: base })
      .from('.screen', { opacity: 0, scale: .96, duration: 1.1, ease: 'expo.out' }, 0)
      .from('.beam', { opacity: 0, duration: 1.2, ease: 'power2.out' }, 0)
      .from('.seats', { opacity: 0, yPercent: 20, duration: 1.1, ease: 'expo.out' }, .1)
      .from(palavras, { yPercent: 115, duration: .95, ease: 'expo.out', stagger: .05 }, .35)
      .from(['.hero-text', '.hero-btns'], { opacity: 0, y: 24, duration: .9, ease: 'power3.out', stagger: .12 }, .9);

    // a câmera "entra" no telão
    gsap.timeline({ scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } })
      .to('.screen', { scale: 1.08, ease: 'none' }, 0)
      .to('.seats', { yPercent: 70, opacity: 0, ease: 'none' }, 0)
      .to('.beam', { opacity: 1, y: 70, ease: 'none' }, 0)
      .to('.hero-copy', { y: -24, ease: 'none' }, 0);
  }

  // Títulos de seção: entram palavra por palavra, como créditos
  $$('.split').forEach((el) => {
    if (reduce) { gsap.from(el, { opacity: 0, duration: .7, scrollTrigger: { trigger: el, start: 'top 88%', once: true } }); return; }
    const ws = splitWords(el);
    gsap.from(ws, { yPercent: 115, duration: .95, ease: 'expo.out', stagger: .05, scrollTrigger: { trigger: el, start: 'top 88%', once: true } });
  });

  // Blocos de texto
  $$('.reveal').forEach((el) => {
    gsap.from(el, { opacity: 0, y: reduce ? 0 : 26, duration: reduce ? .6 : .9, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 90%', once: true } });
  });

  // Níveis: a prévia entra pelo lado dela e os benefícios aparecem em sequência.
  // clearProps no final: nenhum transform fica sobrando em volta do iframe.
  const mmNiveis = gsap.matchMedia();
  mmNiveis.add({ largo: '(min-width: 1000px)', estreito: '(max-width: 999px)' }, (ctx) => {
    $$('.nivel').forEach((sec, i) => {
      const gatilho = { trigger: sec, start: 'top 72%', once: true };
      const lado = ctx.conditions.largo ? (i === 1 ? 70 : -70) : 0;
      gsap.from($('.nivel-previa', sec), { opacity: 0, x: reduce ? 0 : lado, duration: reduce ? .6 : 1.1, ease: 'expo.out', clearProps: 'transform,opacity', scrollTrigger: gatilho });
      gsap.from($$('.nivel-info > *:not(.beneficios), .beneficios li', sec), { opacity: 0, y: reduce ? 0 : 18, duration: .7, ease: 'power3.out', stagger: .05, clearProps: 'transform,opacity', scrollTrigger: { trigger: $('.nivel-info', sec), start: 'top 80%', once: true } });
    });
  });

  // Linha de progressão entre os níveis
  if (!reduce) $$('.elo-linha i').forEach((l) => {
    gsap.fromTo(l, { scaleY: 0 }, { scaleY: 1, ease: 'none', scrollTrigger: { trigger: l.parentElement, start: 'top 85%', end: 'bottom 50%', scrub: true } });
  });

  // Rolo de filme que se preenche
  const fill = $('.reel-fill');
  if (fill) {
    const mm = gsap.matchMedia();
    mm.add('(min-width: 600px)', () => {
      if (reduce) return gsap.set(fill, { scaleX: 1 });
      gsap.fromTo(fill, { scaleX: 0 }, { scaleX: 1, ease: 'none', scrollTrigger: { trigger: '.atos-wrap', start: 'top 70%', end: 'bottom 60%', scrub: true } });
    });
    mm.add('(max-width: 599px)', () => {
      if (reduce) return gsap.set(fill, { scaleY: 1 });
      gsap.fromTo(fill, { scaleY: 0 }, { scaleY: 1, ease: 'none', scrollTrigger: { trigger: '.atos-wrap', start: 'top 70%', end: 'bottom 60%', scrub: true } });
    });
  }

  // recalcula depois que fontes/imagens carregam
  addEventListener('load', () => ScrollTrigger.refresh());
  document.fonts?.ready.then(() => ScrollTrigger.refresh());
}

/* ---------- Início ---------- */
setupAoVivo();
setupVideoPortal();
renderSeats();
setupNav();
setupWhatsFloat();

if (temGsap) {
  const veioIntro = root.classList.contains('intro-on');
  abertura().then(() => {});
  animar(veioIntro);
  // o hero espera a abertura (a abertura cobre a tela, então a animação roda por baixo)
  setupDust(); setupCursor();
} else {
  // sem GSAP: tudo já está visível e funcional
  $('#intro')?.remove(); root.classList.remove('intro-on');
  $('.wa-float')?.classList.add('is-visible');
}
