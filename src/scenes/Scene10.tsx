import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {useScene} from '../ctx';
import {C, F} from '../theme';
import {Backdrop, Cam, Sfx, Title, clamp01, ease, prog, vis} from '../components/common';
import {Chip} from '../components/Linea';
import {MapaSVG, MapDot} from '../components/MapaSVG';
import {Desierto} from '../components/Desierto';
import {Silueta} from '../components/Silueta';
import {NUKE_POINTS} from '../data';

export const Scene10: React.FC = () => {
  const frame = useCurrentFrame();
  const {cue, sc} = useScene();
  const cIron = cue('ironía');
  const cOchenta = cue('ochenta');
  const cUsar = cue('usar');
  const cDato = cue('dato');
  const cDic = cue('diciembre');
  const cAnul = cue('anuló');
  const cFinal = cue('Al final');
  const years = Math.round(80 * prog(frame, cOchenta, 70));
  const lastTick = Math.floor(years / 5);
  return (
    <Backdrop tone="amber">
      {/* mapa mundial con arsenales como puntos pequeños + contador de años */}
      <div style={{position: 'absolute', left: 130, top: 150, opacity: vis(frame, 6, cDato - 6, 16)}}>
        <MapaSVG kind="world" width={1660} height={820}>
          {(proj) => (
            <g>
              {NUKE_POINTS.map((ll, k) => {
                const [x, y] = proj(ll);
                const at = cIron + 20 + k * 12;
                return <MapDot key={k} x={x} y={y} r={7} t={(frame - at) / 30 + (frame >= at ? 0.01 : 0)} />;
              })}
            </g>
          )}
        </MapaSVG>
      </div>
      <div style={{position: 'absolute', left: 960, top: 240, transform: 'translateX(-50%)', textAlign: 'center', opacity: vis(frame, cOchenta - 4, cDato - 6, 14)}}>
        <div style={{fontFamily: F.serif, fontWeight: 700, fontSize: 190, color: C.amber, lineHeight: 1, textShadow: '0 0 40px rgba(245,158,11,0.35)'}}>{years >= 80 ? '80+' : years}</div>
        <div style={{fontFamily: F.sans, fontWeight: 600, fontSize: 38, color: C.bone, letterSpacing: 6}}>AÑOS DESDE 1945</div>
      </div>
      {Array.from({length: 17}, (_, k) => (
        <Sfx key={k} src="count" at={cOchenta + Math.round((k / 16) * 70)} vol={0.22} />
      ))}
      <Chip text="No se han vuelto a usar en combate" x={960} y={870} from={cUsar} to={cDato - 6} size={46} color={C.bone} />
      <Sfx src="ui_pop" at={cUsar} vol={0.5} />
      {NUKE_POINTS.map((_, k) => (
        <Sfx key={'p' + k} src="ui_pop" at={cIron + 20 + k * 12} vol={0.18} />
      ))}

      <Title text="EL DATO QUE TE PROMETÍ" size={92} color={C.amber} x={960} y={470} from={cDato} to={cDic - 8} spacing={6} />
      <Sfx src="low_hit" at={cDato} vol={0.45} />
      {/* diciembre de 2022 (recreación propia) */}
      <AbsoluteFill style={{opacity: vis(frame, cDic - 6, cFinal - 8, 16)}}>
        <div style={{position: 'absolute', left: 960, top: 470, transform: `translate(-50%,-50%) scale(${1 + 0.03 * prog(frame, cDic, 200)})`, width: 1240, padding: '46px 60px', background: 'linear-gradient(160deg,#e2d8bd,#cfc3a1)', color: C.ink, boxShadow: '0 30px 80px rgba(0,0,0,0.7)', textAlign: 'center'}}>
          <div style={{fontFamily: F.mono, fontSize: 26, letterSpacing: 6, borderBottom: `3px solid ${C.ink}`, paddingBottom: 12}}>DICIEMBRE DE 2022</div>
          <div style={{fontFamily: F.serif, fontWeight: 700, fontSize: 88, lineHeight: 1.05, marginTop: 26}}>EE. UU. ANULA LA DECISIÓN DE 1954</div>
          <div style={{fontFamily: F.mono, fontSize: 22, marginTop: 20, opacity: 0.6}}>recreación propia</div>
        </div>
      </AbsoluteFill>
      <Sfx src="paper" at={cDic - 6} vol={0.6} />
      <Sfx src="stamp" at={cAnul} vol={0.7} />

      {/* último plano: la silueta con sombrero, de espaldas, frente al desierto al amanecer */}
      <AbsoluteFill style={{opacity: vis(frame, cFinal - 10, Infinity, 40)}}>
        <Cam z0={1.0} z1={1.1} from={cFinal - 10} origin="60% 75%">
          <Desierto fire={0} glow={0} tower={false} sky={1} />
          <div style={{position: 'absolute', left: 560, bottom: 60}}>
            <Silueta kind="hat" width={420} id="f10" />
          </div>
        </Cam>
      </AbsoluteFill>
    </Backdrop>
  );
};
