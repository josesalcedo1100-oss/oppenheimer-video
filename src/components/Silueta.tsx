import React from 'react';
import {C} from '../theme';

export type SiluetaKind = 'hat' | 'bust' | 'cap' | 'thin' | 'hair';

/** Siluetas estilizadas (vectoriales). viewBox 200x300, ancladas abajo. */
export const Silueta: React.FC<{
  kind?: SiluetaKind; width?: number; fill?: string; rim?: string; opacity?: number; id?: string; flip?: boolean;
}> = ({kind = 'bust', width = 300, fill = '#08080a', rim = C.amber, opacity = 1, id = 's', flip}) => {
  const gid = `rim-${id}`;
  const body = (
    <>
      {/* hombros / abrigo */}
      <path d="M10 300 C10 238 40 216 78 206 L122 206 C160 216 190 238 190 300 Z" />
      {/* cuello */}
      <rect x="86" y="178" width="28" height="34" rx="8" />
    </>
  );
  return (
    <svg viewBox="0 0 200 300" width={width} height={(width * 300) / 200} style={{opacity, transform: flip ? 'scaleX(-1)' : undefined, overflow: 'visible'}}>
      <defs>
        <linearGradient id={gid} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor={rim} stopOpacity="0" />
          <stop offset="0.75" stopColor={rim} stopOpacity="0.0" />
          <stop offset="1" stopColor={rim} stopOpacity="0.85" />
        </linearGradient>
      </defs>
      <g fill={fill}>
        {body}
        {kind === 'hat' && (
          <>
            <ellipse cx="100" cy="150" rx="34" ry="40" />
            <ellipse cx="100" cy="116" rx="68" ry="13" />
            <path d="M58 116 C58 70 70 56 100 56 C130 56 142 70 142 116 Z" />
          </>
        )}
        {kind === 'cap' && (
          <>
            <ellipse cx="100" cy="146" rx="38" ry="44" />
            <path d="M56 118 C56 80 74 66 100 66 C126 66 144 80 144 118 Z" />
            <rect x="52" y="112" width="96" height="9" rx="4" />
            <path d="M52 121 L148 121 L160 130 L40 130 Z" />
          </>
        )}
        {kind === 'bust' && <ellipse cx="100" cy="146" rx="36" ry="46" />}
        {kind === 'thin' && (
          <>
            <ellipse cx="100" cy="146" rx="31" ry="46" />
            <path d="M72 128 C72 96 86 88 100 88 C116 88 130 98 128 128 C120 112 82 112 72 128 Z" />
          </>
        )}
        {kind === 'hair' && (
          <>
            <ellipse cx="100" cy="148" rx="35" ry="46" />
            <path d="M62 138 C56 88 82 74 104 76 C132 78 142 102 138 138 C128 108 82 104 62 138 Z" />
          </>
        )}
      </g>
      {/* contraluz */}
      <g fill={`url(#${gid})`} style={{mixBlendMode: 'screen'}}>
        {body}
        {kind === 'hat' && <><ellipse cx="100" cy="150" rx="34" ry="40" /><ellipse cx="100" cy="116" rx="68" ry="13" /><path d="M58 116 C58 70 70 56 100 56 C130 56 142 70 142 116 Z" /></>}
        {(kind === 'bust' || kind === 'cap' || kind === 'thin' || kind === 'hair') && <ellipse cx="100" cy="146" rx="34" ry="44" />}
      </g>
    </svg>
  );
};
