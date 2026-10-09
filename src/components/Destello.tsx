import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {clamp01} from './common';

/** Destello blanco a pantalla completa: sube casi instantáneo y se disipa */
export const Destello: React.FC<{at: number; hold?: number; decay?: number; tint?: string}> = ({at, hold = 3, decay = 40, tint = '#fff'}) => {
  const f = useCurrentFrame() - at;
  if (f < 0) return null;
  const o = f < hold ? 1 : 1 - clamp01((f - hold) / decay);
  return <AbsoluteFill style={{background: tint, opacity: Math.pow(o, 1.6)}} />;
};
