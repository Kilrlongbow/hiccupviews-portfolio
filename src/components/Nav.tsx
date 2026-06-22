import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { useScrolled } from '../hooks/useScrolled';

const LINKS = [
  { to: '/portfolio', label: 'Portfolio' },
  { to: '/services', label: 'Services' },
  { to: '/about', label: 'About' },
];

export default function Nav() {
  const scrolled = useScrolled();
  const { pathname } = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  // Inner pages have no dark hero behind the bar, so keep the frosted style
  // there from the start (matches V1's hard-coded `.scrolled` on inner pages).
  const isHome = pathname === '/';
  const showScrolled = scrolled || !isHome;

  // Close the mobile menu whenever the route changes.
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  // Lock body scroll + close on Escape while the overlay is open.
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMenuOpen(false);
    };
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  return (
    <>
      <nav
        className={`site-nav${showScrolled ? ' scrolled' : ''}`}
        role="navigation"
        aria-label="Main navigation"
      >
        <Link to="/" className="nav-logo" aria-label="Hiccupviews home">
          <img src="/logo-icon.png" alt="Hiccupviews" className="nav-logo-img" />
        </Link>

        <div className="nav-links">
          {LINKS.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className={({ isActive }) => (isActive ? 'active' : undefined)}
            >
              {l.label}
            </NavLink>
          ))}
          <NavLink
            to="/contact"
            className={({ isActive }) => `nav-cta${isActive ? ' active' : ''}`}
          >
            Book a Shoot
          </NavLink>
        </div>

        <button
          className={`nav-hamburger${menuOpen ? ' open' : ''}`}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((o) => !o)}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </nav>

      <div
        className={`nav-mobile-overlay${menuOpen ? ' open' : ''}`}
        role="dialog"
        aria-label="Mobile navigation"
      >
        <Link to="/portfolio">Portfolio</Link>
        <Link to="/services">Services</Link>
        <Link to="/about">About</Link>
        <Link to="/contact">Contact</Link>
        <div className="nav-mobile-social">
          <a href="#" aria-label="Instagram">
            Instagram
          </a>
          <a href="mailto:hello@hiccupviews.com">Email</a>
        </div>
      </div>
    </>
  );
}
