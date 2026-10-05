#!/usr/bin/env python3
"""Extrai os objetos avulsos (móveis e objetos da fazenda) dos itens em HTML.

Cada item traz PNGs com transparência em <img data-name="CODIGO_LxA.png">. O objeto é recortado
no contorno (sem a margem transparente), mantido na resolução original e salvo em WEBP:
  FARMHOUSE_* → game/assets/moveis/farmhouse_*.webp   (móveis da casa)
  FARM_*      → game/assets/cenario/farm_*.webp       (objetos do terreno)
  SHOP_*      → game/assets/cenario/shop_*.webp       (peças do Minas Shopping)
  PLAYGROUND_* → game/assets/cenario/playground_*.webp (peças do Playground do primeiro encontro)
A lista vai para game/js/objetos.js (LB.OBJETOS: nome → caminho), que o catálogo de imagens lê.

Também aceita PNG avulso com o código na frente: SHOP_PILAR=caminho/imagem.png.
Quadros de animação (CODIGO_FRAME_01, _02...) são recortados com a mesma caixa, para não tremerem.

Uso: python3 tools/extrair_objetos.py [arquivos.html | CODIGO=imagem.png ...]   (sem argumento: todos os LINE_BELL_ITEM_*.html da raiz)
"""
import base64
import glob
import io
import json
import os
import re
import sys

from PIL import Image

RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SAIDA_JS = os.path.join(RAIZ, "game", "js", "objetos.js")
IMG = re.compile(r'<img[^>]*?src="data:image/png;base64,([A-Za-z0-9+/=]+)"[^>]*?data-name="([^"]+)"', re.S)


# Régua dos objetos: medida real em metros. ("a", m) = altura; ("l", m) = largura, para o que fica deitado
# ou é visto em profundidade (cama, mesa, cocho, tapete). A Line tem 1,60 m e 62 unidades de altura no mundo;
# os objetos usam 15% a mais (POR_METRO) para ficarem legíveis, como nos jogos de fazenda em pixel art.
POR_METRO = 62 / 1.60 * 1.15
MINIMO = 12   # largura mínima no mundo: nada some na tela
MEDIDAS = {
    # Casa: cozinha
    "farmhouse_fridge": ("a", 1.75), "farmhouse_stove": ("a", 1.0), "farmhouse_sink_counter": ("l", 1.9),
    "farmhouse_dining_table": ("l", 2.3), "farmhouse_kitchen_island": ("l", 1.8), "farmhouse_pantry_cabinet": ("a", 1.9),
    "farmhouse_spice_shelf": ("l", 0.9), "farmhouse_bar_stool": ("a", 0.75),
    # Sala
    "farmhouse_sofa": ("l", 2.1), "farmhouse_armchair": ("a", 0.95), "farmhouse_coffee_table": ("l", 1.3),
    "farmhouse_fireplace_off": ("l", 2.0), "farmhouse_fireplace_on": ("l", 2.0), "farmhouse_bookshelf": ("a", 1.95),
    "farmhouse_potted_plant": ("a", 0.85), "farmhouse_flower_vase": ("a", 0.35), "farmhouse_wall_clock": ("a", 0.42),
    "farmhouse_botanical_frame": ("a", 0.55), "farmhouse_hanging_lamp_off": ("a", 0.65), "farmhouse_hanging_lamp_on": ("a", 0.65),
    "farmhouse_wall_sconce_off": ("a", 0.38), "farmhouse_wall_sconce_on": ("a", 0.38),
    "farmhouse_door_closed": ("a", 2.05), "farmhouse_door_open": ("a", 2.05),
    "farmhouse_window_day": ("l", 1.15), "farmhouse_window_night": ("l", 1.15),
    # Quarto e banheiro
    "farmhouse_bed": ("l", 1.75), "farmhouse_nightstand": ("a", 0.65), "farmhouse_wardrobe": ("a", 1.95),
    "farmhouse_dresser": ("l", 1.4), "farmhouse_bathroom_mirror": ("a", 0.7), "farmhouse_toilet": ("a", 0.8),
    "farmhouse_bathroom_vanity": ("a", 1.0), "farmhouse_shower": ("a", 2.05), "farmhouse_towel_rack": ("l", 0.6),
    "farmhouse_laundry_basket": ("a", 0.55), "farmhouse_theo_bed": ("l", 0.8),
    # Fazenda: casa e quintal
    "farm_dog_house": ("a", 1.05), "farm_theo_bowl": ("l", 0.4), "farm_theo_bowl_vazia": ("l", 0.4),
    "farm_clothesline": ("l", 3.4), "farm_picnic_table": ("l", 2.0), "farm_mailbox": ("a", 1.0), "farm_doormat": ("l", 0.9),
    "farm_rocking_chair": ("a", 1.05), "farm_woodpile": ("l", 1.4), "farm_beehive_box": ("a", 1.0), "farm_bee_smoker": ("a", 0.32),
    "farm_honey_jar": ("a", 0.22), "farm_birdhouse": ("a", 1.8), "farm_birdbath": ("a", 0.9), "farm_planter_box": ("l", 1.2),
    "farm_hand_bell": ("a", 0.35), "farm_boot_rack": ("l", 0.8), "farm_rain_boots": ("a", 0.4), "farm_clothespin_basket": ("l", 0.45),
    "farm_welcome_sign": ("l", 1.4), "farm_garden_arch": ("l", 2.3), "farm_lantern_post": ("a", 1.55),
    # Horta e ferramentas
    "farm_scarecrow": ("a", 1.8), "farm_watering_can": ("l", 0.55), "farm_wheelbarrow": ("l", 1.4), "farm_shovel": ("l", 1.0),
    "farm_hoe": ("l", 1.0), "farm_tool_rack": ("l", 1.2), "farm_seed_sacks": ("l", 0.9), "farm_harvest_basket": ("l", 0.5),
    "farm_potting_bench": ("l", 1.2), "farm_garden_gloves": ("l", 0.3), "farm_seedling_tray": ("l", 0.7),
    "farm_pruning_shears": ("l", 0.3), "farm_garden_hose": ("l", 0.7), "farm_wooden_trellis": ("a", 1.8),
    "farm_pumpkin_cluster": ("l", 1.1), "farm_apple_basket": ("l", 0.5), "farm_flower_cart": ("l", 1.6), "farm_wooden_bucket": ("a", 0.38),
    # Galinheiro, celeiro e pasto
    "farm_chicken_nest": ("l", 0.8), "farm_egg_basket": ("l", 0.4), "farm_chicken_feeder": ("a", 0.5), "farm_chicken_waterer": ("a", 0.45),
    "farm_rain_barrel": ("a", 1.05), "farm_horseshoe_sign": ("l", 0.6), "farm_milk_can": ("a", 0.65), "farm_compost_bin": ("a", 0.95),
    "farm_grain_bin": ("a", 1.7), "farm_grain_scoop": ("l", 0.4), "farm_wagon_wheel": ("a", 1.0), "farm_horseshoe_set": ("l", 0.4),
    "farm_weather_vane": ("a", 1.1), "farm_feed_trough": ("l", 1.8), "farm_hay_rack": ("l", 1.6), "farm_salt_lick": ("l", 0.5),
    "farm_water_trough": ("l", 2.0), "farm_animal_feed_bucket": ("a", 0.4), "farm_milking_stool": ("a", 0.42), "farm_milking_pail": ("a", 0.38),
    "farm_saddle_stand": ("a", 1.0), "farm_saddle": ("l", 0.75), "farm_bridle": ("l", 0.6), "farm_horse_brush": ("l", 0.28),
    "farm_wool_basket": ("l", 0.6), "farm_shearing_scissors": ("l", 0.35),
    # Lago e passeio
    "farm_garden_bench": ("l", 1.5), "farm_campfire_off": ("l", 1.1), "farm_campfire_on": ("l", 1.1), "farm_reeds": ("a", 1.1),
    "farm_lily_pads": ("l", 1.4), "farm_crate": ("l", 0.6), "farm_rope_coil": ("l", 0.6), "farm_mushroom_cluster": ("l", 0.5),
    "farm_small_bridge": ("l", 3.0),
    # Minas Shopping (peças avulsas)
    # Praça de alimentação (modelo em arte/referencias/minas_shopping_praca_modelo.png): as duas lojas
    # enchem a largura da cena (163 unidades da base cada).
    "shop_praca_loja_hamburguer": ("l", 4.89), "shop_praca_loja_frango": ("l", 4.89),
    "shop_praca_mesa_redonda": ("l", 1.1), "shop_praca_canteiro_retangular": ("l", 2.6),
    "shop_praca_cadeira_madeira_front": ("a", 0.95), "shop_praca_cadeira_madeira_back": ("a", 0.95),
    "shop_praca_cadeira_madeira_left": ("a", 0.95), "shop_praca_cadeira_madeira_right": ("a", 0.95),
    # Playground do primeiro encontro
    "playground_fliperama_rosa": ("a", 1.8), "playground_fliperama_azul": ("a", 1.8),
    "playground_maquina_soco_000": ("a", 2.2), "playground_maquina_soco_038": ("a", 2.2),
    "playground_balcao_premios": ("l", 2.6), "playground_painel_premios": ("l", 4.0),
}


def larguras(lista):
    """Largura no mundo de cada objeto, pela régua (MEDIDAS) e pela proporção da imagem."""
    saida = {}
    for nome, rel in sorted(lista.items()):
        med = MEDIDAS.get(nome)
        if not med:
            continue
        w, h = Image.open(os.path.join(RAIZ, "game", rel)).size
        larg = med[1] * POR_METRO * (w / h if med[0] == "a" else 1)
        saida[nome] = max(MINIMO, round(larg, 1))
    return saida


def objetos(caminho):
    if "=" in caminho and caminho.lower().endswith(".png"):
        codigo, arq = caminho.split("=", 1)
        yield codigo.upper(), Image.open(arq).convert("RGBA")
        return
    html = open(caminho, encoding="utf-8").read()
    for b64, nome in IMG.findall(html):
        codigo = re.sub(r"(_\d+x\d+)?\.png$", "", nome)
        if codigo.startswith(("FARMHOUSE_", "FARM_", "SHOP_", "PLAYGROUND_")):
            yield codigo, Image.open(io.BytesIO(base64.b64decode(b64))).convert("RGBA")


def destino(codigo):
    pasta = "moveis" if codigo.startswith("FARMHOUSE_") else "cenario"
    return f"assets/{pasta}/{codigo.lower()}.webp"


def main():
    # --so-medidas: só recalcula as larguras (depois de mudar a régua), sem extrair de novo.
    arquivos = [] if "--so-medidas" in sys.argv else (sys.argv[1:] or sorted(glob.glob(os.path.join(RAIZ, "LINE_BELL_ITEM_*.html"))))
    lista = {}
    if os.path.exists(SAIDA_JS):
        lista = json.loads(open(SAIDA_JS, encoding="utf-8").read().split("LB.OBJETOS = ", 1)[1].split(";\n", 1)[0])
    lidos = [(caminho, codigo, im) for caminho in arquivos for codigo, im in objetos(caminho)]
    caixas = {}
    for _, codigo, im in lidos:
        caixa = im.getchannel("A").point(lambda v: 255 if v > 8 else 0).getbbox()
        grupo = re.sub(r"_FRAME_\d+$", "", codigo)
        if caixa:
            c = caixas.get(grupo, caixa)
            caixas[grupo] = (min(c[0], caixa[0]), min(c[1], caixa[1]), max(c[2], caixa[2]), max(c[3], caixa[3]))
    for caminho, codigo, im in lidos:
        caixa = caixas.get(re.sub(r"_FRAME_\d+$", "", codigo))
        if not caixa:
            print(f"  aviso: {codigo} veio vazio")
            continue
        im = im.crop(caixa)
        rel = destino(codigo)
        im.save(os.path.join(RAIZ, "game", rel), "WEBP", quality=92, method=6)
        lista[codigo.lower()] = rel
        print(f"{os.path.basename(caminho)}: {codigo} {im.size}")
    sem = sorted(n for n in lista if n not in MEDIDAS)
    if sem:
        print("  aviso: sem medida na régua:", ", ".join(sem))
    with open(SAIDA_JS, "w", encoding="utf-8") as f:
        f.write("// Gerado por tools/extrair_objetos.py. Não edite à mão.\nwindow.LB = window.LB || {};\nLB.OBJETOS = ")
        json.dump(dict(sorted(lista.items())), f, ensure_ascii=False, indent=1)
        f.write(";\n// Largura de cada objeto no mundo, pela régua (medida real × proporção da imagem).\nLB.LARGURA_OBJETOS = ")
        json.dump(larguras(lista), f, ensure_ascii=False, indent=1)
        f.write(";\n")
    print(len(lista), "objetos em", os.path.relpath(SAIDA_JS, RAIZ))


if __name__ == "__main__":
    main()
