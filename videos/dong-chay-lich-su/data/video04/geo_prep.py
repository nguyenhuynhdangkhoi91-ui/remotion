# Chuẩn bị nền địa hình + đường biên (toạ độ pixel của ảnh nền) cho các bản đồ Remotion của video 4
import json, math, numpy as np
from PIL import Image
OUT='/home/user/remotion/videos/dong-chay-lich-su/public/video04/maps'
def merc(lon,lat,z,x0,y0):
    n=2**z*256
    x=(lon+180)/360*n - x0*256
    s=math.sin(math.radians(lat)); y=(0.5-math.log((1+s)/(1-s))/(4*math.pi))*n - y0*256
    return round(x,1), round(y,1)
# ---- vùng (z7, x99..103, y55..61)
R=dict(z=7,x0=99,y0=55)
img=Image.open('/tmp/w4/maps/region_z7.png'); img.save(OUT+'/region.jpg',quality=90)
g=json.load(open('/tmp/w4/src/ne50.geojson'))
W,H=img.size
def ring_path(coords,P):
    pts=[merc(lo,la,**P) for lo,la in coords]
    return 'M'+'L'.join(f'{x},{y}' for x,y in pts)+'Z'
countries={}
for f in g['features']:
    nm=f['properties']['ADMIN']
    if nm not in ('Vietnam','Laos','Cambodia','Thailand','China','Myanmar','Taiwan'): continue
    geom=f['geometry']; polys=geom['coordinates'] if geom['type']=='MultiPolygon' else [geom['coordinates']]
    d=''
    for poly in polys:
        for ring in poly[:1]:
            if all(lo<97 or lo>114 or la<5 or la>26 for lo,la in ring): continue
            d+=ring_path(ring,R)
    countries[nm]=d
P=lambda lo,la: merc(lo,la,**R)
region={'w':W,'h':H,'countries':countries,'places':{
 'hanoi':P(105.85,21.03),'dbp':P(103.016,21.385),'nasan':P(104.03,21.21),'luang':P(102.135,19.885),
 'vientiane':P(102.6,17.97),'tuangiao':P(103.42,21.59),'laichau':P(103.15,22.06),'saigon':P(106.7,10.78),
 'hue':P(107.58,16.46),'thanhhoa':P(105.78,19.8),'vietbac':P(105.6,21.85),'p17w':P(106.45,17.0),'p17e':P(107.12,17.0),
 'laos_lbl':P(103.3,19.3),'china_lbl':P(104.5,23.4),'thai_lbl':P(101.0,16.2),'gulf_lbl':P(107.3,20.0),'camb_lbl':P(104.9,12.9),
 'camps':P(105.4,21.95)}}
# ---- thung lũng (z12, x3217..3223, y1795..1803), cắt vùng quanh lòng chảo
V=dict(z=12,x0=3217,y0=1795)
e=np.load('/tmp/w4/maps/valley_e.npy')
vimg=Image.open('/tmp/w4/maps/valley_z12.png')
# tô nhẹ đáy lòng chảo (ruộng) cho dễ đọc
a=np.array(vimg).astype(np.float32)
floor=(e<520)[...,None]
a=np.where(floor, a*0.75+np.array([70,92,58.])*0.25*1.4, a)
Image.fromarray(np.clip(a,0,255).astype(np.uint8)).save(OUT+'/valley.jpg',quality=92)
Q=lambda lo,la: merc(lo,la,**V)
# sông Nậm Rốm: đường thấp nhất theo từng hàng trong dải lòng chảo
river=[]
cx,_=Q(103.016,21.385)
for lat in np.linspace(21.46,21.30,40):
    x,y=Q(103.016,lat); yi=int(y)
    lo,hi=int(cx-140),int(cx+140)
    row=e[yi,lo:hi]; xi=lo+int(np.argmin(row+np.abs(np.arange(lo,hi)-cx)*0.05))
    river.append((xi,yi))
river=np.array(river,float)
for _ in range(3): river[1:-1,0]=(river[:-2,0]+river[1:-1,0]+river[2:,0])/3
valley={'w':vimg.width,'h':vimg.height,'river':'M'+'L'.join(f'{x:.1f},{y:.1f}' for x,y in river),'places':{
 'center':Q(103.0135,21.3855),'air_n':Q(103.0045,21.4045),'air_s':Q(103.0105,21.3905),
 'himlam':Q(103.035,21.413),'doclap':Q(103.020,21.435),'banke':Q(102.999,21.408),
 'd1':Q(103.0245,21.394),'c1':Q(103.0265,21.3815),'a1':Q(103.0255,21.3775),
 'huguette':Q(103.003,21.394),'claudine':Q(103.008,21.379),
 'hongcum':Q(103.012,21.333),'hc_air_n':Q(103.0105,21.343),'hc_air_s':Q(103.0125,21.330),
 'river_lbl':Q(103.019,21.36)}}
# vị trí pháo trên vành núi (sơ đồ)
ring=[]
for ang in range(-40,200,16):
    r=0.045 if 0<ang<150 else 0.04
    lo=103.016+r*math.cos(math.radians(ang))*1.05; la=21.39+r*math.sin(math.radians(ang))
    ring.append(Q(lo,la))
valley['ring']=ring
json.dump({'region':region,'valley':valley},open(OUT+'/geo.json','w'))
print('ok', W,H, vimg.size, region['places']['dbp'], valley['places']['center'])
