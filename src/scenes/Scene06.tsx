import React from 'react';
import {useCurrentFrame} from 'remotion';
import {useScene} from '../ctx';
import {C, F} from '../theme';
import {Backdrop, Cam, Sfx, Title, vis} from '../components/common';
import {Chip} from '../components/Linea';
import {Canon, Implosion} from '../components/Detonacion';
import {Silueta} from '../components/Silueta';

export const Scene06: React.FC = () => {
  const frame = useCurrentFrame();
  const {cue} = useScene();
  const cBala = cue('bala');
  const cPero = cue('Pero');
  const cTemprano = cue('pronto');
  const cRodear = cue('rodear');
  const cExact = cue('exactamente');
  const cImpl = cue('implosión.') ;
  const cNeu = cue('Neumann');
  const cBomba = cue('verdad');
  return (
    <Backdrop tone="amber">
      <Cam z0={1.0} z1={1.06}>
        <Canon x={960} y={470} from={4} to={cPero - 6} fireAt={cBala + 6} label="MÉTODO DE CAÑÓN · URANIO" color={C.amber} badge="URANIO: FUNCIONA" badgeAt={cBala + 40} badgeColor={C.amber} />
        <Canon x={960} y={470} from={cPero} to={cRodear - 8} fireAt={cTemprano - 40} premature label="MÉTODO DE CAÑÓN · PLUTONIO" color="#8fd3ff" badge="¡NO!" badgeAt={cTemprano + 30} badgeColor={C.red} />
        <Implosion x={960} y={440} from={cRodear} igniteAt={cExact} />
      </Cam>
      <Title text="IMPLOSIÓN" size={84} color={C.amber} x={1560} y={440} from={cImpl - 6} spacing={10} />
      {/* John von Neumann */}
      <div style={{position: 'absolute', left: 150, top: 150, opacity: vis(frame, cNeu, Infinity, 16)}}>
        <div style={{width: 230, height: 270, overflow: 'hidden', border: '2px solid rgba(245,241,232,0.45)', background: 'radial-gradient(70% 70% at 50% 35%, #3a2c1c, #0c0a09)', position: 'relative'}}>
          <div style={{position: 'absolute', left: 15, bottom: -30}}><Silueta kind="thin" width={200} id="vn" /></div>
        </div>
        <div style={{marginTop: 14, fontFamily: F.serif, fontWeight: 700, fontSize: 36, color: C.bone, letterSpacing: 2, whiteSpace: 'nowrap'}}>JOHN VON NEUMANN</div>
      </div>
      <Sfx src="whoosh" at={4} vol={0.4} />
      <Sfx src="thump" at={cBala + 6} vol={0.8} />
      <Sfx src="flash" at={cBala + 36} vol={0.3} />
      <Sfx src="whoosh" at={cPero} vol={0.4} />
      <Sfx src="pfff" at={cTemprano - 40 + 34} vol={0.6} />
      <Sfx src="ui_pop" at={cTemprano + 30} vol={0.5} />
      <Sfx src="whoosh" at={cRodear} vol={0.5} />
      <Sfx src="implode" at={cExact} vol={0.8} />
      <Sfx src="ui_pop" at={cNeu} vol={0.5} />
    </Backdrop>
  );
};
