import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, F} from '../theme';
import {clamp01, ease, prog, vis} from './common';

/** Documento recreado: papel con tipografía de máquina de escribir y sello opcional */
export const Documento: React.FC<{
  x: number; y: number; w?: number; h?: number; rot?: number; from: number; to?: number;
  header?: string; lines?: string[]; bars?: number; sello?: string; selloAt?: number; selloColor?: string;
  typeSpeed?: number; footer?: string; dim?: number; enterFrom?: 'bottom' | 'left' | 'right'; children?: React.ReactNode;
}> = ({x, y, w = 520, h = 680, rot = 0, from, to, header, lines = [], bars = 0, sello, selloAt, selloColor = C.red, typeSpeed = 1.4, footer, dim = 1, enterFrom = 'bottom', children}) => {
  const frame = useCurrentFrame();
  const o = vis(frame, from, to ?? Infinity, 12);
  const p = prog(frame, from, 26);
  const dx = enterFrom === 'left' ? -120 : enterFrom === 'right' ? 120 : 0;
  const dy = enterFrom === 'bottom' ? 90 : 0;
  let chars = Math.max(0, (frame - from - 10) * typeSpeed);
  const shown = lines.map((l) => {
    const n = Math.min(l.length, Math.max(0, Math.floor(chars)));
    chars -= l.length + 4;
    return l.slice(0, n);
  });
  const sp = selloAt !== undefined ? ease(clamp01((frame - selloAt) / 6)) : 0;
  const shake = selloAt !== undefined && frame >= selloAt && frame < selloAt + 8 ? (frame % 2 ? 3 : -3) : 0;
  return (
    <div
      style={{
        position: 'absolute', left: x, top: y, width: w, height: h, opacity: o * dim,
        transform: `translate(-50%, -50%) translate(${(1 - p) * dx + shake}px, ${(1 - p) * dy}px) rotate(${rot}deg)`,
        background: `linear-gradient(160deg, #e2d8bd, ${C.paper} 55%, #c4b996)`,
        boxShadow: '0 30px 80px rgba(0,0,0,0.65), inset 0 0 60px rgba(120,90,40,0.28)',
        padding: '46px 48px', boxSizing: 'border-box', fontFamily: F.mono, color: C.ink, overflow: 'hidden',
      }}>
      {header && <div style={{fontSize: 22, fontWeight: 700, letterSpacing: 3, borderBottom: `2px solid ${C.ink}`, paddingBottom: 12, marginBottom: 20}}>{header}</div>}
      {shown.map((l, k) => (
        <div key={k} style={{fontSize: 21, lineHeight: 1.55, minHeight: 32, whiteSpace: 'pre'}}>{l}</div>
      ))}
      {Array.from({length: bars}).map((_, k) => (
        <div key={k} style={{height: 10, margin: '16px 0', background: 'rgba(28,26,22,0.55)', width: `${58 + ((k * 37) % 40)}%`, opacity: vis(frame, from + 8 + k * 2, Infinity, 6)}} />
      ))}
      {footer && <div style={{position: 'absolute', left: 48, bottom: 34, fontSize: 17, letterSpacing: 2, opacity: 0.7}}>{footer}</div>}
      {children}
      {sello && selloAt !== undefined && (
        <div
          style={{
            position: 'absolute', right: 34, bottom: 90, transform: `rotate(-12deg) scale(${1.6 - 0.6 * sp})`, opacity: sp,
            border: `7px solid ${selloColor}`, color: selloColor, padding: '6px 22px', fontFamily: F.mono, fontWeight: 700,
            fontSize: 46, letterSpacing: 5, borderRadius: 6, mixBlendMode: 'multiply',
          }}>
          {sello}
        </div>
      )}
    </div>
  );
};
