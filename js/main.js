import { sites, planos } from './data.js';

/* =====================================================================
   Agência BF — Noite de Estreia
   Regras de ouro: o conteúdo é legível sem JS; as animações só melhoram.
   Anima-se apenas transform/opacity (exceto o clip-path dos cards).
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

/* ---------- 1. Conteúdo vindo de data.js ---------- */
function renderSites() {
  const grid = $('#cards');
  const proxima = $('#proxima');
  sites.forEach((s, i) => {
    const card = document.createElement('article');
    card.className = 'card card-site';
    const tela = s.imagem
      ? `<img src="${esc(s.imagem)}" alt="Print da página inicial do site ${esc(s.nome)}" width="800" height="2500" loading="lazy" decoding="async">`
      : `<div class="shot-ph" aria-hidden="true">${esc(s.nome)}</div>`;
    const video = s.video && s.imagem
      ? `<video muted loop playsinline preload="none" data-src="${esc(s.video)}" aria-hidden="true" tabindex="-1"></video><span class="shot-hint" aria-hidden="true">Passe o mouse pra ver em movimento</span>`
      : '';
    const botao = s.url
      ? `<a class="btn btn-primary" href="${esc(s.url)}" target="_blank" rel="noopener noreferrer">Ver o site ao vivo<svg class="ico" aria-hidden="true"><use href="#i-arrow"/></svg><span class="sr-only"> ${esc(s.nome)} (abre em nova aba)</span></a>`
      : `<span class="btn" role="link" aria-disabled="true">Link em breve</span>`;
    const moldura = `
      <div class="browser">
        <div class="bar"><span class="dots" aria-hidden="true"><i></i><i></i><i></i></span><span class="addr">${esc(dominio(s.url) || 'em breve')}</span></div>
        <div class="shot">${tela}${video}</div>
      </div>`;
    card.innerHTML = `
      ${s.url
        ? `<a class="card-link" href="${esc(s.url)}" target="_blank" rel="noopener noreferrer" tabindex="-1" aria-hidden="true" data-cursor>${moldura}</a>`
        : `<div class="card-link" aria-hidden="true">${moldura}</div>`}
      <div class="card-body">
        <p class="card-tipo">${esc(s.tipo)}</p>
        <h3 class="card-nome">${esc(s.nome)}</h3>
        <p class="card-desc">${esc(s.descricao)}</p>
        ${botao}
      </div>`;
    grid.insertBefore(card, proxima);
  });
}

function renderPlanos() {
  const box = $('#tickets');
  box.innerHTML = planos.map((p, i) => `
    <article class="ticket${p.destaque ? ' is-featured' : ''}">
      <div class="t-top">
        ${p.destaque ? '<span class="t-badge">Mais pedido</span>' : ''}
        <p class="t-cat">${esc(p.categoria)}</p>
        <h3 class="t-name">${esc(p.nome)}</h3>
        <p class="t-ref">Valor de referência</p>
        <p class="t-price">${esc(p.valor)}</p>
        <p class="t-resume">${esc(p.resumo)}</p>
      </div>
      <div class="t-bottom">
        <p class="t-inc">O que inclui</p>
        <ul class="t-list">${p.itens.map((it) => `<li><svg aria-hidden="true"><use href="#i-check"/></svg><span>${esc(it)}</span></li>`).join('')}</ul>
        <div class="t-foot"><span class="barcode" aria-hidden="true"></span><span class="t-num">Nº ${String(i + 1).padStart(3, '0')}</span></div>
      </div>
    </article>`).join('');
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

function setupCardShots() {
  $$('.card-site').forEach((card) => {
    const shot = $('.shot', card); const img = $('.shot img', card);
    if (!img) return;
    const vid = $('video', card);
    if (vid) {
      // prévia em vídeo: mostra os efeitos reais do site
      if (reduce) { vid.remove(); $('.shot-hint', card)?.remove(); return; }
      vid.addEventListener('error', () => { vid.remove(); $('.shot-hint', card)?.remove(); shot.classList.remove('is-playing'); });
      const carregar = () => { if (!vid.src) { vid.src = vid.dataset.src; vid.preload = 'auto'; } };
      const tocar = () => { carregar(); vid.classList.add('on'); shot.classList.add('is-playing'); vid.play()?.catch(() => {}); };
      const parar = () => {
        vid.classList.remove('on'); shot.classList.remove('is-playing');
        setTimeout(() => { if (!vid.classList.contains('on')) { vid.pause(); try { vid.currentTime = 0; } catch {} } }, 450);
      };
      if ('IntersectionObserver' in window) new IntersectionObserver(([e]) => { if (e.isIntersecting) carregar(); }, { rootMargin: '400px' }).observe(card);
      if (fine) {
        card.addEventListener('mouseenter', tocar); card.addEventListener('mouseleave', parar);
        card.addEventListener('focusin', tocar); card.addEventListener('focusout', parar);
      } else if ('IntersectionObserver' in window) {
        new IntersectionObserver(([e]) => (e.isIntersecting ? tocar() : parar()), { threshold: .65 }).observe(card);
      }
      return;
    }
    const dist = () => Math.max(0, img.offsetHeight - shot.clientHeight);
    const descer = () => {
      const d = dist(); if (!d) return;
      img.style.transition = `transform ${Math.max(3, d / 130)}s cubic-bezier(.45,.05,.4,1)`;
      img.style.transform = `translate3d(0,-${d}px,0)`;
    };
    const subir = () => { img.style.transition = 'transform 1.1s cubic-bezier(.16,1,.3,1)'; img.style.transform = 'translate3d(0,0,0)'; };
    if (reduce) return;
    if (fine) {
      card.addEventListener('mouseenter', descer); card.addEventListener('mouseleave', subir);
      card.addEventListener('focusin', descer); card.addEventListener('focusout', subir);
    } else if ('IntersectionObserver' in window) {
      // celular: sem hover, então o print rola sozinho quando o card aparece
      new IntersectionObserver(([e]) => (e.isIntersecting ? descer() : subir()), { threshold: .65 }).observe(card);
    }
  });
}

function setupCursor() {
  const cur = $('.cursor'); if (!cur || !fine || reduce || !temGsap) return;
  const qx = gsap.quickTo(cur, 'x', { duration: .45, ease: 'power3.out' });
  const qy = gsap.quickTo(cur, 'y', { duration: .45, ease: 'power3.out' });
  addEventListener('pointermove', (e) => { cur.classList.add('is-on'); qx(e.clientX); qy(e.clientY); }, { passive: true });
  document.addEventListener('mouseleave', () => cur.classList.remove('is-on'));
  document.addEventListener('pointerover', (e) => { cur.classList.toggle('is-view', !!e.target.closest('[data-cursor]')); });
}

function setupTilt() {
  if (!fine || reduce || !temGsap) return;
  $$('.ticket').forEach((t) => {
    gsap.set(t, { transformPerspective: 900 });
    const rx = gsap.quickTo(t, 'rotationX', { duration: .6, ease: 'power3.out' });
    const ry = gsap.quickTo(t, 'rotationY', { duration: .6, ease: 'power3.out' });
    t.addEventListener('pointermove', (e) => {
      const r = t.getBoundingClientRect();
      ry(((e.clientX - r.left) / r.width - .5) * 9);
      rx(-((e.clientY - r.top) / r.height - .5) * 9);
    });
    t.addEventListener('pointerleave', () => { rx(0); ry(0); });
  });
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

  // Cards: "corte de cena" (clip-path de baixo para cima)
  const cards = $$('.cards .card');
  if (reduce) {
    gsap.from(cards, { opacity: 0, duration: .6, stagger: .08, scrollTrigger: { trigger: '#cards', start: 'top 85%', once: true } });
  } else {
    gsap.set(cards, { clipPath: 'inset(100% 0% 0% 0%)' });
    ScrollTrigger.batch(cards, {
      start: 'top 90%', once: true,
      onEnter: (els) => gsap.fromTo(els,
        { clipPath: 'inset(100% 0% 0% 0%)', y: 30 },
        { clipPath: 'inset(0% 0% 0% 0%)', y: 0, duration: 1.1, ease: 'expo.out', stagger: .14, clearProps: 'clipPath,y' }),
    });
  }

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

  // Ingressos
  if (!reduce) {
    gsap.from('.ticket', { opacity: 0, y: 50, duration: 1, ease: 'expo.out', stagger: .14, scrollTrigger: { trigger: '#tickets', start: 'top 85%', once: true } });
  } else {
    gsap.from('.ticket', { opacity: 0, duration: .6, scrollTrigger: { trigger: '#tickets', start: 'top 88%', once: true } });
  }

  // recalcula depois que fontes/imagens carregam
  addEventListener('load', () => ScrollTrigger.refresh());
  document.fonts?.ready.then(() => ScrollTrigger.refresh());
}

/* ---------- Início ---------- */
renderSites();
renderPlanos();
renderSeats();
setupNav();
setupWhatsFloat();
setupCardShots();

if (temGsap) {
  const veioIntro = root.classList.contains('intro-on');
  abertura().then(() => {});
  animar(veioIntro);
  // o hero espera a abertura (a abertura cobre a tela, então a animação roda por baixo)
  setupDust(); setupCursor(); setupTilt();
} else {
  // sem GSAP: tudo já está visível e funcional
  $('#intro')?.remove(); root.classList.remove('intro-on');
  $('.wa-float')?.classList.add('is-visible');
}
