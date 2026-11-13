
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
