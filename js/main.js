/* ============================================
   MAIN — GLOBAL SCRIPTS
   ============================================ */

(function () {
  'use strict';

  /* Scroll-reveal is handled by js/animations.js (Framer Motion). */

  /* ---- Hero background zoom-in on load ---- */

  const heroBg = document.querySelector('.hero-bg');
  if (heroBg) {
    // Trigger zoom-out animation once image loads
    const testImg = new Image();
    const bgUrl = getComputedStyle(heroBg).backgroundImage.match(/url\(["']?([^"')]+)["']?\)/);
    if (bgUrl) {
      testImg.onload = () => heroBg.classList.add('loaded');
      testImg.src = bgUrl[1];
    } else {
      heroBg.classList.add('loaded');
    }
  }

  /* ---- Contact form ---- */

  const bookingForm = document.querySelector('.booking-form');
  if (bookingForm) {
    bookingForm.addEventListener('submit', function (e) {
      e.preventDefault();

      const btn = this.querySelector('.btn-submit');
      const successMsg = document.querySelector('.form-success');

      // Simulate loading state
      btn.textContent = 'Sending…';
      btn.disabled = true;

      setTimeout(() => {
        bookingForm.style.display = 'none';
        if (successMsg) successMsg.classList.add('show');
      }, 1200);
    });
  }

  /* ---- Portfolio filter ---- */

  const filterBtns = document.querySelectorAll('.filter-btn');
  const albumCards = document.querySelectorAll('.album-card');

  if (filterBtns.length && albumCards.length) {
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filter = btn.dataset.filter;

        albumCards.forEach(card => {
          const cat = card.dataset.category || '';
          const show = filter === 'all' || cat === filter;

          card.style.transition = 'opacity 0.3s, transform 0.3s';
          if (show) {
            card.style.opacity  = '1';
            card.style.transform = 'scale(1)';
            card.style.display  = 'block';
          } else {
            card.style.opacity  = '0';
            card.style.transform = 'scale(0.96)';
            setTimeout(() => {
              if (card.dataset.category !== filter && filter !== 'all') {
                card.style.display = 'none';
              }
            }, 300);
          }
        });
      });
    });
  }

  /* ---- Album page: read URL param ---- */

  const albumData = {
    'amsterdam-night-festival': {
      title: 'Amsterdam Night Festival',
      category: 'Events',
      description: 'A vivid collection from the annual Amsterdam Night Festival — where art, light, and city culture converge after dark.',
      count: 12,
      bg: 'https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?w=1920&q=80',
      photos: [
        { src: 'https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?w=800&q=80', alt: 'Night Festival lights' },
        { src: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&q=80', alt: 'Crowd at festival' },
        { src: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800&q=80', alt: 'Stage performance' },
        { src: 'https://images.unsplash.com/photo-1524863479829-916d8e77f114?w=800&q=80', alt: 'Festival atmosphere' },
        { src: 'https://images.unsplash.com/photo-1497436072909-60f360e1d4b1?w=800&q=80', alt: 'Light installation' },
        { src: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800&q=80', alt: 'DJ set' },
        { src: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&q=80', alt: 'Crowd energy' },
        { src: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=800&q=80', alt: 'Live music' },
        { src: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&q=80', alt: 'Festival night' },
      ]
    },
    'summer-rooftop-party': {
      title: 'Summer Rooftop Party',
      category: 'Events',
      description: 'Golden hour and city skylines — capturing the energy of Amsterdam\'s favourite rooftop summer gathering.',
      count: 9,
      bg: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=1920&q=80',
      photos: [
        { src: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=800&q=80', alt: 'Rooftop view' },
        { src: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&q=80', alt: 'Party crowd' },
        { src: 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=800&q=80', alt: 'Sunset drinks' },
        { src: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800&q=80', alt: 'DJ performance' },
        { src: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=800&q=80', alt: 'Music' },
        { src: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&q=80', alt: 'Night skyline' },
      ]
    },
    'portrait-series': {
      title: 'Portrait Series',
      category: 'Portraits',
      description: 'An intimate collection of portraits — each frame capturing authenticity, character, and quiet intensity.',
      count: 8,
      bg: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=1920&q=80',
      photos: [
        { src: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=800&q=80', alt: 'Portrait 1' },
        { src: 'https://images.unsplash.com/photo-1502767882564-6dd3f0b4d534?w=800&q=80', alt: 'Portrait 2' },
        { src: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&q=80', alt: 'Portrait 3' },
        { src: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=800&q=80', alt: 'Portrait 4' },
        { src: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80', alt: 'Portrait 5' },
        { src: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=800&q=80', alt: 'Portrait 6' },
      ]
    },
    'corporate-event-coverage': {
      title: 'Corporate Event Coverage',
      category: 'Corporate',
      description: 'Professional event documentation for brands, conferences, and corporate gatherings that tell a story beyond the boardroom.',
      count: 10,
      bg: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1920&q=80',
      photos: [
        { src: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80', alt: 'Conference keynote' },
        { src: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&q=80', alt: 'Panel discussion' },
        { src: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=800&q=80', alt: 'Networking' },
        { src: 'https://images.unsplash.com/photo-1528605248644-14dd04022da1?w=800&q=80', alt: 'Team event' },
        { src: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=800&q=80', alt: 'Speaker' },
        { src: 'https://images.unsplash.com/photo-1559223607-a43c990c692c?w=800&q=80', alt: 'Gala dinner' },
      ]
    },
    'brand-campaign-shoot': {
      title: 'Brand Campaign Shoot',
      category: 'Brand',
      description: 'Editorial-style brand photography that communicates identity, product, and vision in one frame.',
      count: 11,
      bg: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=1920&q=80',
      photos: [
        { src: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=800&q=80', alt: 'Brand shoot 1' },
        { src: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=800&q=80', alt: 'Product shot' },
        { src: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800&q=80', alt: 'Campaign model' },
        { src: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=800&q=80', alt: 'Fashion editorial' },
        { src: 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=800&q=80', alt: 'Street style' },
        { src: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&q=80', alt: 'Brand campaign' },
      ]
    }
  };

  // Populate album page
  const albumTitle    = document.getElementById('album-title');
  const albumCategory = document.getElementById('album-category');
  const albumDesc     = document.getElementById('album-desc');
  const albumCount    = document.getElementById('album-count');
  const albumHeroBg   = document.getElementById('album-hero-bg');
  const photoGrid     = document.getElementById('photo-grid');

  if (albumTitle && photoGrid) {
    const params = new URLSearchParams(window.location.search);
    const slug   = params.get('album') || 'amsterdam-night-festival';
    const data   = albumData[slug] || albumData['amsterdam-night-festival'];

    // Set content
    document.title = data.title + ' — Hiccupviews';
    albumTitle.textContent    = data.title;
    if (albumCategory) albumCategory.textContent = data.category;
    if (albumDesc)     albumDesc.textContent     = data.description;
    if (albumCount)    albumCount.textContent     = data.count;
    if (albumHeroBg)   albumHeroBg.style.backgroundImage = `url('${data.bg}')`;

    // Build photo grid
    data.photos.forEach(photo => {
      const item = document.createElement('div');
      item.className = 'photo-item';
      item.innerHTML = `
        <img src="${photo.src}" alt="${photo.alt}" loading="lazy">
        <div class="photo-item-overlay">
          <svg viewBox="0 0 24 24"><path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"/></svg>
        </div>
      `;
      photoGrid.appendChild(item);
    });

    // Re-bind lightbox after dynamic content
    if (window.LightboxBind) window.LightboxBind();
  }

  /* ---- Smooth link transitions ---- */
  // Subtle fade when navigating
  document.addEventListener('click', e => {
    const link = e.target.closest('a[href]');
    if (!link) return;
    const href = link.getAttribute('href');
    if (!href || href.startsWith('#') || href.startsWith('http') || href.startsWith('mailto') || e.ctrlKey || e.metaKey) return;

    e.preventDefault();
    document.body.style.transition = 'opacity 0.25s';
    document.body.style.opacity    = '0';
    setTimeout(() => { window.location.href = href; }, 260);
  });

  // Fade in on load
  document.body.style.opacity    = '0';
  document.body.style.transition = 'opacity 0.4s';
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      document.body.style.opacity = '1';
    });
  });

})();
