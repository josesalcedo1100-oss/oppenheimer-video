import json, re, subprocess, os, sys
import numpy as np
from scipy.io import wavfile
ROOT=os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
RAW=f"{ROOT}/audio_elevenlabs/raw"; OUT=f"{ROOT}/public/audio"
os.makedirs(OUT,exist_ok=True)
order=["520f0df9_T08_50_32_","eb9fb5a7_T08_57_54_","a910a15f_T08_58_58_","b7db0dad_T08_59_45_","77af0356_T09_00_14_","4cf2e3c9_T09_00_51_","29a0aa2e_T09_01_12_","8a532b09_T09_05_58_","0410ffde_T09_06_39_","acceffac_T09_07_12_","32273e2d_T09_08_10_"]
script=json.load(open(f"{ROOT}/data/script.json"))
SR=44100
def sh(c): return subprocess.run(c,shell=True,capture_output=True,text=True)
manifest=[]
for i,stem in enumerate(order,1):
    src=f"{RAW}/{stem}.mp3"
    tmp=f"/tmp/s{i}.wav"
    sh(f'ffmpeg -y -v error -i {src} -ac 1 -ar {SR} {tmp}')
    sr,x=wavfile.read(tmp); x=x.astype(np.float32)/32768
    # speech envelope
    win=int(0.01*SR); n=len(x)//win
    env=np.sqrt((x[:n*win].reshape(n,win)**2).mean(1))+1e-9
    db=20*np.log10(env)
    thr=max(db.max()-38,-60)
    sp=db>thr
    idx=np.where(sp)[0]
    s0,s1=idx[0],idx[-1]+1
    # trim keeping 120ms air
    a=max(0,int((s0*win)-0.12*SR)); b=min(len(x),int(s1*win+0.15*SR))
    y=x[a:b].copy()
    f=int(0.015*SR); y[:f]*=np.linspace(0,1,f); y[-f:]*=np.linspace(1,0,f)
    # pauses inside speech (>=180 ms)
    gaps=[]; run=None
    for k in range(s0,s1):
        if not sp[k]:
            run=k if run is None else run
        else:
            if run is not None and (k-run)>=18: gaps.append(((run+k)/2*win-a)/SR)
            run=None
    tmpn=f"/tmp/n{i}.wav"
    wavfile.write(tmpn,SR,(np.clip(y,-1,1)*32767).astype(np.int16))
    out=f"{OUT}/scene-{i:02d}.wav"
    # 2-pass-ish loudnorm single pass to -16 LUFS, TP -1
    sh(f'ffmpeg -y -v error -i {tmpn} -af loudnorm=I=-16:TP=-1.5:LRA=7 -ar 48000 -ac 1 {out}')
    dur=float(sh(f'ffprobe -v error -show_entries format=duration -of csv=p=0 {out}').stdout)
    # --- word timing: pause-weighted proportional + snap to detected gaps
    paras=script[i-1]['paragraphs']
    words=[];bounds=[]  # bounds: expected pause positions as word index after which a pause occurs
    for p in paras:
        for w in p.split():
            words.append(w)
            if re.search(r'[\.\?\!…:]["»”]?$',w): bounds.append((len(words),0.45))
            elif re.search(r'[,;]["»”]?$',w): bounds.append((len(words),0.2))
        if bounds and bounds[-1][0]==len(words): bounds[-1]=(len(words),0.7)
        else: bounds.append((len(words),0.7))
    if '[TU PRÓXIMO VÍDEO]' in ' '.join(words):
        pass
    wt=[max(1,len(re.sub(r'\W','',w)))+1.5 for w in words]
    bd=dict(bounds)
    pw=0.12*sum(wt)/len(wt)  # pause unit in "weight"
    cum=[0.0]; marks=[]
    for k,w in enumerate(wt):
        cum.append(cum[-1]+w)
        if (k+1) in bd and k+1<len(words): cum[-1]+=bd[k+1]*pw*8; marks.append((k+1,cum[-1]))
    tot=cum[-1]
    t0=0.12; t1=dur-0.15
    pos=lambda c: t0+(t1-t0)*c/tot
    exp=[(k,pos(c)) for k,c in marks]
    # anchor expected pauses to detected gaps (monotone, tol 1.2s)
    gaps_t=sorted(gaps); anchors=[(t0,t0),(t1,t1)]; gi=0; used=set()
    # compute pause start of gap = detected time; expected boundary time; match greedy
    for k,e in exp:
        best=None;bd_=1.2
        for g in gaps_t:
            if g in used: continue
            if abs(g-e)<bd_: bd_=abs(g-e);best=g
        if best is not None and all(best>a_[1] for a_ in anchors if a_[0]<e) and all(best<a_[1] for a_ in anchors if a_[0]>e):
            anchors.append((e,best)); used.add(best)
    anchors=sorted(set(anchors))
    ax=[a_[0] for a_ in anchors]; ay=[a_[1] for a_ in anchors]
    # word times: start/end from proportional timeline then warp
    wl=[]
    for k,w in enumerate(words):
        s=pos(cum[k]); e=pos(cum[k+1] - (bd.get(k+1,0)*pw*8 if (k+1) in bd and k+1<len(words) else 0))
        wl.append({"w":w,"s":round(float(np.interp(s,ax,ay)),3),"e":round(float(np.interp(e,ax,ay)),3)})
    for k in range(len(wl)-1):
        if wl[k]['e']>wl[k+1]['s']: wl[k]['e']=wl[k+1]['s']
    manifest.append({"scene":i,"title":script[i-1]['title'],"source":f"audio_elevenlabs/raw/{stem}.mp3","file":f"audio/scene-{i:02d}.wav","duration":round(dur,3),"anchors_used":len(anchors)-2,"gaps_detected":len(gaps),"words":wl})
    print(i,stem,round(dur,2),'gaps',len(gaps),'anchors',len(anchors)-2,flush=True)
json.dump({"method":"ffmpeg/numpy silence detection + proportional word distribution (Whisper model not downloadable)","scenes":manifest},open(f"{OUT}/manifest.json","w"),ensure_ascii=False,indent=1)
