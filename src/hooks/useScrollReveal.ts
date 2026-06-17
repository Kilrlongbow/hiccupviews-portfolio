import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Adds the `.visible` class to every `.reveal` element when it scrolls into
 * view (the V1 design's reveal animation lives in style.css). Re-scans on every
 * route change so freshly-rendered pages animate in. Respects reduced-motion.
 */
export function useScrollReveal(): void {
  const { pathname } = useLocation();

  useEffect(() => {
    const els = Array.from(document.querySelectorAll<HTMLElement>('.reveal'));

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      els.forEach((el) => el.classList.add('visible'));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' },
    );

    els.forEach((el) => {
      // Reset in case the element was revealed on a previous mount.
      el.classList.remove('visible');
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, [pathname]);
}
