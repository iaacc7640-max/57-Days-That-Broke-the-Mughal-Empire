"""ClearCut History - code-made audio kit (score voices + sound effects). No downloaded audio.
All functions return float32 mono arrays at SR unless noted. Deterministic (seeded)."""
import numpy as np
from scipy import signal

SR = 48000
_rng = np.random.default_rng(1739)


def t_(d):
    return np.arange(int(round(d * SR))) / SR


def env(n, a=0.01, r=0.2, hold=None):
    e = np.ones(n, dtype=np.float32)
    na, nr = max(1, int(a * SR)), max(1, int(r * SR))
    e[:na] = np.linspace(0, 1, na)
    if nr < n:
        e[-nr:] *= np.linspace(1, 0, nr)
    return e


def expdec(n, tau):
    return np.exp(-np.arange(n) / (tau * SR)).astype(np.float32)


def bp(x, lo, hi, order=2):
    sos = signal.butter(order, [lo, hi], btype="band", fs=SR, output="sos")
    return signal.sosfilt(sos, x).astype(np.float32)


def lp(x, f, order=2):
    sos = signal.butter(order, f, btype="low", fs=SR, output="sos")
    return signal.sosfilt(sos, x).astype(np.float32)


def hp(x, f, order=2):
    sos = signal.butter(order, f, btype="high", fs=SR, output="sos")
    return signal.sosfilt(sos, x).astype(np.float32)


def noise(d, seed=None):
    r = np.random.default_rng(seed) if seed is not None else _rng
    return r.standard_normal(int(round(d * SR))).astype(np.float32)


def norm(x, peak=0.9):
    m = np.max(np.abs(x)) + 1e-9
    return (x / m * peak).astype(np.float32)


# ---------------- score voices ----------------
def pad(freqs, d, bright=0.25, lfo=0.08, seed=0):
    t = t_(d)
    out = np.zeros_like(t, dtype=np.float32)
    for i, f in enumerate(freqs):
        for det in (-0.12, 0.0, 0.13):
            ph = (seed * 0.37 + i * 1.3 + det) % 6.28
            out += np.sin(2 * np.pi * (f * (1 + det / 100)) * t + ph) * 0.5
            out += bright * np.sin(2 * np.pi * 2 * f * t + ph) * 0.25
    out *= (0.75 + 0.25 * np.sin(2 * np.pi * lfo * t + seed)).astype(np.float32)
    return norm(lp(out, 1800), 0.5) * env(len(t), 2.0, 2.0)


def strings(f, d, vib=5.0, seed=0, harm=10):
    t = t_(d)
    v = 1 + 0.004 * np.sin(2 * np.pi * vib * t + seed)
    ph = 2 * np.pi * f * np.cumsum(v) / SR
    out = sum(np.sin(k * ph) / k for k in range(1, harm + 1)).astype(np.float32)
    return norm(lp(out, 2400), 0.45) * env(len(t), min(1.5, d / 3), min(1.5, d / 3))


def pluck(f, d=1.2, damp=0.996, seed=0):
    n = int(round(d * SR))
    p = max(2, int(SR / f))
    r = np.random.default_rng(seed)
    buf = r.uniform(-1, 1, p).astype(np.float32)
    out = np.zeros(n, dtype=np.float32)
    for i in range(n):
        out[i] = buf[i % p]
        buf[i % p] = damp * 0.5 * (buf[i % p] + buf[(i + 1) % p])
    return norm(hp(out, 120), 0.5)


def drum(f0=110, f1=48, d=0.6, click=0.3, seed=0):
    t = t_(d)
    f = f1 + (f0 - f1) * np.exp(-t / 0.05)
    body = np.sin(2 * np.pi * np.cumsum(f) / SR) * expdec(len(t), 0.18)
    c = lp(noise(d, seed), 3000) * expdec(len(t), 0.012) * click
    return norm(body + c, 0.8)


def frame_drum(d=0.3, seed=0):
    t = t_(d)
    body = np.sin(2 * np.pi * 190 * t) * expdec(len(t), 0.07)
    c = bp(noise(d, seed), 800, 4000) * expdec(len(t), 0.01) * 0.6
    return norm(body + c, 0.6)


def sting(d=2.4, root=73.4, seed=0):
    # unresolved: root, minor second and tritone cluster swelling up, cut short
    t = t_(d)
    out = sum(strings(f, d, seed=seed + i) for i, f in enumerate([root * 2, root * 2 * 2 ** (1 / 12), root * 2 * 2 ** (6 / 12), root * 4 * 2 ** (1 / 12)]))
    e = np.minimum(1, t / (d * 0.55)) ** 2
    e[int(d * 0.85 * SR):] *= np.linspace(1, 0, len(e) - int(d * 0.85 * SR))
    hit = np.zeros_like(out)
    dr = drum(90, 40, 0.8)
    s = int(d * 0.55 * SR)
    hit[s:s + len(dr)] += dr[: len(hit) - s] * 0.6
    return norm(out * e + hit, 0.8)


# ---------------- sound effects ----------------
def whoosh(d=0.4, seed=0, up=True):
    n = int(round(d * SR))
    x = noise(d, seed)
    out = np.zeros(n, dtype=np.float32)
    seg = n // 16
    for k in range(16):
        c = 400 + (3200 if up else 1600) * (k / 15 if up else 1 - k / 15)
        y = bp(x[k * seg:(k + 1) * seg + 400] if (k + 1) * seg + 400 <= n else x[k * seg:], c * 0.7, c * 1.4)
        out[k * seg:k * seg + len(y)] += y[: n - k * seg]
    e = np.sin(np.linspace(0, np.pi, n)) ** 1.5
    return norm(out * e, 0.6)


def paper(d=0.28, seed=0):
    x = hp(noise(d, seed), 1800) * env(int(round(d * SR)), 0.02, 0.18)
    x *= (0.6 + 0.4 * np.abs(np.sin(np.linspace(0, 9, len(x)))))
    return norm(x, 0.5)


def tick(seed=0):
    return norm(bp(noise(0.05, seed), 1500, 6000) * expdec(int(round(0.05 * SR)), 0.006), 0.4)


def stamp_thud(seed=0):
    d = 0.45
    t = t_(d)
    body = np.sin(2 * np.pi * np.cumsum(55 + 60 * np.exp(-t / 0.03)) / SR) * expdec(len(t), 0.09)
    c = bp(noise(d, seed), 300, 2500) * expdec(len(t), 0.02)
    return norm(body + 0.5 * c, 0.9)


def quill(d=1.4, seed=0):
    n = int(round(d * SR))
    out = np.zeros(n, dtype=np.float32)
    r = np.random.default_rng(seed)
    pos = 0
    while pos < n - 3000:
        L = int(r.uniform(0.03, 0.09) * SR)
        g = bp(noise(L / SR, int(r.integers(1e6))), 2500, 9000) * np.hanning(L).astype(np.float32)
        out[pos:pos + L] += g * r.uniform(0.4, 1)
        pos += L + int(r.uniform(0.01, 0.05) * SR)
    return norm(out, 0.35)


def coin(seed=0):
    r = np.random.default_rng(seed)
    d = 0.5
    t = t_(d)
    parts = [r.uniform(2200, 2600), r.uniform(3900, 4400), r.uniform(5600, 6300), r.uniform(7800, 8600)]
    x = sum(np.sin(2 * np.pi * f * t) * expdec(len(t), 0.05 + 0.08 * (i == 0)) / (i + 1) for i, f in enumerate(parts))
    return norm(x + 0.2 * hp(noise(d, seed), 4000) * expdec(len(t), 0.004), 0.5)


def coins(d=1.5, n=10, seed=0):
    out = np.zeros(int(round(d * SR)) + SR, dtype=np.float32)
    r = np.random.default_rng(seed)
    for k in range(n):
        p = int(r.uniform(0, d) * SR)
        c = coin(seed * 100 + k) * r.uniform(0.4, 1)
        out[p:p + len(c)] += c
    return norm(out[: int(round(d * SR)) + int(0.4 * SR)], 0.6)


def hooves(d=3.0, rate=2.6, seed=0, riders=6):
    n = int(round(d * SR))
    out = np.zeros(n + SR, dtype=np.float32)
    r = np.random.default_rng(seed)
    for h in range(riders):
        off = r.uniform(0, 1 / rate)
        t = off
        while t < d:
            for k, dt in enumerate([0, 0.07, 0.15]):
                p = int((t + dt) * SR)
                L = int(0.04 * SR)
                cl = lp(bp(noise(0.04, int(r.integers(1e6))), 200, 1600), 1200) * expdec(L, 0.01)
                out[p:p + L] += cl * r.uniform(0.5, 1) * (0.6 if k else 1)
            t += 1 / rate * r.uniform(0.95, 1.05)
    return norm(lp(out[:n], 2500), 0.6)


def march(d=3.0, rate=1.9, seed=0):
    n = int(round(d * SR))
    out = np.zeros(n + SR, dtype=np.float32)
    r = np.random.default_rng(seed)
    t = 0
    while t < d:
        for v in range(8):
            p = int((t + r.uniform(0, 0.06)) * SR)
            L = int(0.08 * SR)
            out[p:p + L] += lp(noise(0.08, int(r.integers(1e6))), 500) * expdec(L, 0.02) * r.uniform(0.3, 0.8)
        t += 1 / rate
    return norm(out[:n], 0.5)


def murmur(d=4.0, seed=0, voices=14):
    n = int(round(d * SR))
    out = np.zeros(n, dtype=np.float32)
    r = np.random.default_rng(seed)
    t = t_(d)
    for v in range(voices):
        c = r.uniform(350, 1100)
        x = bp(noise(d, int(r.integers(1e6))), c * 0.8, c * 1.25)
        am = (0.5 + 0.5 * np.sin(2 * np.pi * r.uniform(2.5, 5.5) * t + r.uniform(0, 6))) ** 2
        am *= (0.6 + 0.4 * np.sin(2 * np.pi * r.uniform(0.2, 0.6) * t + r.uniform(0, 6)))
        out += x * am
    return norm(lp(out, 2500) * env(n, 0.6, 0.6), 0.45)


def cannon_far(seed=0):
    d = 2.2
    t = t_(d)
    boom = lp(noise(d, seed), 160, 4) * expdec(len(t), 0.45)
    thump = np.sin(2 * np.pi * np.cumsum(40 + 30 * np.exp(-t / 0.05)) / SR) * expdec(len(t), 0.3)
    return norm(lp(boom * 1.5 + thump, 400), 0.8)


def sword_ring(seed=0):
    d = 1.0
    t = t_(d)
    x = sum(np.sin(2 * np.pi * f * t) * expdec(len(t), tau) * a for f, tau, a in [(1240, 0.35, 1), (2930, 0.22, 0.6), (4180, 0.15, 0.4), (6020, 0.08, 0.25)])
    return norm(x + 0.3 * hp(noise(d, seed), 3000) * expdec(len(t), 0.005), 0.35)


def creak(d=1.4, f=320, seed=0):
    t = t_(d)
    r = np.random.default_rng(seed)
    jitter = np.cumsum(r.standard_normal(len(t))) / 3000
    fr = f * (1 + 0.25 * np.sin(2 * np.pi * 0.9 * t) + 0.05 * jitter)
    ph = 2 * np.pi * np.cumsum(fr) / SR
    x = signal.sawtooth(ph).astype(np.float32) * (0.5 + 0.5 * np.abs(np.sin(2 * np.pi * 7 * t)))
    return norm(bp(x, 250, 2200) * env(len(t), 0.1, 0.3), 0.4)


def dog_bark(seed=0):
    out = np.zeros(int(1.3 * SR), dtype=np.float32)
    for k, st in enumerate([0.0, 0.42]):
        d = 0.22
        t = t_(d)
        f = 520 * np.exp(-t / 0.15) + 260
        v = signal.sawtooth(2 * np.pi * np.cumsum(f) / SR).astype(np.float32) * env(len(t), 0.01, 0.12)
        v = bp(v, 400, 1800) + 0.3 * bp(noise(d, seed + k), 600, 2000) * env(len(t), 0.005, 0.1)
        p = int(st * SR)
        out[p:p + len(v)] += v
    return norm(lp(out, 1600), 0.35)  # distant


def wind(d=6.0, seed=0):
    t = t_(d)
    x = lp(noise(d, seed), 700)
    am = 0.5 + 0.5 * np.sin(2 * np.pi * 0.18 * t) * np.sin(2 * np.pi * 0.07 * t + 1)
    return norm(x * am * env(len(t), 1.0, 1.0), 0.4)


def waves(d=8.0, seed=0):
    t = t_(d)
    x = lp(noise(d, seed), 900)
    am = (0.35 + 0.65 * (0.5 + 0.5 * np.sin(2 * np.pi * 0.16 * t))) ** 2
    return norm(x * am * env(len(t), 1.0, 1.0), 0.4)


def glass_crack(seed=0):
    d = 1.4
    t = t_(d)
    crack = hp(noise(d, seed), 2000) * expdec(len(t), 0.02)
    r = np.random.default_rng(seed)
    tink = np.zeros_like(crack)
    for k in range(9):
        p = int(r.uniform(0.15, 1.1) * SR)
        L = int(0.25 * SR)
        f = r.uniform(3000, 7000)
        tt = np.arange(L) / SR
        tink[p:p + L] += np.sin(2 * np.pi * f * tt) * expdec(L, 0.05) * 0.3
    return norm(crack + tink, 0.5)


def hush(d=1.6, seed=0):
    x = bp(noise(d, seed), 2500, 7000) * env(int(round(d * SR)), 0.4, 1.0)
    return norm(x, 0.25)


def war_drums(d=6.0, bpm=96, seed=0):
    n = int(round(d * SR))
    out = np.zeros(n + SR, dtype=np.float32)
    beat = 60 / bpm
    pattern = [1, 0, 0.6, 0, 1, 0.5, 0.6, 0]
    k = 0
    t = 0.0
    while t < d:
        a = pattern[k % 8]
        if a:
            dr = drum(120, 50, 0.6, seed=seed + k) * a
            p = int(t * SR)
            out[p:p + len(dr)] += dr
        if k % 2:
            fd = frame_drum(0.3, seed + k) * 0.35
            p = int(t * SR)
            out[p:p + len(fd)] += fd
        t += beat / 2
        k += 1
    return norm(out[:n], 0.8)
