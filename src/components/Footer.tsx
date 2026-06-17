import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="site-footer container">
      <Link to="/" className="footer-logo" aria-label="Hiccupviews home">
        <img src="/logo.png" alt="Hiccupviews" className="footer-logo-img" />
      </Link>
      <nav className="footer-links" aria-label="Footer navigation">
        <Link to="/portfolio">Portfolio</Link>
        <Link to="/services">Services</Link>
        <Link to="/about">About</Link>
        <Link to="/contact">Contact</Link>
      </nav>
      <div className="footer-social">
        <a href="#" aria-label="Instagram">
          Instagram
        </a>
        <a href="mailto:hello@hiccupviews.com">hello@hiccupviews.com</a>
      </div>
      <p className="footer-copy">&copy; 2026 Hiccupviews. All rights reserved.</p>
    </footer>
  );
}
