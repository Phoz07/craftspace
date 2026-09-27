# 08A: Admin Passcode Authentication and Pipeline Table View

**What to build:** A secure studio sales administration interface protected by a passcode gate with signed HTTP-only session cookies. Sales representatives can view all inbound leads in a dense, searchable Table View, filter leads by status, trigger direct phone calls (`tel:`) and LINE conversations in one click, export records to CSV, and start with 12 realistic seed leads covering every pipeline stage.

**Blocked by:** 05: Value-Exchange Gate and Lead Capture with Database Persistence

**Status:** ready-for-agent

- [ ] `/admin/login` interface verifies studio passcode against environment variable
- [ ] Successful authentication sets a signed HTTP-only cookie protecting `/admin` and `/api/admin/*`
- [ ] Next.js middleware guards admin routes, redirecting unauthenticated sessions to login
- [ ] Database seeder script creates 12 realistic mock leads spanning all pipeline stages (`NEW_LEAD`, `CONTACTED`, `SITE_SURVEY_SCHEDULED`, `WON`, `LOST`)
- [ ] Table View displays creation date, Ref ID, Customer Name, Phone Number, Property Type, Area, Selected Zones, and Estimated Price
- [ ] Includes keyword search (filtering by phone number or Ref ID) and status filter pills
- [ ] Each lead row provides 1-click action buttons to dial (`tel:`) and open LINE chat
- [ ] Supports exporting the filtered table to CSV format
