import { useState, useEffect, useMemo, useRef } from 'react';
import {
  motion,
  AnimatePresence,
  useTransform,
  useSpring,
  useMotionValue,
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

const IMAGES = sphereImages;
const TOTAL_IMAGES = IMAGES.length;
const MAX_SCROLL = 3000; // virtual scroll range (wheel/touch delta accumulated)

const IMG_WIDTH = 64;
const IMG_HEIGHT = 86;

const lerp = (start: number, end: number, t: number) => start * (1 - t) + end * t;
const clamp = (v: number, min: number, max: number) => Math.min(Math.max(v, min), max);

/* ---------------- FlipCard ---------------- */

function FlipCard({
  src,
  alt,
  label,
  target,
  onClick,
}: {
  src: string;
  alt: string;
  label: string;
  target: Target;
  onClick: () => void;
}) {
  return (
    <motion.div
      animate={{
        x: target.x,
        y: target.y,
        rotate: target.rotation,
        scale: target.scale,
        opacity: target.opacity,
      }}
      transition={{ type: 'spring', stiffness: 40, damping: 15 }}
      style={{
        position: 'absolute',
        width: IMG_WIDTH,
        height: IMG_HEIGHT,
        transformStyle: 'preserve-3d',
        perspective: 1000,
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
          <img src={src} alt={alt} className="scroll-hero-img" loading="lazy" />
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

/* ---------------- ScrollHero ---------------- */

export default function ScrollHero() {
  const containerRef = useRef<HTMLElement>(null);

  const [phase, setPhase] = useState<Phase>('scatter');
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
  const [reducedMotion, setReducedMotion] = useState(false);
  const [engaged, setEngaged] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  // Mirrors used inside imperative event handlers (avoid stale closures).
  const engagedRef = useRef(false);
  const scrollRef = useRef(0);
  const lightboxOpenRef = useRef(false);

  const virtualScroll = useMotionValue(0);

  // Morph: circle (0) -> bottom arc (1) over the first slice of scroll.
  const morphProgress = useTransform(virtualScroll, [0, 600], [0, 1]);
  const smoothMorph = useSpring(morphProgress, { stiffness: 40, damping: 20 });
  // Shuffle / info progress over the remaining scroll.
  const scrollRotate = useTransform(virtualScroll, [600, MAX_SCROLL], [0, 360]);
  const smoothScrollRotate = useSpring(scrollRotate, { stiffness: 40, damping: 20 });

  // Mouse parallax.
  const mouseX = useMotionValue(0);
  const smoothMouseX = useSpring(mouseX, { stiffness: 30, damping: 20 });

  // Logo + info opacity tied to morph.
  const logoOpacity = useTransform(smoothMorph, [0, 0.4], [1, 0]);
  const logoY = useTransform(smoothMorph, [0, 0.4], [0, -20]);
  const contentOpacity = useTransform(smoothMorph, [0.75, 1], [0, 1]);
  const contentY = useTransform(smoothMorph, [0.75, 1], [20, 0]);

  // Subscribed numeric mirrors for layout math.
  const [morphValue, setMorphValue] = useState(0);
  const [rotateValue, setRotateValue] = useState(0);
  const [parallaxValue, setParallaxValue] = useState(0);

  /* --- reduced motion + intro sequence --- */
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mq.matches) {
      setReducedMotion(true);
      setPhase('circle');
      // Park at full morph (arc) but first info step.
      scrollRef.current = 600;
      virtualScroll.set(600);
      return;
    }
    window.scrollTo(0, 0);
    engagedRef.current = true;
    setEngaged(true);
    document.body.style.overflow = 'hidden';
    const t1 = setTimeout(() => setPhase('line'), 500);
    const t2 = setTimeout(() => setPhase('circle'), 2500);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      document.body.style.overflow = '';
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* --- container size --- */
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const set = () => setContainerSize({ width: el.offsetWidth, height: el.offsetHeight });
    set();
    const ro = new ResizeObserver(set);
    ro.observe(el);
    return () => ro.disconnect();
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
      advance(e.deltaY);
    };

    let touchY = 0;
    const onTouchStart = (e: TouchEvent) => {
      touchY = e.touches[0].clientY;
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
      advance(delta);
    };

    window.addEventListener('wheel', onWheel, { passive: false });
    window.addEventListener('touchstart', onTouchStart, { passive: false });
    window.addEventListener('touchmove', onTouchMove, { passive: false });
    return () => {
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

  /* --- subscribe motion values to state --- */
  useEffect(() => {
    const u1 = smoothMorph.on('change', setMorphValue);
    const u2 = smoothScrollRotate.on('change', setRotateValue);
    const u3 = smoothMouseX.on('change', setParallaxValue);
    return () => {
      u1();
      u2();
      u3();
    };
  }, [smoothMorph, smoothScrollRotate, smoothMouseX]);

  /* --- scatter positions --- */
  const scatterPositions = useMemo<Target[]>(
    () =>
      IMAGES.map(() => ({
        x: (Math.random() - 0.5) * 1500,
        y: (Math.random() - 0.5) * 1000,
        rotation: (Math.random() - 0.5) * 180,
        scale: 0.6,
        opacity: 0,
      })),
    [],
  );

  // Active info step from shuffle progress.
  const scrollProgress = clamp(rotateValue / 360, 0, 1);
  const activeStep = Math.min(Math.floor(scrollProgress * heroSlides.length), heroSlides.length - 1);
  const slide = heroSlides[activeStep];

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
    () => IMAGES.map((img) => ({ src: img.full ?? img.src, alt: img.alt })),
    [],
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
            <img src="/logo.png" alt="Hiccupviews" className="scroll-hero-logo" />
            <p className="scroll-hero-hint">Scroll to explore</p>
          </motion.div>
        </motion.div>

        {/* Changing info (fades in with the arc) */}
        <motion.div
          style={{ opacity: contentOpacity as MotionValue<number>, y: contentY }}
          className="scroll-hero-info"
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

        {/* Cards */}
        <div className="scroll-hero-cards">
          {IMAGES.map((img, i) => {
            let target: Target = { x: 0, y: 0, rotation: 0, scale: 1, opacity: 1 };

            if (phase === 'scatter') {
              target = scatterPositions[i];
            } else if (phase === 'line') {
              const spacing = 70;
              const totalW = TOTAL_IMAGES * spacing;
              target = { x: i * spacing - totalW / 2, y: 0, rotation: 0, scale: 1, opacity: 1 };
            } else {
              const isMobile = containerSize.width < 768;
              const minDim = Math.min(containerSize.width, containerSize.height);

              // Circle
              const circleRadius = Math.min(minDim * 0.35, 330);
              const circleAngle = (i / TOTAL_IMAGES) * 360;
              const circleRad = (circleAngle * Math.PI) / 180;
              const circlePos = {
                x: Math.cos(circleRad) * circleRadius,
                y: Math.sin(circleRad) * circleRadius,
                rotation: circleAngle + 90,
              };

              // Bottom arc ("rainbow", convex up)
              const baseRadius = Math.min(containerSize.width, containerSize.height * 1.5);
              const arcRadius = baseRadius * (isMobile ? 1.4 : 1.1);
              const arcApexY = containerSize.height * (isMobile ? 0.38 : 0.28);
              const arcCenterY = arcApexY + arcRadius;
              const spreadAngle = isMobile ? 100 : 130;
              const startAngle = -90 - spreadAngle / 2;
              const step = spreadAngle / (TOTAL_IMAGES - 1);
              const maxRotation = spreadAngle * 0.8;
              const boundedRotation = -scrollProgress * maxRotation;
              const arcAngle = startAngle + i * step + boundedRotation;
              const arcRad = (arcAngle * Math.PI) / 180;
              const arcPos = {
                x: Math.cos(arcRad) * arcRadius + parallaxValue,
                y: Math.sin(arcRad) * arcRadius + arcCenterY,
                rotation: arcAngle + 90,
                scale: isMobile ? 1.35 : 1.7,
              };

              target = {
                x: lerp(circlePos.x, arcPos.x, morphValue),
                y: lerp(circlePos.y, arcPos.y, morphValue),
                rotation: lerp(circlePos.rotation, arcPos.rotation, morphValue),
                scale: lerp(1, arcPos.scale, morphValue),
                opacity: 1,
              };
            }

            return (
              <FlipCard
                key={img.id}
                src={img.src}
                alt={img.alt}
                label={heroSlides[i % heroSlides.length].label}
                target={target}
                onClick={() => setLightboxIndex(i)}
              />
            );
          })}
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
