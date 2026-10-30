import React from 'react';
import {Composition, Still} from 'remotion';
import {ThumbArt, THUMB_H, THUMB_W} from './video01/ThumbArt';
import {Video01} from './video01/Video01';
import timeline01 from './video01/timeline.json';
import {MapDBP} from './video04/MapDBP';

export const RemotionRoot: React.FC = () => (
	<>
		<Composition id="Video01" component={Video01} durationInFrames={timeline01.durationInFrames} fps={timeline01.fps} width={1920} height={1080} />
		<Still id="Thumb01Art" component={ThumbArt} width={THUMB_W} height={THUMB_H} />
		<Composition id="MapDBP" component={MapDBP} durationInFrames={250} fps={25} width={1920} height={1080} defaultProps={{scene: 'map_valley_forts'}}
			calculateMetadata={({props}) => ({durationInFrames: (props as {frames?: number}).frames ?? 250})} />
	</>
);
