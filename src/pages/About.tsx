import { Link } from 'react-router-dom';

export default function About() {
  return (
    <>
      {/* Page header */}
      <header className="page-header" aria-label="About header">
        <div className="container">
          <p className="section-label">About</p>
          <h1>Hiccupviews</h1>
          <div className="divider divider--center"></div>
          <p>Photography that lives in the moments between moments.</p>
        </div>
      </header>

      {/* Story */}
      <section className="about-story section" aria-label="Brand story">
        <div className="container">
          <div className="about-story-inner">
            <div className="about-story-sticky">
              <p className="section-label">My Story</p>
              <h2 className="about-tagline">
                Seeing what others miss. Capturing what others forget.
              </h2>
              <div className="divider"></div>
              <blockquote className="about-quote">
                "Photography is not about the camera. It's about the eye, the instinct, and the
                willingness to be present."
              </blockquote>
            </div>

            <div className="about-story-text">
              <p>
                Hiccupviews was born from a simple obsession: the moments between moments. The laugh
                before the performance. The stillness after the crowd has gone. The expression
                nobody else noticed.
              </p>
              <p>
                It's a creative photography practice rooted in Eindhoven, focused on event and
                portrait photography. My work spans the full spectrum of human gathering, from
                intimate portrait sessions to the quiet, unguarded moments inside a crowded room.
              </p>
              <p>
                What sets the work apart isn't just technical skill. It's perspective. I approach
                every assignment with curiosity and a filmmaker's eye, looking for the story within
                the story, the detail that reveals the whole.
              </p>
              <p>
                People come to me when they want photography that goes beyond documentation. When
                they want images that make you feel the room, even from the other side of the world.
              </p>

              <div className="about-values">
                {[
                  ['Authenticity', "I don't construct moments. I reveal them. Real energy, real emotion."],
                  ['Craft', 'Every frame is intentional. Lighting, composition, timing, all considered.'],
                  ['Presence', "I blend into every environment to capture what's real, not what's posed."],
                  ['Delivery', 'Fast turnaround, consistent quality, clear communication throughout.'],
                ].map(([title, body]) => (
                  <div className="about-value" key={title}>
                    <h4 className="about-value-title">{title}</h4>
                    <p>{body}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Photographer */}
      <section className="about-portrait section" aria-label="The photographer">
        <div className="container">
          <div className="about-photographer reveal">
            <p className="section-label">Behind the Lens</p>
            <h2 className="about-name">Eugene Chivurayise</h2>
            <p className="about-role">Founder &amp; Photographer · Eindhoven</p>
            <div className="divider divider--center"></div>

            <div className="about-bio">
              <p>
                I'm Eugene Chivurayise, the photographer behind Hiccupviews. I'm based in Eindhoven,
                where I spend most of my time photographing people: at events, in portrait sessions,
                and everywhere the two overlap.
              </p>
              <p>
                My work lives in the quiet moments: the laugh before the performance, the pause in a
                conversation, the way someone carries themselves when they think no one is watching.
                I'm less interested in the perfect pose than in what's real.
              </p>
              <p>
                Whether it's a room full of people or a single face, my goal is the same: to make
                images that still feel like the moment they came from.
              </p>
            </div>

            <div className="about-social-links">
              <a href="#" className="about-social-link" aria-label="Instagram">
                <svg viewBox="0 0 24 24">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                </svg>
                @hiccupviews
              </a>
              <a href="mailto:hello@hiccupviews.com" className="about-social-link" aria-label="Email">
                <svg viewBox="0 0 24 24">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
                hello@hiccupviews.com
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="about-cta" aria-label="Call to action">
        <div className="about-cta-content container reveal">
          <p className="section-label">Let's Collaborate</p>
          <h2 style={{ marginBottom: '1rem' }}>Let's work together.</h2>
          <p>
            Whether you have a brief or just an idea, get in touch and let's build something worth
            remembering.
          </p>
          <div
            style={{
              display: 'flex',
              gap: '1rem',
              justifyContent: 'center',
              flexWrap: 'wrap',
              marginTop: '2.5rem',
            }}
          >
            <Link to="/contact" className="btn btn--primary">
              Start a Project
            </Link>
            <Link to="/portfolio" className="btn btn--outline">
              View Portfolio
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
