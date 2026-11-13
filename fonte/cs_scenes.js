const STAMP=(id,text,kind,y)=>({id,t:'stamp',text,kind,x:180,y:y||46});
const TAG=(id,text)=>({id,t:'tag',text,x:12,y:22});
const POL=(id,label,st,extra)=>Object.assign({id,t:'fig',label,alt:1,hat:'pol',st},extra||{});
const DOC=(id,text,x,y)=>({id,t:'doc',text,x,y,st:{o:0}});
const SCR=(id,lines,x,y)=>({id,t:'screen',lines,x,y,st:{o:0}});
const ON={o:1,s:1};
const SCENES=[
{id:'direitos-do-preso',nav:'Direitos do preso',art:'CF, art. 5º, LXI a LXIV · SV 11',title:'Direitos de quem é preso',
 lead:'Davi acaba de ser preso em flagrante. Três momentos da prisão.',
 actors:[
  {id:'davi',t:'fig',label:'Davi',holdF:['cuffs'],st:{x:140}},
  POL('pol','Agente Lima',{x:200,f:-1}),
  DOC('dj','COMUNICADO AO JUIZ',282,74),DOC('df','COMUNICADO À FAMÍLIA',282,108),
  DOC('dw','JUSTIFICATIVA POR ESCRITO',250,90),
  {id:'b1',t:'bubble',text:'Você tem direito de ficar calado.',x:205,y:104},
  {id:'b2',t:'bubble',text:'Sou o agente Lima, matrícula 4521.',x:205,y:104},
  {id:'b3',t:'bubble',text:'Posso avisar minha mãe?',x:140,y:104},
  {id:'b4',t:'bubble',text:'Pode. E o juiz será avisado agora.',x:205,y:104},
  TAG('t1','1 de 3 · Na hora da prisão'),TAG('t2','2 de 3 · Na delegacia'),TAG('t3','3 de 3 · Algemas'),
  STAMP('s1','SILÊNCIO E IDENTIFICAÇÃO','ok'),STAMP('s2','COMUNICAÇÃO IMEDIATA','ok'),STAMP('s3','ALGEMA SÓ COM MOTIVO','info')],
 steps:[
  {reset:1,set:{t1:{o:1}},cap:'Davi é preso em flagrante. Antes de tudo, o agente informa os direitos dele.',to:{b1:ON,pol:{aF:-60}},ms:300,d:2000},
  {cap:'Davi também tem direito de saber quem está prendendo e interrogando ele.',to:{b1:{o:0},b2:ON},ms:300,d:2000},
  {cap:'Ficar calado não pode ser usado contra ele. Também tem direito a advogado e à assistência da família.',to:{b2:{o:0},pol:{aF:-12},s1:ON},ms:300,d:2800},

  {reset:1,set:{t2:{o:1}},cap:'Na delegacia, Davi pede para avisar a família.',to:{b3:ON},ms:300,d:1800},
  {to:{b3:{o:0},b4:ON},ms:300,d:1800},
  {cap:'A prisão e o local onde ele está são comunicados imediatamente ao juiz e à família ou a quem ele indicar.',to:{b4:{o:0},dj:ON},ms:400,d:500},
  {to:{df:ON},ms:400,d:2000},
  {to:{dj:{o:0},df:{o:0},s2:ON},ms:300,d:2400},

  {reset:1,set:{t3:{o:1}},cap:'Davi tenta fugir.',to:{davi:{f:-1}},ms:200,d:240},
  {to:{davi:{x:60,walk:1.3},pol:{x:92,walk:1.3}},ms:900,d:950},
  {cap:'Houve tentativa de fuga, então o agente pode usar algemas...',to:{davi:{walk:0,aF:-35,aB:-35,h_cuffs:1},pol:{walk:0,aF:-90}},ms:400,d:1700},
  {cap:'...mas precisa justificar o motivo por escrito.',to:{dw:ON,pol:{aF:-12}},ms:400,d:1800},
  {cap:'Algemas só com resistência, risco de fuga ou perigo à integridade física de alguém (Súmula Vinculante 11).',to:{dw:{o:0},s3:ON},ms:300,d:2800}],
 rule:`<h3>Regra</h3>
  <ul>
   <li>Prisão só em <b>flagrante</b> ou por <b>ordem escrita e fundamentada</b> do juiz, salvo transgressão ou crime propriamente militar (LXI).</li>
   <li>A prisão e o local são comunicados <b>imediatamente</b> ao <b>juiz</b> e à <b>família</b> ou à pessoa indicada (LXII).</li>
   <li>O preso é informado dos seus direitos, entre eles o de <b>permanecer calado</b>, com assistência da família e de advogado (LXIII).</li>
   <li>Tem direito à <b>identificação</b> dos responsáveis pela prisão ou pelo interrogatório (LXIV).</li>
  </ul>
  <div class="trap"><b>Pegadinha:</b> o inciso LXII fala em juiz e família, não em Ministério Público. E a prisão civil do depositário infiel é proibida (SV 25); só cabe a do devedor voluntário de pensão alimentícia.</div>`},

{id:'reuniao',nav:'Reunião',art:'CF, art. 5º, XVI',title:'Direito de reunião',
 lead:'Um grupo quer protestar na praça. O que a Constituição exige?',
 actors:[
  {id:'pref',t:'building',text:'PREFEITURA',x:312,y:180,w:90,h:100},
  {id:'g2',t:'fig',perp:1,holdF:['sign'],st:{x:-40,aF:-170,h_sign:1}},
  {id:'g1',t:'fig',label:'Grupo B',perp:1,holdF:['sign'],st:{x:-80,aF:-170,h_sign:1}},
  {id:'a1',t:'fig',holdF:['sign'],st:{x:140,o:0}},
  {id:'a2',t:'fig',label:'Grupo A',holdF:['sign'],st:{x:180,o:0}},
  {id:'a3',t:'fig',holdF:['sign'],holdB:['stick'],st:{x:220,o:0}},
  DOC('aviso','AVISO PRÉVIO',230,120),
  {id:'b1',t:'bubble',text:'Dia 10, na praça. Só avisando!',x:240,y:104},
  {id:'b2',t:'bubble',text:'Hoje a praça é nossa!',x:80,y:104},
  TAG('t1','1 de 3 · Aviso, não autorização'),TAG('t2','2 de 3 · Com armas'),TAG('t3','3 de 3 · Outra reunião'),
  STAMP('s1','AVISO, NÃO AUTORIZAÇÃO','ok'),STAMP('s2','COM ARMAS: SEM PROTEÇÃO','no'),STAMP('s3','NÃO PODE FRUSTRAR OUTRA','no')],
 steps:[
  {reset:1,set:{t1:{o:1},a2:{o:1,x:120}},cap:'A líder do Grupo A quer fazer um protesto pacífico na praça.',to:{a2:{x:240,walk:1}},ms:1500,d:1550},
  {cap:'Ela avisa a prefeitura com antecedência. Não precisa pedir permissão.',to:{a2:{walk:0,aF:-80},aviso:ON,b1:ON},ms:300,d:2000},
  {to:{aviso:{x:300,o:0},b1:{o:0},a2:{aF:-12}},ms:700,d:800},
  {to:{a2:{f:-1}},ms:200,d:240},
  {to:{a2:{x:180,walk:1}},ms:800,d:850},
  {cap:'No dia, o grupo se reúne em paz, sem armas e em local aberto ao público.',to:{a2:{walk:0,f:1,aF:-170,h_sign:1},a1:{o:1,aF:-170,h_sign:1},a3:{o:1,aF:-170,h_sign:1}},ms:500,d:2000},
  {to:{s1:ON},ms:300,d:2600},

  {reset:1,set:{t2:{o:1},a1:{o:1,aF:-170,h_sign:1},a2:{o:1,aF:-170,h_sign:1},a3:{o:1,aF:-170,h_sign:1}},cap:'Em outro protesto, um dos manifestantes aparece com um pedaço de pau.',to:{a3:{h_stick:1,aB:-160}},ms:500,d:2000},
  {cap:'A Constituição só protege reunião pacífica e sem armas.',to:{s2:ON},ms:300,d:2600},

  {reset:1,set:{t3:{o:1},a1:{o:1,aF:-170,h_sign:1},a2:{o:1,aF:-170,h_sign:1},a3:{o:1,aF:-170,h_sign:1}},cap:'O Grupo A avisou antes e já está na praça.',d:1800},
  {cap:'O Grupo B chega na mesma hora e quer ocupar o mesmo lugar.',to:{g1:{x:80,walk:1},g2:{x:40,walk:1}},ms:1500,d:1550},
  {to:{g1:{walk:0},g2:{walk:0},b2:ON},ms:300,d:1800},
  {cap:'Uma reunião não pode frustrar outra que foi convocada antes para o mesmo local.',to:{b2:{o:0},s3:ON},ms:300,d:2800}],
 rule:`<h3>Regra</h3>
  <p>Todos podem se reunir <b>pacificamente</b>, <b>sem armas</b>, em locais abertos ao público, <b>independentemente de autorização</b>, desde que não frustrem outra reunião convocada antes para o mesmo local. Exige-se apenas <b>prévio aviso</b> à autoridade competente.</p>
  <div class="trap"><b>Pegadinha:</b> aviso não é autorização; a prova troca uma palavra pela outra. No estado de defesa, o direito de reunião pode ser <b>restringido</b>; só no estado de sítio ele pode ser <b>suspenso</b>.</div>`},

{id:'hc-hd',nav:'HC e HD',art:'CF, art. 5º, LXVIII e LXXII',title:'Habeas corpus e habeas data',
 lead:'Dois remédios gratuitos, para problemas bem diferentes.',
 actors:[
  {id:'rafa',t:'fig',label:'Rafa',st:{x:270,f:-1}},
  {id:'bars',t:'bars',x:270,y:180},
  SCR('sc1',['CADASTRO DO ESTADO','Nina Alves','Situação: DEVEDORA'],200,92),
  SCR('sc2',['CADASTRO DO ESTADO','Nina Alves','Situação: EM DIA'],200,92),
  POL('serv','Servidor',{x:300,f:-1,o:0},{hat:null}),
  {id:'nina',t:'fig',label:'Nina',st:{x:60}},
  DOC('dhc','HABEAS CORPUS',100,60),DOC('dhd','HABEAS DATA',100,60),
  {id:'b1',t:'bubble',text:'Não vamos mostrar nada.',x:300,y:104},
  TAG('t1','1 de 2 · Liberdade de ir e vir'),TAG('t2','2 de 2 · Dados da própria pessoa'),
  STAMP('s1','HABEAS CORPUS','ok'),STAMP('s2','HABEAS DATA','ok')],
 steps:[
  {reset:1,set:{t1:{o:1}},cap:'Rafa está preso há dias, sem flagrante e sem ordem de um juiz.',d:2200},
  {cap:'Nina, amiga dele, não é advogada, mas pode pedir habeas corpus por ele, sem pagar nada.',to:{dhc:ON,nina:{aF:-60}},ms:400,d:2400},
  {cap:'O juiz reconhece a prisão ilegal e manda soltar.',to:{dhc:{o:0},bars:{o:0},nina:{aF:-12}},ms:500,d:600},
  {to:{rafa:{x:150,walk:1}},ms:1200,d:1300},
  {to:{rafa:{walk:0},s1:ON},ms:300,d:2600},

  {reset:1,set:{t2:{o:1},rafa:{o:0},bars:{o:0},serv:{o:1}},cap:'Nina descobre que um cadastro público a aponta como devedora. A informação é falsa.',to:{sc1:ON},ms:400,d:2400},
  {cap:'Ela pede para ver e corrigir os próprios dados, mas o órgão se recusa.',to:{b1:ON},ms:300,d:2000},
  {cap:'Com a recusa, ela impetra habeas data, também de graça.',to:{b1:{o:0},dhd:ON},ms:300,d:2000},
  {cap:'O juiz manda corrigir o cadastro.',to:{dhd:{o:0},sc1:{o:0},sc2:ON},ms:600,d:1600},
  {to:{s2:ON},ms:300,d:2600}],
 rule:`<h3>Regra</h3>
  <div class="tbl"><table>
   <tr><th>Remédio</th><th>Protege</th><th>Quem pede</th></tr>
   <tr><td><b>Habeas corpus</b></td><td>Liberdade de locomoção contra violência, coação ilegal ou abuso de poder</td><td>Qualquer pessoa, em favor próprio ou de outra, sem advogado</td></tr>
   <tr><td><b>Habeas data</b></td><td>Conhecer ou corrigir informações <b>sobre o próprio impetrante</b> em bancos de dados públicos</td><td>O próprio titular</td></tr>
  </table></div>
  <div class="trap"><b>Pegadinha:</b> HC e HD são <b>gratuitos</b>. O HD não serve para dados de terceiros e exige recusa prévia do órgão (Súmula 2 do STJ). HC não cabe contra pena só de multa.</div>`},

{id:'ms-mi-ap',nav:'MS, MI e ação popular',art:'CF, art. 5º, LXIX, LXXI e LXXIII',title:'Mandado de segurança, injunção e ação popular',
 lead:'Téo tem três problemas diferentes com o poder público.',
 actors:[
  {id:'adv',t:'fig',label:'Advogada',alt:1,st:{x:-30,o:0}},
  {id:'teo',t:'fig',label:'Téo',st:{x:80}},
  SCR('sc1',['PREFEITURA','Alvará de Téo:','NEGADO, sem motivo legal'],235,92),
  SCR('sc2',['Direito previsto na CF','Lei que regulamenta:','AINDA NÃO EXISTE'],235,92),
  SCR('sc3',['Contrato da prefeitura','10 cadeiras','R$ 5.000.000,00'],235,92),
  DOC('d1','MANDADO DE SEGURANÇA',235,150),DOC('d2','MANDADO DE INJUNÇÃO',235,150),DOC('d3','AÇÃO POPULAR',235,150),
  TAG('t1','1 de 3 · Direito líquido e certo'),TAG('t2','2 de 3 · Falta a lei'),TAG('t3','3 de 3 · Dinheiro público'),
  STAMP('s1','MANDADO DE SEGURANÇA','info'),STAMP('s2','MANDADO DE INJUNÇÃO','info'),STAMP('s3','AÇÃO POPULAR','info')],
 steps:[
  {reset:1,set:{t1:{o:1}},cap:'Téo cumpriu todos os requisitos, mas a prefeitura negou o alvará sem base legal.',to:{sc1:ON},ms:400,d:2400},
  {cap:'Ele tem prova documental pronta do direito. Com uma advogada, impetra mandado de segurança.',to:{adv:{o:1,x:30,walk:1}},ms:1000,d:1050},
  {to:{adv:{walk:0},d1:ON},ms:400,d:1800},
  {cap:'Protege direito líquido e certo não amparado por HC ou HD. O prazo é de 120 dias.',to:{s1:ON},ms:300,d:2800},

  {reset:1,set:{t2:{o:1}},cap:'A Constituição garante um direito a Téo, mas a lei que deveria regulamentá-lo nunca foi feita.',to:{sc2:ON},ms:400,d:2600},
  {cap:'Sem essa norma, ele não consegue exercer o direito. Cabe mandado de injunção.',to:{d2:ON},ms:400,d:2200},
  {cap:'Hoje o STF não só declara a omissão: viabiliza o exercício do direito até a lei sair.',to:{s2:ON},ms:300,d:2800},

  {reset:1,set:{t3:{o:1}},cap:'Téo descobre que a prefeitura pagou R$ 5 milhões por dez cadeiras.',to:{sc3:ON},ms:400,d:2400},
  {cap:'Como cidadão em dia com a Justiça Eleitoral, ele propõe ação popular para anular o contrato.',to:{d3:ON,teo:{aF:-150}},ms:400,d:2400},
  {cap:'Qualquer cidadão pode propor. Não há custas, salvo má-fé.',to:{teo:{aF:-12},s3:ON},ms:300,d:2800}],
 rule:`<h3>Regra</h3>
  <div class="tbl"><table>
   <tr><th>Remédio</th><th>Quando cabe</th><th>Quem propõe</th></tr>
   <tr><td><b>Mandado de segurança</b></td><td>Direito líquido e certo, não amparado por HC ou HD, contra ato de autoridade</td><td>O titular, com advogado (prazo de 120 dias)</td></tr>
   <tr><td><b>Mandado de injunção</b></td><td>Falta de norma regulamentadora torna inviável um direito constitucional</td><td>Quem tem o direito inviabilizado</td></tr>
   <tr><td><b>Ação popular</b></td><td>Anular ato lesivo ao patrimônio público, à moralidade administrativa, ao meio ambiente ou ao patrimônio histórico e cultural</td><td>Qualquer cidadão</td></tr>
  </table></div>
  <div class="trap"><b>Pegadinha:</b> pessoa jurídica não propõe ação popular (Súmula 365 do STF). O MS coletivo pode ser impetrado por partido com representação no Congresso; o requisito de 1 ano de funcionamento vale só para associações.</div>`},

{id:'seguranca-publica',nav:'Polícias (art. 144)',art:'CF, art. 144',title:'Quem faz o quê na segurança pública',
 lead:'Quatro cenas rápidas, uma para cada polícia.',
 actors:[
  {id:'deleg',t:'building',text:'DELEGACIA',x:290,y:180,w:110,h:96,st:{o:0}},
  {id:'placa',t:'roadsign',text:'BR-232',x:318,y:180,st:{o:0}},
  {id:'car',t:'car',x:-110,y:180,st:{o:0,s:.75}},
  {id:'preso',t:'fig',label:'Preso',st:{x:280,f:-1,o:0}},
  {id:'bars',t:'bars',x:280,y:180,st:{o:0}},
  {id:'cid',t:'fig',label:'Moradora',st:{x:270,f:-1,o:0}},
  POL('pm','PM',{x:-30}),
  POL('pc','Delegada',{x:200,f:-1,o:0},{holdF:['folder']}),
  POL('prf','PRF',{x:250,f:-1,o:0}),
  POL('pp','Polícia penal',{x:150,o:0}),
  {id:'b1',t:'bubble',text:'Bom dia, policial!',x:270,y:104},
  {id:'b2',t:'bubble',text:'Vamos ouvir as testemunhas.',x:200,y:104},
  TAG('t1','1 de 4 · Polícia Militar'),TAG('t2','2 de 4 · Polícia Civil'),TAG('t3','3 de 4 · PRF'),TAG('t4','4 de 4 · Polícia Penal'),
  STAMP('s1','OSTENSIVA E ORDEM PÚBLICA','info'),STAMP('s2','POLÍCIA JUDICIÁRIA','info'),STAMP('s3','RODOVIAS FEDERAIS','info'),STAMP('s4','ESTABELECIMENTOS PENAIS','info')],
 steps:[
  {reset:1,set:{t1:{o:1},cid:{o:1}},cap:'A Polícia Militar patrulha a rua, fardada e à vista de todos.',to:{pm:{x:190,walk:1}},ms:1700,d:1750},
  {to:{pm:{walk:0},cid:{aF:-160},b1:ON},ms:300,d:1500},
  {cap:'Faz a polícia ostensiva e preserva a ordem pública.',to:{b1:{o:0},cid:{aF:-12},s1:ON},ms:300,d:2600},

  {reset:1,set:{t2:{o:1},pm:{o:0},deleg:{o:1},pc:{o:1,h_folder:1}},cap:'Na delegacia, uma delegada de carreira conduz a investigação de um furto.',to:{pc:{aF:-60}},ms:300,d:2000},
  {to:{b2:ON},ms:300,d:1800},
  {cap:'A Polícia Civil apura infrações penais, exceto as militares, e exerce a polícia judiciária, ressalvada a competência da União.',to:{b2:{o:0},s2:ON},ms:300,d:2800},

  {reset:1,set:{t3:{o:1},pm:{o:0},placa:{o:1},car:{o:1},prf:{o:1}},cap:'Na BR-232, uma rodovia federal, um carro passa acima da velocidade.',to:{car:{x:120}},ms:1600,ez:'io',d:1650},
  {to:{prf:{aF:-90}},ms:300,d:1400},
  {cap:'A PRF faz o patrulhamento ostensivo das rodovias federais.',to:{s3:ON},ms:300,d:2600},

  {reset:1,set:{t4:{o:1},pm:{o:0},preso:{o:1},bars:{o:1},pp:{o:1}},cap:'No presídio, quem cuida da segurança é a polícia penal.',to:{pp:{x:210,walk:1}},ms:1300,d:1350},
  {to:{pp:{f:-1}},ms:200,d:240},
  {to:{pp:{x:130,walk:1}},ms:1100,d:1150},
  {cap:'Ela foi incluída no art. 144 pela EC 104/2019 e garante a segurança dos estabelecimentos penais.',to:{pp:{walk:0},s4:ON},ms:300,d:2800}],
 rule:`<h3>Regra</h3>
  <div class="tbl"><table>
   <tr><th>Órgão</th><th>Atribuição principal</th></tr>
   <tr><td><b>Polícia Federal</b></td><td>Infrações contra bens e interesses da União, tráfico, contrabando, fronteiras; polícia judiciária da União com exclusividade</td></tr>
   <tr><td><b>PRF</b></td><td>Patrulhamento ostensivo das rodovias federais</td></tr>
   <tr><td><b>Polícias civis</b></td><td>Dirigidas por delegados de carreira: polícia judiciária e apuração de infrações penais, exceto as militares</td></tr>
   <tr><td><b>Polícias militares</b></td><td>Polícia ostensiva e preservação da ordem pública</td></tr>
   <tr><td><b>Bombeiros militares</b></td><td>Atribuições legais e defesa civil</td></tr>
   <tr><td><b>Polícias penais</b></td><td>Segurança dos estabelecimentos penais</td></tr>
  </table></div>
  <div class="trap"><b>Pegadinha:</b> o rol do art. 144 é taxativo; o estado não pode criar outro órgão de segurança. A guarda municipal não está no caput, mas o STF a reconhece no sistema de segurança, sem polícia judiciária. PMs, bombeiros e polícias civis se subordinam aos governadores.</div>`}
];
