# 07: Omnichannel LINE Routing and Success View

**What to build:** A post-submission success view connecting the prospective client directly with the studio's sales designers. On mobile devices, a single tap opens the LINE app via deep link with the chat message prefilled with Ref ID and project scope. On desktop devices, a dynamic QR code modal enables instant smartphone camera scanning into the prefilled chat, accompanied by a copy-to-clipboard button and direct download action for the preliminary estimate slip.

**Blocked by:** 05: Value-Exchange Gate and Lead Capture with Database Persistence, 06: Server-side 9:16 Preliminary Cost Estimate Slip Generator

**Status:** ready-for-agent

- [ ] Success view displays confirmation of submission with issued Reference Code
- [ ] Mobile users get a 1-click deep link button opening LINE OA with encoded message payload
- [ ] Encoded payload contains Ref ID, property type, area, material grade, and estimated price range
- [ ] Desktop users see a modal with a dynamic QR code encoding the same deep link
- [ ] Desktop modal features a "Copy Message" button with visual clipboard confirmation
- [ ] Desktop modal clearly displays fallback LINE ID: `@craftspace` and link to open LINE PC
- [ ] Provides an instant "Download Estimate Slip" button fetching the 9:16 image from the slip generator
