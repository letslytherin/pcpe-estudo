# Executado dentro de mk_all.py depois de patch_crono.py (variável s = script do cronograma).
import json as _j2,os as _o2
_cands=[_o2.path.join(_o2.path.dirname(_o2.path.abspath('mk_all.py')),'..','podcast','index.json'),
        r'C:\Users\lela-\Desktop\Concurso-PCPE\app-pcpe\podcast\index.json']
_idx={}
for _p in _cands:
    if _o2.path.exists(_p):_idx=_j2.load(open(_p,encoding='utf-8'));break
_pod={k:{'t':v['t'],'s':v['s']} for k,v in _idx.items()}
a="window.__glink=glink;"
assert a in s
s=s.replace(a,"""const POD="""+_j2.dumps(_pod,ensure_ascii=False,separators=(',',':'))+""";window.__pod=POD;
const _glink0=glink;glink=function(id){const p=POD[id];return _glink0(id)+(p?`<button type="button" class="pbtn" data-pod="${id}">▶ Ouvir podcast (${Math.round(p.s/60)} min)</button>`:'');};
window.__glink=glink;""",1)
