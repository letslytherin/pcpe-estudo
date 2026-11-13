const STAMP=(id,text,kind,y)=>({id,t:'stamp',text,kind,x:180,y:y||46});
const TAG=(id,text)=>({id,t:'tag',text,x:12,y:22});
const POL=(id,label,st,extra)=>Object.assign({id,t:'fig',label,alt:1,hat:'pol',st},extra||{});
const DOC=(id,text,x,y)=>({id,t:'doc',text,x,y,st:{o:0}});
const ON={o:1,s:1}, OFF={o:0};
const SCENES=[
{id:'posse-exercicio',nav:'Posse e exercício',art:'Lei 6.123/1968, arts. 28, 33 e 39',title:'Posse e exercício: os prazos',
 lead:'Luana foi aprovada no concurso. Agora começam a correr os prazos.',
 actors:[
  {id:'pc',t:'building',text:'POLÍCIA CIVIL',x:298,y:180,w:110,h:96},
  {id:'lu',t:'fig',label:'Luana',st:{x:50}},
  DOC('dnom','NOMEAÇÃO PUBLICADA',150,74),DOC('dp30','POSSE: 30 DIAS',150,106),
  DOC('ddia31','DIA 31: PRAZO PERDIDO',150,106),DOC('dterm','TERMO DE POSSE ASSINADO',150,74),
  DOC('de30','EXERCÍCIO: 30 DIAS (+30)',150,106),DOC('ddia61','DIA 61: NÃO APARECEU',150,106),
  TAG('t1','1 de 3 · Tudo no prazo'),TAG('t2','2 de 3 · Perdeu a posse'),TAG('t3','3 de 3 · Perdeu o exercício'),
  STAMP('s1','POSSE NO PRAZO','ok'),STAMP('s2','NOMEAÇÃO SEM EFEITO','no'),STAMP('s3','PERDE O CARGO','no')],
 steps:[
  {reset:1,set:{t1:{o:1}},cap:'Luana é nomeada. Da publicação, ela tem 30 dias para tomar posse.',to:{dnom:ON,dp30:ON},ms:400,d:2400},
  {cap:'Ela vai até a Polícia Civil e assina o termo de posse, declarando seus bens.',to:{dnom:OFF,dp30:OFF,lu:{x:235,walk:1}},ms:1500,d:1550},
  {to:{lu:{walk:0},dterm:ON},ms:400,d:1800},
  {cap:'Com justa causa, ela poderia pedir prorrogação da posse até 180 dias.',to:{dterm:OFF,s1:ON},ms:300,d:2800},

  {reset:1,set:{t2:{o:1}},cap:'Outra vez, Luana é nomeada e tem 30 dias para a posse.',to:{dnom:ON,dp30:ON},ms:400,d:2200},
  {cap:'Ela deixa o prazo passar e não pede prorrogação.',to:{dp30:OFF,ddia31:ON},ms:400,d:2200},
  {cap:'Quem não toma posse no prazo não perde cargo nenhum: a nomeação fica sem efeito.',to:{dnom:OFF,ddia31:OFF,s2:ON},ms:300,d:2800},

  {reset:1,set:{t3:{o:1},lu:{x:235}},cap:'Agora Luana tomou posse. Da posse, ela tem 30 dias para entrar em exercício, prorrogáveis por mais 30.',to:{dterm:ON,de30:ON},ms:400,d:2600},
  {cap:'Os 60 dias passam e ela não começa a trabalhar.',to:{de30:OFF,ddia61:ON,lu:{f:-1}},ms:400,d:600},
  {to:{lu:{x:-50,walk:1}},ms:1600,d:1700},
  {cap:'Quem já tomou posse e não entra em exercício perde o cargo, salvo força maior.',to:{dterm:OFF,ddia61:OFF,s3:ON},ms:300,d:2800}],
 rule:`<h3>Regra</h3>
  <div class="tbl"><table>
   <tr><th>Ato</th><th>Prazo</th><th>Prorrogação</th><th>Se perder</th></tr>
   <tr><td><b>Posse</b></td><td>30 dias da publicação</td><td>Até 180 dias, por justa causa, a pedido</td><td>Nomeação sem efeito</td></tr>
   <tr><td><b>Exercício</b></td><td>30 dias da posse</td><td>Mais 30 dias, a pedido</td><td>Perde o cargo, salvo força maior</td></tr>
  </table></div>
  <div class="trap"><b>Pegadinha:</b> a banca troca as consequências: posse perdida torna a nomeação sem efeito; exercício perdido faz perder o cargo. Na reintegração, os 30 dias do exercício contam da publicação do ato. Se o nomeado estiver fora do Estado, a posse pode ser por procuração.</div>`},

{id:'formas-de-volta',nav:'Voltar ao cargo',art:'Lei 6.123/1968, art. 10',title:'Reintegração, reversão e aproveitamento',
 lead:'Três servidores voltam ao serviço público, cada um por um caminho.',
 actors:[
  {id:'rep',t:'building',text:'REPARTIÇÃO',x:300,y:180,w:100,h:92},
  {id:'ocup',t:'fig',label:'Ocupante',st:{x:255,f:-1,o:0}},
  {id:'joao',t:'fig',label:'João',st:{x:-30,o:0}},
  {id:'ze',t:'fig',label:'Seu Zé',holdB:['stick'],st:{x:-30,o:0,h_stick:1,aB:30}},
  {id:'lia',t:'fig',label:'Lia',st:{x:-30,o:0}},
  DOC('d1','DEMISSÃO ILEGAL: ANULADA',160,74),DOC('d2','APOSENTADO VOLTA À ATIVA',160,74),
  DOC('d3a','CARGO EXTINTO: DISPONIBILIDADE',160,74),DOC('d3b','NOVO CARGO EQUIVALENTE',160,108),
  TAG('t1','1 de 3 · Demitido ilegalmente'),TAG('t2','2 de 3 · Aposentado'),TAG('t3','3 de 3 · Em disponibilidade'),
  STAMP('s1','REINTEGRAÇÃO','info'),STAMP('s2','REVERSÃO','info'),STAMP('s3','APROVEITAMENTO','info')],
 steps:[
  {reset:1,set:{t1:{o:1},joao:{o:1},ocup:{o:1}},cap:'João foi demitido, mas a demissão foi reconhecida como ilegal.',to:{d1:ON},ms:400,d:2400},
  {cap:'Ele volta ao cargo, com ressarcimento das vantagens que perdeu.',to:{d1:OFF,joao:{x:200,walk:1}},ms:1500,d:1550},
  {to:{joao:{walk:0},ocup:{f:1}},ms:300,d:400},
  {cap:'Quem estava na vaga sai, sem direito a indenização.',to:{ocup:{x:420,walk:1}},ms:1300,d:1400},
  {to:{s1:ON},ms:300,d:2600},

  {reset:1,set:{t2:{o:1},ze:{o:1}},cap:'Seu Zé estava aposentado e volta à atividade.',to:{d2:ON},ms:400,d:2200},
  {to:{d2:OFF,ze:{x:220,walk:.6}},ms:2200,d:2250},
  {cap:'A reversão tem prioridade sobre novas nomeações, e o revertido não pode ir para cargo em comissão.',to:{ze:{walk:0},s2:ON},ms:300,d:2800},

  {reset:1,set:{t3:{o:1},lia:{o:1,x:60}},cap:'O cargo de Lia foi extinto, e ela ficou em disponibilidade.',to:{d3a:ON},ms:400,d:2400},
  {cap:'Surge um cargo igual ou equivalente, e ela é chamada de volta.',to:{d3b:ON},ms:400,d:1800},
  {to:{d3a:OFF,d3b:OFF,lia:{x:220,walk:1}},ms:1400,d:1450},
  {cap:'Se ela não tomasse posse no prazo, o aproveitamento ficaria sem efeito e a disponibilidade seria cassada, após inquérito.',to:{lia:{walk:0},s3:ON},ms:300,d:3000}],
 rule:`<h3>Regra</h3>
  <div class="tbl"><table>
   <tr><th>Forma</th><th>Quem volta</th><th>Detalhe</th></tr>
   <tr><td><b>Reintegração</b></td><td>Demitido ilegalmente</td><td>Com ressarcimento; o ocupante sai sem indenização; passa por inspeção médica</td></tr>
   <tr><td><b>Reversão</b></td><td>Aposentado</td><td>Prioridade sobre novas nomeações; não pode ir para cargo em comissão</td></tr>
   <tr><td><b>Aproveitamento</b></td><td>Servidor em disponibilidade</td><td>Em cargo igual ou equivalente</td></tr>
  </table></div>
  <div class="trap"><b>Pegadinha:</b> as formas de provimento da Lei 6.123 são nomeação, promoção, reintegração, aproveitamento, reversão e transferência. Só a nomeação é originária. O Estatuto do Policial Civil acrescenta o <b>acesso</b>.</div>`},

{id:'detencao-disciplinar',nav:'Detenção disciplinar',art:'Lei 6.425/1972, arts. 38 a 46',title:'Detenção disciplinar',
 lead:'Uma pena que só existe no Estatuto do Policial Civil.',
 actors:[
  {id:'house',t:'house',x:262,y:180},
  {id:'door',t:'door',x:262,y:180},
  {id:'sec',t:'fig',label:'Secretário',holdF:['paper'],st:{x:50,h_paper:1}},
  POL('rui','Agente Rui',{x:150}),
  DOC('d1','SUSPENSÃO: 10 DIAS',170,74),DOC('d2','CONVERTIDA EM DETENÇÃO',170,106),
  DOC('d3','ATÉ 48 H: EM CASA',170,74),DOC('d4','VENCIMENTO: INTEGRAL',170,106),
  DOC('d5','EMERGÊNCIA NO SERVIÇO',170,74),DOC('d6','SUSPENSA: CONTA COMO CUMPRIDA',170,74),DOC('d7','INTERROMPIDA: CUMPRE O RESTO',170,106),
  TAG('t1','1 de 2 · Como funciona'),TAG('t2','2 de 2 · Suspender × interromper'),
  STAMP('s1','NÃO CORTA O SALÁRIO','ok'),STAMP('s2','SUSPENDER × INTERROMPER','info')],
 steps:[
  {reset:1,set:{t1:{o:1}},cap:'O agente Rui recebe uma suspensão de 10 dias.',to:{d1:ON},ms:400,d:2000},
  {cap:'Por ordem escrita, o Secretário converte a suspensão em detenção disciplinar.',to:{d2:ON,sec:{aF:-90}},ms:400,d:2400},
  {cap:'Até 48 horas, a detenção é cumprida em casa. Acima disso, em sala especial da Secretaria.',to:{d1:OFF,d2:OFF,d3:ON,sec:{aF:-12}},ms:400,d:600},
  {to:{rui:{x:226,walk:1},door:{o:0}},ms:1000,d:1050},
  {to:{rui:{o:0,walk:0}},ms:300,d:1600},
  {cap:'O vencimento continua integral, mas o tempo de detenção não conta para nenhum efeito funcional.',to:{d3:OFF,d4:ON},ms:400,d:2600},
  {to:{d4:OFF,s1:ON},ms:300,d:2400},

  {reset:1,set:{t2:{o:1},rui:{x:226,o:0},door:{o:0}},cap:'Rui está cumprindo a detenção quando surge uma emergência no serviço.',to:{d5:ON},ms:400,d:2200},
  {to:{rui:{o:1,x:180},d5:OFF},ms:600,d:700},
  {cap:'Se o Secretário suspende a detenção, ela é anotada como cumprida por inteiro.',to:{d6:ON},ms:400,d:2600},
  {cap:'Se ele interrompe, Rui volta depois para cumprir o que faltar.',to:{d7:ON},ms:400,d:2600},
  {cap:'Recusar-se a cumprir a detenção é insubordinação grave, punida com demissão.',to:{d6:OFF,d7:OFF,s2:ON},ms:300,d:2800}],
 rule:`<h3>Regra</h3>
  <ul>
   <li>É a conversão da suspensão, por ordem escrita do <b>Secretário</b> ou do <b>Governador</b>.</li>
   <li>Prazo máximo igual ao da suspensão: <b>30 dias</b>.</li>
   <li><b>Não tira o vencimento</b>, mas o tempo não conta para nenhum efeito funcional.</li>
   <li>Até <b>48 horas</b>: em casa. Acima disso: sala especial na Secretaria ou repartição designada.</li>
  </ul>
  <div class="trap"><b>Pegadinha:</b> a questão costuma dizer que a detenção corta o salário, como a suspensão. Não corta. Na <b>suspensão</b> da detenção, a pena conta como cumprida; na <b>interrupção</b>, o restante é cumprido depois.</div>`},

{id:'quem-aplica',nav:'Quem pune',art:'Lei 6.425/1972, art. 52',title:'Quem aplica cada pena',
 lead:'No Estatuto do Policial Civil, cada autoridade tem um teto.',
 actors:[
  {id:'gov',t:'fig',label:'Governador',st:{x:36}},
  {id:'sec',t:'fig',label:'Secretário',st:{x:106}},
  {id:'chg',t:'fig',label:'Chefe Gab.',st:{x:176}},
  {id:'dir',t:'fig',label:'Diretores',st:{x:246}},
  POL('del','Delegados',{x:316}),
  {id:'b1',t:'bubble',text:'Qualquer pena. Só eu demito e casso.',x:60,y:104},
  {id:'b2',t:'bubble',text:'Todas, menos demitir e cassar.',x:106,y:104},
  {id:'b3',t:'bubble',text:'Suspensão até 20 dias.',x:176,y:104},
  {id:'b4',t:'bubble',text:'Suspensão até 15 dias.',x:246,y:104},
  {id:'b5',t:'bubble',text:'Suspensão até 10 dias.',x:300,y:104},
  TAG('t1','Do topo para a ponta'),
  STAMP('s1','20 · 15 · 10','info')],
 steps:[
  {reset:1,set:{t1:{o:1}},cap:'O Governador pode aplicar qualquer pena. Só ele demite e cassa aposentadoria ou disponibilidade.',to:{gov:{aF:-150},b1:ON},ms:300,d:2600},
  {cap:'O Secretário de Segurança aplica todas as outras.',to:{gov:{aF:-12},b1:OFF,sec:{aF:-150},b2:ON},ms:300,d:2400},
  {cap:'O Chefe de Gabinete aplica repreensão e suspensão até 20 dias.',to:{sec:{aF:-12},b2:OFF,chg:{aF:-150},b3:ON},ms:300,d:2300},
  {cap:'Diretores de departamento, diretores executivos e o corregedor: até 15 dias.',to:{chg:{aF:-12},b3:OFF,dir:{aF:-150},b4:ON},ms:300,d:2400},
  {cap:'Titulares de delegacia, delegados, médicos-legistas e peritos criminais: até 10 dias.',to:{dir:{aF:-12},b4:OFF,del:{aF:-150},b5:ON},ms:300,d:2400},
  {cap:'Para lembrar: 20, 15 e 10, descendo na hierarquia. Na lei geral, o diretor de repartição vai só até 8 dias.',to:{del:{aF:-12},b5:OFF,s1:ON},ms:300,d:3000}],
 rule:`<h3>Regra</h3>
  <div class="tbl"><table>
   <tr><th>Autoridade</th><th>Limite</th></tr>
   <tr><td><b>Governador</b></td><td>Qualquer pena; só ele demite e cassa</td></tr>
   <tr><td><b>Secretário de Segurança Pública</b></td><td>Todas, menos demissão e cassação</td></tr>
   <tr><td><b>Chefe de Gabinete</b></td><td>Repreensão e suspensão até 20 dias</td></tr>
   <tr><td><b>Diretores e corregedor</b></td><td>Repreensão e suspensão até 15 dias</td></tr>
   <tr><td><b>Titulares de delegacia, delegados, legistas e peritos</b></td><td>Repreensão e suspensão até 10 dias</td></tr>
  </table></div>
  <div class="trap"><b>Pegadinha:</b> a suspensão preventiva (até 30 dias, prorrogável até 90) pode ser imposta pelas quatro primeiras autoridades, mas não por delegados e titulares de delegacia. O processo disciplinar é obrigatório antes de suspensão acima de 15 dias.</div>`},

{id:'progressao',nav:'Progressão',art:'LC 137/2008, arts. 9º a 18',title:'Progressão horizontal × vertical',
 lead:'Cada cargo tem classes de I a IV, e cada classe tem 7 faixas salariais.',
 ground:[],
 actors:[
  {id:'grid',t:'grid'},
  {id:'tok',t:'token',x:96,y:150},
  DOC('d1','DEPOIS DO ESTÁGIO PROBATÓRIO',196,190),DOC('d2','CHEGOU À ÚLTIMA FAIXA',196,190),
  TAG('t1','1 de 2 · Muda a faixa'),TAG('t2','2 de 2 · Muda a classe'),
  STAMP('s1','PROGRESSÃO HORIZONTAL','info'),STAMP('s2','PROGRESSÃO VERTICAL','info')],
 steps:[
  {reset:1,set:{t1:{o:1}},cap:'O agente começa na classe I, faixa 1.',to:{tok:{s:1.25}},ms:400,d:1600},
  {cap:'Depois do estágio probatório, com bom desempenho, sobe para a faixa seguinte, na mesma classe.',to:{d1:ON,tok:{s:1}},ms:400,d:1200},
  {to:{tok:{x:132}},ms:700,d:900},
  {to:{tok:{x:168}},ms:700,d:1100},
  {cap:'Muda a faixa, não a classe. O critério é o desempenho.',to:{d1:OFF,s1:ON},ms:300,d:2600},

  {reset:1,set:{t2:{o:1},tok:{x:312}},cap:'Agora o agente já está na última faixa da classe I.',to:{d2:ON},ms:400,d:2200},
  {cap:'Pela progressão vertical, ele passa para a faixa inicial da classe seguinte.',to:{tok:{x:96,y:126}},ms:1100,d:1500},
  {cap:'Muda a classe. Critério: desempenho e/ou tempo de serviço, conforme a lei.',to:{d2:OFF,s2:ON},ms:300,d:2800}],
 rule:`<h3>Regra</h3>
  <div class="tbl"><table>
   <tr><th></th><th>Horizontal</th><th>Vertical</th></tr>
   <tr><td><b>O que muda</b></td><td>A faixa</td><td>A classe</td></tr>
   <tr><td><b>De onde para onde</b></td><td>Para a faixa seguinte, na mesma classe</td><td>Da última faixa para a faixa inicial da classe seguinte</td></tr>
   <tr><td><b>Critério</b></td><td>Desempenho</td><td>Desempenho e/ou tempo de serviço</td></tr>
  </table></div>
  <div class="trap"><b>Pegadinha:</b> não concorre à progressão quem está em estágio probatório ou em disponibilidade, quem não tem o curso de formação, quem está de licença para interesse particular, quem exerce atividade não policial ou quem foi punido com suspensão ou condenado criminalmente, até cumprir a pena.</div>`}
];
