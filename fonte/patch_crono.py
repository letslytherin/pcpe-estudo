
a="  document.getElementById('gbar').style.width=(n/allIds.length*100)+'%';\n}"
assert a in s
s=s.replace(a,"  document.getElementById('gbar').style.width=(n/allIds.length*100)+'%';\n  if(window.__hoje)window.__hoje();\n}",1)
a="host.addEventListener('change'"
assert a in s
s=s.replace(a,"function saveMany(m){Object.assign(done,m);paint();if(!ref){local(true);return;}queue=queue.then(async()=>{try{if(exists)await ref.update({feito:m});else{await ref.set({feito:{...done}});exists=true;}statusEl.textContent='Progresso salvo.';}catch(e){statusEl.textContent='Não consegui salvar agora.';}});}\nwindow.__crono={weeks,get done(){return done},save,saveMany,START};\n"+a,1)
import json as _j
_g=_j.load(open('gran_map.json',encoding='utf-8'))
a="const WEEKS="
assert a in s
s=s.replace(a,"const GRAN="+_j.dumps(_g,separators=(',',':'))+";window.__gran=GRAN;\nfunction glink(id){const u=GRAN[id];return u?`<a class=\"glink\" href=\"${u}\" target=\"_blank\" rel=\"noopener\">Questões no Gran ↗</a><span class=\"ghint\">filtre Banca: Cebraspe</span>`:'';}\nwindow.__glink=glink;\n"+a,1)
a="<span class=\"ttl\">${ttl}</span>${filt?`<div class=\"filt\">${filt}</div>`:''}</span></label>`;\n  });"
assert a in s
s=s.replace(a,"<span class=\"ttl\">${ttl}</span>${filt?`<div class=\"filt\">${filt}</div>`:''}${glink(it.id)}</span></label>`;\n  });",1)
# --- data de conclusão de cada tarefa (para o Hoje saber o que foi feito hoje) ---
def _r(a,b,cnt=1):
    global s
    assert a in s,a[:50]
    s=s.replace(a,b) if cnt==0 else s.replace(a,b,cnt)
_r("let ref=null,exists=false,queue=Promise.resolve();",
   "let ref=null,exists=false,queue=Promise.resolve(),quando={};\nfunction hojeISO(){const d=new Date();return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');}")
_r("function local(save){try{if(save)localStorage.setItem('crono-pcpe',JSON.stringify(done));else{const v=localStorage.getItem('crono-pcpe');if(v)done=JSON.parse(v)||{};}}catch(e){}}",
   "function local(save){try{if(save){localStorage.setItem('crono-pcpe',JSON.stringify(done));localStorage.setItem('crono-pcpe-quando',JSON.stringify(quando));}else{const v=localStorage.getItem('crono-pcpe');if(v)done=JSON.parse(v)||{};const q=localStorage.getItem('crono-pcpe-quando');if(q)quando=JSON.parse(q)||{};}}catch(e){}}")
_r("  done[id]=v;paint();\n  if(!ref){local(true);return;}",
   "  done[id]=v;quando[id]=v?hojeISO():'';try{localStorage.setItem('crono-pcpe-quando',JSON.stringify(quando));}catch(e){}paint();\n  if(!ref){local(true);return;}")
_r("ref.update({feito:{[id]:v}})","ref.update({feito:{[id]:v},quando:{[id]:quando[id]}})")
_r("await ref.set({feito:{...done}});","await ref.set({feito:{...done},quando:{...quando}});",0)
_r("const f=(snap.data()||{}).feito||{};done={...f};paint();",
   "const f=(snap.data()||{}).feito||{};done={...f};quando={...quando,...((snap.data()||{}).quando||{})};paint();")
_r("window.__crono={weeks,get done(){return done},","window.__crono={weeks,get done(){return done},get quando(){return quando},hojeISO,")
