"""Parse Gran discipline pages into a topic tree: list of (slug_with_id, label, ancestors_labels)."""
import re,html as H
def tree(path):
    h=open(path,encoding='utf-8',errors='ignore').read()
    tok=re.compile(r'<ul\b[^>]*>|</ul>|<a href="/questoes-de-concursos/([^"]+)"[^>]*>\s*<span[^>]*>([^<]*)</span>')
    stack=[];labels={};out=[]
    for m in tok.finditer(h):
        t=m.group(0)
        if t.startswith('<ul'):stack.append(1)
        elif t=='</ul>':
            if stack:stack.pop()
            d=len(stack);[labels.pop(k) for k in list(labels) if k>d]
        else:
            d=len(stack);lab=H.unescape(m.group(2)).strip()
            anc=[labels[k] for k in sorted(labels) if k<d]
            labels[d]=lab;[labels.pop(k) for k in list(labels) if k>d]
            out.append((m.group(1),lab,anc,d))
    seen=set();res=[]
    for x in out:
        if x[0] in seen:continue
        seen.add(x[0]);res.append(x)
    return res
if __name__=='__main__':
    import sys
    for s,l,a,d in tree(sys.argv[1])[:int(sys.argv[2]) if len(sys.argv)>2 else 40]:print(d,' > '.join(a+[l])[:150])
