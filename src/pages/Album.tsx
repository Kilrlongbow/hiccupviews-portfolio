import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { albums, DEFAULT_ALBUM } from '../data/albums';
import Lightbox from '../components/Lightbox';

export default function Album() {
  const { slug } = useParams();
  const album = albums[slug ?? ''] ?? albums[DEFAULT_ALBUM];
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  useEffect(() => {
    document.title = `${album.title} — Hiccupviews`;
    return () => {
      document.title = 'Hiccupviews — Photography & Media';
    };
  }, [album.title]);

  return (
    <>
      {/* Hero */}
      <div className="album-hero" aria-label="Album cover">
        <div
          className="album-hero-bg"
          style={{ backgroundImage: `url('${album.bg}')` }}
        ></div>
        <div className="album-hero-overlay"></div>
        <div className="album-hero-content container">
          <p className="album-hero-category">{album.category}</p>
          <h1 className="album-hero-title">{album.title}</h1>
        </div>
      </div>

      {/* Meta */}
      <div className="album-meta">
        <div className="album-meta-inner container">
          <div className="album-description">
            <Link to="/portfolio" className="album-back">
              <svg viewBox="0 0 24 24">
                <line x1="19" y1="12" x2="5" y2="12" />
                <polyline points="12 19 5 12 12 5" />
              </svg>
              Back to Portfolio
            </Link>
            <p>{album.description}</p>
          </div>

          <div className="album-stats">
            <div className="album-stat">
              <div className="album-stat-value">{album.count}</div>
              <div className="album-stat-label">Photos</div>
            </div>
            <div className="album-stat">
              <div className="album-stat-value">2026</div>
              <div className="album-stat-label">Year</div>
            </div>
          </div>
        </div>
      </div>

      {/* Photo grid */}
      <div className="photo-grid section">
        <div className="container">
          <div className="photo-columns" aria-label="Photo gallery">
            {album.photos.map((photo, i) => (
              <div
                key={`${photo.src}-${i}`}
                className="photo-item reveal"
                onClick={() => setLightboxIndex(i)}
              >
                <img src={photo.src} alt={photo.alt} loading="lazy" />
                <div className="photo-item-overlay">
                  <svg viewBox="0 0 24 24">
                    <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                  </svg>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      <section
        className="section"
        style={{ textAlign: 'center', borderTop: '1px solid rgba(255,255,255,0.06)' }}
      >
        <div className="container">
          <p className="section-label reveal">Work With Us</p>
          <h2
            className="reveal reveal-delay-1"
            style={{ maxWidth: 480, marginInline: 'auto', marginBottom: '1.5rem' }}
          >
            Like what you see?
            <br />
            Let's create something together.
          </h2>
          <div
            className="reveal reveal-delay-2"
            style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}
          >
            <Link to="/contact" className="btn btn--primary">
              Book a Shoot
            </Link>
            <Link to="/portfolio" className="btn btn--outline">
              More Albums
            </Link>
          </div>
        </div>
      </section>

      <Lightbox
        photos={album.photos}
        index={lightboxIndex}
        onClose={() => setLightboxIndex(null)}
        onNavigate={setLightboxIndex}
      />
    </>
  );
}
