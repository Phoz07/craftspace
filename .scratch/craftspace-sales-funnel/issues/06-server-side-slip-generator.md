# 06: Server-side 9:16 Preliminary Cost Estimate Slip Generator

**What to build:** A server-side image generation endpoint that renders a photo-ready 9:16 (1080x1920) PNG preliminary cost estimate slip for any valid Reference Code using Satori and Resvg. Embedded Thai fonts prevent glyph-shifting and floating vowel issues, and the slip presents the customer's name, Ref ID, property specifications, material grade, price range, brand watermark, and mandatory legal disclaimer.

**Blocked by:** 05: Value-Exchange Gate and Lead Capture with Database Persistence

**Status:** ready-for-agent

- [ ] Route handler renders a 1080x1920 9:16 image output with `image/png` header
- [ ] Font buffer integrates Thai fonts (Prompt/Sarabun) with zero vowel-overlapping or glyph corruption
- [ ] Displays Ref ID, Customer Name, Property Type, Usable Area, Selected Zones, and Material Grade
- [ ] Clearly renders estimated price range (Min – Max)
- [ ] Prominently includes studio branding watermark and date of issuance
- [ ] Incorporates mandatory legal disclaimer stating the estimate is non-binding
- [ ] Automated tests verify 200 OK status, PNG signature bytes, and 404 behavior for invalid Ref IDs
