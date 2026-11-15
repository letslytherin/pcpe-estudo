"""Gera os episódios de podcast (MP3, duas vozes) a partir dos roteiros em fonte/podcast/*.txt.
Roteiro: primeira linha 'TITULO: ...', depois linhas 'ANA: ...' e 'CAIO: ...'.
Saída: ../podcast/<id>.mp3 e ../podcast/index.json. Só refaz o que mudou."""
import os,re,json,asyncio,subprocess,tempfile,hashlib,shutil
import edge_tts
HERE=os.path.dirname(os.path.abspath(__file__))
SRC=os.path.join(HERE,'podcast');OUT=os.path.normpath(os.path.join(HERE,'..','podcast'))
os.makedirs(OUT,exist_ok=True)
VOZ={'ANA':'pt-BR-FranciscaNeural','CAIO':'pt-BR-AntonioNeural'}
RATE='+6%'
FF=shutil.which('ffmpeg') or 'ffmpeg'
def parse(p):
    t=open(p,encoding='utf-8').read().strip().split('\n')
    title=t[0].split(':',1)[1].strip();lines=[]
    for l in t[1:]:
        m=re.match(r'(ANA|CAIO):\s*(.+)',l.strip())
        if m:lines.append((m.group(1),m.group(2)))
    return title,lines
async def tts(text,voice,path):
    for k in range(4):
        try:
            await edge_tts.Communicate(text,voice,rate=RATE).save(path)
            if os.path.getsize(path)>500:return
        except Exception as e:
            err=e
        await asyncio.sleep(2+k*3)
    raise RuntimeError('TTS falhou: '+text[:40])
def dur(p):
    r=subprocess.run([FF,'-i',p],capture_output=True,text=True)
    m=re.search(r'Duration: (\d+):(\d+):([\d.]+)',r.stderr)
    return int(m.group(1))*3600+int(m.group(2))*60+float(m.group(3)) if m else 0
async def build(id_,title,lines):
    td=tempfile.mkdtemp()
    sem=asyncio.Semaphore(4)
    async def one(i,sp,tx):
        async with sem:await tts(tx,VOZ[sp],os.path.join(td,'%03d.mp3'%i))
    await asyncio.gather(*[one(i,sp,tx) for i,(sp,tx) in enumerate(lines)])
    gap=os.path.join(td,'gap.wav')
    subprocess.run([FF,'-y','-f','lavfi','-i','anullsrc=r=24000:cl=mono','-t','0.35',gap],capture_output=True,check=True)
    lst=os.path.join(td,'l.txt')
    with open(lst,'w',encoding='utf-8') as f:
        for i in range(len(lines)):f.write("file '%s'\nfile '%s'\n"%(os.path.join(td,'%03d.mp3'%i).replace('\\','/'),gap.replace('\\','/')))
    out=os.path.join(OUT,id_+'.mp3')
    subprocess.run([FF,'-y','-f','concat','-safe','0','-i',lst,'-ac','1','-ar','24000','-b:a','48k',
        '-metadata','title='+title,'-metadata','artist=PC-PE Estudo','-metadata','album=Podcast PC-PE',out],capture_output=True,check=True)
    shutil.rmtree(td,ignore_errors=True)
    return dur(out)
def main(only=None):
    idx_p=os.path.join(OUT,'index.json')
    idx=json.load(open(idx_p,encoding='utf-8')) if os.path.exists(idx_p) else {}
    for fn in sorted(os.listdir(SRC)):
        if not fn.endswith('.txt'):continue
        id_=fn[:-4]
        if only and id_ not in only:continue
        p=os.path.join(SRC,fn);h=hashlib.sha1(open(p,'rb').read()).hexdigest()[:10]
        if idx.get(id_,{}).get('h')==h and os.path.exists(os.path.join(OUT,id_+'.mp3')):continue
        title,lines=parse(p)
        d=asyncio.run(build(id_,title,lines))
        idx[id_]={'t':title,'s':round(d),'h':h}
        print(id_,title,'%d:%02d'%(d//60,d%60),flush=True)
        json.dump(idx,open(idx_p,'w',encoding='utf-8'),ensure_ascii=False,indent=0)
    json.dump(idx,open(idx_p,'w',encoding='utf-8'),ensure_ascii=False,indent=0)
if __name__=='__main__':
    import sys;main(sys.argv[1:] or None)
