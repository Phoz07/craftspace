# 05: Value-Exchange Gate and Lead Capture with Database Persistence

**What to build:** A value-exchange modal triggered after the estimate calculation where clients submit their name, phone number, and optional LINE ID in exchange for their preliminary estimate slip and complimentary on-site measurement privilege. The system generates an obfuscated Reference Code (`#CS-YYMM-XXXX`) using a 30-character alphabet and persists the complete lead record to Neon PostgreSQL via Prisma ORM.

**Blocked by:** 04: Interactive 4-Step Cost Estimator Wizard UI

**Status:** ready-for-agent

- [ ] Value-exchange modal captures Customer Name, Phone Number, and optional LINE ID
- [ ] Validates Thai phone number format and required fields with friendly error messaging
- [ ] Generates unique obfuscated Ref ID matching `#CS-YYMM-XXXX` using the 30-character set without confusing characters (0/O, 1/I/l)
- [ ] Persists lead details, selected zones as JSON, and calculated price ranges to Neon Postgres via Prisma
- [ ] API endpoint handles errors gracefully and returns the created lead metadata with slip URL and prefilled LINE link
- [ ] Integration tests verify database insertion and schema compliance
