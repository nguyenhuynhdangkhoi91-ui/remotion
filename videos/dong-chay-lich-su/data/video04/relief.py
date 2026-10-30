import numpy as np, glob, os, math
from PIL import Image
D='/tmp/w4/dem'
def mosaic(z,xs,ys):
    rows=[]
    for y in ys:
        rows.append(np.concatenate([np.array(Image.open(f'{D}/z{z}_{x}_{y}.png').convert('RGB')).astype(np.float32) for x in xs],1))
    a=np.concatenate(rows,0)
    return a[...,0]*256+a[...,1]+a[...,2]/256-32768
def shade(e, zf, az=315, alt=40, cell=1.0):
    gy,gx=np.gradient(e/cell*zf)
    slope=np.pi/2-np.arctan(np.hypot(gx,gy)); aspect=np.arctan2(-gx,gy)
    a=math.radians(az); al=math.radians(alt)
    return np.clip(np.sin(al)*np.sin(slope)+np.cos(al)*np.cos(slope)*np.cos(a-aspect),0,1)
def colorize(e, hs, sea=True, lo=0, hi=2500):
    t=np.clip((e-lo)/(hi-lo),0,1)[...,None]
    c0=np.array([58,70,52.]); c1=np.array([120,112,82.]); c2=np.array([196,180,140.])
    col=np.where(t<0.5, c0+(c1-c0)*(t/0.5), c1+(c2-c1)*((t-0.5)/0.5))
    col=col*(0.45+0.75*hs[...,None])
    if sea:
        m=(e<=0)[...,None]; col=np.where(m, np.array([22,34,40.]), col)
    return np.clip(col,0,255).astype(np.uint8)
# vùng: z7 x99-103 y55-61
e=mosaic(7,range(99,104),range(55,62))
hs=shade(e, 0.012)
Image.fromarray(colorize(e,hs,True,0,2600)).save('/tmp/w4/maps/region_z7.png')
# thung lũng: z12 x3217-3223 y1795-1803
e=mosaic(12,range(3217,3224),range(1795,1804))
print('valley elev', e.min(), e.max())
hs=shade(e, 0.06)
Image.fromarray(colorize(e,hs,False,420,1500)).save('/tmp/w4/maps/valley_z12.png')
np.save('/tmp/w4/maps/valley_e.npy', e)
