# Korean Ski Design System

## Direction

Korean Ski uses a practical dark-mode trip planner interface.

The product should feel like a modern travel planning tool, not a marketing landing page. The visual direction is inspired by dense ski-trip dashboards: dark surfaces, compact information cards, sharp contrast, and a warm action color.

## Core Principles

- Use one top header. Do not use a persistent sidebar for the MVP.
- Dark mode is the default visual mode.
- Keep the original product flow: home, plan form, recommendations, trip detail, share page.
- Prioritize dense but readable trip information.
- Avoid decorative-only UI. Every visible block should help planning, comparing, booking, or checking status.
- Mobile remains first-class. Desktop can expand into two-column comparison layouts.

## Color Tokens

Use CSS variables from `src/app/globals.css`.

- Background: deep charcoal violet.
- Surface: translucent dark card.
- Border: low-contrast violet gray.
- Primary/action: orange.
- Muted text: cool gray.
- Success/progress should use the same orange family unless semantic green is truly needed.

Do not reintroduce the previous lime accent as the main product color.

## Layout

### Header

- One sticky top header.
- Left: Korean Ski brand.
- Right: primary navigation and auth state.
- No desktop sidebar.

### Page Shell

- Use `.page-shell`.
- Keep page width around 1220px.
- Use generous vertical rhythm on landing sections.
- Use compact grid spacing on operational pages.

### Cards

- Use `Card` for repeated items, framed tools, recommendation cards, and side panels.
- Current default card style is `glass-panel`.
- Avoid cards inside cards unless the nested card is a true repeated item.

## Components

### Buttons

- Primary buttons use orange fill.
- Secondary buttons use translucent dark surface with border.
- Ghost buttons should be reserved for low-emphasis actions.
- Buttons use `rounded-lg`, bold text, and visible focus rings.

### Inputs

- Use local shadcn-style primitives from `src/components/ui/field.tsx`.
- Inputs and selects should have:
  - dark surface
  - border
  - subtle shadow
  - `focus-visible:ring`
  - disabled state
- Native `select` must use a custom chevron.
- Native `date` inputs are acceptable for MVP but must use the same input class.

### Badges

- Neutral badges use muted surfaces.
- Positive/highlight badges use orange-tinted surfaces.
- Avoid lime badges unless a future semantic state needs green specifically.

## Page Guidance

### Home

- Home is both landing page and starting point.
- It should communicate:
  - ski resort recommendation
  - date-based cost estimate
  - checklist tracking
  - optional login for trip recovery
- The first viewport should not feel empty on desktop.

### Plan Form

- Keep sectioned form cards.
- Avoid overwhelming copy.
- The sticky submit area is acceptable on mobile and desktop.

### Recommendations

- Use comparison-oriented layout.
- Show recommendation reason, travel time, cost range, rental count, and create-trip action.
- Do not expose internal score numbers.

### Trip Detail

- Keep checklist and progress visible.
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

