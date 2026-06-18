import { Link } from 'react-router-dom';

interface ServiceBlock {
  num: string;
  title: string;
  type: string; // contact ?type= value
  img: string;
  alt: string;
  desc: string;
  features: string[];
}

const SERVICES: ServiceBlock[] = [
  {
    num: '01',
    title: 'Event Photography',
    type: 'event',
    img: '/photos/events/KLR02385-full.jpg',
    alt: 'Event photography — crowd at a live event',
    desc: 'We document events through both the energy and the intimacy within them — preserving not just what happened, but how it felt. Every event becomes a visual memory built from authentic interactions.',
    features: [
      'Concerts & live performances',
      'Private parties & gatherings',
      'Club nights & venue coverage',
      'Cultural & community events',
    ],
  },
  {
    num: '02',
    title: 'Portrait Sessions',
    type: 'portrait',
    img: '/photos/portraits/KLR00636-full.jpg',
    alt: 'Portrait session',
    desc: 'Intimate, editorial portraits that capture people as they are rather than a version of who they should be. The goal is not perfection but presence — expression, environment, and the details that make someone feel human.',
    features: [
      'Individual & group portraits',
      'Professional headshots',
      'Artist & musician photography',
      'Creative portrait series',
    ],
  },
];

export default function Services() {
  return (
    <>
      <header className="page-header">
        <div className="container">
          <p className="section-label">What We Offer</p>
          <h1>Services</h1>
          <div className="divider divider--center"></div>
          <p>
            From intimate portrait sessions to full-scale event coverage — we bring the same
            creative eye to every assignment.
          </p>
        </div>
      </header>

      <div className="services-list">
        {SERVICES.map((s, i) => (
          <article
            key={s.num}
            className={`service-block${i % 2 === 1 ? ' service-block--reverse' : ''} reveal`}
            aria-label={s.title}
          >
            <div className="service-img-wrap">
              <img className="service-img" src={s.img} alt={s.alt} loading="lazy" />
              <div className="service-img-overlay"></div>
            </div>
            <div className="service-content">
              <div className="service-number">{s.num}</div>
              <p className="service-label">Photography Service</p>
              <h2 className="service-title">{s.title}</h2>
              <p className="service-desc">{s.desc}</p>
              <div className="service-features">
                {s.features.map((f) => (
                  <span key={f} className="service-feature">
                    {f}
                  </span>
                ))}
              </div>
              <Link to={`/contact?type=${s.type}`} className="btn btn--outline">
                Request Booking
              </Link>
            </div>
          </article>
        ))}
      </div>

      <div className="services-cta reveal">
        <h2>Every project starts with a conversation.</h2>
        <p>
          Tell us about your upcoming event or project — we'll put together a custom proposal
          tailored to your needs.
        </p>
        <Link to="/contact" className="btn btn--dark">
          Start a Project
        </Link>
      </div>
    </>
  );
}
