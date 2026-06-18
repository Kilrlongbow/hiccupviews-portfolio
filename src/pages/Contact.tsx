import { FormEvent, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

const EVENT_TYPES = [
  { value: 'event', label: 'Event Photography' },
  { value: 'portrait', label: 'Portrait Session' },
  { value: 'other', label: 'Other' },
];

export default function Contact() {
  const [params] = useSearchParams();
  const presetType = params.get('type') ?? '';

  const [eventType, setEventType] = useState(
    EVENT_TYPES.some((t) => t.value === presetType) ? presetType : '',
  );
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSending(true);
    // Simulated send (mirrors V1 main.js — no backend).
    setTimeout(() => {
      setSending(false);
      setSent(true);
    }, 1200);
  };

  return (
    <>
      <header className="page-header">
        <div className="container">
          <p className="section-label">Get in Touch</p>
          <h1>Book a Shoot</h1>
          <div className="divider divider--center"></div>
          <p>Fill in the form and we'll get back to you within 24 hours with a custom proposal.</p>
        </div>
      </header>

      <div className="container contact-layout">
        {/* Info column */}
        <aside className="contact-info reveal" aria-label="Contact information">
          <h2 className="contact-info-title">Let's make something great.</h2>
          <p className="contact-info-desc">
            Whether you have a fully detailed brief or just a vague idea — get in touch. We'll figure
            out the rest together.
          </p>

          <div className="contact-methods">
            <div className="contact-method">
              <div className="contact-method-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
              </div>
              <div>
                <p className="contact-method-label">Email</p>
                <a href="mailto:hello@hiccupviews.com" className="contact-method-value">
                  hello@hiccupviews.com
                </a>
              </div>
            </div>

            <div className="contact-method">
              <div className="contact-method-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                </svg>
              </div>
              <div>
                <p className="contact-method-label">Instagram</p>
                <a href="#" className="contact-method-value">
                  @hiccupviews
                </a>
              </div>
            </div>

            <div className="contact-method">
              <div className="contact-method-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
              </div>
              <div>
                <p className="contact-method-label">Based in</p>
                <span className="contact-method-value">Eindhoven, Netherlands</span>
              </div>
            </div>
          </div>

          <div>
            <p className="section-label" style={{ marginBottom: '0.75rem' }}>
              Follow Our Work
            </p>
            <div className="contact-social">
              <a href="#" className="contact-social-btn" aria-label="Instagram">
                <svg viewBox="0 0 24 24">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                </svg>
                Instagram
              </a>
              <a href="mailto:hello@hiccupviews.com" className="contact-social-btn" aria-label="Email">
                <svg viewBox="0 0 24 24">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
                Email
              </a>
            </div>
          </div>
        </aside>

        {/* Form column */}
        <div className="contact-form-wrap reveal reveal-delay-2">
          <h3 className="contact-form-title">Booking Request</h3>

          {!sent && (
            <form className="booking-form" noValidate aria-label="Booking request form" onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <input type="text" id="name" name="name" placeholder=" " autoComplete="name" required />
                  <label htmlFor="name">Full Name *</label>
                </div>
                <div className="form-group">
                  <input type="email" id="email" name="email" placeholder=" " autoComplete="email" required />
                  <label htmlFor="email">Email Address *</label>
                </div>
              </div>

              <div className="form-group">
                <input type="text" id="company" name="company" placeholder=" " autoComplete="organization" />
                <label htmlFor="company">Company / Organisation</label>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <select
                    id="event-type"
                    name="event-type"
                    required
                    value={eventType}
                    onChange={(e) => setEventType(e.target.value)}
                  >
                    <option value="" disabled></option>
                    {EVENT_TYPES.map((t) => (
                      <option key={t.value} value={t.value}>
                        {t.label}
                      </option>
                    ))}
                  </select>
                  <label htmlFor="event-type">Event Type *</label>
                </div>
                <div className="form-group">
                  <input type="date" id="event-date" name="event-date" placeholder=" " />
                  <label htmlFor="event-date">Event Date</label>
                </div>
              </div>

              <div className="form-group">
                <input type="text" id="location" name="location" placeholder=" " autoComplete="street-address" />
                <label htmlFor="location">Location / Venue</label>
              </div>

              <div className="form-group">
                <textarea id="message" name="message" placeholder=" " rows={5} required></textarea>
                <label htmlFor="message">Tell us about your project *</label>
              </div>

              <div className="form-submit">
                <button type="submit" className="btn-submit" disabled={sending}>
                  {sending ? 'Sending…' : 'Send Request'}
                  {!sending && (
                    <svg viewBox="0 0 24 24">
                      <line x1="5" y1="12" x2="19" y2="12" />
                      <polyline points="12 5 19 12 12 19" />
                    </svg>
                  )}
                </button>
              </div>
            </form>
          )}

          <div className={`form-success${sent ? ' show' : ''}`} role="alert" aria-live="polite">
            <div className="form-success-icon">
              <svg viewBox="0 0 24 24">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <h3>Request Sent!</h3>
            <p>
              Thank you for reaching out. We'll review your request and get back to you within 24
              hours.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
