import { portraitPhotos, eventPhotos } from './generatedPhotos';

export interface AlbumPhoto {
  /** Gallery-grid sized image. */
  src: string;
  /** Full-resolution image shown in the lightbox. */
  full: string;
  alt: string;
}

export interface Album {
  title: string;
  category: string;
  /** One entry per paragraph. */
  description: string[];
  count: number;
  bg: string;
  photos: AlbumPhoto[];
}

// The two categories Hiccupviews is showing first. Photo lists are generated
// from /public/photos by scripts/generate-image-data.mjs.
export const albums: Record<string, Album> = {
  portraits: {
    title: 'Portraits',
    category: 'Portraits',
    description: [
      'Not every portrait starts with a pose.',
      'Some of the strongest images happen in the moments between — a laugh that wasn’t planned, a pause in conversation, the way someone naturally carries themselves.',
      'Hiccupviews approaches portrait photography as a way of capturing people as they are rather than creating a version of who they should be. The goal is not perfection but presence.',
      'Each portrait becomes a small story — focused on expression, environment, and the details that make someone feel familiar and human.',
      'Because the most meaningful images are often the ones that feel the least staged.',
    ],
    count: portraitPhotos.length,
    bg: '/photos/portraits/KLR00636-full.jpg',
    photos: portraitPhotos,
  },
  events: {
    title: 'Events',
    category: 'Events',
    description: [
      'Events move quickly, but the moments people remember are usually quieter than expected.',
      'A glance across a room. Friends laughing in the background. Someone adjusting their outfit before stepping in. Conversations that happen away from the spotlight.',
      'Hiccupviews focuses on documenting events through both the energy and the intimacy that exist within them.',
      'Rather than only capturing what happened, the aim is to preserve how it felt — the atmosphere, the people, and the moments that would otherwise pass unnoticed.',
      'Every event becomes a visual memory built from authentic interactions and real experiences.',
    ],
    count: eventPhotos.length,
    bg: '/photos/events/KLR02385-full.jpg',
    photos: eventPhotos,
  },
};

export const DEFAULT_ALBUM = 'portraits';
