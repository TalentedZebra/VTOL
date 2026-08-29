# Reference Design: Flightory Stallion VTOL

*A documented, real-world tilt-rotor tricopter that's a close match to this project's own layout — used here as a comparison point, not a conclusion. This page lays out the tradeoffs between building it as-is, going fully custom, or a semi-custom hybrid, so that decision stays a deliberate one rather than a default.*

*Everything below is grounded in Flightory's own product pages and manuals, a public build log, and general aerodynamic/structural scaling principles — not a recommendation. Where something couldn't be verified from a real source, it's flagged explicitly rather than guessed at, per this site's sourcing standard.*

## What the Stallion is

The [Flightory Stallion](https://flightory.com/product/stallion/) is a 3D-printed (LW-PLA + PETG) fixed-wing airframe — 1340mm wingspan, 990mm length, 1500–3000g AUW, Eppler E205 airfoil, V-tail, twin tractor motors on a single tail boom. The [Stallion VTOL conversion pack](https://flightory.com/product/stallion-vtol/) converts it to the same layout as this project: two wingtip motors that tilt, plus one fixed rear motor, on a SpeedyBee F405 Wing flight controller running ArduPilot. Recommended VTOL hardware is 3× Emax ECO II 2807 1300KV (or T-Motor F90 1300KV) motors, 3× BLHeli_S 45A ESCs, 2× Kingmax KM1203MD tilt servos, a 4S battery, and 7-inch props (2 CCW, 1 CW).

A public build log exists — [Spitfire76's FliteTest thread](https://forum.flitetest.com/index.php?threads/spitfire76s-build-log-of-flightorys-vtol-stallion.75671/) — running since April 2024 and still pre-flight as of its most recent post, including a mid-build switch from PLA to ASA for UV resistance and reprints after Flightory revised the files from V1 to V2. Treat that as one real data point on elapsed hobbyist build time, not a floor or a ceiling.

## 1. Build-as-is vs. fully custom vs. semi-custom

These are three genuinely different paths, not a spectrum with an obvious right answer — each trades cost and build time against how much of the aerodynamic and structural engineering is actually yours versus inherited from someone else's already-flying design.

| Path | File / design cost | Build time | Engineering you do yourself | Real risk |
|---|---|---|---|---|
| Buy & build as-is | $49.98 (base $34.99 + VTOL pack $14.99), plus electronics — roughly $350–500+ using Flightory's spec'd hardware, though a full parts-and-filament total couldn't be verified | Real but variable — the one public build log ran 1.5+ years and was still pre-flight | Almost none — airfoil, spar sizing, tail volume, and CG are all inherited from a design Flightory describes as CFD-validated | Lowest technical risk; residual risk is print quality, ArduPilot tiltrotor transition tuning, and file churn (the designer revising files mid-build) |
| Fully custom (Stallion as visual/dimensional reference only) | $0 in files, but unpriced design and prototyping-iteration time | Highest — design and analysis happen before the physical build even starts | All of it — airfoil choice, spar sizing, tail volume, and CG become your own analysis | Highest — a real chance of an underestimated spar, wrong tail volume, or CG error, since nobody has flown this exact airframe before |
| Semi-custom (start from Stallion files, modify specific things) | $34.99–49.98 in base files, plus your own modification effort | Between the other two, scaling with how much you change | Only what you touch — whatever you leave alone (e.g. the airfoil or tail volume) stays inherited | Proportional to what you change — untouched systems keep their proven margins; anything you resize or restructure reintroduces the custom path's risk for that one system |

This third path already has real precedent for this specific airframe: a third party ("SAMGO") publishes [modified parts for the Stallion VTOL on Printables](https://www.printables.com/model/982942-stallion-vtol-flightory-samgo-custom-parts). The page's content couldn't be fetched to confirm exactly what was changed, but its existence confirms community modification of this design is an established practice here, not a novel idea.

## 2. Does the Stallion scale down to our budget class?

Our own baseline assumptions are a ~700–900mm wingspan and a ~$450–1190 budget — well under the Stallion's native 1340mm/2–3kg class. Shrinking a design isn't a single effect; three separate physical properties change, and they don't all move the same direction.

- **Reynolds number — works against shrinking.** Reynolds number scales with chord × airspeed, so a proportional shrink lowers chord-based Re at a given cruise speed. The E205 is a low-Reynolds-number airfoil typically tested and used in roughly the 50,000–500,000 Re range. Scaling the airframe from 1340mm toward 700–900mm plausibly pushes chord-based Re toward or below the low end of that tested range, especially at loiter or low-throttle cruise — this needs an actual Re calculation against a real candidate chord and cruise speed, not an assumption in either direction.
- **Structural margin — works in favor of shrinking.** The square-cube law means an isometrically-scaled-down airframe gains structural margin relative to its size, not loses it — scaling *up* is the classically hard direction, not down. The more likely small-scale limiter is 3D-print wall thickness and dimensional tolerance becoming a larger fraction of a part, not spar strength.
- **Motor/prop availability — roughly neutral.** A 700–900mm-class airframe points toward 5–6″ propellers instead of the Stallion's 7″, and both sizes are common in the hobby — but hover thrust-to-weight has to be recalculated for whatever smaller motor/prop combination is chosen, not assumed to carry over from the Stallion's spec'd hardware.

No documented case of anyone actually building a scaled-down Stallion turned up in this research. Everything above is derived from applying general low-Reynolds-number aerodynamics and structural scaling principles to the Stallion's specific published numbers — not from a real build report at a smaller size. That gap matters: the Reynolds-number concern is real enough to check with an actual calculation before committing to a scaled-down E205 wing, not something to wave away or assume is fine either way.

## 3. Wing design fundamentals on this airframe

### Why Eppler E205

The E205 belongs to Richard Eppler's family of airfoils designed for low-Reynolds-number flight — RC aircraft, sailplanes, ultralights — and has been tested in the Selig/Princeton low-Reynolds-number airfoil database alongside similar low-Re foils (E214, E387, FX63-137). At the Stallion's stated 60–70 km/h cruise and 1340mm size, this is a standard, appropriate low-Re choice rather than an unusual one. No source found documents Flightory's specific reasoning for choosing E205 over other low-Re candidates — the case for it here is "it's a well-established fit for this flight regime," not a designer-stated rationale.

### What the V-tail buys

A V-tail can mean less interference drag and better spin recovery than a conventional tail of similar total area, since its geometry limits the blanketing effects that cause rudder lock. The real costs: no continuous spar carry-through across the V (each surface is its own structural cantilever, individually larger than a conventional tail's separate stabilizer/fin panels), which tends to make V-tails structurally heavier despite having fewer parts; adverse roll-yaw coupling; and higher sensitivity to a tail-heavy CG. On this specific airframe, no source directly ties the V-tail choice to the tricopter's rear-motor hover-yaw layout — it reads as a cruise-mode drag/packaging choice (single tail boom, less structure) rather than something driven by the VTOL conversion itself, since the rear motor (not the tail) provides hover yaw authority. That connection should be read as unconfirmed, not established.

### Carrying wingtip tilt-motor loads

The Stallion's own wing uses a 6mm carbon-tube main spar with a snap-fit wing root secured by hair-clip torsion springs. Exactly how the tilt-motor pivot mechanically interfaces with that spar — whether it's inboard of the spar tip, mounted through it, or otherwise — wasn't confirmed from the sources searched; that level of detail would need the manual's assembly diagrams or STEP files directly. More generally, tilt-rotor literature consistently identifies the wingtip nacelle (the tilt motor's mass plus its off-cruise-axis thrust vector during transition) as a bending-moment concentrator at the wing root and specifically at the tilt-pivot joint, since that joint carries both the aerodynamic bending load and the full motor-mount moment through a rotating interface. At least one FEA-validated tilt-rotor VTOL study found stress concentrating at fasteners rather than in the spar material itself — a generally useful lesson (the joints, not the spar, tend to be the practical failure point) rather than a confirmed detail of the Stallion specifically.

## What couldn't be verified

Flagged here rather than left implicit, per this site's sourcing standard:

- Exact ArduPilot frame-class/parameter settings for the Stallion VTOL — the manual PDFs exist but their text layer wasn't extractable during this research; worth opening them directly.
- A completed flight-test report, maiden-flight video, or post-flight review — the one build log found was still pre-flight.
- SAMGO's specific modifications to the Stallion VTOL on Printables (the listing exists; its contents couldn't be fetched).
- A full, verified electronics bill of materials — GPS module, battery, receiver, and filament cost were not priced here.
- Flightory's own stated reasoning for choosing the E205 airfoil specifically.
- Any documented build of the Stallion (or a close analog) at a smaller, 700–900mm-class scale.

## Further reading

- [Stallion — Flightory](https://flightory.com/product/stallion/)
- [Stallion VTOL Pack — Flightory](https://flightory.com/product/stallion-vtol/)
- [3D-Printed Stallion Drone — DroneXL](https://dronexl.co/2025/04/04/3d-printed-stallion-drone-diy-fixed-wing/)
- [Spitfire76's Build Log — FliteTest Forum](https://forum.flitetest.com/index.php?threads/spitfire76s-build-log-of-flightorys-vtol-stallion.75671/)
- [Stallion User Manual V2 (PDF)](https://flightory.com/wp-content/uploads/2025/02/STALLION-MANUALV2.pdf)
- [Stallion VTOL User Manual V2 (PDF)](https://flightory.com/wp-content/uploads/2025/02/STALLION-MANUAL-VTOL-V2.pdf)
- [SkyRaccoon — Stallion VTOL listing](https://www.skyraccoon.com/aircraft/Flightory_Stallion-VTOL_stallion)
- [Stallion VTOL Flightory SAMGO custom parts — Printables](https://www.printables.com/model/982942-stallion-vtol-flightory-samgo-custom-parts)
- [Eppler E205 airfoil details — Airfoil Tools](http://airfoiltools.com/airfoil/details?airfoil=e205-il)
- [Low Reynolds Number Airfoil Design and Wind Tunnel Testing at Princeton](https://link.springer.com/content/pdf/10.1007/978-3-642-84010-4_4.pdf)
- [Reynolds Number Effects on the Performance of Small-Scale Propellers — Deters, Ananda, Selig](https://m-selig.ae.illinois.edu/pubs/DetersAnandaSelig-2014-AIAA-2014-2151.pdf)
- [Design Process: V-Tails — KITPLANES](https://www.kitplanes.com/design-process-v-tails/)
- [Conventional vs. V-Tails — Charles River Radio Controllers](https://charlesriverrc.org/articles/design-and-construction/aircraft-design/tail-design-and-structure/conventional-vs-vtails/)
- [The Square-Cube Law and Scaling for RC Sailplanes — RC Soaring Digest](https://www.rcsoaringdigest.com/SquareCube.html)
- [Wing Cube Loading (WCL) — SEFSD](https://www.sefsd.org/general-interest/wing-cube-loading-wcl/)
- [Combination spar and trunnion structure for a tilt rotor aircraft (patent)](https://image-ppubs.uspto.gov/dirsearch-public/print/downloadPdf/8083172)
- [Design and Validation of a New Tilting Rotor VTOL Drone: Structural Optimization, Flight Dynamics, and PID Control — PMC](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC12158270/)
- [SpeedyBee F405 WING APP review — Oscar Liang](https://oscarliang.com/speedybee-f405-wing-app/)
- [Kingmax KM1203MD servo specs — ServoDatabase](https://servodatabase.com/servo/kingmax-hobby/km1203md)
