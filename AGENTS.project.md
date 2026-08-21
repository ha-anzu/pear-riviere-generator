# Rivière Pattern Suite — development spec

This is the source of truth for continuing the pack. Read this before changing any of the three generators or the OpenTools hub.

Hani (GitHub `ha-anzu`, Hanzu Tech). Shop-floor jewelry CAD + manufacturing tools. Do not rebuild from scratch. Do not invent a different convertible model.

---

## Product

One suite, three silhouettes, one visual language.

| Style | App | Live URL on hanzutech.com | Vercel app (iframed) |
| --- | --- | --- | --- |
| Round tennis necklace (convertible) | `light-spring-sail-bamboo` | `/opentools/tennis-necklace-generator/` | `https://light-spring-sail-bamboo.vercel.app/` |
| Round diamond bracelet | `round-diamond-bracelet-generator` | `/opentools/round-diamond-bracelet-generator/` | hosted from that repo |
| Pear rivière (convertible) | `pear-riviere-generator` | `/opentools/pear-riviere-generator/` | `https://pear-riviere-generator.vercel.app/` |

Hub: `/opentools/riviere-pattern-suite/`

OpenTools main page lists **only the suite**, not the three tools as separate cards. Users pick a style from the hub or the in-app suite menu.

Local workspace:

```
C:\Users\ADMIN\OneDrive\Hanzu.Dev\Hanzu Tech OU\Repo\
  hanzutech.com\
  light-spring-sail-bamboo\
  round-diamond-bracelet-generator\
  pear-riviere-generator\
```

`hanzutech.com` is Next.js `output: "export"`. The file that actually serves OpenTools is **`public/opentools/`**. Always write that path. Keep the root `opentools/` copy in sync. A first push to root `opentools/` 404s because Next serves `public/opentools/`.

Custom domain = GitHub Pages. Vercel project `prj_3GmqthhrJIoTVZABzBIIl7JSSsHD`, team `team_LAA1vYNhAbwexyDSFH8WO4QH`.

---

## Uniform chrome (all three tools)

Must look like the same product.

- Dual theme: `html[data-theme="atelier"|"cyber"]`, localStorage key per app. Atelier default for necklace/pear (Rivière, Cormorant + Outfit, velvet gold). Cyber is HANZU TECH (IBM Plex, red/yellow).
- Header: atelier wordmark **Rivière**, cyber **HANZU TECH**, plus a style subtitle (`Round necklace` / `Round bracelet` / `Pear rivière`).
- Suite menu on every tool: Pattern suite · Round necklace · Round bracelet · Pear rivière. Links use `https://hanzutech.com/opentools/...` with `target="_top"` so they escape the iframe.
- Buttons `h-11`, tap ≥ 44px. No emoji icons. lucide-react on TanStack apps. Tokens from each app’s CSS — no raw hex in new JSX except gem/metal fills that already live in the color tables.
- Color studio: same 15 gem keys, same this-stone / mirror-pair / all scopes.
- Metal setting color: yellow / white / rose.
- Local-first history, JSON + HD export, manufacturing sheet / BOM.

Do not mix atelier velvet tokens into cyber neon, or the reverse.

---

## Shared gem color studio

Keys are stable (saved projects). **Labels are gemstone names**, not generic hues.

| key | label | fill |
| --- | --- | --- |
| colorless | White diamond | `#eefcff` |
| black | Black diamond | `#141820` |
| green | Emerald | `#20a66a` |
| red | Ruby | `#d62f4b` |
| blue | Blue sapphire | `#2c74da` |
| purple | Amethyst | `#8350c7` |
| orange | Orange sapphire | `#e97224` |
| champagne | Champagne diamond | `#c9a66b` |
| brown | Cognac diamond | `#754b35` |
| light_canary | Canary diamond | `#f1df6c` |
| yellow | Yellow sapphire | `#e8bd20` |
| turquoise | Turquoise | `#24bfc1` |
| malachite | Malachite | `#087f5b` |
| pink | Pink sapphire | `#e873a7` |
| teal | Paraiba | `#168d91` |

Files:

- `light-spring-sail-bamboo/src/lib/necklace/gem-colors.ts`
- `pear-riviere-generator/src/lib/necklace/gem-colors.ts`
- `round-diamond-bracelet-generator/bracelet-engine.js` (`GEM_COLORS`)

Keep the three tables identical. Paint applies to selected stone, its palindrome pair, or the full run. Colors travel in JSON, BOM, and JPG.

This is **not** GIA D–Z. Setting metal is a separate control.

---

## Convertible manufacturing logic (necklace + pear)

Finished length `L` (14–18″) **includes 2 converters + 2 locks**.

Split:

- Back bracelet `B ∈ {6, 6.5, 7}` inches. Finished bracelet **includes lock 1**.
- Front necklace `N = L − B`. Finished front **includes lock 2 + both converters**.
- Example: 16″ → 7″ bracelet + 9″ front.

Bracelet (back):

- ALL single size = smallest end of the pattern (`d_min`).
- `n_b = floor(B_mm / pitch) − 3` where pitch = stone occupancy + gap, hardware = lock 1 = 3 stations.
- Closed loop = lock1-f(2) + bracelet run(n_b) + lock1-m(1).

Necklace (front):

- Graduation only on the front. Largest at 6 o’clock. Smallest toward both converters.
- Necklace hardware = 5 stations: lock 2 (3) + 2 converters (1 each).
- Range mode: pack necklace run into `N_mm − 5·pitch`.
- List mode: the size list is **FRONT STRAND ONLY**. Bracelet auto-fills in smallest list size. Locks + converters are extra stations in `d_min`, stones ON TOP of findings (they count in BOM).

Locks:

- Both locks same SKU, same size as bracelet stones.
- Concealed spring lock, 3 stone-lengths, stones on the lock.
- Split cover: female box = 2 stones, male tongue = 1 stone.
- Necklace opens from TWO sides around the shoulder line.

Converters:

- One stone-sized piece. Dual hinge: necklace joint + bracelet joint. 2 pcs.

**OLD clasp math is dead.** Do not use “3 × smallest as empty clasp stations”. `claspMm` still exists on `PatternResult` as `lockMm*2` for compatibility — do not use it as empty gap in the ring.

### Assembly chain (clockwise)

`lock1-f(2) → bracelet(n_b) → lock1-m(1) → lock2-f(2) → conv-l(1) → necklace run → conv-r(1) → lock2-m(1) → close.`

Necklace worn as one loop ≈ L:

- Left shoulder: male 2 → female 1 (M2 + F1 = 3-stone lock look)
- Right shoulder: male 1 → female 2 (M1 + F2 = 3-stone lock look)

Bracelet mode: disconnect converters, close lock 1 on itself (F1 ← M1).

Assembly steps 1–9 live in `engine.assembly`.

### Length math

`MM_PER_INCH = 25.4`

Closed-loop span: every station carries one gap including wrap.

Round stones: occupancy = diameter.  
Pears: occupancy = **width** (tips point radially out, so length does not consume the circumference).

Fit labels:

- leftover < −2.5 mm → `long`
- leftover > 4 mm → `short`
- else `ok`

`autoGapFromList`: iterate `gap = (L_mm − sum(occupancy)) / n_stones`, clamp 0.05–1.5. May fall outside shop 0.2–0.5 (`gapOutOfRange`).

Round carat: production round-brilliant chart in necklace `engine.ts` (d³ interpolated). Not old HTML `D³×0.0061` except the bracelet repo still uses that formula for round melee.

Gold round grid 1.5–11 mm step 0.1. Silver 3.5–12 mm step 0.5. Gap shop 0.2–0.5.

Constants: `LOCK_STONES=3`, `LOCK_FEMALE=2`, `LOCK_MALE=1`, `CONVERTER_STONES=1`.

---

## Round necklace specifics

Repo: `light-spring-sail-bamboo` (TanStack Start + React 19 + Tailwind v4 + zustand).

Key files:

- `src/lib/necklace/engine.ts` — stations, BOM, findings, assembly
- `src/lib/necklace/store.ts` — `braceletIn`, compute, presets
- `src/lib/necklace/gem-colors.ts`
- `src/components/necklace-ring.tsx` — station layout, BACK/L/FRONT/R
- `src/components/manufacturing-sheet.tsx`
- `src/components/color-studio.tsx`
- `src/components/suite-menu.tsx`

Ring layout **from `result.stations`**, not empty clasp gap.

Bracelet segment (F1+bracelet+M1) centered at 12 o’clock:

`startAng = −π/2 − mmToAngle(braceletMm)/2`

Default seed: gold, 16″, back bracelet 7″ (front 9″), 2.5 mm single size, gap 0.28 mm, yellow gold.

Examples RN / RR are FRONT lists. Bracelet auto-fills in smallest.

---

## Round bracelet specifics

Repo: `round-diamond-bracelet-generator` (Vite + React). Lengths 6, 6.25, 6.5, 7, 7.5, 8 inches. Palindromic graduation. Physical spacing. Color studio already first-class.

Keep it visually in the same family: cyber/atelier themes, suite menu, gemstone color names, manufacturing sheet.

---

## Pear rivière specifics

Repo: `pear-riviere-generator`. Same convertible station model as the round necklace.

### Catalog (length × width mm)

Only these SKUs. No free ratio slider. List dropdowns and min/max pickers are catalog-only.

| L × W | ct |
| --- | --- |
| 5 × 3 | 0.25 |
| 5 × 4 | 0.35 |
| 6 × 4 | 0.50 |
| 6.5 × 4.5 | 0.60 |
| 7 × 5 | 0.75 |
| 7.5 × 5.5 | 0.85 |
| 7.7 × 5.7 | 1.00 |
| 8 × 6 | 1.25 |
| 8.5 × 6.5 | 1.50 |
| 9 × 7 | 2.00 |
| 10 × 6 | 1.75 |
| 10 × 8 | 2.50 |
| 11 × 7.5 | 2.61 |
| 11 × 8 | 2.70 |
| 12 × 8 | 3.00 |
| 12 × 9 | 3.50 |
| 13 × 8 | 3.40 |
| 13 × 9 | 4.11 |
| 14 × 8 | 4.00 |
| 14 × 9 | 4.25 |
| 14.5 × 9 | 4.50 |
| 15 × 9 | 5.00 |
| 15 × 10 | 5.75 |

Defined in `src/lib/necklace/pear-catalog.ts`.

Two SKUs can share a length (11×7.5 vs 11×8). Always store **length and width**. Never key BOM only by length.

### Orientation

`PearMark` draws **tip up** at rotation 0.

**Tip-out:** `rotation = angleRadians × 180/π + 90`.

- 12 o’clock: 0° (tip up, away from center)
- 3 o’clock: 90° (tip right)
- 6 o’clock: 180° (tip down)
- 9 o’clock: 270° / −90° (tip left)

Rounded lobe faces the neck. Do not restore shoulder-sweep (tips following the strand). That made length occupy the circumference and looked like a huge gap.

### Spacing and drawing

Pitch = **width + gap**. Visual `r` on the ring is width-based. `PearMark` scaleX = r (width, tangent after rotation), scaleY = r × (L/W) (length, radial).

Depth for non-catalog fallback: 61% of width. Catalog carat overrides the L×W×depth×0.006 estimate.

Default seed: gold 16″, bracelet 7″, **5 × 3 mm**, gap 0.28.

Hardware (locks + converters + bracelet) stay on the **smallest catalog SKU**.

---

## Site embedding

`public/opentools/<tool>/index.html` is a thin chrome + iframe of the Vercel app. Do not paste the whole TanStack app into the static HTML unless shipping a fully static port.

Hub `public/opentools/riviere-pattern-suite/index.html` is the style picker.

---

## Quality gates

- Typecheck (`tsc --noEmit`) on TanStack apps before calling done.
- Pear: `node --test src/lib/necklace/engine.test.ts`
- Bracelet: `node --test bracelet-engine.test.mjs`
- SVG coords `toFixed(3)` to avoid hydration mismatch.
- No horizontal page overflow. Strand/tables may scroll internally (`min-w-0` + `overflow-x-auto`).
- Do not gold-plate. Do not replace the convertible model. Do not kill a live 8080 preview if one is running in Grok Build.

---

## What not to do

- Do not put the three tools back as separate OpenTools cards. They live under the suite.
- Do not rename gem color **keys** (breaks saved projects). Labels may be refined.
- Do not space pears by length.
- Do not point pear tips inward or along the strand.
- Do not invent pear sizes outside the catalog.
- Do not use empty 3-stone clasp gaps in the ring.
- Do not write only `opentools/` and skip `public/opentools/`.
