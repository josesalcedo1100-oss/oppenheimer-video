import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {useScene} from '../ctx';
import {C, F} from '../theme';
import {Backdrop, Cam, Sfx, Title, clamp01, ease, prog, vis} from '../components/common';
import {LineaDeTiempo, Chip} from '../components/Linea';
import {Fision} from '../components/Fision';
import {MapaSVG} from '../components/MapaSVG';
import {Documento} from '../components/Documento';
import {Silueta} from '../components/Silueta';
import {AvionBomba, Flecha} from '../components/Iconos';

export const Scene02: React.FC = () => {
  const frame = useCurrentFrame();
  const {cue} = useScene();
  const c1938 = cue('1938');
  const cMejor = cue('mejor');
  const c1939 = cue('1939');
  const cFirmara = cue('firmara');
  const c1940 = cue('Un año');
  const cKilos = cue('kilos');
  const cAvion = cue('avión');
  const cHeis = cue('Heisenberg');
  return (
    <Backdrop tone="cold">
      {/* línea de tiempo permanente en la parte superior */}
      <LineaDeTiempo
        y={190} x0={260} x1={1660} from={4}
        items={[
          {year: '1938', label: 'Se descubre la fisión', at: c1938},
          {year: '1939', label: 'La carta de Einstein', at: c1939},
          {year: '1940', label: 'Frisch y Peierls', at: c1940},
        ]}
      />
      <Sfx src="ui_pop" at={c1938} vol={0.5} />
      <Sfx src="ui_pop" at={c1939} vol={0.5} />
      <Sfx src="ui_pop" at={c1940} vol={0.5} />
      <Sfx src="whoosh" at={2} vol={0.4} />

      {/* 1) fisión nuclear */}
      <Fision x={960} y={600} at={c1938 + 40} from={10} r={190} to={cMejor - 4} />
      <Title text="FISIÓN NUCLEAR" size={34} font="sans" color={C.amber} spacing={10} x={960} y={860} from={c1938 + 70} to={cMejor - 4} />

      {/* 2) Europa con Alemania en rojo */}
      <Cam z0={1} z1={1.07} from={cMejor} dur={cHeis - cMejor + 200}>
        <div style={{position: 'absolute', left: 140, top: 300}}>
          <div style={{opacity: Math.max(vis(frame, cMejor, c1939 - 6, 14), vis(frame, c1940, Infinity, 14))}}>
            <MapaSVG kind="europe" width={1000} height={620} fills={{'276': frame > cMejor + 20 ? C.red : '#1b1d24'}}>
              {(proj) => {
                const [gx, gy] = proj([10.4, 51.2]);
                const [px, py] = proj([2.5, 56.5]);
                const p = prog(frame, cAvion - 10, 40);
                return (
                  <g>
                    <Flecha x1={gx} y1={gy} x2={px + 30} y2={py + 40} p={p} />
                    <foreignObject x={px - 120} y={py - 70} width={240} height={160} opacity={p}>
                      <div style={{opacity: p}}><AvionBomba size={200} /></div>
                    </foreignObject>
                  </g>
                );
              }}
            </MapaSVG>
          </div>
        </div>
      </Cam>
      <Title text="ALEMANIA" size={40} font="sans" color={C.red} spacing={8} x={650} y={520} from={cMejor + 20} to={c1939 - 6} />
      <Chip text="unos pocos kilos de uranio-235" x={1500} y={400} from={cKilos - 6} size={34} color={C.amber} />
      <Chip text="una bomba que cabría en un avión" x={1500} y={470} from={cAvion - 10} size={34} />
      <Sfx src="whoosh" at={cMejor} vol={0.4} />
      <Sfx src="ui_pop" at={cAvion - 10} vol={0.5} />

      {/* 3) carta de Einstein a Roosevelt */}
      <Cam z0={1} z1={1.08} from={c1939} dur={cFirmara - c1939}>
        <Documento x={960} y={640} w={620} h={520} rot={-2} from={c1939} to={c1940 - 6} header="A.º PRESIDENTE DE LOS ESTADOS UNIDOS" bars={9} footer="recreación">
          <div style={{position: 'absolute', right: 60, bottom: 74, fontFamily: F.serif, fontStyle: 'italic', fontSize: 64, color: '#1b2a63', opacity: prog(frame, cFirmara - 8, 20), transform: `rotate(-6deg)`}}>
            A. Einstein
          </div>
        </Documento>
      </Cam>
      <Sfx src="paper" at={c1939} vol={0.6} />

      {/* 4) Heisenberg */}
      <div style={{position: 'absolute', left: 1560, top: 540, opacity: vis(frame, cHeis, Infinity, 16), transform: `translateY(${(1 - prog(frame, cHeis, 30)) * 40}px)`}}>
        <Silueta kind="hair" width={250} id="h2" />
        <div style={{position: 'absolute', left: 85, top: -70, fontFamily: F.serif, fontWeight: 700, fontSize: 110, color: C.amber, opacity: prog(frame, cHeis + 20, 20)}}>?</div>
        <div style={{position: 'absolute', left: -30, width: 310, top: 380, textAlign: 'center', fontFamily: F.sans, fontWeight: 600, fontSize: 30, letterSpacing: 4, color: C.bone}}>HEISENBERG</div>
      </div>
    </Backdrop>
  );
};
