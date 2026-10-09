import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {C, F} from '../theme';
import {ease, prog, vis} from './common';

export const Contador: React.FC<{
  from: number; to?: number; value?: number; start?: number; dur?: number; x?: number | string; y?: number | string;
  prefix?: string; suffix?: string; label?: string; size?: number; color?: string; fmt?: (n: number) => string;
  labelSize?: number; end?: number;
}> = ({from, value = 0, start = 0, dur = 40, x = '50%', y = '50%', prefix = '', suffix = '', label, size = 150, color = C.amber, fmt, labelSize = 38, end}) => {
  const frame = useCurrentFrame();
  const v = start + (value - start) * prog(frame, from + 4, dur);
  const txt = fmt ? fmt(v) : Math.round(v).toLocaleString('es-ES');
  const o = vis(frame, from, end ?? Infinity, 12);
  return (
    <div style={{position: 'absolute', left: x, top: y, transform: 'translate(-50%,-50%)', textAlign: 'center', opacity: o}}>
      <div style={{fontFamily: F.serif, fontWeight: 700, fontSize: size, color, lineHeight: 1, textShadow: '0 0 40px rgba(245,158,11,0.35)'}}>{prefix}{txt}{suffix}</div>
      {label && <div style={{fontFamily: F.sans, fontWeight: 600, fontSize: labelSize, color: C.bone, marginTop: 18, letterSpacing: 1}}>{label}</div>}
    </div>
  );
};
