import type { ImageData } from '../components/SphereImageGrid';
import { homePhotos } from './generatedPhotos';

// The 23 "Homapage Selection" photos shown on the homepage sphere.
// Generated from /public/photos/home by scripts/generate-image-data.mjs.
export const sphereImages: ImageData[] = homePhotos;

export default sphereImages;
