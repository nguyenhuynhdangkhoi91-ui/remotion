import React from 'react';
import {AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {C, fonts, H, W} from '../lib/theme';
import {PaperBg} from './Scenes';

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

// Dải sông uốn lượn, dùng làm biểu tượng "dòng chảy".
const River: React.FC<{progress: number; y: number; amp: number; color: string; width: number; phase: number}> = ({progress, y, amp, color, width, phase}) => {
	const frame = useCurrentFrame();
	const pts = Array.from({length: 49}, (_, i) => {
		const x = (i / 48) * W;
		const yy = y + Math.sin(i / 5 + phase + frame / 40) * amp;
		return `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${yy.toFixed(1)}`;
	}).join(' ');
	return <path d={pts} fill="none" stroke={color} strokeWidth={width} strokeLinecap="round" strokeDasharray={`${W * 1.2 * progress} ${W * 2}`} />;
};

export type BrandVisual = {type: 'brand'};

export const BrandScene: React.FC<{duration: number}> = ({duration}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const draw = interpolate(frame, [0, 50], [0, 1], {...clamp, easing: Easing.out(Easing.cubic)});
	const s = spring({frame: frame - 14, fps, config: {damping: 200}, durationInFrames: 34});
	const sub = interpolate(frame, [40, 60], [0, 1], clamp);
	const zoom = interpolate(frame, [0, duration], [1, 1.05]);
	return (
		<AbsoluteFill>
			<PaperBg />
			<svg width={W} height={H} style={{position: 'absolute', opacity: 0.85}}>
				<River progress={draw} y={H / 2 + 150} amp={26} color={C.river} width={5} phase={0} />
				<River progress={draw} y={H / 2 + 185} amp={20} color={C.gold} width={3} phase={1.4} />
				<River progress={draw} y={H / 2 + 215} amp={16} color={C.river} width={2} phase={2.6} />
			</svg>
			<AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', flexDirection: 'column', transform: `scale(${zoom})`}}>
				<div style={{fontFamily: fonts.serif, fontWeight: 700, fontSize: 132, letterSpacing: 6, color: C.text, opacity: s,
					transform: `translateY(${(1 - s) * 30 - 60}px)`, textShadow: '0 10px 40px #000'}}>
					DÒNG CHẢY LỊCH SỬ
				</div>
				<div style={{fontFamily: fonts.sans, fontWeight: 600, fontSize: 40, letterSpacing: 8, color: C.goldSoft, opacity: sub, marginTop: -20}}>
					1258 → NGÀY NAY
				</div>
			</AbsoluteFill>
		</AbsoluteFill>
	);
};

export type OutroVisual = {type: 'outro'};

const REASONS = ['Bỏ thành, giữ quân', 'Đánh vào đường lương', 'Biến thiên nhiên thành vũ khí'];

// Màn hình kết: bên trái là câu hỏi, bên phải chừa chỗ cho thẻ màn hình kết của YouTube.
export const OutroScene: React.FC<{duration: number}> = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const head = spring({frame: frame - 4, fps, config: {damping: 200}, durationInFrames: 26});
	return (
		<AbsoluteFill>
			<PaperBg />
			<div style={{position: 'absolute', left: 110, top: 150, width: 860}}>
				<div style={{fontFamily: fonts.sans, fontWeight: 700, fontSize: 30, letterSpacing: 8, color: C.gold, opacity: head}}>CÂU HỎI CHO BẠN</div>
				<div style={{marginTop: 20, fontFamily: fonts.serif, fontWeight: 700, fontSize: 70, lineHeight: 1.15, color: C.text, opacity: head,
					transform: `translateY(${(1 - head) * 24}px)`}}>
					Lý do nào quan trọng nhất?
				</div>
				<div style={{marginTop: 50, display: 'flex', flexDirection: 'column', gap: 24}}>
					{REASONS.map((r, i) => {
						const s = spring({frame: frame - 24 - i * 10, fps, config: {damping: 200}, durationInFrames: 22});
						return (
							<div key={r} style={{display: 'flex', alignItems: 'center', gap: 28, opacity: s, transform: `translateX(${(1 - s) * -40}px)`}}>
								<div style={{width: 76, height: 76, borderRadius: 38, border: `3px solid ${C.gold}`, display: 'flex', alignItems: 'center', justifyContent: 'center',
									fontFamily: fonts.serif, fontWeight: 700, fontSize: 44, color: C.gold}}>{i + 1}</div>
								<div style={{fontFamily: fonts.sans, fontWeight: 700, fontSize: 46, color: C.text}}>{r}</div>
							</div>
						);
					})}
				</div>
				<div style={{marginTop: 60, fontFamily: fonts.sans, fontSize: 30, color: C.textDim, opacity: interpolate(frame, [70, 90], [0, 1], clamp)}}>
					Nguồn tư liệu và hình ảnh: xem phần mô tả
				</div>
			</div>
			<div style={{position: 'absolute', right: 110, top: 190, width: 720, opacity: interpolate(frame, [30, 50], [0, 1], clamp)}}>
				<div style={{fontFamily: fonts.sans, fontWeight: 700, fontSize: 28, letterSpacing: 6, color: C.goldSoft, marginBottom: 18}}>VIDEO TIẾP THEO</div>
				<div style={{width: 720, height: 405, borderRadius: 14, border: `3px dashed ${C.gold}`, background: 'rgba(0,0,0,0.35)',
					display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: 40, boxSizing: 'border-box',
					fontFamily: fonts.serif, fontWeight: 700, fontSize: 46, lineHeight: 1.2, color: C.text}}>
					Khi hạm đội Mông Cổ sang Nhật Bản
				</div>
			</div>
		</AbsoluteFill>
	);
};
