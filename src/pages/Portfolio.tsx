import { Link } from 'react-router-dom';
import AlbumStack from '../components/AlbumStack';
import { albums } from '../data/albums';

export default function Portfolio() {
  return (
    <>
      <header className="page-header" aria-label="Portfolio header">
        <div className="container">
          <p className="section-label">Our Work</p>
          <h1>Portfolio</h1>
          <div className="divider divider--center"></div>
          <p>
            Two bodies of work we’re focused on right now: intimate portraits and the quiet,
            unguarded moments inside events.
          </p>
        </div>
      </header>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <div className="portfolio-stacks reveal">
            <AlbumStack
              slug="portraits"
              label="Portraits"
              title="People, honestly seen"
              photos={albums.portraits.photos}
            />
            <AlbumStack
              slug="events"
              label="Events"
              title="The moments in between"
              photos={albums.events.photos}
            />
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
