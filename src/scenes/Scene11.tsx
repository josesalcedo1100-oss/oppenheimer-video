import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {useScene} from '../ctx';
import {C, F} from '../theme';
import {Backdrop, Sfx, Title, clamp01, prog, vis} from '../components/common';

/** Pantalla final de 20 s con huecos libres a izquierda y derecha para las tarjetas de YouTube */
export const Scene11: React.FC = () => {
  const frame = useCurrentFrame();
  const {cue, sc} = useScene();
  const cAhora = cue('Ahora');
  const cAqui = cue('aquí');
  const cSusc = cue('suscríbete');
  const endV = sc.voiceOffset + sc.audioFrames;
  const endCard = sc.dur - 600; // los últimos 20 s
  const pl = prog(frame, cAqui - 10, 24);
  const pr = prog(frame, cSusc - 20, 24);
  const dash: React.CSSProperties = {border: `3px dashed rgba(245,241,232,0.35)`, borderRadius: 16, background: 'rgba(245,241,232,0.03)'};
  return (
    <Backdrop tone="warm">
      <Title text="¿Villano, víctima o algo más complicado? ↓" size={64} color={C.bone} x={960} y={190} from={cAhora} />
      <Sfx src="ui_pop" at={cAhora} vol={0.5} />
      {/* hueco izquierdo: vídeo recomendado (zona libre ≈ 740×416) */}
      <div style={{position: 'absolute', left: 140, top: 330, width: 740, height: 416, opacity: pl, ...dash}} />
      <Title text="[TU PRÓXIMO VÍDEO]" size={28} font="sans" color={C.boneDim} x={510} y={790} from={cAqui} spacing={6} />
      {/* hueco derecho: suscripción (zona libre ≈ 740×416) */}
      <div style={{position: 'absolute', left: 1040, top: 330, width: 740, height: 416, opacity: pr, ...dash}} />
      <Title text="SUSCRÍBETE" size={28} font="sans" color={C.boneDim} x={1410} y={790} from={cSusc - 10} spacing={6} />
      <Sfx src="whoosh" at={cAqui - 10} vol={0.4} />
      <Sfx src="ui_pop" at={cSusc - 20} vol={0.5} />
      {/* fundido final suave a negro */}
      <AbsoluteFill style={{background: `rgba(0,0,0,${vis(frame, sc.dur - 60, Infinity, 55) * 0.9})`}} />
    </Backdrop>
  );
};
