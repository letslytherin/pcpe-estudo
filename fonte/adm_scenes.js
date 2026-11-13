const STAMP=(id,text,kind,y)=>({id,t:'stamp',text,kind,x:180,y:y||46});
const TAG=(id,text)=>({id,t:'tag',text,x:12,y:22});
const POL=(id,label,st,extra)=>Object.assign({id,t:'fig',label,alt:1,hat:'pol',st},extra||{});
const DOC=(id,text,x,y)=>({id,t:'doc',text,x,y,st:{o:0}});
const SCR=(id,lines,x,y)=>({id,t:'screen',lines,x,y,st:{o:0}});
const ON={o:1,s:1};
const SCENES=[
{id:'poder-de-policia',nav:'Poder de polícia',art:'CTN, art. 78 · STF, Tema 532',title:'O ciclo do poder de polícia',
 lead:'Do Código de Trânsito à multa: as quatro fases do ciclo de polícia.',
 actors:[
  {id:'detran',t:'building',text:'DETRAN',x:292,y:180,w:100,h:92,st:{o:0}},
  {id:'radar',t:'radar',x:255,y:180,st:{o:0}},
  {id:'flash',t:'flash',x:255,y:96,st:{o:0}},
  {id:'car',t:'car',x:-110,y:180,st:{o:0,s:.72}},
  {id:'ana',t:'fig',label:'Ana',st:{x:-30}},
  DOC('dlei','LEI DE TRÂNSITO',180,118),DOC('dcnh','CNH DE ANA',225,110),DOC('dmul','AUTO DE INFRAÇÃO: MULTA',180,118),
  TAG('t1','1 de 4 · Ordem'),TAG('t2','2 de 4 · Consentimento'),TAG('t3','3 de 4 · Fiscalização'),TAG('t4','4 de 4 · Sanção'),
  STAMP('s1','ORDEM: INDELEGÁVEL','no'),STAMP('s2','CONSENTIMENTO','info'),STAMP('s3','FISCALIZAÇÃO','info'),STAMP('s4','SANÇÃO','info')],
 steps:[
  {reset:1,set:{t1:{o:1}},cap:'Primeiro vem a ordem: a lei define as regras, como os limites de velocidade.',to:{dlei:ON},ms:400,d:2400},
  {cap:'Legislar é tarefa do Estado e não pode ser delegada a ninguém.',to:{dlei:{o:0},s1:ON},ms:300,d:2600},

  {reset:1,set:{t2:{o:1},detran:{o:1}},cap:'Ana faz os exames no Detran.',to:{ana:{x:215,walk:1}},ms:1600,d:1650},
  {cap:'Aprovada, recebe a CNH. Esse é o consentimento.',to:{ana:{walk:0},dcnh:ON},ms:400,d:2000},
  {cap:'A CNH é uma licença: ato vinculado. Cumpridos os requisitos, a Administração tem de conceder.',to:{s2:ON},ms:300,d:2800},

  {reset:1,set:{t3:{o:1},radar:{o:1},car:{o:1}},cap:'Um radar flagra um carro acima da velocidade. Isso é fiscalização.',to:{car:{x:180}},ms:1300,ez:'lin',d:1100},
  {to:{flash:{o:1,s:1.3}},ms:120,d:150},
  {to:{flash:{o:0,s:1}},ms:300,d:300},
  {to:{car:{x:470}},ms:1000,ez:'lin',d:1000},
  {cap:'Particulares contratados podem ajudar com atos materiais, como instalar e operar o radar.',to:{s3:ON},ms:300,d:2800},

  {reset:1,set:{t4:{o:1},radar:{o:1}},cap:'Por fim, vem a multa. Essa é a sanção.',to:{dmul:ON},ms:400,d:2200},
  {cap:'Para o STF, consentimento, fiscalização e sanção podem ser delegados a estatais de direito privado que só prestam serviço público, sem concorrência.',to:{dmul:{o:0},s4:ON},ms:300,d:3000}],
 rule:`<h3>Regra</h3>
  <div class="tbl"><table>
   <tr><th>Fase</th><th>Exemplo</th><th>Delegável?</th></tr>
   <tr><td><b>Ordem</b></td><td>Lei de trânsito</td><td>Não</td></tr>
   <tr><td><b>Consentimento</b></td><td>Emissão da CNH</td><td>Sim</td></tr>
   <tr><td><b>Fiscalização</b></td><td>Radar, vistoria</td><td>Sim</td></tr>
   <tr><td><b>Sanção</b></td><td>Multa</td><td>Sim, nos termos do STF</td></tr>
  </table></div>
  <div class="trap"><b>Pegadinha:</b> nem todo ato de polícia é discricionário (a licença é vinculada) e nem todo é autoexecutório: a cobrança da multa depende de execução judicial. Atributos: discricionariedade, autoexecutoriedade e coercibilidade.</div>`},

{id:'abuso-de-poder',nav:'Abuso de poder',art:'Poderes administrativos',title:'Excesso de poder e desvio de finalidade',
 lead:'Abuso de poder tem duas espécies. Veja a diferença.',
 actors:[
  {id:'rest',t:'building',text:'RESTAURANTE',x:296,y:180,w:110,h:92},
  DOC('dint','INTERDITADO',296,140),
  {id:'dono',t:'fig',label:'Dono',st:{x:232,f:-1}},
  POL('ag','Agente de trânsito',{x:-30}),
  {id:'chefe',t:'fig',label:'Chefe',alt:1,st:{x:100,o:0}},
  {id:'caio',t:'fig',label:'Caio',st:{x:230,f:-1,o:0}},
  SCR('port',['PORTARIA','Caio removido','para Petrolina'],240,88),
  {id:'b1',t:'bubble',text:'Vou fechar seu restaurante!',x:180,y:104},
  {id:'b2',t:'bubble',text:'Mas você é do trânsito!',x:232,y:104},
  {id:'b3',t:'bubble',text:'Ele me criticou na reunião...',x:100,y:104},
  TAG('t1','1 de 2 · Fora da competência'),TAG('t2','2 de 2 · Finalidade errada'),
  STAMP('s1','EXCESSO DE PODER','no'),STAMP('s2','DESVIO DE FINALIDADE','no')],
 steps:[
  {reset:1,set:{t1:{o:1}},cap:'Um agente de trânsito entra num restaurante e decide fiscalizar a cozinha.',to:{ag:{x:180,walk:1}},ms:1600,d:1650},
  {to:{ag:{walk:0,aF:-90},b1:ON},ms:300,d:1700},
  {cap:'Ele interdita o local, embora isso seja tarefa da vigilância sanitária.',to:{b1:{o:0},b2:ON,dint:ON},ms:400,d:2200},
  {cap:'Foi além da própria competência: excesso de poder, que é vício de competência.',to:{b2:{o:0},ag:{aF:-12},s1:ON},ms:300,d:2800},

  {reset:1,set:{t2:{o:1},rest:{o:0},dono:{o:0},ag:{o:0},chefe:{o:1},caio:{o:1}},cap:'A chefe pode remover servidores quando o serviço precisa.',d:2000},
  {cap:'Mas ela remove Caio para longe só porque ele a criticou numa reunião.',to:{b3:ON},ms:300,d:2000},
  {to:{b3:{o:0},port:ON},ms:400,d:1600},
  {to:{caio:{f:1}},ms:200,d:240},
  {to:{caio:{x:400,walk:1}},ms:1400,d:1500},
  {cap:'Ela tinha competência, mas usou o ato para punir. É desvio de finalidade.',to:{s2:ON},ms:300,d:2800}],
 rule:`<h3>Regra</h3>
  <ul>
   <li><b>Abuso de poder</b> é o gênero. Tem duas espécies:</li>
   <li><b>Excesso de poder:</b> o agente vai além da competência que tem. É vício de <b>competência</b>.</li>
   <li><b>Desvio de poder ou de finalidade:</b> o agente age dentro da competência, mas busca um fim diferente do previsto em lei. É vício de <b>finalidade</b>.</li>
  </ul>
  <div class="trap"><b>Pegadinha:</b> a omissão também pode ser abusiva quando havia dever de agir. E a remoção como punição é exemplo clássico de desvio de finalidade, mesmo assinada pela autoridade competente.</div>`},

{id:'anulacao-revogacao',nav:'Anular × revogar',art:'Extinção do ato administrativo',title:'Anulação × revogação',
 lead:'Dois jeitos de extinguir um ato, com efeitos no tempo bem diferentes.',
 ground:[],
 actors:[
  {id:'tl',t:'timeline'},
  {id:'eff1',t:'bar',x1:70,x2:332,kind:'no',st:{o:0}},
  {id:'eff2',t:'bar',x1:240,x2:332,kind:'info',st:{o:0}},
  DOC('dlic','LICENÇA DE BIA (2024)',95,108),DOC('daut','AUTORIZAÇÃO DA FEIRA (2024)',110,108),
  DOC('dmot1','ILEGAL: FALTOU REQUISITO',230,82),DOC('dmot2','VÁLIDA, MAS NÃO CONVÉM MAIS',225,82),
  TAG('t1','1 de 2 · Ato ilegal'),TAG('t2','2 de 2 · Ato válido'),
  STAMP('s1','ANULAÇÃO: RETROAGE','no'),STAMP('s2','REVOGAÇÃO: DAQUI PRA FRENTE','info')],
 steps:[
  {reset:1,set:{t1:{o:1}},cap:'Em 2024, a prefeitura deu uma licença a Bia sem cumprir um requisito da lei.',to:{dlic:ON},ms:400,d:2400},
  {cap:'Hoje, a Administração descobre a ilegalidade e anula o ato.',to:{dmot1:ON},ms:400,d:2200},
  {cap:'A anulação apaga o ato desde o início (ex tunc), ressalvados terceiros de boa-fé.',to:{eff1:{o:1}},ms:700,d:2200},
  {to:{s1:ON},ms:300,d:2600},

  {reset:1,set:{t2:{o:1}},cap:'Em 2024, a prefeitura autorizou, de forma válida, uma feira na praça.',to:{daut:ON},ms:400,d:2400},
  {cap:'Agora a praça vai receber um posto de vacinação. A feira não convém mais.',to:{dmot2:ON},ms:400,d:2200},
  {cap:'A revogação vale só daqui para frente (ex nunc) e respeita os direitos adquiridos.',to:{eff2:{o:1}},ms:700,d:2200},
  {to:{s2:ON},ms:300,d:2600}],
 rule:`<h3>Regra</h3>
  <div class="tbl"><table>
   <tr><th></th><th>Anulação</th><th>Revogação</th></tr>
   <tr><td><b>Motivo</b></td><td>Ilegalidade</td><td>Conveniência e oportunidade (ato válido)</td></tr>
   <tr><td><b>Quem faz</b></td><td>Administração (de ofício) ou Judiciário (provocado)</td><td>Só a Administração que praticou o ato</td></tr>
   <tr><td><b>Efeitos</b></td><td>Ex tunc (retroage)</td><td>Ex nunc (não retroage)</td></tr>
  </table></div>
  <div class="trap"><b>Pegadinha:</b> o Judiciário não revoga atos de outro Poder, só anula. Não se revogam atos vinculados, consumados, enunciativos ou que geraram direito adquirido. A Administração tem 5 anos para anular ato favorável ao destinatário, salvo má-fé.</div>`},

{id:'responsabilidade-civil',nav:'Responsabilidade do Estado',art:'CF, art. 37, § 6º',title:'Responsabilidade civil do Estado',
 lead:'Uma viatura em serviço e uma pedestre. Quem paga o prejuízo?',
 actors:[
  {id:'sinal',t:'light',x:300,y:180},
  {id:'verm',t:'lamp',x:300,y:180,st:{o:0}},
  {id:'rita',t:'fig',label:'Rita',st:{x:205,f:-1}},
  {id:'car',t:'car',text:'POLÍCIA',x:-110,y:180,st:{s:.72}},
  DOC('d1','AÇÃO CONTRA O ESTADO',180,96),DOC('d2','REGRESSO CONTRA O AGENTE',180,128),
  TAG('t1','1 de 2 · Dano causado em serviço'),TAG('t2','2 de 2 · Culpa só da vítima'),
  STAMP('s1','RESPONSABILIDADE OBJETIVA','ok'),STAMP('s2','CULPA EXCLUSIVA DA VÍTIMA','no')],
 steps:[
  {reset:1,set:{t1:{o:1}},cap:'Rita atravessa na faixa. Uma viatura em serviço vem rápido demais...',to:{car:{x:130}},ms:1300,ez:'lin',d:1300},
  {to:{rita:{r:80,x:225},car:{x:145}},ms:300,d:1000},
  {cap:'Rita processa o Estado. Basta provar o dano e o nexo com a conduta do agente, sem discutir culpa.',to:{d1:ON},ms:400,d:2600},
  {cap:'Se o motorista agiu com dolo ou culpa, o Estado cobra dele depois, em ação de regresso.',to:{d2:ON},ms:400,d:2600},
  {to:{d1:{o:0},d2:{o:0},s1:ON},ms:300,d:2600},

  {reset:1,set:{t2:{o:1},verm:{o:1},rita:{x:300,f:-1}},cap:'Agora o sinal está vermelho para pedestres. A viatura passa na velocidade certa.',to:{car:{x:60}},ms:1200,ez:'lin',d:900},
  {cap:'De repente, Rita corre para a pista sem olhar.',to:{rita:{x:205,walk:1.3},car:{x:130}},ms:700,ez:'lin',d:700},
  {to:{rita:{walk:0,r:80,x:222},car:{x:140}},ms:300,d:1200},
  {cap:'A culpa foi só dela, e isso exclui a responsabilidade do Estado. Se a culpa fosse dividida, a indenização só diminuiria.',to:{s2:ON},ms:300,d:3000}],
 rule:`<h3>Regra</h3>
  <ul>
   <li>Pessoas de direito público e de direito privado <b>prestadoras de serviço público</b> respondem <b>objetivamente</b> pelos danos que seus agentes, nessa qualidade, causarem a terceiros.</li>
   <li>Requisitos: conduta, dano e nexo causal. Não se exige dolo ou culpa.</li>
   <li>Excludentes: culpa <b>exclusiva</b> da vítima, caso fortuito ou força maior e fato exclusivo de terceiro. A culpa <b>concorrente</b> só atenua.</li>
  </ul>
  <div class="trap"><b>Pegadinha:</b> pela tese da dupla garantia (STF, Tema 940), a vítima processa o Estado, não o agente. O agente só responde em regresso, se agiu com dolo ou culpa. Na omissão genérica, a responsabilidade é subjetiva; na morte de detento, é objetiva.</div>`},

{id:'contratacao-direta',nav:'Dispensa × inexigibilidade',art:'Lei 14.133/2021, arts. 74 e 75',title:'Dispensa × inexigibilidade',
 lead:'Duas compras sem licitação, por motivos diferentes.',
 actors:[
  {id:'rain',t:'rain',st:{o:0}},
  {id:'f1',t:'fig',label:'Família',st:{x:250,f:-1,o:0}},
  {id:'f2',t:'fig',st:{x:285,f:-1,o:0,s:.6}},
  {id:'flood',t:'flood',st:{o:0}},
  {id:'gest',t:'fig',label:'Gestora',alt:1,st:{x:60}},
  SCR('sc1',['FESTA DE SÃO JOÃO','Atração principal:','cantora consagrada'],235,92),
  DOC('d1','INEXIGIBILIDADE (ART. 74)',220,150),DOC('d2','DISPENSA (ART. 75)',150,60),
  {id:'b1',t:'bubble',text:'Só ela canta assim. Não há como competir.',x:90,y:104},
  {id:'b2',t:'bubble',text:'Precisamos de barracas hoje!',x:70,y:104},
  TAG('t1','1 de 2 · Competição impossível'),TAG('t2','2 de 2 · Emergência'),
  STAMP('s1','INEXIGIBILIDADE','info'),STAMP('s2','DISPENSA','info')],
 steps:[
  {reset:1,set:{t1:{o:1}},cap:'A prefeitura quer uma cantora consagrada pelo público como atração da festa.',to:{sc1:ON},ms:400,d:2400},
  {cap:'Não existe outra igual para disputar o contrato.',to:{b1:ON,gest:{aF:-90}},ms:300,d:2000},
  {cap:'Quando a competição é inviável, a licitação é inexigível.',to:{b1:{o:0},gest:{aF:-12},d1:ON},ms:400,d:2000},
  {cap:'O rol do art. 74 é exemplificativo: fornecedor exclusivo, artista consagrado, notória especialização, entre outros.',to:{s1:ON},ms:300,d:2800},

  {reset:1,set:{t2:{o:1},rain:{o:1},f1:{o:1,y:192},f2:{o:1,y:192},flood:{o:1}},cap:'Uma enchente deixa famílias desalojadas.',d:2200},
  {cap:'A prefeitura precisa comprar barracas com urgência.',to:{b2:ON},ms:300,d:1900},
  {cap:'Muitas empresas poderiam competir, mas a lei permite não licitar na emergência.',to:{b2:{o:0},d2:ON},ms:400,d:2400},
  {cap:'Só o necessário, para concluir em até 1 ano, sem prorrogação nem recontratação da mesma empresa.',to:{d2:{o:0},s2:ON},ms:300,d:2800}],
 rule:`<h3>Regra</h3>
  <div class="tbl"><table>
   <tr><th></th><th>Dispensável (art. 75)</th><th>Inexigível (art. 74)</th></tr>
   <tr><td><b>Competição</b></td><td>Possível, mas a lei autoriza não licitar</td><td>Inviável</td></tr>
   <tr><td><b>Rol</b></td><td>Taxativo</td><td>Exemplificativo</td></tr>
   <tr><td><b>Exemplos</b></td><td>Baixo valor, emergência, licitação deserta ou fracassada há menos de 1 ano</td><td>Fornecedor exclusivo, artista consagrado, serviço técnico de notória especialização</td></tr>
  </table></div>
  <div class="trap"><b>Pegadinha:</b> a licitação <b>dispensada</b> (art. 76, alienações) é outra figura: a própria lei já afasta a licitação. A inexigibilidade por notória especialização não vale para publicidade e divulgação.</div>`}
];
