# Design Taste — Warm Monochrome Dashboards

This file encodes design taste derived from real references. Read it before producing any UI, dashboard, component, or visual artifact. It overrides default tendencies — when this file conflicts with a habit, this file wins.

Derived from 4 references: a legal case-management dashboard (Sterling Legal), a docs workspace, a contracts dashboard (Lunor), and an e-commerce analytics dashboard (Spark Pixel). All light-mode, all warm, all information-dense product UI.

---

## 0. One-line summary

**Warm cream canvas, white cards, black ink, black actions — color exists only to mean something.** Ledger-calm, not startup-loud.

---

## 1. Philosophy

- The canvas is warm paper, the data is ink. Every screen should feel like a beautifully typeset financial document, not a neon app.
- Black is the brand. When in doubt about what color a button, active state, or chart line should be: black.
- Chroma is semantic budget. Green = good/active, amber = pending/warning, red = urgent/negative. Spend it nowhere else without a reason.
- Density is welcome; noise is not. Pack real information in, then keep it calm with hairlines, grey discipline, and padding — never with decoration.
- One texture break per screen maximum (a skeuomorphic folder, a pixel chart, a receipt edge). That break is the signature; everything around it stays quiet.

---

## 2. Color tokens

Approximate values extracted from references — tune ±5% but keep the temperature.

```
--canvas:        #F5F2ED;   /* warm cream page background; range #F2EFEA–#FAF8F5 */
--surface:       #FFFFFF;   /* all cards */
--ink:           #161616;   /* headings, figures, primary text */
--ink-secondary: #6E6E68;   /* labels, metadata, secondary text */
--ink-tertiary:  #9A9A93;   /* timestamps, hints */
--hairline:      #ECEAE4;   /* 1px borders everywhere */
--action:        #111111;   /* primary buttons, active states, default chart series */

/* Semantic only — pill background / text pairs */
--positive-bg:   #E8F6EE;  --positive-text: #178A50;
--warning-bg:    #FDF3E3;  --warning-text:  #C77714;
--negative-bg:   #FDEBEA;  --negative-text: #D64541;

/* Optional single chart accent (use ONE per product, or none) */
--chart-accent:  #E85D4A;   /* warm coral — only for one emphasized data series */
```

Rules:
- Background is never pure white and never cold grey (`#F9FAFB` is banned). Cards are always pure white sitting on the cream — that contrast IS the elevation system.
- No gradients. Anywhere.
- Sidebar and header share the canvas color or white — never a filled color block.
- Dark mode: not part of this taste. Don't offer it unprompted.

---

## 3. Typography

- **UI face:** one grotesque sans — Inter, Geist, or General Sans. Nothing else for chrome, headings, body.
- **Data face (optional, high-impact):** a monospace — Geist Mono, JetBrains Mono, or Space Mono — for KPI figures, table numerals, and uppercase-tracked stat labels (`TOTAL REVENUE`). When used, use it consistently for ALL data, not sporadically.
- Scale (desktop dashboard):
  - Page title: 24–32px / 600
  - KPI figure: 28–32px / 600 (mono if data face is on)
  - Card/section title: 16–18px / 600
  - Body & table: 13px / 400–500
  - Labels/metadata: 11–12px / 500, in `--ink-secondary`, sometimes uppercase with +4–6% tracking
- Hierarchy is built with **weight + grey value**, not font-size explosions. Two weights (400/600) cover 95% of cases.
- Small text is made legible by turning it grey, never by making it thinner.
- No italics. No serif display type. No font mixing beyond the sans + mono pair.

---

## 4. Layout

- **Page anatomy (default dashboard):** sectioned sidebar → page title → KPI row (3–4 cards) → dominant chart/content zone (⅔ + ⅓ split) → full-width data table.
- **Sidebar:** ~240px, canvas or white background, grouped under small grey section labels (e.g. "Main Menu", "Customers", "Management", "Settings"). Active item = white outlined pill or subtle fill — never a filled brand-color block. Account/user chip pinned at top or bottom.
- Grid-driven, never grid-broken. Asymmetry comes from column-width ratios (2:1 chart-to-list splits), not from floating elements.
- Eye path: biggest black number first → dominant chart → table. Make sure exactly one element owns the largest ink on the page.
- Density: medium-high. 20–24px card padding, 16–24px card gaps. Don't fear packed tables and small metadata — fear clutter (competing accents, shadows, decoration).

---

## 5. Components

**Cards** — white, 10–12px radius, 1px `--hairline` border, **no drop shadow**. Depth = white-on-cream, never blur.

**Buttons**
- Primary: solid black pill or 8–10px radius, white text, 13px/500 (`Create`, `Export CSV`, `Share`).
- Secondary: white ghost with hairline border, black text.
- Tertiary: plain text link in `--ink-secondary`.
- Never a blue or purple button. Never a gradient button.

**Status pills** — tinted background + darker text of same hue (see tokens), full radius, 11–12px/500, optional leading dot. Tables may alternatively use dot + colored text without pill background.

**Filter/segment control** — pill group; active segment is solid black with white text, inactive segments are plain grey text.

**Tables** — first-class citizens. Grey 11–12px header row (mono + sort arrows if data face is on), 13px cells, hairline row dividers only (no zebra striping), 24px avatars beside people, status pills inline, row-end kebab menu.

**KPI cards** — small grey label (uppercase-tracked if mono), large black figure, micro-delta in semantic green/red (`+12% vs last month`). Optional tiny monochrome illustration or icon chip top-right.

**Charts** — default series is black. Comparison via **solid vs dashed black lines** before reaching for a second color. If one accent is allowed, it's `--chart-accent` coral with dot markers. Donut charts: black + grey track. Axis text 11px grey; hairline gridlines only.

**Icons** — small solid or 1.5px-stroke monochrome glyphs. Feature icons may sit in solid-black rounded-square chips (white glyph) or soft low-saturation tint chips. Never multicolor icon sets.

---

## 6. Signature moves (ideas library — pick at most one per screen)

1. **Pixel/waffle bar chart** — bars built from stacked square units, filled black vs muted series. Highest-impact move in the set.
2. **Mono ledger data** — all figures, labels, and table numerals in monospace; instantly gives a terminal/receipt character.
3. **Skeuomorphic folders** — realistic grey 3D folder icons as shortcuts/collections inside the otherwise flat UI. One texture break, used once.
4. **Solid-vs-dashed monochrome comparison** — two-series chart with zero color.
5. **Receipt details** — perforated/torn card edges, tiny line-drawn paper illustrations in stat cards, a signature-scribble motif.
6. **Black icon chips** — solid black rounded squares housing white glyphs at the top of feature cards.
7. **Metadata stacks** — label:value rows (`Client: … / Court Date: … / Assigned to: …`) as the standard way to render dense record data inside cards.

---

## 7. Anti-patterns — do not ship

- Cold grey or pure-white page backgrounds (`#F9FAFB`, `#FFFFFF` as canvas)
- Dark mode by default
- Blue/purple/indigo primary buttons or accents — the generic SaaS tell
- Gradients of any kind, glassmorphism, blur
- Drop shadows on cards (hairline + white-on-cream only)
- More than one chromatic accent outside semantic status colors
- Oversized radii (`rounded-2xl`+ on everything), pill-shaped cards
- Colored sidebar/header blocks; filled brand-color active nav items
- Serif display type, italic flourishes, decorative script
- Decorative 3D illustrations, mascots, emoji in UI chrome
- Zebra-striped tables, heavy table borders
- Multicolor icon packs
- Centered dashboard layouts; floating grid-broken elements

---

## 8. Reference library

**R1 — Sterling Legal (case management).** Warm off-white `#FAF8F5`, white cards, semantic-only color. Deadline cards with metadata stacks + priority pills; black-active segmented filter; avatar + dot-status table. Proof that serious/regulated data suits this taste.

**R2 — Docs workspace.** Warmest canvas `#F6F3EF`, densest layout. Black rounded-square icon chips, heavily sectioned labeled sidebar, skeuomorphic folder row, single coral line chart, black donut. Proof that high density stays calm under this system.

**R3 — Lunor (contracts).** Fully monochrome: cream `#F2EFEA` + white + black only. Solid-vs-dashed black comparison chart, black pill buttons, folder-tab contact cards with avatar stacks, receipt illustrations. The purest expression of "black is the brand."

**R4 — Spark Pixel (e-commerce analytics).** Mono type for all data, uppercase-tracked labels, pixel/waffle bar chart, receipt-edge KPI cards, mono table headers with sort arrows. The ledger/terminal register at full strength.

---

## 9. Growing this file

When adding a new reference: analyze typography, color (hex), layout, the one memorable decision, and details. Then classify each finding as **rule** (seen in 3+ references → sections 2–5), **idea** (seen once or twice → section 6), or **anti-pattern** (violates the common set → section 7). If a new batch contradicts this file (e.g., a colorful direction), fork a second taste file rather than diluting this one.
