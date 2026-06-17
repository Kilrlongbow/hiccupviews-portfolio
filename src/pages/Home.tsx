import { Link } from 'react-router-dom';
import ScrollHero from '../components/ScrollHero';

const SERVICES = [
  {
    title: 'Events',
    desc: 'Concerts, parties, cultural gatherings',
    icon: (
      <>
        <circle cx="12" cy="12" r="10" />
        <path d="M8.56 2.75c4.37 6.03 6.02 9.42 8.03 17.72m2.54-15.38c-3.72 4.35-8.94 5.66-16.88 5.85m19.5 1.9c-3.5-.93-6.63-.82-8.94 0-2.58.92-5.01 2.86-7.44 6.32" />
      </>
    ),
  },
  {
    title: 'Portraits',
    desc: 'Individual & editorial portraits',
    icon: (
      <>
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </>
    ),
  },
  {
    title: 'Corporate',
    desc: 'Conferences, launches, meetings',
    icon: (
      <>
        <rect x="2" y="3" width="20" height="14" rx="2" />
        <path d="M8 21h8M12 17v4" />
      </>
    ),
  },
  {
    title: 'Brand',
    desc: 'Campaigns, products, identity',
    icon: (
      <>
        <path d="M12 2L2 7l10 5 10-5-10-5z" />
        <path d="M2 17l10 5 10-5M2 12l10 5 10-5" />
      </>
    ),
  },
  {
    title: 'Festivals',
    desc: 'Multi-day festival coverage',
    icon: (
      <>
        <path d="M3 18v-6a9 9 0 0 1 18 0v6" />
        <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3z" />
        <path d="M3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z" />
      </>
    ),
  },
];

export default function Home() {
  return (
    <>
      {/* ===== SCROLL-DRIVEN HERO ===== */}
      <ScrollHero />

      {/* ===== SERVICES TEASER ===== */}
      <section className="section section--light" aria-label="What we do">
        <div className="container">
          <div
            className="featured-intro"
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-end',
              flexWrap: 'wrap',
              gap: '1.5rem',
              marginBottom: '3rem',
            }}
          >
            <div className="featured-intro-text">
              <p className="section-label reveal">What We Do</p>
              <h2 className="reveal reveal-delay-1">
                Photography for every
                <br />
                moment that matters
              </h2>
            </div>
            <Link to="/services" className="btn btn--dark reveal reveal-delay-2">
              All Services
            </Link>
          </div>

          <div
            className="services-grid"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
              gap: 0,
              borderLeft: '1px solid rgba(0,0,0,0.08)',
            }}
          >
            {SERVICES.map((s, i) => (
              <div
                key={s.title}
                className={`service-pill reveal${i > 0 ? ` reveal-delay-${Math.min(i, 4)}` : ''}`}
                style={{
                  padding: '2rem',
                  borderRight: '1px solid rgba(0,0,0,0.08)',
                  borderBottom: '1px solid rgba(0,0,0,0.08)',
                }}
              >
                <div
                  style={{
                    width: 32,
                    height: 32,
                    border: '1px solid #c8b89a',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '1rem',
                  }}
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#c8b89a"
                    strokeWidth="1.5"
                  >
                    {s.icon}
                  </svg>
                </div>
                <h4
                  style={{
                    fontFamily: 'var(--font-serif)',
                    fontSize: '1.1rem',
                    color: 'var(--black)',
                    marginBottom: '0.5rem',
                  }}
                >
                  {s.title}
                </h4>
                <p style={{ fontSize: '0.82rem', color: '#666', lineHeight: 1.7 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CTA STRIP ===== */}
      <section
        className="section"
        aria-label="Call to action"
        style={{ textAlign: 'center', paddingBlock: 'clamp(5rem, 10vw, 9rem)' }}
      >
        <div className="container">
          <p className="section-label reveal">Let's Create</p>
          <h2
            className="reveal reveal-delay-1"
            style={{ maxWidth: 600, marginInline: 'auto', marginBottom: '1.5rem' }}
          >
            Ready to tell your story through images?
          </h2>
          <p
            className="reveal reveal-delay-2"
            style={{ maxWidth: 440, marginInline: 'auto', marginBottom: '2.5rem' }}
          >
            Whether it's an intimate portrait or a full festival — we're here to capture it.
          </p>
          <div
            className="reveal reveal-delay-3"
            style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}
          >
            <Link to="/contact" className="btn btn--primary">
              Book a Shoot
            </Link>
            <Link to="/about" className="btn btn--outline">
              Learn About Us
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
