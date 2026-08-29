# Parts & Cost Snapshot

*Specific current products, vendors, and approximate prices — the perishable companion to the durable buying criteria in the Component Selection Guide. Use that page to judge any product against; use this one only as a dated example of what's actually on the shelf right now.*

**Snapshot as of August 29, 2026 — verify current pricing and availability before ordering.** Every product, price, and vendor listed below was real and independently checked at the time this page was written. Specific products go out of stock, get revised, and change price constantly in this hobby — treat everything here as a dated example, not a live catalog. If you're reading this more than a few months after the date above, re-verify before you order anything.

Two size classes, matching this project's own documentation: the ~700–900mm custom class this project originally budgeted around, and the Stallion-class ~1340mm build this project's v1 actually is (see Reference Design: Flightory Stallion VTOL). Quantities assume 3 motors, 3 ESCs, 2 tilt servos + 2 elevon/ruddervator servos, 1 flight controller, and 2 batteries — adjust for your own build.

## ~700–900mm custom class

| Category | Example product | Qty | Unit price | Subtotal | Source |
|---|---|---|---|---|---|
| Motor (tilt/rear) | EMAX ECO II 2306 2400KV | 3 | $19.49 | $58.47 | [RaceDayQuads](https://www.racedayquads.com/products/emax-eco-ii-2306-2400kv-motor) |
| ESC | T-Motor F35A single ESC (35A cont.) | 3 | $36.99 | $110.97 | [RaceDayQuads](https://www.racedayquads.com/products/t-motor-f35a-3-6s-am32-single-esc) |
| Tilt servo | Kingmax KM1203MD (9.5kg·cm, 0.08s/60°) | 2 | $35.00 | $70.00 | [Kingmax](https://www.kingmaxservos.com/all-products.html) |
| Elevon servo | TowerPro MG90S (2.0kg·cm) | 2 | $3.02 | $6.04 | [ReadyMadeRC](https://www.readymaderc.com/products/details/86506-towerpro-mg90s-metal-gear-servo-90-degree-rotation) |
| Flight controller | Teensy 4.0 (dRehmFlight) | 1 | $23.80 | $23.80 | [SparkFun](https://www.sparkfun.com/teensy-4-0.html) |
| Battery (4S) | RDQ Series 4S 1300mAh 100C | 2 | $28.49 | $56.98 | [RaceDayQuads](https://www.racedayquads.com/products/rdq-series-14-8v-4s-1300mah-100c-lipo-battery-xt60) |

**Electronics subtotal: $326.26** (airframe/fabrication cost not included — varies by design)

## Stallion class (~1340mm)

| Category | Example product | Qty | Unit price | Subtotal | Source |
|---|---|---|---|---|---|
| Motor (tilt/rear) | EMAX ECO II 2807 1300KV | 3 | $23.99 | $71.97 | [RaceDayQuads](https://www.racedayquads.com/products/emax-eco-ii-2807-1300kv-motor) |
| ESC | T-Motor F35A single ESC (35A cont.) | 3 | $36.99 | $110.97 | [RaceDayQuads](https://www.racedayquads.com/products/t-motor-f35a-3-6s-am32-single-esc) |
| Tilt servo | Kingmax KM1203MD (9.5kg·cm, 0.08s/60°) | 2 | $35.00 | $70.00 | [Kingmax](https://www.kingmaxservos.com/all-products.html) |
| Ruddervator servo | TowerPro MG90S (2.0kg·cm) | 2 | $3.02 | $6.04 | [ReadyMadeRC](https://www.readymaderc.com/products/details/86506-towerpro-mg90s-metal-gear-servo-90-degree-rotation) |
| Flight controller | SpeedyBee F405 WING APP (ArduPilot) | 1 | $47.99 | $47.99 | [RaceDayQuads](https://www.racedayquads.com/products/speedybee-f405-wing-app-fixed-wing-flight-controller) |
| Battery (4S) | Tattu 4S 5200mAh 35C | 2 | $85.49 | $170.98 | [RaceDayQuads](https://www.racedayquads.com/products/tattu-14-8v-4s-5200mah-35c-lipo-battery-xt60) |

**Electronics subtotal: $477.95** (add the Stallion's own $49.98 file cost — see Reference Design page)

## Caveats on this snapshot

- The T-Motor F35A ESC listed above is rated 35A continuous, slightly under Flightory's own 45A recommendation for the Stallion VTOL pack — it's included as a real, currently-available example, not a perfect spec match. A genuinely 45A+ single ESC exists (e.g. Lumenier 51A BLHeli_32), but its price could only be confirmed via search snippet (not independently fetched from the vendor page), and it was showing as backordered at the time of this research — check current availability before relying on it.
- GetFPV (one of this project's own cited vendors) blocks automated fetching, so nothing from GetFPV specifically is included here — RaceDayQuads, SparkFun, ReadyMadeRC, and Kingmax's own site are all directly, independently verified.
- No distinct smaller/cheaper tilt servo specific to the 700–900mm class was found during this research — the same Kingmax KM1203MD is listed for both classes as a genuinely reasonable part at both scales, not because a class-appropriate cheaper option doesn't exist.
- The ruddervator/tail-servo spec for the Stallion's V-tail specifically isn't documented anywhere found — the elevon-class servo listed for it is an approximation, not a confirmed Flightory recommendation.
