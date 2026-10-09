import React from 'react';
import {useCurrentFrame} from 'remotion';
import {useScene} from '../ctx';
import {C, F} from '../theme';
import {Backdrop, Cam, Sfx, Title, prog, vis} from '../components/common';
import {Chip, RotuloDeFecha} from '../components/Linea';
import {Documento} from '../components/Documento';
import {PantallaDividida} from '../components/Pantalla';
import {Silueta} from '../components/Silueta';
import {MapaSVG, MapDot} from '../components/MapaSVG';
import {Contador} from '../components/Contador';

const Retrato: React.FC<{kind: 'cap' | 'hat'; name: string; role: string; id: string}> = ({kind, name, role, id}) => (
  <div style={{position: 'absolute', left: 130, top: 130, width: 700, height: 640, overflow: 'hidden', border: '2px solid rgba(245,241,232,0.35)', background: 'radial-gradient(70% 70% at 50% 35%, #3a2c1c, #0c0a09)'}}>
    <div style={{position: 'absolute', left: 175, bottom: -30}}>
      <Silueta kind={kind === 'hat' ? 'thin' : 'cap'} width={350} id={id} />
    </div>
    <div style={{position: 'absolute', left: 0, right: 0, bottom: 20, textAlign: 'center', fontFamily: F.serif, fontWeight: 700, fontSize: 42, color: C.bone, textShadow: '0 2px 12px #000'}}>{name}</div>
  </div>
);

export const Scene03: React.FC = () => {
  const frame = useCurrentFrame();
  const {cue, sc} = useScene();
  const cEran = cue('Eran');
  const cPract = cue('práctico');
  const cCulto = cue('culto');
  const cRecl = cue('reclutó');
  const cAlamos = cue('Álamos.');
  const cDos = cue('2.000');
  const cDecenas = cue('decenas');
  const cCien = cue('cien');
  const cGroves = cue('Groves');
  return (
    <Backdrop tone="amber">
      {/* 1) rótulo + documentos secretos */}
      <Cam z0={1} z1={1.06} from={0} dur={cEran}>
        <RotuloDeFecha date="1942 · PROYECTO MANHATTAN" from={6} to={cEran - 8} y={110} size={60} />
        <Documento x={620} y={640} w={560} h={640} rot={-5} from={14} to={cEran - 6} header="MEMORÁNDUM · RESERVADO" bars={8} sello="SECRETO" selloAt={cue('Manhattan') + 12} footer="recreación" />
        <Documento x={1000} y={600} w={560} h={640} rot={2} from={cue('Manhattan') - 4} to={cEran - 6} header="PROYECTO · ACCESO RESTRINGIDO" bars={7} sello="SECRETO" selloAt={cue('Groves') + 6} footer="recreación" enterFrom="right" />
        <Documento x={1340} y={650} w={560} h={640} rot={7} from={cGroves} to={cEran - 6} header="ORDEN DE TRABAJO" bars={9} sello="SECRETO" selloAt={cGroves + 40} footer="recreación" enterFrom="right" />
      </Cam>
      <Sfx src="whoosh" at={6} vol={0.5} />
      <Sfx src="stamp" at={cue('Manhattan') + 12} vol={0.8} />
      <Sfx src="stamp" at={cGroves + 6} vol={0.8} />
      <Sfx src="stamp" at={cGroves + 40} vol={0.8} />

      {/* 2) pantalla dividida Groves / Oppenheimer */}
      <PantallaDividida
        from={cEran} to={cRecl - 4}
        left={<><Retrato kind="cap" name="Leslie Groves" role="" id="gv" />
          <Chip text="práctico · autoritario" x={480} y={850} from={cPract} size={36} color={C.amber} /></>}
        right={<><Retrato kind="hat" name="Robert Oppenheimer" role="" id="op" />
          <Chip text="culto · brillante · desorganizado" x={480} y={850} from={cCulto} size={34} color={C.bone} /></>}
      />
      <Sfx src="whoosh" at={cEran} vol={0.5} />
      <Sfx src="ui_pop" at={cPract} vol={0.5} />
      <Sfx src="ui_pop" at={cCulto} vol={0.5} />

      {/* 3) mapa de EE. UU. + contador */}
      <div style={{position: 'absolute', left: 80, top: 190, opacity: vis(frame, cRecl, Infinity, 16)}}>
        <MapaSVG kind="usa" width={1000} height={640}>
          {(proj) => {
            const pts: [string, [number, number], number][] = [
              ['Los Álamos', [-106.3, 35.88], cAlamos],
              ['Oak Ridge', [-84.27, 36.01], cAlamos + 26],
              ['Hanford', [-119.49, 46.55], cAlamos + 52],
            ];
            return (
              <g>
                {pts.map(([n, ll, at], k) => {
                  const [x, y] = proj(ll);
                  return <MapDot key={k} x={x} y={y} t={(frame - at) / 30 + (frame >= at ? 0.01 : 0)} label={n} labelDy={-18} size={26} />;
                })}
              </g>
            );
          }}
        </MapaSVG>
      </div>
      <Sfx src="ui_pop" at={cAlamos} vol={0.5} />
      <Sfx src="ui_pop" at={cAlamos + 26} vol={0.5} />
      <Sfx src="ui_pop" at={cAlamos + 52} vol={0.5} />
      <Contador from={cDos} value={2000} dur={34} prefix="+ de " x={1500} y={330} size={120} label="millones de dólares de la época" labelSize={32} />
      <Sfx src="count" at={cDos} vol={0.5} />
      <Title text="decenas de miles de millones de hoy" size={40} color={C.amber} x={1500} y={560} from={cDecenas} font="sans" width={640} />
      <Sfx src="ui_pop" at={cDecenas} vol={0.5} />
      <Chip text="más de cien mil personas" x={1500} y={700} from={cCien - 2} size={36} color={C.bone} />
      <Sfx src="ui_pop" at={cCien - 2} vol={0.5} />
    </Backdrop>
  );
};
