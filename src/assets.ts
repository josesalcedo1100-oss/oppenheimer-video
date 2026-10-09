import {staticFile} from 'remotion';

/**
 * Material real opcional. Coloca archivos en public/img/ o public/video/ y
 * enlázalos aquí. Si el valor es `null`, la escena usa su recreación vectorial.
 * Ejemplo:  trinity: 'img/trinity.jpg'
 */
export const ASSETS: Record<string, string | null> = {
  trinity: null,
  groves: null,
  oppenheimer: null,
  einstein_letter: null,
  fermi_pile: null,
  hiroshima: null,
};

export const asset = (key: keyof typeof ASSETS): string | null => {
  const v = ASSETS[key];
  return v ? staticFile(v) : null;
};
