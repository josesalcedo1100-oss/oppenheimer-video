import React from 'react';
import {useCurrentFrame} from 'remotion';
import {useScene} from '../ctx';
import {C, F} from '../theme';
import {Backdrop, Cam, Sfx, Title, vis} from '../components/common';
import {Chip, RotuloDeFecha} from '../components/Linea';
import {BarraUranio, Bifurcacion, Reactor} from '../components/Combustible';
import {MapaSVG, MapDot} from '../components/MapaSVG';

export const Scene05: React.FC = () => {
  const frame = useCurrentFrame();
  const {cue} = useScene();
  const cMenos = cue('Menos');
  const cAlt = cue('alternativa');
  const cPlut = cue('plutonio,');
  const cTec = cue('técnicas');
  const cProbar = cue('probarlos');
  const cPlantas = cue('Plantas');
  const cDic = cue('diciembre');
  const cFermi = cue('Fermi');
  const cDejo = cue('dejó');
  return (
    <Backdrop tone="amber">
      <Cam z0={1.0} z1={1.05}>
        <BarraUranio x={960} y={520} from={6} to={cAlt - 6} zoomAt={cMenos} />
        <Bifurcacion from={cAlt} to={cProbar - 6} atPlut={cPlut} atTech={cTec} />
        {/* plantas industriales en el mapa */}
        <div style={{position: 'absolute', left: 280, top: 230, opacity: vis(frame, cProbar, cDic - 4, 14)}}>
          <MapaSVG kind="usa" width={1300} height={700}>
            {(proj) => {
              const pts: [string, [number, number], number][] = [
                ['Los Álamos', [-106.3, 35.88], cPlantas - 30],
                ['Oak Ridge', [-84.27, 36.01], cPlantas],
                ['Hanford', [-119.49, 46.55], cPlantas + 22],
                ['Chicago', [-87.63, 41.88], cPlantas + 44],
              ];
              return (
                <g>
                  {pts.map(([n, ll, at], k) => {
                    const [x, y] = proj(ll);
                    return <MapDot key={k} x={x} y={y} r={13} t={(frame - at) / 30 + (frame >= at ? 0.01 : 0)} label={n} labelDy={-22} size={30} />;
                  })}
                </g>
              );
            }}
          </MapaSVG>
        </div>
        <Reactor x={960} y={800} from={cDic} at={cFermi + 20} />
      </Cam>
      <Title text="PROBAR TODO" size={96} color={C.amber} x={960} y={120} from={cProbar} to={cDic - 6} spacing={10} />
      <RotuloDeFecha date="DICIEMBRE DE 1942 · CHICAGO" sub="PRIMER REACTOR NUCLEAR" from={cDic} y={90} size={56} />
      <Chip text="el plutonio dejó de ser una idea" x={960} y={870} from={cDejo - 20} size={36} color={C.bone} />
      <Sfx src="ui_pop" at={cMenos} vol={0.5} />
      <Sfx src="whoosh" at={cAlt} vol={0.4} />
      <Sfx src="ui_pop" at={cPlut} vol={0.5} />
      <Sfx src="whoosh" at={cProbar} vol={0.5} />
      <Sfx src="ui_pop" at={cPlantas - 30} vol={0.4} />
      <Sfx src="ui_pop" at={cPlantas} vol={0.4} />
      <Sfx src="ui_pop" at={cPlantas + 22} vol={0.4} />
      <Sfx src="ui_pop" at={cPlantas + 44} vol={0.4} />
      <Sfx src="low_hit" at={cDic} vol={0.5} />
      <Sfx src="thump" at={cFermi + 20} vol={0.6} />
    </Backdrop>
  );
};
