import React from 'react';
import {AbsoluteFill, random} from 'remotion';
import {THUMB_H, THUMB_W} from './ThumbArt';

// Tranh thumbnail thứ hai: vị tướng nhà Trần đứng quay lưng trên vách đá, nhìn xuống trận địa cọc và hạm đội Nguyên đang cháy.
const HORIZON = 600;

const flame = (x: number, y: number, h: number, w: number, tilt: number) =>
	`M${x - w},${y} C${x - w * 1.2},${y - h * 0.45} ${x - w * 0.2 + tilt * 0.5},${y - h * 0.6} ${x + tilt},${y - h} C${x + w * 0.5 + tilt * 0.5},${y - h * 0.55} ${x + w * 1.2},${y - h * 0.4} ${x + w},${y} Z`;

const Ship: React.FC<{x: number; y: number; s: number; rot: number; fire: boolean}> = ({x, y, s, rot, fire}) => (
	<g transform={`translate(${x},${y}) rotate(${rot}) scale(${s})`}>
		{fire ? <circle cx={0} cy={-140} r={260} fill="url(#glow2)" /> : null}
		<path d="M -200 0 Q -190 45 -110 60 L 130 60 Q 190 45 215 -25 L 160 -8 L -180 -8 Z" fill="#1b120c" />
		{[[-90, 230, 120], [30, 280, 130], [130, 170, 80]].map(([mx, mh, sw], i) => (
			<g key={i}>
				<rect x={mx - 4} y={-8 - mh} width={8} height={mh} fill="#140d08" />
				<path d={`M${mx},${-25 - mh * 0.95} L${mx + sw},${-15 - mh * 0.85} L${mx + sw * 0.9},${-25} L${mx},${-25} Z`} fill="#6b2a20" />
			</g>
		))}
		{fire
			? Array.from({length: 7}, (_, i) => {
					const dx = (i - 3) * 38;
					const h = 120 + random(`f${x}${i}`) * 200;
					return (
						<g key={i}>
							<path d={flame(dx, -10, h, 26, (random(`t${x}${i}`) - 0.3) * 40)} fill="#cf5536" />
							<path d={flame(dx, -10, h * 0.65, 15, 8)} fill="#ea8a58" />
							<path d={flame(dx, -10, h * 0.35, 7, 4)} fill="#f6caa2" />
						</g>
					);
				})
			: null}
	</g>
);

export const ThumbArt2: React.FC = () => {
	const stakes = Array.from({length: 60}, (_, i) => {
		const y = HORIZON + 40 + random(`sy${i}`) * 200;
		const d = (y - HORIZON) / 240;
		return {x: 380 + random(`sx${i}`) * 1250, y, h: 20 + d * 70, w: 4 + d * 8};
	}).sort((a, b) => a.y - b.y);
	return (
		<AbsoluteFill>
			<svg width={THUMB_W} height={THUMB_H}>
				<defs>
					<linearGradient id="sky2" x1="0" y1="0" x2="0" y2="1">
						<stop offset="0" stopColor="#2a3550" />
						<stop offset="0.6" stopColor="#7a6a80" />
						<stop offset="1" stopColor="#d9a089" />
					</linearGradient>
					<linearGradient id="water2" x1="0" y1="0" x2="0" y2="1">
						<stop offset="0" stopColor="#8a8aa0" />
						<stop offset="0.3" stopColor="#3b4a62" />
						<stop offset="1" stopColor="#1a2433" />
					</linearGradient>
					<radialGradient id="glow2">
						<stop offset="0" stopColor="#f0a070" stopOpacity={0.6} />
						<stop offset="1" stopColor="#c8583a" stopOpacity={0} />
					</radialGradient>
					<radialGradient id="rim" cx="0.75" cy="0.55" r="0.6">
						<stop offset="0" stopColor="#f5cdb0" stopOpacity={0.5} />
						<stop offset="1" stopColor="#f5cdb0" stopOpacity={0} />
					</radialGradient>
					<filter id="b22"><feGaussianBlur stdDeviation="22" /></filter>
				</defs>
				<rect width={THUMB_W} height={HORIZON} fill="url(#sky2)" />
				<rect width={THUMB_W} height={THUMB_H} fill="url(#rim)" />
				{[['#4a5470', 180, 'a'], ['#36405a', 110, 'b']].map(([c, amp, s]) => (
					<path key={s as string} d={`M0,${HORIZON} ${Array.from({length: 21}, (_, i) => `L${(i / 20) * THUMB_W},${HORIZON - 10 - (amp as number) * random(`${s}${i}`) ** 2}`).join(' ')} L${THUMB_W},${HORIZON} Z`} fill={c as string} />
				))}
				<rect y={HORIZON} width={THUMB_W} height={THUMB_H - HORIZON} fill="url(#water2)" />
				{Array.from({length: 6}, (_, i) => (
					<circle key={i} cx={1050 + i * 40} cy={HORIZON - 220 - i * 60} r={80 + i * 25} fill="#2b2833" opacity={0.3} filter="url(#b22)" />
				))}
				<Ship x={1150} y={HORIZON + 70} s={0.75} rot={-10} fire />
				<Ship x={780} y={HORIZON + 50} s={0.5} rot={7} fire />
				<Ship x={1450} y={HORIZON + 40} s={0.42} rot={-4} fire={false} />
				<ellipse cx={1100} cy={HORIZON + 120} rx={330} ry={50} fill="#d0704a" opacity={0.3} filter="url(#b22)" />
				{stakes.map((s, i) => (
					<path key={i} d={`M${s.x - s.w / 2},${s.y} L${s.x + 2},${s.y - s.h} L${s.x + s.w / 2},${s.y} Z`} fill="#2a1a10" />
				))}
				{/* vách đá tiền cảnh */}
				<path d="M0,1080 L0,560 Q90,540 170,600 Q260,650 330,700 Q420,760 470,840 Q520,930 560,1080 Z" fill="#141519" />
				{/* vị tướng quay lưng, áo choàng bay */}
				<g transform="translate(250,600)">
					<path d="M -20 -10 Q -95 70 -150 170 Q -60 160 10 150 Z" fill="#5a1f1a" />
					<path d="M -40 0 Q -50 80 -45 150 L 45 150 Q 52 80 40 0 Q 0 -15 -40 0 Z" fill="#17181c" />
					<path d="M -45 150 L -40 240 L -10 240 L -5 150 Z M 8 150 L 12 240 L 42 240 L 45 150 Z" fill="#101114" />
					<circle cx={0} cy={-35} r={32} fill="#17181c" />
					<path d="M -30 -50 Q 0 -95 30 -50 Q 0 -60 -30 -50 Z" fill="#17181c" />
					<path d="M 40 10 L 150 -120" stroke="#17181c" strokeWidth={9} />
					<path d="M 150 -120 L 175 -165 L 160 -112 Z" fill="#17181c" />
					<path d="M 36 -2 Q 44 70 40 150" stroke="#e8b48f" strokeOpacity={0.55} strokeWidth={4} fill="none" />
				</g>
				<rect width={THUMB_W} height={THUMB_H} fill="#000" opacity={0.06} />
			</svg>
		</AbsoluteFill>
	);
};
