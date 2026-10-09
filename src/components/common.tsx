import React from 'react';
import {AbsoluteFill, Audio, Easing, interpolate, random, Sequence, staticFile, useCurrentFrame} from 'remotion';
import {C, F, H, W} from '../theme';
import {useScene} from '../ctx';

export const clamp01 = (x: number) => Math.max(0, Math.min(1, x));
export const ease = Easing.bezier(0.22, 0.61, 0.36, 1);
export const easeInOut = Easing.bezier(0.45, 0, 0.55, 1);

/** progreso 0..1 entre `from` y `from+dur` */
export const prog = (frame: number, from: number, dur: number, e = ease) =>
  e(clamp01((frame - from) / Math.max(1, dur)));

/** opacidad: aparece en `from`, (opcional) desaparece en `to` */
export const vis = (frame: number, from: number, to = Infinity, fade = 10) =>
  Math.min(clamp01((frame - from) / fade), clamp01((to - frame) / fade));

export const Sfx: React.FC<{src: string; at: number; vol?: number}> = ({src, at, vol = 0.6}) => (
  <Sequence from={Math.max(0, Math.round(at))} layout="none">
    <Audio src={staticFile(`sfx/${src}.wav`)} volume={vol} />
  </Sequence>
);

export type Tone = 'cold' | 'amber' | 'red' | 'warm' | 'black';
const tones: Record<Tone, [string, string, string]> = {
  cold: ['#10131a', '#0A0A0C', 'rgba(120,150,200,0.10)'],
  amber: ['#1b1208', '#0A0A0C', 'rgba(245,158,11,0.16)'],
  red: ['#1d0a0a', '#0A0A0C', 'rgba(185,28,28,0.18)'],
  warm: ['#241708', '#0d0906', 'rgba(245,158,11,0.20)'],
  black: ['#050506', '#050506', 'rgba(0,0,0,0)'],
};

/** Fondo oscuro con degradado cálido y deriva lenta */
export const Backdrop: React.FC<{tone?: Tone; children?: React.ReactNode}> = ({tone = 'cold', children}) => {
  const frame = useCurrentFrame();
  const [a, b, glow] = tones[tone];
  const gx = 50 + 10 * Math.sin(frame / 160);
  const gy = 55 + 6 * Math.cos(frame / 200);
  return (
    <AbsoluteFill style={{background: `radial-gradient(120% 120% at 50% 40%, ${a}, ${b} 70%)`}}>
      <AbsoluteFill style={{background: `radial-gradient(60% 60% at ${gx}% ${gy}%, ${glow}, transparent 70%)`}} />
      {children}
    </AbsoluteFill>
  );
};

/** Cámara lenta: zoom + paneo durante toda la escena (o un tramo) */
export const Cam: React.FC<{
  z0?: number; z1?: number; x0?: number; x1?: number; y0?: number; y1?: number;
  from?: number; dur?: number; origin?: string; children: React.ReactNode;
}> = ({z0 = 1, z1 = 1.08, x0 = 0, x1 = 0, y0 = 0, y1 = 0, from = 0, dur, origin = '50% 50%', children}) => {
  const frame = useCurrentFrame();
  const {sc} = useScene();
  const t = easeInOut(clamp01((frame - from) / (dur ?? sc.dur - from)));
  const z = z0 + (z1 - z0) * t;
  return (
    <AbsoluteFill
      style={{
        transform: `translate(${x0 + (x1 - x0) * t}px, ${y0 + (y1 - y0) * t}px) scale(${z})`,
        transformOrigin: origin,
      }}>
      {children}
    </AbsoluteFill>
  );
};

export const Title: React.FC<{
  text: string; size?: number; color?: string; x?: number | string; y?: number | string;
  from: number; to?: number; italic?: boolean; align?: 'left' | 'center' | 'right'; weight?: number;
  spacing?: number; font?: 'serif' | 'sans' | 'mono'; rise?: number; width?: number | string;
}> = ({text, size = 72, color = C.bone, x = '50%', y = '50%', from, to, italic, align = 'center', weight = 600, spacing = 0, font = 'serif', rise = 16, width}) => {
  const frame = useCurrentFrame();
  const o = vis(frame, from, to ?? Infinity, 14);
  const p = prog(frame, from, 24);
  const tx = align === 'center' ? '-50%' : align === 'right' ? '-100%' : '0%';
  return (
    <div
      style={{
        position: 'absolute', left: x, top: y, width,
        transform: `translate(${tx}, calc(-50% + ${(1 - p) * rise}px))`,
        opacity: o, color, fontFamily: F[font], fontSize: size, fontWeight: weight,
        fontStyle: italic ? 'italic' : 'normal', letterSpacing: spacing, textAlign: align,
        lineHeight: 1.12, textShadow: '0 2px 24px rgba(0,0,0,0.6)', whiteSpace: width ? 'pre-line' : 'pre',
      }}>
      {text}
    </div>
  );
};

/** Línea fina decorativa que se dibuja */
export const Rule: React.FC<{x: number; y: number; w: number; from: number; color?: string; h?: number}> = ({x, y, w, from, color = C.amber, h = 3}) => {
  const frame = useCurrentFrame();
  return <div style={{position: 'absolute', left: x, top: y, width: w * prog(frame, from, 28), height: h, background: color, opacity: vis(frame, from, Infinity, 6)}} />;
};

export const seeded = (seed: string) => random(seed);
export const full = {position: 'absolute' as const, left: 0, top: 0, width: W, height: H};
