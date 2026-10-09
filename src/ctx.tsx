import React, {createContext, useContext} from 'react';
import {cueEnd, cueIn, Layout, SceneLayout} from './layout';

export const LayoutCtx = createContext<Layout | null>(null);
export const SceneCtx = createContext<SceneLayout | null>(null);

export const useLayout = () => useContext(LayoutCtx)!;
export const useScene = () => {
  const sc = useContext(SceneCtx)!;
  return {
    sc,
    cue: (q: string, nth = 1) => cueIn(sc, q, nth),
    cueEnd: (q: string, nth = 1) => cueEnd(sc, q, nth),
  };
};
export const SceneProvider: React.FC<{sc: SceneLayout; children: React.ReactNode}> = ({sc, children}) => (
  <SceneCtx.Provider value={sc}>{children}</SceneCtx.Provider>
);
