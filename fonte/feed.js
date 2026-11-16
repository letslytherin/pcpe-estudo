/* ---------- aba Feed ---------- */
(function(){
const RAW=window.__feed||[];if(!RAW.length||!document.getElementById('fd-list'))return;
const $=id=>document.getElementById(id);
const esc=s=>String(s==null?'':s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const PF={
 cf88:['Constituição Raiz','cf88_raiz','#3b6fd8','CF'],
 banca:['Banca do Mal','banca_do_mal','#8a3fd1','BM'],
 delegado:['Delegado Cansado','delegado_cansado','#2c7a6b','DC'],
 futura:['Futura Agente','futura_agente','#d0476b','FA'],
 leitura:['Leitura Atenta','leitura_atenta','#b06d0f','LA'],
 calc:['Calculista Ansiosa','calculista_ansiosa','#c2452b','CA'],
 dobradas:['Partidas Dobradas','partidas_dobradas','#4b7d2a','PD'],
 ativo:['Ativo Carente','ativo_carente','#5f6b7a','AC']};
const CURTO={'Direito Constitucional':'Constitucional','Direito Administrativo':'Administrativo','Direito Penal':'Penal','Direito Processual Penal':'Processo Penal','Legislação Estadual':'Leg. Estadual','Contabilidade Geral':'Contabilidade'};
const BY={};RAW.forEach(p=>BY[p.id]=p);
let st={v:{},s:{},l:{}};
const norm=v=>({v:{},s:{},l:{},...(v||{})});
const sdoc=window.__st?window.__st.docStore('progresso/feed',v=>{st=norm(v);}):{set(o){st=norm({...st,...o});}};
const serr=window.__errAdd?{add:o=>window.__errAdd(o)}:null;
let seen={};try{seen=JSON.parse(localStorage.getItem('pcpe-feed-seen')||'{}')||{};}catch(e){}
const keepSeen=()=>{try{localStorage.setItem('pcpe-feed-seen',JSON.stringify(seen));}catch(e){}};
let view='pv';const shown=new Set();
function chMap(){
  const C=window.__crono,m={};if(!C)return{m,wi:0};
  const now=new Date();now.setHours(0,0,0,0);const wi=Math.max(0,Math.floor((now-C.START)/864e5/7));
  C.weeks.forEach((wk,i)=>wk.items.forEach(it=>{if(it.kind==='cap')m[it.id]={d:it.d,c:it.c,w:wk.w,wi:i,done:!!C.done[it.id]};}));
  return{m,wi};
}
/* peso: capítulo feito pesa mais (repetição); semana atual entra; a próxima aparece pouco, como prévia */
function weight(p,M,wi){
  const c=M[p.ch];if(!c)return 0;
  let w=c.done?3:c.wi===wi?1.4:c.wi===wi+1?0.35:c.wi<wi?1:0;
  if(!w)return 0;
  const v=st.v[p.id];if(p.k==='q'){if(v==='x')w*=2.2;else if(v==='v')w*=.35;}
  return w/(1+(seen[p.id]||0)*1.6);
}
function pick(n){
  const {m,wi}=chMap();const ok=p=>view!=='q'||p.k==='q';
  let pool=RAW.filter(p=>ok(p)&&!shown.has(p.id)),W=pool.map(p=>weight(p,m,wi));
  if(!W.some(x=>x>0)){shown.clear();pool=RAW.filter(ok);W=pool.map(p=>weight(p,m,wi));}
  const out=[];let last='';
  for(let k=0;k<n;k++){
    let tot=0;const W2=W.map((x,i)=>{const y=pool[i].p===last?x*.25:x;tot+=y;return y;});if(tot<=0)break;
    let r=Math.random()*tot,i=0;for(;i<W2.length-1;i++){r-=W2[i];if(r<=0)break;}
    out.push(pool[i]);last=pool[i].p;shown.add(pool[i].id);W[i]=0;
  }
  return out;
}
function tag(p,M){const c=M[p.ch];return c?`${CURTO[c.d]||c.d} · cap. ${esc(String(c.c).split(' ')[0].replace(/\.$/,''))}`:'';}
function card(p,M){
  const f=PF[p.p]||['Perfil','perfil','#888','?'];
  let body='';
  if(p.k==='t')body=`<p class="fd-x">${esc(p.x).replace(/ \/ /g,'<br>')}</p>`;
  else if(p.k==='th'){const [a,...r]=p.parts;body=`<p class="fd-x">${esc(a)}</p><button type="button" class="fd-link" data-th="${p.id}">Mostrar sequência (${r.length})</button><div class="fd-th" hidden>${r.map((x,i)=>`<p><small>${i+2}/${r.length+1}</small>${esc(x)}</p>`).join('')}</div>`;}
  else body=`<p class="fd-x">${esc(p.x)}</p><div class="fd-opts">${p.o.map((o,i)=>`<button type="button" data-q="${p.id}" data-i="${i}">${esc(o)}</button>`).join('')}</div><div class="fd-r"></div>`;
  const lk=!!st.l[p.id],sv=!!st.s[p.id];
  return `<article class="fd-post" data-id="${p.id}"><div class="fd-av" style="background:${f[2]}" aria-hidden="true">${f[3]}</div><div><div class="fd-h"><b>${esc(f[0])}</b><span>@${f[1]}</span><span class="fd-tag">${tag(p,M)}</span></div>${body}
    <div class="fd-acts"><button type="button" class="lk" data-lk="${p.id}" aria-pressed="${lk}">${lk?'♥':'♡'} Curtir</button><button type="button" class="sv" data-sv="${p.id}" aria-pressed="${sv}">${sv?'★':'☆'} Salvar</button></div></div></article>`;
}
function reveal(el,p,chosen){
  el.querySelectorAll('[data-q]').forEach((b,i)=>{b.disabled=true;if(i===p.a)b.classList.add('ok');else if(i===chosen)b.classList.add('bad');});
  const ok=chosen===p.a;
  el.querySelector('.fd-r').innerHTML=`<p class="fd-res"><b>${ok?'Acertou.':'Errou. A certa está em verde.'}</b>${esc(p.e)}</p>`+
    (!ok&&serr?`<div class="fd-acts"><button type="button" data-cad="${p.id}">＋ Mandar pro caderno de erros</button></div>`:'');
}
function append(L){
  const M=chMap().m,host=$('fd-list'),tmp=document.createElement('div');tmp.innerHTML=L.map(p=>card(p,M)).join('');
  [...tmp.children].forEach(el=>{host.appendChild(el);const p=BY[el.dataset.id];if(view==='s'&&p.k==='q'&&st.v[p.id+'#']!=null)reveal(el,p,st.v[p.id+'#']);});
  L.forEach(p=>{seen[p.id]=(seen[p.id]||0)+1;});keepSeen();
}
function info(){
  const {m,wi}=chMap();const done=Object.values(m).filter(c=>c.done).length;
  const n=RAW.filter(p=>m[p.ch]&&(m[p.ch].done||m[p.ch].wi<=wi+1)).length;
  $('fd-info').textContent=view==='s'?'Os posts que você salvou, pra revisar.':
    (done?`O feed repete mais os ${done} capítulos que você já marcou como feitos. `:'Quando você marcar capítulos como feitos, o feed passa a repetir mais o que já estudou. ')+`${n} posts no ar agora.`;
}
function more(){
  if(view==='s')return;
  const L=pick(10);
  if(!L.length){$('fd-more').textContent='Você viu tudo por agora. Posts novos chegam toda semana.';return;}
  append(L);$('fd-more').textContent='Carregando mais…';
}
function render(){
  $('fd-list').innerHTML='';shown.clear();info();
  document.querySelectorAll('#fd-seg [data-v]').forEach(b=>b.setAttribute('aria-pressed',b.dataset.v===view));
  if(view==='s'){
    const L=RAW.filter(p=>st.s[p.id]).reverse();
    if(!L.length){$('fd-list').innerHTML='<p class="fd-empty">Nada salvo ainda. Toque em ☆ Salvar num post pra guardar aqui.</p>';$('fd-more').textContent='';return;}
    append(L);$('fd-more').textContent='Fim dos salvos.';return;
  }
  more();
}
$('fd-seg').addEventListener('click',e=>{const b=e.target.closest('[data-v]');if(!b)return;view=b.dataset.v;render();});
$('fd-list').addEventListener('click',e=>{
  const t=e.target.closest('button');if(!t)return;const art=t.closest('.fd-post');
  if(t.dataset.th){const d=art.querySelector('.fd-th');d.hidden=!d.hidden;t.textContent=d.hidden?`Mostrar sequência (${d.children.length})`:'Esconder sequência';}
  else if(t.dataset.q){const p=BY[t.dataset.q],i=+t.dataset.i;reveal(art,p,i);sdoc.set({v:{...st.v,[p.id]:i===p.a?'v':'x',[p.id+'#']:i}});}
  else if(t.dataset.lk){const id=t.dataset.lk,on=!st.l[id],l={...st.l};if(on)l[id]=1;else delete l[id];sdoc.set({l});t.setAttribute('aria-pressed',on);t.textContent=(on?'♥':'♡')+' Curtir';}
  else if(t.dataset.sv){const id=t.dataset.sv,on=!st.s[id],s={...st.s};if(on)s[id]=1;else delete s[id];sdoc.set({s});t.setAttribute('aria-pressed',on);t.textContent=(on?'★':'☆')+' Salvar';}
  else if(t.dataset.cad){const p=BY[t.dataset.cad],c=chMap().m[p.ch];if(!serr||!c)return;
    serr.add({d:new Date().toISOString().slice(0,10),disc:c.d,ch:String(c.c).split(' ')[0],a:p.x.slice(0,80),q:'',o:'Enquete do Feed'});
    t.disabled=true;t.textContent='✓ Está no caderno (aba Notas)';}
});
try{$('fd-start').checked=localStorage.getItem('pcpe-start-feed')==='1';}catch(e){}
$('fd-start').addEventListener('change',e=>{try{localStorage.setItem('pcpe-start-feed',e.target.checked?'1':'0');}catch(_){}});
let started=false;const start=()=>{if(!started){started=true;render();}};
new IntersectionObserver(es=>{if(started&&es.some(x=>x.isIntersecting)&&!$('feed').hidden)more();},{rootMargin:'600px'}).observe($('fd-more'));
const tb=$('tb-feed');if(tb)tb.addEventListener('click',start);
try{if(localStorage.getItem('pcpe-start-feed')==='1'&&window.__tab){window.__tab('feed');start();}}catch(e){}
})();
