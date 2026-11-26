# ClearCut History studio kit

Shared, committed kit reused by every episode (sessions start fresh, so everything lives here).

```
assets/
  kit/        code that draws the kit: rig.mjs (characters with jointed limbs and gripping hands + crowd symbols),
              animals.mjs (rigged horse, camel, small background riders; walk/gallop/pace cycles),
              sets.mjs (layered parallax sets incl. palace, Deccan fort, Persian camp),
              props.mjs (Peacock Throne whole or split for seating, Kohinoor, gauntlet gripping the gem, sarpech,
              royal umbrella/chhatra, cart, coins, chest, lamp, banner, scroll, Company ensign),
              map.mjs (anchor map: Natural Earth land via world-atlas + topojson-client + d3-geo; hand-drawn
              simplified historical polygons), ui.mjs (chip, name card, stamp, tags, cards, quote; fonts),
              anim.mjs (deterministic GSAP runtime: blink/talk/breathe/walk/crowd/camera/wipes/map draws),
              export-previews.mjs, make-anchor-states.mjs
  characters/ preview SVG per character + characters.md (narrator voice) + pronunciation.json (name respellings)
  maps/       places.json: real [lon, lat] for every map pin
  sets/       preview SVG per set (delhiGate, hall, plain, street, vault, frontier, tent, tradingPost, desk)
  ui/         grain.png (timeline-driven grain tile, used at 3.5 %)
  audio/      ccaudio.py — every score voice and sound effect, synthesised in code (no downloaded audio)
  fonts/      Bebas Neue, Inter, EB Garamond (woff2 from npm @fontsource)
  palette.json
  series/mughals/  series-colours.json, anchor-map.svg (India 1707, Mughal green), anchor-states.json,
                   thumbnail.mjs (series thumbnail template), scenes/ (peacock-throne, kohinoor, crown previews)
```

Episodes live in `episodes/epNN-<slug>/` with a `tools/` folder (narrate.py → timing.json, build.mjs →
HyperFrames project in `hf/`, mix.py → audio, captions.py, thumbs.mjs, render.sh). Renders, mp4 and wav files
are never committed (`.gitignore`).

Period symbols: Indian and Persian rulers get the sarpech, throne or royal umbrella, never a European crown.
Maps: coastlines and Persia's borders from Natural Earth (world-atlas); historical polygons hand-drawn; pins from places.json.

Rules baked in: no blur/glow/haze anywhere, hard-edged offset shadows only, grain ≤ 4 % driven by the
timeline, vignette ≤ 12 %, MAP SIMPLIFIED on every map, text ≥ 36 px.
