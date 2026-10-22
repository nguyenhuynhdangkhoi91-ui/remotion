import React from 'react';
import {AbsoluteFill, interpolate, Sequence, useCurrentFrame} from 'remotion';
import {BrandScene, OutroScene} from '../components/Brand';
import {MapScene} from '../components/MapScene';
import {CardsScene, CompareScene, FactScene, ImageScene, QuoteScene, TimelineScene, TitleScene, WordScene} from '../components/Scenes';
import {TideScene} from '../components/TideScene';
import {C, fonts} from '../lib/theme';
import timeline from './timeline.json';

const XFADE = 10;
const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

type Scene = {id: string; from: number; duration: number; visual: any};

const SceneView: React.FC<{v: any; duration: number}> = ({v, duration}) => {
	switch (v.type) {
		case 'map':
			return <MapScene v={v} duration={duration} />;
		case 'image':
			return <ImageScene v={v} duration={duration} />;
		case 'title':
			return <TitleScene v={v} />;
		case 'quote':
			return <QuoteScene v={v} duration={duration} />;
		case 'word':
			return <WordScene v={v} duration={duration} />;
		case 'fact':
			return <FactScene v={v} duration={duration} />;
		case 'timeline':
			return <TimelineScene v={v} duration={duration} />;
		case 'cards':
			return <CardsScene v={v} duration={duration} />;
		case 'compare':
			return <CompareScene v={v} duration={duration} />;
		case 'tide':
			return <TideScene v={v} duration={duration} />;
		case 'brand':
			return <BrandScene duration={duration} />;
		case 'outro':
			return <OutroScene duration={duration} />;
		default:
			throw new Error(`Không có cảnh loại ${v.type}`);
	}
};

const FadeIn: React.FC<{children: React.ReactNode; on: boolean}> = ({children, on}) => {
	const frame = useCurrentFrame();
	return <AbsoluteFill style={{opacity: on ? interpolate(frame, [0, XFADE], [0, 1], clamp) : 1}}>{children}</AbsoluteFill>;
};

const Subtitles: React.FC = () => {
	const frame = useCurrentFrame();
	const sub = timeline.subs.find((s) => frame >= s.from && frame < s.to);
	if (!sub) return null;
	return (
		<AbsoluteFill style={{justifyContent: 'flex-end', alignItems: 'center', paddingBottom: 58}}>
			<div style={{maxWidth: 1500, padding: '10px 26px', borderRadius: 10, background: 'rgba(10,8,6,0.72)', textAlign: 'center',
				fontFamily: fonts.sans, fontWeight: 600, fontSize: 40, lineHeight: 1.3, color: '#fff'}}>
				{sub.text}
			</div>
		</AbsoluteFill>
	);
};

const Progress: React.FC = () => {
	const frame = useCurrentFrame();
	return <div style={{position: 'absolute', left: 0, bottom: 0, height: 5, width: `${(frame / timeline.durationInFrames) * 100}%`, background: C.gold, opacity: 0.8}} />;
};

export const Video01: React.FC = () => {
	const scenes = timeline.scenes as Scene[];
	return (
		<AbsoluteFill style={{background: C.ink}}>
			{scenes.map((s, i) => (
				<Sequence key={s.id} from={s.from} durationInFrames={s.duration + (i < scenes.length - 1 ? XFADE : 0)} name={s.id}>
					<FadeIn on={i > 0}>
						<SceneView v={s.visual} duration={s.duration} />
					</FadeIn>
				</Sequence>
			))}
			<Subtitles />
			<div style={{position: 'absolute', right: 40, bottom: 18, fontFamily: fonts.sans, fontWeight: 700, fontSize: 20, letterSpacing: 4, color: C.text, opacity: 0.5}}>
				DÒNG CHẢY LỊCH SỬ
			</div>
			<Progress />
		</AbsoluteFill>
	);
};
