import sys
from PIL import Image, ImageDraw, ImageFilter
src=Image.open('game/assets/cenario/encontro_shopping.webp').convert('RGB')
W,H=src.size; oy=1152; dy=404
def mascara(desenho):
    m=Image.new('L',(W,H),0); desenho(ImageDraw.Draw(m)); return m.filter(ImageFilter.GaussianBlur(8))
# Parte de cima (cadeiras, mesa, flores, metade de cima do tapete): piso de uma fileira acima.
cima=mascara(lambda d: (d.rectangle((440,oy+322,1010,oy+575),fill=255), d.rectangle((645,oy+298,785,oy+420),fill=255)))
# Parte de baixo (pés, metade de baixo do tapete e reflexos): piso de uma fileira abaixo.
baixo=mascara(lambda d: (d.ellipse((410,oy+470,1036,oy+680),fill=255), d.rectangle((440,oy+560,1010,oy+770),fill=255)))
up=src.transform((W,H),Image.AFFINE,(1,0,0,0,1,-dy))
dn=src.transform((W,H),Image.AFFINE,(1,0,0,0,1,dy))
res=Image.composite(dn,src,baixo)
res=Image.composite(up,res,cima)
# Canto de cima à esquerda: o piso de cima ali tem a borda do canteiro; usa o de baixo.
canto=mascara(lambda d: d.rectangle((424,oy+300,505,oy+390),fill=255))
res=Image.composite(dn,res,canto)
if sys.argv[1]: res.save(sys.argv[1], 'WEBP', quality=90, method=6)
res.crop((300,oy+150,1150,oy+800)).save(sys.argv[2])
