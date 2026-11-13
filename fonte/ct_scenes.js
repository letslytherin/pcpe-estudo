const STAMP=(id,text,kind,y)=>({id,t:'stamp',text,kind,x:180,y:y||46});
const TAG=(id,text)=>({id,t:'tag',text,x:12,y:22});
const DOC=(id,text,x,y)=>({id,t:'doc',text,x,y,st:{o:0}});
const SCR=(id,lines,x,y)=>({id,t:'screen',lines,x:x||210,y:y||96,w:Math.max(124,Math.max(...lines.map(l=>l.length))*5.9+22),st:{o:0}});
const ON={o:1,s:1}, OFF={o:0};
const SCENES=[
{id:'equacao',nav:'A = P + PL',art:'Patrimônio',title:'A balança do patrimônio',
 lead:'Rita abre uma loja. Cada fato mexe na equação de um jeito.',
 actors:[
  {id:'rita',t:'fig',label:'Rita',holdF:['money'],st:{x:46}},
  SCR('e0',['Ativo 10.000','= Passivo 0 + PL 10.000'],215,92),
  SCR('e1',['Ativo: caixa 6.000 + equip. 4.000','= Passivo 0 + PL 10.000'],215,92),
  SCR('e2',['Ativo 13.000','= Passivo 3.000 + PL 10.000'],215,92),
  SCR('e3',['Ativo 15.000','= Passivo 3.000 + PL 12.000'],215,92),
  DOC('f1','compra à vista: 4.000',215,145),DOC('f2','compra a prazo: 3.000',215,145),DOC('f3','serviço recebido: 2.000',215,145),
  TAG('t1','1 de 3 · Compra à vista'),TAG('t2','2 de 3 · Compra a prazo'),TAG('t3','3 de 3 · Receita'),
  STAMP('s1','PERMUTATIVO','info',34),STAMP('s2','PERMUTATIVO','info',34),STAMP('s3','MODIFICATIVO AUMENTATIVO','ok',34)],
 steps:[
  {reset:1,set:{t1:{o:1}},cap:'Rita coloca 10.000 de capital na loja. Tudo está no caixa.',to:{e0:ON},ms:400,d:2400},
  {cap:'Ela compra um equipamento de 4.000 à vista. Sai dinheiro, entra equipamento.',to:{f1:ON,rita:{aF:-80,h_money:1}},ms:400,d:2600},
  {to:{e0:OFF,e1:ON,rita:{aF:-12}},ms:400,d:2000},
  {cap:'O ativo só trocou de forma. O PL continua 10.000.',to:{s1:ON},ms:300,d:2400},

  {reset:1,set:{t2:{o:1},e1:{o:1}},cap:'Agora compra mercadorias de 3.000 para pagar depois.',to:{f2:ON},ms:400,d:2400},
  {cap:'O ativo sobe, mas o passivo sobe junto: é uma dívida com o fornecedor.',to:{e1:OFF,e2:ON},ms:400,d:2600},
  {cap:'O PL não mudou. Continua sendo um fato permutativo.',to:{s2:ON},ms:300,d:2400},

  {reset:1,set:{t3:{o:1},e2:{o:1}},cap:'Rita presta um serviço e recebe 2.000 na hora.',to:{f3:ON,rita:{aF:-100}},ms:400,d:2400},
  {cap:'O dinheiro entra sem nenhuma dívida em troca. Receita aumenta o PL.',to:{e2:OFF,e3:ON,rita:{aF:-12}},ms:400,d:2600},
  {to:{s3:ON},ms:300,d:2200}],
 rule:`<h3>Regra</h3>
  <div class="tbl"><table>
   <tr><th>Fato</th><th>O que muda</th><th>Exemplo</th></tr>
   <tr><td><b>Permutativo</b></td><td>Só troca valores; PL igual</td><td>Compra à vista ou a prazo, pagamento de dívida</td></tr>
   <tr><td><b>Modificativo aumentativo</b></td><td>PL sobe (receita)</td><td>Serviço prestado, juros recebidos</td></tr>
   <tr><td><b>Modificativo diminutivo</b></td><td>PL desce (despesa)</td><td>Salários, aluguel, energia</td></tr>
   <tr><td><b>Misto</b></td><td>Troca e altera o PL ao mesmo tempo</td><td>Pagamento de dívida com juros, venda com lucro</td></tr>
  </table></div>
  <div class="trap"><b>Pegadinha:</b> integralizar capital aumenta ativo e PL, mas não é receita: é fato permutativo (entra dinheiro, cresce o capital social). Receita e despesa são as que modificam o PL pelo resultado.</div>`},

{id:'partidas',nav:'Débito e crédito',art:'Escrituração',title:'Lançando nas contas em T',
 lead:'Todo lançamento tem um débito e um crédito do mesmo valor.',ground:[],
 actors:[
  {id:'ta',t:'taccount',text:'Mercadorias',x:95,y:175},
  {id:'tb',t:'taccount',text:'Fornecedores',x:265,y:175,st:{o:1}},
  {id:'tc',t:'taccount',text:'Caixa',x:95,y:175,st:{o:0}},
  DOC('da','3.000',70,132),DOC('cb','3.000',290,132),
  DOC('db2','3.000',240,132),DOC('cc','3.000',120,132),
  SCR('l1',['D – Mercadorias','C – Fornecedores'],180,52),
  SCR('l2',['D – Fornecedores','C – Caixa'],180,52),
  TAG('t1','1 de 2 · Compra a prazo'),TAG('t2','2 de 2 · Pagamento'),
  STAMP('s1','D = C','ok',196),STAMP('s2','DÍVIDA ZERADA','ok',196)],
 steps:[
  {reset:1,set:{t1:{o:1}},cap:'A loja compra 3.000 em mercadorias para pagar daqui a um mês.',to:{l1:ON},ms:400,d:2600},
  {cap:'Mercadoria é ativo e aumentou: débito, lado esquerdo.',to:{da:ON},ms:400,d:2400},
  {cap:'Fornecedores é passivo e aumentou: crédito, lado direito.',to:{cb:ON},ms:400,d:2400},
  {to:{s1:ON},ms:300,d:2000},

  {reset:1,set:{t2:{o:1},ta:{o:0},tc:{o:1},cb:{o:1}},cap:'Um mês depois, a loja paga o fornecedor em dinheiro.',to:{l2:ON},ms:400,d:2600},
  {cap:'Passivo diminuiu: débito em Fornecedores. A dívida se anula.',to:{db2:ON},ms:400,d:2400},
  {cap:'Caixa é ativo e diminuiu: crédito em Caixa.',to:{cc:ON},ms:400,d:2400},
  {to:{s2:ON},ms:300,d:2000}],
 rule:`<h3>Regra</h3>
  <div class="tbl"><table>
   <tr><th>Conta</th><th>Aumenta com</th><th>Diminui com</th></tr>
   <tr><td><b>Ativo</b></td><td>Débito</td><td>Crédito</td></tr>
   <tr><td><b>Passivo</b></td><td>Crédito</td><td>Débito</td></tr>
   <tr><td><b>PL</b></td><td>Crédito</td><td>Débito</td></tr>
   <tr><td><b>Despesa</b></td><td>Débito</td><td>—</td></tr>
   <tr><td><b>Receita</b></td><td>Crédito</td><td>—</td></tr>
  </table></div>
  <p>Método das partidas dobradas: para cada débito há um crédito de igual valor. A soma dos débitos é igual à soma dos créditos.</p>
  <div class="trap"><b>Pegadinha:</b> "debitar" não quer dizer "perder". Debitar o caixa é <b>aumentar</b> o caixa. Pense em lado (esquerdo) e natureza da conta, não no sentido do dia a dia.</div>`},

{id:'competencia',nav:'Competência × caixa',art:'Princípios contábeis',title:'Quando a receita conta?',
 lead:'O conserto foi feito em dezembro. O dinheiro só chegou em janeiro.',
 actors:[
  {id:'mec',t:'fig',label:'Oficina',alt:1,st:{x:80}},
  {id:'cli',t:'fig',label:'Cliente',holdF:['money'],st:{x:290,f:-1}},
  {id:'carro',t:'car',x:185,y:166},
  DOC('dez','DEZEMBRO: serviço feito',185,110),DOC('jan','JANEIRO: pagamento',185,110),
  SCR('r1',['Regime de competência:','receita em DEZEMBRO'],185,74),
  SCR('r2',['Regime de caixa:','receita em JANEIRO'],185,74),
  TAG('t1','1 de 2 · Competência'),TAG('t2','2 de 2 · Caixa'),
  STAMP('s1','CONTA QUANDO ACONTECE','ok',30),STAMP('s2','CONTA QUANDO PAGA','info',30)],
 steps:[
  {reset:1,set:{t1:{o:1}},cap:'A oficina conserta o carro em dezembro e entrega no mesmo dia.',to:{dez:ON,mec:{aF:-90}},ms:400,d:2600},
  {cap:'O cliente combina pagar só em janeiro.',to:{mec:{aF:-12},cli:{aF:-60}},ms:400,d:2200},
  {cap:'Pela competência, a receita é de dezembro, quando o serviço foi prestado.',to:{r1:ON,dez:OFF,cli:{aF:-12}},ms:400,d:2800},
  {to:{s1:ON},ms:300,d:2200},

  {reset:1,set:{t2:{o:1}},cap:'Em janeiro, o cliente paga.',to:{jan:ON,cli:{x:262,walk:1,h_money:1,aF:-80}},ms:1000,d:2000},
  {cap:'Pelo regime de caixa, a receita só entra quando o dinheiro entra: janeiro.',to:{r2:ON,jan:OFF,cli:{walk:0}},ms:400,d:2800},
  {to:{s2:ON},ms:300,d:2200}],
 rule:`<h3>Regra</h3>
  <ul>
   <li><b>Competência</b> (exigido na contabilidade societária): receitas e despesas entram no período em que <b>ocorrem</b>, pague-se ou não.</li>
   <li><b>Caixa</b>: só registra quando há entrada ou saída de dinheiro.</li>
   <li>Na competência, o serviço feito e não recebido vira <b>conta a receber</b> (ativo). Despesa incorrida e não paga vira <b>conta a pagar</b> (passivo).</li>
  </ul>
  <div class="trap"><b>Pegadinha:</b> aluguel pago adiantado não é despesa no mês do pagamento. É despesa antecipada (ativo) e vira despesa mês a mês, conforme o uso.</div>`},

{id:'depreciacao',nav:'Depreciação',art:'Ativo imobilizado',title:'A viatura perde valor a cada ano',
 lead:'Uma viatura de 50.000 com vida útil de 5 anos, sem valor residual.',ground:[],
 actors:[
  {id:'b0',t:'blk',x:70,h:75,text:'50 mil',kind:'full',st:{o:0}},
  {id:'b1',t:'blk',x:140,h:60,text:'40 mil',kind:'full',st:{o:0}},
  {id:'b2',t:'blk',x:210,h:45,text:'30 mil',kind:'full',st:{o:0}},
  {id:'carro',t:'car',text:'VIATURA',x:292,y:166,st:{s:.72}},
  DOC('a0','compra',70,174),DOC('a1','ano 1',140,174),DOC('a2','ano 2',210,174),
  SCR('q',['50.000 ÷ 5 anos','= 10.000 por ano'],180,48),
  SCR('vc',['Valor contábil após 2 anos:','50.000 − 20.000 = 30.000'],180,48),
  TAG('t1','1 de 2 · Quota anual'),TAG('t2','2 de 2 · Valor contábil'),
  STAMP('s1','LINEAR: SEMPRE IGUAL','info',204),STAMP('s2','CUSTO − DEPRECIAÇÃO ACUMULADA','ok',204)],
 steps:[
  {reset:1,set:{t1:{o:1}},cap:'A viatura custou 50.000 e deve durar 5 anos.',to:{b0:ON,a0:ON},ms:400,d:2400},
  {cap:'No método linear, divide-se o valor pelos anos: 10.000 de depreciação por ano.',to:{q:ON},ms:400,d:2800},
  {to:{b1:ON,a1:ON},ms:400,d:1400},
  {to:{s1:ON},ms:300,d:2000},

  {reset:1,set:{t2:{o:1},b0:{o:1},a0:{o:1},b1:{o:1},a1:{o:1}},cap:'Depois de dois anos, já foram 20.000 de depreciação acumulada.',to:{b2:ON,a2:ON},ms:400,d:2600},
  {cap:'O valor contábil é o custo menos a depreciação acumulada: 30.000.',to:{vc:ON},ms:400,d:2800},
  {to:{s2:ON},ms:300,d:2200}],
 rule:`<h3>Regra</h3>
  <ul>
   <li>Quota linear = (custo − valor residual) ÷ vida útil.</li>
   <li>A depreciação é <b>despesa</b> no resultado e vai acumulando numa conta <b>redutora do ativo</b> (depreciação acumulada).</li>
   <li>Valor contábil = custo − depreciação acumulada.</li>
   <li>Terrenos não se depreciam. Recursos naturais sofrem exaustão; intangíveis, amortização.</li>
  </ul>
  <div class="trap"><b>Pegadinha:</b> se houver valor residual, desconte antes de dividir. Viatura de 50.000 com residual de 10.000 em 5 anos: (50.000 − 10.000) ÷ 5 = 8.000 por ano.</div>`},

{id:'cmv',nav:'CMV',art:'Operações com mercadorias',title:'Quanto custou o que foi vendido?',
 lead:'Começa com estoque, compra mais, sobra um pouco. O que saiu é o CMV.',ground:[],
 actors:[
  {id:'ei',t:'blk',x:55,h:25,text:'EI 10',kind:'full',st:{o:0}},
  {id:'co',t:'blk',x:140,h:75,text:'+ Compras 30',st:{o:0}},
  {id:'ef',t:'blk',x:225,h:37.5,text:'− EF 15',st:{o:0}},
  {id:'cm',t:'blk',x:310,h:62.5,text:'CMV 25',kind:'full',st:{o:0}},
  SCR('f',['CMV = EI + Compras − EF','10 + 30 − 15 = 25 (mil)'],180,52),
  DOC('d1','início',55,174),DOC('d2','compras',140,174),DOC('d3','sobra',225,174),
  TAG('t1','1 de 2 · Os três números'),TAG('t2','2 de 2 · A conta'),
  STAMP('s1','CMV = 25 MIL','ok',204)],
 steps:[
  {reset:1,set:{t1:{o:1}},cap:'O mês começa com 10 mil em mercadorias no estoque.',to:{ei:ON,d1:ON},ms:400,d:2400},
  {cap:'Durante o mês, a loja compra mais 30 mil.',to:{co:ON,d2:ON},ms:400,d:2400},
  {cap:'No fim do mês, conta o que sobrou: 15 mil.',to:{ef:ON,d3:ON},ms:400,d:2400},

  {reset:1,set:{t2:{o:1},ei:{o:1},co:{o:1},ef:{o:1}},cap:'Tudo o que esteve disponível e não sobrou foi vendido.',to:{f:ON},ms:400,d:2800},
  {cap:'10 mais 30, menos 15: o custo das mercadorias vendidas é 25 mil.',to:{cm:ON},ms:400,d:2600},
  {to:{s1:ON},ms:300,d:2200}],
 rule:`<h3>Regra</h3>
  <ul>
   <li><b>CMV = EI + Compras líquidas − EF</b>.</li>
   <li>Compras líquidas = compras + frete e seguro pagos pelo comprador − devoluções − abatimentos − impostos recuperáveis.</li>
   <li>Lucro bruto = Receita líquida de vendas − CMV.</li>
  </ul>
  <div class="trap"><b>Pegadinha:</b> desconto financeiro (por pagar antes) não reduz compras: é receita financeira. Só o desconto comercial, dado na nota, reduz o custo.</div>`}
];
