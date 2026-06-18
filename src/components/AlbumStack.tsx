import { useState, useCallback, useEffect, useRef } from 'react';
import { motion, type PanInfo } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import type { AlbumPhoto } from '../data/albums';

interface AlbumStackProps {
  slug: string;
  label: string;
  title: string;
  photos: AlbumPhoto[];
  /** How many of the album's photos to show in the stack preview. */
  previewCount?: number;
}

const NAV_COOLDOWN = 400; // ms between card changes

/**
 * AlbumStack — an interactive 3D vertical stack of an album's photos. Scroll
 * (while hovered) or drag to cycle cards; click/tap the front card to open the
 * full album. Contained: the wheel listener is scoped to this element, so the
 * surrounding page scrolls normally. Falls back to a static cover when the user
 * prefers reduced motion.
 */
export default function AlbumStack({
  slug,
  label,
  title,
  photos,
  previewCount = 6,
}: AlbumStackProps) {
  const navigate = useNavigate();
  const cards = photos.slice(0, previewCount);
  const total = cards.length;

  const containerRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);
  const lastNav = useRef(0);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mq.matches);
    const onChange = () => setReducedMotion(mq.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  const cycle = useCallback(
    (dir: number) => {
      const now = Date.now();
      if (now - lastNav.current < NAV_COOLDOWN) return;
      lastNav.current = now;
      setCurrentIndex((prev) => (prev + dir + total) % total);
    },
    [total],
  );

  // Contained wheel: scoped to this element (not window), non-passive so we can
  // consume the gesture only while the pointer is over the stack.
  useEffect(() => {
    if (reducedMotion) return;
    const el = containerRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      // Always consume vertical wheel over the stack so the page never scrolls
      // while hovering an album; the threshold only gates card advancement.
      if (Math.abs(e.deltaY) <= Math.abs(e.deltaX)) return; // let horizontal/trackpad pans through
      e.preventDefault();
      if (Math.abs(e.deltaY) < 10) return;
      cycle(e.deltaY > 0 ? 1 : -1);
    };
    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, [cycle, reducedMotion]);

  const handleDragEnd = (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const threshold = 50;
    if (info.offset.y < -threshold) cycle(1);
    else if (info.offset.y > threshold) cycle(-1);
  };

  const open = () => navigate(`/album/${slug}`);

  // Diff-based depth styling (ported from the reference VerticalImageStack).
  const getCardStyle = (index: number) => {
    let diff = index - currentIndex;
    if (diff > total / 2) diff -= total;
    if (diff < -total / 2) diff += total;

    switch (diff) {
      case 0:
        return { y: 0, scale: 1, opacity: 1, zIndex: 5, rotateX: 0 };
      case -1:
        return { y: -120, scale: 0.84, opacity: 0.6, zIndex: 4, rotateX: 8 };
      case -2:
        return { y: -210, scale: 0.72, opacity: 0.3, zIndex: 3, rotateX: 15 };
      case 1:
        return { y: 120, scale: 0.84, opacity: 0.6, zIndex: 4, rotateX: -8 };
      case 2:
        return { y: 210, scale: 0.72, opacity: 0.3, zIndex: 3, rotateX: -15 };
      default:
        return {
          y: diff > 0 ? 320 : -320,
          scale: 0.6,
          opacity: 0,
          zIndex: 0,
          rotateX: diff > 0 ? -20 : 20,
        };
    }
  };

  const isVisible = (index: number) => {
    let diff = index - currentIndex;
    if (diff > total / 2) diff -= total;
    if (diff < -total / 2) diff += total;
    return Math.abs(diff) <= 2;
  };

  // --- Reduced-motion / no-photo fallback: a plain static cover link ---------
  if (reducedMotion || total <= 1) {
    const cover = cards[0] ?? photos[0];
    return (
      <Link to={`/album/${slug}`} className="album-stack-static" aria-label={`Open ${label} album`}>
        {cover && <img className="album-stack-img" src={cover.src} alt={label} loading="lazy" />}
        <div className="album-stack-overlay" />
        <div className="album-stack-caption">
          <p className="album-stack-label">{label}</p>
          <h3 className="album-stack-title">{title}</h3>
          <span className="album-stack-cta">View album →</span>
        </div>
      </Link>
    );
  }

  return (
    <div className="album-stack">
      <div className="album-stack-viewport" ref={containerRef}>
        {cards.map((photo, index) => {
          if (!isVisible(index)) return null;
          const style = getCardStyle(index);
          const isCurrent = index === currentIndex;

          return (
            <motion.div
              key={photo.src}
              className="album-stack-card"
              animate={{
                y: style.y,
                scale: style.scale,
                opacity: style.opacity,
                rotateX: style.rotateX,
                zIndex: style.zIndex,
              }}
              transition={{ type: 'spring', stiffness: 300, damping: 30, mass: 1 }}
              style={{ zIndex: style.zIndex }}
              drag={isCurrent ? 'y' : false}
              dragConstraints={{ top: 0, bottom: 0 }}
              dragElastic={0.2}
              onDragEnd={handleDragEnd}
              onTap={isCurrent ? open : undefined}
              role={isCurrent ? 'button' : undefined}
              tabIndex={isCurrent ? 0 : -1}
              onKeyDown={
                isCurrent
                  ? (e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        open();
                      }
                    }
                  : undefined
              }
              aria-label={isCurrent ? `Open ${label} album` : undefined}
            >
              <div className="album-stack-card-inner">
                <img
                  className="album-stack-img"
                  src={photo.src}
                  alt={photo.alt}
                  draggable={false}
                  loading={isCurrent ? 'eager' : 'lazy'}
                />
                <div className="album-stack-overlay" />
                {isCurrent && (
                  <div className="album-stack-caption">
                    <p className="album-stack-label">{label}</p>
                    <h3 className="album-stack-title">{title}</h3>
                    <span className="album-stack-cta">View album →</span>
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Counter + dots */}
      <div className="album-stack-controls">
        <div className="album-stack-counter">
          <span className="album-stack-counter-current">
            {String(currentIndex + 1).padStart(2, '0')}
          </span>
          <span className="album-stack-counter-sep">/</span>
          <span>{String(total).padStart(2, '0')}</span>
        </div>
        <div className="album-stack-dots" role="group" aria-label={`${label} preview`}>
          {cards.map((_, index) => (
            <button
              key={index}
              type="button"
              className={`album-stack-dot${index === currentIndex ? ' active' : ''}`}
              onClick={() => setCurrentIndex(index)}
              aria-label={`Show photo ${index + 1}`}
            />
          ))}
        </div>
      </div>

      <p className="album-stack-hint">Scroll or drag · click to open</p>
    </div>
  );
}
