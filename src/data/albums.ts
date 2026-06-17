export interface AlbumPhoto {
  src: string;
  alt: string;
}

export interface Album {
  title: string;
  category: string;
  description: string;
  count: number;
  bg: string;
  photos: AlbumPhoto[];
}

// Ported from V1 js/main.js. These remain the site's demo albums (Unsplash);
// they are separate from the new imAGES photos used by the homepage sphere.
export const albums: Record<string, Album> = {
  'amsterdam-night-festival': {
    title: 'Amsterdam Night Festival',
    category: 'Events',
    description:
      'A vivid collection from the annual Amsterdam Night Festival — where art, light, and city culture converge after dark.',
    count: 12,
    bg: 'https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?w=1920&q=80',
    photos: [
      { src: 'https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?w=800&q=80', alt: 'Night Festival lights' },
      { src: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&q=80', alt: 'Crowd at festival' },
      { src: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800&q=80', alt: 'Stage performance' },
      { src: 'https://images.unsplash.com/photo-1524863479829-916d8e77f114?w=800&q=80', alt: 'Festival atmosphere' },
      { src: 'https://images.unsplash.com/photo-1497436072909-60f360e1d4b1?w=800&q=80', alt: 'Light installation' },
      { src: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800&q=80', alt: 'DJ set' },
      { src: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&q=80', alt: 'Crowd energy' },
      { src: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=800&q=80', alt: 'Live music' },
      { src: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&q=80', alt: 'Festival night' },
    ],
  },
  'summer-rooftop-party': {
    title: 'Summer Rooftop Party',
    category: 'Events',
    description:
      "Golden hour and city skylines — capturing the energy of Amsterdam's favourite rooftop summer gathering.",
    count: 9,
    bg: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=1920&q=80',
    photos: [
      { src: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=800&q=80', alt: 'Rooftop view' },
      { src: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&q=80', alt: 'Party crowd' },
      { src: 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=800&q=80', alt: 'Sunset drinks' },
      { src: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800&q=80', alt: 'DJ performance' },
      { src: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=800&q=80', alt: 'Music' },
      { src: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&q=80', alt: 'Night skyline' },
    ],
  },
  'portrait-series': {
    title: 'Portrait Series',
    category: 'Portraits',
    description:
      'An intimate collection of portraits — each frame capturing authenticity, character, and quiet intensity.',
    count: 8,
    bg: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=1920&q=80',
    photos: [
      { src: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=800&q=80', alt: 'Portrait 1' },
      { src: 'https://images.unsplash.com/photo-1502767882564-6dd3f0b4d534?w=800&q=80', alt: 'Portrait 2' },
      { src: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&q=80', alt: 'Portrait 3' },
      { src: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=800&q=80', alt: 'Portrait 4' },
      { src: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80', alt: 'Portrait 5' },
      { src: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=800&q=80', alt: 'Portrait 6' },
    ],
  },
  'corporate-event-coverage': {
    title: 'Corporate Event Coverage',
    category: 'Corporate',
    description:
      'Professional event documentation for brands, conferences, and corporate gatherings that tell a story beyond the boardroom.',
    count: 10,
    bg: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1920&q=80',
    photos: [
      { src: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80', alt: 'Conference keynote' },
      { src: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&q=80', alt: 'Panel discussion' },
      { src: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=800&q=80', alt: 'Networking' },
      { src: 'https://images.unsplash.com/photo-1528605248644-14dd04022da1?w=800&q=80', alt: 'Team event' },
      { src: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=800&q=80', alt: 'Speaker' },
      { src: 'https://images.unsplash.com/photo-1559223607-a43c990c692c?w=800&q=80', alt: 'Gala dinner' },
    ],
  },
  'brand-campaign-shoot': {
    title: 'Brand Campaign Shoot',
    category: 'Brand',
    description:
      'Editorial-style brand photography that communicates identity, product, and vision in one frame.',
    count: 11,
    bg: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=1920&q=80',
    photos: [
      { src: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=800&q=80', alt: 'Brand shoot 1' },
      { src: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=800&q=80', alt: 'Product shot' },
      { src: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800&q=80', alt: 'Campaign model' },
      { src: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=800&q=80', alt: 'Fashion editorial' },
      { src: 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=800&q=80', alt: 'Street style' },
      { src: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&q=80', alt: 'Brand campaign' },
    ],
  },
};

export const DEFAULT_ALBUM = 'amsterdam-night-festival';
