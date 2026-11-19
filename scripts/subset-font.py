#!/usr/bin/env python3
"""Pretendard 가변 폰트를 사이트에서 쓰는 글자만 남겨 줄인다.

사용: python3 scripts/subset-font.py <원본 PretendardVariable.woff2> <출력 woff2>
(fonttools, brotli 필요: pip install fonttools brotli)
- 라틴/기호 + 완성형(KS X 1001) 한글 2,350자 + src/ 와 데이터에 실제로 쓰인 글자
- wght 축은 400~900으로 제한. 그 밖의 글자는 시스템 한글 글꼴로 대체된다.
"""
import sys, pathlib
from fontTools import subset
from fontTools.ttLib import TTFont
from fontTools.varLib import instancer

src, out = sys.argv[1], sys.argv[2]
chars = set()
for lo, hi in [(0x20, 0x7E), (0xA0, 0xFF), (0x2000, 0x206F), (0x20A9, 0x20A9), (0x2190, 0x21FF),
               (0x2460, 0x24FF), (0x25A0, 0x25FF), (0x3000, 0x303F), (0x3131, 0x318E), (0x2600, 0x26FF)]:
    chars.update(chr(c) for c in range(lo, hi + 1))
for hi_b in range(0xB0, 0xC9):
    for lo_b in range(0xA1, 0xFF):
        try: chars.add(bytes([hi_b, lo_b]).decode("euc-kr"))
        except UnicodeDecodeError: pass
for p in pathlib.Path("src").rglob("*"):
    if p.suffix in {".ts", ".tsx", ".css", ".md"}:
        chars.update(c for c in p.read_text(encoding="utf-8") if ord(c) > 0x7F)

font = TTFont(src)
opts = subset.Options()
opts.flavor = "woff2"
opts.layout_features = ["kern", "liga", "ccmp", "locl", "mark", "mkmk", "tnum", "calt"]
opts.notdef_outline = True
sub = subset.Subsetter(opts)
sub.populate(unicodes=[ord(c) for c in chars])
sub.subset(font)
if "fvar" in font:
    font = instancer.instantiateVariableFont(font, {"wght": (400, 900)})
font.flavor = "woff2"
font.save(out)
print("glyph chars:", len(chars))
