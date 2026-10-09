import React, {useMemo} from 'react';
import {Audio, Sequence, staticFile} from 'remotion';
import {cueIn, Layout} from './layout';
import {FPS} from './theme';

const STEMS = ['drone', 'strings', 'pulse', 'human', 'resolve'] as const;
type Stem = (typeof STEMS)[number];
const MASTER = 0.13;

// nivel de cada pista de música por escena [drone, strings, pulse, human, resolve]
const LEVELS: Record<number, number[]> = {
  1: [0.9, 0.2, 0.6, 0, 0],
  2: [0.6, 0.5, 0.35, 0, 0],
  3: [0.45, 0.55, 0.25, 0, 0],
  4: [0.35, 0.3, 0.5, 0, 0],
  5: [0.4, 0.4, 0.5, 0, 0],
  6: [0.5, 0.55, 0.55, 0, 0],
  7: [0.9, 0.9, 0.9, 0, 0],
  8: [0.4, 0, 0, 0, 0],
  9: [0.2, 0.25, 0, 0.9, 0],
  10: [0, 0.1, 0, 0.6, 0.5],
  11: [0, 0, 0, 0.2, 0.9],
};

type KP = [number, number]; // [frame, value]

const interp = (kps: KP[], f: number) => {
  if (f <= kps[0][0]) return kps[0][1];
  for (let k = 1; k < kps.length; k++) {
    if (f <= kps[k][0]) {
      const [f0, v0] = kps[k - 1];
      const [f1, v1] = kps[k];
      return v0 + ((v1 - v0) * (f - f0)) / Math.max(1, f1 - f0);
    }
  }
  return kps[kps.length - 1][1];
};

export const buildMix = (layout: Layout) => {
  const total = layout.total + 2;
  // --- actividad de voz → ducking suave
  const active = new Float32Array(total);
  for (const sc of layout.scenes) {
    const base = sc.start + sc.voiceOffset;
    let prevEnd = -1;
    const spans: [number, number][] = [];
    for (const w of sc.words) {
      const s = base + w.s * FPS - 1;
      const e = base + w.e * FPS + 3;
      if (spans.length && s - spans[spans.length - 1][1] < 10) spans[spans.length - 1][1] = e;
      else spans.push([s, e]);
      prevEnd = e;
    }
    void prevEnd;
    for (const [s, e] of spans) for (let f = Math.max(0, Math.floor(s)); f <= Math.min(total - 1, Math.ceil(e)); f++) active[f] = 1;
  }
  const duck = new Float32Array(total);
  let y = 0;
  for (let f = 0; f < total; f++) {
    const a = active[f];
    const k = a > y ? 1 - Math.exp(-1 / (0.22 * FPS)) : 1 - Math.exp(-1 / (0.7 * FPS));
    y += (a - y) * k;
    duck[f] = 1 - 0.45 * y; // ≈ -5 dB con voz
  }
  // --- niveles por pista
  const sc = layout.scenes;
  const curves: Record<Stem, KP[]> = {drone: [], strings: [], pulse: [], human: [], resolve: []};
  STEMS.forEach((st, si) => {
    const kps: KP[] = [];
    sc.forEach((s, idx) => {
      const lv = LEVELS[s.i][si];
      if (idx === 0) kps.push([0, 0]); // silencio total hasta el retumbo
      if (s.i === 1) {
        kps.push([150, 0], [150 + 150, lv]);
      } else {
        kps.push([s.start - 10, LEVELS[sc[idx - 1].i][si]], [s.start + 80, lv]);
      }
      if (s.i === 7) {
        // Trinity: crece; tras «Pero mientras ellos…» vuelve a un tono humano
        const pero = s.start + cueIn(s, 'pero');
        const lvEnd = [0.5, 0.2, 0, 0.5, 0][si];
        kps.push([s.start + 80, lv * 0.7], [pero - 20, lv], [pero + 40, lvEnd]);
      }
      if (s.i === 8) {
        // casi desaparece: solo un drone muy bajo
        kps.push([s.start + 80, lv], [s.start + s.dur - 20, lv * 0.5]);
      }
      if (s.i === 11) {
        const endV = s.start + s.voiceOffset + s.audioFrames;
        kps.push([s.start + 80, lv], [endV + 120, lv], [s.start + s.dur - 8, 0]);
      }
    });
    kps.sort((a, b) => a[0] - b[0]);
    // eliminar puntos con frame repetido/retroceso
    const clean: KP[] = [];
    for (const k of kps) if (!clean.length || k[0] > clean[clean.length - 1][0]) clean.push(k);
    curves[st] = clean;
  });
  const sc8 = sc.find((s) => s.i === 8)!;
  return {
    total,
    duck,
    vol: (st: Stem, f: number) => {
      const ff = Math.max(0, Math.min(total - 1, Math.round(f)));
      let g = interp(curves[st], ff) * MASTER * duck[ff];
      if (ff >= sc8.start && ff < sc8.start + sc8.dur) g *= 0.6;
      return Math.max(0, g);
    },
  };
};

export const Mix: React.FC<{layout: Layout}> = ({layout}) => {
  const mix = useMemo(() => buildMix(layout), [layout]);
  const s7 = layout.scenes.find((s) => s.i === 7)!;
  const s1 = layout.scenes.find((s) => s.i === 1)!;
  const lastFade = layout.scenes[layout.scenes.length - 1];
  return (
    <>
      {layout.scenes.map((s) => (
        <Sequence key={s.i} from={s.start + s.voiceOffset} durationInFrames={s.audioFrames + 4} layout="none">
          <Audio src={staticFile(s.file)} volume={1} />
        </Sequence>
      ))}
      {STEMS.map((st) => (
        <Audio key={st} src={staticFile(`music/${st}.wav`)} loop volume={(f) => mix.vol(st, f)} />
      ))}
      {/* riser de Trinity */}
      <Sequence from={s7.start + 10} durationInFrames={24 * FPS} layout="none">
        <Audio src={staticFile('music/riser.wav')} volume={(f) => 0.16 * Math.min(1, f / 60) * mix.duck[Math.min(mix.total - 1, s7.start + 10 + f)] ** 0.5 * Math.max(0, 1 - Math.max(0, f - 22 * FPS) / FPS)} />
      </Sequence>
      <Sequence from={s1.start} layout="none"><></></Sequence>
      <Sequence from={lastFade.start} layout="none"><></></Sequence>
    </>
  );
};
