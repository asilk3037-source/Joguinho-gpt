import re,json,sys
src=open(__import__('os').path.join(__import__('os').path.dirname(__import__('os').path.dirname(__import__('os').path.abspath(__file__))), 'game', 'js', 'cenas.js'), encoding='utf-8').read()
corpo=src[src.index('const HISTORIA'):]
cenas=re.split(r"\n    \*(\w+)\(", corpo)
STR=r"'((?:[^'\\]|\\.)*)'"
out={}
for i in range(1,len(cenas),2):
    nome=cenas[i]; b=cenas[i+1]
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
    for m in re.finditer(r"c\.titulo\(\s*"+STR+r",\s*"+STR, b): ev.append((m.start(),'titulo',m.group(1),m.group(2),None))
    for m in re.finditer(r"j\.balao\([^,]+,\s*"+STR, b): ev.append((m.start(),'balao','',m.group(1),None))
    for m in re.finditer(r"(?:tocar|duo)\('([A-Z_]+)'", b): ev.append((m.start(),'anim','',m.group(1),None))
    ev.sort()
    out[nome]=[e[1:] for e in ev]
    if nome=='mago': out['mago_aleatorias']=re.findall(r"^\s+'([^']{25,})',$", b, re.M)
json.dump(out,open(sys.argv[1],'w'),ensure_ascii=False,indent=1)
for k,v in out.items(): print(k,len(v))
