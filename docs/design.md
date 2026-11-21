# 설레일 Design System

## Direction

설레일 supports both light mode and dark mode. Pretendard Variable is served locally and used across the whole product so Korean typography remains balanced at every weight and breakpoint.

The product connects a ski-trip landing page to a practical planning tool. Its visual idea is **quiet chrome, one signature**: a cool neutral surface ramp, one cobalt accent used for the primary action and selection, and the **price-confidence dot** as the product's own detail. Operational screens stay compact and calm; richness lives in content (the hero photo and the real result card), never in decoration.

Character: calm, exact, a little warm. Avoid describing the UI as clean, modern, or premium.

## Core Principles

- Use one top header. Do not use a persistent app-wide sidebar. A trip detail may use a local workspace sidebar to separate overview, checklist, and budget.
- Light mode and dark mode must both be supported.
- Theme switching is controlled by the top-header toggle and persisted in `localStorage`.
- Keep the original product flow: home, plan form, recommendations, trip detail, share page.
- Prioritize dense but readable trip information.
- Landing decoration may build travel anticipation, but it must not delay or obscure the primary planning action.
- Mobile remains first-class. Desktop can expand into two-column comparison layouts.

## Color Tokens

Use CSS variables from `src/app/globals.css`.

- Surfaces, borders, and text come from one cool neutral ramp (`background`, `card`, `muted`, `border`, `foreground`, `muted-foreground`). Three text roles only: foreground, muted-foreground, and the primary color for links.
- `primary` (cobalt) is the single accent: primary buttons, selection, links, progress.
- `accent` (lime) is reserved for completion states and is not used on surfaces or buttons. Do not hard-code lime or orange in components.
- Semantic colors (emerald, amber, destructive) carry meaning only and are used sparingly.
- No hue gradients, gradient text, colored glows, colored shadows, or radial color washes. The only gradient allowed is the edge fade on horizontally scrollable tables and the photo-to-background mask on the home hero.
- Borders are hairlines from the `border` token. Dark mode depth comes from surface steps, not shadows.

## Layout

### Header

- One sticky top header.
- Left: 설레일 brand.
- Right: primary navigation and auth state.
- No desktop sidebar.
- Keep the Korean brand name visible on mobile; do not reduce the home link to an unexplained icon.
- Provide a keyboard-visible skip link targeting the main content.

### Page Shell

- Use `.page-shell`.
- Keep page width around 1220px.
- Use generous vertical rhythm on landing sections.
- Use compact grid spacing on operational pages.

### Cards

- Use `Card` for repeated items, framed tools, recommendation cards, and side panels.
- `glass-panel` is an opaque surface with a hairline border and a 1px neutral shadow. Blur is reserved for the sticky header and overlays.
- Avoid cards inside cards unless the nested card is a true repeated item. Use a hairline divider (`border-t`) inside a card instead.

## Components

### Buttons

- Primary buttons use the `primary` fill; hover is a slight opacity step (`hover:bg-primary/90`), never a lift or glow.
- Secondary buttons use the `card` surface with a border. Ghost buttons are for low-emphasis actions.
- Buttons use `rounded-lg`, `font-semibold`, a minimum 44px touch target, a tiny press scale (`active:scale-[0.98]`), and visible focus rings.
- Transition only color, background, border, opacity, and transform. Never `transition-all`.

### Inputs

- Use local shadcn-style primitives from `src/components/ui/field.tsx`.
- Inputs, selects, and date pickers should have:
  - token-based surface
  - border
  - subtle shadow
  - `focus-visible:ring`
  - disabled state
- Select uses Radix/shadcn-style `Select`, including styled option content.
- Date selection uses a shadcn-style popover date picker.
- Calendar month navigation keeps previous button, month caption, and next button aligned in one horizontal row. Both buttons expose their full 44×44px area as the click and touch target, and the caption must not intercept pointer input.

### Badges

- Neutral badges use muted surfaces with `rounded-md`. Highlight badges use `primary`-tinted surfaces. Avoid full-pill badges.
- Price confidence is shown with `ConfidenceBadge` / `ConfidenceDot` (`src/components/confidence-badge.tsx`). A filled dot means confirmed; a hollow dot means estimated or unconfirmed. Put the dot next to every price.

## Page Guidance

### Home

- Home is both landing page and starting point. The first viewport states what the product does ("국내 스키장, 이동 시간과 총비용으로 비교해요"), offers one primary action, and shows a real result.
- Layout: a full-height split. Text and the quick form sit on the page background; the ski photo fills the right ~60% with its left edge masked into the background. The result card straddles the bottom edge of the photo on desktop and stacks below the form on mobile.
- One primary action (date + departure quick form → `/recommendations`) and one quiet secondary link (`/plan`). No badge above the headline, no checkmark row, no second button.
- The result card uses real values from the recommendation engine (sample: Gangnam departure, 2 people, same day) with confidence dots, and falls back to fixed sample rows on failure.
- Below the hero: a data strip (resort count, rental shop count, latest price check date, computed from static data), three feature tiles (price confidence, checklist progress, share links), an FAQ accordion, and a plain final CTA band.
- Motion: one short fade-and-rise entrance on first load. No looping, floating, or parallax motion. Respect `prefers-reduced-motion`.

## Typography

- Pretendard Variable is the sole product typeface and is served locally.
- Weights are 400, 500, and 600 only. Hierarchy comes from size and color, not weight. No 700–900 headings.
- Headlines use `break-keep` and normal or slightly open tracking; never negative tracking on small text.
- Sentence case, no uppercase tracked labels, no English-only eyebrow labels when a clear Korean label exists.
- Short UI strings and headlines have no trailing period; multi-sentence paragraphs keep theirs.
- Body copy is at least 16px on mobile with 1.5 or greater line height. Secondary text is at least 12px (`text-xs`); sentence-length text is 14px (`text-sm`) or larger.
- Numbers use `tabular-nums`. Prices use `formatCurrency` (`₩289,984`) and ranges use `~`.
- Spacing sits on the 4px grid; avoid half-steps (`*-1.5`, `*-2.5`, `*-3.5`) except 2px nudges.

### Plan Form

- Keep sectioned form cards.
- Avoid overwhelming copy.
- The sticky submit area is acceptable on mobile and desktop.

### Recommendations

- Comparison first: a table of the three resorts (travel time, total range, confidence, rental count, main reason) sits above the cards, with the first column highlighted.
- Notices (default conditions, resorts not yet open, price-season context) are single quiet lines, not colored boxes.
- The first card is expanded: name, region and tags, up to three reasons, official links, and a side panel with the total once (with its confidence dot), the lift promotion note, and the create-trip action. Second and third are collapsed rows that expand to the same card.
- Do not expose internal score numbers.

### Trip Detail

- Separate overview, checklist, and cost/settlement into local workspace views.
- On desktop use a sticky local sidebar; on mobile use horizontally scrollable top tabs with at least 44px touch targets.
- Keep the current trip identity card visible while switching workspace views.
- Edit link warning should remain clear.
- Logged-in trip detail should say the trip is saved to "내 트립".

## Accessibility

- Labels must be connected to form controls.
- Focus rings must remain visible.
- Do not rely on color alone for status.
- Text must not overflow buttons or compact cards.
- Shared/edit/private states must be clearly worded.

## Validation

Routine UI validation:

```bash
pnpm typecheck
pnpm test
```

Do not run `pnpm build` for routine UI checks unless the user explicitly asks for build/deploy verification.
