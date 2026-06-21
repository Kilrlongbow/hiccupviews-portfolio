// Info panels that cycle as the visitor scrolls through the hero animation.
// Each step pairs a brand tagline with one of the services/collections offered
// (mirrors Home.tsx SERVICES and the categories in albums.ts). Edit freely.
export interface HeroSlide {
  label: string;
  title: string;
  text: string;
}

export const heroSlides: HeroSlide[] = [
  {
    label: 'Events',
    title: 'Nights worth remembering',
    text: 'Concerts, parties and cultural gatherings, captured with energy, exactly as they unfold.',
  },
  {
    label: 'Portraits',
    title: 'Faces, honestly seen',
    text: 'Intimate, editorial portraits that hold character, authenticity and a quiet intensity.',
  },
];

export default heroSlides;
