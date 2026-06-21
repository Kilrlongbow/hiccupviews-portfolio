import { useEffect, useRef } from 'react';

export interface LightboxPhoto {
  src: string;
  /** Optional full-resolution source; falls back to src. */
  full?: string;
  alt: string;
}

interface LightboxProps {
  photos: LightboxPhoto[];
  /** Active photo index, or null when closed. */
  index: number | null;
  onClose: () => void;
  onNavigate: (index: number) => void;
}

/** Fullscreen photo viewer. Ports V1 lightbox.js (keys, swipe, counter, backdrop). */
export default function Lightbox({ photos, index, onClose, onNavigate }: LightboxProps) {
  const open = index !== null;
  const current = index ?? 0;
  const touchStart = useRef({ x: 0, y: 0 });

  const go = (next: number) => {
    if (!photos.length) return;
    onNavigate((next + photos.length) % photos.length);
  };

  // Keyboard controls while open.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') go(current - 1);
      if (e.key === 'ArrowRight') go(current + 1);
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, current, photos.length]);

  const photo = photos[current];
  const single = photos.length <= 1;

  return (
    <div
      className={`lightbox${open ? ' open' : ''}`}
      role="dialog"
      aria-modal="true"
      aria-label="Photo viewer"
      aria-hidden={!open}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      onTouchStart={(e) => {
        touchStart.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      }}
      onTouchEnd={(e) => {
        const dx = e.changedTouches[0].clientX - touchStart.current.x;
        const dy = e.changedTouches[0].clientY - touchStart.current.y;
        if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 40) {
          go(dx > 0 ? current - 1 : current + 1);
        }
      }}
    >
      <button className="lightbox-close" aria-label="Close" onClick={onClose}>
        <svg viewBox="0 0 24 24">
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>

      {!single && (
        <button className="lightbox-prev" aria-label="Previous photo" onClick={() => go(current - 1)}>
          <svg viewBox="0 0 24 24">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>
      )}

      <div className="lightbox-img-wrap">
        {photo && (
          <img
            className="lightbox-img"
            src={photo.full ?? photo.src}
            alt={photo.alt}
            draggable={false}
            // key forces the enter transition to replay on slide change
            key={photo.src}
          />
        )}
        <div className="lightbox-caption">{photo?.alt}</div>
      </div>

      {!single && (
        <button className="lightbox-next" aria-label="Next photo" onClick={() => go(current + 1)}>
          <svg viewBox="0 0 24 24">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
      )}

      <div className="lightbox-counter">
        {current + 1} / {photos.length}
      </div>
    </div>
  );
}
