import os,json,re,hashlib
from PIL import Image,ImageDraw,ImageFont
OUT=os.path.normpath(os.path.join(os.path.dirname(os.path.abspath(__file__)),'..'))
os.makedirs(OUT,exist_ok=True)
s=open('estudo-pcpe.html',encoding='utf-8').read()
def rep(a,b):
    global s
    assert a in s,a[:60]; s=s.replace(a,b,1)
rep('''      <details class="xmore"><summary>Como deixar esta página no celular</summary>
        <ol>
          <li>Abra este link no navegador do celular, já entrando na sua conta do claude.ai.</li>
          <li><b>Android (Chrome):</b> toque nos três pontinhos ⋮ e depois em <b>Adicionar à tela inicial</b>.</li>
          <li><b>iPhone (Safari):</b> toque em Compartilhar (o quadrado com a seta) e depois em <b>Adicionar à Tela de Início</b>.</li>
          <li>O ícone abre direto nesta aba Hoje. O que você marca aqui aparece também no computador.</li>
        </ol>
      </details>''','''      <details class="xmore"><summary>Como instalar o app no celular</summary>
        <ol>
          <li><b>Android (Chrome):</b> toque nos três pontinhos ⋮ e depois em <b>Instalar app</b> ou <b>Adicionar à tela inicial</b>.</li>
          <li><b>iPhone (Safari):</b> toque em Compartilhar (o quadrado com a seta) e depois em <b>Adicionar à Tela de Início</b>.</li>
          <li>Depois de aberto uma vez, o app funciona sem internet.</li>
          <li>O progresso fica salvo só neste aparelho. Copie o backup de vez em quando e guarde, por exemplo, numa nota.</li>
        </ol>
      </details>''')
s=s.replace("Progresso salvo só neste navegador.","Progresso salvo neste aparelho. Faça backup de vez em quando (aba Hoje).")
s=s.replace("Seu progresso fica salvo nesta página.","Seu progresso fica salvo neste aparelho.")
head='''<!doctype html>
<html lang="pt-BR">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<meta name="theme-color" content="#0E1320">
<meta name="description" content="Coach diário de estudo e TAF para Agente da PC-PE">
<link rel="manifest" href="manifest.webmanifest">
<link rel="icon" href="icon-192.png">
<link rel="apple-touch-icon" href="icon-180.png">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-title" content="PC-PE">
'''
title=re.search(r'<title>.*?</title>',s).group(0)
s=s.replace(title,'',1)
body=s
sw='''<script>if('serviceWorker' in navigator)addEventListener('load',()=>navigator.serviceWorker.register('sw.js').catch(()=>{}));</script>'''
html=head+title+'\n</head>\n<body>\n'+body+'\n'+sw+'\n</body>\n</html>\n'
open(os.path.join(OUT,'index.html'),'w',encoding='utf-8').write(html)
ver=hashlib.sha1(html.encode()).hexdigest()[:10]
open(os.path.join(OUT,'manifest.webmanifest'),'w',encoding='utf-8').write(json.dumps({
 "name":"PC-PE Estudo","short_name":"PC-PE","description":"Coach diário de estudo e TAF para Agente da PC-PE",
 "start_url":"./","scope":"./","display":"standalone","orientation":"portrait","lang":"pt-BR",
 "background_color":"#0E1320","theme_color":"#0E1320",
 "icons":[{"src":"icon-192.png","sizes":"192x192","type":"image/png"},{"src":"icon-512.png","sizes":"512x512","type":"image/png"},
          {"src":"icon-maskable-512.png","sizes":"512x512","type":"image/png","purpose":"maskable"}]},ensure_ascii=False,indent=1))
open(os.path.join(OUT,'sw.js'),'w',encoding='utf-8').write('''const CACHE='pcpe-%s';
const CORE=['./','index.html','manifest.webmanifest','icon-192.png','icon-512.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(CORE)).then(()=>self.skipWaiting()));});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));});
self.addEventListener('fetch',e=>{
  const r=e.request;if(r.method!=='GET')return;
  const u=new URL(r.url);
  if(r.mode==='navigate'){e.respondWith(fetch(r).then(res=>{const cp=res.clone();caches.open(CACHE).then(c=>c.put('index.html',cp));return res;}).catch(()=>caches.match('index.html')));return;}
  if(u.origin===location.origin||u.hostname.endsWith('fonts.googleapis.com')||u.hostname.endsWith('fonts.gstatic.com')){
    e.respondWith(caches.match(r).then(hit=>{const net=fetch(r).then(res=>{if(res.ok||res.type==='opaque'){const cp=res.clone();caches.open(CACHE).then(c=>c.put(r,cp));}return res;}).catch(()=>hit);return hit||net;}));}
});
'''%ver)
open(os.path.join(OUT,'.nojekyll'),'w').write('')
# ícones: palitinho com quepe sobre fundo azul
def icon(size,pad_frac,path,round_=True):
    S=size*4;im=Image.new('RGBA',(S,S),(0,0,0,0));d=ImageDraw.Draw(im)
    bg=(31,63,148,255)
    if round_:d.rounded_rectangle([0,0,S-1,S-1],radius=int(S*.22),fill=bg)
    else:d.rectangle([0,0,S,S],fill=bg)
    c=S/2;k=S*(1-2*pad_frac)/100;y0=S*pad_frac
    W=(255,255,255,255);lw=max(2,int(6*k))
    hx,hy,hr=c,y0+30*k,10*k
    d.ellipse([hx-hr,hy-hr,hx+hr,hy+hr],outline=W,width=lw)
    d.polygon([(hx-13*k,hy-8*k),(hx-10*k,hy-20*k),(hx+10*k,hy-20*k),(hx+13*k,hy-8*k)],fill=(147,171,245,255))
    d.line([(hx-15*k,hy-8*k),(hx+18*k,hy-8*k)],fill=(147,171,245,255),width=lw)
    d.line([(c,hy+hr),(c,y0+68*k)],fill=W,width=lw)
    d.line([(c,y0+48*k),(c-17*k,y0+60*k)],fill=W,width=lw);d.line([(c,y0+48*k),(c+17*k,y0+36*k)],fill=W,width=lw)
    d.line([(c,y0+68*k),(c-13*k,y0+92*k)],fill=W,width=lw);d.line([(c,y0+68*k),(c+13*k,y0+92*k)],fill=W,width=lw)
    d.line([(c+30*k,y0+44*k),(c+30*k,y0+92*k)],fill=(91,217,138,255),width=lw)
    d.line([(c+22*k,y0+92*k),(c+38*k,y0+92*k)],fill=(91,217,138,255),width=lw)
    im=im.resize((size,size),Image.LANCZOS);im.save(path)
icon(192,.14,os.path.join(OUT,'icon-192.png'))
icon(512,.14,os.path.join(OUT,'icon-512.png'))
icon(180,.12,os.path.join(OUT,'icon-180.png'),round_=False)
icon(512,.24,os.path.join(OUT,'icon-maskable-512.png'),round_=False)
open(os.path.join(OUT,'README.md'),'w',encoding='utf-8').write('''# PC-PE Estudo

App pessoal de estudo para Agente da Polícia Civil de Pernambuco (prova em 7/3/2027): o que estudar e treinar hoje, cronograma de 16 semanas, metas de nota, registro de simulados, treino e marcas do TAF e animações com palitinhos das 10 disciplinas.

Abra pelo GitHub Pages e instale no celular (Chrome: ⋮ → Instalar app; Safari: Compartilhar → Adicionar à Tela de Início). Funciona offline depois de aberto uma vez. O progresso fica salvo no próprio aparelho; use o backup na aba Hoje para levá-lo a outro lugar.

Os textos e cenas são material de estudo próprio. Nomes, empresas e valores nas cenas são inventados.
''')
print('ok',ver,len(html))
