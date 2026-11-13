const STAMP=(id,text,kind,y)=>({id,t:'stamp',text,kind,x:180,y:y||46});
const TAG=(id,text)=>({id,t:'tag',text,x:12,y:22});
const DOC=(id,text,x,y)=>({id,t:'doc',text,x,y,st:{o:0}});
const SCR=(id,lines,x,y)=>({id,t:'screen',lines,x:x||210,y:y||96,w:Math.max(124,Math.max(...lines.map(l=>l.length))*5.9+22),st:{o:0}});
const ON={o:1,s:1}, OFF={o:0};
const SCENES=[
{id:'crase',nav:'Crase',art:'Crase',title:'Tem crase ou não tem?',
 lead:'Um truque resolve quase todas: troque "vou a" por "volto de".',
 actors:[
  {id:'lu',t:'fig',label:'Lu',st:{x:40}},
  SCR('a1',['Frase:','Vou ___ praia.'],230),SCR('a2',['Certo:','Vou à praia.'],230),
  SCR('b1',['Frase:','Vou ___ Recife.'],230),SCR('b2',['Certo:','Vou a Recife.'],230),
  SCR('c1',['Sem crase:','Fui a pé. Começa a partir de hoje.'],230),
  DOC('da','Volto DA praia → tem crase',225,145),DOC('db','Volto DE Recife → sem crase',225,145),
  DOC('dc','Masculino ou verbo: sem crase',225,145),
  TAG('t1','1 de 3 · Volto da'),TAG('t2','2 de 3 · Volto de'),TAG('t3','3 de 3 · Masculino e verbo'),
  STAMP('s1','VOU À PRAIA','ok'),STAMP('s2','VOU A RECIFE','ok'),STAMP('s3','A PÉ, A PARTIR','info')],
 steps:[
  {reset:1,set:{t1:{o:1}},cap:'Lu vai viajar. Como se escreve: "Vou a praia" ou "Vou à praia"?',to:{a1:ON},ms:400,d:2400},
  {cap:'Faça a volta: "Volto DA praia". Apareceu DA, então tem crase.',to:{da:ON,lu:{x:62,walk:1}},ms:1200,d:1800},
  {to:{a1:OFF,a2:ON,lu:{walk:0}},ms:400,d:1200},
  {to:{s1:ON},ms:300,d:2400},

  {reset:1,set:{t2:{o:1}},cap:'E para Recife? "Vou a Recife" ou "Vou à Recife"?',to:{b1:ON},ms:400,d:2400},
  {cap:'A volta é "Volto DE Recife". Sem artigo, sem crase.',to:{db:ON},ms:400,d:2000},
  {to:{b1:OFF,b2:ON},ms:400,d:1200},
  {cap:'Atenção: "Volto DA Recife antiga" já pede crase, porque o lugar veio especificado.',to:{s2:ON},ms:300,d:2800},

  {reset:1,set:{t3:{o:1}},cap:'Antes de palavra masculina e antes de verbo, não há crase.',to:{c1:ON,dc:ON},ms:400,d:2600},
  {cap:'Por isso: a pé, a cavalo, a partir de, a começar.',to:{s3:ON},ms:300,d:2600}],
 rule:`<h3>Regra</h3>
  <ul>
   <li>Crase é a fusão da preposição <b>a</b> com o artigo <b>a</b>. Precisa das duas coisas.</li>
   <li>Truque do lugar: se volto <b>da</b>, crase há; se volto <b>de</b>, crase pra quê?</li>
   <li>Truque da troca: troque por uma palavra masculina. Se virar <b>ao</b>, tem crase ("vou à escola" → "vou ao colégio").</li>
   <li>Não há crase antes de masculino, de verbo, de pronome pessoal e da maioria dos pronomes de tratamento.</li>
  </ul>
  <div class="trap"><b>Pegadinha:</b> a crase é obrigatória nas horas ("às 8h") e em locuções femininas ("à noite", "às vezes"). Antes de nomes de mulher e de pronome possessivo feminino, é facultativa.</div>`},

{id:'virgula',nav:'Vírgula',art:'Pontuação',title:'A vírgula que salva a vovó',
 lead:'Uma vírgula muda quem come e quem é comido.',
 actors:[
  {id:'teo',t:'fig',label:'Téo',st:{x:120,s:.75}},
  {id:'vovo',t:'fig',label:'Vovó',holdB:['stick'],st:{x:230,f:-1,h_stick:1,aB:25}},
  {id:'b1',t:'bubble',text:'Vamos comer, vovó!',x:130,y:118},
  {id:'b2',t:'bubble',text:'Vamos comer vovó!',x:130,y:118},
  SCR('c1',['Errado:','O delegado, chegou cedo.'],200,92),SCR('c2',['Certo:','O delegado chegou cedo.'],200,92),
  TAG('t1','1 de 3 · Com vírgula'),TAG('t2','2 de 3 · Sem vírgula'),TAG('t3','3 de 3 · Sujeito e verbo'),
  STAMP('s1','VOCATIVO: COM VÍRGULA','ok'),STAMP('s2','VOVÓ VIROU O ALMOÇO','no'),STAMP('s3','SUJEITO, VERBO: NUNCA','no')],
 steps:[
  {reset:1,set:{t1:{o:1}},cap:'Téo chama a avó para o almoço.',to:{b1:ON},ms:300,d:2000},
  {cap:'Com a vírgula, "vovó" é vocativo: é a pessoa chamada. Vovó vai comer junto.',to:{vovo:{aF:-150}},ms:300,d:2400},
  {to:{s1:ON,vovo:{aF:-12}},ms:300,d:2200},

  {reset:1,set:{t2:{o:1}},cap:'Agora Téo esquece a vírgula.',to:{b2:ON},ms:300,d:2000},
  {cap:'Sem vírgula, "vovó" vira o objeto de comer. Melhor ela sair correndo.',to:{vovo:{f:1}},ms:200,d:240},
  {to:{vovo:{x:420,walk:1.3},b2:OFF},ms:1300,d:1400},
  {to:{s2:ON},ms:300,d:2200},

  {reset:1,set:{t3:{o:1},teo:{o:0},vovo:{o:0}},cap:'Outra regra que cai sempre: não se separa o sujeito do verbo com vírgula.',to:{c1:ON},ms:400,d:2400},
  {to:{s3:ON},ms:300,d:1800},
  {cap:'O certo é sem vírgula. Só se usa par de vírgulas quando algo é intercalado: "O delegado, aliás, chegou cedo."',to:{c1:OFF,c2:ON,s3:OFF},ms:400,d:3000}],
 rule:`<h3>Regra</h3>
  <ul>
   <li><b>Vocativo</b> (quem é chamado) sempre vem separado por vírgula.</li>
   <li><b>Nunca</b> se separa com uma vírgula só: sujeito e verbo, verbo e complemento, nome e complemento.</li>
   <li>Expressões <b>intercaladas</b> (explicativas, apostos, "aliás", "por exemplo") vão entre duas vírgulas.</li>
   <li>Adjunto adverbial deslocado para o início: vírgula facultativa se for curto, recomendada se for longo.</li>
  </ul>
  <div class="trap"><b>Pegadinha:</b> na reescrita, tirar as vírgulas de uma oração adjetiva muda o sentido: com vírgulas é explicativa (vale para todos); sem vírgulas é restritiva (só uma parte).</div>`},

{id:'haver-fazer',nav:'Haver e fazer',art:'Concordância verbal',title:'Havia ou haviam?',
 lead:'Dois verbos que ficam sempre no singular em certos sentidos.',
 actors:[
  {id:'p1',t:'fig',st:{x:256,f:-1,s:.85}},{id:'p2',t:'fig',st:{x:282,f:-1,s:.85}},{id:'p3',t:'fig',st:{x:308,f:-1,s:.85}},{id:'p4',t:'fig',label:'Fila',st:{x:334,f:-1,s:.85}},
  SCR('a1',['Frase:','___ muitas pessoas na fila.'],130,102),SCR('a2',['Certo:','Havia muitas pessoas na fila.'],130,102),
  SCR('b1',['Frase:','___ dois anos que entrei na polícia.'],180,90),SCR('b2',['Certo:','Faz dois anos que entrei na polícia.'],180,90),
  SCR('c1',['Também certo:','Existiam muitas pessoas na fila.'],130,102),
  TAG('t1','1 de 3 · Haver = existir'),TAG('t2','2 de 3 · Fazer = tempo'),TAG('t3','3 de 3 · Existir concorda'),
  STAMP('s1','HAVIA','ok'),STAMP('s2','FAZ DOIS ANOS','ok'),STAMP('s3','EXISTIAM: CONCORDA','info')],
 steps:[
  {reset:1,set:{t1:{o:1}},cap:'Havia ou haviam muitas pessoas na fila?',to:{a1:ON},ms:400,d:2400},
  {cap:'Haver no sentido de existir não tem sujeito. Fica no singular, em qualquer tempo.',to:{a1:OFF,a2:ON},ms:400,d:2600},
  {to:{s1:ON},ms:300,d:2200},

  {reset:1,set:{t2:{o:1},p1:{o:0},p2:{o:0},p3:{o:0},p4:{o:0}},cap:'E quando o assunto é tempo que passou?',to:{b1:ON},ms:400,d:2400},
  {cap:'Fazer indicando tempo decorrido também não tem sujeito: faz dois anos, fazia meses.',to:{b1:OFF,b2:ON},ms:400,d:2600},
  {to:{s2:ON},ms:300,d:2200},

  {reset:1,set:{t3:{o:1}},cap:'Cuidado: o verbo existir tem sujeito e concorda com ele.',to:{c1:ON},ms:400,d:2600},
  {cap:'Muitas pessoas existiam. Por isso o plural está certo aqui.',to:{s3:ON},ms:300,d:2600}],
 rule:`<h3>Regra</h3>
  <ul>
   <li><b>Haver</b> = existir, acontecer ou tempo decorrido: impessoal, sempre no singular ("havia problemas", "houve brigas").</li>
   <li><b>Fazer</b> = tempo decorrido ou fenômeno do clima: impessoal ("faz dez anos", "fez dias quentes").</li>
   <li>O auxiliar acompanha: "<b>deve haver</b> problemas", "<b>vai fazer</b> dois anos".</li>
   <li><b>Existir, ocorrer, acontecer</b> têm sujeito e concordam: "existem problemas".</li>
  </ul>
  <div class="trap"><b>Pegadinha:</b> a banca troca "existiam" por "haviam" na reescrita. A forma correta é "havia".</div>`},

{id:'regencia',nav:'Regência',art:'Regência verbal',title:'Assistir a, preferir a',
 lead:'Alguns verbos mudam de sentido conforme a preposição.',
 actors:[
  {id:'bia',t:'fig',label:'Bia',st:{x:50}},
  {id:'med',t:'fig',label:'Médico',alt:1,st:{x:262,f:-1,o:0}},
  {id:'pac',t:'fig',label:'Paciente',st:{x:322,r:-90,y:176,o:0}},
  SCR('a1',['Frase:','Assisti ___ filme ontem.'],210,100),SCR('a2',['Certo:','Assisti ao filme ontem.'],210,100),
  SCR('b1',['Também certo:','O médico assistiu o paciente.'],128,100),
  SCR('c1',['Errado:','Prefiro café do que chá.'],210,100),SCR('c2',['Certo:','Prefiro café a chá.'],210,100),
  TAG('t1','1 de 3 · Assistir = ver'),TAG('t2','2 de 3 · Assistir = ajudar'),TAG('t3','3 de 3 · Preferir'),
  STAMP('s1','ASSISTIR AO FILME','ok'),STAMP('s2','ASSISTIR O PACIENTE','ok'),STAMP('s3','PREFERIR UMA COISA A OUTRA','ok')],
 steps:[
  {reset:1,set:{t1:{o:1}},cap:'Bia foi ao cinema. Assisti o filme ou assisti ao filme?',to:{a1:ON},ms:400,d:2400},
  {cap:'Assistir no sentido de ver pede a preposição a: assisti ao filme, assisti à aula.',to:{a1:OFF,a2:ON},ms:400,d:2600},
  {to:{s1:ON},ms:300,d:2200},

  {reset:1,set:{t2:{o:1},bia:{o:0},med:{o:1},pac:{o:1}},cap:'Agora um médico atende um paciente.',to:{med:{aF:-80}},ms:300,d:1800},
  {cap:'Assistir no sentido de ajudar, dar assistência, não pede preposição.',to:{b1:ON},ms:400,d:2600},
  {to:{s2:ON},ms:300,d:2200},

  {reset:1,set:{t3:{o:1}},cap:'Preferir mais do que? Na norma culta, não.',to:{c1:ON},ms:400,d:2400},
  {cap:'Prefere-se uma coisa a outra, sem "mais" e sem "do que".',to:{c1:OFF,c2:ON},ms:400,d:2400},
  {to:{s3:ON},ms:300,d:2400}],
 rule:`<h3>Regra</h3>
  <div class="tbl"><table>
   <tr><th>Verbo</th><th>Sentido</th><th>Regência</th></tr>
   <tr><td><b>Assistir</b></td><td>Ver, presenciar</td><td>Assistir <b>a</b> (ao filme, à aula)</td></tr>
   <tr><td><b>Assistir</b></td><td>Ajudar, dar assistência</td><td>Sem preposição (assistir o paciente)</td></tr>
   <tr><td><b>Assistir</b></td><td>Caber, pertencer (direito)</td><td>Assistir <b>a</b> (o direito assiste ao réu)</td></tr>
   <tr><td><b>Preferir</b></td><td>Escolher entre dois</td><td>Preferir algo <b>a</b> algo</td></tr>
   <tr><td><b>Visar</b></td><td>Ter como objetivo</td><td>Visar <b>a</b> (visar ao cargo)</td></tr>
   <tr><td><b>Obedecer</b></td><td>Cumprir ordens</td><td>Obedecer <b>a</b> (às leis)</td></tr>
  </table></div>
  <div class="trap"><b>Pegadinha:</b> com "assistir a" (ver), não se usa o pronome "lhe": "assisti a ele", não "assisti-lhe". E quando há preposição a + artigo feminino, aparece a crase: "assisti à palestra".</div>`},

{id:'porques',nav:'Porquês',art:'Ortografia',title:'Os quatro porquês',
 lead:'Ana pergunta, Beto responde. Cada fala usa um porquê diferente.',
 actors:[
  {id:'ana',t:'fig',label:'Ana',st:{x:70}},
  {id:'beto',t:'fig',label:'Beto',st:{x:290,f:-1}},
  {id:'b1',t:'bubble',text:'Por que você chegou tarde?',x:90,y:104},
  {id:'b2',t:'bubble',text:'Porque o ônibus atrasou.',x:270,y:104},
  {id:'b3',t:'bubble',text:'Chegou tarde por quê?',x:90,y:104},
  {id:'b4',t:'bubble',text:'Ninguém sabe o porquê.',x:270,y:104},
  DOC('d1','pergunta: separado',90,150),DOC('d2','resposta: junto',270,150),
  DOC('d3','fim: com acento',90,150),DOC('d4','com artigo: junto',270,150),
  TAG('t1','1 de 2 · Pergunta e resposta'),TAG('t2','2 de 2 · Fim de frase e substantivo'),
  STAMP('s1','POR QUE · PORQUE','info'),STAMP('s2','POR QUÊ · PORQUÊ','info')],
 steps:[
  {reset:1,set:{t1:{o:1}},cap:'Na pergunta, por que vem separado e sem acento.',to:{b1:ON,d1:ON},ms:300,d:2600},
  {cap:'Na resposta, com sentido de "pois", porque vem junto.',to:{b2:ON,d2:ON},ms:300,d:2600},
  {to:{s1:ON},ms:300,d:2200},

  {reset:1,set:{t2:{o:1}},cap:'No fim da frase, antes de ponto, o quê ganha acento: por quê.',to:{b3:ON,d3:ON},ms:300,d:2600},
  {cap:'Com artigo antes, vira substantivo: o porquê, junto e com acento.',to:{b4:ON,d4:ON},ms:300,d:2600},
  {to:{s2:ON},ms:300,d:2200}],
 rule:`<h3>Regra</h3>
  <div class="tbl"><table>
   <tr><th>Forma</th><th>Quando usar</th><th>Exemplo</th></tr>
   <tr><td><b>Por que</b></td><td>Perguntas e quando equivale a "pelo qual"</td><td>Por que saiu? O motivo por que saiu.</td></tr>
   <tr><td><b>Porque</b></td><td>Explicação ou causa (= pois)</td><td>Saí porque chovia.</td></tr>
   <tr><td><b>Por quê</b></td><td>Fim de frase</td><td>Saiu por quê?</td></tr>
   <tr><td><b>Porquê</b></td><td>Substantivo (com artigo)</td><td>Não sei o porquê.</td></tr>
  </table></div>
  <div class="trap"><b>Pegadinha:</b> "por que" também aparece fora de pergunta, quando dá para trocar por "pelo qual" ou "pela qual": "Esse é o caminho por que passei".</div>`}
];
