import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {useScene} from '../ctx';
import {C, F} from '../theme';
import {Backdrop, Cam, Sfx, Title, clamp01, ease, prog, vis} from '../components/common';
import {Destello} from '../components/Destello';
import {Desierto} from '../components/Desierto';
import {Silueta} from '../components/Silueta';

const FLASH = 126; // 4,2 s: destello tras ~1 s de silencio
const BOOM = 150; // el retumbo llega DESPUÉS del destello

export const Scene01: React.FC = () => {
  const frame = useCurrentFrame();
  const {cue, sc} = useScene();
  const ticks = [9, 27, 45, 63, 81, 99];
  const fire = clamp01((frame - FLASH) / 620) * 1.0;
  const hatAt = cue('manos');
  const hatP = prog(frame, hatAt, 40);
  const hatOut = clamp01((frame - (cue('Hoy') - 20)) / 20);
  const question = cue('villano,');
  const pre = frame < FLASH;
  return (
    <AbsoluteFill style={{background: '#000'}}>
      {/* cuenta atrás en negro */}
      {pre && (
        <AbsoluteFill>
          {ticks.map((t, k) => {
            const p = clamp01((frame - t) / 18);
            return <div key={k} style={{position: 'absolute', left: 960, top: 540, width: 160 + p * 560, height: 160 + p * 560, transform: 'translate(-50%,-50%)', borderRadius: '50%', border: '2px solid rgba(245,158,11,' + 0.5 * (1 - p) * (frame >= t ? 1 : 0) + ')'}} />;
          })}
          <Title text="16 DE JULIO DE 1945 · 5:29 A. M." size={64} color={C.bone} from={4} to={104} spacing={6} y={540} />
        </AbsoluteFill>
      )}
      {ticks.map((t, k) => (
        <Sfx key={k} src={k % 2 ? 'tock' : 'tick'} at={t} vol={0.75} />
      ))}
      <Sfx src="flash" at={FLASH} vol={0.5} />
      <Sfx src="boom" at={BOOM} vol={0.9} />
      {/* después del destello: el desierto */}
      {frame >= FLASH && (
        <AbsoluteFill style={{opacity: clamp01((frame - FLASH - 2) / 8)}}>
          <Cam z0={1.0} z1={1.16} x0={0} x1={-90} y0={0} y1={-30} origin="55% 70%">
            <Desierto fire={fire} />
          </Cam>
          {/* silueta con sombrero, de espaldas, frente a la bola de fuego */}
          <div style={{position: 'absolute', left: 230, bottom: -40, opacity: hatP * (1 - hatOut), transform: `translateX(${(1 - hatP) * -120}px) scale(${1 + 0.05 * (frame - hatAt) / 90})`, transformOrigin: 'bottom left'}}>
            <Silueta kind="hat" width={700} id="g1" />
          </div>
          <Title text={'¿VILLANO, VÍCTIMA…\nO ALGO MÁS INCÓMODO?'} size={78} color={C.bone} from={question} x={470} y={360} spacing={2} />
        </AbsoluteFill>
      )}
      <Destello at={FLASH} hold={4} decay={46} />
    </AbsoluteFill>
  );
};
