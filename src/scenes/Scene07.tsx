import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {useScene} from '../ctx';
import {C, F} from '../theme';
import {Backdrop, Cam, Sfx, Title, clamp01, ease, prog, vis} from '../components/common';
import {Chip, RotuloDeFecha} from '../components/Linea';
import {Desierto} from '../components/Desierto';
import {Destello} from '../components/Destello';
import {Contador} from '../components/Contador';
import {Silueta} from '../components/Silueta';

const Hoja: React.FC<{x: number; mes: string; ev: string; at: number; to: number}> = ({x, mes, ev, at, to}) => {
  const frame = useCurrentFrame();
  const p = prog(frame, at, 22);
  return (
    <div style={{position: 'absolute', left: x, top: 440, transform: `translate(-50%,-50%) translateY(${(1 - p) * 60}px) rotate(${(x - 960) / 120}deg)`, opacity: vis(frame, at, to, 12), width: 380, height: 420, background: 'linear-gradient(160deg,#e8dfc6,#cfc3a1)', boxShadow: '0 24px 60px rgba(0,0,0,0.6)', color: C.ink, textAlign: 'center', fontFamily: F.serif}}>
      <div style={{background: C.red, color: C.bone, fontFamily: F.sans, fontWeight: 600, letterSpacing: 6, fontSize: 28, padding: '14px 0'}}>1945</div>
      <div style={{fontSize: 74, fontWeight: 700, marginTop: 40, textTransform: 'uppercase', letterSpacing: 2}}>{mes}</div>
      <div style={{fontFamily: F.sans, fontWeight: 600, fontSize: 36, marginTop: 34, padding: '0 24px', lineHeight: 1.2}}>{ev}</div>
    </div>
  );
};

export const Scene07: React.FC = () => {
  const frame = useCurrentFrame();
  const {cue, sc} = useScene();
  const cFecha = cue('16');
  const cCientos = cue('cientos');
  const cNube = cue('nube');
  const cPero = cue('Pero');
  const cAbril = cue('abril');
  const cMayo = cue('mayo');
  const cAliados = cue('Los aliados');
  const cCapt = cue('capturaron');
  const cNunca = cue('nunca');
  const cMotivo = cue('motivo');
  const FLASH = cFecha + 4;
  const fire = clamp01((frame - FLASH) / 330);
  const phase1 = frame < cPero + 10;
  return (
    <Backdrop tone="cold">
      {/* 1) Trinity */}
      <AbsoluteFill style={{opacity: vis(frame, 0, cPero + 6, 16)}}>
        <Cam z0={1} z1={1.1} y0={0} y1={-20} origin="55% 75%">
          <Desierto fire={frame >= FLASH ? fire : 0} glow={frame >= FLASH ? 1 : 0.15} sky={frame >= FLASH ? 1 : 0.55} />
          {frame < FLASH && <AbsoluteFill style={{background: 'rgba(0,0,0,0.55)'}} />}
        </Cam>
        <RotuloDeFecha date="TRINITY · 16 DE JULIO DE 1945" from={6} to={cCientos - 10} y={90} size={56} />
        <Chip text="visible a cientos de kilómetros" x={540} y={250} from={cCientos} to={cPero - 6} size={36} color={C.amber} />
        <Contador from={cNube} value={12} dur={50} prefix="más de " suffix=" km" x={1480} y={290} size={96} label="nube de altura" labelSize={32} end={cPero - 6} />
      </AbsoluteFill>
      <Destello at={FLASH} hold={3} decay={50} />
      <Sfx src="flash" at={FLASH} vol={0.35} />
      <Sfx src="boom" at={FLASH + 22} vol={0.55} />
      <Sfx src="ui_pop" at={cCientos} vol={0.5} />
      <Sfx src="count" at={cNube} vol={0.5} />

      {/* 2) el calendario */}
      <Hoja x={470} mes="abril" ev="Muere Roosevelt" at={cAbril} to={cCapt} />
      <Hoja x={960} mes="mayo" ev="Alemania se rinde" at={cMayo} to={cCapt} />
      <Hoja x={1450} mes="julio" ev="Trinity" at={cAliados} to={cCapt} />
      <Sfx src="paper" at={cAbril} vol={0.6} />
      <Sfx src="paper" at={cMayo} vol={0.6} />
      <Sfx src="paper" at={cAliados} vol={0.6} />

      {/* 3) Heisenberg capturado */}
      <div style={{position: 'absolute', left: 520, top: 250, opacity: vis(frame, cCapt, cMotivo - 6, 14)}}>
        <div style={{width: 380, height: 500, overflow: 'hidden', border: '3px solid rgba(245,241,232,0.5)', background: 'radial-gradient(70% 70% at 50% 35%, #2c2c33, #0c0a09)', position: 'relative'}}>
          <div style={{position: 'absolute', left: 40, bottom: -40}}><Silueta kind="hair" width={300} id="h7" rim="#8fd3ff" /></div>
          <div style={{position: 'absolute', left: 0, right: 0, bottom: 20, textAlign: 'center', fontFamily: F.serif, fontWeight: 700, fontSize: 38, color: C.bone}}>Heisenberg</div>
        </div>
        <div style={{position: 'absolute', right: -60, top: 70, transform: 'rotate(10deg)', border: `6px solid ${C.red}`, color: C.red, fontFamily: F.mono, fontWeight: 700, fontSize: 44, letterSpacing: 5, padding: '4px 18px', opacity: prog(frame, cCapt + 12, 6), background: 'rgba(10,10,12,0.6)'}}>CAPTURADO</div>
      </div>
      <Sfx src="stamp" at={cCapt + 12} vol={0.8} />
      <Title text="LOS NAZIS NUNCA ESTUVIERON CERCA" size={58} color={C.bone} x={1250} y={500} from={cNunca - 4} to={cMotivo - 6} width={760} />
      <Sfx src="ui_pop" at={cNunca - 4} vol={0.5} />

      {/* 4) el motivo ha desaparecido */}
      <AbsoluteFill style={{background: `rgba(10,6,6,${0.85 * vis(frame, cMotivo - 4, Infinity, 20)})`}} />
      <Title text="EL MOTIVO HA DESAPARECIDO" size={104} color={C.red} x={960} y={470} from={cMotivo} spacing={4} />
      <Sfx src="low_hit" at={cMotivo} vol={0.6} />
    </Backdrop>
  );
};
