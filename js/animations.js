/* ============================================
   FRAMER MOTION ANIMATIONS
   Loads the vanilla DOM build from esm.sh.
   Handles: hero entrance, scroll-triggered fades,
   staggered grid reveals, hover transitions.
   ============================================ */

import { animate, inView, stagger } from "https://esm.sh/framer-motion@12.38.0/dom";

const ease = [0.25, 0.46, 0.45, 0.94];
const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---- prefers-reduced-motion: show everything, no motion ---- */

if (reduced) {
  document.querySelectorAll('.reveal').forEach(el => {
    el.style.opacity = '1';
    el.style.transform = 'none';
  });
} else {
  init();
}

function init() {
  heroEntrance();
  pageHeaderEntrance();
  staggerGrids();
  scrollReveals();
  hoverInteractions();
  photoGridDynamic();
}

/* ---- Helper: set initial hidden inline state ---- */

function hide(el, y = 30) {
  el.style.opacity = '0';
  el.style.transform = `translateY(${y}px)`;
  el.style.transition = 'none'; // disable any inherited CSS transition; WAAPI drives the motion
  el.style.willChange = 'opacity, transform';
}

/* ---- 1. Hero entrance (index.html) ---- */

function heroEntrance() {
  const heroEls = document.querySelectorAll(
    '.hero-eyebrow, .hero-title, .hero-subtitle, .hero-actions, .hero-scroll'
  );
  if (!heroEls.length) return;

  heroEls.forEach(el => hide(el, 40));

  animate(
    Array.from(heroEls),
    { opacity: [0, 1], y: [40, 0] },
    { duration: 1, delay: stagger(0.14, { startDelay: 0.25 }), ease }
  );
}

/* ---- 2. Page header entrance (portfolio/services/about/contact) ---- */

function pageHeaderEntrance() {
  const header = document.querySelector('.page-header');
  if (!header) return;
  const items = header.querySelectorAll(':scope > .container > *');
  if (!items.length) return;

  items.forEach(el => hide(el, 30));

  animate(
    Array.from(items),
    { opacity: [0, 1], y: [30, 0] },
    { duration: 0.85, delay: stagger(0.1, { startDelay: 0.15 }), ease }
  );
}

/* ---- 3. Staggered grid reveals ---- */

function staggerGrids() {
  const gridSpecs = [
    { parent: '.services-grid', child: '.service-pill', step: 0.08 },
    { parent: '.portfolio-grid', child: '.album-card', step: 0.07 },
    { parent: '.services-list', child: '.service-block', step: 0.15 },
    { parent: '.about-values', child: '.about-value', step: 0.1 },
    { parent: '.contact-methods', child: '.contact-method', step: 0.1 },
  ];

  gridSpecs.forEach(({ parent, child, step }) => {
    document.querySelectorAll(parent).forEach(p => {
      const children = p.querySelectorAll(child);
      if (!children.length) return;

      children.forEach(c => {
        hide(c, 40);
        c.dataset.fmStaggered = '1'; // mark so scrollReveals skips
      });

      inView(p, () => {
        animate(
          Array.from(children),
          { opacity: [0, 1], y: [40, 0] },
          { duration: 0.8, delay: stagger(step), ease }
        );
      }, { amount: 0.1, margin: '0px 0px -60px 0px' });
    });
  });
}

/* ---- 4. Scroll-triggered fades for standalone .reveal ---- */

function scrollReveals() {
  document.querySelectorAll('.reveal').forEach(el => {
    if (el.dataset.fmStaggered) return; // handled by staggerGrids
    hide(el, 30);

    inView(el, () => {
      animate(el, { opacity: [0, 1], y: [30, 0] }, { duration: 0.9, ease });
    }, { amount: 0.12, margin: '0px 0px -40px 0px' });
  });
}

/* ---- 5. Hover transitions ---- */

function hoverInteractions() {
  // Buttons — scale + lift
  bindHover('.btn, .btn-submit, .album-back', {
    enter: { scale: 1.04, y: -2 },
    leave: { scale: 1, y: 0 },
    duration: 0.3,
  });

  // Album cards — lift + image zoom
  document.querySelectorAll('.album-card').forEach(card => {
    const img = card.querySelector('.album-card-img');
    card.addEventListener('pointerenter', () => {
      animate(card, { y: -8 }, { duration: 0.4, ease });
      if (img) animate(img, { scale: 1.06 }, { duration: 0.7, ease });
    });
    card.addEventListener('pointerleave', () => {
      animate(card, { y: 0 }, { duration: 0.4, ease });
      if (img) animate(img, { scale: 1 }, { duration: 0.7, ease });
    });
  });

  // Service pills — lift
  bindHover('.service-pill', {
    enter: { y: -6 },
    leave: { y: 0 },
    duration: 0.35,
  });

  // Nav + footer links — subtle lift
  bindHover('.nav-links a, .footer-links a, .footer-social a', {
    enter: { y: -2 },
    leave: { y: 0 },
    duration: 0.25,
  });

  // Filter buttons — scale
  bindHover('.filter-btn', {
    enter: { scale: 1.06 },
    leave: { scale: 1 },
    duration: 0.25,
  });

  // Social / contact pill links
  bindHover('.about-social-link, .contact-social-btn', {
    enter: { y: -3, scale: 1.02 },
    leave: { y: 0, scale: 1 },
    duration: 0.3,
  });

  // Carousel nav + launch buttons (index.html)
  bindHover('.space-nav-btn, .space-launch-btn', {
    enter: { scale: 1.05 },
    leave: { scale: 1 },
    duration: 0.25,
  });

  // About values
  bindHover('.about-value', {
    enter: { y: -4 },
    leave: { y: 0 },
    duration: 0.3,
  });
}

function bindHover(selector, { enter, leave, duration = 0.3 }) {
  document.querySelectorAll(selector).forEach(el => {
    el.addEventListener('pointerenter', () => animate(el, enter, { duration, ease }));
    el.addEventListener('pointerleave', () => animate(el, leave, { duration, ease }));
  });
}

/* ---- 6. Album photo grid — animate dynamically-added items ---- */

function photoGridDynamic() {
  const photoGrid = document.getElementById('photo-grid');
  if (!photoGrid) return;

  const animateItems = (items) => {
    if (!items.length) return;
    items.forEach(i => hide(i, 30));
    animate(
      items,
      { opacity: [0, 1], y: [30, 0] },
      { duration: 0.7, delay: stagger(0.05), ease }
    );
    items.forEach(item => {
      item.addEventListener('pointerenter', () => animate(item, { scale: 1.02 }, { duration: 0.3, ease }));
      item.addEventListener('pointerleave', () => animate(item, { scale: 1 }, { duration: 0.3, ease }));
    });
  };

  // Existing items (in case grid populated before this script ran)
  const existing = Array.from(photoGrid.querySelectorAll('.photo-item:not([data-fm-anim])'));
  existing.forEach(i => i.setAttribute('data-fm-anim', '1'));
  animateItems(existing);

  // Watch for future items injected by main.js
  const observer = new MutationObserver(() => {
    const fresh = Array.from(photoGrid.querySelectorAll('.photo-item:not([data-fm-anim])'));
    fresh.forEach(i => i.setAttribute('data-fm-anim', '1'));
    animateItems(fresh);
  });
  observer.observe(photoGrid, { childList: true });
}
