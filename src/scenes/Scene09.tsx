import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {useScene} from '../ctx';
import {C, F} from '../theme';
import {Backdrop, Cam, Sfx, Title, clamp01, prog, vis} from '../components/common';
import {Chip, RotuloDeFecha} from '../components/Linea';
import {Documento} from '../components/Documento';
import {Silueta} from '../components/Silueta';
import {MapaSVG, MapDot} from '../components/MapaSVG';
import {NUKE_POINTS} from '../data';

const Tarjeta: React.FC<{x: number; text: string; at: number; to: number}> = ({x, text, at, to}) => {
  const frame = useCurrentFrame();
  const p = prog(frame, at, 20);
  return (
    <div style={{position: 'absolute', left: x, top: 470, width: 520, height: 300, transform: `translate(-50%,-50%) translateY(${(1 - p) * 50}px)`, opacity: vis(frame, at, to, 12), border: `3px solid ${C.bone}`, background: 'rgba(14,12,10,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', fontFamily: F.serif, fontWeight: 700, fontSize: 58, color: C.bone, letterSpacing: 2, padding: 30, boxShadow: '0 24px 60px rgba(0,0,0,0.6)'}}>
      {text}
    </div>
  );
};

/** Mesa de debate internacional: figuras alrededor de una mesa ovalada */
const Reunion: React.FC<{from: number; to: number}> = ({from, to}) => {
  const frame = useCurrentFrame();
  const o = vis(frame, from, to, 16);
  return (
    <div style={{position: 'absolute', left: 560, top: 250, width: 800, height: 520, opacity: o}}>
      <svg viewBox="0 0 800 520" width={800} height={520}>
        <ellipse cx={400} cy={290} rx={300} ry={110} fill="#3a2c1e" stroke={C.amber} strokeWidth={3} />
        {[0, 1, 2, 3, 4, 5].map((k) => {
          const a = Math.PI + (k / 5) * Math.PI;
          const x = 400 + Math.cos(a) * 300, y = 290 + Math.sin(a) * 150 - 40;
          const x2 = 400 + Math.cos(a + Math.PI) * 300;
          return (
            <g key={k} opacity={prog(frame, from + 6 + k * 4, 14)}>
              <circle cx={x} cy={y - 34} r={26} fill="#120e0a" stroke={C.amber} strokeWidth={2} />
              <path d={`M${x - 52} ${y + 40} C${x - 52} ${y} ${x - 20} ${y - 8} ${x} ${y - 8} C${x + 20} ${y - 8} ${x + 52} ${y} ${x + 52} ${y + 40} Z`} fill="#120e0a" stroke={C.amber} strokeWidth={2} />
              <circle cx={x2} cy={560 - y + 40 - 34 + 0} r={0} />
            </g>
          );
        })}
        <circle cx={400} cy={290} r={58} fill="none" stroke={C.bone} strokeWidth={2} opacity={0.7} />
        <ellipse cx={400} cy={290} rx={58} ry={22} fill="none" stroke={C.bone} strokeWidth={1.5} opacity={0.6} />
        <line x1={400} y1={232} x2={400} y2={348} stroke={C.bone} strokeWidth={1.5} opacity={0.6} />
      </svg>
    </div>
  );
};

export const Scene09: React.FC = () => {
  const frame = useCurrentFrame();
  const {cue, sc} = useScene();
  const cConocia = cue('Conocía');
  const cOpuso = cue('opuso');
  const cTrab = cue('trabajó');
  const cPero = cue('Pero');
  const cDimitio = cue('Dimitió');
  const cControl = cue('control');
  const cGob = cue('gobierno');
  const c1949 = cue('1949');
  const cFuchs = cue('Fuchs,');
  const c1954 = cue('1954');
  const cHombre = cue('hombre');
  const cPaises = cue('países');
  const cCarrera = cue('carrera');
  const cFbi = cue('FBI');
  const warm = frame >= cPero - 10;
  return (
    <Backdrop tone={warm ? 'warm' : 'cold'}>
      {/* tres tarjetas con voz de debate */}
      <Tarjeta x={430} text="CONOCÍA EL PLAN" at={cConocia} to={cPero - 8} />
      <Tarjeta x={960} text="NO SE OPUSO" at={cOpuso - 4} to={cPero - 8} />
      <Tarjeta x={1490} text="TRABAJÓ COMO NUNCA" at={cTrab - 4} to={cPero - 8} />
      <Sfx src="paper" at={cConocia} vol={0.6} />
      <Sfx src="paper" at={cOpuso - 4} vol={0.6} />
      <Sfx src="paper" at={cTrab - 4} vol={0.6} />

      {/* otros países tendrán la bomba: la carrera acababa de empezar */}
      <div style={{position: 'absolute', left: 260, top: 200, opacity: vis(frame, cPero + 40, cDimitio - 10, 16)}}>
        <MapaSVG kind="world" width={1400} height={700}>
          {(proj) => (
            <g>
              {NUKE_POINTS.map((ll, k) => {
                const [x, y] = proj(ll);
                const at = cPaises + k * 14;
                return <MapDot key={k} x={x} y={y} r={8} t={(frame - at) / 30 + (frame >= at ? 0.01 : 0)} />;
              })}
            </g>
          )}
        </MapaSVG>
      </div>
      <Title text="LA CARRERA ACABABA DE EMPEZAR" size={56} color={C.amber} x={960} y={150} from={cCarrera} to={cDimitio - 10} spacing={6} />
      <Sfx src="whoosh" at={cPero + 40} vol={0.4} />
      {/* giro cálido: dimisión y control internacional */}
      <Documento x={560} y={540} w={540} h={640} rot={-3} from={cDimitio} to={cControl - 4} header="LOS ÁLAMOS · DIMISIÓN" bars={8} footer="recreación · octubre de 1945" />
      <Title text="OCTUBRE DE 1945" size={46} color={C.amber} x={1250} y={380} from={cDimitio + 10} to={cControl - 4} spacing={6} />
      <Sfx src="paper" at={cDimitio} vol={0.6} />
      <Reunion from={cControl} to={cGob - 4} />
      <Title text="CONTROL INTERNACIONAL" size={48} color={C.bone} x={960} y={850} from={cControl + 8} to={cGob - 4} spacing={6} />
      <Sfx src="whoosh" at={cControl} vol={0.4} />

      <Title text="EL GOBIERNO NO QUISO ESCUCHAR" size={72} color={C.bone} x={960} y={470} from={cGob + 6} to={c1949 - 16} />
      {/* 1949 y Klaus Fuchs */}
      <RotuloDeFecha date="1949 · LA URSS DETONA SU PRIMERA BOMBA" from={c1949 - 6} to={c1954 - 20} y={300} size={58} />
      <Chip text="KLAUS FUCHS, ESPÍA" x={960} y={470} from={cFuchs - 10} to={c1954 - 20} size={54} color={C.red} />
      <Sfx src="whoosh_long" at={c1949 - 6} vol={0.5} />
      <Sfx src="stamp" at={cFuchs - 10} vol={0.6} />

      <Chip text="VIGILADO POR EL FBI" x={960} y={640} from={cFbi - 4} to={c1954 - 20} size={46} color={C.bone} />
      <Sfx src="ui_pop" at={cFbi - 4} vol={0.5} />
      {/* 1954 */}
      <Cam z0={1} z1={1.07} from={c1954} dur={cHombre - c1954}>
        <Documento x={960} y={520} w={620} h={680} rot={2} from={c1954 - 4} to={cHombre - 10} header="COMISIÓN · SEGURIDAD · 1954" bars={8} sello="ACREDITACIÓN RETIRADA" selloAt={c1954 + 50} footer="recreación" />
      </Cam>
      <Sfx src="paper" at={c1954 - 4} vol={0.6} />
      <Sfx src="stamp" at={c1954 + 50} vol={0.9} />

      {/* plano final: solo, caminando */}
      <AbsoluteFill style={{opacity: vis(frame, cHombre - 6, Infinity, 24)}}>
        <div style={{position: 'absolute', left: 0, top: 790, width: 1920, height: 2, background: 'rgba(245,241,232,0.18)'}} />
        <div style={{position: 'absolute', left: 1500 - (frame - cHombre) * 2.2, top: 410 + Math.sin((frame - cHombre) / 7) * 4}}>
          <Silueta kind="hat" width={260} id="w9" />
        </div>
        <Title text="El hombre que dirigió la victoria, tratado como un traidor" size={46} italic color={C.bone} x={960} y={250} from={cHombre + 6} weight={400} width={1300} />
      </AbsoluteFill>
    </Backdrop>
  );
};
