import React from 'react';
import {useCurrentFrame} from 'remotion';
import {useScene} from '../ctx';
import {C} from '../theme';
import {Backdrop, Cam, Sfx, Title, vis} from '../components/common';
import {Chip} from '../components/Linea';
import {ChainSim, SimParams, triggerFrames} from '../components/Chain';

const DENSE: SimParams = {cols: 14, rows: 6, spacing: 92, reach: 190, seed: 'dense', balls: 2};
const SPARSE: SimParams = {cols: 6, rows: 3, spacing: 240, reach: 190, seed: 'sparse', balls: 2};

export const Scene04: React.FC = () => {
  const frame = useCurrentFrame();
  const {cue} = useScene();
  const cLanzas = cue('Lanzas');
  const cEso = cue('Eso');
  const cReac = cue('reacción');
  const cPocas = cue('pocas');
  const cMasa = cue('masa');
  const launch1 = cLanzas + 22;
  const launch2 = cEso + 40;
  const launch3 = cPocas + 50;
  const p1 = [0, cEso - 8];
  const p2 = [cEso - 8, cPocas - 6];
  const p3 = [cPocas - 6, Infinity];
  return (
    <Backdrop tone="amber">
      <Cam z0={1.0} z1={1.05}>
        {/* 1) sala de ratoneras con pelotas */}
        <div style={{position: 'absolute', inset: 0, opacity: vis(frame, p1[0], p1[1], 12)}}>
          <ChainSim params={DENSE} startFrame={launch1} x={960} y={500} scale={1.2} style="trap" />
        </div>
        {/* 2) las pelotas pasan a ser neutrones, las ratoneras núcleos de uranio */}
        <div style={{position: 'absolute', inset: 0, opacity: vis(frame, p2[0], p2[1], 12)}}>
          <ChainSim params={DENSE} startFrame={launch2} x={960} y={500} scale={1.2} style="atom" />
        </div>
        {/* 3) ratoneras muy separadas: la cadena se apaga */}
        <div style={{position: 'absolute', inset: 0, opacity: vis(frame, p3[0], p3[1], 12)}}>
          <ChainSim params={SPARSE} startFrame={launch3} x={960} y={500} style="trap" />
        </div>
      </Cam>
      <Title text="EL EXPERIMENTO DE LAS RATONERAS" size={38} font="sans" color={C.boneDim} spacing={8} x={960} y={110} from={6} to={cEso - 10} />
      <Chip text="REACCIÓN EN CADENA" x={960} y={140} from={cReac} to={cPocas - 10} size={52} color={C.amber} />
      <Chip text="MASA CRÍTICA" x={960} y={140} from={cMasa} size={52} color={C.amber} />
      <Title text="núcleos de uranio · neutrones" size={30} font="sans" color={C.boneDim} spacing={4} x={960} y={850} from={cEso + 4} to={cPocas - 10} />
      <Sfx src="whoosh" at={cEso} vol={0.4} />
      <Sfx src="ui_pop" at={cReac} vol={0.5} />
      <Sfx src="ui_pop" at={cMasa} vol={0.5} />
      {triggerFrames(DENSE, launch1).map((f, i) => (
        <Sfx key={'a' + i} src="snap" at={f} vol={0.18 + 0.2 * Math.min(1, i / 8)} />
      ))}
      {triggerFrames(DENSE, launch2, 1, 14).map((f, i) => (
        <Sfx key={'b' + i} src="pingpong" at={f} vol={0.22} />
      ))}
      {triggerFrames(SPARSE, launch3, 1, 10).map((f, i) => (
        <Sfx key={'c' + i} src="snap" at={f} vol={0.3} />
      ))}
    </Backdrop>
  );
};
