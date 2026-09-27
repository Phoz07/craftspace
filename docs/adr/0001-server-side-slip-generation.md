# Server-side Satori image generation for Thai Estimate Slips

To generate 9:16 (1080x1920) receipt slips without client-side Thai vowel shifting (สระลอย) and canvas cross-origin taint, we render slips server-side via Next.js `/api/slip/[refCode]` using Satori / Resvg with local Thai font buffers.

## Consequences
- Client bundle remains minimal (no heavy `html2canvas` bundle), preserving Fast LCP.
- Slips can serve dual purpose as dynamic OpenGraph social share previews.
- Requires server font assets to be packaged with the deployment.
