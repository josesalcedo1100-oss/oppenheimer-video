import React from 'react';
import {AbsoluteFill, Composition, staticFile} from 'remotion';
import {getAudioDurationInSeconds} from '@remotion/media-utils';
import {TransitionSeries, linearTiming} from '@remotion/transitions';
import {fade} from '@remotion/transitions/fade';
import {computeLayout, Layout, Manifest} from './layout';
import {FPS, H, TRANS, W} from './theme';
import {LayoutCtx, SceneProvider} from './ctx';
import {loadFonts} from './fonts';
import {Mix} from './Mix';
import {Grain, Subtitles} from './components/Overlays';
import {SCENES} from './scenes';

loadFonts();

type Props = {layout: Layout};
const empty: Layout = {scenes: [], total: 30};

const Video: React.FC<Props> = ({layout}) => {
  if (!layout.scenes.length) return <AbsoluteFill style={{background: '#0A0A0C'}} />;
  return (
    <LayoutCtx.Provider value={layout}>
      <AbsoluteFill style={{background: '#0A0A0C'}}>
        <Mix layout={layout} />
        <TransitionSeries>
          {layout.scenes.flatMap((sc, k) => {
            const Comp = SCENES[sc.i - 1];
            const items = [
              <TransitionSeries.Sequence key={`s${sc.i}`} durationInFrames={sc.dur}>
                <SceneProvider sc={sc}>
                  <Comp />
                </SceneProvider>
              </TransitionSeries.Sequence>,
            ];
            if (k < layout.scenes.length - 1) {
              items.push(<TransitionSeries.Transition key={`t${sc.i}`} presentation={fade()} timing={linearTiming({durationInFrames: TRANS})} />);
            }
            return items;
          })}
        </TransitionSeries>
        <Grain />
        <Subtitles />
      </AbsoluteFill>
    </LayoutCtx.Provider>
  );
};

export const Root: React.FC = () => (
  <Composition
    id="Oppenheimer"
    component={Video}
    width={W}
    height={H}
    fps={FPS}
    durationInFrames={30}
    defaultProps={{layout: empty} as Props}
    calculateMetadata={async () => {
      const manifest: Manifest = await (await fetch(staticFile('audio/manifest.json'))).json().then((j: any) => j);
      // el manifest tiene { scenes: [...] }
      const real: Record<number, number> = {};
      await Promise.all(
        manifest.scenes.map(async (s) => {
          try {
            real[s.scene] = await getAudioDurationInSeconds(staticFile(s.file));
          } catch {
            real[s.scene] = s.duration;
          }
        }),
      );
      const layout = computeLayout(manifest, real);
      return {durationInFrames: layout.total, props: {layout}};
    }}
  />
);
