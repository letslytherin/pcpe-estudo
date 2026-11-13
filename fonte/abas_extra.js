(function(){
const $=s=>document.querySelector(s);
let ST={et:{},taf:{}};var READY=false;
const NS='http://www.w3.org/2000/svg';
const today=()=>{const d=new Date();return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');};
const dlabel=s=>{const [y,m,d]=String(s).split('-');return d&&m?d+'/'+m:String(s);};
const num=(v,dig)=>Number(v).toLocaleString('pt-BR',{maximumFractionDigits:dig??1});
document.querySelectorAll('.xform input[type=date]').forEach(i=>i.value=today());

/* ---------- armazenamento: db do artifact, com cópia local de reserva ---------- */
let dbp=null;
const getDb=()=>dbp||(dbp=(async()=>{try{return window.claude&&window.claude.use?await window.claude.use('db'):null;}catch(e){return null;}})());
function store(name,onChange){
  const key='pcpe-'+name;let items={},col=null;
  try{items=JSON.parse(localStorage.getItem(key)||'{}')||{};}catch(e){}
  const keep=()=>{try{localStorage.setItem(key,JSON.stringify(items));}catch(e){}};
  onChange(items);
  getDb().then(db=>{if(!db)return;const c=db.collection(name);
    c.onSnapshot(s=>{col=c;if(s.metadata&&s.metadata.fromCache&&s.empty)return;const n={};s.docs.forEach(d=>{n[d.id]=d.data()||{};});
      /* registros feitos antes da conexão sobem uma vez */
      for(const id in items)if(!n[id]){n[id]=items[id];c.doc(id).set(items[id]).catch(()=>{});}
      items=n;keep();onChange(items);},()=>{col=null;});});
  return{
    add(o){const id=Date.now().toString(36)+Math.random().toString(36).slice(2,6);items[id]=o;keep();onChange(items);if(col)col.doc(id).set(o).catch(()=>{});},
    del(id){delete items[id];keep();onChange(items);if(col)col.doc(id).delete().catch(()=>{});}
  };
}
function docStore(path,onChange){
  const key='pcpe-'+path.replace('/','-');let val={},ref=null;
  try{val=JSON.parse(localStorage.getItem(key)||'{}')||{};}catch(e){}
  onChange(val);
  getDb().then(db=>{if(!db)return;const r=db.doc(path);
    r.onSnapshot(s=>{ref=r;if(s.exists){val=s.data()||{};try{localStorage.setItem(key,JSON.stringify(val));}catch(e){}onChange(val);}},()=>{ref=null;});});
  return{set(o){val={...val,...o};try{localStorage.setItem(key,JSON.stringify(val));}catch(e){}onChange(val);if(ref)ref.set(val).catch(()=>{});}};
}
const sorted=items=>Object.entries(items).map(([id,v])=>({id,...v})).sort((a,b)=>String(a.d).localeCompare(String(b.d))||a.id.localeCompare(b.id));

/* ---------- gráfico de linhas simples ---------- */
function chart(el,labels,series,goal,fmt){
  el.innerHTML='';
  const all=series.flatMap(s=>s.vals).filter(v=>v!=null&&isFinite(v));
  if(!all.length){el.innerHTML='<p class="xempty">Registre a primeira marca para ver a linha de evolução.</p>';return;}
  const W=340,H=170,R=10,T=12,B=24;
  let lo=Math.min(...all,goal?goal.v:Infinity),hi=Math.max(...all,goal?goal.v:-Infinity);
  if(lo===hi){lo-=1;hi+=1;}const pad=(hi-lo)*.12;lo-=pad;hi+=pad;if(lo<0&&Math.min(...all)>=0)lo=0;
  const L=10+Math.max(...[lo+pad,(lo+hi)/2,hi-pad].map(v=>fmt(v).length))*6.2;
  const n=labels.length,x=i=>n<2?L+(W-L-R)/2:L+i*(W-L-R)/(n-1),y=v=>T+(1-(v-lo)/(hi-lo))*(H-T-B);
  const svg=document.createElementNS(NS,'svg');svg.setAttribute('viewBox',`0 0 ${W} ${H}`);svg.setAttribute('role','img');
  const mk=(t,a,p)=>{const e=document.createElementNS(NS,t);for(const k in a)e.setAttribute(k,a[k]);(p||svg).appendChild(e);return e;};
  const tx=(s,a)=>{const e=mk('text',a);e.textContent=s;return e;};
  mk('line',{x1:L,y1:H-B,x2:W-R,y2:H-B,class:'ax'});
  [lo+pad,(lo+hi)/2,hi-pad].forEach(v=>tx(fmt(v),{x:L-4,y:y(v)+3,'text-anchor':'end',class:'axt'}));
  if(goal){mk('line',{x1:L,y1:y(goal.v),x2:W-R,y2:y(goal.v),class:'goal'});tx(goal.t,{x:W-R,y:y(goal.v)-4,'text-anchor':'end',class:'goalt'});}
  const idx=n<=6?labels.map((_,i)=>i):[0,Math.round((n-1)/2),n-1];
  idx.forEach(i=>tx(dlabel(labels[i]),{x:x(i),y:H-8,'text-anchor':n<2?'middle':i===0?'start':i===n-1?'end':'middle',class:'axt'}));
  series.forEach(s=>{const pts=s.vals.map((v,i)=>v==null?null:[x(i),y(v)]).filter(Boolean);
    if(pts.length>1)mk('path',{d:'M'+pts.map(p=>p.join(' ')).join(' L'),class:s.c});
    pts.forEach(p=>mk('circle',{cx:p[0],cy:p[1],r:3.6,class:s.c.replace('s','d')}));});
  const sum=series.map(s=>s.n+': '+s.vals.filter(v=>v!=null).map(fmt).join(', ')).join('; ');
  svg.setAttribute('aria-label','Evolução. '+sum+(goal?'. Meta: '+goal.t:''));
  el.appendChild(svg);
  if(series.length>1){const lg=document.createElement('div');lg.className='xleg';
    series.forEach(s=>{const sp=document.createElement('span');sp.innerHTML=`<i style="background:var(${s.v})"></i>`;sp.append(s.n);lg.appendChild(sp);});
    if(goal){const sp=document.createElement('span');sp.innerHTML='<i style="background:var(--ok)"></i>';sp.append('meta');lg.appendChild(sp);}
    el.appendChild(lg);}
}
function rowList(el,rows,onDel){
  el.innerHTML='';if(!rows.length){el.innerHTML='<p class="xempty">Nenhum registro ainda.</p>';return;}
  rows.slice().reverse().forEach(r=>{const d=document.createElement('div');d.className='xrow';
    const t=document.createElement('div');t.textContent=r.main;const sm=document.createElement('small');sm.textContent=r.sub;t.appendChild(sm);
    const b=document.createElement('button');b.type='button';b.textContent='Apagar';b.setAttribute('aria-label','Apagar '+r.main);
    b.addEventListener('click',()=>{if(confirm('Apagar este registro?'))onDel(r.id);});d.append(t,b);el.appendChild(d);});
}
const stat=(v,l)=>`<div><b>${v}</b><span>${l}</span></div>`;

/* ---------- NOTAS: simulados ---------- */
const sims=store('simulados',items=>{
  const L=sorted(items);
  const obj=L.map(s=>(+s.p1||0)+(+s.p2||0));
  const discs=L.map(s=>s.disc).filter(v=>v!==''&&v!=null&&isFinite(+v)).map(Number);
  const discMed=discs.length?discs.slice(-3).reduce((a,b)=>a+b,0)/Math.min(3,discs.length):null;
  const last3=obj.slice(-3),m3=last3.length?last3.reduce((a,b)=>a+b,0)/last3.length:null;
  const discRef=discMed??24;
  const need=Math.min(60,Math.max(30,Math.ceil(70-discRef)));
  const pctGoal=need/60*100;
  $('#sim-stats').innerHTML=L.length?
    stat(obj[obj.length-1],'última objetiva (de 60)')+stat(num(m3),'média dos últimos '+last3.length)+stat(discMed!=null?num(m3+discMed):'—','total estimado (de 90)'):
    stat('—','última objetiva')+stat('—','média recente')+stat('—','total estimado');
  let msg='';
  const src=discMed!=null?`com sua discursiva média de ${num(discMed)}`:'com discursiva de 24 (a média geral de 2023)';
  msg=`Para chegar a 70, ${src}, você precisa de ${need} acertos na objetiva (${num(pctGoal,0)}%).`;
  if(m3!=null){const f=need-m3;msg+=f>0?` Sua média recente é ${num(m3)}: faltam ${num(f)} acertos.`:` Sua média recente é ${num(m3)}: você já está na meta. Agora é manter.`;
    const l=L[L.length-1],p1=(+l.p1)/20*100,p2=(+l.p2)/40*100;
    if(p1<pctGoal||p2<pctGoal)msg+=Math.abs(p1-p2)<1?` No último simulado, P1 e P2 ficaram iguais (${num(p1,0)}%), as duas abaixo da meta.`:` No último simulado, ${p1<p2?'a P1 (Direito)':'a P2 (específicos)'} puxou a nota para baixo.`;}
  $('#sim-msg').textContent=msg;
  chart($('#sim-chart'),L.map(s=>s.d),[
    {n:'P1 (Direito)',c:'s2',v:'--p1',vals:L.map(s=>(+s.p1)/20*100)},
    {n:'P2 (específicos)',c:'s3',v:'--p2',vals:L.map(s=>(+s.p2)/40*100)}],
    {v:pctGoal,t:'meta '+num(pctGoal,0)+'%'},v=>num(v,0)+'%');
  rowList($('#sim-list'),L.map((s,i)=>({id:s.id,main:`${s.n||'Simulado'}: ${obj[i]} de 60`+(s.disc!==''&&s.disc!=null?` + ${num(s.disc,2)} na discursiva`:''),
    sub:`${dlabel(s.d)} · P1 ${s.p1}/20 · P2 ${s.p2}/40`})),id=>sims.del(id));
});
$('#f-sim').addEventListener('submit',e=>{e.preventDefault();const f=e.target,v=k=>f.elements[k].value;
  sims.add({d:v('d'),n:v('n').trim().slice(0,40),p1:+v('p1'),p2:+v('p2'),disc:v('disc')===''?'':+v('disc')});
  ['n','p1','p2','disc'].forEach(k=>f.elements[k].value='');});

/* ---------- NOTAS: questões por disciplina ---------- */
const DISC=['Direito Penal','Direito Processual Penal','Direito Constitucional','Direito Administrativo','Legislação Estadual','Português','Informática','Raciocínio Lógico','Contabilidade','Estatística'];
DISC.forEach(d=>{const o=document.createElement('option');o.textContent=d;$('#q-disc').appendChild(o);});
const qs=store('questoes',items=>{
  const L=sorted(items);const agg={};
  L.forEach(r=>{const a=agg[r.disc]||(agg[r.disc]={q:0,a:0,last:null});a.q+=+r.q||0;a.a+=+r.a||0;a.last=r;});
  const box=$('#q-table');box.innerHTML='';
  if(!L.length){box.innerHTML='<p class="xempty">Nenhuma bateria registrada ainda.</p>';}
  DISC.filter(d=>agg[d]).forEach(d=>{const a=agg[d],p=a.q?a.a/a.q*100:0,cls=p>=78?'ok':p>=65?'mid':'low';
    const lp=a.last.q?a.last.a/a.last.q*100:0;
    const el=document.createElement('div');el.className='xdisc';
    el.innerHTML=`<span class="nm"></span><span class="pc ${cls}">${num(p,0)}%</span><span class="tr"><i class="b${cls}" style="width:${Math.min(100,p)}%"></i><b></b></span><small>${a.a} de ${a.q} no total · última bateria ${num(lp,0)}% · ${p>=78?'na meta':'meta: 78%'}</small>`;
    el.querySelector('.nm').textContent=d;box.appendChild(el);});
  rowList($('#q-list'),L.map(r=>({id:r.id,main:`${r.disc}: ${r.a} de ${r.q}`,sub:dlabel(r.d)})),id=>qs.del(id));
});
$('#f-q').addEventListener('submit',e=>{e.preventDefault();const f=e.target,q=+f.elements.q.value,a=+f.elements.a.value;
  if(a>q){alert('Os acertos não podem passar do número de questões.');return;}
  qs.add({d:f.elements.d.value,disc:f.elements.disc.value,q,a});f.elements.q.value='';f.elements.a.value='';});

/* ---------- TAF: marcas ---------- */
const TESTS={
  barra:{n:'Barra estática',u:'segundos',f:v=>num(v,0)+' s',min:15,goal:20,hi:true},
  salto:{n:'Salto horizontal',u:'metros (ex.: 1,30)',f:v=>num(v,2)+' m',min:1.35,goal:1.45,hi:true},
  nat50:{n:'Natação 50 m',u:'segundos',f:v=>num(v,0)+' s',min:80,goal:70,hi:false},
  corrida:{n:'Corrida 12 min',u:'metros',f:v=>num(v,0)+' m',min:1800,goal:2000,hi:true},
  natcont:{n:'Natação sem parar (aprendizado)',u:'metros nadados sem parar',f:v=>num(v,0)+' m',min:50,goal:50,hi:true},
  trote:{n:'Trote sem parar (aprendizado)',u:'minutos trotando sem parar',f:v=>num(v,1)+' min',min:12,goal:12,hi:true}};
Object.entries(TESTS).forEach(([k,t])=>{const o=document.createElement('option');o.value=k;o.textContent=t.n;$('#taf-t').appendChild(o);});
const unit=()=>{$('#taf-u').textContent='Valor em '+TESTS[$('#taf-t').value].u;};$('#taf-t').addEventListener('change',unit);unit();
const marks=store('taf',items=>{ST.taf=items;renderHoje();
  const L=sorted(items);const box=$('#taf-cards');box.innerHTML='';
  Object.entries(TESTS).forEach(([k,t])=>{
    const R=L.filter(r=>r.t===k);
    const card=document.createElement('div');card.className='xtest';
    const h=document.createElement('h3');h.textContent=t.n;card.appendChild(h);
    const st=document.createElement('p');st.className='st';
    if(!R.length){st.innerHTML=`<span class="muted">Sem marca ainda. Mínimo: ${t.f(t.min)}.</span>`;card.appendChild(st);box.appendChild(card);return;}
    const vals=R.map(r=>+r.v),last=vals[vals.length-1],best=t.hi?Math.max(...vals):Math.min(...vals);
    const ok=t.hi?best>=t.min:best<=t.min,gap=t.hi?t.min-last:last-t.min;
    const first=vals[0],evo=t.hi?last-first:first-last;
    const learn=k==='natcont'||k==='trote';
    let s=`Última: <b>${t.f(last)}</b> · melhor: <b>${t.f(best)}</b>. `;
    s+=ok?`<span class="ok">${learn?'Meta da etapa alcançada.':'Você já passa do mínimo.'}</span>`:`<span class="low">Faltam ${t.f(Math.abs(gap)).replace(/^-/,'')} para ${learn?'a meta':'o mínimo'}.</span>`;
    if(R.length>1)s+=` Desde o primeiro registro: ${evo>=0?'melhorou':'piorou'} ${t.f(Math.abs(evo))}.`;
    st.innerHTML=s;card.appendChild(st);
    const c=document.createElement('div');c.className='xchart';card.appendChild(c);box.appendChild(card);
    chart(c,R.map(r=>r.d),[{n:t.n,c:'s1',v:'--accent',vals}],{v:t.min,t:(learn?'meta ':'mínimo ')+t.f(t.min)},t.f);
  });
  rowList($('#taf-list'),L.map(r=>({id:r.id,main:`${(TESTS[r.t]||{n:r.t}).n}: ${TESTS[r.t]?TESTS[r.t].f(r.v):r.v}`,sub:dlabel(r.d)})),id=>marks.del(id));
});
$('#f-taf').addEventListener('submit',e=>{e.preventDefault();const f=e.target;let v=String(f.elements.v.value).replace(',','.');
  marks.add({d:f.elements.d.value,t:f.elements.t.value,v:+v});f.elements.v.value='';});

/* ---------- TAF: etapas de corrida e natação ---------- */
const CORR=[
 ['1 min de trote + 2 min de caminhada, 7 vezes (21 min)','Completar 2 sessões seguidas sem encurtar'],
 ['2 min de trote + 2 min de caminhada, 5 vezes','Completar 2 sessões seguidas sem encurtar'],
 ['3 min de trote + 1 min de caminhada, 5 vezes','Completar 2 sessões seguidas sem encurtar'],
 ['5 min de trote + 1 min de caminhada, 4 vezes','Completar 2 sessões seguidas sem encurtar'],
 ['8 min de trote + 1 min de caminhada, 3 vezes','Completar 2 sessões seguidas sem encurtar'],
 ['Trote contínuo: 12 min, depois 15, depois 20','Trotar 12 minutos sem parar'],
 ['Semana com 3 corridas: 4×2 min no ritmo da prova (6:40 por km) com 1 min de trote; 25–30 min leve; 30–35 min longo','Fazer 1.800 m no teste de 12 minutos']];
const NAT=[
 ['Adaptação: caminhar na água, soprar bolhas com o rosto na água (10 vezes), abrir os olhos com óculos, bater pernas segurando a borda','Ficar 10 s com o rosto na água, com conforto, soprando bolhas num ritmo constante'],
 ['Flutuação e deslize: boiar de frente e de costas, primeiro com prancha; impulso na parede deslizando 3 a 5 m; treinar ficar de pé','Flutuar, deslizar 5 m e ficar de pé sozinha'],
 ['Pernada e braçada: pernada com prancha, depois com o rosto na água; braçada com um braço de cada vez','Atravessar 10 a 12 m com prancha e pernada sem parar'],
 ['Respiração: nado completo em trechos curtos, respirando de lado a cada 2 ou 3 braçadas','Nadar o comprimento da piscina sem parar, 6 vezes seguidas'],
 ['Resistência: juntar comprimentos até 50 m; depois tiros de 50 m cronometrados','Fazer 50 m sem parar em até 80 s']];
function steps(el,list,key,label){
  return v=>{const cur=+v[key]||1;el.innerHTML='';
    list.forEach(([tr,cr],i)=>{const n=i+1,d=document.createElement('div');d.className='xstep'+(n===cur?' cur':n<cur?' past':'');
      d.innerHTML=`<div class="h"><b>Etapa ${n}${n===cur?' · você está aqui':''}</b></div><div class="tr"></div><div class="cr"></div>`;
      d.querySelector('.tr').textContent=tr;d.querySelector('.cr').textContent='Avance quando: '+cr+'.';
      if(n!==cur){const b=document.createElement('button');b.type='button';b.textContent='Estou aqui';b.setAttribute('aria-label',`Marcar etapa ${n} de ${label} como atual`);
        b.addEventListener('click',()=>etapas.set({[key]:n}));d.querySelector('.h').appendChild(b);}
      el.appendChild(d);});};
}
const rc=steps($('#et-corrida'),CORR,'corrida','corrida'),rn=steps($('#et-natacao'),NAT,'natacao','natação');
const etapas=docStore('progresso/taf',v=>{ST.et=v;rc(v);rn(v);renderHoje();});

/* ---------- HOJE: coach do dia ---------- */
const ANIM={'Direito Penal':0,'Direito Processual Penal':1,'Direito Constitucional':2,'Direito Administrativo':3,'Legislação Estadual':4,'Informática':5,'Português':6,'Raciocínio Lógico':7,'Contabilidade Geral':8,'Estatística':9};
const DIAS=['domingo','segunda','terça','quarta','quinta','sexta','sábado'];
const hesc=t=>String(t).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
function distribute(wk){
  const sun=[],rest=[];
  wk.items.forEach(it=>(it.kind==='fix'&&(it.tag==='Domingo'||it.tag==='Discursiva')?sun:rest).push(it));
  const plan=[[],[],[],[],[],[],sun],cum=[2,4,6,8,10,14];
  rest.forEach((it,i)=>{const pos=(i+.5)/rest.length*14;plan[cum.findIndex(c=>pos<c)].push(it);});
  return plan;
}
function itemHtml(it,done){
  let meta,ttl,filt='';
  if(it.kind==='cap'){meta=`<span class="chip ${it.p.toLowerCase()}">${it.p}</span><span class="chip p${it.pr.toLowerCase()}">${it.pr}</span><span class="disc">${hesc(it.d)}</span>`;
    ttl=`Guia cap. ${hesc(it.c)} + ${it.q} questões`;filt=`Disciplina: ${hesc(it.d)} · Assunto: ${hesc(it.a)}`;}
  else{meta=`<span class="chip fx">${hesc(it.tag)}</span>`;ttl=hesc(it.c);if(it.a)filt=hesc(it.a);}
  return `<label class="hitem${done?' done':''}"><input type="checkbox" data-id="${it.id}"${done?' checked':''}><span><span class="meta">${meta}</span><span class="ttl">${ttl}</span>${filt?`<div class="filt">${filt}</div>`:''}</span></label>`;
}
function renderHoje(){
  if(!READY)return;
  const now=new Date();now.setHours(0,0,0,0);
  $('#h-dia').textContent=`Hoje, ${DIAS[now.getDay()]}, ${now.toLocaleDateString('pt-BR',{day:'2-digit',month:'2-digit'})}`;
  const C=window.__crono;const disc=new Set();
  if(C){
    const done=C.done,diff=Math.floor((now-C.START)/864e5);
    let wi=Math.floor(diff/7),dow=(now.getDay()+6)%7,preview=false;
    if(diff<0){wi=0;dow=0;preview=true;}
    if(wi>15){$('#h-semana').textContent='O cronograma terminou. Boa prova!';$('#h-estudo').innerHTML='';$('#h-carga').textContent='';$('#h-atras').innerHTML='';}
    else{
      const wk=C.weeks[wi],plan=distribute(wk),k=wk.items.filter(i=>done[i.id]).length;
      const dl=Math.max(0,Math.round((new Date(2027,2,7)-now)/864e5));
      $('#h-semana').textContent=`Semana ${wk.w} de 16 · ${wk.title} · ${k} de ${wk.items.length} tarefas da semana feitas · ${dl} dias até a prova`;
      $('#h-bar').style.width=(k/wk.items.length*100)+'%';
      const hoje=plan[dow];
      $('#h-carga').textContent=preview?`O cronograma começa na segunda, ${C.START.toLocaleDateString('pt-BR',{day:'2-digit',month:'2-digit'})}. Se quiser adiantar, estas são as tarefas de segunda:`:
        (dow===5?'Cerca de 4 horas hoje.':'Cerca de 2 horas hoje.')+(wk.note?' '+wk.note:'');
      let h=hoje.map(it=>itemHtml(it,!!done[it.id])).join('');
      if(!hoje.length)h='<p class="xempty">Nada novo marcado para hoje. Use o tempo para o que ficou para trás ou para refazer erros.</p>';
      else if(hoje.every(it=>done[it.id]))h+='<p class="xmsg">Estudo de hoje concluído.</p>';
      $('#h-estudo').innerHTML=h;
      hoje.forEach(it=>{if(it.d)disc.add(it.d);});
      const atras=[];
      C.weeks.slice(0,wi).forEach(w=>w.items.forEach(it=>{if(!done[it.id])atras.push(it);}));
      if(!preview)plan.slice(0,dow).flat().forEach(it=>{if(!done[it.id])atras.push(it);});
      $('#h-atras').innerHTML=atras.length?`<h3 style="margin-top:12px">Ficou para trás (${atras.length})</h3>`+atras.slice(0,4).map(it=>itemHtml(it,false)).join('')+(atras.length>4?`<p class="xempty">E mais ${atras.length-4} na aba Cronograma.</p>`:''):'';
    }
  }
  /* treino */
  const et=ST.et||{},cn=Math.min(CORR.length,+et.corrida||1),nn=Math.min(NAT.length,+et.natacao||1);
  const best=t=>{const v=Object.values(ST.taf||{}).filter(r=>r.t===t).map(r=>+r.v);return v.length?Math.max(...v):null;};
  const bb=best('barra'),bs=best('salto');
  const barra=bb==null||bb<5?'3×15–20 s com os pés apoiados, pendurar 3×20–30 s para firmar a pegada e remada no elástico 3×8–12':
    bb<15?'5×5–8 s sem apoio, com o queixo acima da barra, e 5 descidas lentas de 5 s':'4×10–15 s, buscando chegar a 20 s';
  const salto=bs==null||bs<1.35?'Técnica (balanço dos braços e aterrissagem) 4×5 saltos, mais agachamento, afundo e ponte de glúteo 3×10–12':
    '5×3 saltos máximos com 1–2 min de descanso; meça a marca uma vez por semana';
  const corr=[`Corrida · etapa ${cn}`,CORR[cn-1][0]],nat=[`Natação · etapa ${nn}`,NAT[nn-1][0]+'. Nunca nade sozinha.'];
  const dw=(now.getDay()+6)%7;
  const T=[[corr,['Abdômen e lombar','cerca de 10 minutos']],[nat,['Barra estática',barra]],[nat,['Pernas e salto (leve)',salto]],[corr],[nat,['Barra estática',barra]],[[`Corrida leve · etapa ${cn}`,'O mesmo treino da sua etapa, num ritmo mais tranquilo']],[['Descanso','Dia de recuperar. Uma caminhada leve vale, se quiser.']]][dw];
  $('#h-treino').innerHTML=T.map(([a,b])=>`<div class="xrow" style="grid-template-columns:1fr"><div><b>${hesc(a)}</b><small>${hesc(b)}</small></div></div>`).join('')+
    (dw<6?'<p class="muted xsmall">Aqueça de 5 a 10 minutos antes e alongue no fim. Dor nas articulações ou no peito pede pausa.</p>':'');
  /* fim do dia */
  const fim=[];
  if(dw<6&&C)fim.push('Refazer as questões que você errou hoje.');
  fim.push('Anotar as baterias de questões na aba Notas e as marcas do treino na aba TAF.');
  $('#h-fim').innerHTML=fim.map(t=>`<li>${hesc(t)}</li>`).join('');
  const box=$('#h-anim');box.innerHTML='';
  [...disc].filter(d=>ANIM[d]!=null).forEach(d=>{const b=document.createElement('button');b.type='button';b.textContent='Animações de '+d.replace('Direito ','').replace(' Geral','');
    b.addEventListener('click',()=>window.__tab&&window.__tab('anim',ANIM[d]));box.appendChild(b);});
}
document.getElementById('hoje').addEventListener('change',e=>{const t=e.target;if(t.matches('input[data-id]')&&window.__crono)window.__crono.save(t.dataset.id,t.checked);});

/* ---------- backup por copiar e colar ---------- */
const BK=['simulados','questoes','taf'];
function snapshot(){
  const o={v:1,feito:window.__crono?{...window.__crono.done}:{}};
  BK.forEach(k=>{try{o[k]=JSON.parse(localStorage.getItem('pcpe-'+k)||'{}');}catch(e){o[k]={};}});
  o.etapas=ST.et||{};return o;
}
$('#bk-copy').addEventListener('click',async()=>{
  const txt='PCPE1:'+btoa(unescape(encodeURIComponent(JSON.stringify(snapshot()))));
  try{await navigator.clipboard.writeText(txt);$('#bk-msg').textContent='Backup copiado. Cole no outro lugar e toque em "Trazer este backup".';}
  catch(e){$('#bk-text').value=txt;$('#bk-text').select();$('#bk-msg').textContent='Não consegui copiar sozinho. O backup está na caixa acima: selecione tudo e copie.';}
});
$('#bk-load').addEventListener('click',()=>{
  let o;try{const t=$('#bk-text').value.trim();if(!t.startsWith('PCPE1:'))throw 0;o=JSON.parse(decodeURIComponent(escape(atob(t.slice(6)))));}
  catch(e){$('#bk-msg').textContent='Esse texto não parece um backup desta página.';return;}
  if(!confirm('Juntar este backup ao progresso daqui? Nada que já está marcado será apagado.'))return;
  let n=0;
  if(o.feito&&window.__crono){const m={};for(const id in o.feito)if(o.feito[id]&&!window.__crono.done[id]){m[id]=true;n++;}if(Object.keys(m).length)window.__crono.saveMany(m);}
  BK.forEach(k=>{const cur=(()=>{try{return JSON.parse(localStorage.getItem('pcpe-'+k)||'{}')}catch(e){return{}}})();
    for(const id in (o[k]||{}))if(!cur[id]){cur[id]=o[k][id];n++;}
    try{localStorage.setItem('pcpe-'+k,JSON.stringify(cur));}catch(e){}});
  if(o.etapas&&Object.keys(o.etapas).length)etapas.set(o.etapas);
  $('#bk-msg').textContent=`Backup trazido (${n} itens novos). Atualizando…`;$('#bk-text').value='';
  setTimeout(()=>location.reload(),2500);
});
READY=true;window.__hoje=renderHoje;renderHoje();
})();
