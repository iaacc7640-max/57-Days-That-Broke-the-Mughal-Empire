"""Episode 2 soundtrack: code-made score + SFX cue sheet + Kokoro narration, music ducked ~12 dB under voice.
Writes audio/score.wav, audio/sfx.wav, audio/mix_pre.wav (normalise afterwards with ffmpeg loudnorm)."""
import json, sys, os
import numpy as np
import soundfile as sf
from scipy import signal
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "../../../assets/audio"))
import ccaudio as A

EP = os.path.join(os.path.dirname(__file__), "..")
SR = A.SR
T = json.load(open(f"{EP}/timing.json"))
SH = {s["id"]: s for s in json.load(open(f"{EP}/shotlist.json"))["shots"]}
LN = {l["id"]: l for l in T["lines"]}
TOTAL = json.load(open(f"{EP}/shotlist.json"))["total"]
N = int(TOTAL * SR) + SR
L = lambda i: LN[i]["start"]
E = lambda i: LN[i]["start"] + LN[i]["duration"]
S = lambda i: SH[i]["start"]
Send = lambda i: SH[i]["end"]

score = np.zeros(N, np.float32)
sfx = np.zeros(N, np.float32)
cues = []


def put(buf, x, t, gain=1.0):
    p = int(max(0, t) * SR)
    x = x[: max(0, N - p)]
    buf[p:p + len(x)] += x * gain


def cue(name, x, t, db):
    cues.append({"t": round(t, 2), "sfx": name, "db": db})
    put(sfx, x, t, 10 ** (db / 20))


def db(v):
    return 10 ** (v / 20)


NOTE = lambda m: 440 * 2 ** ((m - 69) / 12)
D2, A2, D3, F3, A3 = NOTE(38), NOTE(45), NOTE(50), NOTE(53), NOTE(57)

# ---------------- score ----------------
def bed(t0, t1, freqs, gain, seed=0, bright=0.2):
    d = t1 - t0
    put(score, A.pad(freqs, d + 2, bright=bright, seed=seed), t0 - 0.5, db(gain))


def low_strings(t0, t1, notes, gain, seed=0):
    seg = (t1 - t0) / len(notes)
    for i, f in enumerate(notes):
        put(score, A.strings(f, seg + 1.5, seed=seed + i), t0 + i * seg, db(gain))


def court_music(t0, t1, gain, seed=0):
    # plucked melody on a D-major pentatonic (D E F# A B), 84 bpm, with a soft frame-drum pulse
    scale = [62, 64, 66, 69, 71, 74, 76, 78]
    r = np.random.default_rng(seed)
    beat, t, k, idx = 60 / 84, t0, 0, 2
    while t < t1:
        idx = int(np.clip(idx + r.choice([-2, -1, 1, 1, 2]), 0, len(scale) - 1))
        if k % 4 != 3:
            put(score, A.pluck(NOTE(scale[idx]), 1.0, seed=seed + k), t, db(gain))
        if k % 2 == 0:
            put(score, A.frame_drum(0.3, seed + k), t, db(gain - 6))
        t += beat / 2
        k += 1


B = T["beats"]
# cold open: tense drone + pulse
bed(0, B["B1"], [D2, A2, D3], -16, 1)
low_strings(0, B["B1"], [D2 * 2, NOTE(51)], -20, 2)
for k in range(int(B["B1"] / 0.75)):
    put(score, A.frame_drum(0.25, k), k * 0.75, db(-24))
# B1: court music under a warm D-major pad; a darker pad for the kingmakers
court_music(B["B1"], S("s12"), -20, 5)
bed(B["B1"], S("s12"), [D2, A2, NOTE(54)], -24, 6)
bed(S("s12"), S("s13"), [D2, NOTE(41), A2], -20, 7)
court_music(S("s13"), B["B2"], -22, 8)
bed(S("s13"), B["B2"], [D2, A2, NOTE(54)], -24, 9)
# B2: tension
bed(B["B2"], B["B3"], [D2, NOTE(41), NOTE(44)], -19, 10)
low_strings(B["B2"], B["B3"], [D3, NOTE(51), NOTE(49)], -22, 11)
# B3: storm gathering; court music briefly, cut off by war drums
bed(B["B3"], S("s27") + 1.4, [NOTE(36), NOTE(43), NOTE(46)], -19, 12)
court_music(S("s27"), S("s27") + 1.4, -20, 13)
put(score, A.war_drums(B["B5"] - (S("s27") + 1.4), 96, 3), S("s27") + 1.4, db(-17))
# B4: battle under drums
low_strings(B["B4"], B["B5"], [D2, NOTE(39), D2, NOTE(44)], -20, 14)
# B5: tragedy - near silence, one very low drone
bed(B["B5"], B["B6"], [NOTE(26), NOTE(33)], -30, 15, bright=0.05)
# B6: ominous
bed(B["B6"], B["B7"], [NOTE(36), NOTE(39), NOTE(43)], -21, 16)
low_strings(B["B6"], B["B7"], [NOTE(48), NOTE(51), NOTE(47)], -24, 17)
# B7: reflective
bed(B["B7"], B["B8"], [D2, A2, NOTE(53), NOTE(60)], -22, 18, bright=0.3)
low_strings(B["B7"], B["B8"], [D3, NOTE(48), NOTE(46), NOTE(45)], -25, 19)
# B8: lift toward a question, then open ending
bed(B["B8"], TOTAL - 1.5, [NOTE(34), NOTE(41), NOTE(50), NOTE(53)], -20, 20, bright=0.3)
low_strings(B["B8"], TOTAL - 1, [NOTE(46), NOTE(50), NOTE(45)], -23, 21)
# stings: unresolved, under every star line (and the cold-open question)
for t in [E("c3") - 0.6, E("b2g") - 1.2, E("b4g") - 1.2, E("b6h") - 1.2, E("b8e") - 1.4]:
    put(score, A.sting(2.4, seed=int(t)), t, db(-14))
# fade the very end
fade = int(2.0 * SR)
end = int(TOTAL * SR)
score[end - fade:end] *= np.linspace(1, 0, fade)
score[end:] = 0

# ---------------- SFX cue sheet ----------------
W = [A.whoosh(0.4, 1), A.whoosh(0.35, 2, up=False), A.whoosh(0.45, 3)]
wi = 0
def wh(t, d=-20):
    global wi
    cue("whoosh", W[wi % 3], t - 0.12, d); wi += 1
P = [A.paper(0.28, s) for s in range(3)]
pi_ = 0
def pp(t, d=-22):
    global pi_
    cue("paper slide", P[pi_ % 3], t, d); pi_ += 1
TK = [A.tick(s) for s in range(4)]
def tk(t, d=-24, k=0):
    cue("tick", TK[k % 4], t, d)
def thud(t, d=-12):
    cue("stamp thud", A.stamp_thud(int(t)), t + 0.14, d)

cue("marching feet", A.march(5.0, 1.9, 1), 0.0, -22)
wh(S("s02")); cue("cart creak", A.creak(2.6, 300, 2), S("s03") + 0.2, -24)
wh(S("s04")); cue("heavy cart creak", A.creak(1.6, 190, 3), S("s04") + 0.2, -18); cue("throne lands", A.stamp_thud(5), S("s04") + 1.1, -18)
cue("gem glint", A.coin(7), S("s05") + 0.3, -24)
wh(S("s06"), -22); cue("march", A.march(2.6, 2.2, 4), S("s06") + 0.3, -28)
for k, dt in enumerate([0.3, 0.6, 0.9, 1.3, 1.6]): tk(S("s07") + dt, -26, k)
# B1
wh(S("s09")); pp(S("s09") + 0.2)
for dt in [2.2, 4.5, 6.6, 8.6]: tk(L("b1a") + dt - 0.4, -22, int(dt))
wh(S("s10"), -24); pp(S("s10") + 0.6)
pp(L("b1c") + 0.9, -26)
thud(L("b1d") + 1.2); cue("strings snap", A.sword_ring(9) , L("b1d") + 6.2, -30); cue("puppet lands", A.stamp_thud(8), L("b1d") + 6.5, -22)
cue("crack", A.glass_crack(10)[: int(0.4 * SR)], S("s12b") + 1.0 + 1.0, -26)
wh(S("s13"), -20); pp(S("s13") + 0.2); pp(S("s14") + 0.5)
for k, dt in enumerate([0.3, 1.0, 1.7]): pp(S("s15") + dt, -26)
pp(L("b1g") + 4.2, -26); cue("crown wobble creak", A.creak(3.0, 420, 11), S("s16") + 0.5, -30)
# B2
wh(S("s17")); pp(S("s17") + 0.2); cue("wind", A.wind(7.0, 12), S("s17"), -22); pp(S("s17") + 2.2, -26)
cue("hooves", A.hooves(4.2, 2.6, 13, 4), L("b2c") + 1.2, -26); tk(L("b2c") + 5.2, -24)
cue("hooves", A.hooves(10.5, 2.4, 14, 8), S("s19"), -24); pp(S("s19") + 0.4); pp(L("b2d") + 1.0, -24); pp(L("b2d") + 5.0, -26)
pp(L("b2e") + 0.8, -26); thud(L("b2e") + 2.2); pp(L("b2d") + 3.8, -26)
cue("lamp hush", A.hush(2.0, 15), S("s21") + 0.5, -32)
# B3
wh(S("s22")); pp(S("s22") + 0.2); pp(S("s22") + 1.0); cue("sword ring", A.sword_ring(16), S("s22") + 0.6, -30)
pp(S("s23"), -22)
cue("coins", A.coins(1.6, 6, 17), S("s24") + 0.2, -26); tk(S("s24") + 1.2, -24)
cue("march", A.march(6.5, 2.2, 18), L("b3d") + 0.4, -26); tk(L("b3d") + 2.4); tk(L("b3d") + 6.6)
cue("court murmur", A.murmur(7.0, 19), S("s26"), -24); pp(S("s26") + 3.4, -26)
cue("rose falls", A.paper(0.3, 20), S("s27") + 2.3, -30); thud(L("b3f") + 4.2)
# B4
wh(S("s28")); pp(S("s28") + 0.2); pp(L("b4a") + 3.4, -26)
pp(S("s29") + 0.3); pp(S("s29") + 2.6); tk(S("s29") + 1.3)
cue("march", A.march(8.5, 2.0, 21), S("s30"), -20); pp(L("b4c") + 5.0, -26)
wh(S("s31")); pp(S("s31") + 0.4); thud(E("b4d") - 0.9)
cue("distant cannon", A.cannon_far(22), S("s32") + 0.25, -14); thud(S("s32") + 1.0, -16)
pp(L("b4f") + 3.6, -26)
cue("march far", A.march(5.0, 2.0, 23), S("s34"), -28); pp(S("s34") + 2.2, -26)
# B5 (tragedy: city silence, a distant dog, no screams)
pp(S("s35") + 0.2, -26); cue("footsteps", A.march(4.0, 1.7, 24), S("s35"), -30)
cue("whispers", A.murmur(6.0, 25, voices=6), S("s36"), -32); pp(S("s36") + 0.6, -28)
cue("crowd hush", A.hush(1.8, 26), S("s37") + 2.2, -26)
cue("dog bark (distant)", A.dog_bark(27), L("b5d") + 1.6, -26); cue("dog bark (distant)", A.dog_bark(28), L("b5d") + 5.6, -30)
pp(L("b5d") + 0.8, -28)
for k in range(3): cue("door shuts", A.lp(A.stamp_thud(30 + k), 900), S("s39") + 0.55 + k * 0.7, -20)
cue("quill scratch", A.quill(2.2, 31), S("s40") + 0.1, -24); thud(L("b5f") + 2.4)
# B6
wh(S("s41")); pp(S("s41") + 0.2); cue("chests dragged", A.creak(5.0, 160, 32), S("s41") + 1.0, -26); cue("march", A.march(7.0, 1.9, 33), S("s41"), -28)
cue("coins pouring", A.coins(3.0, 34, 34), S("s42") + 0.2, -20); pp(L("b6c") + 1.6); pp(L("b6c") + 2.4, -26)
for k, dt in enumerate([1.0, 3.3, 5.4]): pp(L("b6d") + dt, -26)
cue("gem glint", A.coin(35), L("b6d") + 3.0, -24); cue("gem glint", A.coin(36), L("b6d") + 5.0, -24)
cue("quill scratch", A.quill(2.6, 37), S("s44") + 0.1, -26); thud(S("s44") + 1.0); cue("coins taken", A.coins(1.8, 12, 38), S("s44") + 1.2, -24)
pp(S("s46") + 0.3, -26); tk(S("s46") + 1.5)
cue("crown set", A.coin(39), L("b6g") + 2.6, -24); cue("footsteps", A.march(3.0, 1.8, 40), L("b6g") + 3.4, -30); pp(L("b6g") + 4.0, -26)
cue("army marches home", A.march(2.4, 2.2, 41), S("s48") + 0.2, -26)
for dt in [3.4, 4.3, 5.3]: tk(L("b6h") + dt, -24)
# B7
wh(S("s49")); pp(S("s49") + 0.2); pp(S("s49") + 0.8); pp(S("s50"), -26); pp(S("s51"), -26)
for k in range(4): tk(S("s52") + 0.45 + k * 0.25, -26, k)
thud(L("b7e") + 0.4)
for k in range(4): tk(L("b7e") + 1.1 + k * 0.5, -24, k)
wh(S("s53"), -20); pp(S("s53") + 0.2); pp(L("b7f") + 1.0, -26)
for dt in [2.6, 3.3, 3.9]: pp(L("b7f") + dt, -28)
cue("waves", A.waves(9.0, 42), S("s54"), -24); cue("ship timber", A.creak(4.0, 140, 43), S("s54") + 2.0, -32); pp(L("b7g") + 1.6, -26)
pp(S("s55") + 0.4); pp(S("s55") + 2.4); tk(S("s55") + 4.2)
for k in range(int((Send("s55") - S("s55")) / 1.0)): tk(S("s55") + 0.5 + k, -32, k)
# B8
wh(S("s56")); pp(S("s56") + 0.2); thud(L("b8b") + 2.2); cue("glass crack", A.glass_crack(44), L("b8b") + 2.6, -20); cue("shards fall", A.glass_crack(45), L("b8b") + 3.5, -24)
cue("rivals march", A.march(3.0, 2.4, 46), L("b8c") + 5.2, -26); thud(L("b8c") + 6.4)
pp(S("s58") + 0.3); pp(L("b8d") + 4.4, -26)
cue("wind", A.wind(6.0, 47), S("s59"), -26); pp(L("b8e") + 2.4, -26)
cue("hooves far", A.hooves(2.6, 2.4, 48, 5), S("s60") + 0.1, -28); tk(S("s60") + 2.6); pp(S("s60") + 3.4, -26)

# ---------------- narration + ducking ----------------
vo24, vsr = sf.read(f"{EP}/audio/narration.wav", dtype="float32")
vo = signal.resample_poly(vo24, SR, vsr).astype(np.float32)
voice = np.zeros(N, np.float32)
voice[: min(N, len(vo))] = vo[: min(N, len(vo))]
act = np.zeros(N, np.float32)
for l in T["lines"]:
    a, b = int((l["start"] - 0.12) * SR), int((l["start"] + l["duration"] + 0.25) * SR)
    act[max(0, a):b] = 1
# smooth: attack 0.12 s, release 0.4 s
duck_gain = np.where(act > 0, db(-6), 1.0).astype(np.float32)
k_att = int(0.12 * SR)
sm = signal.lfilter([1 / k_att], [1, -(1 - 1 / k_att)], duck_gain).astype(np.float32)
sfx_duck = np.where(act > 0, db(-3), 1.0).astype(np.float32)
sfx_duck = signal.lfilter([1 / k_att], [1, -(1 - 1 / k_att)], sfx_duck).astype(np.float32)

music = score * sm * db(6)
eff = sfx * sfx_duck
mix = voice * db(-1) + music + eff
os.makedirs(f"{EP}/audio", exist_ok=True)
st = lambda x: np.stack([x, x], 1)
# slight stereo width for music/sfx (fixed small delay), voice centred
def widen(x, ms=7):
    d = int(ms / 1000 * SR)
    r = np.concatenate([np.zeros(d, np.float32), x[:-d]])
    return np.stack([x, r * 0.92 + x * 0.08], 1)
stereo = st(voice * db(-1)) + widen(music) + widen(eff, 4)
stereo = stereo[: int(TOTAL * SR)]
sf.write(f"{EP}/audio/score.wav", widen(score)[: int(TOTAL * SR)], SR)
sf.write(f"{EP}/audio/sfx.wav", widen(sfx, 4)[: int(TOTAL * SR)], SR)
sf.write(f"{EP}/audio/mix_pre.wav", stereo.astype(np.float32), SR, subtype="FLOAT")
json.dump(cues, open(f"{EP}/audio/cues.json", "w"), indent=0)
# ducking check: music level with and without voice
v_on = act[: len(music)] > 0
rms = lambda x: 20 * np.log10(np.sqrt(np.mean(x ** 2)) + 1e-9)
print("cues", len(cues), "| music rms under voice", round(rms(music[v_on]), 1), "dB, music rms in gaps", round(rms(music[~v_on]), 1), "dB | voice rms", round(rms(voice[v_on]), 1))
