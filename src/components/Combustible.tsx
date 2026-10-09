import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, F} from '../theme';
import {clamp01, ease, prog, vis} from './common';

/** Barra de uranio natural: 99 % U-238 (gris) y menos del 1 % U-235 (naranja) */
export const BarraUranio: React.FC<{x: number; y: number; from: number; to?: number; zoomAt: number}> = ({x, y, from, to, zoomAt}) => {
  const frame = useCurrentFrame();
  const o = vis(frame, from, to ?? Infinity, 14);
  const cols = 50, rows = 10, sp = 30;
  const hot = new Set([3 * 50 + 14, 7 * 50 + 31, 5 * 50 + 44]); // 3 de 500 = 0,6 %
  const z = ease(clamp01((frame - zoomAt) / 50));
  const focus = [14 * sp, 3 * sp];
  const scale = 1 + 5.2 * z;
  return (
    <div style={{position: 'absolute', left: 0, top: 0, width: 1920, height: 1080, opacity: o, overflow: 'hidden'}}>
      <svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0}}>
        <g transform={`translate(${x},${y}) scale(${scale}) translate(${-(cols * sp) / 2 - z * (focus[0] - (cols * sp) / 2)},${-(rows * sp) / 2 - z * (focus[1] - (rows * sp) / 2)})`}>
          <rect x={-14} y={-14} width={cols * sp + 28} height={rows * sp + 28} rx={18} fill="#16171c" stroke="rgba(245,241,232,0.3)" strokeWidth={3} />
          {Array.from({length: cols * rows}, (_, k) => {
            const cx = (k % cols) * sp + sp / 2, cy = Math.floor(k / cols) * sp + sp / 2;
            const isHot = hot.has(k);
            const appear = clamp01((frame - from - (k % cols) * 0.5) / 12);
            return <circle key={k} cx={cx} cy={cy} r={isHot ? 12 : 9.5} fill={isHot ? C.amber : '#6b7080'} opacity={appear} style={isHot ? {filter: 'drop-shadow(0 0 8px #f59e0b)'} : undefined} />;
          })}
        </g>
      </svg>
      <div style={{position: 'absolute', left: 0, width: 1920, top: 190, textAlign: 'center', fontFamily: F.sans, fontWeight: 600, fontSize: 40, color: C.bone, opacity: 1 - z}}>
        <span style={{color: '#9aa0b0'}}>URANIO-238 · 99 %</span>
      </div>
      <div style={{position: 'absolute', left: 0, width: 1920, top: 780, textAlign: 'center', fontFamily: F.sans, fontWeight: 600, fontSize: 44, color: C.amber, opacity: vis(frame, zoomAt - 6, Infinity, 12)}}>URANIO-235 · menos del 1 %</div>
    </div>
  );
};

/** Dos caminos que se bifurcan, cada uno con varias técnicas */
export const Bifurcacion: React.FC<{from: number; to?: number; atPlut: number; atTech: number}> = ({from, to, atPlut, atTech}) => {
  const frame = useCurrentFrame();
  const o = vis(frame, from, to ?? Infinity, 14);
  const pu = prog(frame, atPlut, 24);
  const un = prog(frame, from + 6, 24);
  const tech = (side: number, k: number) => prog(frame, atTech + k * 8 + (side ? 14 : 0), 16);
  const node = (x: number, y: number, label: string, color: string, p: number) => (
    <div style={{position: 'absolute', left: x, top: y, transform: `translate(-50%,-50%) scale(${0.85 + 0.15 * p})`, opacity: p, padding: '16px 34px', border: `3px solid ${color}`, color, fontFamily: F.serif, fontWeight: 700, fontSize: 52, background: 'rgba(10,10,12,0.8)', letterSpacing: 3, borderRadius: 10, whiteSpace: 'nowrap'}}>{label}</div>
  );
  return (
    <div style={{position: 'absolute', inset: 0, opacity: o}}>
      <svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0}}>
        <g stroke={C.bone} strokeWidth={4} fill="none" strokeLinecap="round" opacity={0.8}>
          <path d="M960 260 L960 330 L600 400 L600 440" strokeDasharray="700" strokeDashoffset={700 * (1 - un)} />
          <path d="M960 330 L1320 400 L1320 440" strokeDasharray="700" strokeDashoffset={700 * (1 - pu)} />
        </g>
        {[0, 1].map((side) =>
          [0, 1, 2].map((k) => {
            const x0 = side ? 1320 : 600, x1 = x0 + (k - 1) * 190;
            const p = tech(side, k);
            return (
              <g key={`${side}${k}`} opacity={p}>
                <line x1={x0} y1={500} x2={x0 + (x1 - x0) * p} y2={500 + 130 * p} stroke={side ? '#8fd3ff' : C.amber} strokeWidth={3} strokeLinecap="round" />
                <rect x={x1 - 62} y={640} width={124} height={64} rx={10} fill="rgba(10,10,12,0.75)" stroke={side ? '#8fd3ff' : C.amber} strokeWidth={3} />
                <rect x={x1 - 38} y={664} width={76} height={8} rx={4} fill={side ? '#8fd3ff' : C.amber} opacity={0.8} />
                <rect x={x1 - 38} y={682} width={50} height={8} rx={4} fill={side ? '#8fd3ff' : C.amber} opacity={0.45} />
              </g>
            );
          }),
        )}
      </svg>
      {node(960, 230, 'COMBUSTIBLE', C.bone, prog(frame, from, 20))}
      {node(600, 470, 'URANIO-235', C.amber, un)}
      {node(1320, 470, 'PLUTONIO', '#8fd3ff', pu)}
    </div>
  );
};

/** Primer reactor de Fermi (Chicago Pile): ilustración vectorial de la pila de grafito */
export const Reactor: React.FC<{x: number; y: number; from: number; at: number; to?: number}> = ({x, y, from, at, to}) => {
  const frame = useCurrentFrame();
  const o = vis(frame, from, to ?? Infinity, 14);
  const layers = 9;
  const rod = ease(clamp01((frame - at) / 70));
  const glow = ease(clamp01((frame - at - 40) / 60));
  return (
    <svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0, opacity: o}}>
      <defs>
        <radialGradient id="pg"><stop offset="0" stopColor="#f59e0b" stopOpacity="0.8" /><stop offset="1" stopColor="#f59e0b" stopOpacity="0" /></radialGradient>
      </defs>
      <g transform={`translate(${x},${y})`}>
        <ellipse cx={0} cy={-120} rx={520 * glow + 1} ry={360 * glow + 1} fill="url(#pg)" />
        {Array.from({length: layers}, (_, r) => {
          const w = 700 - r * 52;
          const bricks = 7 - Math.floor(r / 2);
          const bw = w / bricks;
          return (
            <g key={r} transform={`translate(${-w / 2}, ${-r * 46})`}>
              {Array.from({length: bricks}, (_, b) => (
                <rect key={b} x={b * bw + 2} y={-44} width={bw - 4} height={42} fill={(r + b) % 2 ? '#2a2c33' : '#34363f'} stroke="#0a0a0c" strokeWidth={2} />
              ))}
            </g>
          );
        })}
        {/* barra de control que se retira */}
        <rect x={-10} y={-layers * 46 - 40 - 130 * rod} width={20} height={layers * 46 + 40} fill={C.amber} opacity={0.95} />
        <rect x={-34} y={-layers * 46 - 56 - 130 * rod} width={68} height={16} fill="#d9d4c4" />
      </g>
    </svg>
  );
};
