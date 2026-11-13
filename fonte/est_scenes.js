const STAMP=(id,text,kind,y)=>({id,t:'stamp',text,kind,x:180,y:y||46});
const TAG=(id,text)=>({id,t:'tag',text,x:12,y:22});
const DOC=(id,text,x,y)=>({id,t:'doc',text,x,y,st:{o:0}});
const SCR=(id,lines,x,y)=>({id,t:'screen',lines,x:x||210,y:y||96,w:Math.max(124,Math.max(...lines.map(l=>l.length))*5.9+22),st:{o:0}});
const DOT=(id,x,y,alt,o)=>({id,t:'dots',pts:[[0,0]],alt,x,y,st:{o:o===undefined?1:o}});
const ON={o:1,s:1}, OFF={o:0};
const AX=[[40,'0'],[96,'2'],[152,'4'],[208,'6'],[264,'8'],[320,'10']];
const SCENES=[
{id:'media-mediana',nav:'Média × mediana',art:'Medidas de posição',title:'Um salário enorme estraga a média',
 lead:'Cinco salários, em mil reais. Depois, um deles vira 40.',ground:[],
 actors:[
  {id:'ax',t:'ticks',x1:30,x2:340,ay:165,labels:AX},
  DOT('v1',96,152),DOT('v2',124,152),DOT('v3',124,139),DOT('v4',152,152),DOT('v5',180,152),
  DOT('v5b',334,152,1,0),DOC('big','40 →',334,128),
  SCR('m1',['Média: 17 ÷ 5 = 3,4','Mediana (do meio): 3'],180,86),
  SCR('m2',['Média: 52 ÷ 5 = 10,4','Mediana (do meio): 3'],180,86),
  TAG('t1','1 de 2 · Dados comportados'),TAG('t2','2 de 2 · Valor extremo'),
  STAMP('s1','MÉDIA ≈ MEDIANA','info',26),STAMP('s2','MEDIANA RESISTE','ok',26)],
 steps:[
  {reset:1,set:{t1:{o:1}},cap:'Salários de 2, 3, 3, 4 e 5 mil. Em ordem, o do meio é 3.',to:{m1:ON},ms:400,d:2800},
  {cap:'A média dá 3,4. Média e mediana ficam perto uma da outra.',to:{s1:ON},ms:300,d:2400},

  {reset:1,set:{t2:{o:1}},cap:'Agora o salário de 5 mil é trocado por um de 40 mil.',to:{v5:{o:0},v5b:{o:1},big:ON},ms:600,d:2400},
  {cap:'A média dispara para 10,4, mas ninguém do grupo ganha perto disso.',to:{m2:ON},ms:400,d:2800},
  {cap:'O valor do meio continua 3. A mediana não se deixa levar pelo extremo.',to:{s2:ON},ms:300,d:2600}],
 rule:`<h3>Regra</h3>
  <ul>
   <li><b>Média</b>: soma ÷ quantidade. Usa todos os valores, por isso é sensível a extremos.</li>
   <li><b>Mediana</b>: valor central com os dados em ordem. Com quantidade par, é a média dos dois centrais.</li>
   <li>Com valores extremos (outliers), a mediana representa melhor o "típico".</li>
  </ul>
  <div class="trap"><b>Pegadinha:</b> a mediana exige ordenar os dados antes. A banca dá a lista fora de ordem para quem pega o valor do meio direto.</div>`},

{id:'moda',nav:'Moda',art:'Medidas de posição',title:'O tamanho que mais sai',
 lead:'Uma loja de calçados conta as vendas de cada número.',ground:[],
 actors:[
  {id:'a37',t:'blk',x:60,h:20,text:'37',kind:'full',st:{o:0}},{id:'a38',t:'blk',x:120,h:40,text:'38',kind:'full',st:{o:0}},
  {id:'a39',t:'blk',x:180,h:80,text:'39',kind:'full',st:{o:0}},{id:'a40',t:'blk',x:240,h:40,text:'40',kind:'full',st:{o:0}},
  {id:'a41',t:'blk',x:300,h:20,text:'41',kind:'full',st:{o:0}},
  {id:'b38',t:'blk',x:120,h:80,text:'38',kind:'full',st:{o:0}},{id:'b39',t:'blk',x:180,h:40,text:'39',kind:'full',st:{o:0}},
  {id:'b40',t:'blk',x:240,h:80,text:'40',kind:'full',st:{o:0}},
  DOC('f1','vendas: 1 · 2 · 4 · 2 · 1',180,182),DOC('f2','vendas: 1 · 4 · 2 · 4 · 1',180,182),
  TAG('t1','1 de 2 · Uma moda'),TAG('t2','2 de 2 · Duas modas'),
  STAMP('s1','MODA = 39','ok',34),STAMP('s2','BIMODAL: 38 E 40','info',34)],
 steps:[
  {reset:1,set:{t1:{o:1}},cap:'Cada barra mostra quantos pares de cada número foram vendidos.',to:{a37:ON,a38:ON,a39:ON,a40:ON,a41:ON,f1:ON},ms:500,d:2600},
  {cap:'A moda é o valor que mais aparece: o 39, com 4 vendas.',to:{s1:ON},ms:300,d:2400},

  {reset:1,set:{t2:{o:1},a37:{o:1},a41:{o:1}},cap:'Em outra semana, o 38 e o 40 empataram no topo.',to:{b38:ON,b39:ON,b40:ON,f2:ON},ms:500,d:2600},
  {cap:'Quando dois valores empatam como os mais frequentes, a série é bimodal.',to:{s2:ON},ms:300,d:2600}],
 rule:`<h3>Regra</h3>
  <ul>
   <li><b>Moda</b>: valor de maior frequência. Pode não existir (amodal), ser uma, duas (bimodal) ou mais.</li>
   <li>É a única medida de posição que serve para dados qualitativos (cor preferida, tipo de crime mais registrado).</li>
   <li>Em tabela de frequências, olhe a coluna da frequência, não a dos valores.</li>
  </ul>
  <div class="trap"><b>Pegadinha:</b> a moda é o <b>valor</b> (39), não a frequência dele (4). A banca coloca as duas coisas nas alternativas.</div>`},

{id:'dispersao',nav:'Dispersão',art:'Medidas de dispersão',title:'Mesma média, grupos diferentes',
 lead:'Dois grupos de notas, ambos com média 5.',ground:[],
 actors:[
  {id:'ax',t:'ticks',x1:30,x2:340,ay:158,labels:AX},
  DOT('a1',152,145),DOT('a2',180,145),DOT('a3',208,145),
  DOT('b1',40,112,1,0),DOT('b2',180,112,1,0),DOT('b3',320,112,1,0),
  DOC('la','A: 4, 5, 6',300,145),DOC('lb','B: 0, 5, 10',90,90),
  SCR('r',['Amplitude A = 2 · B = 10','Desvio padrão A < B'],180,52),
  TAG('t1','1 de 2 · Grupo A'),TAG('t2','2 de 2 · Grupo B'),
  STAMP('s1','MÉDIA NÃO BASTA','no',52),STAMP('s2','B É MAIS DISPERSO','ok',204)],
 steps:[
  {reset:1,set:{t1:{o:1}},cap:'O grupo A tirou 4, 5 e 6. Média 5, notas bem juntas.',to:{la:ON},ms:400,d:2600},
  {to:{s1:ON},ms:300,d:1600},

  {reset:1,set:{t2:{o:1},la:{o:1}},cap:'O grupo B tirou 0, 5 e 10. A média também é 5.',to:{b1:{o:1},b2:{o:1},b3:{o:1},lb:ON},ms:500,d:2600},
  {cap:'Só que as notas de B estão muito mais espalhadas. Amplitude e desvio padrão medem isso.',to:{r:ON},ms:400,d:3000},
  {to:{s2:ON},ms:300,d:2200}],
 rule:`<h3>Regra</h3>
  <ul>
   <li><b>Amplitude</b> = maior − menor.</li>
   <li><b>Variância</b>: média dos quadrados dos desvios em relação à média. <b>Desvio padrão</b> = raiz da variância, na mesma unidade dos dados.</li>
   <li><b>Coeficiente de variação</b> = desvio padrão ÷ média. Serve para comparar grupos com médias diferentes.</li>
   <li>Somar uma constante a todos os dados não muda o desvio padrão. Multiplicar por k multiplica o desvio por k (e a variância por k²).</li>
  </ul>
  <div class="trap"><b>Pegadinha:</b> variância de amostra divide por n − 1; de população, por n. Leia qual das duas o enunciado pede.</div>`},

{id:'boxplot',nav:'Box plot',art:'Gráficos',title:'A caixa e o ponto fora dela',
 lead:'Tempos de atendimento, em minutos, resumidos em cinco números.',ground:[],
 actors:[
  {id:'ax',t:'ticks',x1:30,x2:340,ay:158,labels:[[30,'0'],[90,'20'],[150,'40'],[210,'60'],[270,'80'],[330,'100']]},
  {id:'bp',t:'bplot',ay:110,min:60,q1:90,q2:120,q3:150,max:210,st:{o:0}},
  DOT('out',300,110,1,0),
  DOC('lq1','Q1 20',90,76),DOC('lq2','Q2 30',120,54),DOC('lq3','Q3 40',150,76),
  DOC('lim','limite: 70',240,136),DOC('lo','90',300,88),
  SCR('a',['AIQ = Q3 − Q1 = 20','Limite = Q3 + 1,5 × 20 = 70'],180,46),
  TAG('t1','1 de 2 · A caixa'),TAG('t2','2 de 2 · O outlier'),
  STAMP('s1','METADE DOS DADOS NA CAIXA','info',204),STAMP('s2','90 > 70: OUTLIER','no',204)],
 steps:[
  {reset:1,set:{t1:{o:1}},cap:'A caixa vai do primeiro quartil (20) ao terceiro (40). A linha de dentro é a mediana (30).',to:{bp:ON,lq1:ON,lq2:ON,lq3:ON},ms:500,d:3000},
  {cap:'Entre Q1 e Q3 estão os 50% centrais dos dados.',to:{s1:ON},ms:300,d:2400},

  {reset:1,set:{t2:{o:1},bp:{o:1}},cap:'A distância entre Q3 e Q1 é a amplitude interquartil: 20.',to:{a:ON},ms:400,d:2600},
  {cap:'Acima de Q3 + 1,5 × 20 = 70, o valor é considerado atípico.',to:{lim:ON},ms:400,d:2600},
  {cap:'Um atendimento de 90 minutos aparece como ponto isolado, fora do bigode.',to:{out:{o:1},lo:ON},ms:400,d:2400},
  {to:{s2:ON},ms:300,d:2200}],
 rule:`<h3>Regra</h3>
  <ul>
   <li>Cinco números: mínimo, Q1, mediana (Q2), Q3 e máximo (sem contar outliers).</li>
   <li><b>AIQ</b> = Q3 − Q1. Limites: Q1 − 1,5·AIQ e Q3 + 1,5·AIQ. Fora disso, outlier.</li>
   <li>Mediana mais perto de Q1 e bigode direito mais longo: assimetria à direita (positiva).</li>
  </ul>
  <div class="trap"><b>Pegadinha:</b> a caixa mostra 50% dos dados, não 50% da amplitude. Uma caixa curta quer dizer dados concentrados, não poucos dados.</div>`},

{id:'correlacao',nav:'Correlação',art:'Correlação',title:'Andar junto não é causar',
 lead:'Cada ponto é um dia. Os eixos são duas medidas.',ground:[],
 actors:[
  {id:'ax',t:'ticks',x1:40,x2:330,ay:170,labels:[]},
  {id:'pos',t:'dots',pts:[[70,150],[110,140],[140,122],[180,112],[215,96],[250,84],[290,70],[315,60]],st:{o:0}},
  {id:'neg',t:'dots',pts:[[70,62],[110,74],[140,90],[180,100],[215,118],[250,128],[290,146],[315,152]],alt:1,st:{o:0}},
  {id:'nul',t:'dots',pts:[[70,90],[105,150],[140,70],[175,128],[210,82],[245,150],[280,100],[315,66]],st:{o:0}},
  {id:'sol',t:'sun',x:320,y:36,st:{o:0}},
  DOC('lp','r perto de +1',90,46),DOC('ln','r perto de −1',90,46),DOC('lz','r perto de 0',90,46),
  SCR('c',['Sorvete vendido × afogamentos:','sobem juntos no verão.','Causa comum: o calor.'],180,90),
  TAG('t1','1 de 4 · Positiva'),TAG('t2','2 de 4 · Negativa'),TAG('t3','3 de 4 · Nula'),TAG('t4','4 de 4 · A armadilha'),
  STAMP('s1','UM SOBE, O OUTRO SOBE','ok',196),STAMP('s2','UM SOBE, O OUTRO DESCE','info',196),
  STAMP('s3','SEM RELAÇÃO LINEAR','info',196),STAMP('s4','CORRELAÇÃO ≠ CAUSA','no',196)],
 steps:[
  {reset:1,set:{t1:{o:1}},cap:'Horas de estudo e acertos: quanto mais um, mais o outro.',to:{pos:{o:1},lp:ON},ms:500,d:2600},
  {to:{s1:ON},ms:300,d:1800},
  {reset:1,set:{t2:{o:1}},cap:'Faltas e nota: quando um aumenta, o outro cai.',to:{neg:{o:1},ln:ON},ms:500,d:2600},
  {to:{s2:ON},ms:300,d:1800},
  {reset:1,set:{t3:{o:1}},cap:'Número do sapato e nota: pontos espalhados, sem tendência.',to:{nul:{o:1},lz:ON},ms:500,d:2600},
  {to:{s3:ON},ms:300,d:1800},
  {reset:1,set:{t4:{o:1},pos:{o:1}},cap:'Venda de sorvete e afogamentos também sobem juntos.',to:{c:ON},ms:400,d:2800},
  {cap:'Sorvete não afoga ninguém. Os dois crescem por causa de um terceiro fator: o calor.',to:{sol:{o:1}},ms:400,d:2800},
  {to:{s4:ON},ms:300,d:2200}],
 rule:`<h3>Regra</h3>
  <ul>
   <li>Coeficiente de correlação linear (r) vai de <b>−1 a +1</b>.</li>
   <li>r perto de +1: relação linear positiva forte. Perto de −1: negativa forte. Perto de 0: sem relação <b>linear</b>.</li>
   <li>r não tem unidade e não muda se você trocar a escala dos dados (metros por centímetros, por exemplo).</li>
  </ul>
  <div class="trap"><b>Pegadinha:</b> correlação alta não prova que uma variável causa a outra. E r = 0 não quer dizer que não há relação nenhuma: pode haver uma relação curva.</div>`}
];
