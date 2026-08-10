# Korean Ski Design System

## Direction

Korean Ski supports both light mode and dark mode. Pretendard Variable is served locally and used across the whole product so Korean typography remains balanced at every weight and breakpoint.

The product connects an anticipatory ski-travel landing experience to a practical planning tool. Its visual idea is **Blue Run**: deep midnight slopes, vivid cobalt wayfinding, and a lift-safety lime accent. Operational screens stay compact and calm.

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

- Light background: near-white.
- Primary/action in both themes: vivid cobalt blue.
- Dark background: deep midnight blue.
- Lime accent: reserved for excitement, completion, and high-contrast landing CTA moments.
- Surface, border, muted, primary, and ring colors must come from CSS variables in `globals.css`.

Do not hard-code lime or orange in components. Use `primary`, `accent`, `ring`, `muted`, `card`, and `border` tokens so both themes work.

## Layout

### Header

- One sticky top header.
- Left: Korean Ski brand.
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
- Current default card style is an opaque, softly elevated `glass-panel`. Blur is reserved for navigation and overlays.
- Avoid cards inside cards unless the nested card is a true repeated item.

## Components

### Buttons

- Primary buttons use `primary` fill.
- Secondary buttons use translucent dark surface with border.
- Ghost buttons should be reserved for low-emphasis actions.
- Buttons use `rounded-xl`, bold text, a minimum 44px touch target, and visible focus rings.

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

- Neutral badges use muted surfaces.
- Positive/highlight badges use `primary`-tinted surfaces.

## Page Guidance

### Home

- Home is both landing page and starting point.
- It should communicate:
  - ski resort recommendation
  - date-based cost estimate
  - checklist tracking
  - optional login for trip recovery
- The first viewport should not feel empty on desktop.
- Use one short orchestrated hero entrance and subtle preview drift rather than scroll-jacking.
- The first viewport includes a direct plan CTA, resort browsing CTA, and low-friction trust cues.
- At 1280px and wider, keep the planner preview explicitly positioned on the right so it cannot be displaced by fluid display typography.
- Respect `prefers-reduced-motion`; motion is enhancement, never required to understand the page.

## Typography

- Pretendard Variable is the sole product typeface and is served locally.
- Korean display copy uses heavy weights with restrained negative tracking; body copy uses medium or semibold weights.
- Avoid English-only eyebrow labels when a clear Korean label is available.
- Body copy is at least 16px on mobile with 1.5 or greater line height.
- Prefer Korean labels and eyebrow copy throughout the Korean product experience.

### Plan Form

- Keep sectioned form cards.
- Avoid overwhelming copy.
- The sticky submit area is acceptable on mobile and desktop.

### Recommendations

- Use comparison-oriented layout.
- Show recommendation reason, travel time, cost range, rental count, and create-trip action.
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
