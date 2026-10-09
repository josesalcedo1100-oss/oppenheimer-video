import React, {useMemo} from 'react';
import {random, useCurrentFrame} from 'remotion';
import {C} from '../theme';
import {clamp01, ease} from './common';

export type SimParams = {cols: number; rows: number; spacing: number; reach: number; seed: string; balls?: number};
type Ball = {from: [number, number]; to: [number, number]; t0: number; t1: number; hit: number};
type Sim = {pts: [number, number][]; trig: number[]; balls: Ball[]; end: number};

export const simulate = (p: SimParams): Sim => {
  const pts: [number, number][] = [];
  for (let r = 0; r < p.rows; r++)
    for (let c = 0; c < p.cols; c++)
      pts.push([(c - (p.cols - 1) / 2) * p.spacing + (random(`${p.seed}jx${r}_${c}`) - 0.5) * p.spacing * 0.18, (r - (p.rows - 1) / 2) * p.spacing + (random(`${p.seed}jy${r}_${c}`) - 0.5) * p.spacing * 0.18]);
  // trampa inicial: la más cercana al centro
  let first = 0, best = 1e9;
  pts.forEach((q, i) => {
    const d = Math.hypot(q[0], q[1]);
    if (d < best) {best = d; first = i;}
  });
  const trig = pts.map(() => Infinity);
  trig[first] = 0;
  const balls: Ball[] = [];
  const done = new Set<number>();
  let progress = true;
  while (progress) {
    progress = false;
    // procesar disparos en orden temporal
    const order = trig.map((t, i) => [t, i] as [number, number]).filter((x) => isFinite(x[0]) && !done.has(x[1])).sort((a, b) => a[0] - b[0]);
    if (order.length) {
      const [t, i] = order[0];
      done.add(i);
      progress = true;
      const n = p.balls ?? 2;
      for (let b = 0; b < n; b++) {
        const a = random(`${p.seed}a${i}_${b}`) * Math.PI * 2;
        const d = p.reach * (0.45 + 0.55 * random(`${p.seed}d${i}_${b}`));
        const to: [number, number] = [pts[i][0] + Math.cos(a) * d, pts[i][1] + Math.sin(a) * d];
        const fl = 0.28 + d / 520;
        let hit = -1, hd = p.spacing * 0.42;
        pts.forEach((q, j) => {
          const dd = Math.hypot(q[0] - to[0], q[1] - to[1]);
          if (dd < hd && t + fl < trig[j]) {hd = dd; hit = j;}
        });
        if (hit >= 0) trig[hit] = Math.min(trig[hit], t + fl);
        balls.push({from: pts[i], to: hit >= 0 ? pts[hit] : to, t0: t, t1: t + fl, hit});
      }
    }
  }
  const end = Math.max(...trig.filter((x) => isFinite(x)), 0) + 1;
  return {pts, trig, balls, end};
};

/** Ratoneras con pelotas de ping pong (o núcleos con neutrones), con reacción en cadena determinista */
export const ChainSim: React.FC<{
  params: SimParams; startFrame: number; x: number; y: number; style: 'trap' | 'atom'; speed?: number; scale?: number; opacity?: number;
}> = ({params, startFrame, x, y, style, speed = 1, scale = 1, opacity = 1}) => {
  const frame = useCurrentFrame();
  const sim = useMemo(() => simulate(params), [params.cols, params.rows, params.spacing, params.reach, params.seed, params.balls]);
  const t = ((frame - startFrame) / 30) * speed;
  const s = params.spacing;
  const arm = 0; void arm;
  // bola inicial cayendo
  const dropT = t + 0.6;
  const [fx, fy] = sim.pts[sim.trig.indexOf(0)];
  return (
    <svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0, opacity}}>
      <g transform={`translate(${x},${y}) scale(${scale})`}>
        {sim.pts.map(([px, py], i) => {
          const tr = sim.trig[i];
          const sprung = t >= tr;
          const k = sprung ? ease(clamp01((t - tr) / 0.25)) : 0;
          if (style === 'trap')
            return (
              <g key={i} transform={`translate(${px},${py})`}>
                <rect x={-s * 0.3} y={-s * 0.2} width={s * 0.6} height={s * 0.4} rx={4} fill="#8a6a3d" stroke="#3b2a12" strokeWidth={2} />
                <rect x={-s * 0.3} y={-s * 0.2} width={s * 0.6} height={s * 0.07} fill="#b08d57" />
                <line x1={-s * 0.22} y1={0} x2={-s * 0.22 + s * 0.44 * (sprung ? 0.1 : 1)} y2={sprung ? -s * 0.34 * k : 0} stroke="#c9c9c9" strokeWidth={4} strokeLinecap="round" />
                {!sprung && <circle cx={0} cy={-s * 0.06} r={s * 0.13} fill="#fff" stroke="#bbb" strokeWidth={1.5} />}
              </g>
            );
          return (
            <g key={i} transform={`translate(${px},${py})`}>
              <circle r={s * 0.2} fill={sprung ? C.amber : '#7b8394'} opacity={sprung ? 0.35 + 0.65 * (1 - k) : 1} />
              <circle r={s * 0.12} cx={-s * 0.05} cy={-s * 0.04} fill="#aab1c2" opacity={sprung ? 0 : 0.9} />
              {sprung && <circle r={s * (0.2 + 0.5 * k)} fill="none" stroke={C.amber} strokeWidth={3} opacity={1 - k} />}
              {sprung && (
                <>
                  <circle cx={-s * 0.2 * k} cy={0} r={s * 0.1} fill={C.amber} opacity={0.85} />
                  <circle cx={s * 0.2 * k} cy={0} r={s * 0.1} fill={C.amber} opacity={0.85} />
                </>
              )}
            </g>
          );
        })}
        {/* pelotas / neutrones en vuelo */}
        {sim.balls.map((b, i) => {
          if (t < b.t0 || t > b.t1 + 0.9) return null;
          const q = clamp01((t - b.t0) / (b.t1 - b.t0));
          const bx = b.from[0] + (b.to[0] - b.from[0]) * q;
          const arc = Math.hypot(b.to[0] - b.from[0], b.to[1] - b.from[1]) * 0.28;
          const by = b.from[1] + (b.to[1] - b.from[1]) * q - Math.sin(q * Math.PI) * arc;
          const landed = q >= 1;
          if (landed && b.hit >= 0) return null;
          const fade = landed ? clamp01(1 - (t - b.t1) / 0.9) : 1;
          return style === 'trap' ? (
            <circle key={i} cx={bx} cy={by} r={s * 0.1} fill="#fff" stroke="#bbb" strokeWidth={1} opacity={fade} />
          ) : (
            <g key={i} opacity={fade}>
              <circle cx={bx} cy={by} r={s * 0.07} fill="#8fd3ff" />
              <circle cx={bx} cy={by} r={s * 0.16} fill="#8fd3ff" opacity={0.25} />
            </g>
          );
        })}
        {/* primera pelota cayendo */}
        {dropT < 0.8 && dropT > 0 && style === 'trap' && (
          <circle cx={fx} cy={fy - (1 - dropT / 0.6) * 400 * (dropT < 0.6 ? 1 : 0)} r={s * 0.1} fill="#fff" stroke="#bbb" opacity={t < 0 ? 1 : 0} />
        )}
        {t < 0 && t > -0.6 && (
          <circle cx={fx} cy={fy - ((-t) / 0.6) * 520 - s * 0.06} r={style === 'trap' ? s * 0.1 : s * 0.07} fill={style === 'trap' ? '#fff' : '#8fd3ff'} stroke="#bbb" />
        )}
      </g>
    </svg>
  );
};

/** fotogramas en que cada trampa salta (para sincronizar efectos de sonido) */
export const triggerFrames = (p: SimParams, startFrame: number, speed = 1, max = 24): number[] => {
  const sim = simulate(p);
  const fr = sim.trig.filter((t) => isFinite(t)).map((t) => Math.round(startFrame + (t / speed) * 30)).sort((a, b) => a - b);
  const out: number[] = [];
  for (const f of fr) if (!out.length || f - out[out.length - 1] >= 2) out.push(f);
  if (out.length <= max) return out;
  const step = out.length / max;
  return Array.from({length: max}, (_, i) => out[Math.floor(i * step)]);
};
