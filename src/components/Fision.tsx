import React from 'react';
import {random, useCurrentFrame} from 'remotion';
import {C} from '../theme';
import {clamp01, ease, vis} from './common';

const blob = (seed: string, n: number, r: number) =>
  Array.from({length: n}, (_, k) => {
    const a = random(seed + 'a' + k) * Math.PI * 2;
    const d = Math.sqrt(random(seed + 'd' + k)) * r;
    return {x: Math.cos(a) * d, y: Math.sin(a) * d, p: random(seed + 'p' + k) > 0.5};
  });

const Cluster: React.FC<{seed: string; n: number; r: number; x: number; y: number; scale?: number; opacity?: number; jitter?: number; frame: number}> = ({seed, n, r, x, y, scale = 1, opacity = 1, jitter = 0, frame}) => (
  <g transform={`translate(${x},${y}) scale(${scale})`} opacity={opacity}>
    {blob(seed, n, r).map((b, k) => (
      <circle key={k} cx={b.x + jitter * Math.sin(frame * 0.9 + k)} cy={b.y + jitter * Math.cos(frame * 1.1 + k * 2)} r={r * 0.2} fill={b.p ? C.amber : '#d9d4c4'} stroke="rgba(0,0,0,0.35)" strokeWidth={1.5} />
    ))}
  </g>
);

/** Un neutrón golpea un núcleo pesado que se parte liberando energía y más neutrones */
export const Fision: React.FC<{x: number; y: number; at: number; from?: number; to?: number; r?: number}> = ({x, y, at, from = 0, to, r = 130}) => {
  const frame = useCurrentFrame();
  const o = vis(frame, from, to ?? Infinity, 12);
  const f = frame - at;
  const pre = f < 0;
  const split = ease(clamp01(f / 70));
  const nx = x - 520 + 520 * ease(clamp01((frame - (at - 36)) / 36));
  const rays = Array.from({length: 14}, (_, k) => (k / 14) * Math.PI * 2);
  return (
    <svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0, opacity: o}}>
      {pre && <Cluster seed="u" n={26} r={r} x={x} y={y} jitter={frame > at - 30 ? 2.5 : 0.8} frame={frame} />}
      {!pre && (
        <>
          <Cluster seed="a" n={13} r={r * 0.72} x={x - 40 - 230 * split} y={y - 10 * split} frame={frame} jitter={1} />
          <Cluster seed="b" n={13} r={r * 0.72} x={x + 40 + 230 * split} y={y + 10 * split} frame={frame} jitter={1} />
          {rays.map((a, k) => (
            <line key={k} x1={x + Math.cos(a) * 60} y1={y + Math.sin(a) * 60} x2={x + Math.cos(a) * (60 + 320 * ease(clamp01(f / 26)))} y2={y + Math.sin(a) * (60 + 320 * ease(clamp01(f / 26)))} stroke={C.amber} strokeWidth={5} strokeLinecap="round" opacity={Math.max(0, 1 - f / 34)} />
          ))}
          {[0, 1, 2].map((k) => {
            const a = -0.9 + k * 0.9;
            const d = 30 + 520 * ease(clamp01((f - 4) / 80));
            return <circle key={k} cx={x + Math.cos(a) * d} cy={y + Math.sin(a) * d - 40} r={11} fill="#8fd3ff" opacity={clamp01(1 - (f - 60) / 40)} />;
          })}
        </>
      )}
      {pre && <circle cx={nx} cy={y} r={12} fill="#8fd3ff" />}
      {pre && <circle cx={nx} cy={y} r={26} fill="#8fd3ff" opacity={0.22} />}
    </svg>
  );
};
