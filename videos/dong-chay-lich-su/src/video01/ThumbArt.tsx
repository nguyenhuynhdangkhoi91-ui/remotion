import React from 'react';
import {AbsoluteFill, random} from 'remotion';

// Tranh minh họa tự vẽ cho thumbnail: bãi cọc Bạch Đằng lúc triều rút, thuyền Nguyên mắc cọc và bốc cháy.
export const THUMB_W = 1600;
export const THUMB_H = 1080;
const HORIZON = 520;

const Hills: React.FC = () => {
	const ridge = (seed: string, base: number, amp: number, color: string) => {
		const pts = Array.from({length: 25}, (_, i) => {
			const x = (i / 24) * THUMB_W;
			const peak = random(`${seed}${i}`);
			return `L${x.toFixed(0)},${(base - amp * peak * peak).toFixed(0)}`;
		}).join(' ');
		return <path d={`M0,${HORIZON} ${pts} L${THUMB_W},${HORIZON} Z`} fill={color} />;
	};
	return (
		<g>
			{ridge('a', HORIZON - 40, 210, '#3b4a63')}
			{ridge('b', HORIZON - 10, 150, '#2b3850')}
			{ridge('c', HORIZON + 2, 80, '#1f2a3d')}
		</g>
	);
};

const Stake: React.FC<{x: number; y: number; h: number; lean: number; w: number}> = ({x, y, h, lean, w}) => (
	<g>
		<path d={`M${x - w / 2},${y} L${x + lean - 2},${y - h} L${x + w / 2},${y} Z`} fill="#2a1a10" />
		<path d={`M${x + w * 0.05},${y} L${x + lean - 2},${y - h} L${x + w / 2},${y} Z`} fill="#6e4426" opacity={0.85} />
		<ellipse cx={x} cy={y + 3} rx={w * 0.9} ry={w * 0.22} fill="#0d1a22" opacity={0.6} />
	</g>
);

const Junk: React.FC<{x: number; y: number; s: number; rot: number; burning?: boolean}> = ({x, y, s, rot, burning}) => (
	<g transform={`translate(${x},${y}) rotate(${rot}) scale(${s})`}>
		{/* thân thuyền */}
		<path d="M -260 0 Q -250 60 -150 80 L 170 80 Q 250 60 280 -30 L 210 -10 L -230 -10 Z" fill="#24160d" />
		<path d="M -250 -10 L 230 -10 L 220 10 L -240 10 Z" fill="#4b2c18" />
		{/* buồm có nẹp tre */}
		{[
			[-120, 300, 150],
			[40, 360, 170],
			[170, 230, 110],
		].map(([mx, mh, sw], i) => (
			<g key={i}>
				<rect x={mx - 5} y={-10 - mh} width={10} height={mh} fill="#1a100a" />
				<path d={`M${mx},${-30 - mh * 0.95} L${mx + sw},${-20 - mh * 0.85} L${mx + sw * 0.9},${-30} L${mx},${-30} Z`} fill={burning && i === 1 ? '#5a2a1c' : '#7a3326'} opacity={0.95} />
				{Array.from({length: 7}, (_, k) => {
					const yy = -30 - (mh * 0.92 * k) / 6;
					return <line key={k} x1={mx} y1={yy} x2={mx + sw * (0.9 + 0.1 * (k / 6))} y2={yy + 8} stroke="#2a130c" strokeWidth={4} />;
				})}
			</g>
		))}
	</g>
);

const flame = (x: number, y: number, h: number, w: number, tilt: number) =>
	`M${x - w},${y} C${x - w * 1.2},${y - h * 0.45} ${x - w * 0.2 + tilt * 0.5},${y - h * 0.6} ${x + tilt},${y - h} C${x + w * 0.5 + tilt * 0.5},${y - h * 0.55} ${x + w * 1.2},${y - h * 0.4} ${x + w},${y} Z`;

const Fire: React.FC<{x: number; y: number; r: number}> = ({x, y, r}) => (
	<g>
		<circle cx={x} cy={y - r * 0.6} r={r * 3.2} fill="url(#glow)" />
		{Array.from({length: 6}, (_, i) => {
			const dx = (i - 2.5) * r * 0.42 + (random(`fx${x}${i}`) - 0.5) * r * 0.3;
			const h = r * (1.3 + random(`fh${x}${i}`) * 1.4) * (1 - Math.abs(i - 2.5) * 0.12);
			const tilt = (random(`ft${x}${i}`) - 0.3) * r * 0.6;
			return (
				<g key={i}>
					<path d={flame(x + dx, y, h, r * 0.38, tilt)} fill="#d4583a" opacity={0.9} />
					<path d={flame(x + dx, y, h * 0.7, r * 0.24, tilt * 0.7)} fill="#ec8a56" opacity={0.95} />
					<path d={flame(x + dx, y, h * 0.4, r * 0.12, tilt * 0.4)} fill="#f6c9a0" />
				</g>
			);
		})}
	</g>
);

export const ThumbArt: React.FC = () => {
	const stakes = Array.from({length: 46}, (_, i) => {
		const row = random(`row${i}`);
		const y = HORIZON + 120 + row * row * 420;
		const depth = (y - HORIZON) / 560;
		return {x: random(`x${i}`) * THUMB_W, y, h: 60 + depth * 330 * (0.7 + random(`h${i}`) * 0.5), w: 8 + depth * 34, lean: (random(`l${i}`) - 0.4) * depth * 70};
	}).sort((a, b) => a.y - b.y);
	return (
		<AbsoluteFill>
			<svg width={THUMB_W} height={THUMB_H}>
				<defs>
					<linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
						<stop offset="0" stopColor="#1c2840" />
						<stop offset="0.55" stopColor="#5b5a78" />
						<stop offset="1" stopColor="#c98a78" />
					</linearGradient>
					<linearGradient id="water" x1="0" y1="0" x2="0" y2="1">
						<stop offset="0" stopColor="#5e6d86" />
						<stop offset="0.25" stopColor="#2d3d52" />
						<stop offset="1" stopColor="#14202c" />
					</linearGradient>
					<radialGradient id="glow">
						<stop offset="0" stopColor="#f0a070" stopOpacity={0.75} />
						<stop offset="0.5" stopColor="#c8583a" stopOpacity={0.25} />
						<stop offset="1" stopColor="#c8583a" stopOpacity={0} />
					</radialGradient>
					<radialGradient id="sun" cx="0.72" cy="0.46" r="0.5">
						<stop offset="0" stopColor="#f3c9a8" stopOpacity={0.55} />
						<stop offset="1" stopColor="#f3c9a8" stopOpacity={0} />
					</radialGradient>
					<filter id="blur8"><feGaussianBlur stdDeviation="8" /></filter>
					<filter id="blur20"><feGaussianBlur stdDeviation="22" /></filter>
				</defs>
				<rect width={THUMB_W} height={HORIZON} fill="url(#sky)" />
				<rect width={THUMB_W} height={THUMB_H} fill="url(#sun)" />
				<Hills />
				<rect y={HORIZON} width={THUMB_W} height={THUMB_H - HORIZON} fill="url(#water)" />
				{/* phản chiếu ánh lửa trên mặt nước */}
				<ellipse cx={1010} cy={HORIZON + 170} rx={260} ry={60} fill="#d0704a" opacity={0.28} filter="url(#blur20)" />
				{Array.from({length: 40}, (_, i) => {
					const y = HORIZON + 20 + random(`wy${i}`) * 520;
					const x = random(`wx${i}`) * THUMB_W;
					return <line key={i} x1={x} y1={y} x2={x + 40 + random(`wl${i}`) * 120} y2={y} stroke="#9fb4c8" strokeOpacity={0.18} strokeWidth={2} />;
				})}
				{/* khói */}
				{Array.from({length: 7}, (_, i) => (
					<circle key={i} cx={980 + i * 38 + random(`sx${i}`) * 40} cy={HORIZON - 160 - i * 70} r={70 + i * 22} fill="#2a2730" opacity={0.35 - i * 0.03} filter="url(#blur20)" />
				))}
				{/* thuyền xa */}
				<Junk x={420} y={HORIZON + 40} s={0.35} rot={-3} />
				<Junk x={1360} y={HORIZON + 55} s={0.4} rot={6} />
				{/* thuyền chính mắc cọc, nghiêng và cháy */}
				<Junk x={1000} y={HORIZON + 150} s={0.95} rot={-9} burning />
				<Fire x={1050} y={HORIZON + 30} r={70} />
				<Fire x={860} y={HORIZON + 75} r={46} />
				{/* thuyền nhỏ quân Trần */}
				{[
					[260, HORIZON + 250],
					[560, HORIZON + 300],
				].map(([x, y], i) => (
					<g key={i} transform={`translate(${x},${y})`}>
						<path d="M -120 0 Q -100 26 -40 30 L 60 30 Q 110 22 130 -6 Z" fill="#141c22" />
						{Array.from({length: 5}, (_, k) => (
							<line key={k} x1={-70 + k * 35} y1={14} x2={-100 + k * 35} y2={70} stroke="#141c22" strokeWidth={5} />
						))}
						{Array.from({length: 4}, (_, k) => (
							<path key={k} d={`M${-60 + k * 34},0 l -10 -40 l 20 0 Z`} fill="#141c22" />
						))}
					</g>
				))}
				{stakes.map((s, i) => (
					<Stake key={i} {...s} />
				))}
				<rect width={THUMB_W} height={THUMB_H} fill="#000" opacity={0.08} />
			</svg>
		</AbsoluteFill>
	);
};
