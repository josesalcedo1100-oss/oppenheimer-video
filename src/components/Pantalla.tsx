import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C} from '../theme';
import {prog, vis} from './common';

export const PantallaDividida: React.FC<{left: React.ReactNode; right: React.ReactNode; from: number; to?: number; leftTint?: string; rightTint?: string}> = ({left, right, from, to, leftTint = 'rgba(80,110,160,0.10)', rightTint = 'rgba(245,158,11,0.10)'}) => {
  const frame = useCurrentFrame();
  const o = vis(frame, from, to ?? Infinity, 14);
  const p = prog(frame, from, 24);
  return (
    <div style={{position: 'absolute', inset: 0, opacity: o}}>
      <div style={{position: 'absolute', left: 0, top: 0, width: 960, height: 1080, background: leftTint, clipPath: `inset(${100 - 100 * p}% 0 0 0)`}}>{left}</div>
      <div style={{position: 'absolute', left: 960, top: 0, width: 960, height: 1080, background: rightTint, clipPath: `inset(0 0 ${100 - 100 * p}% 0)`}}>{right}</div>
      <div style={{position: 'absolute', left: 958, top: 0, width: 4, height: 1080 * p, background: C.bone, opacity: 0.8}} />
    </div>
  );
};
