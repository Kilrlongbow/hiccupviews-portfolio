/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  // Preflight is disabled so Tailwind's base reset does not clobber the
  // hand-built design carried over from V1 (reset.css + style.css). Only the
  // utility classes used by SphereImageGrid are needed.
  corePlugins: {
    preflight: false,
  },
  theme: {
    extend: {},
  },
  plugins: [],
};
