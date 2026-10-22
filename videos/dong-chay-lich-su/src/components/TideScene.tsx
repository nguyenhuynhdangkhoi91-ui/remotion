import React from 'react';
import {AbsoluteFill, Easing, interpolate, random, useCurrentFrame} from 'remotion';
import {C, fonts, H, W} from '../lib/theme';

// Sơ đồ minh họa trận địa cọc Bạch Đằng nhìn từ trên xuống (không theo tỷ lệ).
export type TideVisual = {type: 'tide'; phase: 'high' | 'lure' | 'low' | 'attack'};

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

const STAKES = Array.from({length: 84}, (_, i) => {
	const col = i % 12;
	const row = Math.floor(i / 12);
	return {
		x: 1040 + col * 34 + row * 9 + (random(`sx${i}`) - 0.5) * 14,
		y: 360 + row * 52 + (random(`sy${i}`) - 0.5) * 18,
	};
});

const Ship: React.FC<{x: number; y: number; rot?: number; yuan?: boolean; scale?: number; fire?: number}> = ({x, y, rot = 0, yuan = true, scale = 1, fire = 0}) => (
	<g transform={`translate(${x},${y}) rotate(${rot}) scale(${scale})`}>
		{fire > 0 ? <circle cx={0} cy={0} r={46 + fire * 10} fill="#ff7a1a" opacity={0.25 + 0.2 * fire} /> : null}
		<path d={yuan ? 'M -62 -16 L 50 -16 L 72 0 L 50 16 L -62 16 Z' : 'M -30 -8 L 26 -8 L 38 0 L 26 8 L -30 8 Z'} fill={yuan ? '#4a2f1c' : '#2c3b2a'} stroke="#000" strokeWidth={2} />
		<rect x={yuan ? -24 : -10} y={yuan ? -30 : -16} width={yuan ? 30 : 14} height={yuan ? 60 : 32} rx={3} fill={yuan ? C.mongol : C.viet} stroke="#000" strokeWidth={2} />
		{yuan ? <rect x={20} y={-22} width={16} height={44} rx={3} fill={C.mongol} stroke="#000" strokeWidth={2} /> : null}
	</g>
);

export const TideScene: React.FC<{v: TideVisual; duration: number}> = ({v, duration}) => {
	const frame = useCurrentFrame();
	const p = v.phase;
	// mực nước: 1 = triều cao, 0 = triều thấp
	let level = 1;
	if (p === 'high') level = interpolate(frame, [20, 110], [0.15, 1], {...clamp, easing: Easing.inOut(Easing.cubic)});
	if (p === 'low') level = interpolate(frame, [10, Math.min(duration - 20, 150)], [1, 0], {...clamp, easing: Easing.inOut(Easing.cubic)});
	if (p === 'attack') level = 0;
	const halfW = 120 + 150 * level; // nửa bề rộng mặt nước
	const cy = H / 2 + 20;
	const stakeOpacity = interpolate(level, [0, 0.55, 1], [1, 0.45, 0.12]);
	const stakesIn = p === 'high' ? interpolate(frame, [0, 30], [0, 1], clamp) : 1;

	const yuanShips = Array.from({length: 7}, (_, i) => i);
	const vietBoats = Array.from({length: 8}, (_, i) => i);

	const shipPos = (i: number) => {
		const lane = cy + ((i % 3) - 1) * 70 + (random(`l${i}`) - 0.5) * 20;
		const order = i * 120;
		if (p === 'lure') {
			const x = interpolate(frame, [0, duration], [-260 - order, 1000 - order * 0.55], clamp);
			return {x, y: lane, rot: Math.sin(frame / 12 + i) * 1.5};
		}
		if (p === 'low' || p === 'attack') {
			const x = 1000 - order * 0.55 + 60;
			const stuck = p === 'attack' ? 1 : interpolate(level, [0.1, 0.6], [1, 0], clamp);
			const rot = stuck * (random(`r${i}`) > 0.5 ? 1 : -1) * (10 + random(`rr${i}`) * 12);
			return {x, y: lane, rot};
		}
		return {x: -400, y: lane, rot: 0};
	};

	const vietPos = (i: number) => {
		const lane = cy + ((i % 4) - 1.5) * 50;
		if (p === 'lure') {
			const x = interpolate(frame, [0, duration], [200 - i * 40, 1650 - i * 40], clamp);
			return {x, y: lane};
		}
		if (p === 'attack') {
			const fromTop = i % 2 === 0;
			const tx = 640 + (i % 4) * 150;
			const sy = fromTop ? cy - 330 : cy + 330;
			const ty = fromTop ? cy - halfW - 10 : cy + halfW + 10;
			const y = interpolate(frame, [0, 60], [sy, ty], {...clamp, easing: Easing.out(Easing.cubic)});
			return {x: tx, y};
		}
		return {x: -400, y: lane};
	};

	const caption = {
		high: 'Triều lên: bãi cọc chìm dưới mặt nước',
		lure: 'Triều cao: quân Trần nhử, thuyền Nguyên đuổi vào trận địa cọc',
		low: 'Triều rút: thuyền Nguyên mắc cọc',
		attack: 'Quân mai phục hai bên bờ đổ ra',
	}[p];

	const redTint = p === 'attack' ? interpolate(frame, [30, 120], [0, 0.35], clamp) : 0;

	return (
		<AbsoluteFill style={{background: '#3a3122'}}>
			<svg width={W} height={H}>
				<defs>
					<linearGradient id="water" x1="0" x2="1">
						<stop offset="0" stopColor="#24535f" />
						<stop offset="1" stopColor="#1b3f52" />
					</linearGradient>
					<pattern id="mud" width="30" height="30" patternUnits="userSpaceOnUse">
						<rect width="30" height="30" fill="#5a4a32" />
						<circle cx="8" cy="10" r="2" fill="#4b3d29" />
						<circle cx="22" cy="21" r="1.6" fill="#6a5940" />
					</pattern>
				</defs>
				{/* bờ sông */}
				<rect x={0} y={0} width={W} height={H} fill="#2f3a24" />
				{Array.from({length: 40}, (_, i) => (
					<circle key={i} cx={random(`tx${i}`) * W} cy={random(`ty${i}`) < 0.5 ? random(`ty2${i}`) * 200 : H - random(`ty3${i}`) * 200} r={14 + random(`tr${i}`) * 18} fill="#23301b" opacity={0.8} />
				))}
				{/* bãi bùn lộ ra khi triều rút */}
				<rect x={0} y={cy - 280} width={W} height={560} fill="url(#mud)" />
				{/* mặt nước */}
				<rect x={0} y={cy - halfW} width={W} height={halfW * 2} fill="url(#water)" />
				<rect x={0} y={cy - halfW} width={W} height={halfW * 2} fill="#8b1a10" opacity={redTint} />
				{Array.from({length: 18}, (_, i) => {
					const x = ((i * 137 + frame * (p === 'low' ? 3 : 1.4)) % (W + 200)) - 100;
					const y = cy + (random(`wy${i}`) - 0.5) * halfW * 1.6;
					return <path key={i} d={`M${x} ${y} q 14 -6 28 0 t 28 0`} stroke="#9cc7cf" strokeOpacity={0.35} strokeWidth={2} fill="none" />;
				})}
				{/* cọc */}
				<g opacity={stakesIn}>
					{STAKES.map((s, i) => {
						const visible = Math.abs(s.y - cy) < 280;
						if (!visible) return null;
						return (
							<g key={i} opacity={stakeOpacity}>
								<circle cx={s.x + 3} cy={s.y + 4} r={9} fill="#000" opacity={0.35} />
								<circle cx={s.x} cy={s.y} r={8} fill="#6b4a2a" stroke="#2a1a0c" strokeWidth={2} />
								<circle cx={s.x - 2} cy={s.y - 2} r={3} fill="#c9a36a" />
							</g>
						);
					})}
				</g>
				{yuanShips.map((i) => {
					const s = shipPos(i);
					const fire = p === 'attack' ? Math.max(0, Math.sin(frame / 5 + i) * 0.5 + interpolate(frame, [40, 90], [0, 0.8], clamp)) : 0;
					return <Ship key={`y${i}`} x={s.x} y={s.y} rot={s.rot} yuan fire={fire} />;
				})}
				{vietBoats.map((i) => {
					const s = vietPos(i);
					return <Ship key={`v${i}`} x={s.x} y={s.y} yuan={false} scale={1.1} />;
				})}
				{p === 'attack'
					? Array.from({length: 16}, (_, i) => {
							const t = ((frame + i * 9) % 40) / 40;
							const fromTop = i % 2 === 0;
							const x = 600 + (i % 8) * 70;
							const y0 = fromTop ? cy - 240 : cy + 240;
							const y = y0 + (fromTop ? 1 : -1) * t * 200;
							return <line key={i} x1={x} y1={y} x2={x + 14} y2={y + (fromTop ? 26 : -26)} stroke="#f0d9a0" strokeWidth={3} opacity={frame > 50 ? 0.9 : 0} />;
						})
					: null}
				{/* chú thích hướng */}
				<text x={60} y={cy - halfW + 44} fontFamily={fonts.sans} fontWeight={600} fontSize={28} fill={C.textDim}>← Thượng nguồn</text>
				<text x={W - 60} y={cy - halfW + 44} textAnchor="end" fontFamily={fonts.sans} fontWeight={600} fontSize={28} fill={C.textDim}>Ra cửa biển →</text>
				<text x={1240} y={cy + 300} textAnchor="middle" fontFamily={fonts.sans} fontWeight={700} fontSize={30} fill={C.goldSoft} opacity={stakeOpacity > 0.3 ? 1 : 0.6}>Trận địa cọc</text>
			</svg>
			{/* thước đo thủy triều */}
			<div style={{position: 'absolute', left: 70, top: 60, width: 520, padding: '22px 28px', borderRadius: 14, background: 'rgba(0,0,0,0.6)', border: `2px solid ${C.gold}`}}>
				<div style={{fontFamily: fonts.sans, fontWeight: 700, fontSize: 30, color: C.goldSoft}}>Mực nước triều</div>
				<div style={{marginTop: 14, height: 22, borderRadius: 11, background: '#1d2a2e', overflow: 'hidden'}}>
					<div style={{width: `${10 + 90 * level}%`, height: '100%', background: 'linear-gradient(90deg, #2a6f80, #67b3c2)'}} />
				</div>
				<div style={{marginTop: 14, fontFamily: fonts.sans, fontSize: 30, color: C.text, lineHeight: 1.3}}>{caption}</div>
			</div>
			<div style={{position: 'absolute', left: 40, bottom: 18, fontFamily: fonts.sans, fontSize: 20, color: C.textDim}}>Sơ đồ minh họa, không theo tỷ lệ</div>
		</AbsoluteFill>
	);
};
