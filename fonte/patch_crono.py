
a="  document.getElementById('gbar').style.width=(n/allIds.length*100)+'%';\n}"
assert a in s
s=s.replace(a,"  document.getElementById('gbar').style.width=(n/allIds.length*100)+'%';\n  if(window.__hoje)window.__hoje();\n}",1)
a="host.addEventListener('change'"
assert a in s
s=s.replace(a,"function saveMany(m){Object.assign(done,m);paint();if(!ref){local(true);return;}queue=queue.then(async()=>{try{if(exists)await ref.update({feito:m});else{await ref.set({feito:{...done}});exists=true;}statusEl.textContent='Progresso salvo.';}catch(e){statusEl.textContent='Não consegui salvar agora.';}});}\nwindow.__crono={weeks,get done(){return done},save,saveMany,START};\n"+a,1)
