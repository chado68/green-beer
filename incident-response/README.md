# Incident Response section

Static pages for the CSI Cyber Solutions incident response offering. Self-contained
(own stylesheet and scripts) so it can sit beside the main site without conflicts.

| Page | Purpose |
| --- | --- |
| `index.html` | IR overview, triage process, priority levels, third-party IR oversight |
| `intake.html` | Triage intake form with a provisional P1-P4 priority score |
| `retainers.html` | Retainer tiers (Essentials, Professional, Enterprise) |

## Before launch

1. **Form endpoint**: create a form at Formspree (or any service that accepts a JSON
   POST), then set `FORM_ENDPOINT` in `assets/ir-config.js`. Until then the form
   validates and shows the priority but sends nothing.
2. **Hotline and email**: set `HOTLINE_DISPLAY`, `HOTLINE_TEL` and `IR_EMAIL` in
   `assets/ir-config.js`. The `(702) 555-0100` and `ir@example.com` values are
   placeholders (also written into the HTML as no-JS fallbacks, so search and replace
   those too).
3. **Pricing**: everything on `retainers.html` is placeholder pricing.
4. **Response targets**: confirm the P1-P4 callback times on `index.html` and
   `retainers.html` are ones you can staff.
5. **Styling**: once the main site's layout lands, swap the tokens at the top of
   `assets/ir.css` and the header/footer markup to match.

## Priority scoring (`assets/ir-intake.js`)

Points: operations stopped +4 (degraded +2), attacker still active +3 (unknown +1),
ransomware +3, data stolen +2 (unknown +1), regulated data +2, critical systems
(identity, POS, gaming, OT) +2, widespread +2 (several systems +1).
Bands: 9+ P1, 6-8 P2, 3-5 P3, 0-2 P4. The result is sent with the submission as
`computed_priority`.
