import { useState, useEffect, useMemo, useRef } from 'react';
import {
  motion,
  AnimatePresence,
  animate,
  useTransform,
  useSpring,
  useMotionValue,
  useMotionValueEvent,
  type MotionValue,
} from 'framer-motion';
import { sphereImages } from '../data/sphereImages';
import { heroSlides } from '../data/heroSlides';
import Lightbox from './Lightbox';

type Phase = 'scatter' | 'line' | 'circle';

interface Target {
  x: number;
  y: number;
  rotation: number;
  scale: number;
  opacity: number;
}

// Mobile shows a subset of the sphere photos (see `images` below).
const MOBILE_IMAGE_COUNT = 18;
// Mobile cards are drawn smaller in the intro circle so they all fit the ring.
const MOBILE_CIRCLE_SCALE = 0.75;
// Mobile arc: fixed angle between neighbouring cards (the strip scrolls past the screen).
const MOBILE_ARC_STEP = 9.2;
// Mobile touch: scroll gain and fling momentum (per-16ms decay).
const TOUCH_GAIN = 1.6;
const FLING_DECAY = 0.95;
// Fixed site header height (nav.css: 38px logo + 1.5rem padding top/bottom).
const NAV_HEIGHT = 86;
const MAX_SCROLL = 3000; // virtual scroll range (wheel/touch delta accumulated)

const IMG_WIDTH = 64;
const IMG_HEIGHT = 86;

const lerp = (start: number, end: number, t: number) => start * (1 - t) + end * t;
const clamp = (v: number, min: number, max: number) => Math.min(Math.max(v, min), max);
/** Wrap an angle (degrees) into (-180, 180]. */
const normalizeAngle = (a: number) => a - 360 * Math.ceil((a - 180) / 360);

// Single smoothing stage for scroll-driven values: overdamped, so no overshoot.
const SCROLL_SPRING = { stiffness: 90, damping: 26, restDelta: 0.0005 };
const INTRO_EASE = [0.22, 1, 0.36, 1] as const;
// Max virtual-scroll distance a single wheel event may contribute.
const MAX_WHEEL_STEP = 80;

interface Size {
  width: number;
  height: number;
}

// Logo PNG aspect (height / width) and the "Scroll to explore" hint block below it.
const LOGO_ASPECT = 388 / 739;
const LOGO_HINT_BLOCK = 40;
const LOGO_MAX_WIDTH = 560;
// Breathing room between the ring of cards and the logo / info text.
const RING_GAP = 16;
const INFO_GAP = 20;

const isMobileSize = (size: Size) => size.width < 768;
const circleRadiusFor = (size: Size) => Math.min(Math.min(size.width, size.height) * 0.35, 330);
const circleScaleFor = (size: Size) => (isMobileSize(size) ? MOBILE_CIRCLE_SCALE : 1);

/** Bottom arc ("rainbow", convex up) geometry, relative to the stage centre. */
function arcGeometry(size: Size) {
  const isMobile = isMobileSize(size);
  const baseRadius = Math.min(size.width, size.height * 1.5);
  const arcRadius = baseRadius * (isMobile ? 1.4 : 1.1);
  const arcApexY = size.height * (isMobile ? 0.3 : 0.28);
  return {
    isMobile,
    arcRadius,
    arcApexY,
    arcCenterY: arcApexY + arcRadius,
    spreadAngle: isMobile ? 100 : 130,
    arcScale: isMobile ? 1.35 : 1.7,
  };
}

/**
 * Widest logo whose block (logo + hint), centred on the stage, fits inside the
 * ring of cards: solves (w/2)^2 + ((a*w + hint)/2)^2 = inner^2 for w.
 */
function logoWidthFor(size: Size) {
  const inner = circleRadiusFor(size) - (IMG_HEIGHT / 2) * circleScaleFor(size) - RING_GAP;
  if (inner <= 0) return 0;
  const a = LOGO_ASPECT;
  const h = LOGO_HINT_BLOCK;
  const qa = 1 + a * a;
  const qb = 2 * a * h;
  const qc = h * h - 4 * inner * inner;
  const w = (-qb + Math.sqrt(qb * qb - 4 * qa * qc)) / (2 * qa);
  return clamp(w, 0, LOGO_MAX_WIDTH);
}

/** Y (from the top of the stage) of the top edge of the arc's apex card. */
function arcTopFor(size: Size) {
  const { arcApexY, arcScale } = arcGeometry(size);
  return size.height / 2 + arcApexY - (IMG_HEIGHT / 2) * arcScale;
}

/**
 * Pure layout for card `i`. `intro` runs 0 (scatter) -> 1 (line) -> 2 (circle);
 * once at 2, `morph` blends circle -> bottom arc and `progress` (0-1) slides the arc.
 */
function computeTarget(
  i: number,
  total: number,
  size: Size,
  scatter: Target,
  intro: number,
  morph: number,
  progress: number,
  parallax: number,
): Target {
  const spacing = 70;
  const line: Target = { x: i * spacing - (total * spacing) / 2, y: 0, rotation: 0, scale: 1, opacity: 1 };

  if (intro <= 1) {
    const t = clamp(intro, 0, 1);
    return {
      x: lerp(scatter.x, line.x, t),
      y: lerp(scatter.y, line.y, t),
      rotation: lerp(scatter.rotation, line.rotation, t),
      scale: lerp(scatter.scale, line.scale, t),
      opacity: lerp(scatter.opacity, line.opacity, t),
    };
  }

  // Circle
  const circleRadius = circleRadiusFor(size);
  const circleAngle = (i / total) * 360;
  const circleRad = (circleAngle * Math.PI) / 180;
  const circleRotation = normalizeAngle(circleAngle + 90);

  // Bottom arc
  const { isMobile, arcRadius, arcCenterY, spreadAngle, arcScale } = arcGeometry(size);
  let arcAngle: number;
  if (isMobile) {
    // A strip longer than the screen that scrolls through the visible window:
    // first card at the left edge at progress 0, last card at the right edge at 1.
    const halfView = (Math.asin(Math.min(1, size.width / 2 / arcRadius)) * 180) / Math.PI;
    const strip = MOBILE_ARC_STEP * (total - 1);
    const travel = Math.max(0, strip - 2 * halfView);
    arcAngle = -90 - halfView + i * MOBILE_ARC_STEP - progress * travel;
  } else {
    const startAngle = -90 - spreadAngle / 2;
    const step = spreadAngle / (total - 1);
    arcAngle = startAngle + i * step - progress * spreadAngle * 0.8;
  }
  const arcRad = (arcAngle * Math.PI) / 180;
  // Take the shortest way round from the circle's rotation to the arc's.
  const arcRotation = circleRotation + normalizeAngle(arcAngle + 90 - circleRotation);

  const m = clamp(morph, 0, 1);
  const shaped: Target = {
    x: lerp(Math.cos(circleRad) * circleRadius, Math.cos(arcRad) * arcRadius + parallax, m),
    y: lerp(Math.sin(circleRad) * circleRadius, Math.sin(arcRad) * arcRadius + arcCenterY, m),
    rotation: lerp(circleRotation, arcRotation, m),
    scale: lerp(circleScaleFor(size), arcScale, m),
    opacity: 1,
  };

  const t = clamp(intro - 1, 0, 1);
  return {
    x: lerp(line.x, shaped.x, t),
    y: lerp(line.y, shaped.y, t),
    rotation: lerp(line.rotation, shaped.rotation, t),
    scale: lerp(line.scale, shaped.scale, t),
    opacity: 1,
  };
}

/* ---------------- FlipCard ---------------- */

function FlipCard({
  src,
  alt,
  label,
  layout,
  onClick,
}: {
  src: string;
  alt: string;
  label: string;
  /** Per-frame target, derived from shared motion values (no React re-render). */
  layout: MotionValue<Target>;
  onClick: () => void;
}) {
  const x = useTransform(layout, (t) => t.x);
  const y = useTransform(layout, (t) => t.y);
  const rotate = useTransform(layout, (t) => t.rotation);
  const scale = useTransform(layout, (t) => t.scale);
  const opacity = useTransform(layout, (t) => t.opacity);

  return (
    <motion.div
      style={{
        position: 'absolute',
        width: IMG_WIDTH,
        height: IMG_HEIGHT,
        transformStyle: 'preserve-3d',
        x,
        y,
        rotate,
        scale,
        opacity,
      }}
      className="scroll-hero-card group"
      onClick={onClick}
    >
      <motion.div
        className="scroll-hero-card-inner"
        style={{ transformStyle: 'preserve-3d' }}
        transition={{ duration: 0.6, type: 'spring', stiffness: 260, damping: 20 }}
        whileHover={{ rotateY: 180 }}
      >
        {/* Front */}
        <div className="scroll-hero-face scroll-hero-face--front">
          <img src={src} alt={alt} className="scroll-hero-img" loading="eager" decoding="async" />
          <div className="scroll-hero-img-shade" />
        </div>
        {/* Back */}
        <div className="scroll-hero-face scroll-hero-face--back">
          <span className="scroll-hero-back-label">{label}</span>
        </div>
      </motion.div>
    </motion.div>
  );
}

/** Binds one card's layout to the shared motion values. */
function HeroCard({
  index,
  total,
  size,
  scatter,
  intro,
  morph,
  rotate,
  parallax,
  ...card
}: {
  index: number;
  total: number;
  size: Size;
  scatter: Target;
  intro: MotionValue<number>;
  morph: MotionValue<number>;
  rotate: MotionValue<number>;
  parallax: MotionValue<number>;
  src: string;
  alt: string;
  label: string;
  onClick: () => void;
}) {
  const layout = useTransform(
    [intro, morph, rotate, parallax],
    ([introV, morphV, rotateV, parallaxV]: number[]) =>
      computeTarget(index, total, size, scatter, introV, morphV, clamp(rotateV / 360, 0, 1), parallaxV),
  );
  return <FlipCard {...card} layout={layout} />;
}

/* ---------------- ScrollHero ---------------- */

export default function ScrollHero() {
  const containerRef = useRef<HTMLElement>(null);

  const [phase, setPhase] = useState<Phase>('scatter');
  const [containerSize, setContainerSize] = useState<Size>({ width: 0, height: 0 });
  const [reducedMotion, setReducedMotion] = useState(false);
  const [isMobileView, setIsMobileView] = useState(false);
  const [engaged, setEngaged] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  // Mirrors used inside imperative event handlers (avoid stale closures).
  const engagedRef = useRef(false);
  const scrollRef = useRef(0);
  const lightboxOpenRef = useRef(false);

  // Mobile shows fewer photos so the circle/arc isn't crowded on small screens.
  const images = useMemo(
    () => (isMobileView ? sphereImages.slice(0, MOBILE_IMAGE_COUNT) : sphereImages),
    [isMobileView],
  );
  const total = images.length;

  // Intro timeline: 0 = scatter, 1 = line, 2 = circle.
  const intro = useMotionValue(0);
  const virtualScroll = useMotionValue(0);

  // Morph: circle (0) -> bottom arc (1) over the first slice of scroll.
  const morphProgress = useTransform(virtualScroll, [0, 600], [0, 1]);
  const smoothMorph = useSpring(morphProgress, SCROLL_SPRING);
  // Shuffle / info progress over the remaining scroll.
  const scrollRotate = useTransform(virtualScroll, [600, MAX_SCROLL], [0, 360]);
  const smoothScrollRotate = useSpring(scrollRotate, SCROLL_SPRING);

  // Mouse parallax.
  const mouseX = useMotionValue(0);
  const smoothMouseX = useSpring(mouseX, { stiffness: 50, damping: 25 });

  // Logo + info opacity tied to morph. On mobile the centered logo fades out
  // almost immediately once scrolling starts (tighter range).
  // On mobile the logo stays and glides up into the gap between header and info text.
  const infoRef = useRef<HTMLDivElement>(null);
  const [infoHeight, setInfoHeight] = useState(0);
  const logoOpacity = useTransform(smoothMorph, (m) =>
    isMobileView ? 1 : 1 - clamp(m / 0.4, 0, 1),
  );
  const logoY = useTransform(smoothMorph, (m) => {
    if (!isMobileView) return lerp(0, -20, clamp(m / 0.4, 0, 1));
    if (!containerSize.height) return 0;
    const logoH = logoWidthFor(containerSize) * LOGO_ASPECT;
    const textTop = arcTopFor(containerSize) - INFO_GAP - infoHeight;
    const targetCenter = Math.max(NAV_HEIGHT + logoH / 2, (NAV_HEIGHT + textTop) / 2);
    // At rest the logo sits half a hint-block above the stage centre.
    const restCenter = containerSize.height / 2 - LOGO_HINT_BLOCK / 2;
    return lerp(0, targetCenter - restCenter, clamp(m, 0, 1));
  });
  const hintOpacity = useTransform(smoothMorph, [0, 0.3], [1, 0]);
  const contentOpacity = useTransform(smoothMorph, [0.75, 1], [0, 1]);
  const contentY = useTransform(smoothMorph, [0.75, 1], [20, 0]);

  // Only re-render when the info step actually changes (React bails out on equal state).
  useMotionValueEvent(smoothScrollRotate, 'change', (v) => {
    const progress = clamp(v / 360, 0, 1);
    setActiveStep(Math.min(Math.floor(progress * heroSlides.length), heroSlides.length - 1));
  });

  /* --- reduced motion + intro sequence --- */
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mq.matches) {
      setReducedMotion(true);
      setPhase('circle');
      intro.set(2);
      // Park at full morph (arc) but first info step.
      scrollRef.current = 600;
      virtualScroll.set(600);
      return;
    }
    window.scrollTo(0, 0);
    engagedRef.current = true;
    setEngaged(true);
    document.body.style.overflow = 'hidden';
    const toLine = animate(intro, 1, { delay: 0.5, duration: 1.6, ease: INTRO_EASE });
    let toCircle: ReturnType<typeof animate> | undefined;
    const t1 = setTimeout(() => setPhase('line'), 500);
    const t2 = setTimeout(() => {
      setPhase('circle');
      toCircle = animate(intro, 2, { duration: 1.4, ease: INTRO_EASE });
    }, 2500);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      toLine.stop();
      toCircle?.stop();
      document.body.style.overflow = '';
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* --- container size (rAF-throttled; ignores mobile URL-bar height jitter) --- */
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const coarse = window.matchMedia('(pointer: coarse)').matches;
    let raf = 0;
    const set = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const next = { width: el.offsetWidth, height: el.offsetHeight };
        setContainerSize((prev) => {
          if (prev.width === next.width && prev.height === next.height) return prev;
          const heightOnly = prev.width === next.width && prev.height > 0;
          if (coarse && heightOnly && Math.abs(prev.height - next.height) < 150) return prev;
          return next;
        });
      });
    };
    set();
    const ro = new ResizeObserver(set);
    ro.observe(el);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, []);

  /* --- info block height (mobile logo sits above it) --- */
  useEffect(() => {
    const el = infoRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setInfoHeight(el.offsetHeight));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  /* --- mobile breakpoint (drives photo count + logo behaviour) --- */
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 768px)');
    setIsMobileView(mq.matches);
    const onChange = () => setIsMobileView(mq.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  /* --- scroll-jack wheel + touch --- */
  useEffect(() => {
    if (reducedMotion) return;

    const releaseDown = () => {
      engagedRef.current = false;
      setEngaged(false);
      document.body.style.overflow = '';
      const h = containerRef.current?.offsetHeight ?? window.innerHeight;
      window.scrollTo({ top: h, behavior: 'smooth' });
    };

    const reengage = () => {
      engagedRef.current = true;
      setEngaged(true);
      document.body.style.overflow = 'hidden';
      window.scrollTo(0, 0);
    };

    const advance = (delta: number) => {
      const current = scrollRef.current;
      if (delta > 0 && current >= MAX_SCROLL) {
        releaseDown();
        return;
      }
      const next = clamp(current + delta, 0, MAX_SCROLL);
      scrollRef.current = next;
      virtualScroll.set(next);
    };

    const onWheel = (e: WheelEvent) => {
      if (lightboxOpenRef.current) return; // lightbox owns input while open
      if (!engagedRef.current) {
        if (e.deltaY < 0 && window.scrollY <= 0) {
          reengage();
          e.preventDefault();
        }
        return;
      }
      e.preventDefault();
      // Normalise line/page units to pixels and cap big mouse-wheel jumps.
      let delta = e.deltaY;
      if (e.deltaMode === 1) delta *= 16;
      else if (e.deltaMode === 2) delta *= window.innerHeight;
      advance(clamp(delta, -MAX_WHEEL_STEP, MAX_WHEEL_STEP));
    };

    // Fling: keep gliding after the finger lifts, like native scrolling.
    let touchY = 0;
    let lastMoveT = 0;
    let velocity = 0; // virtual px per ms
    let flingRaf = 0;
    const stopFling = () => cancelAnimationFrame(flingRaf);
    const fling = () => {
      let prev = performance.now();
      const step = (now: number) => {
        const dt = Math.min(now - prev, 64);
        prev = now;
        velocity *= Math.pow(FLING_DECAY, dt / 16);
        if (!engagedRef.current || Math.abs(velocity) < 0.02) return;
        const next = clamp(scrollRef.current + velocity * dt, 0, MAX_SCROLL);
        scrollRef.current = next;
        virtualScroll.set(next);
        if (next === 0 || next === MAX_SCROLL) return; // stop at the ends; release needs a real swipe
        flingRaf = requestAnimationFrame(step);
      };
      flingRaf = requestAnimationFrame(step);
    };

    const onTouchStart = (e: TouchEvent) => {
      stopFling();
      velocity = 0;
      touchY = e.touches[0].clientY;
      lastMoveT = e.timeStamp;
    };
    const onTouchEnd = (e: TouchEvent) => {
      // Only fling if the finger was still moving when it lifted.
      if (engagedRef.current && e.timeStamp - lastMoveT < 80) fling();
    };
    const onTouchMove = (e: TouchEvent) => {
      if (lightboxOpenRef.current) return; // lightbox owns input while open
      const y = e.touches[0].clientY;
      const delta = touchY - y;
      touchY = y;
      if (!engagedRef.current) {
        if (delta < 0 && window.scrollY <= 0) {
          reengage();
          e.preventDefault();
        }
        return;
      }
      e.preventDefault();
      const scaled = delta * TOUCH_GAIN;
      const dt = Math.max(1, e.timeStamp - lastMoveT);
      lastMoveT = e.timeStamp;
      velocity = 0.8 * (scaled / dt) + 0.2 * velocity;
      advance(scaled);
    };

    window.addEventListener('wheel', onWheel, { passive: false });
    window.addEventListener('touchstart', onTouchStart, { passive: false });
    window.addEventListener('touchmove', onTouchMove, { passive: false });
    window.addEventListener('touchend', onTouchEnd);
    return () => {
      stopFling();
      window.removeEventListener('touchend', onTouchEnd);
      window.removeEventListener('wheel', onWheel);
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reducedMotion]);

  /* --- mouse parallax --- */
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const onMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouseX.set(nx * 80);
    };
    el.addEventListener('mousemove', onMove);
    return () => el.removeEventListener('mousemove', onMove);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* --- scatter positions --- */
  const scatterPositions = useMemo<Target[]>(
    () =>
      images.map(() => ({
        x: (Math.random() - 0.5) * 1500,
        y: (Math.random() - 0.5) * 1000,
        rotation: (Math.random() - 0.5) * 180,
        scale: 0.6,
        opacity: 0,
      })),
    [images],
  );

  const slide = heroSlides[activeStep];
  const logoWidth = containerSize.width ? logoWidthFor(containerSize) : 0;

  const skip = () => {
    engagedRef.current = false;
    setEngaged(false);
    document.body.style.overflow = '';
    const h = containerRef.current?.offsetHeight ?? window.innerHeight;
    window.scrollTo({ top: h, behavior: 'smooth' });
  };

  /* --- lightbox: keep ref in sync; re-assert scroll lock on close while engaged --- */
  useEffect(() => {
    const open = lightboxIndex !== null;
    lightboxOpenRef.current = open;
    // Lightbox restores body.overflow='' on close; if the hero is still engaged,
    // re-assert the scroll lock so the page can't leak-scroll behind it.
    if (!open && engagedRef.current) {
      document.body.style.overflow = 'hidden';
    }
  }, [lightboxIndex]);

  const lightboxPhotos = useMemo(
    () => images.map((img) => ({ src: img.full ?? img.src, alt: img.alt })),
    [images],
  );

  return (
    <section ref={containerRef} className="scroll-hero" aria-label="Hero">
      <div className="scroll-hero-stage">
        {/* Intro: logo (fades out as the arc forms) */}
        <motion.div
          className="scroll-hero-intro"
          initial={{ opacity: 0 }}
          animate={{ opacity: phase === 'circle' ? 1 : 0 }}
          transition={{ duration: 1 }}
        >
          <motion.div style={{ opacity: logoOpacity, y: logoY }} className="scroll-hero-intro-inner">
            <img
              src="/logo.png"
              alt="Hiccupviews"
              className="scroll-hero-logo"
              style={logoWidth ? { width: logoWidth } : undefined}
            />
            <motion.p className="scroll-hero-hint" style={{ opacity: hintOpacity }}>
              Scroll to explore
            </motion.p>
          </motion.div>
        </motion.div>

        {/* Changing info (fades in with the arc) */}
        <div
          className="scroll-hero-info"
          style={containerSize.height ? { top: arcTopFor(containerSize) - INFO_GAP } : undefined}
        >
          <motion.div
            style={{ opacity: contentOpacity as MotionValue<number>, y: contentY }}
            ref={infoRef}
            className="scroll-hero-info-inner"
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={activeStep}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.4 }}
              >
                <p className="scroll-hero-info-label">{slide.label}</p>
                <h1 className="scroll-hero-info-title">{slide.title}</h1>
                <p className="scroll-hero-info-text">{slide.text}</p>
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </div>

        {/* Cards */}
        <div className="scroll-hero-cards">
          {images.map((img, i) => (
            <HeroCard
              key={img.id}
              index={i}
              total={total}
              size={containerSize}
              scatter={scatterPositions[i]}
              intro={intro}
              morph={smoothMorph}
              rotate={smoothScrollRotate}
              parallax={smoothMouseX}
              src={img.src}
              alt={img.alt}
              label={heroSlides[i % heroSlides.length].label}
              onClick={() => setLightboxIndex(i)}
            />
          ))}
        </div>
      </div>

      {engaged && (
        <button type="button" className="scroll-hero-skip" onClick={skip}>
          Skip ↓
        </button>
      )}

      <Lightbox
        photos={lightboxPhotos}
        index={lightboxIndex}
        onClose={() => setLightboxIndex(null)}
        onNavigate={setLightboxIndex}
      />
    </section>
  );
}
