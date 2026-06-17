import { useState } from 'react';
import { Link } from 'react-router-dom';

interface Card {
  slug: string;
  category: string; // filter key
  categoryLabel: string;
  title: string;
  img: string;
  featured?: boolean;
}

const FILTERS = [
  { key: 'all', label: 'All' },
  { key: 'events', label: 'Events' },
  { key: 'portraits', label: 'Portraits' },
  { key: 'brand', label: 'Brand' },
  { key: 'corporate', label: 'Corporate' },
  { key: 'festivals', label: 'Festivals' },
];

const CARDS: Card[] = [
  {
    slug: 'amsterdam-night-festival',
    category: 'events',
    categoryLabel: 'Events',
    title: 'Amsterdam Night Festival',
    img: 'https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?w=1200&q=80',
    featured: true,
  },
  {
    slug: 'portrait-series',
    category: 'portraits',
    categoryLabel: 'Portraits',
    title: 'Portrait Series',
    img: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=800&q=80',
  },
  {
    slug: 'summer-rooftop-party',
    category: 'events',
    categoryLabel: 'Events',
    title: 'Summer Rooftop Party',
    img: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=800&q=80',
  },
  {
    slug: 'brand-campaign-shoot',
    category: 'brand',
    categoryLabel: 'Brand',
    title: 'Brand Campaign Shoot',
    img: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=800&q=80',
  },
  {
    slug: 'corporate-event-coverage',
    category: 'corporate',
    categoryLabel: 'Corporate',
    title: 'Corporate Event Coverage',
    img: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80',
  },
  {
    slug: 'amsterdam-night-festival',
    category: 'festivals',
    categoryLabel: 'Festivals',
    title: 'Festival Coverage',
    img: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&q=80',
  },
  {
    slug: 'portrait-series',
    category: 'portraits',
    categoryLabel: 'Portraits',
    title: 'Studio Portraits',
    img: 'https://images.unsplash.com/photo-1502767882564-6dd3f0b4d534?w=800&q=80',
  },
  {
    slug: 'brand-campaign-shoot',
    category: 'brand',
    categoryLabel: 'Brand',
    title: 'Fashion Brand Shoot',
    img: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800&q=80',
  },
  {
    slug: 'summer-rooftop-party',
    category: 'events',
    categoryLabel: 'Events',
    title: 'Club Night',
    img: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&q=80',
  },
];

export default function Portfolio() {
  const [filter, setFilter] = useState('all');

  const visible = CARDS.filter((c) => filter === 'all' || c.category === filter);

  return (
    <>
      <header className="page-header" aria-label="Portfolio header">
        <div className="container">
          <p className="section-label">Our Work</p>
          <h1>Portfolio</h1>
          <div className="divider divider--center"></div>
          <p>
            A curated selection of photography across events, portraits, brand campaigns,
            festivals, and corporate media.
          </p>
        </div>
      </header>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <div className="portfolio-filter reveal" role="group" aria-label="Filter by category">
            {FILTERS.map((f) => (
              <button
                key={f.key}
                className={`filter-btn${filter === f.key ? ' active' : ''}`}
                onClick={() => setFilter(f.key)}
              >
                {f.label}
              </button>
            ))}
          </div>

          <div className="portfolio-grid">
            {visible.map((c, i) => (
              <Link
                key={`${c.title}-${i}`}
                className={`album-card${c.featured ? ' album-card--featured' : ''} reveal`}
                to={`/album/${c.slug}`}
              >
                <div className="album-card-img-wrap">
                  <img
                    className="album-card-img"
                    src={c.img}
                    alt={c.title}
                    loading={c.featured ? 'eager' : 'lazy'}
                  />
                  <div className="album-card-overlay"></div>
                  <div className="album-card-info">
                    <p className="album-card-category">{c.categoryLabel}</p>
                    <h3 className="album-card-title">{c.title}</h3>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section
        className="section"
        style={{ textAlign: 'center', borderTop: '1px solid rgba(255,255,255,0.06)' }}
      >
        <div className="container">
          <p className="section-label reveal">Work With Us</p>
          <h2
            className="reveal reveal-delay-1"
            style={{ maxWidth: 500, marginInline: 'auto', marginBottom: '1.5rem' }}
          >
            Want your story added to this collection?
          </h2>
          <Link to="/contact" className="btn btn--primary reveal reveal-delay-2">
            Get in Touch
          </Link>
        </div>
      </section>
    </>
  );
}
