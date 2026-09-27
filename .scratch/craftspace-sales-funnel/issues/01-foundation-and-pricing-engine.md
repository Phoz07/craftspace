# 01: Foundation and Pricing Engine Tracer Bullet

**What to build:** A runnable Next.js 16 application with the CraftSpace Japandi/Modern Luxury design system and an automated calculation engine that computes realistic built-in renovation price ranges using decoupled property logistics and area scaling factors. Users can see live mathematical calculations for any property type, area size, and material grade, with hard floor limits and guard clauses for zero-zone selections.

**Blocked by:** None (can start immediately)

**Status:** closed

- [x] Next.js 16 App Router application boots cleanly with TypeScript, Tailwind CSS, and custom Japandi design tokens (warm oak, stone, linen, slate)
- [x] Pricing engine accurately computes: $\text{RawEst} = (\sum \text{BaseZoneCost}) \times M_{\text{property}} \times M_{\text{grade}} \times F_{\text{area}}$
- [x] Evaluates floor price of ฿120,000 when raw estimate falls below threshold
- [x] Sets estimated maximum to exactly 120% of estimated minimum
- [x] Guard clause returns ฿0 and blocks calculation when no decoration zones are selected
- [x] Pure automated contract tests verify calculation outcomes across all boundary conditions
