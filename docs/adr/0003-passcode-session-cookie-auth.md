# Passcode Cookie Authentication for Sales Pipeline Admin

The administrative dashboard (`/admin`) and lead management APIs (`/api/admin/*`) are protected using a studio passcode gate with signed HttpOnly cookies rather than external OAuth/Auth.js providers.

## Context and Decision
CraftSpace is operated by a dedicated internal sales and design team. Using an environment-configured `ADMIN_PASSCODE` with cryptographic cookie signing provides strong immediate PDPA data protection without requiring third-party OAuth infrastructure, user registration workflows, or external authentication vendor lock-in.
