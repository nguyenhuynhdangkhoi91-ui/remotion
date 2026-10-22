import React, {useMemo} from 'react';
import {AbsoluteFill, Easing, interpolate, useCurrentFrame} from 'remotion';
import {geoArea, geoMercator} from 'd3-geo';
import {C, fonts, H, W} from '../lib/theme';
import {LAND_10, LAND_50, lerpView, makeProjection, pathFor, PLACES, REGIONS, RIVERS, VIEWS} from '../lib/geo';

type Arrow = {path: string; color: string; dashed?: boolean};
type Label = {at: string; text: string; dy?: number};
export type MapVisual = {
	type: 'map';
	view: string;
	from: string;
	regions: string[];
	arrows: Arrow[];
	markers: string[];
	labels: Label[];
	note: boolean;
	year?: string | null;
	rivers: boolean;
};

const ARROW_COLORS: Record<string, string> = {mongol: C.mongol, viet: C.viet, supply: C.supply, neutral: C.neutral};

const ringClockwise = (poly: [number, number][]) => {
	const f = {type: 'Polygon', coordinates: [[...poly, poly[0]]]} as any;
	if (geoArea(f) > 2 * Math.PI) {
		return {type: 'Polygon', coordinates: [[...poly, poly[0]].reverse()]} as any;
	}
	return f;
};

const CAM_FRAMES = 42;

export const MapScene: React.FC<{v: MapVisual; duration: number}> = ({v, duration}) => {
	const frame = useCurrentFrame();
	const to = VIEWS[v.view];
	const from = VIEWS[v.from] ?? to;
	const wider = from.scale <= to.scale ? from : to;
	const detail = from.detail === '10' || to.detail === '10' ? '10' : '50';

	// Chiếu một lần theo góc nhìn rộng hơn, sau đó chỉ co giãn bằng transform.
	const base = useMemo(() => {
		const proj = geoMercator()
			.center(wider.center)
			.scale(wider.scale)
			.translate([W / 2, H / 2])
			.clipExtent([[-400, -400], [W + 400, H + 400]])
			.precision(0.5);
		const path = pathFor(proj);
		const land = path(detail === '10' ? LAND_10 : LAND_50) ?? '';
		const rivers = v.rivers ? (path(RIVERS) ?? '') : '';
		const regions = v.regions.map((id) => ({id, d: path(ringClockwise(REGIONS[id].poly)) ?? ''}));
		return {proj, land, rivers, regions};
	}, [wider, detail, v.regions, v.rivers]);

	const camT = from === to ? 1 : interpolate(frame, [0, CAM_FRAMES], [0, 1], {extrapolateRight: 'clamp', easing: Easing.inOut(Easing.cubic)});
	// Trôi nhẹ để cảnh không đứng yên.
	const drift = interpolate(frame, [0, duration], [0, 1]);
	const cur0 = lerpView(from, to, camT);
	const cur = {...cur0, scale: cur0.scale * (1 + 0.035 * drift)};
	const proj = makeProjection(cur);
	const k = cur.scale / wider.scale;
	const c0 = base.proj(cur.center)!;
	const transform = `translate(${W / 2},${H / 2}) scale(${k}) translate(${-c0[0]},${-c0[1]})`;

	const fadeIn = (start: number, len = 18) => interpolate(frame, [start, start + len], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
	const regionsOpacity = fadeIn(from === to ? 4 : 20, 24);
	const labelSize = 30;

	return (
		<AbsoluteFill style={{background: C.sea}}>
			<svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
				<defs>
					<clipPath id="landclip">
						<path d={base.land} transform={transform} />
					</clipPath>
					<radialGradient id="vignette" cx="50%" cy="50%" r="75%">
						<stop offset="55%" stopColor="#000" stopOpacity={0} />
						<stop offset="100%" stopColor="#000" stopOpacity={0.65} />
					</radialGradient>
					<pattern id="seaLines" width="40" height="40" patternUnits="userSpaceOnUse">
						<path d="M0 20 Q10 16 20 20 T40 20" stroke="#1d3038" strokeWidth="1.2" fill="none" />
					</pattern>
				</defs>
				<rect width={W} height={H} fill={C.sea} />
				<rect width={W} height={H} fill="url(#seaLines)" opacity={0.5} />
				<g transform={transform}>
					<path d={base.land} fill={C.land} stroke={C.landEdge} strokeWidth={1.6} vectorEffect="non-scaling-stroke" />
				</g>
				<g clipPath="url(#landclip)" opacity={regionsOpacity}>
					<g transform={transform}>
						{base.regions.map((r) => (
							<path key={r.id} d={r.d} fill={REGIONS[r.id].color} fillOpacity={0.32} stroke={REGIONS[r.id].color} strokeWidth={2.5} strokeOpacity={0.9} strokeDasharray="10 6" vectorEffect="non-scaling-stroke" />
						))}
					</g>
				</g>
				{base.rivers ? (
					<g transform={transform}>
						<path d={base.rivers} fill="none" stroke={C.river} strokeWidth={k > 2 ? 3 : 1.6} strokeOpacity={0.85} vectorEffect="non-scaling-stroke" />
					</g>
				) : null}
				{v.regions.map((id, i) => {
					const r = REGIONS[id];
					const p = proj(r.label);
					if (!p || p[0] < 80 || p[0] > W - 80 || p[1] < 80 || p[1] > H - 80) return null;
					return (
						<text key={id} x={p[0]} y={p[1]} textAnchor="middle" fontFamily={fonts.serif} fontWeight={700} fontSize={id === 'daiviet' ? 40 : 34}
							fill={C.text} opacity={regionsOpacity * fadeIn(24 + i * 6)} style={{letterSpacing: 2, paintOrder: 'stroke'}} stroke="#000" strokeWidth={6} strokeOpacity={0.55}>
							{r.name.toUpperCase()}
						</text>
					);
				})}
				{v.arrows.map((a, i) => {
					const [fromId, toId] = a.path.split('>');
					const p1 = proj(PLACES[fromId].at)!;
					const p2 = proj(PLACES[toId].at)!;
					const dx = p2[0] - p1[0];
					const dy = p2[1] - p1[1];
					const len = Math.hypot(dx, dy);
					const bend = 0.18;
					const cx = (p1[0] + p2[0]) / 2 - dy * bend;
					const cy = (p1[1] + p2[1]) / 2 + dx * bend;
					const start = 26 + i * 16;
					const t = interpolate(frame, [start, start + 40], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic)});
					const approx = len * 1.08;
					// điểm đầu mũi tên
					const bx = (1 - t) * (1 - t) * p1[0] + 2 * (1 - t) * t * cx + t * t * p2[0];
					const by = (1 - t) * (1 - t) * p1[1] + 2 * (1 - t) * t * cy + t * t * p2[1];
					const tx = 2 * (1 - t) * (cx - p1[0]) + 2 * t * (p2[0] - cx);
					const ty = 2 * (1 - t) * (cy - p1[1]) + 2 * t * (p2[1] - cy);
					const ang = (Math.atan2(ty, tx) * 180) / Math.PI;
					const col = ARROW_COLORS[a.color] ?? C.mongol;
					return (
						<g key={i} opacity={t > 0 ? 1 : 0}>
							<path d={`M${p1[0]},${p1[1]} Q${cx},${cy} ${p2[0]},${p2[1]}`} fill="none" stroke="#000" strokeOpacity={0.45} strokeWidth={13}
								strokeDasharray={`${approx * t} ${approx}`} strokeLinecap="round" />
							<path d={`M${p1[0]},${p1[1]} Q${cx},${cy} ${p2[0]},${p2[1]}`} fill="none" stroke={col} strokeWidth={8}
								strokeDasharray={a.dashed ? undefined : `${approx * t} ${approx}`} strokeLinecap="round"
								style={a.dashed ? {strokeDasharray: `18 14`, clipPath: undefined} : undefined}
								opacity={a.dashed ? Math.min(1, t * 1.4) : 1} />
							<g transform={`translate(${bx},${by}) rotate(${ang})`}>
								<path d="M -6 -18 L 26 0 L -6 18 L 2 0 Z" fill={col} stroke="#000" strokeOpacity={0.4} strokeWidth={2} />
							</g>
						</g>
					);
				})}
				{v.markers.map((id, i) => {
					const pl = PLACES[id];
					const p = proj(pl.at);
					if (!p) return null;
					const o = fadeIn(14 + i * 8);
					const pulse = 1 + 0.25 * Math.sin((frame / 30) * Math.PI * 1.2);
					const side = pl.side ?? 'r';
					const lx = side === 'l' ? p[0] - 24 : side === 'r' ? p[0] + 24 : p[0];
					const ly = side === 't' ? p[1] - 26 : side === 'b' ? p[1] + 46 : p[1] + 10;
					const anchor = side === 'l' ? 'end' : side === 'r' ? 'start' : 'middle';
					return (
						<g key={id} opacity={o}>
							<circle cx={p[0]} cy={p[1]} r={16 * pulse} fill={C.gold} opacity={0.22} />
							<circle cx={p[0]} cy={p[1]} r={8} fill={C.gold} stroke="#000" strokeWidth={2.5} />
							<text x={lx} y={ly} textAnchor={anchor} fontFamily={fonts.sans} fontWeight={700} fontSize={labelSize} fill={C.text}
								stroke="#000" strokeWidth={7} strokeOpacity={0.7} style={{paintOrder: 'stroke'}}>
								{pl.name}
							</text>
						</g>
					);
				})}
				{v.labels.map((l, i) => {
					const p = proj(PLACES[l.at].at)!;
					const o = fadeIn(50 + i * 10);
					return (
						<g key={i} opacity={o} transform={`translate(${p[0]},${p[1] + (l.dy ?? -60)})`}>
							<rect x={-l.text.length * 9.5 - 20} y={-30} width={l.text.length * 19 + 40} height={52} rx={10} fill="#000" fillOpacity={0.62} stroke={C.gold} strokeOpacity={0.6} />
							<text textAnchor="middle" y={6} fontFamily={fonts.sans} fontWeight={600} fontSize={30} fill={C.goldSoft}>{l.text}</text>
						</g>
					);
				})}
				<rect width={W} height={H} fill="url(#vignette)" />
			</svg>
			{v.year ? (
				<div style={{position: 'absolute', right: 70, top: 56, fontFamily: fonts.serif, fontWeight: 700, fontSize: 64, color: C.goldSoft,
					textShadow: '0 4px 18px #000', opacity: fadeIn(6, 20)}}>
					{v.year}
				</div>
			) : null}
			{v.note ? (
				<div style={{position: 'absolute', left: 40, bottom: 18, fontFamily: fonts.sans, fontSize: 20, color: C.textDim, opacity: 0.8}}>
					Bản đồ minh họa · ranh giới và vị trí gần đúng · nền bản đồ: Natural Earth
				</div>
			) : null}
		</AbsoluteFill>
	);
};
