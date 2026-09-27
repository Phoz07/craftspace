# 08B: Admin Kanban Board and Lead Notes Modal

**What to build:** An interactive Kanban Board interface visualizing lead progression across all 5 operational pipeline stages (`NEW_LEAD`, `CONTACTED`, `SITE_SURVEY_SCHEDULED`, `WON`, `LOST`). Studio managers can drag or advance cards between stages, view relative time badges, open an internal notes modal to log customer preferences and site findings, and toggle between Table and Kanban views with URL search parameter persistence (`?view=table|kanban`).

**Blocked by:** 08A: Admin Passcode Authentication and Pipeline Table View

**Status:** ready-for-agent

- [ ] Dual-view toggle switches between Table View and Kanban Board
- [ ] View selection synchronizes with URL query parameter `?view=table|kanban` and survives page reloads
- [ ] Kanban Board displays 5 columns for pipeline stages (`NEW_LEAD`, `CONTACTED`, `SITE_SURVEY_SCHEDULED`, `WON`, `LOST`) with lead count indicators
- [ ] Each Kanban card presents Ref ID, Customer Name, Property & Area, Material Grade, Estimated Budget, and relative timestamp badge
- [ ] Cards support advancing or dragging across pipeline stages, updating the database status via API
- [ ] Lead Notes modal allows sales designers to record and update qualitative project notes
- [ ] Updates reflect immediately in both the Kanban Board and Table View
