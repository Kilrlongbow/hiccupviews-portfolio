/* ============================================
   3D SPACE CAROUSEL — GAMIFIED ENGINE
   ============================================ */

(function () {
  'use strict';

  /* ============================================================
     ALBUM DATA
  ============================================================ */

  const ALBUMS = [
    {
      slug:       'amsterdam-night-festival',
      title:      'Amsterdam Night Festival',
      category:   'EVENTS',
      color:      '#00d4ff',
      photos:     9,
      difficulty: 3,
      img:        'https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?w=840&q=80',
    },
    {
      slug:       'summer-rooftop-party',
      title:      'Summer Rooftop Party',
      category:   'EVENTS',
      color:      '#ff8c42',
      photos:     6,
      difficulty: 2,
      img:        'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=840&q=80',
    },
    {
      slug:       'portrait-series',
      title:      'Portrait Series',
      category:   'PORTRAITS',
      color:      '#ff6b9d',
      photos:     6,
      difficulty: 4,
      img:        'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=840&q=80',
    },
    {
      slug:       'corporate-event-coverage',
      title:      'Corporate Event Coverage',
      category:   'CORPORATE',
      color:      '#ffd700',
      photos:     6,
      difficulty: 2,
      img:        'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=840&q=80',
    },
    {
      slug:       'brand-campaign-shoot',
      title:      'Brand Campaign Shoot',
      category:   'BRAND',
      color:      '#a855f7',
      photos:     6,
      difficulty: 5,
      img:        'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=840&q=80',
    },
  ];

  const TOTAL   = ALBUMS.length;
  const ANGLE   = 360 / TOTAL; // 72°

  /* ============================================================
     DOM REFS
  ============================================================ */

  const section       = document.getElementById('space-carousel');
  if (!section) return;

  const canvas        = document.getElementById('starfield-canvas');
  const nebula        = document.getElementById('nebula');
  const track         = document.getElementById('track-3d');
  const particleLayer = document.getElementById('particle-layer');
  const btnPrev       = document.getElementById('btn-prev');
  const btnNext       = document.getElementById('btn-next');
  const infoCategory  = document.getElementById('info-category');
  const infoTitle     = document.getElementById('info-title');
  const infoCount     = document.getElementById('info-count');
  const infoStars     = document.getElementById('info-stars');
  const launchBtn     = document.getElementById('launch-btn');
  const hudDots       = document.querySelectorAll('.hud-dot');
  const hudPoints     = document.getElementById('hud-points');
  const toast         = document.getElementById('achievement-toast');
  const toastName     = document.getElementById('achievement-name');

  /* ============================================================
     STATE
  ============================================================ */

  let current   = 0;
  let isSpinning = false;
  let score     = 0;
  let discovered = new Set();
  let typeTimer  = null;

  /* Radius & perspective — recalculated on resize */
  function getRadius() {
    if (window.innerWidth <= 600) return 260;
    if (window.innerWidth <= 900) return 360;
    return 520;
  }

  /* ============================================================
     BUILD CARDS
  ============================================================ */

  function buildCards() {
    track.innerHTML = '';
    const radius = getRadius();

    ALBUMS.forEach((album, i) => {
      const theta = ANGLE * i;

      const card = document.createElement('div');
      card.className = 'slide-3d';
      card.dataset.index = i;
      card.dataset.slug  = album.slug;
      card.style.transform = `rotateY(${theta}deg) translateZ(${radius}px)`;
      card.style.setProperty('--card-color', album.color);

      card.innerHTML = `
        <div class="slide-3d-inner">
          <img class="slide-3d-img"
               src="${album.img}"
               alt="${album.title}"
               loading="${i === 0 ? 'eager' : 'lazy'}"
               draggable="false">
          <div class="slide-3d-overlay"></div>
          <div class="slide-3d-frame">
            <span class="corner-tr"></span>
            <span class="corner-bl"></span>
          </div>
        </div>
      `;

      /* Clicking a non-active card: navigate to it */
      card.addEventListener('click', () => {
        if (card.classList.contains('active')) {
          /* Active card click → go to album */
          window.location.href = `album.html?album=${album.slug}`;
        } else {
          /* Side card: find shortest rotation direction */
          const diff = ((i - current) + TOTAL) % TOTAL;
          if (diff <= TOTAL / 2) rotateTo(i);
          else rotateTo(i - TOTAL);
        }
      });

      track.appendChild(card);
    });
  }

  /* ============================================================
     ROTATE
  ============================================================ */

  function rotateTo(targetIndex) {
    if (isSpinning) return;
    isSpinning = true;

    current = ((targetIndex % TOTAL) + TOTAL) % TOTAL;

    const rotation = -current * ANGLE;
    track.style.transform = `rotateY(${rotation}deg)`;

    /* Update active card classes */
    document.querySelectorAll('.slide-3d').forEach((card, i) => {
      card.classList.toggle('active', i === current);
    });

    updateInfo();
    updateHUD();
    particleBurst();

    setTimeout(() => { isSpinning = false; }, 700);
  }

  function next() { rotateTo(current + 1); }
  function prev() { rotateTo(current - 1); }

  /* ============================================================
     UPDATE INFO PANEL
  ============================================================ */

  function updateInfo() {
    const album = ALBUMS[current];

    /* Category */
    infoCategory.textContent = album.category;
    infoCategory.style.color = album.color;
    document.documentElement.style.setProperty('--active-color', album.color);

    /* Nebula glow */
    if (nebula) {
      nebula.style.background = `
        radial-gradient(ellipse 70% 50% at 50% 55%,
          ${hexToRgba(album.color, 0.1)} 0%,
          transparent 70%)
      `;
    }

    /* Toast color */
    if (toast) toast.style.setProperty('--toast-color', album.color);

    /* Stars */
    infoStars.innerHTML = '';
    for (let s = 1; s <= 5; s++) {
      const star = document.createElement('span');
      star.className = 'card-star' + (s <= album.difficulty ? ' lit' : '');
      star.textContent = '★';
      infoStars.appendChild(star);
    }

    /* Photo count */
    infoCount.textContent = `${album.photos} PHOTOS`;

    /* Launch button */
    launchBtn.href = `album.html?album=${album.slug}`;
    launchBtn.style.background   = album.color;
    launchBtn.style.borderColor  = album.color;
    launchBtn.style.setProperty('--active-color', album.color);

    /* Typewriter title */
    typewriter(album.title);

    /* Gamification: discover */
    discoverAlbum(current);
  }

  /* ============================================================
     TYPEWRITER EFFECT
  ============================================================ */

  function typewriter(text) {
    clearTimeout(typeTimer);
    infoTitle.classList.add('typing');
    infoTitle.textContent = '';

    let i = 0;
    const speed = 45;

    function tick() {
      if (i < text.length) {
        infoTitle.textContent += text[i];
        i++;
        typeTimer = setTimeout(tick, speed);
      } else {
        infoTitle.classList.remove('typing');
      }
    }

    tick();
  }

  /* ============================================================
     UPDATE HUD DOTS
  ============================================================ */

  function updateHUD() {
    hudDots.forEach((dot, i) => {
      dot.classList.toggle('active-dot', i === current);
      const album = ALBUMS[i];
      dot.style.setProperty('--dot-color', album.color);
    });
  }

  /* ============================================================
     GAMIFICATION: DISCOVERY + SCORE
  ============================================================ */

  function discoverAlbum(index) {
    if (discovered.has(index)) {
      /* Already discovered: smaller bonus for revisit */
      addScore(10);
      return;
    }

    discovered.add(index);

    /* Mark dot as discovered */
    if (hudDots[index]) {
      hudDots[index].classList.add('discovered');
    }

    /* Score bonus */
    addScore(150);

    /* Achievement toast */
    showToast(ALBUMS[index]);

    /* Check if all discovered */
    if (discovered.size === TOTAL) {
      setTimeout(() => showComplete(), 800);
    }
  }

  function addScore(pts) {
    score += pts;
    if (hudPoints) {
      /* Animate count up */
      const target = score;
      const current_val = parseInt(hudPoints.textContent, 10) || 0;
      const step = Math.ceil((target - current_val) / 12);
      let val = current_val;

      function countUp() {
        val = Math.min(val + step, target);
        hudPoints.textContent = String(val).padStart(4, '0');
        if (val < target) requestAnimationFrame(countUp);
      }

      requestAnimationFrame(countUp);
    }
  }

  /* ============================================================
     ACHIEVEMENT TOAST
  ============================================================ */

  let toastTimer = null;

  function showToast(album) {
    if (!toast || !toastName) return;

    toastName.textContent = album.title;
    toast.style.setProperty('--toast-color', album.color);
    toast.classList.add('show');

    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toast.classList.remove('show');
    }, 2800);
  }

  function showComplete() {
    /* Flash all HUD dots */
    hudDots.forEach((dot, i) => {
      setTimeout(() => {
        dot.style.background = '#ffd700';
        dot.style.boxShadow  = '0 0 12px #ffd700';
      }, i * 80);
    });

    /* Special score burst */
    addScore(500);

    if (hudPoints) {
      hudPoints.style.color = '#ffd700';
    }

    /* Override toast */
    if (toast && toastName) {
      toastName.textContent = 'Collection Complete!';
      toast.style.setProperty('--toast-color', '#ffd700');
      toast.classList.add('show');
      clearTimeout(toastTimer);
      toastTimer = setTimeout(() => toast.classList.remove('show'), 4000);
    }
  }

  /* ============================================================
     PARTICLE BURST
  ============================================================ */

  function particleBurst() {
    if (!particleLayer) return;

    const color = ALBUMS[current].color;
    const cx = particleLayer.offsetWidth  / 2;
    const cy = particleLayer.offsetHeight / 2;
    const count = 18;

    for (let i = 0; i < count; i++) {
      const p = document.createElement('div');
      p.className = 'particle';

      const angle  = (Math.PI * 2 * i) / count + Math.random() * 0.4;
      const dist   = 60 + Math.random() * 120;
      const size   = 2 + Math.random() * 4;

      p.style.cssText = `
        left: ${cx}px;
        top:  ${cy}px;
        width:  ${size}px;
        height: ${size}px;
        background: ${color};
        box-shadow: 0 0 ${size * 2}px ${color};
        --tx: ${Math.cos(angle) * dist}px;
        --ty: ${Math.sin(angle) * dist}px;
        animation-duration: ${0.6 + Math.random() * 0.5}s;
        animation-delay: ${Math.random() * 0.1}s;
      `;

      particleLayer.appendChild(p);
      p.addEventListener('animationend', () => p.remove());
    }
  }

  /* ============================================================
     STARFIELD CANVAS
  ============================================================ */

  function initStarfield() {
    if (!canvas) return;

    const ctx  = canvas.getContext('2d');
    let W, H;
    let mouseX = 0.5;
    let mouseY = 0.5;

    const stars = [];
    const STAR_COUNT = 220;

    function resize() {
      W = canvas.width  = section.offsetWidth;
      H = canvas.height = section.offsetHeight;
    }

    function randomStar() {
      return {
        x:       Math.random() * W,
        y:       Math.random() * H,
        r:       Math.random() * 1.6 + 0.2,
        opacity: Math.random() * 0.7 + 0.1,
        speed:   Math.random() * 0.015 + 0.005,
        twinkle: Math.random() * Math.PI * 2, /* phase offset */
        depth:   Math.random(),               /* 0=far, 1=near */
      };
    }

    /* Shooting star state */
    let shootingStar = null;
    let shootTimer   = 0;

    function spawnShootingStar() {
      shootingStar = {
        x:  Math.random() * W * 0.6,
        y:  Math.random() * H * 0.3,
        vx: 6 + Math.random() * 6,
        vy: 3 + Math.random() * 3,
        len: 100 + Math.random() * 80,
        life: 1,
      };
    }

    /* Init stars */
    resize();
    for (let i = 0; i < STAR_COUNT; i++) stars.push(randomStar());

    let frame = 0;

    function draw() {
      ctx.clearRect(0, 0, W, H);

      /* Parallax offset based on mouse */
      const px = (mouseX - 0.5) * 24;
      const py = (mouseY - 0.5) * 16;

      /* Draw stars */
      stars.forEach(s => {
        s.twinkle += s.speed;
        const opacityMod = 0.5 + 0.5 * Math.sin(s.twinkle);
        const finalOpacity = s.opacity * opacityMod;

        /* Parallax: near stars move more */
        const ox = s.x + px * s.depth;
        const oy = s.y + py * s.depth;

        ctx.beginPath();
        ctx.arc(ox, oy, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${finalOpacity})`;
        ctx.fill();

        /* Occasional bright cross sparkle on large stars */
        if (s.r > 1.2 && opacityMod > 0.8) {
          ctx.strokeStyle = `rgba(255, 255, 255, ${finalOpacity * 0.4})`;
          ctx.lineWidth = 0.5;
          ctx.beginPath();
          ctx.moveTo(ox - s.r * 2.5, oy);
          ctx.lineTo(ox + s.r * 2.5, oy);
          ctx.moveTo(ox, oy - s.r * 2.5);
          ctx.lineTo(ox, oy + s.r * 2.5);
          ctx.stroke();
        }
      });

      /* Shooting star */
      shootTimer++;
      if (shootTimer > 280 && !shootingStar) {
        spawnShootingStar();
        shootTimer = 0;
      }

      if (shootingStar) {
        const s = shootingStar;
        const grad = ctx.createLinearGradient(
          s.x - s.vx * (s.len / 8), s.y - s.vy * (s.len / 8),
          s.x, s.y
        );
        grad.addColorStop(0, 'rgba(255,255,255,0)');
        grad.addColorStop(1, `rgba(255,255,255,${s.life})`);

        ctx.beginPath();
        ctx.moveTo(s.x - s.vx * (s.len / 8), s.y - s.vy * (s.len / 8));
        ctx.lineTo(s.x, s.y);
        ctx.strokeStyle = grad;
        ctx.lineWidth   = 1.5;
        ctx.stroke();

        s.x    += s.vx;
        s.y    += s.vy;
        s.life -= 0.025;

        if (s.life <= 0 || s.x > W || s.y > H) {
          shootingStar = null;
        }
      }

      frame++;
      requestAnimationFrame(draw);
    }

    draw();

    /* Parallax on mouse move */
    section.addEventListener('mousemove', e => {
      const rect = section.getBoundingClientRect();
      mouseX = (e.clientX - rect.left) / rect.width;
      mouseY = (e.clientY - rect.top)  / rect.height;
    }, { passive: true });

    /* Resize */
    const ro = new ResizeObserver(resize);
    ro.observe(section);
  }

  /* ============================================================
     TOUCH / SWIPE
  ============================================================ */

  let touchStartX = 0;
  let touchStartY = 0;

  section.addEventListener('touchstart', e => {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
  }, { passive: true });

  section.addEventListener('touchend', e => {
    const dx = e.changedTouches[0].clientX - touchStartX;
    const dy = e.changedTouches[0].clientY - touchStartY;

    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 40) {
      if (dx > 0) prev();
      else        next();
    }
  }, { passive: true });

  /* ============================================================
     KEYBOARD
  ============================================================ */

  document.addEventListener('keydown', e => {
    if (!section.getBoundingClientRect().width) return;
    if (e.key === 'ArrowRight') next();
    if (e.key === 'ArrowLeft')  prev();
  });

  /* ============================================================
     BUTTONS
  ============================================================ */

  if (btnPrev) btnPrev.addEventListener('click', prev);
  if (btnNext) btnNext.addEventListener('click', next);

  /* ============================================================
     RESIZE — REBUILD CARD POSITIONS
  ============================================================ */

  let resizeTimer = null;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      const radius = getRadius();
      document.querySelectorAll('.slide-3d').forEach((card, i) => {
        const theta = ANGLE * i;
        card.style.transform = `rotateY(${theta}deg) translateZ(${radius}px)`;
      });
      /* Re-apply current rotation */
      track.style.transform = `rotateY(${-current * ANGLE}deg)`;
    }, 150);
  });

  /* ============================================================
     UTILITY
  ============================================================ */

  function hexToRgba(hex, alpha) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }

  /* ============================================================
     INIT
  ============================================================ */

  buildCards();
  rotateTo(0);       /* Set initial state */
  initStarfield();

})();
