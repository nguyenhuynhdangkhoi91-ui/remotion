# Chuẩn bị nền địa hình (AWS Terrain Tiles/Terrarium) + sông Nile, biên giới (Natural Earth) cho bản đồ video 7 (Giza / Merer).
# usage: geo_prep.py dem_dir src_dir out_dir
import json, math, sys, numpy as np
from PIL import Image, ImageFilter
D, SRC, OUT = sys.argv[1:4]
def mosaic(z, xs, ys):
    rows = [np.concatenate([np.array(Image.open(f'{D}/z{z}_{x}_{y}.png').convert('RGB')).astype(np.float32) for x in xs], 1) for y in ys]
    a = np.concatenate(rows, 0)
    return a[..., 0] * 256 + a[..., 1] + a[..., 2] / 256 - 32768
def shade(e, zf, az=315, alt=40):
    gy, gx = np.gradient(e * zf)
    slope = np.pi / 2 - np.arctan(np.hypot(gx, gy)); aspect = np.arctan2(-gx, gy)
    a, al = math.radians(az), math.radians(alt)
    return np.clip(np.sin(al) * np.sin(slope) + np.cos(al) * np.cos(slope) * np.cos(a - aspect), 0, 1)
def colorize(e, hs, lo, hi, land=None):
    # tông cát dịu, không vàng gắt; biển xanh đậm
    t = np.clip((e - lo) / (hi - lo), 0, 1)[..., None]
    c0 = np.array([96, 86, 66.]); c1 = np.array([150, 128, 96.]); c2 = np.array([196, 178, 150.])
    col = np.where(t < 0.5, c0 + (c1 - c0) * (t / 0.5), c1 + (c2 - c1) * ((t - 0.5) / 0.5))
    col = col * (0.5 + 0.65 * hs[..., None])
    sea = (e <= 0.5) if land is None else ~land
    col = np.where(sea[..., None], np.array([24, 40, 52.]), col)
    return np.clip(col, 0, 255).astype(np.uint8)
def merc(lon, lat, z, x0, y0):
    n = 2 ** z * 256
    x = (lon + 180) / 360 * n - x0 * 256
    s = math.sin(math.radians(lat)); y = (0.5 - math.log((1 + s) / (1 - s)) / (4 * math.pi)) * n - y0 * 256
    return round(x, 1), round(y, 1)
rivers = json.load(open(f'{SRC}/ne_10m_rivers_lake_centerlines.geojson'))
countries = json.load(open(f'{SRC}/ne_50m_admin_0_countries.geojson'))
def lines(names, P, box):
    out = []
    for f in rivers['features']:
        if f['properties'].get('name') not in names: continue
        g = f['geometry']; cs = g['coordinates'] if g['type'] == 'MultiLineString' else [g['coordinates']]
        for c in cs:
            c = [(lo, la) for lo, la in c if box[0] <= lo <= box[2] and box[1] <= la <= box[3]]
            if len(c) > 1: out.append('M' + 'L'.join('%.1f,%.1f' % P(lo, la) for lo, la in c))
    return ''.join(out)
res = {}
# ---- Ai Cập: z8 x145..154 y102..111
E = dict(z=8, x0=145, y0=102); P = lambda lo, la: merc(lo, la, **E)
e = mosaic(8, range(145, 155), range(102, 112))
# mặt nạ đất liền từ đa giác quốc gia (vùng trũng Qattara thấp hơn mực biển nhưng không phải biển)
from PIL import ImageDraw
mk = Image.new('L', (e.shape[1], e.shape[0]), 0); dr = ImageDraw.Draw(mk)
for f in countries['features']:
    g = f['geometry']; polys = g['coordinates'] if g['type'] == 'MultiPolygon' else [g['coordinates']]
    for poly in polys:
        if all(lo < 20 or lo > 42 or la < 18 or la > 36 for lo, la in poly[0]): continue
        dr.polygon([P(lo, la) for lo, la in poly[0]], fill=255)
land = (np.array(mk) > 0) | (e > 3)
land &= ~((e <= 0.5) & (np.array(mk) == 0))
Image.fromarray(colorize(e, shade(e, 0.006), -50, 1000, land)).save(f'{OUT}/egypt.jpg', quality=90)
eg = ''
for f in countries['features']:
    if f['properties']['ADMIN'] != 'Egypt': continue
    g = f['geometry']; polys = g['coordinates'] if g['type'] == 'MultiPolygon' else [g['coordinates']]
    for poly in polys: eg += 'M' + 'L'.join('%.1f,%.1f' % P(lo, la) for lo, la in poly[0]) + 'Z'
pl = {k: P(*v) for k, v in {
    'giza': (31.134, 29.979), 'cairo': (31.24, 30.05), 'memphis': (31.25, 29.845), 'tura': (31.28, 29.93),
    'saqqara': (31.216, 29.871), 'dahshur': (31.206, 29.79), 'meidum': (31.157, 29.388),
    'jarf': (32.60, 28.97), 'sukhna': (32.35, 29.60), 'maghara': (33.37, 28.90), 'serabit': (33.46, 29.04),
    'aswan': (32.90, 24.09), 'hatnub': (31.0, 27.55), 'luxor': (32.64, 25.70), 'giza_road': (31.9, 29.55),
    'med_lbl': (28.8, 31.9), 'red_lbl': (34.6, 26.4), 'sinai_lbl': (33.85, 29.55), 'suez_lbl': (32.95, 29.25),
    'desert_lbl': (27.5, 27.0), 'east_lbl': (32.2, 27.3), 'delta_lbl': (31.0, 30.9)}.items()}
# tuyến Aswan → Giza bám theo dòng Nile (đoạn sông chính Natural Earth, từ đập Aswan tới Cairo)
seg = next(f for f in rivers['features'] if f['properties'].get('name') == 'Nile' and f['properties'].get('featurecla') == 'River')['geometry']['coordinates'][0]
i0 = min(range(len(seg)), key=lambda i: math.hypot(seg[i][0] - 32.90, seg[i][1] - 24.09))
i1 = min(range(len(seg)), key=lambda i: math.hypot(seg[i][0] - 31.21, seg[i][1] - 29.98))
route = [P(lo, la) for lo, la in seg[i0:i1 + 1:3]] + [pl['giza']]
res['egypt'] = {'route_aswan': route, 'w': e.shape[1], 'h': e.shape[0], 'nile': lines({'Nile', 'Rosetta Branch', 'Damietta Branch'}, P, (24, 21, 37, 32)), 'country': eg, 'places': pl}
# ---- Giza–Tura: z12 x2401..2405 y1688..1692
G = dict(z=12, x0=2401, y0=1688); Q = lambda lo, la: merc(lo, la, **G)
e = np.clip(mosaic(12, range(2401, 2406), range(1688, 1693)), 8, None)  # bỏ điểm nhiễu âm trong đô thị
print('giza elev', e.min(), e.max())
img = colorize(e, shade(e, 0.035), 10, 220)
Image.fromarray(img).save(f'{OUT}/giza.jpg', quality=92)
pg = {k: Q(*v) for k, v in {
    'khufu': (31.1342, 29.9792), 'khafre': (31.1308, 29.9761), 'menkaure': (31.1281, 29.9725), 'sphinx': (31.1376, 29.9753),
    'village': (31.1385, 29.9715), 'basin': (31.152, 29.972), 'tura': (31.285, 29.935), 'tura_q': (31.30, 29.925),
    'nile_w': (31.205, 29.955), 'nile_e': (31.235, 29.948), 'cairo_lbl': (31.24, 30.04), 'mokattam': (31.30, 30.01),
    'memphis': (31.25, 29.86), 'cemetery': (31.137, 29.970), 'plateau_lbl': (31.115, 29.985)}.items()}
res['giza'] = {'w': e.shape[1], 'h': e.shape[0], 'nile': lines({'Nile'}, Q, (31.0, 29.8, 31.45, 30.1)), 'places': pg}
json.dump(res, open(f'{OUT}/geo.json', 'w'))
print('ok', res['egypt']['w'], res['egypt']['h'], pl['giza'], pl['jarf'], pg['khufu'], pg['tura'], len(res['giza']['nile']))
