# Specification: CraftSpace Sales Engine & Interactive Cost Estimator

**Triage Label**: `ready-for-agent`

## Problem Statement

Property owners in Thailand planning interior renovation struggle with obscure pricing, hidden contractor markups, and misleading flat per-square-meter rate cards that disregard architectural constraints (ceiling heights, condo hauling rules, and multi-room variations). Consequently, prospective clients repeatedly inundate studio messaging channels with repetitive price inquiries, placing a heavy manual burden on sales administrators. Furthermore, the studio lacks an upfront qualification mechanism to distinguish high-intent clients with realistic budgets from casual window-shoppers, misses seamless handoffs into LINE Official Account (LINE OA) with pre-filled scope details, and lacks a centralized pipeline tracker to prevent leads from falling through the cracks.

## Solution

CraftSpace provides a high-converting, lightning-fast web application combining Japandi/Modern Luxury visual storytelling (interactive Before & After sliders, verified multi-category portfolio showcase) with an interactive 4-step Renovation Cost Estimator. Prospective clients receive an instant, ungated live price range calculation based on a realistic decoupled logistics-and-area formula, and can exchange basic contact details for a preliminary cost estimate slip and free site survey privilege. Upon submission, a unique obfuscated reference code (`#CS-YYMM-XXXX`) is issued, a server-rendered 9:16 digital receipt slip is generated without Thai font glyph defects, and omnichannel routing instantly bridges the lead into LINE OA with a pre-filled specification payload. Studio sales and design teams manage incoming demand via a password-protected dual-view (Table and Kanban) sales pipeline dashboard with quick telephone and LINE action buttons.

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

- **Architectural Shape & Runtime**: Next.js 16 (App Router, Server Components, Route Handlers, React 19, TypeScript) targeting 100% Free-tier serverless infrastructure (Vercel Serverless Hobby + Neon Serverless Postgres).
- **Styling Architecture**: Tailwind CSS with custom Japandi/Modern Luxury color tokens (Warm Oak, Cream, Sand, Charcoal slate), Lucide React iconography, and Framer Motion for micro-interactions and ticking counter transitions.
- **Decoupled Pricing Model**: Decoupled property logistics ($M_{\text{property}}$: CONDO=1.00, TOWNHOME=1.10, HOUSE=1.20) from area scaling ($F_{\text{area}}$: $\le 40$=1.00, 41–80=1.15, 81–150=1.30, $> 150$=1.45) with fixed floor price (฿120,000) and zero-zone guard clause:
  $$\text{RawEst} = \left(\sum \text{BaseZoneCost}\right) \times M_{\text{property}} \times M_{\text{grade}} \times F_{\text{area}}$$
  $$\text{Estimated Min} = \max(฿120,000,\; \text{RawEst})$$
  $$\text{Estimated Max} = \text{Estimated Min} \times 1.20$$
  Base Zone Costs: Living Room = ฿45,000, Bedroom = ฿55,000, Kitchen = ฿65,000, System & Ceiling = ฿25,000. Grade Multipliers: Standard = 1.00, Premium = 1.35, Luxury = 1.80.
- **Obfuscated Ref ID Generation**: `#CS-YYMM-XXXX` where `XXXX` is a 4-character string generated from an unambiguous 30-character alphabet (`23456789ABCDEFGHJKLMNPQRSTUVWXYZ`), yielding 810,000 unique permutations per calendar month without concurrency conflicts or business volume enumeration.
- **Serverless Image Generation**: Server-side image endpoint utilizing Satori and `@resvg/resvg-js` with local Thai font buffers (Prompt / Sarabun), delivering pixel-perfect 9:16 (1080x1920) PNG digital receipts without client-side Thai vowel shifting (สระลอย) defects.
- **Admin Passcode Authentication**: Passcode gate using cryptographic HMAC cookie signing via Next.js Middleware protecting internal administration routes and lead mutation endpoints without third-party OAuth lock-in.
- **Dual-View Sales Pipeline**: Administrative interface offering both Table View and Kanban Board with URL search parameter state synchronization (`?view=table|kanban`), quick tel/LINE dispatch buttons, and internal note logging modals.
- **Data Persistence Schema**:
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
- **API Contracts**:
  - `POST /api/leads`: Accepts customer contact and specification payload; validates input, computes price range, generates obfuscated Ref ID, persists record, and returns Ref ID, prefilled LINE deep link, and slip URL.
  - `GET /api/slip/[refCode]`: Validates ref code, renders 9:16 PNG receipt with embedded Thai fonts, brand watermark, and mandatory legal disclaimer.
  - `POST /api/admin/login`: Verifies studio passcode against environment variable and issues signed HTTP-only session cookie.
  - `GET /api/admin/leads`: Returns filtered leads by status or search keyword.
  - `PATCH /api/admin/leads/[id]`: Updates pipeline stage or appends internal notes.

## Testing Decisions

- **Testing Principles**: Only test external observable behavior across integration boundaries; avoid testing private implementation details or internal component states.
- **Seams to Test**:
  - **Highest Seam: HTTP & API Contract Seam**:
    - Pricing calculation contract: Pure input-to-output mathematical verification covering edge cases (Floor price, zero zones guard, multi-tier area and property multipliers).
    - Lead submission seam (`POST /api/leads`): Verify complete payload persistence, Ref ID format compliance, and response generation.
    - Slip generation seam (`GET /api/slip/[refCode]`): Verify successful 200 OK delivery with `image/png` content-type header and binary image payload.
    - Admin authentication & pipeline mutation seam (`/api/admin/*`): Verify rejection without valid passcode session and verify status transitions and note persistence.
- **Prior Art**: Standard API Route and Domain Unit test conventions in Next.js applications using Vitest.

## Out of Scope

- In-app live chat widget (LINE OA serves as the dedicated chat channel).
- Automated payment gateway or deposit processing.
- Multi-tenant studio authentication (system is designed for single-tenant studio deployment).
- 3D CAD room planning or web-based AR rendering.

## Further Notes

- All client-facing copy strictly uses "ใบสรุปงบประมาณประเมินเบื้องต้น (Preliminary Cost Estimate Slip)" and eliminates "BOQ" to prevent legal misinterpretations.
- Mandatory legal disclaimer is explicitly featured on both the estimate display and the downloadable receipt slip.
- All visual assets feature Japandi and Modern Luxury interior designs.
