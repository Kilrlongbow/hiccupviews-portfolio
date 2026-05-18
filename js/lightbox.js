/* ============================================
   LIGHTBOX — FULLSCREEN PHOTO VIEWER
   ============================================ */

(function () {
  'use strict';

  /* Build lightbox DOM */
  const lb = document.createElement('div');
  lb.className = 'lightbox';
  lb.setAttribute('role', 'dialog');
  lb.setAttribute('aria-modal', 'true');
  lb.setAttribute('aria-label', 'Photo viewer');
  lb.innerHTML = `
    <button class="lightbox-close" aria-label="Close">
      <svg viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
    </button>
    <button class="lightbox-prev" aria-label="Previous photo">
      <svg viewBox="0 0 24 24"><polyline points="15 18 9 12 15 6"/></svg>
    </button>
    <div class="lightbox-img-wrap">
      <img class="lightbox-img" src="" alt="Photo" draggable="false">
      <div class="lightbox-caption"></div>
    </div>
    <button class="lightbox-next" aria-label="Next photo">
      <svg viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6"/></svg>
    </button>
    <div class="lightbox-counter"></div>
  `;
  document.body.appendChild(lb);

  const img     = lb.querySelector('.lightbox-img');
  const caption = lb.querySelector('.lightbox-caption');
  const counter = lb.querySelector('.lightbox-counter');
  const btnClose = lb.querySelector('.lightbox-close');
  const btnPrev  = lb.querySelector('.lightbox-prev');
  const btnNext  = lb.querySelector('.lightbox-next');

  let images  = [];
  let current = 0;

  /* ---- Open ---- */

  function open(items, index) {
    images  = items;
    current = index;
    show(current);
    lb.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  /* ---- Close ---- */

  function close() {
    lb.classList.remove('open');
    document.body.style.overflow = '';
    // Fade out image
    img.style.opacity = '0';
    img.style.transform = 'scale(0.96)';
  }

  /* ---- Show slide ---- */

  function show(index) {
    // Bounds
    current = (index + images.length) % images.length;

    // Animate out
    img.style.transition = 'none';
    img.style.opacity    = '0';
    img.style.transform  = 'scale(0.96)';

    const src = images[current].src || images[current];
    const alt = images[current].alt || '';

    img.src = src;
    img.alt = alt;
    caption.textContent = alt;

    img.onload = () => {
      img.style.transition = '';
      img.style.opacity    = '1';
      img.style.transform  = 'scale(1)';
    };

    counter.textContent = `${current + 1} / ${images.length}`;

    // Prev/next visibility
    btnPrev.style.display = images.length > 1 ? '' : 'none';
    btnNext.style.display = images.length > 1 ? '' : 'none';
  }

  /* ---- Controls ---- */

  btnClose.addEventListener('click', close);
  btnPrev.addEventListener('click', () => show(current - 1));
  btnNext.addEventListener('click', () => show(current + 1));

  // Click backdrop to close
  lb.addEventListener('click', e => {
    if (e.target === lb) close();
  });

  /* ---- Keyboard ---- */

  document.addEventListener('keydown', e => {
    if (!lb.classList.contains('open')) return;
    if (e.key === 'ArrowLeft')  show(current - 1);
    if (e.key === 'ArrowRight') show(current + 1);
    if (e.key === 'Escape')     close();
  });

  /* ---- Touch / swipe ---- */

  let touchStartX = 0;
  let touchStartY = 0;

  lb.addEventListener('touchstart', e => {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
  }, { passive: true });

  lb.addEventListener('touchend', e => {
    const dx = e.changedTouches[0].clientX - touchStartX;
    const dy = e.changedTouches[0].clientY - touchStartY;

    // Only register horizontal swipes
    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 40) {
      if (dx > 0) show(current - 1);
      else        show(current + 1);
    }
  }, { passive: true });

  /* ---- Bind to photo items ---- */

  function bindPhotoGrid() {
    const items = document.querySelectorAll('.photo-item');
    if (!items.length) return;

    // Collect images array
    const imgList = Array.from(items).map(item => {
      const el = item.querySelector('img');
      return { src: el ? el.src : '', alt: el ? (el.alt || '') : '' };
    });

    items.forEach((item, index) => {
      item.addEventListener('click', () => open(imgList, index));
    });
  }

  // Run now + expose for dynamic content
  bindPhotoGrid();
  window.LightboxBind = bindPhotoGrid;

  // Expose open for external use
  window.Lightbox = { open, close };

})();
