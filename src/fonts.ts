import {continueRender, delayRender, staticFile} from 'remotion';

const faces: [string, string, string, string][] = [
  ['Fraunces', 'fraunces-latin-400-normal.woff2', '400', 'normal'],
  ['Fraunces', 'fraunces-latin-700-normal.woff2', '700', 'normal'],
  ['Fraunces', 'fraunces-latin-400-italic.woff2', '400', 'italic'],
  ['Inter', 'inter-latin-400-normal.woff2', '400', 'normal'],
  ['Inter', 'inter-latin-600-normal.woff2', '600', 'normal'],
  ['Courier Prime', 'courier-prime-latin-400-normal.woff2', '400', 'normal'],
  ['Courier Prime', 'courier-prime-latin-700-normal.woff2', '700', 'normal'],
];

let started = false;
export const loadFonts = () => {
  if (started || typeof document === 'undefined') return;
  started = true;
  const handle = delayRender('fonts');
  Promise.all(
    faces.map(async ([family, file, weight, style]) => {
      const ff = new FontFace(family, `url(${staticFile('fonts/' + file)}) format('woff2')`, {weight, style});
      await ff.load();
      (document.fonts as any).add(ff);
    }),
  )
    .catch((e) => console.error('font load failed', e))
    .finally(() => continueRender(handle));
};
