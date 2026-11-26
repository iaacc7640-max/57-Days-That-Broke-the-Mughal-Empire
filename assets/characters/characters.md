# ClearCut History — characters

**Channel narrator voice:** Kokoro-82M (local, `kokoro-onnx` v1.0 model), voice **`bm_george`**, speed 0.97
(cold open 1.0), language `en-gb`. Phonetic respellings (IPA) live in `pronunciation.json` and go only to Kokoro, never on screen.
The British voice drops a final "r", so names ending in r keep an explicit ɹ (Nadir → nˈɑːdiəɹ).

All rigs live in `assets/kit/rig.mjs` (`character(key, prefix, {pose, over})`). Flat vector, ~3.5 heads tall,
2 px ink outlines (#2B2622). Named parts per instance: `-walk`, `-body`, `-torso`, `-legL/-legR`,
`-armL-upper/-lower`, `-armR-upper/-lower`, `-head`, `-eyes` (`-eyes-open`/`-eyes-shut`), `-brows`,
`-mouth` (`-m0` closed, `-m1` small open, `-m2` wide open). Pivots are wrapper `translate()` groups; GSAP tweens the
inner `transform` attribute (see `assets/kit/anim.mjs`: `breathe`, `blink`, `talk`, `walk`, `track`).
Poses: `{armL:[upper°, lower°], armR:[upper°, lower°], headTilt}`. Silhouette: wrap in `class="sil"` (tragedy grade).
Limbs are tapered with an elbow and a knee joint (`-legL-lower`, `-legR-lower`); every arm ends in a mitten hand with a thumb,
and props held in the hand (rose, ledger, musket, scroll) are wrapped by drawn fingers. `{seated:true}` gives a seated leg
(riders: foot in the stirrup; the throne: see `seated()` in the episode lib). Scale rule: adults in one shot are the same height (±5%).

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

| `persianSoldier` | Persian musketeer (Afsharid army) | teal coat, red-and-black cap, musket | Persia teal #3E8E8A |
| `poet` | court poet | scroll in hand, green turban | cream, Mughal green |
| `courtier` | Mughal noble (recolour per shot) | turban, jama, hands clasped | Mughal green |

Animals (`assets/kit/animals.mjs`): `horse()` (head with muzzle/eye/ears, arched neck + mane, barrel, tail, four legs with knee/hock
joints and hooves; `horseWalkJS` = 4-beat walk or gallop with head nod, tail swing and body bob; a seated rider sits in the
saddle with a foot in the stirrup), `camel()` (long curved neck, one hump, knobby knees, padded feet; optional swivel gun with
recoil and flat smoke puffs; `camelWalkJS` = pacing walk), `symHorseRiderSmall` (background rider, two leg phases).
Only East India Company troops wear red coats; every other army wears its series colour.

Crowd symbols (`<use>`): Persian soldier (teal coat, gold sash, red-and-black cap, musket), Mughal soldier, musician
(drum / veena), camel with swivel gun, horse-and-rider (saffron or dark turban), citizen silhouette.
Caricature comes only from costume, age and prop — never from mocking a community.
