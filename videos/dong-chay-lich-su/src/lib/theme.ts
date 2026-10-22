import {continueRender, delayRender, staticFile} from 'remotion';

// Font đặt sẵn trong public/fonts (đã cắt gọn bộ ký tự Việt/Latin) để render không cần mạng.
const FACES: [string, string, string, string][] = [
	['Be Vietnam Pro', 'BeVietnamPro-Regular', '400', 'normal'],
	['Be Vietnam Pro', 'BeVietnamPro-Medium', '500', 'normal'],
	['Be Vietnam Pro', 'BeVietnamPro-SemiBold', '600', 'normal'],
	['Be Vietnam Pro', 'BeVietnamPro-Bold', '700', 'normal'],
	['Be Vietnam Pro', 'BeVietnamPro-ExtraBold', '800', 'normal'],
	['Be Vietnam Pro', 'BeVietnamPro-Black', '900', 'normal'],
	['Noto Serif', 'NotoSerif', '100 900', 'normal'],
	['Noto Serif Italic', 'NotoSerif-Italic', '100 900', 'italic'],
	['Noto Serif TC', 'NotoSerifTC-han', '100 900', 'normal'],
];

if (typeof document !== 'undefined') {
	const handle = delayRender('Tải font');
	Promise.all(
		FACES.map(([family, file, weight, style]) => {
			const face = new FontFace(family, `url(${staticFile(`fonts/${file}.woff2`)}) format('woff2')`, {weight, style});
			document.fonts.add(face);
			return face.load();
		}),
	).then(() => continueRender(handle));
}

export const fonts = {
	sans: "'Be Vietnam Pro', sans-serif",
	serif: "'Noto Serif', serif",
	serifItalic: "'Noto Serif Italic', 'Noto Serif', serif",
	han: "'Noto Serif TC', serif",
};

export const C = {
	ink: '#14110d',
	ink2: '#1f1a14',
	paper: '#efe3c8',
	paperDim: '#c9b78f',
	gold: '#d9a441',
	goldSoft: '#e8c47a',
	mongol: '#c9452f',
	viet: '#2f9e74',
	supply: '#e0a030',
	neutral: '#b9ad95',
	sea: '#0f1a1f',
	land: '#2a2419',
	landEdge: '#5b4c33',
	river: '#4a7d8c',
	text: '#f3ead6',
	textDim: '#bcae90',
};

export const W = 1920;
export const H = 1080;
