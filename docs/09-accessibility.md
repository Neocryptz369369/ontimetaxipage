# Accessibility audit checklist

## Tier-specific requirements
- **Senior tier**: minimum font size 18pt; high-contrast theme available; voice prompts at each step.
- **WAV tier**: clear textual confirmation that vehicle is wheelchair-accessible.

## Apply to every Pressable
```tsx
import { a11yButton } from '../lib/a11y'
<Pressable {...a11yButton('Request ride', 'Submits a new ride request')}>…</Pressable>
```

## Color contrast — use only tokens from `lib/a11y.ts` for text vs background.

## Screen-reader checklist (per screen)
- [ ] Headers wrapped with `a11yHeader`
- [ ] All buttons have `accessibilityLabel` and (where non-obvious) `accessibilityHint`
- [ ] Images have descriptive labels
- [ ] Focus order is top→bottom, left→right
- [ ] No icon-only buttons without labels
- [ ] Forms announce validation errors via `accessibilityLiveRegion="polite"`

## Touch targets
- Minimum 44 × 44 px (iOS HIG / WCAG 2.5.5).

## Motion
- Honor `AccessibilityInfo.isReduceMotionEnabled()` for any non-essential animation.
