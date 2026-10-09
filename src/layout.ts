import {FPS, TRANS} from './theme';

export type Word = {w: string; s: number; e: number};
export type SceneLayout = {
  i: number; // 1..11
  title: string;
  file: string;
  start: number; // fotograma absoluto de inicio
  dur: number; // duración en fotogramas
  voiceOffset: number; // fotogramas desde el inicio de la escena hasta la voz
  audioFrames: number;
  audioDur: number;
  words: Word[];
};
export type Layout = {scenes: SceneLayout[]; total: number};
export type Manifest = {scenes: {scene: number; title: string; file: string; duration: number; words: Word[]}[]};

export const VOICE_OFFSET: Record<number, number> = {1: 165};
export const TAIL: Record<number, number> = {8: 96, 10: 40, 11: 600};
const DEFAULT_OFFSET = 10;
const DEFAULT_TAIL = 18;

export const computeLayout = (m: Manifest, realDur?: Record<number, number>): Layout => {
  let cursor = 0;
  const scenes: SceneLayout[] = m.scenes.map((s, idx) => {
    const audioDur = realDur?.[s.scene] ?? s.duration;
    const ratio = audioDur / s.duration;
    const audioFrames = Math.ceil(audioDur * FPS);
    const voiceOffset = VOICE_OFFSET[s.scene] ?? DEFAULT_OFFSET;
    const dur = voiceOffset + audioFrames + (TAIL[s.scene] ?? DEFAULT_TAIL);
    const start = cursor;
    cursor += dur - (idx < m.scenes.length - 1 ? TRANS : 0);
    return {
      i: s.scene,
      title: s.title,
      file: s.file,
      start,
      dur,
      voiceOffset,
      audioFrames,
      audioDur,
      words: s.words.map((w) => ({w: w.w, s: w.s * ratio, e: w.e * ratio})),
    };
  });
  return {scenes, total: cursor};
};

const norm = (s: string) =>
  s
    .toLowerCase()
    .replace(/[.,;:¿?¡!«»"”“()…\[\]]/g, '')
    .trim();

/** Fotograma LOCAL de la escena en que se pronuncia `query` (n-ésima aparición). */
export const cueIn = (sc: SceneLayout, query: string, nth = 1): number => {
  const q = norm(query).split(/\s+/);
  const ws = sc.words.map((w) => norm(w.w));
  let found = 0;
  for (let k = 0; k + q.length <= ws.length; k++) {
    if (q.every((t, j) => ws[k + j] === t)) {
      found++;
      if (found === nth) return sc.voiceOffset + Math.round(sc.words[k].s * FPS);
    }
  }
  console.error(`cue no encontrado en escena ${sc.i}: "${query}"`);
  return sc.voiceOffset;
};

/** Fin (local) de la palabra */
export const cueEnd = (sc: SceneLayout, query: string, nth = 1): number => {
  const q = norm(query).split(/\s+/);
  const ws = sc.words.map((w) => norm(w.w));
  let found = 0;
  for (let k = 0; k + q.length <= ws.length; k++) {
    if (q.every((t, j) => ws[k + j] === t)) {
      found++;
      if (found === nth) return sc.voiceOffset + Math.round(sc.words[k + q.length - 1].e * FPS);
    }
  }
  return sc.voiceOffset;
};
