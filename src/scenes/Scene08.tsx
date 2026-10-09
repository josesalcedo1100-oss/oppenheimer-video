import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {useScene} from '../ctx';
import {C, F} from '../theme';
import {Backdrop, Cam, Sfx, Title, clamp01, prog, vis} from '../components/common';
import {Chip} from '../components/Linea';
import {Documento} from '../components/Documento';
import {MapaSVG, MapDot} from '../components/MapaSVG';
import {PantallaDividida} from '../components/Pantalla';

export const Scene08: React.FC = () => {
  const frame = useCurrentFrame();
  const {cue, sc} = useScene();
  const cSzi = cue('Szilárd');
  const cFranck = cue('Franck');
  const cDemo = cue('demostración');
  const cDec = cue('decisión');
  const cHiro = cue('Hiroshima', 1);
  const cNag = cue('Nagasaki.');
  const cNum = cue('doscientas');
  const hiro = cue('agosto');
  return (
    <Backdrop tone="black">
      {/* documentos: petición de Szilárd e informe Franck */}
      <Cam z0={1} z1={1.05} from={0} dur={cDec}>
        <Documento x={620} y={540} w={560} h={680} rot={-4} from={cSzi - 10} to={cDemo - 6} header="PETICIÓN" bars={9} footer="recreación · Szilárd" />
        <Documento x={1160} y={560} w={560} h={680} rot={3} from={cFranck - 8} to={cDemo - 6} header="INFORME FRANCK" bars={8} footer="recreación · junio de 1945" enterFrom="right" />
      </Cam>
      <Sfx src="paper" at={cSzi - 10} vol={0.5} />
      <Sfx src="paper" at={cFranck - 8} vol={0.5} />
      {/* pantalla dividida */}
      <PantallaDividida
        from={cDemo - 2} to={cHiro - 24}
        leftTint="rgba(120,150,200,0.07)" rightTint="rgba(185,28,28,0.10)"
        left={<Title text={'Los que querían\nuna demostración\nsin víctimas'} size={64} x={480} y={500} from={cDemo} />}
        right={<Title text="La decisión" size={84} x={480} y={500} from={cDec} color={C.red} />}
      />
      <Sfx src="whoosh" at={cDemo - 2} vol={0.4} />
      <Sfx src="low_hit" at={cDec} vol={0.5} />
      {/* mapa de Japón */}
      <div style={{position: 'absolute', left: 400, top: 120, opacity: vis(frame, cHiro - 10, cNum - 16, 16)}}>
        <MapaSVG kind="japan" width={1120} height={760} fills={{'392': '#22242c'}}>
          {(proj) => {
            const [hx, hy] = proj([132.45, 34.39]);
            const [nx, ny] = proj([129.87, 32.75]);
            return (
              <g>
                <MapDot x={hx} y={hy} r={13} color={C.red} t={(frame - hiro + 20) / 30 + (frame >= hiro - 20 ? 0.01 : 0)} />
                <MapDot x={nx} y={ny} r={13} color={C.red} t={(frame - cNag) / 30 + (frame >= cNag ? 0.01 : 0)} />
              </g>
            );
          }}
        </MapaSVG>
      </div>
      <Chip text="HIROSHIMA · 6 DE AGOSTO" x={1430} y={330} from={hiro - 20} to={cNum - 16} size={40} color={C.amber} />
      <Chip text="NAGASAKI · 9 DE AGOSTO" x={1430} y={560} from={cNag} to={cNum - 16} size={40} color={C.amber} />
      <Sfx src="count" at={hiro - 20} vol={0.6} />
      <Sfx src="count" at={cNag} vol={0.6} />
      {/* final sobrio: un único número en blanco, entra en silencio */}
      <AbsoluteFill style={{background: `rgba(3,3,4,${vis(frame, cNum - 14, Infinity, 24)})`}} />
      <Title text="+ de 200.000" size={170} color="#ffffff" x={960} y={470} from={cNum + 4} weight={700} rise={0} />
    </Backdrop>
  );
};
