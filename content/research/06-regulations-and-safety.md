# Regulations & Safety

*Rules change — always re-check the FAA and AMA sources linked below before you fly, rather than treating this page as the final word. This reflects the rules as researched in 2026.*

## Recreational vs. Part 107

If you're flying this purely for personal enjoyment (not for any compensation, business use, or as part of paid work), you fall under the FAA's recreational flyer rules rather than needing a Part 107 Remote Pilot Certificate. The moment flying becomes connected to any compensation or business purpose, Part 107 applies instead — a real distinction, not a formality, and Part 107 pilots must register every aircraft regardless of weight.

## What recreational flying actually requires

- **TRUST certificate** — every recreational pilot must pass the free Recreational UAS Safety Test. It's untimed, you can't fail (you re-answer questions until you get 100%), and takes under half an hour. Do this before your first flight, not the week of it.
- **Registration** — required for any aircraft over 0.55 lb (250 g); a small tilt-rotor tricopter with motors, battery, and a flight controller will almost certainly clear that threshold. Registration is done through FAADroneZone, costs $5 (one-time, valid three years), and needs to happen before that first flight — budget it in, even though it's a small line item.
- **Remote ID** — aircraft requiring registration must broadcast Remote ID (a digital "license plate" broadcasting identification and location). Some modern flight controllers/GPS stacks support this natively; a bare-metal build like dRehmFlight (running on a Teensy) does not include Remote ID broadcast out of the box, so plan on either (a) adding a standalone broadcast module — realistically $40–150 depending on the unit — or (b) only ever flying within an FAA-Recognized Identification Area (FRIA), which exempts you from carrying Remote ID hardware entirely. Decide which path you're on before you order parts in Phase 04, not after — it's an easy line item to forget until it blocks your first flight.
- **Operating rules** — stay below 400 ft AGL, maintain visual line of sight without aids, don't fly over people or moving vehicles, yield right-of-way to manned aircraft, and get LAANC authorization before flying in controlled (Class B/C/D) airspace. Some areas — national parks, restricted zones like the Washington D.C. area — are off-limits entirely.

## Why an AMA-affiliated field is worth using

Academy of Model Aeronautics membership is inexpensive and, notably, typically includes liability insurance coverage while flying at AMA-sanctioned sites and events — meaningful for an experimental aircraft that's most likely to have something go wrong during exactly the phase you're testing (transition). Flying at a club field also usually means open, cleared airspace, other experienced builders around who can help spot problems before they become expensive, and — for a first VTOL specifically — the psychological benefit of not testing over your own or a neighbor's property.

For Texas A&M students, Brazos Valley R/C is the local AMA-affiliated club for the College Station/Bryan area and is worth contacting well before your first flight test, not the week you're ready to fly.

## Physical safety habits worth making automatic

- Treat every propeller as if it's about to spin the moment a battery is connected — never reach across, near, or through a prop arc with a battery plugged in, even "just to check something."
- Charge and store LiPo batteries in a fireproof bag or ammo-can-style container, away from anything flammable, and never charge unattended.
- Never fully discharge a LiPo pack (below ~3.0V/cell) — it degrades the cells and increases fire risk; most flight controllers can be configured to warn or fail-safe well above that.
- Do a full control-direction and range-of-motion check, and a battery voltage check, before every single flight — a written pre-flight checklist beats memory, especially once the routine feels familiar enough to get complacent about.

## Further reading

- [FAA Recreational Drone Pilot Rules (Pilot Institute overview)](https://pilotinstitute.com/recreational-drone-pilots-rules/) — a clear, currently-maintained summary; cross-check against the FAA's own site for anything decision-critical.
- [Academy of Model Aeronautics — Membership FAQ](https://www.modelaircraft.org/membershipfaqs)
- [AMA Insurance Plans](https://amablog.modelaircraft.org/blog/ama-insurance-plans/)
- [Brazos Valley R/C](https://flybvrc.com/) — the local College Station/Bryan flying club.
