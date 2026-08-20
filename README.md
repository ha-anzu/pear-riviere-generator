# Pear Rivière Generator

A production-oriented pattern and manufacturing generator for convertible pear-shaped tennis / rivière necklaces. It preserves the HANZU atelier and cyber visual system while modeling pear dimensions, a removable bracelet back, two matching concealed locks, and two converters.

## Core model

- Necklace lengths: 14–18 inches
- Bracelet backs: 6, 6.5, or 7 inches
- Gold pear lengths: 1.5–11.0 mm in 0.1 mm steps
- Silver pear lengths: 3.5–12.0 mm in 0.5 mm steps
- Adjustable length-to-width ratio: 1.30–1.80 (default 1.50)
- Estimated depth: 61% of width
- Estimated carat: `length × width × depth × 0.0060`
- Point-to-center pear orientation; the center pear has its rounded lobe at 6 o’clock

The back bracelet and every lock/converter cover use the minimum pear size. Graduation occurs only across the front necklace run.

## Development

```bash
npm ci
npm run dev
```

Verification:

```bash
npm test
npm run typecheck
npm run build
```

The app includes local history, optional account saves, BOM and manufacturing views, CSV/text copy, JSON export, and a 2400 × 1600 JPG export.
