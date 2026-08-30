# Indie Bookshop Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Reskin LuminaBooks from generic AI-styling to the approved "indie bookshop × vintage cutouts" system and ship Library, Dashboard, legal, and 404 pages with honest navigation.

**Architecture:** Token-first reskin — new CSS custom-property token layer consumed by Tailwind v4 `@theme inline`, a `ui/` primitives folder enforcing the look, a `decor/` folder owning all cutout motifs and motion. Page logic (auth, save, rating, recommendations) untouched except className/markup swaps. New pages read existing RLS-scoped tables via the server cookie client.

**Tech Stack:** Next.js 16 App Router · Tailwind v4 · `next/font/google` (Fraunces + Work Sans) · Supabase SSR clients · zero new dependencies.

**Spec:** `redesign.md` (repo root)

## Global Constraints

- Palette exactly: paper `#F6F1E7`, surface `#FFFCF5`, ink `#211C15`, muted ink `#6E6355`, hairline `#E3DACA`, accent `#A84B2A`
- Banned everywhere: gradients, backdrop-blur/glass, glow blobs, noise overlay, uppercase-tracking headings, pill-shaped buttons (pills allowed ONLY on StampBadge)
- Logo is text-only: Fraunces semibold "Lumina" + italic muted "Books" — no icons/SVG marks anywhere branding appears
- All decorative elements `aria-hidden="true"`, zero layout shift
- Motion = transform/opacity only; everything disabled under `prefers-reduced-motion: reduce`
- No new npm dependencies
- Verification gate per task: `npx tsc --noEmit` clean AND `npm run lint` 0 errors AND affected routes render 200 on dev server (`http://localhost:3000`, already running detached)

---

### Task 1: Token layer, fonts, wordmark

**Files:**
- Modify: `src/app/globals.css` (full rewrite)
- Modify: `src/app/layout.tsx`
- Create: `src/components/ui/Wordmark.tsx`

**Interfaces:**
- Produces: Tailwind color utilities `bg-paper`, `bg-surface`, `text-ink`, `text-muted-ink`, `border-hairline`, `text-accent`, `bg-accent`; font utilities `font-display` (Fraunces), `font-body` (Work Sans); `<Wordmark />` server-safe component used by Tasks 4/6.

- [ ] **Step 1: Rewrite `globals.css`**

```css
@import "tailwindcss";

:root {
  --paper: #f6f1e7;
  --surface: #fffcf5;
  --ink: #211c15;
  --muted: #6e6355;
  --hairline: #e3daca;
  --accent: #a84b2a;
}

@theme inline {
  --color-paper: var(--paper);
  --color-surface: var(--surface);
  --color-ink: var(--ink);
  --color-muted-ink: var(--muted);
  --color-hairline: var(--hairline);
  --color-accent: var(--accent);
  --font-display: var(--font-fraunces);
  --font-body: var(--font-work-sans);
}

body {
  background: var(--paper);
  color: var(--ink);
  font-family: var(--font-work-sans), sans-serif;
}

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

- [ ] **Step 2: Load fonts + real metadata in `layout.tsx`**

Replace Geist imports with:

```tsx
import { Fraunces, Work_Sans } from "next/font/google";

const fraunces = Fraunces({ variable: "--font-fraunces", subsets: ["latin"] });
const workSans = Work_Sans({ variable: "--font-work-sans", subsets: ["latin"] });

export const metadata: Metadata = {
  title: { default: "LuminaBooks", template: "%s — LuminaBooks" },
  description: "A neighborhood bookshop on the web.",
};
```

Apply both variables on `<html>`; keep `lang="en"`; body keeps `min-h-screen flex flex-col`. Remove the old Arial body font-family fallback duplication (globals owns type now).

- [ ] **Step 3: Create `src/components/ui/Wordmark.tsx`**

```tsx
import Link from "next/link";

export default function Wordmark({ href = "/" }: { href?: string }) {
  return (
    <Link
      href={href}
      className="font-display text-xl leading-none text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 rounded-sm"
    >
      Lumina{" "}
      <span className="font-light italic text-muted-ink">Books</span>
    </Link>
  );
}
```

- [ ] **Step 4: Verify + commit**

Run: `npx tsc --noEmit; npm run lint` → expect clean (HomeClient may still reference removed Geist vars — fix by removing `${geistSans.variable}` usage if tsc flags it).
Commit: `feat(redesign): paper-ink token layer, fraunces/work sans, text wordmark`

---

### Task 2: Decoration components

**Files:**
- Create: `src/components/decor/Reveal.tsx`
- Create: `src/components/decor/TapeStrip.tsx`
- Create: `src/components/decor/TornEdge.tsx`
- Create: `src/components/decor/Squiggle.tsx`
- Create: `src/components/decor/Botanical.tsx`

**Interfaces:**
- Produces: `<Reveal delay={ms} className>` client wrapper (fade+drift settle once on intersect); `<TapeStrip angle={deg} className>`; `<TornEdge position="top"|"bottom" flip?>`; `<Squiggle className>`; `<Botanical variant="sprig"|"branch" className>`. All aria-hidden except Reveal (it wraps real content).

- [ ] **Step 1: `Reveal.tsx`**

```tsx
"use client";

import { useEffect, useRef, useState } from "react";

type RevealProps = {
  children: React.ReactNode;
  delay?: number;
  className?: string;
};

export default function Reveal({ children, delay = 0, className }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out ${
        shown ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
      } ${className ?? ""}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}
```

- [ ] **Step 2: Tape / torn edge / squiggle / botanical**

`TapeStrip`: absolutely-positioned rotated div — `bg-[#e8ddc4]/70 shadow-sm rotate-[{angle}deg] h-6 w-24` with jagged ends via `clip-path: polygon(...)` (small irregular notches at left/right edges).

`TornEdge`: inline SVG `<path>` with irregular zigzag fill of `var(--surface)` over transparent, `preserveAspectRatio="none"`, height ~28px; `position` picks top/bottom placement, `flip` mirrors horizontally so no two seams look cloned.

`Squiggle`: SVG `<path d="M2 6 Q 12 2, 22 6 T 42 6 T 62 6 T 82 6 T 102 6">` stroke `var(--accent)` strokeWidth 2.5 strokeLinecap round, `fill="none"`.

`Botanical`: two simple ink-stroke line drawings (stem + leaves as bezier paths), stroke `currentColor`, opacity ~25%, sized via className. Keep paths ≤10 commands each — quiet, not illustration-heavy.

- [ ] **Step 3: Verify + commit**

Run: `npx tsc --noEmit; npm run lint`.
Commit: `feat(redesign): cutout decor primitives (reveal, tape, torn edge, squiggle, botanical)`

---

### Task 3: UI primitives

**Files:**
- Create: `src/components/ui/Button.tsx`, `StampBadge.tsx`, `SectionHeading.tsx`, `Input.tsx`, `EmptyState.tsx`, `Skeleton.tsx`

**Interfaces:**
- Produces (consumed by Tasks 5–9):
  - `Button({variant: "primary"|"outline"|"quiet", ...})` — primary `bg-ink text-surface hover:bg-ink/85`; outline `border border-ink/30 hover:border-ink hover:text-ink`; quiet `underline-offset-4 hover:underline text-accent`. All `rounded-md px-5 py-2.5 text-sm font-semibold transition-colors`.
  - `StampBadge({children, tone?: "rust"|"moss", rotate?: number})` — perforated edge via radial-gradient dot mask trick: `bg-accent/10 text-accent border border-dashed border-accent/40 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide` + `style={{rotate: `${rotate ?? -2}deg`}}`; moss variant swaps accent→emerald tones.
  - `SectionHeading({title, sub?, squiggle?})` — h2 `font-display text-3xl sm:text-4xl text-ink`, optional `<Squiggle/>` under, sub in `text-muted-ink`.
  - `Input` — `w-full rounded-md border border-hairline bg-surface px-4 py-3 text-sm outline-none focus:border-accent/50` (kills the orange ring-glow).
  - `EmptyState({title, body, action})` — dashed `border-hairline` ticket stub with side notches (two absolutely positioned half-circles `bg-paper`).
  - `Skeleton({className})` — `animate-pulse rounded-md bg-hairline/60`.

- [ ] **Step 1: Implement all six** (straightforward presentational components per contracts above; no logic).
- [ ] **Step 2: Verify + commit**

Run: `npx tsc --noEmit; npm run lint`.
Commit: `feat(redesign): ui primitives (button, stamp badge, section heading, input, empty state, skeleton)`

---

### Task 4: Header & footer chrome

**Files:**
- Modify: `src/components/SiteHeader.tsx` (rewrite presentation, keep props/user logic + mobile menu state)
- Modify: `src/components/SiteFooter.tsx` (rewrite)
- Modify: `src/components/UserMenu.tsx` (className swap only: square avatar `rounded-md bg-ink text-surface`, dropdown `rounded-md border-hairline bg-surface shadow-sm`)

**Interfaces:**
- Consumes: `<Wordmark />`, `UserMenu`, auth `user` prop shape `{email: string} | null` (unchanged).
- Produces: same exported signatures — no consumer changes needed.

- [ ] **Step 1: Header** — replace glass bar: `sticky top-0 z-40 border-b border-hairline bg-paper/95`. Nav links `Discover · Library · Dashboard` (remove Community), active-route bolding dropped (plain `text-muted-ink hover:text-ink`); sign-in button uses `Button variant="primary"`; mobile panel becomes `bg-paper border-t border-hairline`.
- [ ] **Step 2: Footer** — top hairline seam with `<TornEdge position="bottom"/>` above it; columns: Wordmark + tagline "A neighborhood bookshop on the web." · Privacy/Terms/Contact links · © line. Muted ink throughout.
- [ ] **Step 3: Verify live** — `/` renders 200; nav shows exactly three links; wordmark has no icon.
- [ ] **Step 4: Commit** — `feat(redesign): honest nav header and torn-seam footer`

---

### Task 5: Home page reskin

**Files:**
- Modify: `src/components/HomeClient.tsx` (rewrite presentation; props unchanged: `shelves`, `user`, `recommended`)
- Modify: `src/app/page.tsx` (only if hero needs 3 sample books passed — extend props with `staffPicks: CachedBook[]` from `getRecentBooks(3)`)

**Interfaces:**
- Consumes: all Task 2/3 primitives; `GenreShelf`, `RecommendationResult`, `CachedBook` types from bookService (unchanged).

- [ ] **Step 1: Hero/masthead** — section on `bg-surface` with `<TornEdge position="bottom"/>` into paper; left-aligned `font-display text-5xl sm:text-6xl` headline "Find the book that finds you." with squiggle under "finds you"; right side: taped staff-picks card — `bg-paper border border-hairline p-4 rotate-1` holding 2–3 covers `w-24 rotate-[-2deg]` with `<TapeStrip angle={-4}/>` across tops; search form inside same card using `Input` + primary `Button`; genre row = `StampBadge`s (static, not buttons — wire later to search).
- [ ] **Step 2: Shelves** — For You section first (when `recommended?.books.length > 0`): `SectionHeading` "For You" + basis subtitle copy from current implementation; horizontal scroll row; each book sits on shared bottom hairline (`border-b border-hairline pb-4` on row container) like a physical shelf. Genre shelves follow identically, shelf title in Fraunces with item count in muted ink.
- [ ] **Step 3: BookCard internal** — flatten: remove hover-lift/scale; cover `rounded-sm border border-hairline`; hover straightens only if taped variant; title `text-sm font-semibold`, author `text-xs text-muted-ink`; wrap cards in `<Reveal delay={i * 60}>` inside rows (cap stagger index at 5).
- [ ] **Step 4: Delete dead styles** — noise overlay div, all glow blobs, gradient text spans, cursor-glow handler (`glow`, `handleHeroMouseMove`, related refs/state).
- [ ] **Step 5: Verify live + commit** — `/` 200; visually confirm zero gradients/glass; commit `feat(redesign): editorial masthead home with cutout shelves`

---

### Task 6: Auth screens reskin

**Files:**
- Modify: `src/app/(auth)/layout.tsx`, `_components/auth-card.tsx`, `sign-in-form.tsx`, `sign-up-form.tsx` (className/logic-preserving swaps)
- Modify: `src/components/UserMenu.tsx` if any leftover pill styling

- [ ] **Step 1: Layout** — paper background, one `<Botanical variant="sprig">` bottom-left at low opacity; centered Wordmark above card.
- [ ] **Step 2: AuthCard** — `bg-surface border border-hairline rounded-md p-8 shadow-sm relative`, two `<TapeStrip angle={-45}/>` corners top-left/top-right; heading in Fraunces sentence case.
- [ ] **Step 3: Forms** — swap inputs to `Input`, submit buttons to `Button primary` full-width, error boxes to `border-hairline bg-paper text-error` flat panels (keep exact error-copy logic and success states untouched).
- [ ] **Step 4: Verify live + commit** — `/sign-in`, `/sign-up` 200; commit `feat(redesign): taped auth cards`

---

### Task 7: Search reskin

**Files:**
- Modify: `src/components/SearchClient.tsx`, `src/components/SaveButton.tsx` (presentation only — all fetch/save/error logic identical)

- [ ] **Step 1: SearchClient** — compact masthead (Fraunces h1, squiggle); search bar = bordered `Input` + primary Button inline (no pill container); results grid `grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-5 gap-y-8`; skeletons via `Skeleton` aspect-[2/3]; empty/initial states via `EmptyState`.
- [ ] **Step 2: SaveButton** — idle: `Button outline` small with Bookmark icon; saved: moss `StampBadge`-style chip with check; saving: spinner inline; **stamp-thunk**: on success transition apply `animate-[stamp_0.3s_ease-out]` keyframes added to globals.css (`from {transform: scale(1.15) rotate(-4deg)} to {transform: scale(1) rotate(0)}`).
- [ ] **Step 3: Verify live + commit** — `/search` 200 (results may be empty due to API quota — empty state must show); commit `feat(redesign): search grid and stamped save action`

---

### Task 8: Book detail reskin

**Files:**
- Modify: `src/app/book/[id]/page.tsx`, `book/[id]/loading.tsx`, `src/components/RatingSection.tsx`, `BookSaveSection.tsx` (presentation only)

- [ ] **Step 1: Layout** — back link as `quiet` button; cover column gets stamp-frame option (perforated border via dotted outline offset); right meta: genre StampBadge, Fraunces title, author muted; description moves to max-w-prose serif reading column (`font-display font-light text-lg leading-relaxed`) — the one place serif body is correct.
- [ ] **Step 2: RatingSection** — stars keep amber fill but `h-7` with thicker click targets; stats line "★ 4.5 · 12 ratings (yours: 4)" in muted ink; rate lands with stamp-thunk animation.
- [ ] **Step 3: loading.tsx** — flat Skeleton blocks matching new layout.
- [ ] **Step 4: Verify live + commit** — `/book/bd4cb86d-acf0-4288-9384-0c430f6a9f5e` 200 (cached Hobbit row); commit `feat(redesign): reading-room detail page`

---

### Task 9: Onboarding reskin

**Files:**
- Modify: `src/components/OnboardingClient.tsx`, `src/app/onboarding/page.tsx` (presentation only)

- [ ] Genre options render as large `StampBadge`s that "stick" when selected (scale-thunk on toggle); progress copy "(2/3)" retained; Continue = primary Button; Skip = quiet link. Header area gets Wordmark + botanical sprig.
- [ ] Verify: `/onboarding` anon → 307 sign-in; commit `feat(redesign): sticker-sheet onboarding`

---

### Task 10: Library page (new)

**Files:**
- Modify: `src/lib/bookService.ts` (add function)
- Create: `src/app/library/page.tsx`

**Interfaces:**
- Produces: `listSavedCollection(supabase: SupabaseClient, userId: string): Promise<{shelves: GenreShelf[]; total: number}>` — reads `saved_books` (eq user_id, order created_at desc) joined ids against `books`, groups by `genre` (ungrouped under "Unsorted"), never filters ≥2 here (personal collection shows singles).

- [ ] **Step 1: Service function** — implement per signature above; reuse grouping style from `getBooksByGenre` but include single-book groups.
- [ ] **Step 2: Page** — server component, `force-dynamic`, proxy already protects `/library`. No user → redirect sign-in (defense in depth). Render `SectionHeading` "Your library" + total count; genre shelves of `BookCard`s with unsave affordance: reuse SaveButton (savedId known per row via saved id map) inside a thin client wrapper `LibraryShelfClient` receiving initial data as props (same batch pattern as SearchClient). Empty state: ticket stub "Nothing on your shelf yet" → search CTA.
- [ ] **Step 3: Verify + commit** — anon `/library` → 307; commit `feat(library): personal collection page grouped by genre`

---

### Task 11: Dashboard page (new)

**Files:**
- Create: `src/app/dashboard/page.tsx`
- Modify: `src/lib/bookService.ts` (add `getReadingStats(supabase, userId): Promise<{savedCount; ratedCount; avgGiven; topGenres: {genre; count}[]}>`)

- [ ] Stats from existing tables only: counts from `saved_books`/`ratings` (eq user), `avgGiven` = mean of own ratings (null if none), `topGenres` = frequency of `genre` across interacted books, desc, cap 5. Render stat trio as ticket-stub cards (big Fraunces numerals, muted labels); taste bars: label + hairline track + `bg-accent/70` fill width `% = count/max*100`, animated via `Reveal` + CSS width transition. Zero-data state: EmptyState nudging to save/rate.
- [ ] Verify: anon → 307; commit `feat(dashboard): reading stats from your activity`

---

### Task 12: Legal pages, 404, final sweep

**Files:**
- Create: `src/app/privacy/page.tsx`, `src/app/terms/page.tsx`, `src/app/contact/page.tsx`, `src/app/not-found.tsx`
- Create: `src/components/LegalPage.tsx` (shared: Wordmark header strip, serif prose column)

- [ ] LegalPage: title + "Last updated Aug 2026"; prose paragraphs honest and short (data collected: email, saved books, ratings; no selling data; contact address for deletions). Contact: mailto link, no form. 404: torn-edge panel, "This bookmark fell out." + home CTA.
- [ ] Full sweep: grep `gradient|backdrop-blur|blur-3xl` in src/ → must return 0 hits; grep `Community` → 0 hits in nav; run `npm run build`; smoke all routes anon (/, /search, /sign-in, /sign-up, /privacy, /terms, /contact, /nonexistent→404, protected→307).
- [ ] Commit: `feat(redesign): legal pages, custom 404, final sweep`

---

### Task 13: Handoff

- Update `todo.md` with redesign section (all ✅ + notes)
- Manual E2E checklist message to owner (incl. reduced-motion check via OS setting)
- Run finishing-a-development-branch menu (merge / PR / keep)
