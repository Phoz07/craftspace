# Specification: CraftSpace Interior & Built-in Studio Sales Engine

**Status**: ready-for-agent  
**Context**: High-Conversion Sales Page + Interactive Renovation Cost Estimator  
**Target Infrastructure**: Vercel Serverless (Hobby Free-tier) + Neon Serverless Postgres (Free-tier)  

---

## Problem Statement

Home and condominium owners in Thailand seeking built-in interior renovation face widespread pricing obscurity and the "Sq.m. Fallacy" (misleading flat per-square-meter rate cards that fail to account for room functions, material durability, or vertical delivery constraints). Consequently, prospective clients repeatedly inquire on social channels with repetitive questions, inundating studio design administrators with low-intent queries. Conversely, the studio struggles to qualify inbound leads upfront, lacks a frictionless digital receipt handoff into LINE Official Account (LINE OA), and suffers from disjointed spreadsheet tracking of lead pipeline stages.

## Solution

CraftSpace provides a high-converting, lightning-fast web application combining Japandi/Modern Luxury visual storytelling (Before & After interactive comparisons, verified portfolio showcase) with an interactive 4-step Renovation Cost Estimator. Prospective clients receive an instant, ungated live price range calculation based on a realistic decoupled logistics-and-area formula, and can exchange basic contact details for a preliminary cost estimate slip and free site survey privilege. Upon submission, a unique obfuscated reference code (`#CS-YYMM-XXXX`) is issued, a server-rendered 9:16 digital receipt slip is generated without Thai font glyph defects, and omnichannel routing instantly bridges the lead into LINE OA with a pre-filled specification payload. Studio sales and design teams manage the incoming demand via a password-protected dual-view (Table and Kanban) sales pipeline dashboard with quick telephone and LINE action buttons.

## User Stories

1. As a condominium owner, I want to view an interactive Before & After slider comparing an empty bare shell room to a finished Japandi built-in living area, so that I can immediately visualize the transformative quality of CraftSpace.
2. As a prospective client visiting from mobile ads, I want the landing page to load under 1.8 seconds with zero layout shifts, so that I don't abandon the site due to slow performance.
3. As a homeowner, I want to filter the studio's portfolio by property type (Condominium, Townhome, Single-detached House) and design style (Minimal Japandi, Modern Luxury, Contemporary Classic), so that I can inspect real projects matching my residence.
4. As a homeowner, I want to see actual floor area, verified project duration, and actual realized budget on each portfolio showcase item, so that I can benchmark realistic expectations for my own project.
5. As a prospective client, I want to smoothly scroll directly to the cost estimator by tapping the primary hero CTA, so that I don't waste time looking for the estimation tool.
6. As a prospective client, I want to select my property type in Step 1 of the wizard, so that the pricing engine accurately accounts for vertical hauling logistics and ceiling heights.
7. As a prospective client, I want to adjust my usable floor area between 20 and 250+ sq.m. using an intuitive slider and numeric input, so that the estimate reflects my exact space.
8. As a prospective client, I want to multi-select specific decoration zones (Main Living Area, Master Bedroom, Kitchen, System & Ceiling) in Step 2, so that I only pay for the areas I plan to renovate.
9. As a prospective client, I want to read clear microcopy explaining that each zone represents a primary master package, so that I understand secondary bedrooms can be appended during site surveys without feeling misled.
10. As a prospective client, I want to select my preferred material grade (Standard, Premium, Luxury) in Step 4, so that I can align the woodwork finish and European hardware fittings with my budget.
11. As a prospective client, I want the live price display to animate and tick in real-time as I change options, so that I receive immediate feedback on cost implications.
12. As a prospective client, I want the wizard to disable progression and show ฿0 if no decoration zones are selected, so that I am prevented from submitting an empty or meaningless calculation.
13. As a budget-conscious client, I want to view my estimated price range immediately without being forced to enter personal contact details, so that trust is established without premature gating.
14. As an interested homeowner, I want to enter my name, phone number, and optional LINE ID to claim a preliminary estimate slip and complimentary on-site measurement, so that I receive tangible value in exchange for my contact details.
15. As a mobile client who submitted an estimate, I want to tap a single button to open LINE OA with my Ref ID and specification details pre-populated in the chat input, so that I can initiate consultation with zero repetitive typing.
16. As a desktop client who submitted an estimate, I want to scan a dynamic QR code with my smartphone camera to open the LINE OA chat with pre-filled text, so that I experience seamless cross-device handover.
17. As a desktop client, I want to easily copy my estimate summary text to the clipboard and view the studio's official LINE ID (`@craftspace`), so that I have a reliable fallback if mobile QR scanning fails.
18. As a client, I want to save a high-resolution 9:16 (1080x1920) photo-ready preliminary estimate slip with clean Thai typography, studio branding, and clear legal disclaimers, so that I can share it with family members or store it for reference.
19. As a studio administrator, I want to log into the sales pipeline dashboard using a secure studio passcode, so that customer personal data and phone numbers are protected from unauthorized public access.
20. As a sales agent, I want to view all incoming leads in a high-density table view with search and status filtering, so that I can quickly locate customer phone numbers and initiate callbacks.
21. As a sales agent, I want one-click action buttons on lead rows to directly dial (`tel:`) or open LINE chat, so that I can contact new leads within minutes of submission.
22. As a studio director, I want to switch to a Kanban board view displaying leads categorized across pipeline stages (`NEW_LEAD`, `CONTACTED`, `SITE_SURVEY_SCHEDULED`, `WON`, `LOST`), so that I can monitor conversion flow and pipeline health.
23. As an administrator, I want my active view mode (Table vs Kanban) to persist across browser reloads via URL parameters, so that my workflow context is never disrupted.
24. As a sales consultant, I want to append internal notes to any lead record, so that customer lifestyle preferences and site survey observations are permanently logged.
25. As a sales administrator, I want to export filtered lead records to CSV format, so that accounting and external marketing teams can perform downstream reporting.

## Implementation Decisions

### Modules & Architecture
- **Web Application Framework**: Next.js 16 (App Router, Server Components, Route Handlers, React 19, TypeScript).
- **Styling & UI Components**: Tailwind CSS configured with custom Japandi/Modern Luxury color tokens (Warm Oak, Cream, Sand, Charcoal slate), Lucide React iconography, and Framer Motion for micro-interactions and ticking counter transitions.
- **Database & Persistence**: Neon Serverless PostgreSQL consumed via Prisma ORM (`@prisma/client` with pooled connections compatible with Vercel Serverless execution).
- **Image & Slip Generation Engine**: Serverless image generation endpoint using Satori and `@resvg/resvg-js`, bundling local TTF font buffers (Prompt / Sarabun) to ensure 100% pixel-perfect Thai typography and prevent client-side "สระลอย" (floating vowel) defects.
- **Authentication & Authorization**: Studio passcode gate using cryptographic HMAC cookie signing via Next.js Middleware protecting `/admin` and `/api/admin/*`.

### Pricing Calculation Model
$$\text{RawEst} = \left(\sum \text{BaseZoneCost}\right) \times M_{\text{property}} \times M_{\text{grade}} \times F_{\text{area}}$$
$$\text{Estimated Min} = \max(฿120,000,\; \text{RawEst})$$
$$\text{Estimated Max} = \text{Estimated Min} \times 1.20$$

- $M_{\text{property}}$: CONDO = 1.00, TOWNHOME = 1.10, HOUSE = 1.20
- $F_{\text{area}}$: $\le 40$ sq.m. = 1.00, 41–80 sq.m. = 1.15, 81–150 sq.m. = 1.30, $> 150$ sq.m. = 1.45
- $M_{\text{grade}}$: STANDARD = 1.00, PREMIUM = 1.35, LUXURY = 1.80
- Base Zone Costs: Living Room = ฿45,000, Bedroom = ฿55,000, Kitchen = ฿65,000, System & Ceiling = ฿25,000
- Floor Price: ฿120,000 baseline studio floor
- Guard Clause: When selected zones sum to 0, output is ฿0 and progression is gated.

### Reference ID Cryptography
- Format: `#CS-YYMM-XXXX`
- Alphabet: `23456789ABCDEFGHJKLMNPQRSTUVWXYZ` (30 unambiguous uppercase alphanumeric characters; omitting 0, O, 1, I, l).
- Collision space: $30^4 = 810,000$ combinations per month.

### Database Schema Shape (Prototype Schema)
```prisma
enum LeadStatus {
  NEW_LEAD
  CONTACTED
  SITE_SURVEY_SCHEDULED
  WON
  LOST
}

model Lead {
  id              String     @id @default(uuid())
  refCode         String     @unique // e.g. CS-2609-7X2K
  customerName    String
  phoneNumber     String
  lineId          String?
  propertyType    String     // CONDO, TOWNHOME, HOUSE
  areaSqm         Float
  selectedZones   Json       // Array of string keys
  materialGrade   String     // STANDARD, PREMIUM, LUXURY
  estimatedMin    Int
  estimatedMax    Int
  status          LeadStatus @default(NEW_LEAD)
  notes           String?
  createdAt       DateTime   @default(now())
  updatedAt       DateTime   @updatedAt
}
```

### API Contracts
1. `POST /api/leads`:
   - Request Body: `{ customerName, phoneNumber, lineId, propertyType, areaSqm, selectedZones, materialGrade }`
   - Response: `{ success: true, lead: { refCode, estimatedMin, estimatedMax, lineDeepLink, slipUrl } }`
2. `GET /api/slip/[refCode]`:
   - Response: `image/png` binary (1080x1920) with Thai typography and watermarked studio branding.
3. `POST /api/admin/login`:
   - Request Body: `{ passcode }`
   - Response: Sets signed HTTP-only cookie `craftspace_admin_session`.
4. `GET /api/admin/leads`:
   - Query: `?status=&search=&view=`
   - Response: `{ leads: Lead[] }`
5. `PATCH /api/admin/leads/[id]`:
   - Request Body: `{ status?: LeadStatus, notes?: string }`
   - Response: `{ success: true, lead: Lead }`

## Testing Decisions

- **Testing Principles**: Only test external observable behavior across integration boundaries; never test internal component states or private implementation trivia.
- **Core Seams to Test**:
  1. **Pricing Engine Contract Seam**: Pure mathematical behavior verifying floor prices, decoupled property/area multipliers, grade ratios, and zero-zone guard clauses.
  2. **Lead Submission & Ref ID Generation Seam**: End-to-end API verification ensuring valid data produces unique obfuscated ref codes and stores JSONB zone arrays properly.
  3. **Admin Authentication & Authorization Seam**: Middleware gate ensuring unauthorized requests receive 401/redirects while valid passcode cookies permit status mutations.
  4. **Slip Generator Endpoint Seam**: Ensuring `/api/slip/[refCode]` returns a 200 response with valid PNG headers.

## Out of Scope

- Automated payment gateway integration (credit card or promptpay deposits).
- Real-time customer chat inside the web app (LINE OA is the dedicated communication channel).
- Multi-tenant studio account registration (CraftSpace is single-tenant for this studio).
- Full 3D room CAD modeling or interactive AR rendering.

## Further Notes

- All legal disclaimers strictly state that estimates are preliminary guidelines and do not constitute official binding quotations or BOQs.
- All portfolio photography and Before/After slider visual assets use Japandi and Modern Luxury interior design aesthetics.
