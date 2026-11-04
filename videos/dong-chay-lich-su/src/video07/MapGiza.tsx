import React from 'react';
import {AbsoluteFill, Easing, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {C, fonts, H, W} from '../lib/theme';
import geo from '../../public/video07/maps/geo.json';

// Bản đồ + sơ đồ động video 7 (Kim tự tháp Giza / Nhật ký của Merer).
// Nền địa hình thật (DEM Terrarium) + sông Nile (Natural Earth); toạ độ là pixel ảnh nền (geo.json do data/video07/geo_prep.py tạo).
// Cấu trúc giống MapDBP (video 4): mỗi cảnh = nền + camera + danh sách phần tử theo tiến độ p (0..1).

const GOLD = '#e8c77a';
const RED = '#d64034';
const NILE = '#5fa8c4';
const STONE = '#efe6d2';

type Base = 'egypt' | 'giza' | 'none';
type Pt = [number, number];
type Cam = {t: number; at: Pt | string; w: number};
type El =
	| {k: 'marker'; at: string; label: string; sub?: string; color?: string; t0: number; pulse?: boolean; dx?: number; dy?: number}
	| {k: 'pyramid'; at: string; label?: string; t0: number; s?: number; dx?: number}
	| {k: 'line'; pts: (string | Pt)[]; color: string; t0: number; t1: number; dashed?: boolean; dots?: boolean; width?: number; label?: string; lx?: number; ly?: number}
	| {k: 'boat'; pts: (string | Pt)[]; t0: number; t1: number; back?: number; empty?: boolean; vis?: [number, number]}
	| {k: 'label'; at: string | Pt; text: string; t0: number; size?: number; color?: string}
	| {k: 'area'; at: string | Pt; r: number; t0: number; color?: string}
	| {k: 'title'; text: string; sub?: string; t0: number}
	| {k: 'date'; text: string; t0: number; t1?: number}
	| {k: 'days'; t0: number; items: {t: number; text: string; sub?: string}[]}
	| {k: 'country'; t0: number};

type Scene = {base: Base; cam: Cam[]; els: El[]; note?: string; diagram?: 'ramps' | 'workers' | 'papyrus' | 'timeline'};

const E = geo.egypt.places as unknown as Record<string, Pt>;
const G = geo.giza.places as unknown as Record<string, Pt>;

// Đường thuyền Tura → Giza (sơ đồ; lòng sông cổ khác ngày nay)
const ROUTE: (string | Pt)[] = ['tura_q', 'tura', [690, 700], 'nile_e', 'nile_w', [450, 610], 'basin', [340, 568]];
const ROUTE_BACK: (string | Pt)[] = [...ROUTE].reverse();

const S: Record<string, Scene> = {
	map_egypt: {
		base: 'egypt',
		cam: [{t: 0, at: [1350, 1350], w: 2300}, {t: 1, at: [1380, 1050], w: 1500}],
		els: [
			{k: 'country', t0: 0.05},
			{k: 'label', at: 'med_lbl', text: 'Địa Trung Hải', t0: 0.1, size: 34, color: '#8fb8c8'},
			{k: 'label', at: 'red_lbl', text: 'Biển Đỏ', t0: 0.15, size: 34, color: '#8fb8c8'},
			{k: 'label', at: 'sinai_lbl', text: 'SINAI', t0: 0.2, size: 30, color: C.textDim},
			{k: 'label', at: 'desert_lbl', text: 'SA MẠC PHÍA TÂY', t0: 0.2, size: 30, color: C.textDim},
			{k: 'label', at: 'delta_lbl', text: 'Châu thổ', t0: 0.25, size: 26, color: '#a9d3a0'},
			{k: 'marker', at: 'aswan', label: 'Aswan', t0: 0.3, dx: 1},
			{k: 'marker', at: 'giza', label: 'Giza', sub: 'Kim tự tháp Khufu', color: RED, t0: 0.45, pulse: true, dx: -1},
			{k: 'date', text: 'Ai Cập · khoảng 2560 TCN · triều vua Khufu', t0: 0.05},
		],
	},
	map_jarf: {
		base: 'egypt',
		cam: [{t: 0, at: 'giza', w: 900}, {t: 0.55, at: [1500, 1040], w: 1050}, {t: 1, at: [1520, 1050], w: 1000}],
		els: [
			{k: 'marker', at: 'giza', label: 'Giza', color: RED, t0: 0, dx: -1},
			{k: 'label', at: 'suez_lbl', text: 'Vịnh Suez', t0: 0.1, size: 28, color: '#8fb8c8'},
			{k: 'line', pts: ['giza', 'giza_road', 'jarf'], color: GOLD, t0: 0.15, t1: 0.5, dashed: true, label: 'Đường bộ qua sa mạc (sơ đồ)', lx: -40, ly: -34},
			{k: 'marker', at: 'jarf', label: 'Wadi al-Jarf', sub: 'Nơi tìm thấy papyrus · 2013', color: GOLD, t0: 0.45, pulse: true, dx: -1, dy: 1},
			{k: 'line', pts: ['jarf', [1650, 1150], 'maghara'], color: NILE, t0: 0.6, t1: 0.85, dashed: true, label: 'Vượt biển sang Sinai', lx: 0, ly: -30},
			{k: 'marker', at: 'maghara', label: 'Wadi Maghara', sub: 'Mỏ đồng, ngọc lam', t0: 0.82, dx: 1},
		],
		note: 'Bản đồ kênh tự vẽ · vị trí gần đúng · biên giới hiện nay (Natural Earth)',
	},
	map_aswan: {
		base: 'egypt',
		cam: [{t: 0, at: 'aswan', w: 900}, {t: 0.7, at: [1450, 1500], w: 1700}, {t: 1, at: [1430, 1450], w: 1700}],
		els: [
			{k: 'marker', at: 'aswan', label: 'Aswan', sub: 'Đá granite đỏ', color: RED, t0: 0, pulse: true},
			{k: 'marker', at: 'luxor', label: 'Luxor', t0: 0.2, color: C.textDim},
			{k: 'marker', at: 'giza', label: 'Giza', t0: 0.1, dx: -1},
			{k: 'line', pts: geo.egypt.route_aswan as unknown as Pt[], color: RED, t0: 0.15, t1: 0.75, dots: true, width: 6},
			{k: 'label', at: [1700, 1500], text: 'Xuôi dòng Nile', t0: 0.6, size: 30, color: '#ffb4a8'},
		],
	},
	map_hatnub: {
		base: 'egypt',
		cam: [{t: 0, at: [1330, 1200], w: 1200}, {t: 1, at: 'hatnub', w: 800}],
		els: [
			{k: 'marker', at: 'giza', label: 'Giza', t0: 0, dx: -1},
			{k: 'marker', at: 'hatnub', label: 'Hatnub', sub: 'Mỏ đá alabaster · dốc có hố cột', color: GOLD, t0: 0.2, pulse: true},
			{k: 'date', text: 'Phát hiện năm 2018', t0: 0.3},
		],
	},
	map_giza: {
		base: 'giza',
		cam: [{t: 0, at: [560, 640], w: 1250}, {t: 1, at: [520, 640], w: 980}],
		els: [
			{k: 'pyramid', at: 'khufu', label: 'Giza (Akhet-Khufu)', t0: 0.05, s: 1.4, dx: -1},
			{k: 'pyramid', at: 'khafre', t0: 0.05, s: 1.1},
			{k: 'pyramid', at: 'menkaure', t0: 0.05, s: 0.8},
			{k: 'marker', at: 'tura_q', label: 'Tura', sub: 'Mỏ đá vôi trắng', color: GOLD, t0: 0.3, pulse: true},
			{k: 'label', at: [590, 520], text: 'Sông Nile (ngày nay)', t0: 0.15, size: 28, color: '#9fd0de'},
			{k: 'label', at: 'cairo_lbl', text: 'Cairo ngày nay', t0: 0.15, size: 24, color: C.textDim},
			{k: 'label', at: 'mokattam', text: 'Đồi Mokattam', t0: 0.2, size: 24, color: C.textDim},
		],
		note: 'Sơ đồ · vị trí gần đúng · địa hình: AWS Terrain Tiles · sông: Natural Earth',
	},
	map_route: {
		base: 'giza',
		cam: [{t: 0, at: 'tura', w: 760}, {t: 0.5, at: [540, 640], w: 900}, {t: 1, at: [430, 610], w: 760}],
		els: [
			{k: 'pyramid', at: 'khufu', label: 'Akhet-Khufu', t0: 0, s: 1.4, dx: -1},
			{k: 'pyramid', at: 'khafre', t0: 0, s: 1.1},
			{k: 'marker', at: 'tura_q', label: 'Tura', sub: 'Chất đá lên thuyền', color: GOLD, t0: 0},
			{k: 'line', pts: ROUTE, color: GOLD, t0: 0.08, t1: 0.75, width: 6, dots: true},
			{k: 'boat', pts: ROUTE, t0: 0.08, t1: 0.75},
			{k: 'area', at: 'basin', r: 34, t0: 0.55, color: NILE},
			{k: 'marker', at: 'basin', label: 'She-Khufu', sub: 'Hồ/bồn của Khufu (sơ đồ)', color: NILE, t0: 0.6, dx: 1, dy: 1},
		],
		note: 'Đường thủy là sơ đồ · lòng sông thời Khufu khác ngày nay',
	},
	map_days: {
		base: 'giza',
		cam: [{t: 0, at: [560, 650], w: 900}, {t: 1, at: [540, 650], w: 860}],
		els: [
			{k: 'pyramid', at: 'khufu', t0: 0, s: 1.4},
			{k: 'pyramid', at: 'khafre', t0: 0, s: 1.1},
			{k: 'marker', at: 'tura_q', label: 'Tura', color: GOLD, t0: 0},
			{k: 'marker', at: 'basin', label: 'She-Khufu', color: NILE, t0: 0, dy: 1},
			{k: 'line', pts: ROUTE, color: GOLD, t0: 0, t1: 0.01, width: 4, dashed: true},
			// khớp lời đọc: clip này bắt đầu ở câu "Ngày thứ ba", câu "Ngày thứ tư" ở khoảng p = 0,26
			{k: 'boat', pts: ['basin', [340, 568]], t0: 0.02, t1: 0.2, vis: [0, 0.26]},
			{k: 'boat', pts: ROUTE_BACK, t0: 0.28, t1: 0.92, empty: true, vis: [0.26, 1]},
			{k: 'days', t0: 0, items: [
				{t: 0, text: 'Ngày 3', sub: 'Rời She-Khufu, tới Akhet-Khufu'},
				{t: 0.26, text: 'Ngày 4', sub: 'Thuyền trống ngược dòng về Tura'},
			]},
		],
		note: 'Nhịp chuyến đi dịch ý theo Tallet · sơ đồ',
	},
	map_branch: {
		base: 'giza',
		cam: [{t: 0, at: [500, 700], w: 1150}, {t: 1, at: [430, 640], w: 850}],
		els: [
			{k: 'pyramid', at: 'khufu', t0: 0, s: 1.4},
			{k: 'pyramid', at: 'khafre', t0: 0, s: 1.1},
			{k: 'pyramid', at: 'menkaure', t0: 0, s: 0.8},
			{k: 'line', pts: [[520, 1250], [470, 1050], [420, 860], [395, 720], 'basin'], color: '#7cc3dd', t0: 0.15, t1: 0.6, width: 10},
			{k: 'label', at: [560, 780], text: 'Nhánh Khufu (đã khô) · vị trí sơ đồ', t0: 0.5, size: 28, color: '#bfe3f0'},
			{k: 'area', at: 'basin', r: 40, t0: 0.55, color: NILE},
			{k: 'label', at: [255, 520], text: 'Cao nguyên Giza', t0: 0.1, size: 24, color: C.textDim},
		],
		note: 'Sơ đồ theo Sheisha và cộng sự (PNAS, 2022) · không phải bản đồ khảo sát',
	},
	map_village: {
		base: 'giza',
		cam: [{t: 0, at: [330, 575], w: 520}, {t: 1, at: [325, 578], w: 380}],
		els: [
			{k: 'pyramid', at: 'khufu', label: 'Khufu', t0: 0, s: 1.4, dx: -1},
			{k: 'pyramid', at: 'khafre', label: 'Khafre', t0: 0.05, s: 1.1, dx: -1},
			{k: 'pyramid', at: 'menkaure', label: 'Menkaure', t0: 0.1, s: 0.8, dx: -1},
			{k: 'marker', at: 'sphinx', label: 'Tượng Nhân sư', t0: 0.2, color: C.textDim},
			{k: 'marker', at: 'village', label: 'Heit el-Ghurab', sub: '"Làng thợ"', color: GOLD, t0: 0.4, pulse: true},
			{k: 'marker', at: 'cemetery', label: 'Nghĩa trang thợ', color: RED, t0: 0.6, dx: -1, dy: 1},
		],
		note: 'Sơ đồ · vị trí gần đúng',
	},
	diag_papyrus_hook: {base: 'none', cam: [{t: 0, at: [0, 0], w: W}], els: [], diagram: 'papyrus'},
	diag_ramps: {base: 'none', cam: [{t: 0, at: [0, 0], w: W}], els: [], diagram: 'ramps'},
	diag_workers: {base: 'none', cam: [{t: 0, at: [0, 0], w: W}], els: [], diagram: 'workers'},
	diag_papyrus: {base: 'none', cam: [{t: 0, at: [0, 0], w: W}], els: [], diagram: 'papyrus'},
	diag_timeline: {base: 'none', cam: [{t: 0, at: [0, 0], w: W}], els: [], diagram: 'timeline'},
};

const P = (base: Base, at: string | Pt): Pt => (typeof at === 'string' ? (base === 'egypt' ? E : G)[at] : at);
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

const polyLen = (pts: Pt[]) => pts.slice(1).reduce((s, q, i) => s + Math.hypot(q[0] - pts[i][0], q[1] - pts[i][1]), 0);
const pointAlong = (pts: Pt[], d: number): [number, number, number] => {
	for (let i = 1; i < pts.length; i++) {
		const l = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]);
		const ang = Math.atan2(pts[i][1] - pts[i - 1][1], pts[i][0] - pts[i - 1][0]);
		if (d <= l) return [pts[i - 1][0] + (pts[i][0] - pts[i - 1][0]) * (d / l), pts[i - 1][1] + (pts[i][1] - pts[i - 1][1]) * (d / l), ang];
		d -= l;
	}
	const n = pts.length;
	return [pts[n - 1][0], pts[n - 1][1], Math.atan2(pts[n - 1][1] - pts[n - 2][1], pts[n - 1][0] - pts[n - 2][0])];
};

// ---------- Sơ đồ (không dùng nền bản đồ) ----------
const Badge: React.FC<{text: string; color: string; op: number}> = ({text, color, op}) => (
	<div style={{position: 'absolute', left: 80, top: 70, opacity: op, padding: '8px 22px', background: color, fontFamily: fonts.sans, fontWeight: 900, fontSize: 30, color: '#fff', letterSpacing: 2}}>{text}</div>
);

const Ramps: React.FC<{p: number}> = ({p}) => {
	// Mặt cắt kim tự tháp + 4 giả thuyết dốc, lần lượt hiện
	const bx = 600, by = 930, bw = 760, ph = 470; // đáy trái, đáy phải = bx+bw
	const apex: Pt = [bx + bw / 2, by - ph];
	const step = (i: number) => interpolate(p, [0.08 + i * 0.21, 0.14 + i * 0.21], [0, 1], clamp);
	const active = Math.min(3, Math.floor(Math.max(0, p - 0.08) / 0.21));
	const names = ['Dốc thẳng', 'Dốc zíc zắc trên một mặt', 'Dốc xoắn quanh kim tự tháp', 'Dốc bên trong (J.-P. Houdin)'];
	const notes = ['Phải dài hơn 1 km để đủ thoải · tốn vật liệu hơn chính kim tự tháp', 'Bám vào sườn, ngắn hơn · khó với các góc', 'Dễ kéo · che mất góc, khó đo đạc khi xây', 'Giả thuyết gây tranh cãi · chưa được khảo sát xác nhận'];
	const ramp = [
		<polygon key={0} points={`${bx - 520},${by} ${bx + bw / 2 - 60},${by - ph * 0.55} ${bx + bw / 2 - 60},${by}`} fill={GOLD} fillOpacity={0.55} stroke={GOLD} strokeWidth={3} />,
		<polyline key={1} points={`${bx + 60},${by - 10} ${bx + bw - 130},${by - 120} ${bx + 170},${by - 230} ${bx + bw - 250},${by - 330} ${bx + 280},${by - 420}`} fill="none" stroke={GOLD} strokeWidth={16} strokeLinejoin="round" strokeLinecap="round" />,
		<g key={2}>
			<polyline points={`${bx - 20},${by - 6} ${bx + bw - 60},${by - 90}`} fill="none" stroke={GOLD} strokeWidth={16} strokeLinecap="round" />
			<polyline points={`${bx + bw - 140},${by - 200} ${bx + 150},${by - 290}`} fill="none" stroke={GOLD} strokeWidth={14} strokeLinecap="round" strokeDasharray="22 14" />
			<polyline points={`${bx + 230},${by - 340} ${bx + bw - 250},${by - 410}`} fill="none" stroke={GOLD} strokeWidth={12} strokeLinecap="round" />
		</g>,
		<polyline key={3} points={`${bx + 120},${by - 40} ${bx + bw - 120},${by - 120} ${bx + 220},${by - 250} ${bx + bw - 230},${by - 330} ${bx + 320},${by - 410}`} fill="none" stroke="#9fd0de" strokeWidth={10} strokeDasharray="16 10" strokeLinejoin="round" />,
	];
	return (
		<AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 40%, #2a2419 0%, #120f0b 75%)'}}>
			<svg width={W} height={H}>
				<line x1={0} y1={by} x2={W} y2={by} stroke="#6b5a3a" strokeWidth={3} />
				<polygon points={`${bx},${by} ${apex[0]},${apex[1]} ${bx + bw},${by}`} fill="#3a3226" stroke={STONE} strokeWidth={4} />
				{Array.from({length: 14}).map((_, j) => {
					const y = by - (ph * (j + 1)) / 15, half = (bw / 2) * (1 - (j + 1) / 15);
					return <line key={j} x1={apex[0] - half} y1={y} x2={apex[0] + half} y2={y} stroke={STONE} strokeOpacity={0.18} strokeWidth={2} />;
				})}
				{ramp.map((r, i) => <g key={i} opacity={step(i) * (i === active ? 1 : 0.18)}>{r}</g>)}
			</svg>
			<div style={{position: 'absolute', left: 80, top: 150, fontFamily: fonts.sans, color: C.text}}>
				<div style={{fontWeight: 900, fontSize: 54, color: GOLD}}>Họ nâng khối đá lên bằng cách nào?</div>
				<div style={{fontWeight: 600, fontSize: 30, color: C.textDim, marginTop: 6}}>Bốn giả thuyết chính · sơ đồ minh họa, không theo tỉ lệ</div>
			</div>
			<div style={{position: 'absolute', left: 80, top: 260, width: 1500, fontFamily: fonts.sans, opacity: step(active)}}>
				<div style={{fontWeight: 900, fontSize: 46, color: '#fff'}}>{active + 1}. {names[active]}</div>
				<div style={{fontWeight: 600, fontSize: 32, color: '#e6dcc6', marginTop: 6}}>{notes[active]}</div>
			</div>
			<Badge text="TRANH LUẬN" color="#cd7828" op={interpolate(p, [0, 0.05], [0, 1], clamp)} />
		</AbsoluteFill>
	);
};

const Workers: React.FC<{p: number}> = ({p}) => {
	const rows = [
		{who: 'Herodotus (thế kỷ 5 TCN)', n: 100000, label: '100.000 người', note: 'thay ca mỗi 3 tháng · viết khoảng 2.000 năm sau', col: '#8a7b64'},
		{who: 'Ước tính của Mark Lehner', n: 25000, label: 'khoảng 20.000–25.000 người', note: 'các toán luân phiên + một nhóm thợ thường trực · ước tính khác dao động rộng', col: RED},
		{who: 'Đội của Merer', n: 40, label: 'khoảng 40 người', note: 'theo Tallet · vài bài báo cũ ghi 200', col: GOLD},
	];
	const maxW = 1150;
	return (
		<AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 40%, #2a2419 0%, #120f0b 75%)', fontFamily: fonts.sans}}>
			<div style={{position: 'absolute', left: 100, top: 130, fontWeight: 900, fontSize: 56, color: GOLD}}>Bao nhiêu người xây kim tự tháp Khufu?</div>
			{rows.map((r, i) => {
				const u = interpolate(p, [0.1 + i * 0.22, 0.28 + i * 0.22], [0, 1], {...clamp, easing: ease});
				const w = Math.max(10, (r.n / 100000) * maxW) * u;
				return (
					<div key={i} style={{position: 'absolute', left: 100, top: 300 + i * 200, opacity: interpolate(u, [0, 0.15], [0, 1])}}>
						<div style={{fontWeight: 800, fontSize: 36, color: C.text}}>{r.who}</div>
						<div style={{display: 'flex', alignItems: 'center', marginTop: 10}}>
							<div style={{width: w, height: 54, background: r.col}} />
							<div style={{marginLeft: 24, fontWeight: 900, fontSize: 44, color: '#fff'}}>{r.label}</div>
						</div>
						<div style={{fontWeight: 600, fontSize: 28, color: C.textDim, marginTop: 6}}>{r.note}</div>
					</div>
				);
			})}
		</AbsoluteFill>
	);
};

const PAP_LINES = [
	['Ngày thứ nhất', 'Thanh tra Merer cùng đội của mình kéo đá ở Tura; nghỉ đêm ở Tura.'],
	['Hôm sau', 'Thanh tra Merer cùng đội nhổ neo từ Tura, chở đầy đá, đi về Akhet-Khufu; nghỉ đêm ở She-Khufu.'],
	['Ngày thứ ba', 'Rời She-Khufu, đi về Akhet-Khufu, chở đầy đá; nghỉ đêm ở Akhet-Khufu.'],
	['Ngày thứ tư', 'Rời Akhet-Khufu từ sáng; ngược dòng về Tura.'],
];
const Papyrus: React.FC<{p: number; sec: number}> = ({p}) => {
	return (
		<AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 45%, #2a2419 0%, #0f0c09 80%)', fontFamily: fonts.sans}}>
			<div style={{position: 'absolute', left: 230, top: 120, width: 1460, height: 760, background: 'linear-gradient(180deg,#d9c9a3,#cdb98e)', boxShadow: '0 20px 60px #000',
				transform: `scale(${interpolate(p, [0, 1], [0.97, 1.02])})`}}>
				<svg width={1460} height={760} style={{position: 'absolute', opacity: 0.35}}>
					{Array.from({length: 60}).map((_, j) => <line key={j} x1={0} y1={j * 13 + 3} x2={1460} y2={j * 13 + 3 + ((j * 37) % 7) - 3} stroke="#8a7449" strokeWidth={j % 3 === 0 ? 2 : 1} />)}
					{Array.from({length: 90}).map((_, j) => <line key={'v' + j} x1={j * 16.3} y1={0} x2={j * 16.3 + ((j * 13) % 5) - 2} y2={760} stroke="#a08a5c" strokeWidth={1} opacity={0.5} />)}
				</svg>
				<div style={{position: 'absolute', left: 60, top: 40, fontWeight: 900, fontSize: 40, color: '#5a1f14'}}>Nhật ký của Merer · một chuyến đi (trích, dịch ý, rút gọn)</div>
				{PAP_LINES.map(([d, txt], i) => {
					const u = interpolate(p, [0.08 + i * 0.2, 0.18 + i * 0.2], [0, 1], clamp);
					return (
						<div key={i} style={{position: 'absolute', left: 60, top: 140 + i * 145, width: 1340, opacity: u, transform: `translateX(${(1 - u) * 30}px)`}}>
							<span style={{fontWeight: 900, fontSize: 38, color: RED}}>{d} · </span>
							<span style={{fontWeight: 700, fontSize: 36, color: '#2a2016', lineHeight: 1.3}}>{txt}</span>
						</div>
					);
				})}
			</div>
			<div style={{position: 'absolute', right: 60, bottom: 160, fontWeight: 600, fontSize: 24, color: C.textDim, background: 'rgba(10,10,12,0.6)', padding: '6px 14px'}}>
				Minh họa đồ họa, không phải ảnh papyrus thật · dịch ý từ bản dịch của Pierre Tallet
			</div>
		</AbsoluteFill>
	);
};

const Timeline: React.FC<{p: number}> = ({p}) => {
	const x0 = 200, x1 = 1720, y = 560;
	const u = interpolate(p, [0.1, 0.6], [0, 1], {...clamp, easing: ease});
	const ticks = [{yr: 'khoảng 2560 TCN', f: 0, t: 'Kim tự tháp Khufu'}, {yr: 'Năm 1', f: 2560 / 3871, t: ''}, {yr: '1311', f: 1, t: 'Tháp nhà thờ Lincoln (Anh) cao hơn'}];
	return (
		<AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 40%, #2a2419 0%, #120f0b 75%)', fontFamily: fonts.sans}}>
			<div style={{position: 'absolute', left: 100, top: 140, fontWeight: 900, fontSize: 56, color: GOLD}}>Công trình cao nhất do con người dựng</div>
			<div style={{position: 'absolute', left: 100, top: 220, fontWeight: 600, fontSize: 32, color: C.textDim}}>Cao ban đầu khoảng 146 m · giữ kỷ lục gần 4.000 năm (theo History Revealed)</div>
			<svg width={W} height={H} style={{position: 'absolute'}}>
				<line x1={x0} y1={y} x2={x1} y2={y} stroke="#4a4030" strokeWidth={10} strokeLinecap="round" />
				<line x1={x0} y1={y} x2={x0 + (x1 - x0) * u} y2={y} stroke={GOLD} strokeWidth={10} strokeLinecap="round" />
				{ticks.map((k, i) => {
					const x = x0 + (x1 - x0) * k.f;
					const op = interpolate(u, [k.f - 0.02, k.f + 0.02], [0, 1], clamp);
					return (
						<g key={i} opacity={op}>
							<circle cx={x} cy={y} r={18} fill={i === 1 ? '#8a7b64' : RED} stroke="#0b0a08" strokeWidth={4} />
							<text x={x} y={y + 70} textAnchor={i === 0 ? 'start' : i === 2 ? 'end' : 'middle'} fontFamily={fonts.sans} fontWeight={900} fontSize={40} fill="#fff">{k.yr}</text>
							{k.t && <text x={x} y={y + 115} textAnchor={i === 0 ? 'start' : 'end'} fontFamily={fonts.sans} fontWeight={600} fontSize={28} fill={C.textDim}>{k.t}</text>}
						</g>
					);
				})}
			</svg>
		</AbsoluteFill>
	);
};

export const MapGiza: React.FC<{scene: string}> = ({scene}) => {
	const frame = useCurrentFrame();
	const {durationInFrames, fps} = useVideoConfig();
	const sc = S[scene] ?? S.map_egypt;
	const p = frame / Math.max(1, durationInFrames - 1);
	const sec = frame / fps;
	if (sc.diagram === 'ramps') return <Ramps p={p} />;
	if (sc.diagram === 'workers') return <Workers p={p} />;
	if (sc.diagram === 'papyrus') return <Papyrus p={p} sec={sec} />;
	if (sc.diagram === 'timeline') return <Timeline p={p} />;
	const base = sc.base as 'egypt' | 'giza';
	const g = geo[base];
	const cam = camAt(sc, p);
	const k = W / cam.w;
	const inv = 1 / k;
	const tf = `translate(${W / 2}px, ${H / 2}px) scale(${k}) translate(${-cam.x}px, ${-cam.y}px)`;
	const fadeAt = (t0: number, len = 0.06) => interpolate(p, [t0, t0 + len], [0, 1], clamp);

	const label = (x: number, y: number, text: string, size: number, color: string, anchor: 'start' | 'middle' | 'end' = 'middle', op = 1, weight = 800) => (
		<text x={x} y={y} fontFamily={fonts.sans} fontWeight={weight} fontSize={size * inv} fill={color} textAnchor={anchor} opacity={op}
			stroke="#0b0a08" strokeWidth={size * inv * 0.22} paintOrder="stroke" strokeLinejoin="round">{text}</text>
	);

	const els = sc.els.map((el, i) => {
		switch (el.k) {
			case 'country':
				return <path key={i} d={geo.egypt.country} fill={GOLD} fillOpacity={0.08} stroke={GOLD} strokeWidth={2.4 * inv} strokeOpacity={0.6} opacity={fadeAt(el.t0, 0.1)} />;
			case 'label': {
				const [x, y] = P(base, el.at);
				return <g key={i}>{label(x, y, el.text, el.size ?? 28, el.color ?? C.text, 'middle', fadeAt(el.t0))}</g>;
			}
			case 'area': {
				const [x, y] = P(base, el.at);
				return <circle key={i} cx={x} cy={y} r={el.r} fill={el.color ?? GOLD} fillOpacity={0.35} stroke={el.color ?? GOLD} strokeWidth={3 * inv} opacity={fadeAt(el.t0, 0.1)} />;
			}
			case 'marker': {
				const [x, y] = P(base, el.at);
				const col = el.color ?? GOLD;
				const pr = el.pulse ? (sec * 0.8) % 1 : 0;
				const left = (el.dx ?? 1) < 0;
				const dy = (el.dy ?? 0) > 0 ? 40 : (el.dy ?? 0) < 0 ? -18 : 10;
				return (
					<g key={i} opacity={fadeAt(el.t0)}>
						{el.pulse && <circle cx={x} cy={y} r={(14 + 40 * pr) * inv} fill="none" stroke={col} strokeWidth={4 * inv} opacity={1 - pr} />}
						<circle cx={x} cy={y} r={11 * inv} fill={col} stroke="#0b0a08" strokeWidth={3 * inv} />
						{label(x + (left ? -22 : 22) * inv, y + dy * inv, el.label, 34, C.text, left ? 'end' : 'start')}
						{el.sub && label(x + (left ? -22 : 22) * inv, y + (dy + 36) * inv, el.sub, 24, GOLD, left ? 'end' : 'start', 1, 600)}
					</g>
				);
			}
			case 'pyramid': {
				const [x, y] = P(base, el.at);
				const s = (el.s ?? 1) * 22 * inv;
				const left = (el.dx ?? 1) < 0;
				return (
					<g key={i} opacity={fadeAt(el.t0)}>
						<polygon points={`${x - s},${y + s * 0.6} ${x},${y - s} ${x + s},${y + s * 0.6}`} fill={STONE} stroke="#0b0a08" strokeWidth={3 * inv} />
						<polygon points={`${x},${y - s} ${x + s},${y + s * 0.6} ${x + s * 0.15},${y + s * 0.6}`} fill="#b9a988" />
						{el.label && label(x + (left ? -s - 14 * inv : s + 14 * inv), y + 10 * inv, el.label, 32, C.text, left ? 'end' : 'start')}
					</g>
				);
			}
			case 'line': {
				const pts = el.pts.map((q) => P(base, q));
				const L = polyLen(pts);
				const u = interpolate(p, [el.t0, el.t1], [0, 1], {...clamp, easing: ease});
				const d = 'M' + pts.map((q) => q.join(',')).join('L');
				const wdt = (el.width ?? 5) * inv;
				const head = pointAlong(pts, L * u);
				const mid = pointAlong(pts, L * 0.5);
				const nd = 7;
				return (
					<g key={i} opacity={fadeAt(el.t0, 0.02)}>
						<path d={d} fill="none" stroke="#0b0a08" strokeOpacity={0.55} strokeWidth={wdt * 2.2} strokeDasharray={`${L * u} ${L}`} strokeLinecap="round" />
						{el.dashed && (
							<mask id={`m${i}`} maskUnits="userSpaceOnUse" x={0} y={0} width={g.w} height={g.h}>
								<path d={d} fill="none" stroke="#fff" strokeWidth={wdt * 3} strokeDasharray={`${L * u} ${L}`} />
							</mask>
						)}
						<path d={d} fill="none" stroke={el.color} strokeWidth={wdt} strokeLinecap="round" strokeLinejoin="round"
							strokeDasharray={el.dashed ? `${18 * inv} ${12 * inv}` : `${L * u} ${L}`} mask={el.dashed ? `url(#m${i})` : undefined} />
						{u > 0 && u < 1 && <circle cx={head[0]} cy={head[1]} r={wdt * 1.4} fill={el.color} />}
						{el.dots && u >= 1 && Array.from({length: nd}).map((_, j) => {
							const q = pointAlong(pts, L * ((j / nd + sec * 0.1) % 1));
							return <circle key={j} cx={q[0]} cy={q[1]} r={wdt * 0.8} fill="#fff" opacity={0.85} />;
						})}
						{el.label && label(mid[0] + (el.lx ?? 0) * inv, mid[1] + (el.ly ?? -26) * inv, el.label, 28, el.color === RED ? '#ffb4a8' : el.color === GOLD ? GOLD : '#bfe3f0', 'middle', interpolate(p, [el.t1 - 0.05, el.t1 + 0.03], [0, 1], clamp))}
					</g>
				);
			}
			case 'boat': {
				if (el.vis && (p < el.vis[0] || p >= el.vis[1])) return null;
				const fwd = el.pts.map((q) => P(base, q));
				const L = polyLen(fwd);
				let pos: [number, number, number];
				let loaded = !el.empty;
				if (el.back !== undefined && p > el.t1) {
					const u = interpolate(p, [el.t1 + 0.05, el.back], [0, 1], {...clamp, easing: ease});
					const rev = [...fwd].reverse();
					pos = pointAlong(rev, L * u);
					loaded = false;
				} else {
					const u = interpolate(p, [el.t0, el.t1], [0, 1], {...clamp, easing: ease});
					pos = pointAlong(fwd, L * u);
				}
				const [x, y] = pos;
				const s = 1.15 * inv;
				const bob = Math.sin(sec * 3) * 1.5;
				return (
					<g key={i} transform={`translate(${x} ${y}) scale(${s}) translate(0 ${bob})`}>
						<ellipse cx={0} cy={14} rx={40} ry={8} fill="#000" opacity={0.35} />
						<path d="M-38,0 Q0,22 38,0 L30,-4 L-30,-4 Z" fill="#7a5a34" stroke="#0b0a08" strokeWidth={3} />
						<line x1={0} y1={-4} x2={0} y2={-46} stroke="#0b0a08" strokeWidth={4} />
						<path d="M2,-44 L26,-12 L2,-12 Z" fill={STONE} stroke="#0b0a08" strokeWidth={2} />
						{loaded && <g>
							<rect x={-26} y={-16} width={14} height={12} fill={STONE} stroke="#0b0a08" strokeWidth={2} />
							<rect x={-12} y={-16} width={14} height={12} fill={STONE} stroke="#0b0a08" strokeWidth={2} />
							<rect x={-19} y={-27} width={14} height={11} fill={STONE} stroke="#0b0a08" strokeWidth={2} />
						</g>}
					</g>
				);
			}
			default:
				return null;
		}
	});

	const hud = sc.els.map((el, i) => {
		if (el.k === 'title') {
			const op = fadeAt(el.t0, 0.08) * (1 - interpolate(p, [0.8, 0.9], [0, 1], clamp));
			return (
				<div key={i} style={{position: 'absolute', left: 80, top: 210, opacity: op}}>
					<div style={{fontFamily: fonts.sans, fontWeight: 900, fontSize: 56, color: GOLD, textShadow: '0 3px 12px #000'}}>{el.text}</div>
					{el.sub && <div style={{fontFamily: fonts.sans, fontWeight: 600, fontSize: 30, color: C.text, marginTop: 6, textShadow: '0 2px 8px #000'}}>{el.sub}</div>}
				</div>
			);
		}
		if (el.k === 'date') {
			const op = fadeAt(el.t0, 0.05) * (el.t1 !== undefined ? 1 - interpolate(p, [el.t1 - 0.04, el.t1], [0, 1], clamp) : 1);
			return (
				<div key={i} style={{position: 'absolute', left: 80, top: 110, opacity: op, padding: '12px 26px', background: 'rgba(10,10,12,0.82)', borderLeft: `8px solid ${RED}`,
					fontFamily: fonts.sans, fontWeight: 800, fontSize: 40, color: '#fff'}}>{el.text}</div>
			);
		}
		if (el.k === 'days') {
			let cur = 0;
			el.items.forEach((it, j) => { if (p >= it.t) cur = j; });
			const it = el.items[cur];
			const pop = interpolate(p, [it.t, it.t + 0.03], [0.85, 1], clamp);
			return (
				<div key={i} style={{position: 'absolute', left: 80, top: 110, padding: '16px 30px', background: 'rgba(10,10,12,0.85)', borderLeft: `10px solid ${GOLD}`, transform: `scale(${pop})`, transformOrigin: 'left center'}}>
					<div style={{fontFamily: fonts.sans, fontWeight: 900, fontSize: 64, color: GOLD}}>{it.text}</div>
					{it.sub && <div style={{fontFamily: fonts.sans, fontWeight: 700, fontSize: 34, color: '#fff', marginTop: 4}}>{it.sub}</div>}
				</div>
			);
		}
		return null;
	});

	return (
		<AbsoluteFill style={{background: '#0d0f0c', overflow: 'hidden'}}>
			<div style={{position: 'absolute', left: 0, top: 0, width: g.w, height: g.h, transformOrigin: '0 0', transform: tf}}>
				<Img src={staticFile(`video07/maps/${base}.jpg`)} style={{position: 'absolute', width: g.w, height: g.h}} />
				<svg width={g.w} height={g.h} viewBox={`0 0 ${g.w} ${g.h}`} style={{position: 'absolute', overflow: 'visible'}}>
					<path d={g.nile} fill="none" stroke="#7fa86a" strokeOpacity={0.28} strokeWidth={(base === 'egypt' ? 22 : 40) * inv} strokeLinecap="round" strokeLinejoin="round" />
					<path d={g.nile} fill="none" stroke="#0b0a08" strokeOpacity={0.45} strokeWidth={8 * inv} strokeLinejoin="round" />
					<path d={g.nile} fill="none" stroke={NILE} strokeWidth={4.5 * inv} strokeLinejoin="round" />
					{els}
				</svg>
			</div>
			<AbsoluteFill style={{background: 'radial-gradient(ellipse at center, rgba(0,0,0,0) 55%, rgba(0,0,0,0.55) 100%)'}} />
			{hud}
			<div style={{position: 'absolute', right: 60, bottom: 160, fontFamily: fonts.sans, fontWeight: 600, fontSize: 22, color: C.textDim, background: 'rgba(10,10,12,0.6)', padding: '6px 14px'}}>
				{sc.note ?? 'Bản đồ kênh tự vẽ · địa hình: AWS Terrain Tiles · sông, biên giới: Natural Earth'}
			</div>
		</AbsoluteFill>
	);
};

S.map_route_end = {...S.map_route, cam: [{t: 0, at: [540, 640], w: 1000}, {t: 1, at: [430, 600], w: 700}]};

export const MAP_SCENES_07 = Object.keys(S);
