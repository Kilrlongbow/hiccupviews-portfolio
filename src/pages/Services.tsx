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
    img: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=1200&q=80',
    alt: 'Event photography — crowd at a live event',
    desc: 'We capture the energy, emotion, and atmosphere of events — from intimate gatherings to large-scale productions. Every shot tells the story of the moment.',
    features: [
      'Concerts & live performances',
      'Private parties & gatherings',
      'Club nights & venue coverage',
      'Cultural & community events',
    ],
  },
  {
    num: '02',
    title: 'Corporate Events',
    type: 'corporate',
    img: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&q=80',
    alt: 'Corporate event coverage — conference keynote',
    desc: 'Professional documentation of business events that reflects the professionalism of your brand — from keynote speakers to team moments and award ceremonies.',
    features: ['Conferences & summits', 'Product launches', 'Company celebrations', 'Networking events'],
  },
  {
    num: '03',
    title: 'Brand Photography',
    type: 'brand',
    img: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=1200&q=80',
    alt: 'Brand photography — editorial campaign',
    desc: 'Editorial and campaign photography that communicates who you are. We work closely with brands to develop a visual identity that resonates with your audience.',
    features: ['Brand identity campaigns', 'Product photography', 'Social media content', 'Editorial shoots'],
  },
  {
    num: '04',
    title: 'Portrait Sessions',
    type: 'portrait',
    img: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=1200&q=80',
    alt: 'Portrait session',
    desc: 'Intimate, editorial portraits that go beyond the surface. We create an environment where authenticity shines through — every image is a window into character.',
    features: [
      'Individual & group portraits',
      'Professional headshots',
      'Artist & musician photography',
      'Creative portrait series',
    ],
  },
  {
    num: '05',
    title: 'Festival Coverage',
    type: 'festival',
    img: 'https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?w=1200&q=80',
    alt: 'Festival coverage — night festival crowd',
    desc: 'Multi-day festival coverage that captures the full spectrum — from backstage to the main stage, the crowd to the culture. We embed ourselves in the experience to bring back vivid collections.',
    features: [
      'Multi-day festival packages',
      'Backstage & artist access',
      'Crowd & atmosphere shots',
      'Press & promo delivery',
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
            From intimate portrait sessions to large-scale festival coverage — we bring the same
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
