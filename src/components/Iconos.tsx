import React from 'react';
import {C} from '../theme';

/** Avión con bomba (icono vectorial) */
export const AvionBomba: React.FC<{size?: number; color?: string}> = ({size = 220, color = C.bone}) => (
  <svg viewBox="0 0 220 160" width={size} height={(size * 160) / 220} fill={color} style={{overflow: 'visible'}}>
    <path d="M24 74 L150 66 C176 64 196 70 204 78 C196 86 176 92 150 90 L24 82 Z" />
    <path d="M92 70 L128 20 L142 20 L124 68 Z" />
    <path d="M92 86 L128 136 L142 136 L124 88 Z" opacity={0.85} />
    <path d="M24 74 L8 50 L26 50 L48 72 Z" />
    <path d="M24 82 L8 106 L26 106 L48 84 Z" opacity={0.85} />
    <g transform="translate(96 96)">
      <ellipse cx="22" cy="20" rx="16" ry="9" fill={C.amber} />
      <path d="M8 20 L0 12 L0 28 Z" fill={C.amber} />
    </g>
  </svg>
);

export const Flecha: React.FC<{x1: number; y1: number; x2: number; y2: number; p: number; color?: string; w?: number}> = ({x1, y1, x2, y2, p, color = C.red, w = 6}) => {
  const ex = x1 + (x2 - x1) * p, ey = y1 + (y2 - y1) * p;
  const a = Math.atan2(y2 - y1, x2 - x1);
  return (
    <g stroke={color} strokeWidth={w} strokeLinecap="round" fill={color} opacity={Math.min(1, p * 4)}>
      <line x1={x1} y1={y1} x2={ex} y2={ey} strokeDasharray="14 12" />
      {p > 0.9 && <path d={`M${ex} ${ey} L${ex - 24 * Math.cos(a - 0.45)} ${ey - 24 * Math.sin(a - 0.45)} L${ex - 24 * Math.cos(a + 0.45)} ${ey - 24 * Math.sin(a + 0.45)} Z`} stroke="none" />}
    </g>
  );
};
