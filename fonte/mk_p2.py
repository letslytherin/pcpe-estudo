import re,sys
# Uso: python mk_p2.py <scenes.js> <saida.html> <Titulo> <Disciplina> <frase_lead> <rodape>
scenes_f,out_f,title,disc,lead,foot=sys.argv[1:7]
s=open('informatica-palitinhos.html',encoding='utf-8').read()
sc=open(scenes_f,encoding='utf-8').read()
def rep(a,b):
    global s
    assert a in s, a[:60]
    s=s.replace(a,b,1)
rep('<title>Informática em Palitinhos</title>',f'<title>{title}</title>')
rep('PC-PE · Agente de Polícia · Informática',f'PC-PE · Agente de Polícia · {disc}')
rep('<h1>Informática em Palitinhos</h1>',f'<h1>{title}</h1>')
rep('Cinco cenas curtas sobre pragas, golpes, criptografia e backup.',lead)
rep('baseados no guia de Informática do concurso. Senhas e endereços são inventados.',foot)
rep('@media (prefers-reduced-motion: reduce)','''.bred{fill:var(--no)} .bblue{fill:var(--accent)} .urna{fill:none;stroke:var(--ink);stroke-width:2.5}
.tline{stroke:var(--ink);stroke-width:2.2} .ttit{font:800 11px var(--f-display);fill:var(--ink);text-anchor:middle}
.dotp{fill:var(--accent)} .dotq{fill:var(--perp)}
.bpbox{fill:var(--accent-soft);stroke:var(--accent);stroke-width:2} .bpl{stroke:var(--accent);stroke-width:2}
.canopy{fill:var(--accent)}
@media (prefers-reduced-motion: reduce)''')
rep("  paper:g=>","  umbrella:g=>{mk('line',{x1:0,y1:14,x2:0,y2:46,class:'handle'},g);mk('path',{d:'M-19 44 Q0 72 19 44 Z',class:'canopy'},g);},\n  paper:g=>")
rep("  pix(g){","""  ball(g,d){mk('circle',{r:7,class:d.kind==='blue'?'bblue':'bred'},g);},
  urna(g){mk('path',{d:'M-40 -60 L-34 0 L34 0 L40 -60',class:'urna'},g);},
  taccount(g,d){mk('line',{x1:-62,y1:-70,x2:62,y2:-70,class:'tline'},g);mk('line',{x1:0,y1:-70,x2:0,y2:0,class:'tline'},g);
    txt(g,d.text,{y:-78,class:'ttit'});txt(g,'D',{x:-50,y:-58,class:'gl'});txt(g,'C',{x:50,y:-58,class:'gl'});},
  ticks(g,d){mk('line',{x1:d.x1,y1:d.ay,x2:d.x2,y2:d.ay,class:'axis'},g);d.labels.forEach(([x,l])=>{mk('line',{x1:x,y1:d.ay-4,x2:x,y2:d.ay+4,class:'axis'},g);txt(g,l,{x,y:d.ay+17,class:'tick'});});},
  dots(g,d){d.pts.forEach(([x,y])=>mk('circle',{cx:x,cy:y,r:5.5,class:d.alt?'dotq':'dotp'},g));},
  bplot(g,d){const y=d.ay;mk('line',{x1:d.min,y1:y,x2:d.q1,y2:y,class:'bpl'},g);mk('line',{x1:d.q3,y1:y,x2:d.max,y2:y,class:'bpl'},g);
    [d.min,d.max].forEach(x=>mk('line',{x1:x,y1:y-8,x2:x,y2:y+8,class:'bpl'},g));
    mk('rect',{x:d.q1,y:y-16,width:d.q3-d.q1,height:32,class:'bpbox'},g);mk('line',{x1:d.q2,y1:y-16,x2:d.q2,y2:y+16,class:'bpl'},g);},
  pix(g){""")
a=s.index('const STAMP=(id'); b=s.index('/* ---------- montagem')
s=s[:a]+sc+'\n'+s[b:]
open(out_f,'w',encoding='utf-8').write(s)
open('chk.js','w',encoding='utf-8').write(re.search(r'<script>(.*)</script>',s,re.S).group(1))
