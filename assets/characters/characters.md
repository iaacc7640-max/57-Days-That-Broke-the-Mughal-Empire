# ClearCut History — characters

**Channel narrator voice:** Kokoro-82M (local, `kokoro-onnx` v1.0 model), voice **`bm_george`**, speed 0.97
(cold open 1.0), language `en-gb`. Phonetic overrides are passed only to Kokoro (as IPA) — never on screen.

All rigs live in `assets/kit/rig.mjs` (`character(key, prefix, {pose, over})`). Flat vector, ~3.5 heads tall,
2 px ink outlines (#2B2622). Named parts per instance: `-walk`, `-body`, `-torso`, `-legL/-legR`,
`-armL-upper/-lower`, `-armR-upper/-lower`, `-head`, `-eyes` (`-eyes-open`/`-eyes-shut`), `-brows`,
`-mouth` (`-m0` closed, `-m1` small open, `-m2` wide open). Pivots are wrapper `translate()` groups; GSAP tweens the
inner `transform` attribute (see `assets/kit/anim.mjs`: `breathe`, `blink`, `talk`, `walk`, `track`).
Poses: `{armL:[upper°, lower°], armR:[upper°, lower°], headTilt}`. Silhouette: wrap in `class="sil"` (tragedy grade).

| Key | Name / era | Look (costume, age, signature prop) | Colours |
|---|---|---|---|
| `muhammadShah` | Muhammad Shah "Rangeela", Mughal emperor 1719–48 | 30s, flowered silk jama, plumed turban with jewel, pearls, rose in hand | cream jama, pink/green flowers, gold sash, red trousers |
| `muhammadShahSlumped` | same, after Karnal | no rose, worried brows | — |
| `nadirShah` | Nadir Shah, Shah of Persia 1736–47 | ~50, tall red-and-black lambskin cap, mail + round breastplate, gauntlets, dagger in sash, full black beard, stern brows; walk cycle | red #9E2B25, steel greys |
| `saadatKhan` | Saadat Khan, first Nawab of Awadh (1722–39) | ~60, plum jama, white beard, worried brows, hands clasped pose | plum #7A4B6B |
| `nizam` | Nizam-ul-Mulk (Asaf Jah I), Hyderabad from 1724 | ~67, white beard, green jama, arms folded pose | Hyderabad green #3F7F6A |
| `bajiRao` | Peshwa Baji Rao I (Marathas) | 37, saffron pagadi, white angarkha, moustache; rides a horse in Ep 2 | saffron #D9822B |
| `companyMerchant` | generic English East India Company merchant | black coat, tricorn, ledger | black, gold trim |
| `abdali` | Ahmad Shah Abdali (also used, recoloured, for generic nobles) | young, grey jama, short beard | Afghan slate #5B6770 |

Crowd symbols (`<use>`): Persian soldier (turquoise sash, red-and-black cap, musket), Mughal soldier, musician
(drum / veena), camel with swivel gun, horse-and-rider (saffron or dark turban), citizen silhouette.
Caricature comes only from costume, age and prop — never from mocking a community.
