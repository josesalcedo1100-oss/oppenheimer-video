import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, F} from '../theme';
import {clamp01, ease, prog, vis} from './common';

export type Hito = {year: string; label: string; at: number};

/** LíneaDeTiempo horizontal con hitos que aparecen en su fotograma `at` */
export const LineaDeTiempo: React.FC<{items: Hito[]; y?: number; x0?: number; x1?: number; from: number; to?: number; activeColor?: string}> = ({items, y = 540, x0 = 220, x1 = 1700, from, to, activeColor = C.amber}) => {
  const frame = useCurrentFrame();
  const o = vis(frame, from, to ?? Infinity, 14);
  const lastAt = items[items.length - 1].at;
  const lineP = prog(frame, from, Math.max(30, lastAt - from + 20));
  return (
    <div style={{position: 'absolute', left: 0, top: 0, width: 1920, height: 1080, opacity: o}}>
      <div style={{position: 'absolute', left: x0, top: y, width: (x1 - x0) * lineP, height: 3, background: 'rgba(245,241,232,0.5)'}} />
      {items.map((it, k) => {
        const x = x0 + ((x1 - x0) * (k + 0.5)) / items.length;
        const p = prog(frame, it.at, 20);
        const cur = frame >= it.at && (k === items.length - 1 || frame < items[k + 1].at);
        return (
          <div key={k} style={{position: 'absolute', left: x, top: y, opacity: p}}>
            <div style={{position: 'absolute', left: -13, top: -12, width: 26, height: 26, borderRadius: 13, background: cur ? activeColor : '#3b3a3a', border: `3px solid ${C.bone}`, transform: `scale(${0.4 + 0.6 * p})`, boxShadow: cur ? `0 0 30px ${activeColor}` : 'none'}} />
            <div style={{position: 'absolute', left: -200, width: 400, top: -112 + (1 - p) * 14, textAlign: 'center', fontFamily: F.serif, fontWeight: 700, fontSize: 70, color: cur ? activeColor : C.bone}}>{it.year}</div>
            <div style={{position: 'absolute', left: -220, width: 440, top: 40 + (1 - p) * 14, textAlign: 'center', fontFamily: F.sans, fontWeight: 600, fontSize: 32, color: C.bone, lineHeight: 1.25}}>{it.label}</div>
          </div>
        );
      })}
    </div>
  );
};

export const RotuloDeFecha: React.FC<{date: string; sub?: string; from: number; to?: number; x?: number | string; y?: number | string; size?: number; color?: string; align?: 'center' | 'left'}> = ({date, sub, from, to, x = '50%', y = 150, size = 64, color = C.amber, align = 'center'}) => {
  const frame = useCurrentFrame();
  const o = vis(frame, from, to ?? Infinity, 14);
  const p = prog(frame, from, 26);
  const tx = align === 'center' ? '-50%' : '0';
  return (
    <div style={{position: 'absolute', left: x, top: y, transform: `translate(${tx}, ${(1 - p) * 18}px)`, opacity: o, textAlign: align, whiteSpace: 'nowrap'}}>
      <div style={{fontFamily: F.serif, fontWeight: 700, fontSize: size, color, letterSpacing: 4, textShadow: '0 2px 24px rgba(0,0,0,0.7)'}}>{date}</div>
      <div style={{height: 3, background: color, width: `${100 * p}%`, margin: align === 'center' ? '10px auto 0' : '10px 0 0'}} />
      {sub && <div style={{fontFamily: F.sans, fontWeight: 600, fontSize: size * 0.42, color: C.bone, letterSpacing: 5, marginTop: 12}}>{sub}</div>}
    </div>
  );
};

/** Etiqueta pequeña tipo chip */
export const Chip: React.FC<{text: string; x: number | string; y: number | string; from: number; to?: number; color?: string; size?: number; bg?: string; align?: 'center' | 'left'}> = ({text, x, y, from, to, color = C.bone, size = 34, bg = 'rgba(10,10,12,0.72)', align = 'center'}) => {
  const frame = useCurrentFrame();
  const o = vis(frame, from, to ?? Infinity, 10);
  const p = prog(frame, from, 18);
  return (
    <div style={{position: 'absolute', left: x, top: y, transform: `translate(${align === 'center' ? '-50%' : '0'}, -50%) scale(${0.92 + 0.08 * p})`, opacity: o, fontFamily: F.sans, fontWeight: 600, fontSize: size, color, background: bg, border: `2px solid ${color}`, padding: '10px 26px', borderRadius: 8, letterSpacing: 2, whiteSpace: 'nowrap'}}>
      {text}
    </div>
  );
};
