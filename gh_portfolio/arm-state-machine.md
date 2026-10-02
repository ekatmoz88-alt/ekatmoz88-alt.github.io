# Records Workstation · Sync State Machine

Anonymized. Desktop (SS) ↔ Mobile (MS) card sync.

| # | State | Next |
|---|-------|------|
| 1 | Idle | Export → DB |
| 2 | Exporting → DB | Await Import (MS) |
| 3 | Import on MS | Validating |
| 4 | Validating OK | Load to MS DB |
| 5 | Validation failed | Revert + log |
| 6 | Load OK | Mark Synced |
| 7 | SS Ack | Clear MS cache |
| 8 | Cache cleared | Idle |
| 9 | Conflict (both sides) | Manual resolve |
| 10 | Manual choice | Reload / Discard |

## Safety
- Grounding required before scanner operation
- No casing opening by operators
- Smart-card reader for authorized edits only

## Formatting
- ESKD-compliant drawing formats
- Abbreviation table in Appendix A

---
*Rendered from a transition table → state-diagram (Draw.io) for the user manual.*
🔒 System names, doc indices, and personnel names withheld (NDA).
