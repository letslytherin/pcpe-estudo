import re
DISC=[('Penal','penal'),('Processo Penal','processo-penal'),('Constitucional','constitucional'),('Administrativo','administrativo'),
      ('Legislação Estadual','legislacao-estadual'),('Informática','informatica'),('Português','portugues'),
      ('Raciocínio Lógico','raciocinio-logico'),('Contabilidade','contabilidade'),('Estatística','estatistica')]
rd=lambda f:open(f,encoding='utf-8').read()
crono=rd('cronograma-pcpe.html'); base=rd('estatistica-palitinhos.html')

# ---------- CSS das animações, escopado em #anim ----------
css=re.search(r'<style>(.*?)</style>',base,re.S).group(1)
css=re.sub(r'/\*.*?\*/','',css,flags=re.S)
def rules(s):
    out=[];i=0;n=len(s)
    while i<n:
        j=s.find('{',i)
        if j<0:break
        sel=s[i:j].strip();d=1;k=j+1
        while d:
            if s[k]=='{':d+=1
            elif s[k]=='}':d-=1
            k+=1
        out.append((sel,s[j+1:k-1]));i=k
    return out
SKIP={'body','.wrap','header','.eyebrow','h1','.lead','footer'}
def scope(sel):
    if sel==':root':return '#anim'
    if sel==':root:not([data-theme="light"])':return ':root:not([data-theme="light"]) #anim'
    if sel==':root[data-theme="dark"]':return ':root[data-theme="dark"] #anim'
    return ','.join('#anim '+p.strip() for p in sel.split(','))
out=[]
for sel,body in rules(css):
    if sel.startswith('@media'):
        inner=''.join(f'{scope(s)}{{{b}}}' for s,b in rules(body))
        out.append(f'{sel}{{{inner}}}')
    elif sel in SKIP:continue
    else:out.append(f'{scope(sel)}{{{body}}}')
acss='\n'.join(out)
acss+='''
#anim .card{padding:0;gap:0;scroll-margin-top:72px}
#anim{display:flex;flex-direction:column;gap:16px}
#anim .dchips{display:flex;flex-wrap:wrap;gap:8px}
#anim .dchips button{font:600 14px var(--f-body);color:var(--ink);background:var(--card);border:1px solid var(--line);border-radius:10px;padding:8px 12px;cursor:pointer}
#anim .dchips button[aria-pressed="true"]{background:var(--accent);border-color:var(--accent);color:var(--card)}
#anim .dchips button:focus-visible{outline:2px solid var(--accent);outline-offset:2px}
#anim .hint{font-size:14px;color:var(--muted)}
.tabs{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:4px;background:var(--card);border:1px solid var(--line);border-radius:12px;padding:4px;position:sticky;top:0;z-index:5}
.tabs button{font:700 14px var(--f-body);border:0;border-radius:9px;padding:10px 2px;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;background:transparent;color:var(--muted);cursor:pointer}
.tabs button[aria-selected="true"]{background:var(--accent);color:var(--card)}
.tabs button:focus-visible{outline:2px solid var(--accent);outline-offset:2px}
.links button{font:600 13px var(--f-body);color:var(--accent);background:var(--accent-soft);border:0;border-radius:999px;padding:6px 11px;cursor:pointer}
[hidden]{display:none!important}
'''+rd('abas_extra.css')

# ---------- JS: motor + cenas de cada disciplina ----------
js=re.search(r'<script>(.*?)</script>',base,re.S).group(1)
engine=js[:js.index('const STAMP=(id')]
blocks=[]
for name,slug in DISC:
    s=rd(f'{slug}-palitinhos.html');a=s.index('const STAMP=(id');b=s.index('/* ---------- montagem')
    blocks.append(f"{{n:{name!r},f:()=>{{\n{s[a:b]}\nreturn SCENES;}}}}")
mount='''
const DISC=[
'''+',\n'.join(blocks)+'''
];
/* ---------- montagem: uma disciplina por vez ---------- */
const cards=document.getElementById('anim-cards'), nav=document.getElementById('anim-nav'), dnav=document.getElementById('anim-disc');
const io='IntersectionObserver' in window?new IntersectionObserver(es=>es.forEach(e=>{const p=e.target._player;if(!p)return;p.visible=e.isIntersecting;
  if(e.isIntersecting&&e.intersectionRatio>=.55&&!p.played&&!REDUCE)p.play();}),{threshold:[0,.55]}):null;
let cur=-1;const cache={};
function show(i){
  if(i===cur)return;cur=i;
  players.forEach(p=>p.tok++);players.length=0;tweens.length=0;if(io)io.disconnect();
  cards.innerHTML='';nav.innerHTML='';
  [...dnav.children].forEach((b,k)=>b.setAttribute('aria-pressed',k===i?'true':'false'));
  try{localStorage.setItem('pp-disc',String(i))}catch(e){}
  const SC=cache[i]||(cache[i]=DISC[i].f());
  SC.forEach(sc=>{
    const card=document.createElement('section');card.className='card';card.id='cena-'+sc.id;
    card.innerHTML=`<div class="card-head"><span class="art">${sc.art}</span><h2>${sc.title}</h2></div>
     <div class="stage"></div>
     <div class="player"><p class="cap" aria-live="polite"></p>
      <div class="ctrl"><button class="play" type="button">Assistir</button><div class="bar"><i></i></div></div></div>
     <div class="rule">${sc.rule}</div>`;
    cards.appendChild(card);
    const p=new Player(sc,card);players.push(p);card._player=p;
    if(io)io.observe(card);else p.visible=true;
    const b=document.createElement('button');b.type='button';b.textContent=sc.nav||sc.title;
    b.addEventListener('click',()=>{card.scrollIntoView({behavior:REDUCE?'auto':'smooth',block:'start'});p.play();});
    nav.appendChild(b);
  });
  const sp=document.createElement('button');sp.type='button';sp.className='speed';sp.textContent=SPEEDS[si].t;
  sp.addEventListener('click',()=>{si=(si+1)%SPEEDS.length;sp.textContent=SPEEDS[si].t;try{localStorage.setItem('pp-ritmo',SPEEDS[si].t)}catch(e){}});
  nav.appendChild(sp);
}
DISC.forEach((d,i)=>{const b=document.createElement('button');b.type='button';b.textContent=d.n;b.setAttribute('aria-pressed','false');
  b.addEventListener('click',()=>{show(i);document.getElementById('anim').scrollIntoView({behavior:REDUCE?'auto':'smooth',block:'start'});});dnav.appendChild(b);});
window.__animShow=i=>{if(i==null){let s=0;try{s=+localStorage.getItem('pp-disc')||0}catch(e){}i=cur>=0?cur:Math.min(Math.max(s,0),DISC.length-1);}show(i);};
requestAnimationFrame(loop);
})();
'''
ajs=engine+mount

# ---------- montagem da página única ----------
s=crono
s=s.replace('<title>Cronograma PC-PE Agente</title>','<title>Estudo PC-PE Agente</title>',1)
s=s.replace('<h1>Cronograma até a prova</h1>','<h1>Tudo para a prova da PC-PE</h1>',1)
s=s.replace('</style>',acss+'\n</style>',1)
exec(open('patch_crono.py',encoding='utf-8').read())
hdr_end=s.index('</header>')+len('</header>')
tabs='''
  <div class="tabs" role="tablist" aria-label="Seções">
    <button type="button" role="tab" id="tb-hoje" aria-selected="true" aria-controls="hoje">Hoje</button>
    <button type="button" role="tab" id="tb-crono" aria-selected="false" aria-controls="tab-crono">Cronograma</button>
    <button type="button" role="tab" id="tb-notas" aria-selected="false" aria-controls="notas">Notas</button>
    <button type="button" role="tab" id="tb-taf" aria-selected="false" aria-controls="taf">TAF</button>
    <button type="button" role="tab" id="tb-anim" aria-selected="false" aria-controls="anim">Animações</button>
  </div>
  <div id="tab-crono" role="tabpanel" aria-labelledby="tb-crono" hidden style="display:flex;flex-direction:column;gap:20px">'''
s=s[:hdr_end]+tabs+s[hdr_end:]
foot=s.index('  <footer>')
anim='''  </div>
'''+rd('abas_extra.html')+'''
  <div id="anim" role="tabpanel" aria-labelledby="tb-anim" hidden>
    <p class="hint">Escolha a disciplina. Cada uma tem cinco cenas curtas com palitinhos; a cena começa sozinha quando aparece na tela, e a regra fica logo abaixo.</p>
    <div class="dchips" id="anim-disc" aria-label="Disciplinas"></div>
    <nav id="anim-nav" aria-label="Cenas"></nav>
    <main id="anim-cards" style="display:flex;flex-direction:column;gap:22px"></main>
  </div>
'''
s=s[:foot]+anim+s[foot:]
# links antigos viram botões que abrem a aba
for i,(name,slug) in enumerate(DISC):
    m=re.search(r'<a href="https://claude.ai/artifact/[A-Za-z0-9]+">'+re.escape(name)+'</a>',s)
    assert m,name
    s=s.replace(m.group(0),f'<button type="button" data-disc="{i}">{name}</button>',1)
s=s.replace('Seu progresso fica salvo nesta página.','Seu progresso fica salvo nesta página. As animações são material próprio de estudo; nomes, empresas e valores são inventados.',1)
tabjs='''
<script>
(function(){
const T=['hoje','crono','notas','taf','anim'],P={hoje:'hoje',crono:'tab-crono',notas:'notas',taf:'taf',anim:'anim'};
function tab(w,disc){T.forEach(k=>{const on=k===w;document.getElementById('tb-'+k).setAttribute('aria-selected',on);document.getElementById(P[k]).hidden=!on;});
  try{localStorage.setItem('pcpe-aba',w)}catch(e){}
  if(w==='anim')requestAnimationFrame(()=>{window.__animShow&&window.__animShow(disc);});
  window.scrollTo({top:0});}
T.forEach(k=>document.getElementById('tb-'+k).addEventListener('click',()=>tab(k)));
document.querySelectorAll('[data-disc]').forEach(b=>b.addEventListener('click',()=>tab('anim',+b.dataset.disc)));
window.__tab=tab;
})();
</script>
<script>
'''+rd('abas_extra.js')+'''
</script>
<script>
'''+ajs+'''
</script>
'''
s=s.rstrip()+'\n'+tabjs
open('estudo-pcpe.html','w',encoding='utf-8').write(s)
for k,m in enumerate(re.findall(r'<script>(.*?)</script>',s,re.S)):
    open(f'chk{k}.js','w',encoding='utf-8').write(m)
print(len(s))
