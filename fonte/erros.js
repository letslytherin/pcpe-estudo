/* ---------- caderno de erros ---------- */
(function(){
const ST=window.__st;if(!ST||!document.getElementById('err-list'))return;
const $=id=>document.getElementById(id);
const esc=s=>String(s==null?'':s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const SIM1='https://questoes.grancursosonline.com.br/aluno/simulado/30224117/resultado';
const DC='Direito Constitucional',DA='Direito Administrativo',DP='Direito Penal',PP='Direito Processual Penal',LE='Legislação Estadual',
      PT='Português',IN='Informática',RL='Raciocínio Lógico',CT='Contabilidade Geral',ES='Estatística';
/* [código Gran, disciplina, capítulo do cronograma, assunto] */
const G=[
['3138392',LE,'4.','Constituição de Pernambuco'],['3138394',LE,'2.','Estatuto do Policial Civil (Lei 6.425/1972)'],
['3138395',LE,'2.','Estatuto do Policial Civil (Lei 6.425/1972)'],['3138398',DC,'1.','Objetivos fundamentais da República (art. 3º)'],
['3138399',DC,'4.','Direitos individuais do art. 5º'],['3138400',DC,'12.','Delegação de atribuições do Presidente da República'],
['3138404',DA,'5.','Conceito e elementos do ato administrativo'],['3138407',DA,'10.','Responsabilidade civil do Estado'],
['3138985',DP,'9.','Crimes contra a dignidade sexual'],['3138989',PP,'2.','Lei processual penal no tempo e no espaço'],
['3138991',PP,'5.','Prazo do laudo pericial no CPP'],['3138993',PP,'9.','Prisão preventiva'],
['3139036',PT,'1.','Interpretação crítica do texto'],['3139039',PT,'1.','Tipologia textual'],
['3139040',PT,'7.','Orações subordinadas adverbiais conformativas'],['3139042',PT,'6.','Flexão verbal: modos'],
['3139043',PT,'3.','Sentido de um advérbio no texto'],['3139044',PT,'9.','Concordância verbal e nominal'],
['3139045',PT,'15.','Redação oficial'],['3139046',IN,'1.','Windows: configurações e atalhos'],
['3139048',IN,'8.','Planilha: fórmulas'],['3139049',IN,'10.','PowerPoint 365'],
['3139050',IN,'6.','Backup'],['3139056',IN,'3.','Mecanismos de busca'],
['3139091',RL,'7.','Combinatória: subconjuntos de letras'],['3139094',RL,'10.','Argumentação: o que se pode concluir'],
['3139099',RL,'9.','Negação de conjunção (e)'],['3139100',RL,'2.','Regra de três composta (patrulha)'],
['3139109',RL,'2.','Regra de três composta (policiais e máquinas)'],['3139119',CT,'1.','Objetivo da contabilidade'],
['3139120',CT,'3.','Conta redutora do patrimônio líquido'],['3139128',CT,'5.','Fato contábil: pagamento com juros'],
['3139129',CT,'7.','Balancete de verificação'],['3139131',CT,'8.','Classificação no balanço patrimonial'],
['3139138',CT,'4.','Fundamentos da escrituração'],['3139157',ES,'3.','Medidas de posição a partir de uma tabela'],
['3139162',ES,'9.','Probabilidade'],['3139164',ES,'9.','Probabilidade'],
['3139169',ES,'8.','Técnicas de amostragem'],['3139175',ES,'5.','Medidas de dispersão']
].map(g=>({id:'g'+g[0],q:g[0],disc:g[1],ch:g[2],a:g[3],o:'1º simulado Gran (15/11)',url:SIM1}));
const DISCS=[DC,DA,DP,PP,LE,PT,IN,RL,CT,ES];
const MOT=['','Não sabia o conteúdo','Confundi conceitos','Interpretei errado','Desatenção','Chutei'];
let own={},stt={},filtro='prontas',fdisc='';
const sdoc=ST.docStore('progresso/erros',v=>{stt=v||{};render();});
const sown=ST.store('erros',v=>{own=v||{};render();});
function chapter(e){
  const C=window.__crono;if(!C||!e.ch)return null;
  for(const wk of C.weeks)for(const it of wk.items)if(it.kind==='cap'&&it.d===e.disc&&String(it.c).startsWith(e.ch+' '))return{w:wk.w,id:it.id,c:it.c,feito:!!C.done[it.id],s:wk.s};
  return null;
}
function all(){
  const o=Object.entries(own).map(([id,v])=>({id:'u'+id,uid:id,q:v.q||'',disc:v.disc,ch:v.ch||'',a:v.a,o:v.o||'Registro seu',url:''}));
  return G.concat(o).map(e=>{const s=stt[e.id]||{};const ch=chapter(e);
    return{...e,s,chap:ch,ok:!!s.ok,pronta:!s.ok&&(!ch||ch.feito)};});
}
function set(id,patch){const cur=stt[id]||{};sdoc.set({[id]:{...cur,...patch}});}
function row(e){
  const ch=e.chap;
  const onde=ch?(ch.feito?`<span class="er-ok">Capítulo estudado</span> · Semana ${ch.w}, ${esc(ch.c)}`:`Estude antes: <b>semana ${ch.w}</b>, ${esc(ch.c)}`):'Sem capítulo ligado';
  const tent=(e.s.t||[]).map(x=>x==='x'?'✗':'✓').join(' ');
  const mot=`<select data-mot="${e.id}" aria-label="Motivo do erro">${MOT.map(m=>`<option value="${esc(m)}"${(e.s.m||'')===m?' selected':''}>${m||'Por que errou?'}</option>`).join('')}</select>`;
  const cod=e.q?`<button type="button" class="er-cod" data-cod="${esc(e.q)}" title="Copiar código">Q${esc(e.q)}</button>`:'';
  const abrir=e.url?`<a class="glink" href="${e.url}" target="_blank" rel="noopener">Ver no simulado ↗</a>`:'';
  const acts=e.ok?`<button type="button" class="xbtn2" data-undo="${e.id}">Voltar para pendentes</button>`:
    `<button type="button" class="xbtn2" data-acertei="${e.id}">Refiz e acertei</button><button type="button" class="xbtn2" data-errei="${e.id}">Errei de novo</button>`;
  return `<div class="er-row${e.pronta?' er-pronta':''}"><div class="er-top"><span class="er-disc">${esc(e.disc)}</span>${cod}${tent?`<span class="er-t" title="Tentativas">${tent}</span>`:''}</div>
    <p class="er-a">${esc(e.a)}</p><p class="muted xsmall">${onde} · ${esc(e.o)}</p>
    <div class="er-acts">${mot}${abrir}${acts}${e.uid?`<button type="button" class="er-del" data-del="${e.uid}" aria-label="Apagar">Apagar</button>`:''}</div></div>`;
}
function render(){
  if(!$('err-list'))return;
  const L=all();
  const pend=L.filter(e=>!e.ok),prontas=L.filter(e=>e.pronta),feitas=L.filter(e=>e.ok);
  $('err-stats').innerHTML=`<div><b>${prontas.length}</b><span>prontas para refazer</span></div><div><b>${pend.length-prontas.length}</b><span>esperando o capítulo</span></div><div><b>${feitas.length}</b><span>refeitas e acertadas</span></div>`;
  const by={};pend.forEach(e=>{by[e.disc]=(by[e.disc]||0)+1;});
  $('err-top').textContent=pend.length?'Mais erros pendentes: '+Object.entries(by).sort((a,b)=>b[1]-a[1]).slice(0,3).map(([d,n])=>d+' ('+n+')').join(', ')+'.':'';
  let V=filtro==='prontas'?prontas:filtro==='todas'?pend:feitas;
  if(fdisc)V=V.filter(e=>e.disc===fdisc);
  V.sort((a,b)=>(a.chap?a.chap.w:99)-(b.chap?b.chap.w:99));
  $('err-list').innerHTML=V.length?V.map(row).join(''):`<p class="xempty">${filtro==='prontas'?'Nada pronto para refazer agora. Os erros entram aqui quando você marca o capítulo deles como feito no cronograma.':'Nada aqui.'}</p>`;
  document.querySelectorAll('#err-filt [data-f]').forEach(b=>b.setAttribute('aria-pressed',b.dataset.f===filtro?'true':'false'));
  const h=$('h-err');
  if(h)h.innerHTML=prontas.length?`<p class="xsmall" style="margin-top:12px">Caderno de erros: <b>${prontas.length}</b> ${prontas.length===1?'questão pronta':'questões prontas'} para refazer. <button type="button" class="xbtn2" id="h-err-go">Abrir</button></p>`:'';
  const go=$('h-err-go');if(go)go.addEventListener('click',()=>{window.__tab&&window.__tab('notas');setTimeout(()=>$('err-card').scrollIntoView({block:'start'}),50);});
}
$('err-filt').addEventListener('click',e=>{const b=e.target.closest('[data-f]');if(!b)return;filtro=b.dataset.f;render();});
$('err-disc').innerHTML='<option value="">Todas as disciplinas</option>'+DISCS.map(d=>`<option>${d}</option>`).join('');
$('err-disc').addEventListener('change',e=>{fdisc=e.target.value;render();});
$('err-fdisc').innerHTML=DISCS.map(d=>`<option>${d}</option>`).join('');
$('err-list').addEventListener('change',e=>{const s=e.target.closest('[data-mot]');if(s)set(s.dataset.mot,{m:s.value});});
$('err-list').addEventListener('click',e=>{const t=e.target;
  const hoje=window.__crono&&window.__crono.hojeISO?window.__crono.hojeISO():'';
  if(t.dataset.acertei){const id=t.dataset.acertei;const c=stt[id]||{};set(id,{ok:true,t:(c.t||[]).concat('v'),d:hoje});}
  else if(t.dataset.errei){const id=t.dataset.errei;const c=stt[id]||{};set(id,{t:(c.t||[]).concat('x'),d:hoje});}
  else if(t.dataset.undo){set(t.dataset.undo,{ok:false});}
  else if(t.dataset.del){if(confirm('Apagar este erro do caderno?'))sown.del(t.dataset.del);}
  else if(t.dataset.cod){const c=t.dataset.cod;try{navigator.clipboard.writeText(c);t.textContent='Copiado';setTimeout(()=>t.textContent='Q'+c,1200);}catch(_){}}
});
$('f-err').addEventListener('submit',e=>{e.preventDefault();const f=new FormData(e.target);
  const a=String(f.get('a')||'').trim();if(!a)return;
  sown.add({d:new Date().toISOString().slice(0,10),disc:f.get('disc'),ch:String(f.get('ch')||'').trim().replace(/\.?$/,'.').replace(/^\.$/,''),a,q:String(f.get('q')||'').replace(/\D/g,''),o:String(f.get('o')||'').trim()});
  e.target.reset();});
const prev=window.__hoje;window.__hoje=()=>{prev&&prev();render();};
render();
})();
