# MyBiz Design System

A design system for **MyBiz**, a connected-workspace product: teams keep their operational data in structured bases, build views and interfaces on top of it, and layer automations and AI over the whole thing. Two surfaces are covered here — the **workspace app** (where the work happens) and the **marketing site** (where MyBiz explains itself).

Brand colour: **#77092E** (deep burgundy) — supplied by the user, mapped to `--burgundy-700` / `--brand`.

---

## Sources given to me

| Source | What it was | How I used it |
| --- | --- | --- |
| `uploads/Airtable Web.png` | Sign-in screen of **Airtable** (a third-party product) | Structural reference only: auth column width, field/label rhythm, SSO button stack, legal footer pattern |
| `uploads/Airtable Web (1).png` | Airtable marketing homepage | Structural reference only: nav shape, centred hero, prompt bar, product-embed treatment |
| `uploads/Airtable Web (2).png` | Airtable app home | Structural reference only: topbar + sidebar split, trial banner, four start-path cards, footer utilities, Create button |
| Brief | "Company description: MyBiz. Brand colour 77092E. You can do a makeshift logo but we will do it again later." | Everything visual |

**Important caveat.** No MyBiz codebase, Figma file, brand guide or font binaries were provided. The uploads are screenshots of **Airtable**, not of MyBiz — so they were read as *information-architecture* reference (what screens exist, what density, what goes where), never as a brand to copy. Airtable's mark, wordmark, palette, typography and illustration style are **not** reproduced anywhere in this system. Colour, type, motion, elevation and copy voice below are an original system built around #77092E; they are a proposal, not documented MyBiz brand law. See **Open questions** at the bottom.

---

## Index

| Path | What's there |
| --- | --- |
| `styles.css` | Global entry point — `@import` list only. Consumers link this one file. |
| `tokens/` | `fonts.css`, `colors.css`, `typography.css`, `spacing.css`, `radii.css`, `shadows.css`, `motion.css`, `base.css` |
| `assets/` | `logo.svg`, `logo-white.svg`, `mark.svg`, `mark-white.svg` (all **placeholder**) |
| `components/` | React primitives, grouped `core/ forms/ navigation/ feedback/ data/` |
| `ui_kits/mybiz-app/` | Workspace app: auth → home → base grid view, white shell (see its `README.md`) |
| `ui_kits/mybiz-web/` | Marketing site: hero, features, pricing, CTA, footer |
| `guidelines/` | 15 foundation specimen cards (Colors, Type, Spacing, Brand) |
| `templates/` | Starting folders consuming projects can copy — `landing-page/`, `app-screen/` |
| `thumbnail.html` | Homepage tile |
| `SKILL.md` | Agent-Skills front matter for use outside this project |

### Components

Grouped by concern. Every component ships `<Name>.jsx`, `<Name>.d.ts` and `<Name>.prompt.md`; each directory has one `@dsCard` HTML showing its states.

- **core/** — `Button`, `IconButton`, `Icon`, `Badge`, `Tag`, `Avatar`, `Card`
- **forms/** — `Input`, `Select`, `Checkbox`, `Radio`, `Switch`
- **navigation/** — `SidebarItem`, `Tabs`
- **feedback/** — `Banner`, `Toast`, `Tooltip`, `Dialog`
- **data/** — `DataTable`, `FilterChip`

### Templates

| Template | Use it for |
| --- | --- |
| `templates/landing-page/LandingPage.dc.html` | Marketing pages — hero, feature grid, stats band, gradient CTA, footer |
| `templates/app-screen/AppScreen.dc.html` | In-product screens — topbar, white base sidebar, view tabs, filter toolbar, record grid |

Each template loads the system through its sibling `ds-base.js`; in a consuming project, point the `base` line in that file at the bound `_ds/<folder>` tree.

**Intentional additions.** No source defined a component inventory, so this is an authored standard set sized to the two surfaces. Two entries are worth calling out: `Icon` exists purely as a Lucide wrapper so no one hand-writes SVG, and `DataTable` / `FilterChip` exist because a record grid is the product's centre of gravity — a system for MyBiz without them would be unusable.

---

## Visual foundations

**Colour.** One brand hue, used sparingly. Burgundy is an eleven-step ramp; `700` (#77092E) is the brand step, `800` is hover, `900` is press, `50/100` are the only tints allowed behind content. Neutrals are deliberately **warm** (a red-leaning grey) so burgundy never reads cold or clinical next to them. Six non-semantic **record-label colours** (amber, teal, blue, violet, green, rose) exist only for data — select-field values, tags, filters — each with a solid, a tint background and a darkened foreground for legible text on the tint. Status colours are separate and never borrowed for labels. Reach for a semantic alias (`--text-body`, `--surface-sunken`, `--border-default`) rather than a raw ramp step.

**Type.** Two families. **Geist** carries everything functional — headings at 700–800 with −1.8% tracking, UI at 13px/500, body at 15px. `Instrument Serif` is the display voice and appears **only** on marketing and in big numerals (stats, pricing); it never appears inside the app. **Geist Mono** sets record IDs, dates, currency, row numbers and keyboard shortcuts. The app essentially runs on two sizes — 13px UI and 15px body.

**Spacing & layout.** A 2/4/6/8/12/16/20/24/32/40/48/64/80 scale. Inside controls: 2–8. Between related blocks: 12–24. Between sections: 40–80; marketing sections breathe at 96px. Fixed layout constants: sidebar 284px, topbar 56px (sticky), table row 32px, field 32px in-app and 44px in auth/marketing, content max 1240px, prose max 68ch. The app shell is fixed; only the content column scrolls.

**Backgrounds.** Overwhelmingly flat white. Three exceptions: `--surface-sunken` (#F6F5F5) for table headers, toolbars and page wells; `--surface-shell` (burgundy-950) for the marketing stats band; and exactly two gradients — `--gradient-warm-wash` (burgundy-50 → white) behind the marketing hero and `--gradient-brand` (burgundy-800 → 600) on the final CTA block. No mesh gradients, no bluish-purple, no noise, no repeating patterns, no hand-drawn illustration. Photography is not used yet; when it arrives it should be warm-neutral and desaturated so burgundy stays the loudest thing on screen.

**App shell.** Both sidebars — the global one and the one inside a base — are **white** (`--surface-page`) with a `--border-default` hairline. Burgundy appears in the app only as the Create button, active states and selected-row wash; it is never a large field of colour in product chrome. `--surface-shell` (burgundy-950) exists for marketing surfaces, not the app.

**Borders & elevation.** MyBiz structure is carried by **hairlines, not shadows**. Cards are a 1px `--border-default` at 12px radius with a near-invisible `--shadow-xs`; panels and banners go to 16px radius; dialogs get `--shadow-xl` because they float over a scrim. Interactive cards gain `--shadow-md` and a darker border on hover — a lift, not a bloom. Never stack two shadows on one element. Table cells use `--border-subtle` (n-100) so a dense grid doesn't turn into a cage.

**Radii.** 3px checkbox, 4px badge, **6px is every control** (button, input, select, chip), 8px small containers, 12px cards, 16px panels/banners/dialogs, 24px the hero's big rounded shoulder, full pills reserved for `Tag` record labels and the annual/monthly toggle. Pills and 4px badges are deliberately different shapes so data reads differently from status.

**Motion.** Fast, functional, no personality tricks. 80ms press, 120ms hover and colour, 180ms toggles and surfaces, 260ms menus and dialogs, 400ms page and banner. `--ease-standard` `cubic-bezier(.2,0,.2,1)` for almost everything; `--ease-emphasis` `cubic-bezier(.32,.72,0,1)` when something travels a distance (switch knob, drawer). **No bounce, no spring, no overshoot, no looping ambient animation.** Fades are always paired with a ≤4px move, never a fade alone.

**States.** Hover = a step *darker* on filled surfaces (700→800), a light grey wash on chromeless ones, and a white-alpha wash (`rgba(255,255,255,.08)`) on the burgundy shell — never opacity changes. Press = `--press-scale` 0.985 plus one more ramp step. Focus = `--focus-ring`, a 3px burgundy-500 halo at 32% alpha, on top of the existing border; the border colour also moves to `--border-focus`. Disabled = 45% opacity plus `not-allowed`. Selected table rows wash `--brand-subtle`.

**Transparency & blur.** Used in three places only: the dialog scrim (`--surface-overlay`, ink at 48%), white-alpha hovers on the burgundy shell, and the bottom protection gradient `--gradient-protect-b` for text over imagery. **No frosted glass, no backdrop-filter** in product chrome.

**Density.** The app is dense on purpose — 32px rows, 13px text, 16px page gutters. Marketing is the opposite: 40px gutters, 96px section rhythm, 66px display type. The same components are used in both; only `size` changes (`md` in-app, `lg` outside it).

---

## Content fundamentals

**Voice.** Plain, operational, specific. MyBiz talks about *the work* — records, views, hand-offs, permissions — not about transformation or synergy. Confident but never breathless.

**Person.** Second person for the reader, "we" only when MyBiz itself acts. "Keep the automations your team already relies on," not "Users can retain their automations." Never first-person singular.

**Casing.** Sentence case everywhere — buttons, headings, menu items, table headers, dialog titles. The only uppercase is the tracked 11px eyebrow (`--type-eyebrow`), used for section labels like `WHY MYBIZ` and specimen headers. Title Case is never used.

**Buttons and actions** are verbs, one to three words: `Create`, `Upgrade`, `Add record`, `Book demo`, `Create workspace`. Never `Submit`, `OK`, `Click here`, or a bare `Learn more` where a real verb exists.

**Labels** name the thing, not the input: `Work email`, `Account name`, `Estimated ARR`. No colons, no "Enter your…". Hints are one clause, no period unless it's a full sentence. Errors say what's wrong and imply the fix: "Exceeds your plan limit," not "Invalid value."

**Marketing copy** is one big claim plus one qualifying sentence. Em dashes for the pivot, not colons: *"All your teams, all their workflows — connected in one workspace."* Sub-copy stays under 30 words and ends with the objection killer ("No code required.", "No credit card, no implementation project.").

**Numbers.** Digits always, even under ten. Currency abbreviated (`$4–4.5B`, `$600–700M`), ranges with an en dash, dates as `MM/DD/YYYY` in tables and `Jul 24` in prose. Counts get a comma at four digits (`7,500`).

**Toasts** are past-tense confirmations of what happened, five to eight words, no exclamation marks: "Record added to Top targets."

**Emoji: never.** Not in product UI, not in marketing, not in empty states. Not part of the brand.

**Words we avoid:** *leverage, seamless, revolutionize, unlock, supercharge, effortless, game-changing, journey, delight.* **Words we use:** *workspace, base, record, view, field, interface, automation, hand-off, permission, signal.*

---

## Iconography

**System: Lucide**, loaded from CDN (`unpkg.com/lucide@0.544.0/dist/umd/lucide.min.js`). Every icon in this design system goes through the `Icon` component, which renders one Lucide glyph — nothing hand-drawn.

> ⚠️ **Substitution flagged.** No icon set was provided with the brief, and the uploads showed a third-party product's proprietary glyphs. Lucide is the closest match to the reference density and stroke feel (thin, geometric, open, 24px grid, outline-only) and is what this system standardises on until a real MyBiz set exists. If MyBiz has its own icons, drop them in `assets/icons/` and rewrite `Icon.jsx` to resolve from there — no other component needs to change.

- **Style:** outline only, never filled. Default stroke `1.75`. Icons inherit `currentColor`.
- **Sizes:** 13–14px inside table headers and chips, 16px in buttons and dense chrome, 18px in sidebar rows, 20px on cards, 24px+ in marketing.
- **Field types** in the grid are represented by icons, consistently: `type` (text), `hash` (number), `circle-dot` (single select), `calendar` (date), `user` (collaborator), `link` (URL).
- **No emoji, ever**, and no Unicode characters as icons — with two exceptions set in mono, not as glyphs: keyboard shortcuts (`⌘K`) and the en dash in ranges.
- Icons are never the only carrier of meaning; every icon-only control has a `label` (tooltip + accessible name).

---

## Typography

Loaded from Google Fonts in `tokens/fonts.css`:

| Role | Using | Why |
| --- | --- | --- |
| UI / body | **Geist** | Specified by the brand. Neutral, tightly-spaced grotesque; holds up at 13px and gets appropriately assertive at 700–800 |
| Display | **Instrument Serif** | High-contrast editorial serif; gives marketing a voice the app doesn't have, and its italic pairs well with burgundy |
| Mono | **Geist Mono** | Geist's companion mono — even rhythm at 13px, unambiguous digits for record data |

**Geist and Geist Mono are the brand faces**, loaded from Google Fonts in `tokens/fonts.css`. Instrument Serif is still a substitution — no display face was specified, and this is the pairing I'd propose for marketing. If MyBiz has its own display serif (or wants Geist to carry display too), that's a one-variable change: `--font-display`.

Swapping any family means editing `tokens/fonts.css` and one of three variables — `--font-ui`, `--font-display`, `--font-mono`. Nothing else references a family name.

---

## Open questions / what I need from you

1. **Logo.** `assets/*.svg` are a placeholder — you're replacing these yourself. Nothing depends on the mark's shape; swapping those four files is the whole job.
2. **Display face.** Instrument Serif is my proposal for marketing display, not a brand decision — say the word if you want Geist to carry display too.
3. **Real screens.** If a MyBiz codebase or Figma file exists, point me at it. The UI kits are currently reasoned from a competitor's IA plus your brand colour — a starting point, not a recreation.
