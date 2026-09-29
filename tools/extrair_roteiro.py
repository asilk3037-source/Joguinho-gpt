import re,json,sys
import os
JS=os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'game', 'js')
# O prólogo (encontro.js) vem antes das cenas da fazenda (cenas.js).
cenas=['']
for arq, inicio in (('encontro.js', '*encontroInicio'), ('cenas.js', 'const HISTORIA'), ('interludio.js', 'const CHEGADAS'), ('parte2.js', 'HISTORIA.parte2Abertura')):
    src=open(os.path.join(JS, arq), encoding='utf-8').read()
    if arq=='parte2.js':
        cenas+=re.split(r"\n  HISTORIA\.(\w+) = function\* \(", src[src.index(inicio)-3:])[1:]
        continue
    cenas+=re.split(r"\n    \*(\w+)\(", '\n'+src[src.index(inicio)-4:] if arq=='encontro.js' else src[src.index(inicio):])[1:]
STR=r"'((?:[^'\\]|\\.)*)'"
out={}
for i in range(1,len(cenas),2):
    nome=cenas[i]; b=cenas[i+1]
    # Template strings viram strings simples (expressões ${...} viram “…”).
    b=re.sub(r"`((?:[^`\\]|\\.)*)`", lambda m: "'"+re.sub(r'\$\{[^}]*\}','…',m.group(1)).replace("'","\\'")+"'", b)
    ev=[]
    for m in re.finditer(r"c\.fala\(\s*"+STR+r",\s*(.*?)\);\n", b, re.S):
        quem=m.group(1); resto=m.group(2)
        strs=re.findall(STR,resto)
        if not strs: continue
        rosto=None
        if 'usandoToque' in resto:
            txt=strs[-1]; tipo='tutorial'
        else:
            txt=strs[0]; rosto=strs[1] if len(strs)>1 else None; tipo='fala'
        ev.append((m.start(),tipo,quem,txt.replace("\\'","'"),rosto))
    for m in re.finditer(r"c\.titulo\(\s*"+STR+r",\s*(?:"+STR+r"|`([^`]*)`)", b):
        ev.append((m.start(),'titulo',m.group(1),(m.group(2) or m.group(3) or '').replace('${DATA}','09/05/2024'),None))
    for m in re.finditer(r"j\.dica\((.*?)\);\n", b):
        strs=re.findall(STR,m.group(1))
        if len(strs)>1: ev.append((m.start(),'dica','',strs[-1],None))
    for m in re.finditer(r"j\.balao\([^,]+,\s*"+STR, b): ev.append((m.start(),'balao','',m.group(1),None))
    for m in re.finditer(r"(?:tocar|duo)\('([A-Z_]+)'", b): ev.append((m.start(),'anim','',m.group(1),None))
    ev.sort()
    if nome in ('vilarejo', 'gruta', 'minas', 'forja'): nome = 'chegada' + nome.capitalize()
    out[nome]=[e[1:] for e in ev]
    if nome=='mago': out['mago_aleatorias']=re.findall(r"^\s+'([^']{25,})',$", b, re.M)
json.dump(out,open(sys.argv[1],'w'),ensure_ascii=False,indent=1)
for k,v in out.items(): print(k,len(v))
