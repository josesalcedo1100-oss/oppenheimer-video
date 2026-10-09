import React, {useMemo} from 'react';
import {geoAlbersUsa, geoMercator, geoNaturalEarth1, geoPath, GeoProjection} from 'd3-geo';
import {feature} from 'topojson-client';
// @ts-ignore datos de paquetes npm
import world50 from 'world-atlas/countries-50m.json';
// @ts-ignore
import world110 from 'world-atlas/countries-110m.json';
// @ts-ignore
import usStates from 'us-atlas/states-10m.json';
import {C} from '../theme';

export type MapKind = 'europe' | 'usa' | 'japan' | 'world';
export type Proj = (lonlat: [number, number]) => [number, number];

const extents: Record<string, [number, number][]> = {
  europe: [[-14, 33], [34, 33], [34, 62], [-14, 62]],
  japan: [[127, 30], [146, 30], [146, 46], [127, 46]],
};

const build = (kind: MapKind, w: number, h: number) => {
  const pad = 10;
  let proj: GeoProjection;
  let feats: any[];
  if (kind === 'usa') {
    feats = (feature(usStates as any, (usStates as any).objects.states) as any).features;
    proj = geoAlbersUsa().fitExtent([[pad, pad], [w - pad, h - pad]], {type: 'FeatureCollection', features: feats} as any);
  } else if (kind === 'world') {
    feats = (feature(world110 as any, (world110 as any).objects.countries) as any).features;
    proj = geoNaturalEarth1().fitExtent([[pad, pad], [w - pad, h - pad]], {type: 'Sphere'} as any);
  } else {
    const all = (feature(world50 as any, (world50 as any).objects.countries) as any).features as any[];
    const ex = extents[kind];
    const xs = ex.map((p) => p[0]), ys = ex.map((p) => p[1]);
    const [x0, x1, y0, y1] = [Math.min(...xs), Math.max(...xs), Math.min(...ys), Math.max(...ys)];
    proj = geoMercator().fitExtent([[pad, pad], [w - pad, h - pad]], {type: 'MultiPoint', coordinates: ex} as any);
    const gp = geoPath(proj);
    feats = all.filter((f) => {
      const c = geoPath().centroid(f);
      return c[0] >= x0 - 14 && c[0] <= x1 + 14 && c[1] >= y0 - 10 && c[1] <= y1 + 10 && !isNaN(c[0]);
    });
    void gp;
  }
  const gp = geoPath(proj);
  const paths = feats.map((f) => ({id: String(f.id), name: f.properties?.name as string, d: gp(f) || ''}));
  const project: Proj = (ll) => (proj(ll) as [number, number]) || [-999, -999];
  return {paths, project};
};

export const MapaSVG: React.FC<{
  kind: MapKind; width: number; height: number; fills?: Record<string, string>;
  base?: string; stroke?: string; strokeOpacity?: number; opacity?: number;
  children?: (p: Proj) => React.ReactNode; style?: React.CSSProperties; sphere?: boolean;
}> = ({kind, width, height, fills = {}, base = '#1b1d24', stroke = 'rgba(245,241,232,0.22)', strokeOpacity = 1, opacity = 1, children, style, sphere}) => {
  const {paths, project} = useMemo(() => build(kind, width, height), [kind, width, height]);
  return (
    <svg width={width} height={height} style={{opacity, overflow: 'visible', ...style}}>
      {sphere && <rect x={0} y={0} width={width} height={height} fill="none" />}
      <g strokeLinejoin="round">
        {paths.map((p, k) => (
          <path key={k} d={p.d} fill={fills[p.id] ?? fills[p.name] ?? base} stroke={stroke} strokeOpacity={strokeOpacity} strokeWidth={0.8} />
        ))}
      </g>
      {children?.(project)}
    </svg>
  );
};

export const MapDot: React.FC<{x: number; y: number; r?: number; color?: string; t: number; label?: string; labelDx?: number; labelDy?: number; font?: string; size?: number}> = ({x, y, r = 9, color = C.amber, t, label, labelDx = 16, labelDy = 6, size = 26}) => {
  if (t <= 0) return null;
  const pulse = (t * 2) % 1;
  return (
    <g>
      <circle cx={x} cy={y} r={r + 34 * pulse} fill="none" stroke={color} strokeOpacity={0.6 * (1 - pulse)} strokeWidth={2} />
      <circle cx={x} cy={y} r={r * Math.min(1, t * 4)} fill={color} />
      {label && <text x={x + labelDx} y={y + labelDy} fill={C.bone} fontSize={size} fontFamily="Inter, sans-serif" fontWeight={600} opacity={Math.min(1, t * 3)}>{label}</text>}
    </g>
  );
};
