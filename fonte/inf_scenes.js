const STAMP=(id,text,kind,y)=>({id,t:'stamp',text,kind,x:180,y:y||46});
const TAG=(id,text)=>({id,t:'tag',text,x:12,y:22});
const DOC=(id,text,x,y)=>({id,t:'doc',text,x,y,st:{o:0}});
const SCR=(id,lines,x,y,extra)=>Object.assign({id,t:'screen',lines,x,y,st:{o:0}},extra||{});
const PC=(id,lines,x,on)=>({id,t:'screen',lines,x,y:122,w:76,stand:58,st:{o:on?1:0}});
const ON={o:1,s:1}, OFF={o:0};
const SCENES=[
{id:'malwares',nav:'Vírus, worm, ransomware',art:'Segurança da informação',title:'Vírus, worm e ransomware',
 lead:'Três computadores numa rede. Cada praga age de um jeito.',
 actors:[
  {id:'net',t:'net',x1:118,x2:310,y:174},
  PC('pc1',['PC 1','arquivos ok'],118,1),PC('pc2',['PC 2','arquivos ok'],214,1),PC('pc3',['PC 3','arquivos ok'],310,1),
  PC('pc1r',['BLOQUEADO!','Pague resgate'],118,0),
  {id:'bug',t:'bug',x:118,y:112,st:{o:0}},
  {id:'bug2',t:'bug',x:214,y:112,st:{o:0}},
  {id:'bia',t:'fig',label:'Bia',st:{x:42}},
  DOC('arq','jogo_gratis.exe',118,70),DOC('bkp','BACKUP FORA DA REDE',118,70),
  TAG('t1','1 de 3 · Vírus'),TAG('t2','2 de 3 · Worm'),TAG('t3','3 de 3 · Ransomware'),
  STAMP('s1','VÍRUS: PRECISA SER EXECUTADO','no'),STAMP('s2','WORM: SE ESPALHA SOZINHO','no'),STAMP('s3','RANSOMWARE: BACKUP SALVA','ok')],
 steps:[
  {reset:1,set:{t1:{o:1}},cap:'Bia baixa um arquivo que parece um jogo grátis. Dentro dele há um vírus.',to:{arq:ON},ms:400,d:2200},
  {cap:'Nada acontece até ela abrir o arquivo.',to:{bia:{aF:-90}},ms:300,d:1800},
  {cap:'Ao ser executado, o vírus se copia para outros arquivos do computador.',to:{arq:OFF,bug:ON,bia:{aF:-12}},ms:400,d:2200},
  {to:{s1:ON},ms:300,d:2600},

  {reset:1,set:{t2:{o:1},bug:{o:1}},cap:'O PC 1 está infectado por um worm. Bia nem encosta no computador.',d:2200},
  {cap:'O worm usa falhas da rede e pula sozinho para o PC 2...',set:{bug2:{o:1,x:118}},to:{bug2:{x:214}},ms:1200,d:1400},
  {cap:'...e depois para o PC 3, consumindo a rede.',to:{bug2:{x:310}},ms:1200,d:1400},
  {cap:'O worm não precisa de hospedeiro nem de alguém que o execute.',to:{s2:ON},ms:300,d:2600},

  {reset:1,set:{t3:{o:1}},cap:'Um ransomware criptografa os arquivos do PC 1 e pede resgate.',to:{pc1r:ON,pc1:OFF},ms:500,d:2400},
  {cap:'Bia não paga. Ela restaura tudo de um backup guardado fora da rede.',to:{bkp:ON,bia:{aF:-90}},ms:400,d:2200},
  {to:{pc1r:OFF,pc1:ON,bkp:OFF,bia:{aF:-12}},ms:600,d:900},
  {cap:'Backup atualizado e desconectado é a melhor defesa contra ransomware.',to:{s3:ON},ms:300,d:2600}],
 rule:`<h3>Regra</h3>
  <div class="tbl"><table>
   <tr><th>Praga</th><th>Marca registrada</th></tr>
   <tr><td><b>Vírus</b></td><td>Precisa de hospedeiro e de ser executado</td></tr>
   <tr><td><b>Worm</b></td><td>Propaga-se sozinho pela rede, sem hospedeiro nem ação do usuário</td></tr>
   <tr><td><b>Cavalo de Troia</b></td><td>Parece útil, mas faz coisas escondidas; em regra não se replica</td></tr>
   <tr><td><b>Bot</b></td><td>Máquina controlada a distância; várias formam uma botnet</td></tr>
   <tr><td><b>Ransomware</b></td><td>Criptografa os dados e exige resgate</td></tr>
  </table></div>
  <div class="trap"><b>Pegadinha:</b> "o worm precisa ser executado pelo usuário" está errado; isso é o vírus. E firewall não é antivírus: filtra o tráfego, mas não remove vírus de arquivos.</div>`},

{id:'phishing-pharming',nav:'Phishing × pharming',art:'Golpes na internet',title:'Phishing × pharming',
 lead:'Dois golpes que terminam no mesmo site falso. O caminho é que muda.',
 actors:[
  {id:'bia',t:'fig',label:'Bia',st:{x:42}},
  {id:'gol',t:'fig',label:'Golpista',perp:1,st:{x:322,f:-1}},
  SCR('e1',['E-mail de "Seu Banco"','Atualize seus dados em:','seubanco-seguro.xyz'],180,96,{w:178}),
  SCR('e2',['Você digitou:','www.seubanco.com.br'],180,96,{w:178}),
  SCR('fake',['SITE FALSO (cópia)','Agência: ____','Senha: ____'],180,96,{w:178}),
  DOC('dns','DNS ENVENENADO',180,150),DOC('roubo','DADOS ROUBADOS',290,62),
  TAG('t1','1 de 2 · Phishing'),TAG('t2','2 de 2 · Pharming'),
  STAMP('s1','PHISHING','no'),STAMP('s2','PHARMING','no')],
 steps:[
  {reset:1,set:{t1:{o:1}},cap:'Bia recebe um e-mail que imita o banco dela, com um link estranho.',to:{e1:ON},ms:400,d:2400},
  {cap:'Ela clica no link...',to:{bia:{aF:-90}},ms:300,d:1200},
  {cap:'...e cai numa cópia do site do banco, onde digita os dados.',to:{e1:OFF,fake:ON,bia:{aF:-12}},ms:500,d:2000},
  {to:{roubo:ON,gol:{aF:-150}},ms:400,d:1600},
  {cap:'Mensagem falsa que se passa por instituição para roubar dados: phishing.',to:{s1:ON,roubo:OFF,gol:{aF:-12}},ms:300,d:2600},

  {reset:1,set:{t2:{o:1}},cap:'Agora Bia digita o endereço certo do banco, sem clicar em link nenhum.',to:{e2:ON,bia:{aF:-80}},ms:400,d:2400},
  {cap:'Mas o servidor de nomes (DNS) foi envenenado e a manda para o endereço errado.',to:{dns:ON,bia:{aF:-12}},ms:400,d:2400},
  {to:{e2:OFF,fake:ON},ms:500,d:900},
  {to:{roubo:ON,gol:{aF:-150}},ms:400,d:1500},
  {cap:'No pharming, o endereço digitado é o correto. O golpe está no DNS.',to:{s2:ON,roubo:OFF,dns:OFF,gol:{aF:-12}},ms:300,d:2600}],
 rule:`<h3>Regra</h3>
  <ul>
   <li><b>Phishing:</b> mensagem falsa (e-mail, site) que imita uma instituição para roubar dados. Variações: <b>spear phishing</b> (alvo específico), <b>smishing</b> (SMS) e <b>vishing</b> (ligação).</li>
   <li><b>Pharming:</b> envenena o DNS; a pessoa digita o endereço certo e é levada a um site falso.</li>
   <li><b>Spoofing:</b> forjar o remetente de um e-mail.</li>
  </ul>
  <div class="trap"><b>Pegadinha:</b> a banca descreve o pharming e chama de phishing, ou o contrário. A pista é o endereço: digitou certo e caiu no falso? Pharming.</div>`},

{id:'keylogger',nav:'Keylogger × screenlogger',art:'Spywares',title:'Keylogger × screenlogger',
 lead:'Dois espiões escondidos no computador de Bia.',
 actors:[
  {id:'bia',t:'fig',label:'Bia',st:{x:42}},
  {id:'kb',t:'keyboard',x:108,y:162},
  SCR('l1',['Login do banco','Senha: ••••••••'],200,96,{w:150}),
  SCR('l2',['Teclado virtual','[1][2][3][4][5]','[6][7][8][9][0]'],200,96,{w:150}),
  DOC('k1','KEYLOGGER: g a t o 2 0 2 6',240,150),DOC('k2','KEYLOGGER: nada capturado',240,150),
  DOC('sc','SCREENLOGGER: tela + cliques',240,62),
  TAG('t1','1 de 2 · Teclado físico'),TAG('t2','2 de 2 · Teclado virtual'),
  STAMP('s1','KEYLOGGER','no'),STAMP('s2','SCREENLOGGER','no')],
 steps:[
  {reset:1,set:{t1:{o:1}},cap:'Bia digita a senha do banco no teclado.',to:{l1:ON,bia:{aF:-60}},ms:300,d:400},
  {to:{bia:{aF:-75}},ms:200,d:250},{to:{bia:{aF:-60}},ms:200,d:250},{to:{bia:{aF:-75}},ms:200,d:250},
  {cap:'Um keylogger grava cada tecla pressionada e envia ao invasor.',to:{k1:ON,bia:{aF:-12}},ms:400,d:2400},
  {to:{s1:ON},ms:300,d:2400},

  {reset:1,set:{t2:{o:1}},cap:'Desta vez, o banco pede a senha num teclado virtual, clicando com o mouse.',to:{l2:ON,bia:{aF:-90}},ms:400,d:2200},
  {cap:'O keylogger não pega nada, porque nenhuma tecla foi pressionada.',to:{k2:ON},ms:400,d:2200},
  {cap:'Mas o screenlogger grava a tela e a posição de cada clique.',to:{sc:ON},ms:400,d:2200},
  {cap:'O screenlogger foi feito justamente para vencer o teclado virtual.',to:{sc:OFF,s2:ON,bia:{aF:-12}},ms:300,d:2600}],
 rule:`<h3>Regra</h3>
  <div class="tbl"><table>
   <tr><th>Spyware</th><th>O que grava</th><th>Teclado virtual protege?</th></tr>
   <tr><td><b>Keylogger</b></td><td>As teclas digitadas</td><td>Sim</td></tr>
   <tr><td><b>Screenlogger</b></td><td>A tela e a posição dos cliques</td><td>Não</td></tr>
  </table></div>
  <div class="trap"><b>Pegadinha:</b> spyware é o gênero; keylogger, screenlogger e adware são espécies. A autenticação em dois fatores (algo que você sabe, tem ou é) reduz o estrago mesmo se a senha vazar.</div>`},

{id:'criptografia',nav:'Criptografia',art:'Criptografia assimétrica',title:'Chave pública, chave privada',
 lead:'Cada pessoa tem um par de chaves: a pública, que todos veem, e a privada, só dela.',
 actors:[
  {id:'ana',t:'fig',label:'Ana',st:{x:46}},
  {id:'beto',t:'fig',label:'Beto',st:{x:314,f:-1}},
  {id:'cur',t:'fig',label:'Curioso',perp:1,st:{x:200,f:-1,o:0}},
  {id:'env',t:'envelope',x:90,y:120,st:{o:0}},
  {id:'lock',t:'lock',x:90,y:106,st:{o:0}},
  {id:'seal',t:'seal',x:100,y:126,st:{o:0}},
  DOC('k1','cifra com: PÚBLICA DO BETO',120,74),DOC('k2','abre com: PRIVADA DO BETO',240,152),
  DOC('k3','assina com: PRIVADA DA ANA',120,74),DOC('k4','confere com: PÚBLICA DA ANA',220,152),
  TAG('t1','1 de 2 · Sigilo'),TAG('t2','2 de 2 · Assinatura'),
  STAMP('s1','SIGILO','ok'),STAMP('s2','ASSINATURA: SEM SIGILO','info')],
 steps:[
  {reset:1,set:{t1:{o:1}},cap:'Ana quer mandar uma mensagem que só Beto consiga ler.',to:{env:ON},ms:400,d:2000},
  {cap:'Ela tranca a mensagem com a chave pública de Beto, que ele divulga para todos.',to:{k1:ON,lock:ON},ms:400,d:2400},
  {to:{k1:OFF,env:{x:270},lock:{x:270}},ms:1200,d:1300},
  {cap:'Só a chave privada de Beto abre a mensagem.',to:{k2:ON},ms:400,d:1200},
  {to:{lock:OFF},ms:400,d:1400},
  {cap:'Para sigilo, cifra-se com a pública do destinatário e decifra-se com a privada dele.',to:{k2:OFF,s1:ON},ms:300,d:2800},

  {reset:1,set:{t2:{o:1}},cap:'Agora Ana quer provar que foi ela quem escreveu a mensagem.',to:{env:ON},ms:400,d:2000},
  {cap:'Ela assina com a própria chave privada.',to:{k3:ON,seal:ON},ms:400,d:2000},
  {to:{k3:OFF,env:{x:200},seal:{x:210},cur:{o:1,x:214}},ms:1100,d:1200},
  {cap:'Qualquer um, até um curioso, confere a assinatura com a chave pública de Ana e lê a mensagem.',to:{k4:ON,cur:{aF:-90}},ms:400,d:2600},
  {cap:'A assinatura garante autoria, integridade e não repúdio, mas não sigilo.',to:{k4:OFF,cur:{aF:-12},s2:ON},ms:300,d:2800}],
 rule:`<h3>Regra</h3>
  <div class="tbl"><table>
   <tr><th>Objetivo</th><th>Quem cifra, com qual chave</th><th>Quem decifra, com qual chave</th></tr>
   <tr><td><b>Sigilo</b></td><td>Remetente, com a <b>pública do destinatário</b></td><td>Destinatário, com a <b>sua privada</b></td></tr>
   <tr><td><b>Assinatura</b></td><td>Remetente, com a <b>sua privada</b></td><td>Qualquer um, com a <b>pública do remetente</b></td></tr>
  </table></div>
  <div class="trap"><b>Pegadinha:</b> a chave privada nunca vai no certificado digital. Assinatura digital (criptográfica) não é assinatura digitalizada (imagem escaneada). Simétrica usa uma chave só (AES); assimétrica usa o par (RSA).</div>`},

{id:'backup',nav:'Backup',art:'Tipos de backup',title:'Backup incremental × diferencial',
 lead:'Backup completo no domingo. O que muda nos outros dias?',
 ground:[],
 actors:[
  {id:'days',t:'days'},
  {id:'c0',t:'blk',x:70,h:70,text:'COMPLETO',kind:'full',st:{o:0}},
  {id:'i1',t:'blk',x:130,h:18,text:'seg',st:{o:0}},{id:'i2',t:'blk',x:190,h:18,text:'ter',st:{o:0}},{id:'i3',t:'blk',x:250,h:18,text:'qua',st:{o:0}},
  {id:'d1',t:'blk',x:130,h:18,text:'seg',st:{o:0}},{id:'d2',t:'blk',x:190,h:36,text:'seg+ter',st:{o:0}},{id:'d3',t:'blk',x:250,h:54,text:'seg+ter+qua',st:{o:0}},
  {id:'hc',t:'hl',x:70,h:70,st:{o:0}},{id:'h1',t:'hl',x:130,h:18,st:{o:0}},{id:'h2',t:'hl',x:190,h:18,st:{o:0}},{id:'h3',t:'hl',x:250,h:18,st:{o:0}},
  {id:'hd3',t:'hl',x:250,h:54,st:{o:0}},
  DOC('crash','QUINTA: O DISCO QUEBROU',290,74),
  TAG('t1','1 de 2 · Incremental'),TAG('t2','2 de 2 · Diferencial'),
  STAMP('s1','INCREMENTAL: TODOS','info'),STAMP('s2','DIFERENCIAL: SÓ O ÚLTIMO','info')],
 steps:[
  {reset:1,set:{t1:{o:1}},cap:'Domingo: backup completo de tudo.',to:{c0:ON},ms:500,d:1800},
  {cap:'O incremental copia só o que mudou desde o último backup, de qualquer tipo.',to:{i1:ON},ms:400,d:1000},
  {to:{i2:ON},ms:400,d:900},{to:{i3:ON},ms:400,d:1600},
  {cap:'Na quinta, o disco quebra. Para restaurar, é preciso o completo e todos os incrementais.',to:{crash:ON},ms:400,d:900},
  {to:{hc:ON,h1:ON,h2:ON,h3:ON},ms:600,d:1800},
  {cap:'Cada backup é pequeno e rápido, mas a restauração dá mais trabalho.',to:{crash:OFF,s1:ON},ms:300,d:2600},

  {reset:1,set:{t2:{o:1}},cap:'Domingo: backup completo de novo.',to:{c0:ON},ms:500,d:1800},
  {cap:'O diferencial copia tudo o que mudou desde o último completo. Ele cresce a cada dia.',to:{d1:ON},ms:400,d:1000},
  {to:{d2:ON},ms:400,d:900},{to:{d3:ON},ms:400,d:1600},
  {cap:'Na quinta, o disco quebra. Basta o completo e o último diferencial.',to:{crash:ON},ms:400,d:900},
  {to:{hc:ON,hd3:ON},ms:600,d:1800},
  {cap:'O diferencial não marca os arquivos como copiados; por isso acumula.',to:{crash:OFF,s2:ON},ms:300,d:2600}],
 rule:`<h3>Regra</h3>
  <div class="tbl"><table>
   <tr><th>Tipo</th><th>Copia</th><th>Marca como copiado?</th><th>Para restaurar</th></tr>
   <tr><td><b>Completo</b></td><td>Tudo o que foi selecionado</td><td>Sim</td><td>Só o último completo</td></tr>
   <tr><td><b>Incremental</b></td><td>O que mudou desde o último backup de qualquer tipo</td><td>Sim</td><td>Completo + todos os incrementais seguintes</td></tr>
   <tr><td><b>Diferencial</b></td><td>O que mudou desde o último completo</td><td>Não</td><td>Completo + o último diferencial</td></tr>
  </table></div>
  <div class="trap"><b>Pegadinha:</b> a banca troca "desde o último backup" (incremental) por "desde o último completo" (diferencial). Os backups de cópia e diário não marcam os arquivos e não interferem na rotina.</div>`}
];
