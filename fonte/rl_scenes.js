const STAMP=(id,text,kind,y)=>({id,t:'stamp',text,kind,x:180,y:y||46});
const TAG=(id,text)=>({id,t:'tag',text,x:12,y:22});
const DOC=(id,text,x,y)=>({id,t:'doc',text,x,y,st:{o:0}});
const SCR=(id,lines,x,y)=>({id,t:'screen',lines,x:x||210,y:y||96,w:Math.max(124,Math.max(...lines.map(l=>l.length))*5.9+22),st:{o:0}});
const POL=(id,label,st,extra)=>Object.assign({id,t:'fig',label,hat:'pol',st},extra||{});
const ON={o:1,s:1}, OFF={o:0};
const SCENES=[
{id:'negacao',nav:'Negar "todo"',art:'Lógica proposicional',title:'Como negar "todo"',
 lead:'Basta um contraexemplo para derrubar uma frase com "todo".',
 actors:[
  POL('a','',{x:200,f:-1,s:.85}),POL('b','',{x:240,f:-1,s:.85}),POL('c','',{x:280,f:-1,s:.85}),
  POL('d','Este não',{x:320,f:-1,s:.85},{perp:1}),
  SCR('f1',['Frase:','Todo policial é honesto.'],110,92),
  SCR('n1',['Negação certa:','Algum policial não é honesto.'],110,92),
  SCR('n2',['Errado:','Nenhum policial é honesto.'],110,92),
  SCR('n3',['Frase:','Algum policial é corrupto.'],110,92),
  SCR('n4',['Negação:','Nenhum policial é corrupto.'],110,92),
  TAG('t1','1 de 3 · A frase'),TAG('t2','2 de 3 · A negação'),TAG('t3','3 de 3 · Negar "algum"'),
  STAMP('s1','BASTA UM','ok'),STAMP('s2','NENHUM: ERRADO','no'),STAMP('s3','ALGUM ↔ NENHUM','info')],
 steps:[
  {reset:1,set:{t1:{o:1},d:{o:0}},cap:'A frase diz que todo policial é honesto. Para ela ser falsa, o que precisa acontecer?',to:{f1:ON},ms:400,d:2600},
  {cap:'Basta aparecer um policial que não é honesto.',to:{d:{o:1}},ms:500,d:2200},
  {to:{s1:ON},ms:300,d:1800},

  {reset:1,set:{t2:{o:1}},cap:'Então a negação de "todo é" é "algum não é".',to:{n1:ON},ms:400,d:2600},
  {cap:'"Nenhum é honesto" vai longe demais. Não é a negação, é o oposto extremo.',to:{n1:OFF,n2:ON},ms:400,d:2600},
  {to:{s2:ON},ms:300,d:2000},

  {reset:1,set:{t3:{o:1},d:{o:0}},cap:'O caminho de volta: para negar "algum é", diga "nenhum é".',to:{n3:ON},ms:400,d:2400},
  {to:{n3:OFF,n4:ON},ms:400,d:2200},
  {to:{s3:ON},ms:300,d:2200}],
 rule:`<h3>Regra</h3>
  <div class="tbl"><table>
   <tr><th>Frase</th><th>Negação</th></tr>
   <tr><td>Todo A é B</td><td><b>Algum</b> A <b>não</b> é B</td></tr>
   <tr><td>Algum A é B</td><td><b>Nenhum</b> A é B</td></tr>
   <tr><td>Nenhum A é B</td><td><b>Algum</b> A é B</td></tr>
   <tr><td>Algum A não é B</td><td><b>Todo</b> A é B</td></tr>
  </table></div>
  <p>"Algum" pode ser trocado por "existe", "pelo menos um" ou "há".</p>
  <div class="trap"><b>Pegadinha:</b> "Todo A não é B" é ambíguo e quase nunca é a resposta. Procure a alternativa com "algum ... não" ou "existe ... que não".</div>`},

{id:'condicional',nav:'Se..., então',art:'Lógica proposicional',title:'Se chove, Bia leva guarda-chuva',
 lead:'A promessa só é quebrada em um caso dos quatro.',
 actors:[
  {id:'chuva',t:'rain',st:{o:0}},
  {id:'bia',t:'fig',label:'Bia',holdF:['umbrella'],st:{x:56}},
  SCR('p',['Promessa:','Se chover, Bia leva guarda-chuva.'],222,80),
  DOC('c1','Chove e leva: VERDADE',255,150),DOC('c2','Chove e não leva: FALSO',255,150),
  DOC('c3','Não chove e leva: VERDADE',255,150),DOC('c4','Não chove, não leva: VERDADE',255,150),
  TAG('t1','1 de 3 · Promessa cumprida'),TAG('t2','2 de 3 · Promessa quebrada'),TAG('t3','3 de 3 · Sem chuva'),
  STAMP('s1','V → V = V','ok',30),STAMP('s2','V → F = F','no',30),STAMP('s3','F → QUALQUER = V','ok',30)],
 steps:[
  {reset:1,set:{t1:{o:1}},cap:'Bia promete: se chover, ela leva guarda-chuva.',to:{p:ON},ms:400,d:2400},
  {cap:'Chove, e ela está com o guarda-chuva. Promessa cumprida.',to:{chuva:{o:1},bia:{h_umbrella:1,aF:-165}},ms:500,d:2400},
  {to:{c1:ON,s1:ON},ms:300,d:2200},

  {reset:1,set:{t2:{o:1},p:{o:1}},cap:'Chove, e Bia esqueceu o guarda-chuva.',to:{chuva:{o:1}},ms:500,d:2200},
  {cap:'Esse é o único caso em que a frase fica falsa: o "se" aconteceu e o "então" não.',to:{c2:ON,bia:{aF:-60,aB:60}},ms:400,d:2800},
  {to:{s2:ON},ms:300,d:2000},

  {reset:1,set:{t3:{o:1},p:{o:1}},cap:'Sem chuva, ela levou o guarda-chuva mesmo assim. Não quebrou nada.',to:{bia:{h_umbrella:1,aF:-20}},ms:400,d:2600},
  {to:{c3:ON},ms:300,d:1600},
  {cap:'Sem chuva e sem guarda-chuva, também não quebrou. Se o "se" não acontece, a frase é verdadeira.',to:{c3:OFF,c4:ON,bia:{h_umbrella:0}},ms:400,d:2800},
  {to:{s3:ON},ms:300,d:2000}],
 rule:`<h3>Regra</h3>
  <div class="tbl"><table>
   <tr><th>p (chove)</th><th>q (leva)</th><th>p → q</th></tr>
   <tr><td>V</td><td>V</td><td>V</td></tr>
   <tr><td>V</td><td>F</td><td><b>F</b></td></tr>
   <tr><td>F</td><td>V</td><td>V</td></tr>
   <tr><td>F</td><td>F</td><td>V</td></tr>
  </table></div>
  <ul>
   <li>Negação: ~(p → q) = <b>p e não q</b> ("chove e Bia não leva").</li>
   <li>Equivalentes: ~q → ~p ("se não levou, não choveu") e ~p ou q ("não chove ou leva").</li>
  </ul>
  <div class="trap"><b>Pegadinha:</b> "se q, então p" (a recíproca) não é equivalente. Bia levar o guarda-chuva não prova que choveu.</div>`},

{id:'porcentagem',nav:'+20% e −20%',art:'Porcentagem',title:'Sobe 20%, desce 20%: volta ao início?',
 lead:'Não volta. A segunda porcentagem incide sobre um valor maior.',
 actors:[
  {id:'b0',t:'blk',x:80,h:60,text:'100',kind:'full',st:{o:0}},
  {id:'b1',t:'blk',x:180,h:72,text:'120',kind:'full',st:{o:0}},
  {id:'b2',t:'blk',x:280,h:57.6,text:'96',kind:'full',st:{o:0}},
  DOC('d1','+20% de 100 = +20',130,198),DOC('d2','−20% de 120 = −24',230,198),
  SCR('f',['Fatores:','1,20 × 0,80 = 0,96','perda de 4%'],180,72),
  TAG('t1','1 de 2 · Passo a passo'),TAG('t2','2 de 2 · Atalho'),
  STAMP('s1','NÃO VOLTA A 100','no',30),STAMP('s2','MULTIPLIQUE OS FATORES','info',30)],
 steps:[
  {reset:1,set:{t1:{o:1}},cap:'Uma mercadoria custa 100 reais.',to:{b0:ON},ms:400,d:1800},
  {cap:'Sobe 20%: 20% de 100 são 20. Vai para 120.',to:{d1:ON,b1:ON},ms:400,d:2400},
  {cap:'Depois desce 20%. Mas agora são 20% de 120, ou seja, 24. Fica 96.',to:{d1:OFF,d2:ON,b2:ON},ms:400,d:2800},
  {to:{s1:ON},ms:300,d:2000},

  {reset:1,set:{t2:{o:1},b0:{o:1},b2:{o:1}},cap:'O atalho: aumento de 20% é multiplicar por 1,20; desconto de 20% é multiplicar por 0,80.',to:{f:ON},ms:400,d:3000},
  {cap:'1,20 vezes 0,80 dá 0,96. Ou seja, o preço final é 96% do inicial.',to:{s2:ON},ms:300,d:2600}],
 rule:`<h3>Regra</h3>
  <ul>
   <li>Aumento de x%: multiplique por <b>(1 + x/100)</b>. Desconto de x%: multiplique por <b>(1 − x/100)</b>.</li>
   <li>Aumentos e descontos seguidos: multiplique os fatores. A ordem não muda o resultado.</li>
   <li>+x% seguido de −x% sempre dá perda de <b>x²/100 %</b> (20% → perda de 4%).</li>
  </ul>
  <div class="trap"><b>Pegadinha:</b> dois aumentos de 10% não somam 20%: 1,1 × 1,1 = 1,21, ou seja, 21%.</div>`},

{id:'contagem',nav:'Combinação × arranjo',art:'Análise combinatória',title:'A ordem importa?',
 lead:'Três agentes, duas vagas. A conta muda se as vagas forem iguais ou diferentes.',
 actors:[
  POL('a','Ana',{x:100,s:.85}),POL('b','Beto',{x:180,s:.85}),POL('c','Caio',{x:260,s:.85}),
  SCR('p1',['Duplas para a ronda:','Ana+Beto · Ana+Caio · Beto+Caio'],180,80),
  SCR('p2',['Chefe e subchefe:','A-B · B-A · A-C','C-A · B-C · C-B'],180,80),
  TAG('t1','1 de 2 · Vagas iguais'),TAG('t2','2 de 2 · Vagas diferentes'),
  STAMP('s1','COMBINAÇÃO: 3','ok',26),STAMP('s2','ARRANJO: 3 × 2 = 6','ok',26)],
 steps:[
  {reset:1,set:{t1:{o:1}},cap:'Duas vagas iguais: formar uma dupla para a ronda.',to:{a:{x:150},b:{x:185}},ms:700,d:1600},
  {cap:'Ana com Beto é a mesma dupla que Beto com Ana. A ordem não importa.',to:{p1:ON},ms:400,d:2800},
  {to:{s1:ON},ms:300,d:2200},

  {reset:1,set:{t2:{o:1}},cap:'Agora as vagas são diferentes: um chefe e um subchefe.',to:{a:{aF:-150}},ms:400,d:2200},
  {cap:'Ana chefe e Beto subchefe não é o mesmo que o contrário. A ordem importa.',to:{p2:ON},ms:400,d:2800},
  {cap:'3 opções para chefe, depois 2 para subchefe: 3 × 2 = 6.',to:{s2:ON,a:{aF:-12}},ms:300,d:2600}],
 rule:`<h3>Regra</h3>
  <ul>
   <li>Pergunta-chave: <b>trocar a ordem gera um resultado novo?</b> Se sim, arranjo (ou princípio multiplicativo). Se não, combinação.</li>
   <li>Arranjo: A(n,p) = n! / (n − p)!. Ex.: A(3,2) = 6.</li>
   <li>Combinação: C(n,p) = n! / [p! (n − p)!]. Ex.: C(3,2) = 3.</li>
   <li>Permutação (todos em fila): n!. Com repetição de letras, divida pelos fatoriais das repetidas.</li>
  </ul>
  <div class="trap"><b>Pegadinha:</b> comissão, grupo, equipe, aperto de mão: combinação. Senha, placa, cargos distintos, pódio: a ordem importa.</div>`},

{id:'probabilidade',nav:'Probabilidade',art:'Probabilidade',title:'Bolas na urna',
 lead:'Três vermelhas e duas azuis. Tirar sem devolver muda a conta.',
 actors:[
  {id:'u',t:'urna',x:180,y:176},
  {id:'r1',t:'ball',x:158,y:162},{id:'r2',t:'ball',x:174,y:162},{id:'r3',t:'ball',x:190,y:162},
  {id:'z1',t:'ball',kind:'blue',x:166,y:148},{id:'z2',t:'ball',kind:'blue',x:182,y:148},
  {id:'bia',t:'fig',label:'Bia',st:{x:70}},
  SCR('q1',['P(vermelha) = 3/5'],290,80),
  SCR('q2',['2ª vermelha: 2/4','3/5 × 2/4 = 6/20','= 3/10'],290,80),
  TAG('t1','1 de 2 · Uma bola'),TAG('t2','2 de 2 · Duas, sem repor'),
  STAMP('s1','FAVORÁVEIS ÷ POSSÍVEIS','info',30),STAMP('s2','"E" SEGUIDO: MULTIPLICA','ok',30)],
 steps:[
  {reset:1,set:{t1:{o:1}},cap:'Na urna há 5 bolas: 3 vermelhas e 2 azuis.',to:{bia:{x:110,walk:1}},ms:900,d:1800},
  {cap:'Chance de tirar vermelha: 3 casos favoráveis em 5 possíveis.',to:{q1:ON,bia:{walk:0}},ms:400,d:2600},
  {to:{s1:ON},ms:300,d:2000},

  {reset:1,set:{t2:{o:1},bia:{x:110}},cap:'Bia tira uma vermelha e não devolve.',to:{r3:{x:130,y:118},bia:{aF:-100}},ms:700,d:2000},
  {cap:'Agora sobram 4 bolas, e só 2 vermelhas. A segunda chance é 2 em 4.',to:{r3:{o:0},q2:ON,bia:{aF:-12}},ms:400,d:2800},
  {cap:'Primeira vermelha E segunda vermelha: multiplique. Dá 3/10.',to:{s2:ON},ms:300,d:2600}],
 rule:`<h3>Regra</h3>
  <ul>
   <li>P = casos favoráveis ÷ casos possíveis.</li>
   <li>Eventos em sequência ("e"): <b>multiplique</b>. Sem reposição, o total e os favoráveis diminuem a cada retirada.</li>
   <li>Eventos alternativos ("ou", que não acontecem juntos): <b>some</b>.</li>
   <li>Complementar: P(não A) = 1 − P(A). Útil para "pelo menos um".</li>
  </ul>
  <div class="trap"><b>Pegadinha:</b> com reposição, a chance da segunda bola não muda (3/5 × 3/5). Leia se a bola é devolvida antes de fazer a conta.</div>`}
];
