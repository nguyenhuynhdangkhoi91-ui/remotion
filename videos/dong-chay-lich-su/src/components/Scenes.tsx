import React from 'react';
import {AbsoluteFill, Easing, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {C, fonts, H, W} from '../lib/theme';
import {CREDITS} from '../video01/credits';

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

const useFade = (start = 0, len = 18) => {
	const frame = useCurrentFrame();
	return interpolate(frame, [start, start + len], [0, 1], clamp);
};

const Grain: React.FC<{opacity?: number}> = ({opacity = 0.18}) => (
	<Img src={staticFile('common/grain.png')} style={{position: 'absolute', inset: 0, width: W, height: H, opacity, mixBlendMode: 'overlay'}} />
);

export const PaperBg: React.FC<{dark?: boolean}> = ({dark = true}) => (
	<AbsoluteFill style={{background: dark ? `radial-gradient(ellipse at 50% 40%, #2b241a 0%, ${C.ink} 70%)` : `radial-gradient(ellipse at 50% 45%, #f6ecd5 0%, ${C.paperDim} 100%)`}}>
		<Grain opacity={dark ? 0.22 : 0.35} />
	</AbsoluteFill>
);

// ─────────── Ảnh tư liệu: Ken Burns + nền mờ ───────────
export type ImageVisual = {type: 'image'; src: string; caption: string; kb: string; focus: [number, number]; tag: string};

export const ImageScene: React.FC<{v: ImageVisual; duration: number}> = ({v, duration}) => {
	const frame = useCurrentFrame();
	const t = interpolate(frame, [0, duration], [0, 1], clamp);
	const credit = CREDITS[v.src];
	const [fx, fy] = v.focus;
	let scale = 1.06 + 0.12 * t;
	let tx = 0;
	let ty = 0;
	if (v.kb === 'out') scale = 1.2 - 0.12 * t;
	if (v.kb === 'left') tx = 40 - 80 * t;
	if (v.kb === 'right') tx = -40 + 80 * t;
	if (v.kb === 'up') ty = 30 - 60 * t;
	const capIn = interpolate(frame, [12, 30], [0, 1], clamp);
	const src = staticFile(`video01/img/${v.src}.jpg`);
	return (
		<AbsoluteFill style={{background: C.ink, overflow: 'hidden'}}>
			<Img src={src} style={{position: 'absolute', inset: -60, width: W + 120, height: H + 120, objectFit: 'cover', filter: 'blur(38px) brightness(0.45) saturate(0.8)'}} />
			<AbsoluteFill style={{transform: `translate(${tx}px, ${ty}px) scale(${scale})`, transformOrigin: `${fx * 100}% ${fy * 100}%`}}>
				<Img src={src} style={{width: W, height: H, objectFit: 'contain', filter: 'sepia(0.12) contrast(1.04)'}} />
			</AbsoluteFill>
			<AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(0,0,0,0.25) 0%, rgba(0,0,0,0) 25%, rgba(0,0,0,0) 55%, rgba(0,0,0,0.75) 100%)'}} />
			<Grain opacity={0.12} />
			<div style={{position: 'absolute', left: 70, top: 56, opacity: capIn, transform: `translateY(${(1 - capIn) * -10}px)`, maxWidth: 1250}}>
				<div style={{display: 'inline-block', fontFamily: fonts.sans, fontWeight: 700, fontSize: 22, letterSpacing: 3, color: C.ink, background: C.goldSoft, padding: '6px 14px', borderRadius: 6}}>
					{v.tag.toUpperCase()}
				</div>
				<div style={{marginTop: 12, fontFamily: fonts.serif, fontSize: 32, color: C.text, textShadow: '0 2px 12px #000', lineHeight: 1.3}}>{v.caption}</div>
				{credit ? (
					<div style={{marginTop: 6, fontFamily: fonts.sans, fontSize: 20, color: C.textDim, textShadow: '0 2px 8px #000'}}>
						Nguồn: {credit.author} · {credit.license} · Wikimedia Commons
					</div>
				) : null}
			</div>
		</AbsoluteFill>
	);
};

// ─────────── Thẻ chương ───────────
export type TitleVisual = {type: 'title'; kicker: string; title: string; sub: string};

export const TitleScene: React.FC<{v: TitleVisual}> = ({v}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const s = spring({frame, fps, config: {damping: 200}, durationInFrames: 30});
	const line = interpolate(frame, [8, 40], [0, 1], {...clamp, easing: Easing.out(Easing.cubic)});
	return (
		<AbsoluteFill>
			<PaperBg />
			<AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', flexDirection: 'column'}}>
				<div style={{fontFamily: fonts.sans, fontWeight: 600, fontSize: 34, letterSpacing: 10, color: C.gold, opacity: s}}>{v.kicker.toUpperCase()}</div>
				<div style={{width: 520 * line, height: 3, background: C.gold, margin: '26px 0 30px', opacity: 0.8}} />
				<div style={{fontFamily: fonts.serif, fontWeight: 700, fontSize: 128, color: C.text, textAlign: 'center', lineHeight: 1.1,
					transform: `translateY(${(1 - s) * 30}px)`, opacity: s, textShadow: '0 8px 30px #000'}}>
					{v.title}
				</div>
				{v.sub ? (
					<div style={{marginTop: 26, fontFamily: fonts.serifItalic, fontStyle: 'italic', fontSize: 50, color: C.goldSoft, opacity: interpolate(frame, [18, 36], [0, 1], clamp)}}>{v.sub}</div>
				) : null}
			</AbsoluteFill>
		</AbsoluteFill>
	);
};

// ─────────── Trích dẫn ───────────
export type QuoteVisual = {type: 'quote'; text: string; who: string; src: string};

export const QuoteScene: React.FC<{v: QuoteVisual; duration: number}> = ({v, duration}) => {
	const frame = useCurrentFrame();
	const words = v.text.split(/(\s+)/);
	const revealEnd = Math.min(duration * 0.7, 26 + words.length * 3.2);
	const shown = interpolate(frame, [8, revealEnd], [0, words.length], clamp);
	const zoom = interpolate(frame, [0, duration], [1, 1.04]);
	const size = v.text.length > 110 ? 54 : v.text.length > 70 ? 64 : 76;
	return (
		<AbsoluteFill>
			<PaperBg />
			<AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', transform: `scale(${zoom})`}}>
				<div style={{position: 'relative', width: 1460, padding: '70px 110px', background: 'linear-gradient(180deg, #efe1c0, #d9c59a)', borderRadius: 8,
					boxShadow: '0 30px 80px rgba(0,0,0,0.6), inset 0 0 80px rgba(120,80,30,0.35)'}}>
					<div style={{position: 'absolute', left: 40, top: -10, fontFamily: fonts.serif, fontSize: 220, color: '#8b5a2b', opacity: 0.35, lineHeight: 1}}>“</div>
					<div style={{fontFamily: fonts.serif, fontWeight: 600, fontSize: size, color: '#2a1b0e', lineHeight: 1.35, whiteSpace: 'pre-line'}}>
						{words.map((w, i) => (
							<span key={i} style={{opacity: interpolate(shown - i, [0, 1], [0.08, 1], clamp)}}>{w}</span>
						))}
					</div>
					<div style={{marginTop: 34, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 30,
						opacity: interpolate(frame, [20, 36], [0, 1], clamp)}}>
						<div style={{fontFamily: fonts.sans, fontWeight: 700, fontSize: 32, color: '#6b3a12'}}>— {v.who}</div>
						<div style={{fontFamily: fonts.serifItalic, fontStyle: 'italic', fontSize: 26, color: '#6b5232', textAlign: 'right'}}>{v.src}</div>
					</div>
				</div>
			</AbsoluteFill>
		</AbsoluteFill>
	);
};

// ─────────── Chữ lớn (chữ Hán, khẩu hiệu) ───────────
export type WordVisual = {type: 'word'; big: string; small: string; src: string};

export const WordScene: React.FC<{v: WordVisual; duration: number}> = ({v, duration}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const s = spring({frame: frame - 4, fps, config: {damping: 14, mass: 0.8}});
	const isHan = /[一-鿿]/.test(v.big);
	const zoom = interpolate(frame, [0, duration], [1, 1.05]);
	return (
		<AbsoluteFill>
			<PaperBg />
			<AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', flexDirection: 'column', transform: `scale(${zoom})`}}>
				<div style={{fontFamily: isHan ? fonts.han : fonts.serif, fontWeight: 700, fontSize: isHan ? 300 : v.big.length > 12 ? 120 : 170, color: C.mongol,
					transform: `scale(${0.6 + 0.4 * s})`, opacity: Math.min(1, s * 1.3), textAlign: 'center', lineHeight: 1.1, whiteSpace: 'pre-line',
					textShadow: '0 10px 40px rgba(0,0,0,0.7)', letterSpacing: isHan ? 30 : 2}}>
					{v.big}
				</div>
				<div style={{marginTop: 40, fontFamily: fonts.serif, fontSize: 52, color: C.text, opacity: interpolate(frame, [16, 34], [0, 1], clamp)}}>{v.small}</div>
				<div style={{marginTop: 18, fontFamily: fonts.sans, fontSize: 26, color: C.textDim, opacity: interpolate(frame, [24, 40], [0, 1], clamp)}}>{v.src}</div>
			</AbsoluteFill>
		</AbsoluteFill>
	);
};

// ─────────── Con số lớn ───────────
export type FactVisual = {type: 'fact'; big: string; text: string; sub: string};

export const FactScene: React.FC<{v: FactVisual; duration: number}> = ({v, duration}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const s = spring({frame: frame - 2, fps, config: {damping: 200}, durationInFrames: 28});
	const num = /^\d+$/.test(v.big) ? Number(v.big) : null;
	const shownNum = num !== null && num < 1000 ? Math.round(interpolate(frame, [4, 40], [0, num], {...clamp, easing: Easing.out(Easing.cubic)})) : null;
	const zoom = interpolate(frame, [0, duration], [1, 1.04]);
	return (
		<AbsoluteFill>
			<PaperBg />
			<AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', flexDirection: 'column', transform: `scale(${zoom})`}}>
				<div style={{fontFamily: fonts.serif, fontWeight: 700, fontSize: v.big.length > 9 ? 150 : 230, color: C.goldSoft, opacity: s,
					transform: `translateY(${(1 - s) * 40}px)`, textShadow: '0 10px 40px #000'}}>
					{shownNum !== null ? shownNum : v.big}
				</div>
				<div style={{width: 700 * s, height: 3, background: C.gold, margin: '10px 0 34px', opacity: 0.7}} />
				<div style={{fontFamily: fonts.sans, fontWeight: 700, fontSize: 56, color: C.text, textAlign: 'center', maxWidth: 1500, opacity: interpolate(frame, [12, 28], [0, 1], clamp)}}>{v.text}</div>
				{v.sub ? <div style={{marginTop: 22, fontFamily: fonts.serifItalic, fontStyle: 'italic', fontSize: 36, color: C.textDim, opacity: interpolate(frame, [20, 36], [0, 1], clamp)}}>{v.sub}</div> : null}
			</AbsoluteFill>
		</AbsoluteFill>
	);
};

// ─────────── Dòng thời gian ───────────
export type TimelineVisual = {type: 'timeline'; items: [string, string][]; active: number};

export const TimelineScene: React.FC<{v: TimelineVisual; duration: number}> = ({v, duration}) => {
	const frame = useCurrentFrame();
	const n = v.items.length;
	const lineT = interpolate(frame, [4, 34], [0, 1], {...clamp, easing: Easing.out(Easing.cubic)});
	const x0 = 260;
	const x1 = W - 260;
	const y = H / 2 + 10;
	const zoom = interpolate(frame, [0, duration], [1, 1.03]);
	return (
		<AbsoluteFill>
			<PaperBg />
			<svg width={W} height={H} style={{position: 'absolute', transform: `scale(${zoom})`}}>
				<line x1={x0} y1={y} x2={x0 + (x1 - x0) * lineT} y2={y} stroke={C.gold} strokeWidth={6} strokeLinecap="round" />
				{v.items.map(([year, label], i) => {
					const x = x0 + ((x1 - x0) * (i + 0.5)) / n;
					const appear = interpolate(frame, [16 + i * 16, 34 + i * 16], [0, 1], clamp);
					const isActive = v.active === -1 ? true : i <= v.active;
					const hi = v.active >= 0 && i === v.active;
					const pulse = hi ? 1 + 0.12 * Math.sin(frame / 6) : 1;
					return (
						<g key={i} opacity={appear}>
							<circle cx={x} cy={y} r={30 * pulse} fill={isActive ? C.mongol : C.ink2} stroke={C.gold} strokeWidth={5} />
							<text x={x} y={y - 70} textAnchor="middle" fontFamily={fonts.serif} fontWeight={700} fontSize={hi ? 108 : 92} fill={isActive ? C.text : C.textDim}>{year}</text>
							<text x={x} y={y + 95} textAnchor="middle" fontFamily={fonts.sans} fontWeight={600} fontSize={40} fill={C.goldSoft}>{label}</text>
						</g>
					);
				})}
			</svg>
		</AbsoluteFill>
	);
};

// ─────────── Thẻ lý do ───────────
export type CardsVisual = {type: 'cards'; items: [string, string][]; active: number; heading: string};

export const CardsScene: React.FC<{v: CardsVisual; duration: number}> = ({v, duration}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const zoom = interpolate(frame, [0, duration], [1, 1.03]);
	return (
		<AbsoluteFill>
			<PaperBg />
			<AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', flexDirection: 'column', transform: `scale(${zoom})`}}>
				{v.heading ? <div style={{fontFamily: fonts.sans, fontWeight: 700, fontSize: 40, letterSpacing: 8, color: C.gold, marginBottom: 60}}>{v.heading.toUpperCase()}</div> : null}
				<div style={{display: 'flex', gap: 50}}>
					{v.items.map(([n, label], i) => {
						const s = spring({frame: frame - 6 - i * 7, fps, config: {damping: 200}, durationInFrames: 24});
						const hi = v.active === i;
						const dim = v.active >= 0 && !hi;
						return (
							<div key={i} style={{width: 470, height: 420, borderRadius: 18, padding: '46px 40px', boxSizing: 'border-box',
								background: hi ? 'linear-gradient(180deg, #f3e3bd, #d8bf8a)' : 'linear-gradient(180deg, #2c251b, #1c1712)',
								border: `3px solid ${hi ? C.gold : '#5b4c33'}`, boxShadow: hi ? '0 30px 70px rgba(217,164,65,0.35)' : '0 20px 50px rgba(0,0,0,0.5)',
								opacity: s * (dim ? 0.45 : 1), transform: `translateY(${(1 - s) * 50}px) scale(${hi ? 1.06 : 1})`}}>
								<div style={{fontFamily: fonts.serif, fontWeight: 700, fontSize: 130, lineHeight: 1, color: hi ? C.mongol : C.gold}}>{n}</div>
								<div style={{marginTop: 40, fontFamily: fonts.sans, fontWeight: 700, fontSize: 48, lineHeight: 1.2, color: hi ? '#2a1b0e' : C.text}}>{label}</div>
							</div>
						);
					})}
				</div>
			</AbsoluteFill>
		</AbsoluteFill>
	);
};

// ─────────── So sánh 3 cột ───────────
export type CompareVisual = {type: 'compare'; items: [string, string, string][]};

export const CompareScene: React.FC<{v: CompareVisual; duration: number}> = ({v}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	return (
		<AbsoluteFill>
			<PaperBg />
			<AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 46}}>
				{v.items.map(([name, years, why], i) => {
					const s = spring({frame: frame - 8 - i * 26, fps, config: {damping: 200}, durationInFrames: 24});
					const last = i === v.items.length - 1;
					return (
						<div key={i} style={{width: 500, minHeight: 470, borderRadius: 18, padding: '50px 44px', boxSizing: 'border-box', textAlign: 'center',
							background: last ? 'linear-gradient(180deg, #f3e3bd, #d8bf8a)' : 'linear-gradient(180deg, #2c251b, #1c1712)',
							border: `3px solid ${last ? C.gold : '#5b4c33'}`, opacity: s, transform: `translateY(${(1 - s) * 60}px)`}}>
							<div style={{fontFamily: fonts.serif, fontWeight: 700, fontSize: 72, color: last ? C.mongol : C.text}}>{name}</div>
							<div style={{marginTop: 16, fontFamily: fonts.sans, fontWeight: 600, fontSize: 34, color: last ? '#6b3a12' : C.gold}}>{years}</div>
							<div style={{marginTop: 60, fontFamily: fonts.sans, fontWeight: 700, fontSize: 44, lineHeight: 1.25, color: last ? '#2a1b0e' : C.text}}>{why}</div>
						</div>
					);
				})}
			</AbsoluteFill>
		</AbsoluteFill>
	);
};
