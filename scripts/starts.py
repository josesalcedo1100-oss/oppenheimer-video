import json,math,sys
m=json.load(open('public/audio/manifest.json'))['scenes']
VO={1:165};TAIL={8:96,10:40,11:600}
c=0;out=[]
for i,s in enumerate(m):
    n=s['scene'];vo=VO.get(n,10);d=vo+math.ceil(s['duration']*30)+TAIL.get(n,18)
    out.append((n,c,d,vo));c+=d-(15 if i<len(m)-1 else 0)
if len(sys.argv)>1:
    # args like 2:120 -> absolute frame
    print(' '.join(str(out[int(a.split(':')[0])-1][1]+int(a.split(':')[1])) for a in sys.argv[1:]))
else:
    for o in out: print('scene',o[0],'start',o[1],'dur',o[2],'vo',o[3])
    print('total',c)
