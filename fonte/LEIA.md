# Como regerar

Na pasta `fonte`:

1. `python mk_all.py` junta o cronograma, as abas e as cenas de cada `*-palitinhos.html` em `estudo-pcpe.html` (a página do claude.ai).
2. `python mk_app.py` transforma `estudo-pcpe.html` no app (`../index.html`, manifest, service worker e ícones).

Cenas novas: edite o `*_scenes.js` da disciplina e rode `mk_p2.py` (ver o uso no topo do arquivo) antes do passo 1.
