import React from 'react';
import {AbsoluteFill, Easing, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {C, fonts, H, W} from '../lib/theme';
import geo from '../../public/video04/maps/geo.json';

// Bản đồ động video 4 (Điện Biên Phủ): nền địa hình thật (DEM Terrarium) + lớp hiệu ứng SVG.
// Toạ độ là pixel trên ảnh nền (geo.json do data/video04/geo_prep.py tạo).

const FR = '#5b8fd6'; // phía Pháp
const VN = '#d64034'; // phía Việt Nam
const GOLD = '#e8c77a';

type Base = 'region' | 'valley';
type Pt = [number, number];
type Cam = {t: number; at: Pt | string; w: number};
type El =
	| {k: 'marker'; at: string; label: string; sub?: string; color?: string; t0: number; pulse?: boolean; dx?: number; dy?: number}
	| {k: 'fort'; at: string; fr: string; vi: string; t0: number; fall?: number; dx?: number; dy?: number}
	| {k: 'line'; pts: string[]; color: string; t0: number; t1: number; dashed?: boolean; dots?: boolean; width?: number; label?: string; lx?: number; ly?: number}
	| {k: 'ring'; t0: number; flashes?: boolean; r?: number}
	| {k: 'chutes'; at: string; t0: number; spread?: number; n?: number; miss?: number}
	| {k: 'airstrip'; a: string; b: string; t0: number; closed?: number}
	| {k: 'title'; text: string; sub?: string; t0: number}
	| {k: 'date'; text: string; t0: number; t1?: number}
	| {k: 'perimeter'; t0: number; t1: number; from: number; to: number}
	| {k: 'boom'; at: string; t: number}
	| {k: 'country'; name: string; t0: number; color: string}
	| {k: 'label'; at: string; text: string; t0: number; size?: number; color?: string}
	| {k: 'strike'; t0: number; t1: number; to: string; cross?: number};

type Scene = {base: Base; cam: Cam[]; els: El[]; schematic?: boolean};

const R = geo.region.places as unknown as Record<string, Pt>;
const V = geo.valley.places as unknown as Record<string, Pt>;

const S: Record<string, Scene> = {
	map_indochina: {
		base: 'region',
		cam: [{t: 0, at: [640, 900], w: 1250}, {t: 1, at: [560, 520], w: 900}],
		els: [
			{k: 'country', name: 'Vietnam', t0: 0.05, color: '#d6403433'},
			{k: 'country', name: 'Laos', t0: 0.2, color: '#e8c77a22'},
			{k: 'label', at: 'laos_lbl', text: 'LÀO', t0: 0.2, size: 40},
			{k: 'label', at: 'china_lbl', text: 'TRUNG QUỐC', t0: 0.1, size: 30, color: C.textDim},
			{k: 'label', at: 'thai_lbl', text: 'THÁI LAN', t0: 0.1, size: 30, color: C.textDim},
			{k: 'label', at: 'gulf_lbl', text: 'Vịnh Bắc Bộ', t0: 0.1, size: 26, color: '#8fb3c0'},
			{k: 'marker', at: 'hanoi', label: 'Hà Nội', t0: 0.15},
			{k: 'marker', at: 'luang', label: 'Luang Prabang', t0: 0.35, dx: -10},
			{k: 'line', pts: ['vietbac', 'laichau', 'luang'], color: VN, t0: 0.45, t1: 0.85, dashed: true, label: 'Chủ lực Việt Minh đe dọa Lào (sơ đồ)'},
		],
	},
	map_indochina_dbp: {
		base: 'region',
		cam: [{t: 0, at: [560, 520], w: 900}, {t: 0.5, at: 'dbp', w: 520}, {t: 1, at: 'dbp', w: 470}],
		els: [
			{k: 'country', name: 'Vietnam', t0: 0, color: '#d6403322'},
			{k: 'marker', at: 'hanoi', label: 'Hà Nội', t0: 0},
			{k: 'label', at: 'laos_lbl', text: 'LÀO', t0: 0, size: 34},
			{k: 'line', pts: ['hanoi', 'dbp'], color: FR, t0: 0.3, t1: 0.6, dashed: true, label: 'Tiếp tế bằng máy bay'},
			{k: 'marker', at: 'dbp', label: 'Điện Biên Phủ', sub: '"Con nhím" giữa núi rừng', color: FR, t0: 0.45, pulse: true},
		],
	},
	map_nasan: {
		base: 'region',
		cam: [{t: 0, at: 'nasan', w: 560}, {t: 1, at: [455, 300], w: 520}],
		els: [
			{k: 'marker', at: 'hanoi', label: 'Hà Nội', t0: 0},
			{k: 'marker', at: 'nasan', label: 'Nà Sản', sub: 'cuối 1952', color: FR, t0: 0.05, pulse: true},
			{k: 'marker', at: 'dbp', label: 'Điện Biên Phủ', sub: '1953–1954', color: FR, t0: 0.5},
			{k: 'line', pts: ['nasan', 'dbp'], color: GOLD, t0: 0.55, t1: 0.8, dashed: true},
		],
	},
	map_valley_intro: {
		base: 'valley',
		schematic: true,
		cam: [{t: 0, at: 'center', w: 1500}, {t: 1, at: 'center', w: 1050}],
		els: [
			{k: 'title', text: 'Lòng chảo Mường Thanh', sub: 'Địa hình thật, nhìn từ trên xuống', t0: 0.02},
			{k: 'chutes', at: 'air_n', t0: 0.05, n: 14, spread: 160},
			{k: 'airstrip', a: 'air_n', b: 'air_s', t0: 0.3},
			{k: 'airstrip', a: 'hc_air_n', b: 'hc_air_s', t0: 0.45},
			{k: 'label', at: 'air_n', text: 'Sân bay Mường Thanh', t0: 0.32, size: 26, color: GOLD},
			{k: 'label', at: 'hongcum', text: 'Sân bay Hồng Cúm', t0: 0.47, size: 26, color: GOLD},
		],
	},
	map_valley_forts: {
		base: 'valley',
		schematic: true,
		cam: [{t: 0, at: 'center', w: 1300}, {t: 1, at: [790, 1000], w: 1150}],
		els: [
			{k: 'airstrip', a: 'air_n', b: 'air_s', t0: 0},
			{k: 'airstrip', a: 'hc_air_n', b: 'hc_air_s', t0: 0},
			{k: 'fort', at: 'himlam', fr: 'Béatrice', vi: 'Him Lam', t0: 0.08},
			{k: 'fort', at: 'doclap', fr: 'Gabrielle', vi: 'Độc Lập', t0: 0.14},
			{k: 'fort', at: 'banke', fr: 'Anne-Marie', vi: 'Bản Kéo', t0: 0.2, dx: -1},
			{k: 'fort', at: 'center', fr: 'Sở chỉ huy', vi: 'Trung tâm', t0: 0.28, dx: -1},
			{k: 'fort', at: 'a1', fr: 'Eliane 2', vi: 'Đồi A1', t0: 0.36},
			{k: 'fort', at: 'hongcum', fr: 'Isabelle', vi: 'Hồng Cúm', t0: 0.44},
		],
	},
	map_valley_ring: {
		base: 'valley',
		schematic: true,
		cam: [{t: 0, at: 'center', w: 1250}, {t: 1, at: 'center', w: 1500}],
		els: [
			{k: 'airstrip', a: 'air_n', b: 'air_s', t0: 0},
			{k: 'fort', at: 'center', fr: '', vi: 'Quân Pháp (đáy bát)', t0: 0, dx: -1},
			{k: 'fort', at: 'himlam', fr: '', vi: '', t0: 0},
			{k: 'fort', at: 'doclap', fr: '', vi: '', t0: 0},
			{k: 'fort', at: 'a1', fr: '', vi: '', t0: 0},
			{k: 'fort', at: 'hongcum', fr: '', vi: '', t0: 0},
			{k: 'ring', t0: 0.15, flashes: true},
			{k: 'title', text: 'Vành bát và đáy bát', sub: 'Pháo đặt trong hầm trên sườn núi (sơ đồ)', t0: 0.3},
		],
	},
	thumb_ring: {
		base: 'valley',
		cam: [{t: 0, at: [800, 1010], w: 780}, {t: 1, at: [800, 1010], w: 780}],
		els: [
			{k: 'perimeter', t0: 0, t1: 0.01, from: 200, to: 200},
			{k: 'airstrip', a: 'air_n', b: 'air_s', t0: 0},
			{k: 'ring', t0: 0, r: 24},
		],
	},
	map_strategy: {
		base: 'valley',
		schematic: true,
		cam: [{t: 0, at: 'center', w: 1350}, {t: 1, at: 'center', w: 1250}],
		els: [
			{k: 'fort', at: 'center', fr: '', vi: 'Trung tâm', t0: 0, dx: -1},
			{k: 'fort', at: 'himlam', fr: '', vi: 'Him Lam', t0: 0},
			{k: 'fort', at: 'doclap', fr: '', vi: 'Độc Lập', t0: 0},
			{k: 'fort', at: 'a1', fr: '', vi: 'A1', t0: 0},
			{k: 'fort', at: 'hongcum', fr: '', vi: 'Hồng Cúm', t0: 0},
			{k: 'strike', t0: 0.05, t1: 0.3, to: 'center', cross: 0.42},
			{k: 'date', text: 'Đánh nhanh, thắng nhanh → hoãn 26/1/1954', t0: 0.05, t1: 0.55},
			{k: 'date', text: 'Đánh chắc, tiến chắc: bóc từng lớp vỏ', t0: 0.55},
			{k: 'perimeter', t0: 0.6, t1: 1, from: 330, to: 190},
		],
	},
	map_supply: {
		base: 'region',
		cam: [{t: 0, at: [560, 420], w: 820}, {t: 1, at: [520, 380], w: 720}],
		els: [
			{k: 'marker', at: 'hanoi', label: 'Hà Nội', t0: 0, color: FR},
			{k: 'marker', at: 'dbp', label: 'Điện Biên Phủ', t0: 0, dx: -1},
			{k: 'line', pts: ['hanoi', 'dbp'], color: FR, t0: 0.08, t1: 0.35, dashed: true, dots: true, label: 'Pháp: đường không', lx: 120, ly: -40},
			{k: 'marker', at: 'tuangiao', label: 'Tuần Giáo', t0: 0.4, color: VN, dy: -1},
			{k: 'line', pts: ['thanhhoa', 'nasan', 'tuangiao', 'dbp'], color: VN, t0: 0.45, t1: 0.8, dots: true, width: 6, label: 'Việt Nam: đường bộ, dân công, xe đạp thồ (sơ đồ)', lx: -120, ly: 140},
			{k: 'line', pts: ['vietbac', 'tuangiao'], color: VN, t0: 0.55, t1: 0.85, dots: true, width: 6},
		],
	},
	map_airfield: {
		base: 'valley',
		schematic: true,
		cam: [{t: 0, at: 'air_n', w: 820}, {t: 1, at: [778, 960], w: 760}],
		els: [
			{k: 'airstrip', a: 'air_n', b: 'air_s', t0: 0, closed: 0.25},
			{k: 'ring', t0: 0, flashes: true},
			{k: 'chutes', at: 'center', t0: 0.4, n: 16, spread: 240, miss: 0.5},
			{k: 'date', text: 'Sân bay bị khóa → chỉ còn thả dù', t0: 0.3},
		],
	},
	map_phase1: {
		base: 'valley',
		schematic: true,
		cam: [{t: 0, at: [800, 920], w: 950}, {t: 1, at: [790, 900], w: 880}],
		els: [
			{k: 'airstrip', a: 'air_n', b: 'air_s', t0: 0, closed: 0.6},
			{k: 'fort', at: 'center', fr: '', vi: 'Trung tâm', t0: 0, dx: -1},
			{k: 'fort', at: 'himlam', fr: 'Béatrice', vi: 'Him Lam · 13/3', t0: 0, fall: 0.2},
			{k: 'fort', at: 'doclap', fr: 'Gabrielle', vi: 'Độc Lập · 15/3', t0: 0, fall: 0.45},
			{k: 'fort', at: 'banke', fr: 'Anne-Marie', vi: 'Bản Kéo · 17/3', t0: 0, fall: 0.7, dx: -1},
			{k: 'date', text: 'Đợt 1: 13/3 – 17/3/1954', t0: 0.02},
		],
	},
	map_phase2: {
		base: 'valley',
		schematic: true,
		cam: [{t: 0, at: [800, 990], w: 800}, {t: 1, at: 'a1', w: 650}],
		els: [
			{k: 'fort', at: 'center', fr: '', vi: 'Trung tâm', t0: 0, dx: -1},
			{k: 'fort', at: 'd1', fr: 'Dominique 2', vi: 'D1', t0: 0.05, fall: 0.35},
			{k: 'fort', at: 'c1', fr: 'Eliane 1', vi: 'C1', t0: 0.1, fall: 0.85},
			{k: 'fort', at: 'a1', fr: 'Eliane 2', vi: 'A1', t0: 0.15},
			{k: 'date', text: 'Đợt 2: 30/3 – cuối tháng 4/1954', t0: 0.02},
		],
	},
	map_trench: {
		base: 'valley',
		schematic: true,
		cam: [{t: 0, at: 'center', w: 950}, {t: 1, at: 'center', w: 800}],
		els: [
			{k: 'airstrip', a: 'air_n', b: 'air_s', t0: 0, closed: 0},
			{k: 'fort', at: 'center', fr: '', vi: 'Vùng Pháp còn giữ', t0: 0, dx: -1},
			{k: 'perimeter', t0: 0.05, t1: 0.95, from: 380, to: 170},
			{k: 'date', text: 'Tháng 4/1954: hào siết dần', t0: 0.02},
		],
	},
	map_a1: {
		base: 'valley',
		schematic: true,
		cam: [{t: 0, at: 'a1', w: 700}, {t: 1, at: 'a1', w: 520}],
		els: [
			{k: 'fort', at: 'a1', fr: 'Eliane 2', vi: 'Đồi A1', t0: 0, fall: 0.62},
			{k: 'fort', at: 'center', fr: '', vi: 'Trung tâm', t0: 0, dx: -1},
			{k: 'boom', at: 'a1', t: 0.6},
			{k: 'date', text: '20:30, ngày 6/5/1954', t0: 0.55},
		],
	},
	map_cost: {
		base: 'region',
		cam: [{t: 0, at: 'dbp', w: 600}, {t: 1, at: [500, 300], w: 620}],
		els: [
			{k: 'marker', at: 'dbp', label: 'Điện Biên Phủ', t0: 0},
			{k: 'marker', at: 'hanoi', label: 'Hà Nội', t0: 0},
			{k: 'line', pts: ['dbp', 'tuangiao', 'camps'], color: GOLD, t0: 0.15, t1: 0.7, dashed: true, label: 'Tù binh đi bộ khoảng 600 km (hướng đi sơ đồ)'},
		],
	},
	map_geneva: {
		base: 'region',
		cam: [{t: 0, at: 'hanoi', w: 1100}, {t: 0.45, at: [800, 900], w: 1100}, {t: 1, at: [700, 1250], w: 1150}],
		els: [
			{k: 'country', name: 'Vietnam', t0: 0, color: '#e8c77a22'},
			{k: 'marker', at: 'hanoi', label: 'Hà Nội', t0: 0.05},
			{k: 'marker', at: 'saigon', label: 'Sài Gòn', t0: 0.1},
			{k: 'line', pts: ['p17w', 'p17e'], color: VN, t0: 0.3, t1: 0.5, width: 12, label: 'Vĩ tuyến 17 · Hiệp định Genève 21/7/1954', lx: -260, ly: -36},
		],
	},
};

const P = (base: Base, at: string | Pt): Pt => (typeof at === 'string' ? (base === 'region' ? R : V)[at] : at);
const ease = Easing.inOut(Easing.cubic);
const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

const camAt = (sc: Scene, p: number) => {
	const c = sc.cam;
	let i = 0;
	while (i < c.length - 2 && p > c[i + 1].t) i++;
	const a = c[i], b = c[Math.min(i + 1, c.length - 1)];
	const u = b.t === a.t ? 1 : ease(Math.min(1, Math.max(0, (p - a.t) / (b.t - a.t))));
	const pa = P(sc.base, a.at), pb = P(sc.base, b.at);
	return {x: pa[0] + (pb[0] - pa[0]) * u, y: pa[1] + (pb[1] - pa[1]) * u, w: a.w + (b.w - a.w) * u};
};

const polyLen = (pts: Pt[]) => pts.slice(1).reduce((s, p, i) => s + Math.hypot(p[0] - pts[i][0], p[1] - pts[i][1]), 0);
const pointAlong = (pts: Pt[], d: number): Pt => {
	for (let i = 1; i < pts.length; i++) {
		const l = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]);
		if (d <= l) return [pts[i - 1][0] + (pts[i][0] - pts[i - 1][0]) * (d / l), pts[i - 1][1] + (pts[i][1] - pts[i - 1][1]) * (d / l)];
		d -= l;
	}
	return pts[pts.length - 1];
};

export const MapDBP: React.FC<{scene: string}> = ({scene}) => {
	const frame = useCurrentFrame();
	const {durationInFrames, fps} = useVideoConfig();
	const sc = S[scene] ?? S.map_indochina;
	const p = frame / Math.max(1, durationInFrames - 1);
	const g = sc.base === 'region' ? geo.region : geo.valley;
	const cam = camAt(sc, p);
	const k = W / cam.w; // pixel ảnh nền -> pixel màn hình
	const inv = 1 / k; // để nét/chữ giữ cỡ cố định trên màn hình
	const tf = `translate(${W / 2}px, ${H / 2}px) scale(${k}) translate(${-cam.x}px, ${-cam.y}px)`;
	const fadeAt = (t0: number, len = 0.06) => interpolate(p, [t0, t0 + len], [0, 1], clamp);
	const sec = frame / fps;

	const label = (x: number, y: number, text: string, size: number, color: string, anchor: 'start' | 'middle' | 'end' = 'middle', op = 1, weight = 800) => (
		<text x={x} y={y} fontFamily={fonts.sans} fontWeight={weight} fontSize={size * inv} fill={color} textAnchor={anchor} opacity={op}
			stroke="#0b0a08" strokeWidth={size * inv * 0.22} paintOrder="stroke" strokeLinejoin="round">{text}</text>
	);

	const els = sc.els.map((el, i) => {
		switch (el.k) {
			case 'country':
				return <path key={i} d={(geo.region.countries as Record<string, string>)[el.name]} fill={el.color} stroke={GOLD} strokeWidth={2.2 * inv} strokeOpacity={0.55} opacity={fadeAt(el.t0, 0.1)} />;
			case 'label': {
				const [x, y] = P(sc.base, el.at);
				return <g key={i}>{label(x, y, el.text, el.size ?? 28, el.color ?? C.text, 'middle', fadeAt(el.t0))}</g>;
			}
			case 'marker': {
				const [x, y] = P(sc.base, el.at);
				const op = fadeAt(el.t0);
				const col = el.color ?? GOLD;
				const pr = el.pulse ? ((sec * 0.8) % 1) : 0;
				const left = (el.dx ?? 1) < 0;
				return (
					<g key={i} opacity={op}>
						{el.pulse && <circle cx={x} cy={y} r={(14 + 40 * pr) * inv} fill="none" stroke={col} strokeWidth={4 * inv} opacity={1 - pr} />}
						<circle cx={x} cy={y} r={11 * inv} fill={col} stroke="#0b0a08" strokeWidth={3 * inv} />
						{label(x + (left ? -22 : 22) * inv, y + ((el.dy ?? 0) < 0 ? -18 : 10) * inv, el.label, 34, C.text, left ? 'end' : 'start')}
						{el.sub && label(x + (left ? -22 : 22) * inv, y + 46 * inv, el.sub, 24, GOLD, left ? 'end' : 'start', 1, 600)}
					</g>
				);
			}
			case 'fort': {
				const [x, y] = P(sc.base, el.at);
				const op = fadeAt(el.t0);
				const fell = el.fall !== undefined ? interpolate(p, [el.fall, el.fall + 0.04], [0, 1], clamp) : 0;
				const col = fell > 0.5 ? VN : FR;
				const left = (el.dx ?? 1) < 0;
				const flash = el.fall !== undefined ? interpolate(p, [el.fall - 0.03, el.fall, el.fall + 0.06], [0, 1, 0], clamp) : 0;
				return (
					<g key={i} opacity={op}>
						{flash > 0 && <circle cx={x} cy={y} r={(20 + 50 * flash) * inv} fill={VN} opacity={0.5 * flash} />}
						<rect x={x - 12 * inv} y={y - 12 * inv} width={24 * inv} height={24 * inv} transform={`rotate(45 ${x} ${y})`} fill={col} stroke="#0b0a08" strokeWidth={3 * inv} />
						{el.vi && label(x + (left ? -24 : 24) * inv, y + 4 * inv, el.vi, 32, C.text, left ? 'end' : 'start')}
						{el.fr && label(x + (left ? -24 : 24) * inv, y + 36 * inv, el.fr, 24, '#a9c4ea', left ? 'end' : 'start', 1, 600)}
					</g>
				);
			}
			case 'line': {
				const pts = el.pts.map((s) => P(sc.base, s));
				const L = polyLen(pts);
				const u = interpolate(p, [el.t0, el.t1], [0, 1], {...clamp, easing: ease});
				const d = 'M' + pts.map((q) => q.join(',')).join('L');
				const wdt = (el.width ?? 5) * inv;
				const head = pointAlong(pts, L * u);
				const nd = 7;
				const mid = pointAlong(pts, L * 0.5);
				return (
					<g key={i} opacity={fadeAt(el.t0, 0.02)}>
						<path d={d} fill="none" stroke="#0b0a08" strokeOpacity={0.55} strokeWidth={wdt * 2.2} strokeDasharray={`${L * u} ${L}`} strokeLinecap="round" />
						<path d={d} fill="none" stroke={el.color} strokeWidth={wdt} strokeLinecap="round" strokeDasharray={el.dashed ? undefined : `${L * u} ${L}`}
							style={el.dashed ? {strokeDasharray: `${18 * inv} ${12 * inv}`, clipPath: undefined} : undefined} opacity={el.dashed ? 0.95 : 1}
							mask={el.dashed ? `url(#m${i})` : undefined} />
						{el.dashed && (
							<mask id={`m${i}`} maskUnits="userSpaceOnUse" x={0} y={0} width={g.w} height={g.h}>
								<path d={d} fill="none" stroke="#fff" strokeWidth={wdt * 3} strokeDasharray={`${L * u} ${L}`} />
							</mask>
						)}
						{u > 0 && u < 1 && <circle cx={head[0]} cy={head[1]} r={wdt * 1.4} fill={el.color} />}
						{el.dots && u >= 1 && Array.from({length: nd}).map((_, j) => {
							const q = pointAlong(pts, (L * ((j / nd + sec * 0.12) % 1)));
							return <circle key={j} cx={q[0]} cy={q[1]} r={wdt * 0.9} fill="#fff" opacity={0.85} />;
						})}
						{el.label && label(mid[0] + (el.lx ?? 0) * inv, mid[1] + (el.ly ?? -26) * inv, el.label, 28, el.color === FR ? '#bcd3f5' : el.color === VN ? '#ffb4a8' : GOLD, 'middle', interpolate(p, [el.t1 - 0.05, el.t1 + 0.03], [0, 1], clamp))}
					</g>
				);
			}
			case 'ring': {
				const op = fadeAt(el.t0, 0.15);
				const ring = geo.valley.ring as unknown as Pt[];
				return (
					<g key={i} opacity={op}>
						{ring.map(([x, y], j) => {
							const ph = ((sec * 0.9 + j * 0.37) % 1);
							const fl = el.flashes && ph < 0.12 ? 1 - ph / 0.12 : 0;
							return (
								<g key={j}>
									{fl > 0 && <circle cx={x} cy={y} r={(el.r ?? 10) * 3 * inv * (1 + fl)} fill="#ffcf70" opacity={0.6 * fl} />}
									<circle cx={x} cy={y} r={(el.r ?? 10) * inv} fill={VN} stroke="#0b0a08" strokeWidth={3 * inv} />
								</g>
							);
						})}
					</g>
				);
			}
			case 'chutes': {
				const [cx, cy] = P(sc.base, el.at);
				const n = el.n ?? 10, sp = el.spread ?? 150;
				return (
					<g key={i}>
						{Array.from({length: n}).map((_, j) => {
							const r1 = Math.sin(j * 12.9898) * 43758.5453, rx = r1 - Math.floor(r1);
							const r2 = Math.sin(j * 78.233) * 12543.123, ry = r2 - Math.floor(r2);
							const miss = el.miss && rx < el.miss ? 1.9 : 1;
							const start = el.t0 + (j / n) * 0.35;
							const u = interpolate(p, [start, start + 0.3], [0, 1], clamp);
							if (u <= 0) return null;
							const x = cx + (rx - 0.5) * sp * 2 * miss;
							const y = cy + (ry - 0.5) * sp * 1.4 * miss - (1 - u) * 260;
							const s = (0.55 + 0.45 * u) * inv;
							const col = miss > 1 && u >= 1 ? VN : '#f3ead6';
							return (
								<g key={j} transform={`translate(${x} ${y}) scale(${s})`} opacity={u < 1 ? 0.95 : 0.8}>
									<path d="M-22,0 Q0,-30 22,0 Z" fill={col} stroke="#0b0a08" strokeWidth={3} />
									<path d="M-22,0 L0,26 L22,0" fill="none" stroke="#0b0a08" strokeWidth={2} />
									<rect x={-6} y={24} width={12} height={10} fill="#6b5a3a" />
								</g>
							);
						})}
					</g>
				);
			}
			case 'airstrip': {
				const [ax, ay] = P(sc.base, el.a), [bx, by] = P(sc.base, el.b);
				const cl = el.closed !== undefined ? fadeAt(el.closed, 0.05) : 0;
				const mx = (ax + bx) / 2, my = (ay + by) / 2;
				return (
					<g key={i} opacity={fadeAt(el.t0)}>
						<line x1={ax} y1={ay} x2={bx} y2={by} stroke="#0b0a08" strokeWidth={22 * inv} strokeLinecap="round" />
						<line x1={ax} y1={ay} x2={bx} y2={by} stroke="#d9cfb5" strokeWidth={14 * inv} strokeLinecap="round" />
						<line x1={ax} y1={ay} x2={bx} y2={by} stroke="#0b0a08" strokeWidth={2 * inv} strokeDasharray={`${10 * inv} ${10 * inv}`} />
						{cl > 0 && (
							<g opacity={cl}>
								<line x1={mx - 40 * inv} y1={my - 40 * inv} x2={mx + 40 * inv} y2={my + 40 * inv} stroke={VN} strokeWidth={12 * inv} strokeLinecap="round" />
								<line x1={mx + 40 * inv} y1={my - 40 * inv} x2={mx - 40 * inv} y2={my + 40 * inv} stroke={VN} strokeWidth={12 * inv} strokeLinecap="round" />
							</g>
						)}
					</g>
				);
			}
			case 'perimeter': {
				const [cx, cy] = V.center;
				const r = interpolate(p, [el.t0, el.t1], [el.from, el.to], {...clamp, easing: ease});
				const pts = Array.from({length: 48}).map((_, j) => {
					const a = (j / 48) * Math.PI * 2;
					const wob = 1 + 0.12 * Math.sin(a * 3 + 1) + 0.06 * Math.sin(a * 7);
					return [cx + Math.cos(a) * r * wob * 0.8, cy + Math.sin(a) * r * wob * 1.15];
				});
				const d = 'M' + pts.map((q) => q.join(',')).join('L') + 'Z';
				return (
					<g key={i} opacity={fadeAt(el.t0)}>
						<path d={d} fill={FR} fillOpacity={0.16} stroke={FR} strokeWidth={4 * inv} />
						<path d={d} fill="none" stroke={VN} strokeWidth={6 * inv} strokeDasharray={`${14 * inv} ${8 * inv}`} transform={`translate(${cx} ${cy}) scale(1.06) translate(${-cx} ${-cy})`} />
					</g>
				);
			}
			case 'strike': {
				const [tx, ty] = P(sc.base, el.to);
				const sx = tx + 520, sy = ty - 300;
				const u = interpolate(p, [el.t0, el.t1], [0, 1], {...clamp, easing: ease});
				const cr = el.cross !== undefined ? fadeAt(el.cross, 0.05) : 0;
				const ex = sx + (tx - sx) * u, ey = sy + (ty - sy) * u;
				return (
					<g key={i} opacity={1 - interpolate(p, [0.55, 0.62], [0, 1], clamp)}>
						<line x1={sx} y1={sy} x2={ex} y2={ey} stroke={VN} strokeWidth={14 * inv} strokeLinecap="round" />
						<circle cx={ex} cy={ey} r={16 * inv} fill={VN} />
						{cr > 0 && (
							<g opacity={cr} stroke="#f3ead6" strokeWidth={14 * inv} strokeLinecap="round">
								<line x1={(sx + tx) / 2 - 60 * inv} y1={(sy + ty) / 2 - 60 * inv} x2={(sx + tx) / 2 + 60 * inv} y2={(sy + ty) / 2 + 60 * inv} />
								<line x1={(sx + tx) / 2 + 60 * inv} y1={(sy + ty) / 2 - 60 * inv} x2={(sx + tx) / 2 - 60 * inv} y2={(sy + ty) / 2 + 60 * inv} />
							</g>
						)}
					</g>
				);
			}
			case 'boom': {
				const [x, y] = P(sc.base, el.at);
				const u = interpolate(p, [el.t, el.t + 0.12], [0, 1], clamp);
				if (u <= 0) return null;
				return (
					<g key={i}>
						<circle cx={x} cy={y} r={(30 + 220 * u) * inv} fill="#ffcf70" opacity={0.75 * (1 - u)} />
						<circle cx={x} cy={y} r={(20 + 120 * u) * inv} fill="#ff7a3a" opacity={0.9 * (1 - u)} />
						<circle cx={x} cy={y} r={(40 + 320 * u) * inv} fill="none" stroke="#fff" strokeWidth={6 * inv} opacity={1 - u} />
					</g>
				);
			}
			default:
				return null;
		}
	});

	// Lớp chữ cố định trên màn hình (không co giãn theo camera)
	const hud = sc.els.map((el, i) => {
		if (el.k === 'title') {
			const op = fadeAt(el.t0, 0.08) * (1 - interpolate(p, [0.8, 0.9], [0, 1], clamp));
			return (
				<div key={i} style={{position: 'absolute', left: 80, top: 210, opacity: op, transform: `translateY(${(1 - fadeAt(el.t0, 0.08)) * 20}px)`}}>
					<div style={{fontFamily: fonts.sans, fontWeight: 900, fontSize: 56, color: GOLD, textShadow: '0 3px 12px #000'}}>{el.text}</div>
					{el.sub && <div style={{fontFamily: fonts.sans, fontWeight: 600, fontSize: 30, color: C.text, marginTop: 6, textShadow: '0 2px 8px #000'}}>{el.sub}</div>}
				</div>
			);
		}
		if (el.k === 'date') {
			const op = fadeAt(el.t0, 0.05) * (el.t1 !== undefined ? 1 - interpolate(p, [el.t1 - 0.04, el.t1], [0, 1], clamp) : 1);
			return (
				<div key={i} style={{position: 'absolute', left: 80, top: 130, opacity: op, padding: '12px 26px', background: 'rgba(10,10,12,0.82)', borderLeft: `8px solid ${VN}`,
					fontFamily: fonts.sans, fontWeight: 800, fontSize: 40, color: '#fff'}}>{el.text}</div>
			);
		}
		return null;
	});

	return (
		<AbsoluteFill style={{background: '#0d0f0c', overflow: 'hidden'}}>
			<div style={{position: 'absolute', left: 0, top: 0, width: g.w, height: g.h, transformOrigin: '0 0', transform: tf}}>
				<Img src={staticFile(`video04/maps/${sc.base}.jpg`)} style={{position: 'absolute', width: g.w, height: g.h}} />
				<svg width={g.w} height={g.h} viewBox={`0 0 ${g.w} ${g.h}`} style={{position: 'absolute', overflow: 'visible'}}>
					{sc.base === 'valley' && (
						<>
							<path d={geo.valley.river} fill="none" stroke="#0b0a08" strokeOpacity={0.5} strokeWidth={9 * inv} />
							<path d={geo.valley.river} fill="none" stroke="#5f9fb3" strokeWidth={5 * inv} />
							{label(V.river_lbl[0] + 20 * inv, V.river_lbl[1], 'Sông Nậm Rốm', 22, '#9fd0de', 'start', 0.9, 600)}
						</>
					)}
					{els}
				</svg>
			</div>
			<AbsoluteFill style={{background: 'radial-gradient(ellipse at center, rgba(0,0,0,0) 55%, rgba(0,0,0,0.55) 100%)'}} />
			{hud}
			{sc.schematic && (
				<div style={{position: 'absolute', right: 60, bottom: 160, fontFamily: fonts.sans, fontWeight: 600, fontSize: 24, color: C.textDim, background: 'rgba(10,10,12,0.6)', padding: '6px 14px'}}>
					Sơ đồ · vị trí gần đúng · địa hình: dữ liệu DEM mở (AWS Terrain Tiles)
				</div>
			)}
			{sc.base === 'region' && (
				<div style={{position: 'absolute', right: 60, bottom: 160, fontFamily: fonts.sans, fontWeight: 600, fontSize: 22, color: C.textDim, background: 'rgba(10,10,12,0.6)', padding: '6px 14px'}}>
					Bản đồ kênh tự vẽ · biên giới hiện nay (Natural Earth) · sơ đồ
				</div>
			)}
		</AbsoluteFill>
	);
};

export const MAP_SCENES = Object.keys(S);
