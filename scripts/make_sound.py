import numpy as np, os
from scipy.io import wavfile
from scipy.signal import butter, sosfilt, lfilter
ROOT=os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SR=44100
rng=np.random.default_rng(7)
def lp(x,f,o=2): return sosfilt(butter(o,f,'low',fs=SR,output='sos'),x)
def hp(x,f,o=2): return sosfilt(butter(o,f,'high',fs=SR,output='sos'),x)
def bp(x,a,b,o=2): return sosfilt(butter(o,[a,b],'band',fs=SR,output='sos'),x)
def T(d): return np.arange(int(d*SR))/SR
def save(path,x,norm=0.9):
    x=np.asarray(x,dtype=np.float64)
    m=np.abs(x).max(); x=x/m*norm if m>0 else x
    os.makedirs(os.path.dirname(path),exist_ok=True)
    wavfile.write(path,SR,(x*32767).astype(np.int16))
def env(n,a,r):
    e=np.ones(n); na=int(a*SR); nr=int(r*SR)
    if na>0: e[:na]=np.linspace(0,1,na)
    if nr>0: e[-nr:]*=np.linspace(1,0,nr)
    return e
# ------------------------------------------------ SFX
S=f"{ROOT}/public/sfx"
def tick(f=1800,d=0.08):
    t=T(d); return np.sin(2*np.pi*f*t)*np.exp(-t*70)+0.5*hp(rng.standard_normal(len(t)),2500)*np.exp(-t*120)
save(f"{S}/tick.wav",tick(2200))
save(f"{S}/tock.wav",tick(1400,0.1))
t=T(9.0)
boom=np.zeros_like(t)
f=28+34*np.exp(-t*0.9); ph=2*np.pi*np.cumsum(f)/SR
boom+=np.sin(ph)*np.exp(-t*0.45)
boom+=0.6*lp(rng.standard_normal(len(t)),180,3)*np.exp(-t*0.6)*(1+0.4*np.sin(2*np.pi*3.3*t))
boom+=0.35*lp(rng.standard_normal(len(t)),700,2)*np.exp(-t*2.2)
boom*=np.minimum(1,t/0.04)
save(f"{S}/boom.wav",boom,0.95)
# flash: short high swell + crack
t=T(1.2); fl=hp(rng.standard_normal(len(t)),3000)*np.exp(-t*5)*np.minimum(1,t/0.01)+0.4*np.sin(2*np.pi*90*t)*np.exp(-t*8)
save(f"{S}/flash.wav",fl,0.8)
def whoosh(d=0.9,a=300,b=3500):
    t=T(d); n=rng.standard_normal(len(t)); out=np.zeros_like(t)
    seg=8
    for k in range(seg):
        i0=k*len(t)//seg;i1=(k+1)*len(t)//seg
        fc=a*(b/a)**((k+.5)/seg); out[i0:i1]=bp(n[i0:i1],fc*0.7,min(fc*1.4,20000),2)
    e=np.sin(np.pi*np.linspace(0,1,len(t)))**2
    return out*e
save(f"{S}/whoosh.wav",whoosh(),0.7)
save(f"{S}/whoosh_long.wav",whoosh(1.8,150,2500),0.7)
def click(d=0.05,f=3200):
    t=T(d); return np.sin(2*np.pi*f*t)*np.exp(-t*160)*0.7+0.3*hp(rng.standard_normal(len(t)),4000)*np.exp(-t*300)
save(f"{S}/click.wav",click(),0.6)
save(f"{S}/ui_pop.wav",np.sin(2*np.pi*(700+900*np.exp(-T(0.12)*40))*T(0.12))*np.exp(-T(0.12)*40),0.55)
# stamp
t=T(0.7); st=np.sin(2*np.pi*(70*np.exp(-t*6)+40)*t)*np.exp(-t*9)+0.7*lp(rng.standard_normal(len(t)),1500)*np.exp(-t*40)
save(f"{S}/stamp.wav",st,0.95)
# mousetrap snap: sharp clack with spring ring
t=T(0.25); sn=hp(rng.standard_normal(len(t)),1500)*np.exp(-t*90)+0.5*np.sin(2*np.pi*2400*t)*np.exp(-t*50)+0.4*np.sin(2*np.pi*330*t)*np.exp(-t*25)
save(f"{S}/snap.wav",sn,0.8)
# ping pong ball tick
t=T(0.12); pp=np.sin(2*np.pi*(1300+500*np.exp(-t*30))*t)*np.exp(-t*45)
save(f"{S}/pingpong.wav",pp,0.5)
# counter tick (soft)
t=T(0.04); save(f"{S}/count.wav",np.sin(2*np.pi*1200*t)*np.exp(-t*90),0.45)
# heartbeat-ish low thump
t=T(0.5); th=np.sin(2*np.pi*(55*np.exp(-t*8)+35)*t)*np.exp(-t*10)
save(f"{S}/thump.wav",th,0.9)
# paper
t=T(0.3); save(f"{S}/paper.wav",bp(rng.standard_normal(len(t)),1500,7000)*np.exp(-t*14)*np.minimum(1,t/0.01),0.5)
# soft low hit
t=T(2.5); lh=np.sin(2*np.pi*55*t)*np.exp(-t*2)+0.5*np.sin(2*np.pi*82.4*t)*np.exp(-t*3); save(f"{S}/low_hit.wav",lh,0.8)
# fizzle "pfff"
t=T(0.6); fz=bp(rng.standard_normal(len(t)),800,5000)*np.exp(-t*7)*np.minimum(1,t/0.02); save(f"{S}/pfff.wav",fz,0.6)
# implosion thud w/ rising
t=T(1.6); im=np.sin(2*np.pi*(40+300*np.exp(-t*3))*t)*np.exp(-t*2.5)*np.minimum(1,t/0.01); save(f"{S}/implode.wav",im,0.9)
# ------------------------------------------------ MUSIC stems (loop 64 s, seamless via periodic LFOs/ integer cycles)
M=f"{ROOT}/public/music"
L=64.0; t=T(L); N=len(t)
def pad_note(f,t,detune=0.003,voices=5):
    out=np.zeros_like(t)
    for v in range(voices):
        d=1+detune*(v-(voices-1)/2)
        # sawtooth-ish via few harmonics, slow vibrato
        ph=2*np.pi*f*d*t
        for h,a in ((1,1),(2,.5),(3,.33),(4,.25),(5,.16)):
            out+=a*np.sin(h*ph+v)/voices
    return out
def smooth_chord(freqs,seg):
    # per-chord with crossfade, seamless loop since each chord window is periodic-enveloped
    out=np.zeros(N); n=len(freqs); w=L/n
    for k,ch in enumerate(freqs):
        c=sum(pad_note(f,t) for f in ch)
        c=lp(c,1800,2)
        c0=k*w
        e=np.sin(np.pi*np.clip((t-c0+w*0.5)/(w*2),0,1))**2
        # wrap-around
        e=np.zeros(N)
        for shift in (-L,0,L):
            x=(t+shift-c0)/(w*2)+0.25
            e+=np.where((x>0)&(x<1),np.sin(np.pi*x)**2,0)
        out+=c*e
    return out
D2,A2,F2,Bb2,G2,C3=73.42,110.0,87.31,116.54,98.0,130.81
chords=[[146.83,174.61,220.0],[116.54,146.83,174.61],[98.0,116.54,146.83],[110.0,138.59,164.81]]  # Dm Bb Gm A
strings=smooth_chord(chords,0)
sl=np.sin(2*np.pi*(1/16)*t)*0.2+0.8   # 4 cycles in 64s
strings=lp(strings*sl,2200)
save(f"{M}/strings.wav",strings,0.8)
# drone: D1 + fifth, slow-moving filtered noise
dr=np.sin(2*np.pi*36.71*t)+0.6*np.sin(2*np.pi*73.42*t+1)+0.25*np.sin(2*np.pi*110.13*t)
dr*=0.8+0.2*np.sin(2*np.pi*t/32)
nz=lp(rng.standard_normal(N),220,3)*0.5
dr=dr+nz*(0.7+0.3*np.sin(2*np.pi*t/16))
save(f"{M}/drone.wav",dr,0.8)
# pulse: soft low pulse 54 bpm (0.9 beats/s -> 64s*0.9=57.6 not int) use 60bpm
pl=np.zeros(N)
for k in range(int(L)):
    i=int(k*SR); tt=T(0.7); p=np.sin(2*np.pi*(48*np.exp(-tt*6)+38)*tt)*np.exp(-tt*8)
    pl[i:i+len(tt)]+=p[:N-i]
    if k%4==3:
        j=i+int(0.5*SR)
        if j<N: pl[j:j+len(tt)]+=0.5*p[:N-j]
save(f"{M}/pulse.wav",pl,0.9)
# human: sparse melancholic pluck/sine motif in D minor over 64 s
hm=np.zeros(N)
notes=[(0,293.66,4),(4,349.23,4),(8,329.63,4),(12,293.66,6),(18,261.63,3),(22,293.66,5),(28,220.0,6),(34,246.94,3),(38,261.63,4),(42,293.66,4),(46,349.23,4),(50,440.0,6),(56,392.0,4),(60,349.23,4)]
for s,f,d in notes:
    tt=T(d+2); n=(np.sin(2*np.pi*f*tt)+0.3*np.sin(4*np.pi*f*tt)+0.1*np.sin(6*np.pi*f*tt))*np.exp(-tt*0.9)*np.minimum(1,tt/0.02)
    i=int(s*SR)
    seg=n[:N-i] if i+len(n)>N else n
    hm[i:i+len(seg)]+=seg
    if i+len(n)>N: hm[:len(n)-(N-i)]+=n[N-i:]   # wrap for seamless loop
echo=np.zeros(N+SR*3); 
for dl,g in ((0.37,0.45),(0.74,0.25),(1.3,0.12)): 
    k=int(dl*SR); echo[k:k+N]+=hm*g
hm=hm+echo[:N]; hm[:int(1.3*SR)]+=echo[N:N+int(1.3*SR)][:int(1.3*SR)] if False else 0
save(f"{M}/human.wav",lp(hm,3500),0.8)
# resolve: warm major pad (D / A / Bb lydian) 64s
ch2=[[146.83,185.0,220.0],[110.0,164.81,220.0],[116.54,146.83,220.0,293.66],[146.83,185.0,220.0,277.18]]
rs=lp(smooth_chord(ch2,0),2600); save(f"{M}/resolve.wav",rs,0.8)
# riser (one-shot 24 s) for Trinity
t2=T(24); f=60+500*(t2/24)**3; ph=2*np.pi*np.cumsum(f)/SR
ri=(np.sin(ph)+0.5*np.sin(2*ph)+0.3*np.sign(np.sin(ph)))*(t2/24)**2.2
ri+=hp(rng.standard_normal(len(t2)),2000)*(t2/24)**4*0.5
ri=lp(ri,4000)*np.minimum(1,t2/2)
save(f"{M}/riser.wav",ri,0.8)
print("ok")
