import {geoMercator, geoPath, type GeoProjection} from 'd3-geo';
import {feature} from 'topojson-client';
import land50 from 'world-atlas/land-50m.json';
import land10 from 'world-atlas/land-10m.json';
import riversData from '../../data/geo/rivers_sea.json';
import {H, W} from './theme';

type LonLat = [number, number];

// Dữ liệu nền: Natural Earth (public domain) qua gói world-atlas.
const toLand = (topo: any) => feature(topo, topo.objects.land) as any;
export const LAND_50 = toLand(land50);
export const LAND_10 = toLand(land10);
export const RIVERS = riversData as any;

export type View = {center: LonLat; scale: number; detail: '50' | '10'};

export const VIEWS: Record<string, View> = {
	world: {center: [75, 42], scale: 620, detail: '50'},
	eastasia: {center: [110, 30], scale: 1500, detail: '50'},
	seas: {center: [117, 15], scale: 1350, detail: '50'},
	region: {center: [106, 21.5], scale: 3200, detail: '50'},
	daiviet: {center: [106, 19.6], scale: 5600, detail: '10'},
	delta: {center: [106.4, 21.0], scale: 17000, detail: '10'},
	bachdang: {center: [106.78, 20.94], scale: 62000, detail: '10'},
};

// Vị trí gần đúng (kinh độ, vĩ độ) của các địa danh.
export const PLACES: Record<string, {at: LonLat; name: string; side?: 'l' | 'r' | 't' | 'b'}> = {
	thanglong: {at: [105.85, 21.03], name: 'Thăng Long', side: 'l'},
	vankiep: {at: [106.38, 21.13], name: 'Vạn Kiếp', side: 'r'},
	bachdang: {at: [106.8, 20.93], name: 'Sông Bạch Đằng', side: 'r'},
	vandon: {at: [107.42, 21.07], name: 'Vân Đồn', side: 'r'},
	binhle: {at: [105.67, 21.3], name: 'Bình Lệ Nguyên', side: 'l'},
	dongbodau: {at: [105.87, 21.05], name: 'Đông Bộ Đầu', side: 't'},
	thienmac: {at: [106.0, 20.9], name: 'Sông Thiên Mạc', side: 'r'},
	quyhoa: {at: [104.6, 21.95], name: 'Trại Quy Hóa', side: 'l'},
	hamtu: {at: [105.98, 20.84], name: 'Hàm Tử', side: 'r'},
	chuongduong: {at: [105.88, 20.87], name: 'Chương Dương', side: 'l'},
	tayket: {at: [106.03, 20.79], name: 'Tây Kết', side: 'r'},
	thientruong: {at: [106.18, 20.45], name: 'Thiên Trường', side: 'r'},
	thanhhoa: {at: [105.78, 19.8], name: 'Thanh Hóa', side: 'l'},
	nghean: {at: [105.68, 18.67], name: 'Nghệ An', side: 'l'},
	longhung: {at: [106.35, 20.53], name: 'Long Hưng', side: 'r'},
	binhthan: {at: [106.3, 21.08], name: 'Bình Than', side: 'b'},
	noibang: {at: [106.55, 21.37], name: 'Nội Bàng', side: 'r'},
	tuminh: {at: [107.07, 22.13], name: 'Tư Minh', side: 'r'},
	kunming: {at: [102.71, 25.04], name: 'Vân Nam', side: 'l'},
	dali: {at: [100.23, 25.6], name: 'Đại Lý', side: 'l'},
	guangxi: {at: [108.3, 22.8], name: 'Quảng Tây', side: 'r'},
	tanzhou: {at: [112.94, 28.23], name: 'Đàm Châu', side: 'r'},
	chengdu: {at: [104.07, 30.67], name: 'Thành Đô', side: 'l'},
	karakorum: {at: [102.83, 47.2], name: 'Karakorum', side: 't'},
	zhongdu: {at: [116.4, 39.9], name: 'Trung Đô', side: 'r'},
	dadu: {at: [116.4, 39.9], name: 'Đại Đô (Bắc Kinh)', side: 'r'},
	linan: {at: [120.15, 30.27], name: 'Lâm An', side: 'r'},
	baghdad: {at: [44.37, 33.31], name: 'Baghdad', side: 'b'},
	samarkand: {at: [66.97, 39.65], name: 'Samarkand', side: 'b'},
	kyiv: {at: [30.52, 50.45], name: 'Kyiv', side: 't'},
	poland: {at: [16.5, 51.2], name: 'Ba Lan', side: 't'},
	guangzhou: {at: [113.26, 23.13], name: 'Quảng Châu', side: 'r'},
	vijaya: {at: [109.1, 13.9], name: 'Vijaya (Chăm Pa)', side: 'r'},
	qinzhou: {at: [108.62, 21.95], name: 'Khâm Châu', side: 'r'},
	quanzhou: {at: [118.59, 24.9], name: 'Tuyền Châu', side: 'r'},
	hakata: {at: [130.4, 33.6], name: 'Hakata (Nhật Bản)', side: 'r'},
	java: {at: [112.38, -7.55], name: 'Java', side: 'b'},
	yengiang: {at: [106.81, 20.935], name: 'Bãi cọc Yên Giang', side: 'r'},
	vanmuoi: {at: [106.835, 20.9], name: 'Đồng Vạn Muối', side: 'r'},
	mangua: {at: [106.86, 20.875], name: 'Đồng Má Ngựa', side: 'r'},
	caoquy: {at: [106.72, 20.975], name: 'Bãi cọc Cao Quỳ', side: 'l'},
};

// Vùng lãnh thổ vẽ phỏng chừng, chỉ để minh họa (được cắt theo đường bờ biển).
export const REGIONS: Record<string, {name: string; color: string; label: LonLat; poly: LonLat[]}> = {
	mongol_1259: {
		name: 'Đế quốc Mông Cổ (~1259)', color: '#c9452f', label: [92, 46],
		poly: [[25, 47], [30, 52], [38, 57], [50, 58], [60, 58], [75, 55], [90, 54], [105, 53], [118, 53], [128, 50], [131, 44], [126, 40], [122, 40], [120, 36], [121, 33], [118, 33], [112, 32.5], [108, 32.5], [104, 31], [103.5, 29], [104.5, 26], [103.5, 23], [101, 21.5], [98.5, 24], [97, 28], [92, 29], [85, 28.5], [80, 30], [75, 33], [70, 32], [65, 30], [60, 27], [56, 27], [52, 29], [48, 30], [45, 31], [42, 34], [38, 36.5], [33, 36.5], [29, 38], [30, 41], [35, 42], [40, 41], [42, 43], [38, 45], [33, 45], [30, 46.5]],
	},
	song: {
		name: 'Nam Tống', color: '#d9a441', label: [113, 26.5],
		poly: [[122, 32.5], [112, 32.5], [108, 32.5], [104, 31], [105.5, 28.5], [106, 26.5], [105, 24.5], [106.5, 23], [108, 21.6], [109.5, 21.4], [110.5, 20.3], [111, 21.4], [113.5, 22.2], [116, 22.8], [119, 25], [120, 27], [121.5, 29], [122.5, 31]],
	},
	dali: {
		name: 'Đại Lý (Vân Nam)', color: '#8f7cc0', label: [100.8, 25.2],
		poly: [[98.5, 24], [101, 21.5], [103.5, 22.6], [104.5, 24.5], [104, 26.5], [102.5, 27.5], [100, 28], [98.5, 27]],
	},
	daiviet: {
		name: 'Đại Việt', color: '#2f9e74', label: [105.5, 19.5],
		poly: [[102.2, 22.4], [103.5, 22.7], [105.5, 23.2], [106.7, 22.9], [107.5, 21.7], [108.4, 21.5], [107.8, 20.6], [106.7, 19.9], [106.2, 19.3], [106.0, 18.6], [106.7, 17.8], [107.2, 16.95], [106.5, 16.7], [105.4, 18.2], [104.5, 19.3], [103.8, 20.2], [103, 20.8], [102.2, 21.5]],
	},
	champa: {
		name: 'Chăm Pa', color: '#b26aa0', label: [108.0, 14.4],
		poly: [[107.2, 16.95], [108.4, 16.2], [109.0, 15.3], [109.5, 13.5], [109.4, 12.2], [109.1, 11.2], [107.8, 10.6], [106.8, 11.6], [106.6, 13.0], [107.2, 14.5], [107.5, 15.5], [106.5, 16.7]],
	},
	yuan_1280: {
		name: 'Nhà Nguyên (~1280)', color: '#c9452f', label: [103, 36],
		poly: [[73, 40], [80, 45], [87, 49], [95, 52], [105, 53], [118, 53], [128, 50], [134, 48], [131, 43], [126, 40], [122, 40], [119, 36], [121, 33], [122.5, 30], [120, 26], [117, 23.5], [113.5, 22.2], [111, 21.4], [109.5, 21.4], [108, 21.6], [106.7, 22.9], [105.5, 23.2], [103.5, 22.7], [101, 21.5], [98.5, 24], [97.5, 28], [92, 28], [85, 28], [79, 31], [75, 35], [73, 38]],
	},
};

export const makeProjection = (v: View): GeoProjection =>
	geoMercator().center(v.center).scale(v.scale).translate([W / 2, H / 2]).precision(0.3);

// Chiếu (lon, lat) theo một góc nhìn nội suy giữa hai view (Mercator nên chỉ là phép co giãn + tịnh tiến).
export const lerpView = (a: View, b: View, t: number): View => {
	const pa = makeProjection(a);
	const cb = pa(b.center)!;
	const ca: [number, number] = [W / 2, H / 2];
	const k = Math.exp(Math.log(a.scale) + (Math.log(b.scale) - Math.log(a.scale)) * t) / a.scale;
	// tâm nội suy trong mặt phẳng chiếu của a, có tính hệ số zoom để chuyển động đều
	const zt = (Math.pow(b.scale / a.scale, t) - 1) / (b.scale / a.scale - 1 || 1);
	const tt = Math.abs(b.scale / a.scale - 1) < 1e-6 ? t : zt;
	const c: [number, number] = [ca[0] + (cb[0] - ca[0]) * tt, ca[1] + (cb[1] - ca[1]) * tt];
	const center = pa.invert!(c) as LonLat;
	return {center, scale: a.scale * k, detail: b.detail};
};

export const pathFor = (proj: GeoProjection) => geoPath(proj);
