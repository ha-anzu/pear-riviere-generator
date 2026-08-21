# Rivière Pattern Suite — development spec

This is the source of truth for continuing the pack. Read this before changing any generator or the OpenTools hub.

Hani (GitHub `ha-anzu`, Hanzu Tech). Shop-floor jewelry CAD + manufacturing tools. Do not rebuild from scratch. Do not invent a different convertible model.

Copy this file into each generator as `AGENTS.project.md` after suite-wide spec edits.

---

## Product

One suite, four silhouettes, one visual language.

| Style | Display name | App / repo | Live on hanzutech.com | Vercel |
| --- | --- | --- | --- | --- |
| Round tennis necklace (convertible) | Round necklace | `light-spring-sail-bamboo` | `/opentools/tennis-necklace-generator/` | `https://light-spring-sail-bamboo.vercel.app/` |
| Round diamond bracelet | Round bracelet | `round-diamond-bracelet-generator` | `/opentools/round-diamond-bracelet-generator/` | `https://round-diamond-bracelet-generator.vercel.app/` |
| Pear rivière (convertible) | Pear rivière | `pear-riviere-generator` | `/opentools/pear-riviere-generator/` | `https://pear-riviere-generator.vercel.app/` |
| Mixed-cut bracelet (cushion / square / pear packer) | Mixed-cut bracelet | `mixed-cut-bracelet-generator` (source started as `cobalt-blue-scarlet-tiger`) | `/opentools/mixed-cut-bracelet-generator/` | `https://mixed-cut-bracelet-generator.vercel.app/` |

Hub: `/opentools/riviere-pattern-suite/`

OpenTools main page lists **only the suite**, not the four tools as separate cards. Users pick a style from the hub or the in-app suite menu.

Thai names:

| EN | TH |
| --- | --- |
| Round necklace | สร้อยเทนนิสกลม |
| Round bracelet | สร้อยข้อมือกลม |
| Pear rivière | สร้อยเพชรหยดน้ำ |
| Mixed-cut bracelet | สร้อยข้อมือทรงผสม |

---

## Local workspace

```
C:\Users\ADMIN\OneDrive\Hanzu.Dev\Hanzu Tech OU\Repo\
  hanzutech.com\
  light-spring-sail-bamboo\
  round-diamond-bracelet-generator\
  pear-riviere-generator\
  mixed-cut-bracelet-generator\   (or cobalt-blue-scarlet-tiger while renaming)
```

Grok sessions often start in `C:\WINDOWS\system32`. That is **not** the repo. Always `cd` into the OneDrive path above before git/npm.

`hanzutech.com` is Next.js `output: "export"`. The file that actually serves OpenTools is **`public/opentools/`**. Always write that path. Keep the root `opentools/` copy in sync. A first push to root `opentools/` 404s because Next serves `public/opentools/`.

Custom domain = GitHub Pages from **`hanzutech.com` `main`**. Vercel team `team_LAA1vYNhAbwexyDSFH8WO4QH`.

Site Vercel project `prj_3GmqthhrJIoTVZABzBIIl7JSSsHD`.

---

## Agent / Windows gotchas (discovered)

- PowerShell execution policy blocks `npx.ps1` and `npm.ps1`. Run local binaries with `node .\node_modules\typescript\bin\tsc --noEmit`.
- `&&` is not supported in the Grok shell. Chain with `;`.
- `grep` / `find` / `sed` are not in this shell. Use the dedicated tools.
- Typecheck TanStack apps with `tsc --noEmit` before calling done.
- Necklace production branch is **`main`** (also mirrored on `fix/production-build`).
- Bracelet production branch is **`feat/round-diamond-bracelet-generator`** (keep `feat/react-rebuild` in sync).
- Pear production branch is **`main`**.
- Do not commit `.vercel/output` or `node_modules`.
- SVG numbers: `toFixed(3)` to avoid hydration mismatch.
- No horizontal page overflow. Strand/tables may scroll internally (`min-w-0` + `overflow-x-auto`).
- Do not kill a live 8080 preview if one is running in Grok Build.
- Do not gold-plate. Do not replace the convertible station model.

---

## Uniform chrome (all four tools)

Must look like the same product.

- Dual theme: `html[data-theme="black"|"white"]`. Shared localStorage key **`riviere-theme`**. Legacy `atelier` / `cyber` map to **black**. Default black.
- Dual language: `html lang="en"|"th"`. Shared localStorage key **`riviere-lang`**. Fonts IBM Plex Sans + IBM Plex Mono + Noto Sans Thai.
- Header: wordmark **Rivière**, style subtitle, EN|ไทย, Black|White, then the suite menu.
- Suite menu on every tool: All styles · Round necklace · Round bracelet · Pear rivière · Mixed-cut bracelet. Links use `https://hanzutech.com/opentools/...` with `target="_top"` so they escape the iframe.
- Buttons in chrome `h-11`, tap ≥ 44px. No emoji icons. lucide-react on TanStack apps. Tokens from each app’s CSS — no raw hex in new JSX except gem/metal fills that already live in the color tables.
- Metal setting color: yellow / white / rose.
- Local-first history / persist, JSON or CSV + HD export, shop sheet / BOM.
- Gem preview overlay: small SVG mark, bottom-right, pointer-events none, size + carat/name. Not a CSS circle card.
- Hardware callouts point at **stones**, never at sector bands or metal boxes.
  - Bracelet run is BACK. **LOCK** is the 3-stone lock **right after the bracelet ends**: right `lock1-m` + `lock2-f`, left `lock2-m` + `lock1-f`.
  - **CONVERTER** is the **one stone after that lock** toward the front (`conv-l`, `conv-r`).
  - Halo the lock/converter pear or round stone only (gold lock, silver converter). No back/front/lock fills, no converter rectangles.
  - Round bracelet: halo the first and last stones at the clasp and label them LOCK.

Do not mix black-theme velvet tokens into white, or the reverse.

---

## Shared gem color studio (round + pear + round bracelet)

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

Paint applies to selected stone, its palindrome pair, or the full run. Colors travel in JSON, BOM, and JPG.

This is **not** GIA D–Z. Setting metal is a separate control.

The mixed-cut tool uses a **different inventory**: 57 real spinel/CZ stones with families indigo / violet / rose / magenta / fuchsia / peach / cognac / tangerine. Do not force the 15-key studio onto that inventory. Keep its family colors; still share suite chrome, metal quotes, and overlay preview.

---

## Metal weight and final pricing

Shop reference: **one 4.5 mm round Ag925 bezel = 0.4 g**.

- Round bezel grams = `0.4 × (d / 4.5)³`
- Pear / cushion / mixed-cut grams = same formula with equivalent diameter `√(L × W)` (or `√(W × H)`)
- Every station / placed stone is one bezel (locks, converters, melee rounds included)
- Alloy grams = Ag925 grams × `density_alloy / 10.36`

Alloys always shown in the shop sheet, in this order:

| id | label | density g/cm³ | default $/g |
| --- | --- | --- | --- |
| k18 | 18K gold | 15.45 | 114 |
| k14 | 14K gold | 13.07 | 89 |
| k9 | 9K gold | 11.35 | 57 |
| ag925 | Silver 925 | 10.36 | 2.4 |
| pt950 | Platinum | 21.40 | 63 |

`$ /g` is editable. Grand total per alloy = stone `$/ct` + metal grams × `$/g`. Stone cost stays on `PatternResult.totalCost` (or CZ ct × `$/ct` on mixed-cut); metal quotes are extra.

Files:

- `light-spring-sail-bamboo/src/lib/necklace/metal-weight.ts`
- `pear-riviere-generator/src/lib/necklace/metal-weight.ts`
- `round-diamond-bracelet-generator/metal-weight.js`
- `mixed-cut-bracelet-generator/src/lib/metal-weight.ts`

Keep the four copies identical.

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

Gold round grid 1.5–11 mm step 0.1. Silver 3.5–12 mm step 0.5. Gap shop 0.2–0.5. **Default gap = 0.2 mm.**

Constants: `LOCK_STONES=3`, `LOCK_FEMALE=2`, `LOCK_MALE=1`, `CONVERTER_STONES=1`.

---

## Round necklace specifics

Repo: `light-spring-sail-bamboo` (TanStack Start + React 19 + Tailwind v4 + zustand).

Key files:

- `src/lib/necklace/engine.ts` — stations, BOM, findings, assembly, metal weights
- `src/lib/necklace/store.ts` — `braceletIn`, `metalPrices`, compute, presets
- `src/lib/necklace/gem-colors.ts`
- `src/lib/necklace/metal-weight.ts`
- `src/lib/locale.ts` / `src/lib/theme.ts`
- `src/components/necklace-ring.tsx` — stones only; LOCK after bracelet; CONVERTER one after lock
- `src/components/manufacturing-sheet.tsx`
- `src/components/metal-quote.tsx`
- `src/components/gem-preview.tsx`
- `src/components/suite-menu.tsx`

Ring layout **from `result.stations`**, not empty clasp gap.

Bracelet segment (F1+bracelet+M1) centered at 12 o’clock:

`startAng = −π/2 − mmToAngle(braceletMm)/2`

Default seed: gold, 16″, back bracelet 7″ (front 9″), 2.5 mm single size, **gap 0.2 mm**, yellow gold.

Examples RN / RR are FRONT lists. Bracelet auto-fills in smallest.

---

## Round bracelet specifics

Repo: `round-diamond-bracelet-generator` (Vite + React). Lengths 6, 6.25, 6.5, 7, 7.5, 8 inches. Palindromic graduation. **Gap 0.2 mm.** Color studio first-class.

Must look like necklace/pear: **Rivière** header, EN|ไทย, Black|White, IBM Plex, velvet square, `DiamondMark` on every stone, LOCK halo on clasp-end stones, shop sheet with five-alloy quotes. No cyber red/yellow, no diamond H mark, no CSS-circle gems.

OpenTools page iframes `https://round-diamond-bracelet-generator.vercel.app/`. Never commit a frozen `assets/` bundle there.

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

`PearMark` path is scaled to half-width 0.76 / half-height 1 so visual L/W matches catalog. Do not multiply the native path ratio by catalog L/W again (that squeezed pears).

Depth for non-catalog fallback: 61% of width. Catalog carat overrides the L×W×depth×0.006 estimate.

Default seed: gold 16″, bracelet 7″, **5 × 3 mm**, gap 0.2 mm.

Hardware (locks + converters + bracelet) stay on the **smallest catalog SKU**.

---

## Mixed-cut bracelet specifics

Repo: `mixed-cut-bracelet-generator`. Originated as Grok Build app `cobalt-blue-scarlet-tiger` (OG title “Carpet Lay”). Keep the packing engine. Do not replace it with the tennis generator.

What it is: pack a **fixed inventory of 57 mixed stones** (cushion, cushion-square, pear) into a bracelet rectangle, 2–4 rows by width, 0.10 mm girdle gap. Color families stay scattered. User can swap two stones. Flat layout + wrist wrap views.

Key files:

- `src/lib/gems.ts` — inventory, families, target 165 × 22 mm
- `src/lib/layout.ts` — packer, melee fill, seed
- `src/lib/geom.ts` / `src/lib/gem-paths.ts`
- `src/components/bracelet-view.tsx` — pan/zoom, LOCK callout, gem overlay
- `src/components/sidebar.tsx` — size, shop sheet, metal quotes
- `src/lib/metal-weight.ts`
- `src/lib/locale.ts` / `src/lib/theme.ts`

Length 140–210 mm, width 12–34 mm. Rows: width < 16.5 → 2, < 25.5 → 3, else 4.

Bezel grams: `√(W × H)` per placed stone + round melee diameters. CZ `$/ct` default 8. Same five-alloy quote table.

Do not convert this into a graduated tennis necklace. Do not drop the 57-stone inventory.

---

## Site embedding

`public/opentools/<tool>/index.html` is a thin chrome + iframe of the Vercel app. Do not paste the whole TanStack app into the static HTML unless shipping a fully static port.

`hanzutechcom.vercel.app` serves this export. If leftover `app.js` / `necklace-engine.js` sit next to the tennis iframe page, Next can still ship the **old** generator. Keep tennis and bracelet folders iframe-only.

Hub `public/opentools/riviere-pattern-suite/index.html` is the style picker.

When adding a tool:

1. Restyle to suite chrome (theme, i18n, menu, overlay, metal quotes).
2. Create a **properly named public repo** (not the Grok color-name).
3. Push, deploy Vercel (`create_git_project` with team `team_LAA1vYNhAbwexyDSFH8WO4QH`).
4. Add iframe page under `public/opentools/<slug>/` and copy to root `opentools/`.
5. Add hub card + nav + every suite menu.
6. Do **not** add a separate OpenTools card.
7. Update this spec and copy to `AGENTS.project.md` in each generator.

---

## Quality gates

- Typecheck (`tsc --noEmit`) on TanStack apps. Use `node .\node_modules\typescript\bin\tsc --noEmit` on this Windows box.
- Pear: `node --test --experimental-strip-types src/lib/necklace/engine.test.ts`
- Bracelet: `node --test bracelet-engine.test.mjs`
- Mixed-cut: keep existing packer tests if present.
- After git push, confirm Vercel `state: READY` for production.

---

## What not to do

- Do not put the four tools back as separate OpenTools cards. They live under the suite.
- Do not rename gem color **keys** on the tennis tools (breaks saved projects). Labels may be refined.
- Do not space pears by length.
- Do not point pear tips inward or along the strand.
- Do not invent pear sizes outside the catalog.
- Do not use empty 3-stone clasp gaps in the ring.
- Do not write only `opentools/` and skip `public/opentools/`.
- Do not keep a new jewelry tool under a Grok color-name repo as the public identity. Rename (`mixed-cut-bracelet-generator`, not `cobalt-blue-scarlet-tiger`).
- Do not mix mixed-cut inventory colors into the 15-key tennis studio, or the reverse.
- Do not draw lock/converter as sector highlights or metal boxes. Halo the stone.
- Do not leave converter arrows nudged off the converter stone. Converter is the one stone after the lock.
