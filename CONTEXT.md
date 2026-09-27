# CraftSpace Domain Context

High-conversion sales page and interactive cost estimation engine for interior built-in design, qualifying inbound leads and streamlining sales handover to LINE OA.

## Language

**Lead**:
A prospective client who has completed the estimator form and submitted their contact information for consultation.
_Avoid_: User, visitor, prospect

**Preliminary Cost Estimate Slip (ใบสรุปงบประมาณประเมินเบื้องต้น)**:
A non-binding digital summary receipt containing the customer's selected specifications, reference code, estimated price range, and legal disclaimer.
_Avoid_: BOQ, quotation, official quotation, invoice, contract

**Reference Code (Ref ID)**:
A unique human-readable tracking identifier assigned to each submitted estimate formatted as `#CS-YYMM-XXXX` using an unambiguous 30-character alphabet (`23456789ABCDEFGHJKLMNPQRSTUVWXYZ`).
_Avoid_: Lead ID, order number, ticket ID

**Property Type Multiplier ($M_{\text{property}}$)**:
A cost adjustment factor reflecting vertical logistics and structural ceiling heights (Condo: 1.00, Townhome: 1.10, House: 1.20).
_Avoid_: Building factor, difficulty fee

**Area Scale Factor ($F_{\text{area}}$)**:
A graduated scale factor based on usable floor area ($\le 40$ sqm: 1.00, 41-80 sqm: 1.15, 81-150 sqm: 1.30, > 150 sqm: 1.45).
_Avoid_: Size multiplier, discount curve

**Decoration Zone**:
A primary functional area of the home selected for built-in carpentry and interior works, scoped to one primary/master room per category (Main Living Area, Master Bedroom, Kitchen, System & Ceiling).
_Avoid_: Room, secondary room, section, category

**Material Grade**:
The quality tier of wood boards, surface laminates, and hardware fittings (Standard: 1.00, Premium: 1.35, Luxury: 1.80).
_Avoid_: Quality level, package, tier

**Sales Pipeline**:
The operational stages through which a lead progresses from initial estimate submission to project kickoff (`NEW_LEAD`, `CONTACTED`, `SITE_SURVEY_SCHEDULED`, `WON`, `LOST`).
_Avoid_: Funnel, CRM stages

**Lead Note**:
Internal qualitative intelligence recorded by the studio sales and design team regarding customer preferences, schedule constraints, and site requirements.
_Avoid_: Comment, feedback, message

**Mandatory Legal Disclaimer**:
"หมายเหตุ: ตัวเลขนี้เป็นการประเมินงบประมาณเบื้องต้นจากสเปกมาตรฐาน ไม่ใช่ใบเสนอราคาผูกมัด (Official Quotation) ราคาจริงอาจปรับเปลี่ยนตามสภาพพื้นที่จริงและฟังก์ชันเฉพาะบุคคล"
