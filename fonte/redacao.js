/* ---------- aba Redação ---------- */
(function(){
const R=window.__red||[];if(!R.length)return;
const $=id=>document.getElementById(id);
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const bold=s=>esc(s).replace(/\*\*(.+?)\*\*/g,'<b>$1</b>');
const words=m=>m.p.reduce((a,p)=>a+p[1].replace(/\*\*/g,'').split(/\s+/).length,0);
const D0=new Date(2026,10,15);
function idxHoje(){const t=new Date();t.setHours(0,0,0,0);const n=Math.round((t-D0)/864e5);return((n%R.length)+R.length)%R.length;}
let cur=idxHoje();
try{const o=JSON.parse(localStorage.getItem('pcpe-red-sel')||'null');const t=new Date().toDateString();if(o&&o.d===t&&o.i<R.length)cur=o.i;}catch(e){}
function modelo(m,full){
  const asp=m.a.map((a,i)=>`<li><b>${i+1}</b> ${esc(a)}</li>`).join('');
  const ps=m.p.map(p=>`<div class="rd-par"><span class="rd-tag">${esc(p[0])}</span><p>${bold(p[1])}</p></div>`).join('');
  const rep=m.r.length?`<details class="xmore"><summary>Repertório usado</summary><ul class="rd-ul">${m.r.map(r=>`<li>${esc(r)}</li>`).join('')}</ul></details>`:'';
  return `<div class="rd-mod"><p class="rd-cmd"><span class="muted xsmall">Comando</span><br>Redija um texto dissertativo acerca do tema <b>${esc(m.tema)}</b>. Aborde os seguintes aspectos:</p>
    <ol class="rd-asp">${asp}</ol>${ps}
    <p class="muted xsmall">${words(m)} palavras, cerca de ${Math.round(words(m)/9.5)} linhas escritas à mão.</p>${rep}</div>`;
}
function noite(){
  const m=R[cur];
  $('rd-noite').innerHTML=`<h3 class="rd-h">${cur+1}. ${esc(m.t)}</h3>`+modelo(m);
  try{localStorage.setItem('pcpe-red-sel',JSON.stringify({d:new Date().toDateString(),i:cur}))}catch(e){}
  hojeCard();
}
function hojeCard(){
  const el=$('h-red');if(!el)return;
  el.innerHTML=`<p>Leia o modelo <b>${esc(R[cur].t)}</b> (cerca de 5 minutos).</p><div class="xbtnrow"><button type="button" class="xbtn2" id="h-red-go">Abrir o modelo</button></div>`;
  $('h-red-go').addEventListener('click',()=>{window.__tab&&window.__tab('red');});
}
$('rd-prev').addEventListener('click',()=>{cur=(cur-1+R.length)%R.length;noite();});
$('rd-next').addEventListener('click',()=>{cur=(cur+1)%R.length;noite();});
$('rd-todos').innerHTML=R.map((m,i)=>`<details class="xmore rd-det"><summary>${i+1}. ${esc(m.t)}</summary>${modelo(m)}</details>`).join('');
const ESQ=[
 ['Introdução','3 a 5 linhas','Contextualize o tema com um fato ou uma referência (Constituição, lei, dado) e anuncie os três aspectos do comando.','[Fato ou referência sobre o tema]. <b>Nesse contexto</b>, [o tema] exige analisar [aspecto 1], [aspecto 2] e [aspecto 3].'],
 ['Desenvolvimento 1','6 a 7 linhas','Responda o aspecto 1 do comando, usando as palavras dele na primeira frase. Depois explique: causa, exemplo ou lei.','<b>Em primeiro lugar</b>, [aspecto 1]. [Explicação]. <b>Além disso</b>, [segundo argumento]. <b>Assim</b>, [fechamento].'],
 ['Desenvolvimento 2','6 a 7 linhas','Aspecto 2, na mesma lógica. Um parágrafo para cada aspecto, na ordem do comando.','<b>Em segundo lugar</b>, [aspecto 2]. [Explicação]. <b>Ademais</b>, [exemplo ou consequência].'],
 ['Desenvolvimento 3','6 a 7 linhas','Aspecto 3. Quando o comando pede medidas ou soluções, diga quem faz o quê.','<b>Diante disso</b>, [aspecto 3]. [Medida 1, com quem executa]. <b>Paralelamente</b>, [medida 2].'],
 ['Conclusão','3 a 4 linhas','Retome a ideia central e feche com uma frase de síntese. Não traga argumento novo.','<b>Portanto</b>, [retomada da tese]. [Síntese das medidas e frase final].']];
$('rd-esq').innerHTML=ESQ.map(e=>`<div class="rd-par"><span class="rd-tag">${e[0]} · ${e[1]}</span><p>${e[2]}</p><p class="rd-fx">${e[3]}</p></div>`).join('')+
 '<p class="muted xsmall">Total: 25 a 30 linhas. Sem título, sem primeira pessoa, sem gíria e sem pergunta retórica. Frases curtas erram menos.</p>';
const CON=[['Para abrir','Nesse contexto · Diante desse cenário · Nesse sentido'],['Para ordenar','Em primeiro lugar · Em segundo lugar · Por fim · De início'],
 ['Para somar','Além disso · Ademais · Somam-se a isso · Também'],['Para opor','Contudo · No entanto · Por outro lado · Embora (com verbo no subjuntivo)'],
 ['Para causa e efeito','Por isso · Assim · Como consequência · Razão pela qual'],['Para ações simultâneas','Paralelamente · Ao mesmo tempo · Por sua vez'],
 ['Para concluir','Portanto · Em suma · Em síntese · Conclui-se, portanto, que']];
$('rd-con').innerHTML='<div class="rd-con">'+CON.map(c=>`<div><b>${c[0]}</b><span>${c[1]}</span></div>`).join('')+'</div>';
const REP=['Art. 144 da Constituição: segurança pública é dever do Estado, direito e responsabilidade de todos.',
 'Art. 144, § 4º: a polícia civil exerce as funções de polícia judiciária e apura as infrações penais, exceto as militares.',
 'Lei 13.675/2018: cria o Sistema Único de Segurança Pública (SUSP), com atuação integrada, metas e compartilhamento de dados.',
 'Pacto pela Vida (Pernambuco, 2007): política de redução de homicídios baseada em metas e monitoramento.',
 'Anuário Brasileiro de Segurança Pública e Atlas da Violência: cite como fonte, sem inventar números.',
 'Inquérito policial, perícia e cadeia de custódia (arts. 158-A a 158-F do CPP): servem para temas de investigação e tecnologia.',
 'Dignidade da pessoa humana (art. 1º, III, da CF): serve para uso da força, sistema prisional e grupos vulneráveis.'];
$('rd-rep').innerHTML=REP.map(r=>`<li>${esc(r)}</li>`).join('');
const REV=['Os três aspectos do comando aparecem, cada um no seu parágrafo?','Passou de 30 linhas? Corte, porque o excesso não é lido.',
 'Há (tempo passado) e a (distância ou futuro): "há anos", "daqui a dois dias".','Mas (oposição) e mais (quantidade).',
 'Crase: antes de palavra masculina e de verbo não há crase.','Nunca separe sujeito e verbo com vírgula.',
 'Concordância: "existem problemas", "houve casos" (haver no sentido de existir não vai ao plural).','Por que, porque, por quê, porquê.',
 'Palavra que você não sabe escrever: troque por um sinônimo que você sabe.'];
$('rd-rev').innerHTML=REV.map(r=>`<li>${esc(r)}</li>`).join('');
const TR=['Desaparecimento de pessoas e a busca imediata (Lei 13.812/2019)','Controle de armas de fogo e redução de homicídios',
 'Violência contra crianças e adolescentes no ambiente digital','Violência nas escolas: prevenção e atuação policial',
 'Desinformação e notícias falsas em situações de crise na segurança pública','Violência contra a pessoa idosa','Tráfico de pessoas',
 'Roubos e furtos de celulares e o mercado de receptação'];
$('rd-treino').innerHTML=TR.map(r=>`<li>${esc(r)}</li>`).join('');
noite();
})();
