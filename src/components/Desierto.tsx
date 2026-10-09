import React from 'react';
import {useCurrentFrame, random} from 'remotion';
import {C} from '../theme';
import {clamp01, ease, prog} from './common';

/** Paisaje del desierto al amanecer generado por código. `t` = progreso de la bola de fuego (0..1+) */
export const Desierto: React.FC<{fire: number; glow?: number; tower?: boolean; sky?: number}> = ({fire, glow = 1, tower = true, sky = 1}) => {
  const frame = useCurrentFrame();
  const f = clamp01(fire);
  const g = ease(clamp01((fire - 0.08) / 0.9));
  const cx = 1060;
  const baseY = 735;
  const R = 30 + 250 * ease(clamp01(fire / 0.45));
  const capR = 40 + 140 * g;
  const stemTop = baseY - 30 - 330 * g;
  const capY = stemTop - capR * 0.1;
  const lumps = Array.from({length: 18}, (_, k) => {
    const a = (k / 18) * Math.PI * 2;
    const rr = 0.25 + 0.5 * random('lump' + k);
    return {x: Math.cos(a) * capR * rr * 1.25, y: Math.sin(a) * capR * rr * 0.8, r: capR * (0.32 + 0.22 * random('lr' + k))};
  });
  const wob = Math.sin(frame / 40);
  return (
    <svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0}}>
      <defs>
        <linearGradient id="dsky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#0b0d1a" />
          <stop offset="0.55" stopColor="#3a1d24" />
          <stop offset="0.85" stopColor="#a8531c" />
          <stop offset="1" stopColor="#f59e0b" />
        </linearGradient>
        <radialGradient id="fball">
          <stop offset="0" stopColor="#fffbe8" />
          <stop offset="0.35" stopColor="#ffd36b" />
          <stop offset="0.7" stopColor="#f59e0b" />
          <stop offset="1" stopColor="#b91c1c" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="cloud">
          <stop offset="0" stopColor="#ffb347" />
          <stop offset="0.6" stopColor="#c2410c" />
          <stop offset="1" stopColor="#4a1410" stopOpacity="0.0" />
        </radialGradient>
        <linearGradient id="stem" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#c2410c" stopOpacity="0.9" />
          <stop offset="1" stopColor="#f59e0b" stopOpacity="0.8" />
        </linearGradient>
        <radialGradient id="halo">
          <stop offset="0" stopColor="#ffd9a0" stopOpacity="0.9" />
          <stop offset="1" stopColor="#f59e0b" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="1920" height="1080" fill="url(#dsky)" opacity={sky} />
      <circle cx={cx} cy={baseY - 40} r={900 * f * glow} fill="url(#halo)" opacity={0.55 * f} />
      {/* nube de hongo */}
      {fire > 0.1 && (
        <g>
          <path d={`M${cx - 20 - 36 * g} ${baseY} L${cx - 14 - 8 * g} ${stemTop} L${cx + 14 + 8 * g} ${stemTop} L${cx + 20 + 36 * g} ${baseY} Z`} fill="url(#stem)" opacity={0.85} />
          <g transform={`translate(${cx}, ${capY})`}>
            <circle cx={0} cy={0} r={capR * 0.9} fill="url(#cloud)" opacity={0.9} />
            {lumps.map((l, k) => (
              <circle key={k} cx={l.x + wob * 3 * (k % 3)} cy={l.y} r={l.r} fill="url(#cloud)" opacity={0.8} />
            ))}
          </g>
        </g>
      )}
      <circle cx={cx} cy={baseY - 10} r={R} fill="url(#fball)" opacity={fire > 0.5 ? Math.max(0, 1 - (fire - 0.5) / 0.4) : 1} />
      {/* montañas lejanas */}
      <path d="M0 740 L160 690 L300 722 L470 668 L640 716 L820 690 L1000 735 L1180 700 L1380 728 L1560 684 L1740 716 L1920 692 L1920 1080 L0 1080 Z" fill="#150c10" />
      <path d="M0 800 L240 776 L520 800 L860 770 L1200 804 L1560 778 L1920 800 L1920 1080 L0 1080 Z" fill="#0b0708" />
      <rect x="0" y="830" width="1920" height="250" fill="#060405" />
      {tower && (
        <g fill="#050405">
          <rect x="1368" y="640" width="12" height="192" />
          <path d="M1362 640 L1374 600 L1386 640 Z" />
          <rect x="1350" y="700" width="48" height="6" />
        </g>
      )}
    </svg>
  );
};
