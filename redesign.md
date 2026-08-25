# Lumina UI/UX Redesign — "Indie Bookshop × Vintage Cutouts"

**Date:** 2026-08-25
**Status:** Approved by product owner
**Approach:** Token-first reskin (Option A) — logic untouched, presentation rebuilt

## 1. Goal

Replace the current generic AI-styled interface (gradient text, glassmorphism, glow blobs) with a warm, human "neighborhood bookshop" visual system decorated with vintage paper-cutout motifs. Ship all missing pages with honest navigation. Light theme only.

## 2. Design Tokens (`globals.css`)

| Token | Value | Use |
|---|---|---|
| `--paper` | `#F6F1E7` | page background |
| `--surface` | `#FFFCF5` | cards, raised surfaces |
| `--ink` | `#211C15` | primary text, primary buttons |
| `--muted` | `#6E6355` | secondary text |
| `--hairline` | `#E3DACA` | borders, rules |
| `--accent` | `#A84B2A` | links, active states, stamps only |
| `--success` | desaturated moss green | saved states |
| `--error` | brick red | errors |

Type scale via Tailwind theme inline vars; spacing unchanged from default scale.

**Banned patterns (enforced in review):** gradients of any kind, backdrop-blur/glass, ambient glow blobs, noise overlay, uppercase-tracking headings, pill buttons (pills allowed only for stamp badges), hover-lift on plain content.

## 3. Typography

- Display: **Fraunces** (`next/font/google`, variable) — headlines, shelf titles, wordmark, stat numbers. Sentence case.
- Body/UI: **Work Sans** (`next/font/google`) — all body copy, controls, labels.
- Serif reading column for book descriptions on detail page.

## 4. Logo / Wordmark

Text-only: **Lumina** (Fraunces semibold, ink) + *Books* (Fraunces italic, lighter weight, muted ink). No icon, no SVG mark anywhere. Identical treatment in header, footer, auth screens. Favicon untouched (default).

## 5. Cutout Decoration Layer

All decorations hand-built CSS/SVG, no image assets, always `aria-hidden="true"`, never cause layout shift:

- **Torn-paper edges**: irregular rip dividers between paper/surface zones (hero top, footer seam). SVG path masks or clip-path.
- **Tape strips**: translucent masking-tape rectangles, slightly rotated, torn ends; hold hero covers ("staff picks"), auth card corners.
- **Postage stamps**: perforated-edge frames for "New" badge + genre stamps, rotation ±3°.
- **Ticket stubs**: dashed-tear cards for empty states and Dashboard stats.
- **Botanical line art**: 1–2 pressed-flower/branch ink SVGs peeking at section corners.
- **Squiggle underlines**: hand-drawn SVG stroke beneath key headlines.

### Motion (compositor-only: transform/opacity)

| Effect | Spec |
|---|---|
| Scroll settle-in | 8–12px drift + fade, staggered, IntersectionObserver, once |
| Ambient breathe | 4–6° sway/float loops 6–9s on tapes/botanicals only, never text/controls |
| Hover straighten | taped cards rotate ~2° → 0 on hover |
| Stamp thunk | Saved badge lands: scale 1.15→1 + small rotation settle |

`prefers-reduced-motion: reduce` disables all of the above. No animation libraries.

## 6. UI Primitives (`src/components/ui/`)

`Button` (primary ink-filled / outlined / quiet-link), `StampBadge`, `SectionHeading` (+ squiggle option), `BookCard` (tape variant for hero), `Input`, `EmptyState` (ticket stub), `Skeleton` (flat paper blocks).

## 7. Pages

### Reskinned
- **Home**: torn-paper masthead hero; left-aligned Fraunces headline + squiggle; search inside taped staff-picks card w/ 2–3 rotated real covers; genre stamps row; For You shelf; genre shelves on baseline hairline rules; footer.
- **Search**: compact masthead; results grid of BookCards; flat skeletons.
- **Sign in / Sign up**: centered surface card held by two tape corners; botanical sprig behind.
- **Book detail**: cover (stamp-frame optional), meta column; serif description; rating stars + save restyled; stamp-thunk on rate/save.
- **Onboarding**: stamps stuck onto a paper card; progress = filled stamp slots.

### New
- **Library** (`/library`, protected): saved collection grouped into genre shelves; unsave on hover; ticket-stub empty state → search. New service fn `listSavedCollection()` using server cookie client.
- **Dashboard** (`/dashboard`, protected): ticket-stub stat cards (saved count, rated count, avg rating given) + "Your taste" horizontal hairline-bar list of top genres derived from saved/rated activity; bars animate width on reveal. Computed from existing tables only.
- **Privacy / Terms / Contact**: honest short prose pages, serif body, shared layout. Contact shows a mailto link (no form backend).
- **404**: torn-paper panel, lost-bookmark line.

### Nav
Discover · Library · Dashboard · auth area (sign-in button or avatar menu). Community removed everywhere.

## 8. Data & Logic Changes

None to schema, RLS, or auth. Additions:
- `listSavedCollection(supabase, userId)` in `bookService.ts`
- Dashboard aggregate helpers reading `saved_books`/`ratings`/`user_profiles` via server cookie client (RLS-scoped)
- `Reveal` client component wrapping IntersectionObserver settle-in

## 9. Non-Goals

Dark mode · social/community features · new DB tables/migrations · animation libraries · icon/logo assets · changing verified auth/save/rating flows.

## 10. Verification

- `tsc --noEmit`, `eslint`, `next build` green after each milestone
- Live smoke: every route 200 (anon + redirected states as designed)
- Reduced-motion pass: animations disabled cleanly
- Manual E2E checklist handed to owner at the end
