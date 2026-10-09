import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, F} from '../theme';
import {clamp01, ease, easeInOut, prog, vis} from './common';

/** Método de cañón: un trozo disparado contra otro. `premature` = el plutonio arranca demasiado pronto («pfff») */
export const Canon: React.FC<{x: number; y: number; from: number; to?: number; fireAt: number; premature?: boolean; label: string; color: string; badge?: string; badgeAt?: number; badgeColor?: string}> = ({x, y, from, to, fireAt, premature, label, color, badge, badgeAt = 0, badgeColor = C.amber}) => {
  const frame = useCurrentFrame();
  const o = vis(frame, from, to ?? Infinity, 14);
  const q = easeInOut(clamp01((frame - fireAt) / (premature ? 70 : 30)));
  const stopAt = premature ? 0.46 : 1;
  const px = 100 + (560 - 100) * Math.min(q, stopAt) / 1;
  const targetX = 660;
  const impact = !premature && frame >= fireAt + 30;
  const fizz = premature && q >= stopAt;
  const bp = ease(clamp01((frame - badgeAt) / 14));
  return (
    <svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0, opacity: o}}>
      <g transform={`translate(${x},${y}) scale(1.3) translate(-430,0)`}>
        <text x={400} y={-130} textAnchor="middle" fill={color} fontFamily={F.sans} fontWeight={600} fontSize={40} letterSpacing={6}>{label}</text>
        {/* tubo */}
        <rect x={0} y={-70} width={860} height={140} rx={20} fill="#16171c" stroke="rgba(245,241,232,0.45)" strokeWidth={4} />
        {/* explosivo convencional */}
        <rect x={14} y={-56} width={64} height={112} rx={8} fill={C.red} />
        <text x={46} y={110} textAnchor="middle" fill={C.bone} fontFamily={F.sans} fontSize={22} fontWeight={600}>explosivo</text>
        {/* blanco */}
        <rect x={targetX} y={-54} width={150} height={108} rx={16} fill={color} opacity={fizz ? 0.35 : 1} />
        {/* proyectil */}
        <rect x={px} y={-40} width={90} height={80} rx={14} fill={color} opacity={fizz ? 0.35 : 1} stroke="#0a0a0c" strokeWidth={3} />
        {impact && <circle cx={targetX} cy={0} r={150 * ease(clamp01((frame - fireAt - 30) / 20))} fill="#fff" opacity={Math.max(0, 1 - (frame - fireAt - 30) / 30) * 0.9} />}
        {/* pfff: la reacción arranca antes de tiempo */}
        {fizz && [0, 1, 2, 3, 4].map((k) => {
          const t = clamp01((frame - fireAt - 70 * stopAt) / 40);
          return <circle key={k} cx={px + 60 + (k - 2) * 28} cy={-70 - 80 * t - k * 8} r={14 + 22 * t} fill="#9aa0b0" opacity={0.7 * (1 - t)} />;
        })}
        {badge && (
          <g opacity={bp} transform={`translate(430, 190) scale(${0.9 + 0.1 * bp})`}>
            <text textAnchor="middle" fill={badgeColor} fontFamily={F.serif} fontWeight={700} fontSize={88} letterSpacing={3}>{badge}</text>
          </g>
        )}
      </g>
    </svg>
  );
};

/** Implosión: la esfera de plutonio rodeada de explosivos que se encienden a la vez */
export const Implosion: React.FC<{x: number; y: number; from: number; to?: number; igniteAt: number}> = ({x, y, from, to, igniteAt}) => {
  const frame = useCurrentFrame();
  const o = vis(frame, from, to ?? Infinity, 14);
  const c = easeInOut(clamp01((frame - igniteAt - 8) / 150)); // cámara lenta
  const flash = frame >= igniteAt ? clamp01(1 - (frame - igniteAt) / 16) : 0;
  const R = 170 - 105 * c;
  const lens = 16;
  const lit = frame >= igniteAt;
  return (
    <svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0, opacity: o}}>
      <g transform={`translate(${x},${y})`}>
        {Array.from({length: lens}, (_, k) => {
          const a = (k / lens) * 360;
          const dist = 260 - 105 * c;
          return (
            <g key={k} transform={`rotate(${a}) translate(${dist},0)`}>
              <rect x={-40} y={-34} width={80} height={68} rx={8} fill={lit ? '#ff6a2b' : C.red} stroke="#0a0a0c" strokeWidth={3} />
              {lit && <path d="M-40 0 L-110 0" stroke="#ffd36b" strokeWidth={5} opacity={Math.max(0, 1 - c * 1.5)} />}
            </g>
          );
        })}
        <circle r={R} fill={C.amber} stroke="#fff" strokeWidth={4} opacity={0.96} />
        <circle r={R * 0.55} fill="#ffd36b" opacity={0.9} />
        <circle r={380} fill="#fff" opacity={flash * 0.35} />
        <text y={375} textAnchor="middle" fill={C.bone} fontFamily={F.sans} fontWeight={600} fontSize={34} letterSpacing={6} opacity={prog(frame, from + 20, 20)}>EXPLOSIVOS · ESFERA DE PLUTONIO</text>
      </g>
    </svg>
  );
};
