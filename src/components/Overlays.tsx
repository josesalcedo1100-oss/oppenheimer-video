import React from 'react';
import {AbsoluteFill, random, staticFile, useCurrentFrame} from 'remotion';
import {C, F, FPS} from '../theme';
import {useLayout} from '../ctx';
import {Word} from '../layout';

/** Grano de película (textura generada por código, desplazada con semilla) + viñeta */
export const Grain: React.FC = () => {
  const frame = useCurrentFrame();
  const k = Math.floor(frame / 2);
  const gx = Math.floor(random('gx' + k) * 512);
  const gy = Math.floor(random('gy' + k) * 512);
  return (
    <>
      <AbsoluteFill
        style={{
          backgroundImage: `url(${staticFile('img/grain.png')})`,
          backgroundPosition: `${gx}px ${gy}px`,
          opacity: 0.11,
          mixBlendMode: 'overlay',
        }}
      />
      <AbsoluteFill style={{background: 'radial-gradient(120% 120% at 50% 50%, transparent 55%, rgba(0,0,0,0.62) 100%)'}} />
    </>
  );
};

type Chunk = {words: {w: string; s: number; e: number}[]; s: number; e: number};

const buildChunks = (words: Word[]): Chunk[] => {
  const out: Chunk[] = [];
  let cur: Word[] = [];
  const flush = () => {
    if (cur.length) out.push({words: cur, s: cur[0].s, e: cur[cur.length - 1].e});
    cur = [];
  };
  for (const w of words) {
    cur.push(w);
    const len = cur.map((x) => x.w).join(' ').length;
    if (/[.?!…:]["»”]?$/.test(w.w) || (/[,;]["»”]?$/.test(w.w) && cur.length >= 3) || cur.length >= 8 || len > 46) flush();
  }
  flush();
  return out;
};

export const Subtitles: React.FC<{hideFrom?: number}> = ({hideFrom}) => {
  const frame = useCurrentFrame();
  const layout = useLayout();
  const sc = layout.scenes.find((s) => frame >= s.start && frame < s.start + s.dur - 1 - (s.i < layout.scenes.length ? 0 : 0));
  // la escena activa es la última cuyo audio ya empezó (J-cut) o la que contiene el fotograma
  const active = [...layout.scenes].reverse().find((s) => frame >= s.start + s.voiceOffset - 2) ?? sc;
  if (!active) return null;
  if (hideFrom && frame >= hideFrom) return null;
  const t = (frame - (active.start + active.voiceOffset)) / FPS; // segundos de voz
  const chunks = buildChunks(active.words);
  let idx = chunks.findIndex((c, k) => t >= c.s - 0.05 && t < (chunks[k + 1]?.s ?? c.e + 0.4) - 0.0 && t < c.e + 0.6);
  if (idx < 0) return null;
  const ch = chunks[idx];
  return (
    <AbsoluteFill style={{justifyContent: 'flex-end', alignItems: 'center', paddingBottom: 74}}>
      <div
        style={{
          fontFamily: F.sans, fontWeight: 600, fontSize: 44, color: C.bone, textAlign: 'center',
          padding: '10px 28px', borderRadius: 10, background: 'rgba(8,8,10,0.55)',
          textShadow: '0 2px 10px rgba(0,0,0,0.9)', maxWidth: 1500, lineHeight: 1.25,
        }}>
        {ch.words.map((w, k) => {
          const on = t >= w.s - 0.02 && t < w.e + 0.08;
          const past = t >= w.e + 0.08;
          return (
            <span key={k} style={{color: on ? C.amber : past ? C.bone : 'rgba(245,241,232,0.62)'}}>
              {w.w}{k < ch.words.length - 1 ? ' ' : ''}
            </span>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
