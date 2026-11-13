import json,re,unicodedata,os
B='https://questoes.grancursosonline.com.br'
FILES={'Direito Constitucional':('dc.html','direito-constitucional-405199'),
 'Direito Administrativo':('direito-administrativo-404335.html','direito-administrativo-404335'),
 'Direito Penal':('direito-penal-406223.html','direito-penal-406223'),
 'Direito Processual Penal':('direito-processual-penal-406602.html','direito-processual-penal-406602'),
 'Português':('lingua-portuguesa-403587.html','lingua-portuguesa-403587'),
 'Informática':('informatica-405030.html','informatica-405030'),
 'Raciocínio Lógico':('raciocinio-logico-404257.html','raciocinio-logico-404257'),
 'Contabilidade Geral':('contabilidade-geral-104.html','contabilidade-geral-104'),
 'Estatística':('estatistica-43.html','estatistica-43'),
 'Legislação Estadual':('leg.html','legislacao-estadual-distrital-e-municipal-1211')}
STOP=set('de da do das dos e a o as os em no na nos nas para por com sem ao aos um uma sua seu lei n no art arts'.split())
def norm(t):
    t=unicodedata.normalize('NFKD',t).encode('ascii','ignore').decode().lower()
    return [w for w in re.findall(r'[a-z0-9]+',t) if w not in STOP and len(w)>1]
def stem(w):return w[:6]
Q='questoes-de-concursos/'
OV={'Princípios fundamentais':'405212','Direitos e garantias fundamentais':'405217','Direitos individuais e coletivos':'405219',
 'Organização do Estado':'405231','Segurança pública; Defesa':'405286','Administração pública (arts':'405240',
 'Lesão corporal':'406320','Furto':'406339','Estelionato':'406370','Processo administrativo':'404427','Dispensa e inexig':'408242',
 'Juizados':'406711','Crase':'403682','Concordância verbal':'409455','Sintaxe; Período composto':'419436',
 'Criptografia':'420651','Conjuntos':'404270','Números reais':'425343','Sequências':'404279',
 'Média; Mediana':'7192','Variância':'7212','Lei 6.425':'400439','Constituição do Estado':'421841',
 'Funções':'raciocinio-logico-404257','NBC':'contabilidade-geral-104','LC 137':'legislacao-estadual-distrital-e-municipal-1211'}
from gran_tree import tree
STATES='acre alagoas amapa amazonas bahia ceara distrito espirito goias maranhao mato minas para paraiba parana piaui rio rondonia roraima santa paulo sergipe tocantins'.split()
def offscope(path):
    p=' '.join(norm(path))
    if re.search(r'constituic\w* estad',p):return True
    if 'pernambuco' in p:return False
    return bool(re.search(r'constituic\w* estad|lei organica|distrito federal|municipi|estado ('+'|'.join(STATES)+')',p))
subj={};PATH={};BYID={}
for d,(f,_) in FILES.items():
    subj[d]=[]
    for slug_id,lab,anc,dep in tree(os.path.join('gran',f)):
        BYID.setdefault(slug_id.rsplit('-',1)[1],(slug_id,' > '.join(anc+[lab])))
        full=' > '.join(anc+[lab])
        if offscope(full):continue
        if d=='Legislação Estadual' and 'pernambuco' not in ' '.join(norm(full)):continue
        slug,sid=slug_id.rsplit('-',1)
        subj[d].append((slug,sid,lab,dep));PATH[slug_id]=full
weeks=json.load(open('crono_weeks.json',encoding='utf-8'))
miss=set();out={};rep=[]
for w,items in weeks.items():
    for i,x in enumerate(items):
        d=x['d'];iid='w%s-%d'%(w,i)
        if d not in FILES: miss.add(d);continue
        pref=FILES[d][1].rsplit('-',1)[0]
        best=None
        terms=[t for t in x['a'].split(';') if t.strip()]
        if d=='Legislação Estadual':terms=[t+' pernambuco' for t in terms]
        for ti,t in enumerate(terms):
            q=set(map(stem,norm(t)))
            if not q:continue
            for slug,sid,lab,dep in subj[d]:
                st=set(map(stem,norm(lab)))
                if not st:continue
                ov=len(q&st)
                if ov==0:continue
                sc=ov/len(q)-0.02*len(st-q)-0.05*ti-0.03*max(0,dep-1)
                if best is None or sc>best[0]:best=(sc,slug,sid,t)
        if best and best[0]>=0.5:
            url='%s/questoes-de-concursos/%s-%s'%(B,best[1],best[2]);rep.append((round(best[0],2),d,x['a'][:50],PATH.get(best[1]+'-'+best[2],'?')[:110]))
        else:
            url='%s/%s'%(B,FILES[d][1]);rep.append((0,d,x['a'][:50],'(disciplina)'))
        for k,v in OV.items():
            if x['a'].startswith(k):
                if v.isdigit():url=B+'/questoes-de-concursos/'+BYID[v][0];rep.append(('OV',d,x['a'][:50],BYID[v][1][:110]))
                else:url=B+'/'+v;rep.append(('OV',d,x['a'][:50],'(disciplina)'))
        out[iid]=url
json.dump(out,open('gran_map.json','w',encoding='utf-8'),ensure_ascii=False)
for r in rep:print(r)
print('miss',miss,len(out))
