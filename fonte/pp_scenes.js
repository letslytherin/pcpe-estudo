const STAMP=(id,text,kind,y)=>({id,t:'stamp',text,kind,x:180,y:y||46});
const TAG=(id,text)=>({id,t:'tag',text,x:12,y:22});
const POL=(id,label,st,extra)=>Object.assign({id,t:'fig',label,alt:1,hat:'pol',st},extra||{});
const GRAB=[
  {cap:'Tito chega perto de Vera, que está mexendo no celular.',to:{tito:{x:165,walk:1}},ms:1400,d:1450},
  {cap:'Ele arranca o celular da mão dela.',to:{tito:{aF:-80}},ms:250,d:300},
  {to:{vera:{h_phone:0},tito:{h_phone:1,aF:-20}},ms:250,d:600}];
const SCENES=[
{id:'flagrante',nav:'Flagrante',art:'Art. 302 do CPP',title:'Flagrante próprio, impróprio e presumido',
 lead:'Tito vai roubar o celular de Vera. O que muda é o momento em que ele é pego.',
 actors:[
  {id:'vera',t:'fig',label:'Vera',holdF:['phone'],st:{x:205,f:-1,h_phone:1,aF:-45}},
  {id:'tito',t:'fig',label:'Tito',perp:1,holdF:['phone'],holdB:['knife'],st:{x:-30}},
  POL('pm','Policial',{x:335,f:-1}),
  {id:'b1',t:'bubble',text:'Pega ladrão!',x:205,y:104},
  {id:'b2',t:'bubble',text:'De quem é esse celular?',x:178,y:104},
  TAG('t1','1 de 3 · Pego na hora'),TAG('t2','2 de 3 · Perseguido'),TAG('t3','3 de 3 · Encontrado depois'),
  TAG('c2','Três ruas depois, sem perder Tito de vista'),TAG('c3','Pouco tempo depois, a duas quadras dali'),
  STAMP('s1','FLAGRANTE PRÓPRIO','info'),STAMP('s2','FLAGRANTE IMPRÓPRIO','info'),STAMP('s3','FLAGRANTE PRESUMIDO','info')],
 steps:[
  {reset:1,set:{t1:{o:1}},...GRAB[0]},GRAB[1],GRAB[2],
  {cap:'Um policial vê tudo e o prende ali mesmo.',to:{vera:{x:245},pm:{x:192,walk:1}},ms:1300,d:1350},
  {to:{pm:{walk:0,aF:-90},tito:{aF:-170,aB:170}},ms:300,d:700},
  {cap:'Pego cometendo o crime ou logo que acabou de cometê-lo: flagrante próprio.',to:{s1:{s:1,o:1}},ms:300,d:2600},

  {reset:1,set:{t2:{o:1},pm:{x:400}},...GRAB[0]},GRAB[1],GRAB[2],
  {to:{tito:{f:-1}},ms:200,d:240},
  {cap:'Tito foge. Vera grita e um policial que estava perto corre atrás dele.',to:{tito:{x:-50,walk:1.3},b1:{o:1,s:1}},ms:1100,d:500},
  {to:{pm:{x:-50,walk:1.3}},ms:1700,d:1800},
  {set:{t2:{o:0},c2:{o:1},b1:{o:0},vera:{o:0},tito:{x:400,walk:1.3},pm:{x:470,walk:1.3}},to:{tito:{x:140},pm:{x:175}},ms:1700,d:1750},
  {to:{tito:{walk:0,aF:-170,aB:170},pm:{walk:0,aF:-90}},ms:300,d:800},
  {cap:'Perseguido logo após o crime, sem interrupção: flagrante impróprio. A perseguição pode durar horas.',to:{s2:{s:1,o:1}},ms:300,d:2600},

  {reset:1,set:{t3:{o:1},pm:{x:400}},...GRAB[0]},GRAB[1],GRAB[2],
  {to:{tito:{f:-1}},ms:200,d:240},
  {cap:'Tito vai embora andando. Ninguém corre atrás dele.',to:{tito:{x:-50,walk:.6}},ms:1800,d:1900},
  {set:{t3:{o:0},c3:{o:1},vera:{o:0},tito:{x:120,f:1,walk:0,aF:-45,h_knife:1}},cap:'Pouco depois, um policial o encontra com o celular e uma faca.',to:{pm:{x:178,walk:1}},ms:1600,d:1650},
  {to:{pm:{walk:0,aF:-90},b2:{o:1,s:1}},ms:300,d:1500},
  {cap:'Encontrado logo depois com objetos que indicam que é o autor: flagrante presumido.',to:{b2:{o:0},s3:{s:1,o:1}},ms:300,d:2600}],
 rule:`<h3>Regra</h3>
  <div class="tbl"><table>
   <tr><th>Espécie</th><th>Situação</th></tr>
   <tr><td><b>Próprio</b> (I e II)</td><td>Está cometendo ou acabou de cometer a infração</td></tr>
   <tr><td><b>Impróprio</b> (III)</td><td>É perseguido, logo após, em situação que faça presumir que é o autor</td></tr>
   <tr><td><b>Presumido</b> (IV)</td><td>É encontrado, logo depois, com instrumentos, armas ou objetos que façam presumir que é o autor</td></tr>
  </table></div>
  <div class="trap"><b>Pegadinha:</b> qualquer pessoa <b>pode</b> prender em flagrante (facultativo); a polícia <b>deve</b> (obrigatório, art. 301). Nos crimes permanentes, como sequestro, o flagrante dura enquanto durar a permanência (art. 303).</div>`},

{id:'preparado-esperado',nav:'Preparado × esperado',art:'Súmula 145 do STF',title:'Flagrante preparado × esperado',
 lead:'Nas duas cenas a polícia prende Beto. Só uma prisão vale.',
 actors:[
  POL('pol','Policial',{x:30,o:1}),
  {id:'wall',t:'wall',x:30,y:180},
  {id:'desk',t:'desk',x:262,y:180,st:{o:0}},
  {id:'caixa',t:'fig',label:'Caixa',st:{x:280,f:-1,o:0}},
  {id:'disf',t:'fig',label:'Policial disfarçado',alt:1,st:{x:250,f:-1,o:0}},
  {id:'carteira',t:'walletp',x:200,y:178,st:{o:0}},
  {id:'beto',t:'fig',label:'Beto',perp:1,holdF:['wallet','knife'],st:{x:130}},
  {id:'b1',t:'bubble',text:'Pega aquela carteira, ninguém vê!',x:250,y:104},
  {id:'b2',t:'bubble',text:'Polícia! Parado!',x:150,y:104},
  {id:'b3',t:'bubble',text:'Passa o dinheiro!',x:215,y:104},
  TAG('t1','1 de 2 · A polícia provoca o crime'),TAG('t2','2 de 2 · A polícia só espera'),
  STAMP('s1','FLAGRANTE PREPARADO: ILEGAL','no'),STAMP('s2','FLAGRANTE ESPERADO: VÁLIDO','ok')],
 steps:[
  {reset:1,set:{t1:{o:1},disf:{o:1},carteira:{o:1}},cap:'A polícia deixa uma carteira no chão. Um policial disfarçado incentiva Beto a pegá-la.',to:{b1:{o:1,s:1}},ms:300,d:2000},
  {cap:'Beto vai até lá e pega a carteira.',to:{b1:{o:0},beto:{x:195,walk:1}},ms:900,d:950},
  {to:{beto:{walk:0,aF:-20},carteira:{o:0}},ms:300,d:300},
  {to:{beto:{h_wallet:1,aF:-60}},ms:250,d:500},
  {cap:'Na mesma hora, um policial sai de trás do muro e o prende.',to:{pol:{x:150,walk:1}},ms:900,d:950},
  {to:{pol:{walk:0,aF:-90},b2:{o:1,s:1},beto:{aF:-170,aB:170,h_wallet:0}},ms:300,d:1300},
  {cap:'A polícia provocou o crime e garantiu que ele não se consumaria. É crime impossível, e a prisão é ilegal.',to:{b2:{o:0},s1:{s:1,o:1}},ms:300,d:2800},

  {reset:1,set:{t2:{o:1},desk:{o:1},caixa:{o:1},beto:{x:-40,h_knife:1}},cap:'A polícia descobre que o mercado vai ser assaltado e espera escondida atrás do muro.',to:{pol:{y:184}},ms:400,d:1600},
  {cap:'Beto chega por conta própria e anuncia o assalto.',to:{beto:{x:205,walk:1}},ms:1700,d:1750},
  {to:{beto:{walk:0,aF:-90},b3:{o:1,s:1},caixa:{aF:-170,aB:170}},ms:300,d:1500},
  {to:{b3:{o:0},pol:{x:150,y:180,walk:1}},ms:900,d:950},
  {to:{pol:{walk:0,aF:-90},b2:{o:1,s:1},beto:{aF:-170,aB:170,h_knife:0}},ms:300,d:1300},
  {cap:'Ninguém induziu Beto: a polícia só aguardou o crime começar. A prisão é válida.',to:{b2:{o:0},s2:{s:1,o:1}},ms:300,d:2800}],
 rule:`<h3>Regra</h3>
  <div class="tbl"><table>
   <tr><th>Modalidade</th><th>O que acontece</th><th>Vale?</th></tr>
   <tr><td><b>Preparado</b></td><td>O agente é induzido a cometer o crime e a polícia impede a consumação</td><td>Não. É crime impossível</td></tr>
   <tr><td><b>Esperado</b></td><td>A polícia, informada, aguarda o crime acontecer</td><td>Sim</td></tr>
   <tr><td><b>Forjado</b></td><td>Provas plantadas por quem prende</td><td>Não. Quem forja comete crime</td></tr>
   <tr><td><b>Diferido</b></td><td>A polícia adia a prisão para colher mais provas (ação controlada)</td><td>Sim, quando previsto em lei</td></tr>
  </table></div>
  <div class="trap"><b>Pegadinha:</b> o agente policial disfarçado (Pacote Anticrime) é válido quando já existia conduta criminosa antes, como vender droga a um policial que se passa por comprador.</div>`},

{id:'busca-domiciliar',nav:'Busca em casa',art:'CF, art. 5º, XI · CPP, arts. 240 a 248',title:'Quando a polícia pode entrar na casa',
 lead:'A mesma casa, três situações diferentes.',
 actors:[
  {id:'night',t:'night',x:0,y:0,st:{o:0}},
  {id:'sun',t:'sun',x:40,y:40},
  {id:'moon',t:'moon',x:40,y:40,st:{o:0}},
  {id:'house',t:'house',x:255,y:180},
  {id:'door',t:'door',x:255,y:180},
  {id:'mor',t:'fig',label:'Morador',st:{x:228,f:-1,o:0}},
  POL('pol','Policial',{x:-30,h_paper:1},{holdF:['paper']}),
  {id:'b1',t:'bubble',text:'Mandado de busca. Vou ler para o senhor.',x:185,y:104},
  {id:'b2',t:'bubble',text:'Polícia! Temos mandado, abra!',x:185,y:104},
  {id:'b3',t:'bubble',text:'De noite eu não autorizo.',x:228,y:104},
  {id:'b4',t:'bubble',text:'Socorro! Ele vai me matar!',x:262,y:104},
  TAG('t1','1 de 3 · 14h, com mandado'),TAG('t2','2 de 3 · 23h, com mandado'),TAG('t3','3 de 3 · 23h, sem mandado'),
  STAMP('s1','DE DIA, COM MANDADO: ENTRA','ok'),STAMP('s2','À NOITE: SÓ SE O MORADOR DEIXAR','info'),STAMP('s3','SOCORRO: ENTRA SEM MANDADO','ok')],
 steps:[
  {reset:1,set:{t1:{o:1}},cap:'São 14h. O policial chega com um mandado judicial.',to:{pol:{x:185,walk:1}},ms:1600,d:1650},
  {to:{pol:{walk:0},door:{o:0},mor:{o:1}},ms:400,d:500},
  {cap:'Antes de entrar, ele mostra e lê o mandado ao morador.',to:{pol:{aF:-90},b1:{o:1,s:1}},ms:300,d:2200},
  {to:{b1:{o:0},mor:{o:0},pol:{aF:-12}},ms:400,d:450},
  {to:{pol:{x:228,walk:1}},ms:700,d:700},
  {to:{pol:{o:0,walk:0}},ms:300,d:400},
  {cap:'O mandado indica a casa, o motivo e o objetivo. Se o morador resistir, a porta pode ser arrombada.',to:{s1:{s:1,o:1}},ms:300,d:2800},

  {reset:1,set:{t2:{o:1},night:{o:1},sun:{o:0},moon:{o:1}},cap:'Agora são 23h. O policial chega com o mesmo tipo de mandado.',to:{pol:{x:185,walk:1}},ms:1600,d:1650},
  {to:{pol:{walk:0,aF:-90},b2:{o:1,s:1}},ms:300,d:1500},
  {to:{b2:{o:0},door:{o:0},mor:{o:1}},ms:400,d:450},
  {cap:'O morador não autoriza a entrada à noite.',to:{b3:{o:1,s:1},pol:{aF:-12}},ms:300,d:1800},
  {cap:'Mandado se cumpre de dia. Sem o consentimento do morador, a equipe espera amanhecer.',to:{b3:{o:0},s2:{s:1,o:1}},ms:300,d:2800},

  {reset:1,set:{t3:{o:1},night:{o:1},sun:{o:0},moon:{o:1},pol:{h_paper:0}},cap:'23h. O policial passa pela rua, sem mandado nenhum.',to:{pol:{x:150,walk:1}},ms:1400,d:1450},
  {cap:'De dentro da casa, alguém grita por socorro.',to:{pol:{walk:0},b4:{o:1,s:1}},ms:300,d:1700},
  {to:{b4:{o:0},pol:{x:200,walk:1.3}},ms:500,d:520},
  {to:{pol:{walk:0,lF:-60}},ms:200,d:220},
  {to:{door:{o:0},pol:{lF:-10}},ms:200,d:300},
  {to:{pol:{x:228,walk:1}},ms:500,d:500},
  {to:{pol:{o:0,walk:0}},ms:300,d:400},
  {cap:'Em flagrante, desastre ou para prestar socorro, a polícia pode entrar a qualquer hora, sem mandado.',to:{s3:{s:1,o:1}},ms:300,d:2800}],
 rule:`<h3>Regra</h3>
  <ul>
   <li><b>Com mandado judicial:</b> só durante o dia, salvo se o morador consentir. O mandado diz a casa, o motivo e os fins.</li>
   <li><b>Sem mandado, a qualquer hora:</b> flagrante delito, desastre ou para prestar socorro.</li>
   <li>Antes de entrar, o executor mostra e lê o mandado. Se não houver ninguém, chama-se um vizinho para acompanhar.</li>
   <li>Ao final, auto circunstanciado assinado por duas testemunhas presenciais.</li>
  </ul>
  <div class="trap"><b>Pegadinha:</b> cumprir mandado após as 21h ou antes das 5h é abuso de autoridade. E entrar sem mandado alegando flagrante exige <b>fundadas razões</b>, justificadas depois (STF, Tema 280); sem elas, a prova é nula.</div>`},

{id:'prova-ilicita',nav:'Prova ilícita',art:'Art. 157 do CPP',title:'Prova ilícita e fonte independente',
 lead:'Uma casa, um mapa e um depósito de drogas.',
 actors:[
  {id:'house',t:'house',x:80,y:180,st:{s:.75}},
  {id:'door',t:'door',x:80,y:180,st:{s:.75}},
  {id:'depot',t:'depot',x:292,y:180},
  POL('pol','Policial',{x:170,f:-1},{holdF:['paper']}),
  POL('eq2','Equipe 2',{x:400,f:-1},{holdF:['folder']}),
  {id:'b1',t:'bubble',text:'Vou entrar só pra dar uma olhada.',x:150,y:104},
  TAG('t1','1 de 2 · O que nasce da prova ilícita'),TAG('t2','2 de 2 · Fonte independente'),
  STAMP('s1','PROVA ILÍCITA','no'),STAMP('s2','DERIVADA: TAMBÉM ILÍCITA','no'),STAMP('s3','FONTE INDEPENDENTE: VALE','ok')],
 steps:[
  {reset:1,set:{t1:{o:1}},cap:'Sem mandado e sem nenhum indício concreto, o policial decide arrombar uma casa.',to:{b1:{o:1,s:1}},ms:300,d:1800},
  {to:{b1:{o:0},pol:{x:105,walk:1}},ms:900,d:950},
  {to:{pol:{walk:0,aF:-90}},ms:200,d:220},
  {to:{door:{o:0},pol:{aF:-12}},ms:200,d:300},
  {to:{pol:{x:60,walk:1}},ms:500,d:500},
  {to:{pol:{o:0,walk:0}},ms:300,d:900},
  {cap:'Lá dentro, ele acha um mapa que leva a um depósito de drogas.',set:{pol:{f:1,h_paper:1}},to:{pol:{o:1,x:100}},ms:500,d:900},
  {to:{s1:{s:1,o:1}},ms:300,d:1800},
  {cap:'Seguindo o mapa, ele chega ao depósito e apreende a droga.',to:{s1:{o:0},pol:{x:225,walk:1}},ms:1500,d:1550},
  {to:{pol:{walk:0,aF:-90}},ms:300,d:600},
  {cap:'O que veio da prova ilícita também é ilícito (frutos da árvore envenenada) e deve sair do processo.',to:{s2:{s:1,o:1}},ms:300,d:2800},

  {reset:1,set:{t2:{o:1}},cap:'Mesma entrada ilegal, mesmo mapa...',to:{pol:{x:105,walk:1}},ms:900,d:950},
  {to:{pol:{walk:0},door:{o:0}},ms:300,d:300},
  {to:{pol:{x:60,walk:1}},ms:500,d:500},
  {to:{pol:{o:0,walk:0}},ms:300,d:600},
  {set:{pol:{f:1,h_paper:1}},to:{pol:{o:1,x:100}},ms:500,d:700},
  {cap:'...mas outra equipe já investigava o depósito, com interceptação autorizada pelo juiz.',set:{eq2:{h_folder:1}},to:{eq2:{x:228,walk:1}},ms:1500,d:1550},
  {to:{eq2:{walk:0,aF:-90}},ms:300,d:900},
  {cap:'Essa investigação chegaria ao depósito por si só. Por isso, a prova do depósito vale.',to:{s3:{s:1,o:1}},ms:300,d:2800}],
 rule:`<h3>Regra</h3>
  <ul>
   <li>Provas obtidas com violação de normas constitucionais ou legais são <b>inadmissíveis</b> e devem ser retiradas do processo.</li>
   <li>As <b>derivadas</b> também, salvo se não houver nexo causal com a ilícita ou se puderem ser obtidas por <b>fonte independente</b>.</li>
   <li>Fonte independente é a que, seguindo os passos normais da investigação, <b>por si só</b> levaria ao fato (§ 2º).</li>
  </ul>
  <div class="trap"><b>Pegadinha:</b> a prova ilícita <b>a favor do réu</b> é admitida. E o encontro fortuito (serendipidade) numa diligência lícita, como descobrir outro crime numa interceptação autorizada, é válido.</div>`},

{id:'reconhecimento',nav:'Reconhecimento',art:'Art. 226 do CPP',title:'Reconhecimento de pessoas',
 lead:'Lia foi assaltada e vai à delegacia apontar o autor.',
 actors:[
  {id:'lia',t:'fig',label:'Lia',st:{x:50}},
  {id:'l1',t:'fig',label:'1',hat:'bone',st:{x:150,f:-1,s:.95,o:0}},
  {id:'l2',t:'fig',label:'2',hat:'bone',st:{x:195,f:-1,s:1.04,o:0}},
  {id:'l3',t:'fig',label:'3',hat:'bone',st:{x:240,f:-1,s:1,o:0}},
  {id:'l4',t:'fig',label:'4',hat:'bone',st:{x:285,f:-1,s:.98,o:0}},
  POL('pol','Policial',{x:300,f:-1,o:0}),
  {id:'b1',t:'bubble',text:'Era alto e usava boné vermelho.',x:60,y:104},
  {id:'b2',t:'bubble',text:'Foi o número 3.',x:60,y:104},
  {id:'b3',t:'bubble',text:'Foi esse aqui, né?',x:300,y:104},
  {id:'b4',t:'bubble',text:'Acho que foi...',x:60,y:104},
  TAG('t1','1 de 2 · Com o rito da lei'),TAG('t2','2 de 2 · Sem o rito'),
  STAMP('s1','RECONHECIMENTO VÁLIDO','ok'),STAMP('s2','RECONHECIMENTO INVÁLIDO','no')],
 steps:[
  {reset:1,set:{t1:{o:1}},cap:'Antes de ver qualquer pessoa, Lia descreve quem a assaltou.',to:{b1:{o:1,s:1}},ms:300,d:2000},
  {cap:'Depois, o suspeito é colocado ao lado de pessoas parecidas com ele.',to:{b1:{o:0},l1:{o:1},l2:{o:1},l3:{o:1},l4:{o:1}},ms:700,d:2000},
  {cap:'Lia aponta quem reconhece.',to:{lia:{aF:-95},b2:{o:1,s:1}},ms:300,d:1700},
  {cap:'Tudo vai para um auto detalhado, assinado por duas testemunhas presenciais.',to:{b2:{o:0},lia:{aF:-12},s1:{s:1,o:1}},ms:300,d:2800},

  {reset:1,set:{t2:{o:1}},cap:'Agora o policial mostra a Lia um único suspeito.',to:{l3:{o:1},pol:{o:1}},ms:600,d:1200},
  {to:{pol:{aF:-90},b3:{o:1,s:1}},ms:300,d:1700},
  {cap:'Lia não descreveu ninguém antes e não há outras pessoas para comparar.',to:{b3:{o:0},b4:{o:1,s:1}},ms:300,d:1900},
  {cap:'Esse reconhecimento é inválido e não pode sustentar uma condenação, nem se Lia repetir em juízo.',to:{b4:{o:0},pol:{aF:-12},s2:{s:1,o:1}},ms:300,d:2800}],
 rule:`<h3>Regra</h3>
  <ul>
   <li>Quem vai reconhecer <b>descreve</b> a pessoa antes.</li>
   <li>O suspeito fica, se possível, <b>ao lado de pessoas parecidas</b>.</li>
   <li>Havendo risco de intimidação, o reconhecido não vê quem o reconhece. Essa cautela não vale em juízo nem no plenário.</li>
   <li>Lavra-se auto pormenorizado, assinado por <b>duas testemunhas presenciais</b>.</li>
  </ul>
  <div class="trap"><b>Pegadinha:</b> para o STF e o STJ, o art. 226 é garantia mínima, não mera recomendação. O reconhecimento por <b>foto</b> segue o mesmo rito e, sozinho, não basta para condenar.</div>`}
];
