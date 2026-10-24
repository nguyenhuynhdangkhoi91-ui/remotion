import React from 'react';
import {Composition, Still} from 'remotion';
import {ThumbArt, THUMB_H, THUMB_W} from './video01/ThumbArt';
import {ThumbArt2} from './video01/ThumbArt2';
import {Video01} from './video01/Video01';
import timeline01 from './video01/timeline.json';

export const RemotionRoot: React.FC = () => (
	<>
		<Composition id="Video01" component={Video01} durationInFrames={timeline01.durationInFrames} fps={timeline01.fps} width={1920} height={1080} />
		<Still id="Thumb01Art" component={ThumbArt} width={THUMB_W} height={THUMB_H} />
		<Still id="Thumb01Art2" component={ThumbArt2} width={THUMB_W} height={THUMB_H} />
	</>
);
