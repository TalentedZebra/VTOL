# Airframe & Body Design

*This page covers the layout choices that sit above spar/material selection: fuselage and pod shape, tail configuration, nacelle/tilt-mechanism design, and wing planform. See Structures & Materials for how a wing actually resists bending once its shape is chosen.*

## Fuselage & body shape

Three broad approaches show up repeatedly in tilt-rotor tricopter designs:

- **Pod-and-boom** — a compact forward pod (battery, flight controller, payload) with a single tail boom running back to the tail surfaces and rear motor. Simple to build, easy to access internals, but a single boom is a single point of structural failure and has to carry both bending and the rear motor's thrust reaction.
- **Full fuselage** — a traditional enclosed body from nose to tail. More internal volume and a stiffer overall structure than a pod-and-boom, at the cost of more surface area (drag) and build complexity.
- **Flying-wing / lifting-body** — little or no distinct fuselage; the wing itself carries the electronics and payload internally. Both MiniHawk VTOL's "plank"-style wing and the Hackaday foam-board tilt-rotor tricopter (see the Landscape section) use this approach — it minimizes parts count and wetted area, at the cost of internal volume and often a less forgiving CG margin.

A related structural note specific to twin-boom layouts (two parallel booms instead of one, with the tail surface(s) spanning between them): they give a pusher or rear motor a shorter, cleaner path to clean air and can improve rearward visibility/access, but the booms themselves are typically shallower and less stiff than an equivalent single fuselage, and the configuration adds drag relative to a conventional single-body layout.

## Tail configuration options

This project's own reference build uses a V-tail (see Reference Design: Flightory Stallion VTOL for that specific tradeoff discussion) — but it's one of several real options:

- **Conventional tail** (separate horizontal + vertical stabilizer) — the simplest configuration that handles trim, stability, and control all at once; used on the large majority of full-scale aircraft for good reason. Straightforward to build and analyze, at the cost of one more part count than a V-tail.
- **T-tail** — horizontal stabilizer mounted atop the vertical fin, keeping it clear of any wake ahead of it. Adds weight higher up (raising CG) and can be more susceptible to deep stalls.
- **Cruciform tail** — horizontal surfaces mounted partway up the fin rather than at the very top or very bottom; keeps most of the T-tail's wake-clearance benefit with less of its weight/stall penalty.
- **V-tail (and X-tail)** — two angled surfaces combine pitch and yaw control through ruddervators, for fewer parts and typically less interference drag, at the cost of adverse roll-yaw coupling and no continuous structural carry-through between the two panels (each is its own cantilever).
- **Twin-tail / H-tail** — two vertical fins flanking a shared horizontal stabilizer; common where a pusher prop or fuselage-mounted sensor needs the tail moved off the centerline.

## Nacelle & tilt-mechanism design

The wingtip tilt nacelle is where this airframe type's design gets genuinely different from a standard fixed-wing. A few points that generalize across designs of this configuration:

- The tilt pivot has to carry the aerodynamic bending load coming in from the wing *and* the full motor-mount moment through what is, mechanically, a rotating joint — general tilt-rotor literature (see the Reference Design page's wingtip-spar discussion) consistently flags this joint, not the spar material itself, as the practical concentration point for stress and fastener loading.
- Tilt actuation is almost always a direct servo arm at the pivot axis in hobby-scale builds (simpler, fewer parts) rather than a geared or belt-driven mechanism (more mechanical advantage, more complexity) — geared/belt actuation shows up more often at larger, higher-torque scales.
- The tilt servo has to move a live, spinning motor mass against both aerodynamic loading and gyroscopic precession from the spinning prop, not just a static control surface — sizing servo torque/speed from a control-surface rule of thumb will undersize it. This is exactly why Phase 04 of the build manual calls out picking tilt servos with enough torque/speed margin specifically, rather than treating them like the elevon servos.

## Wing planform alternatives

This project's own build manual assumes a simple rectangular (constant-chord) wing for v1, which is a deliberate, forgiving choice, not the only option:

- **Rectangular / constant-chord** — simplest and cheapest to build; stalls root-first, so the ailerons/elevons stay effective and the aircraft tends to drop straight ahead rather than snap into a spin. The standard choice for trainers and first scratch-builds for exactly that reason.
- **Tapered** — structurally and aerodynamically more efficient than a constant-chord wing (better lift distribution for the same wing area and weight), but prone to tip-stalling before the root unless the designer builds in **washout** (a slight nose-down twist toward the tip) to force root-first stall behavior back in.
- **Swept** — lower drag at higher speeds, but handles poorly near stall and needs more stiffness to resist aeroelastic flutter; rarely worth the complexity at hobby tilt-rotor speeds.
- **Elliptical** — the planform shape that most closely produces the theoretically ideal (elliptical) lift distribution on its own, but is genuinely difficult to manufacture, which is why tapered wings (which can approximate the same lift distribution without the manufacturing difficulty) are far more common in practice.

## Further reading

- [Tail configuration — Wikipedia](https://en.wikipedia.org/wiki/Tail_configuration) — overview of conventional, T-tail, cruciform, V-tail, and twin-tail/twin-boom designs.
- [Twin-boom aircraft — Wikipedia](https://en.wikipedia.org/wiki/Twin-boom_aircraft) — advantages (pusher-prop clearance, rear access) and drawbacks (drag, boom stiffness) of the twin-boom layout.
- [Wing configuration — Wikipedia](https://en.wikipedia.org/wiki/Wing_configuration) — rectangular, tapered, elliptical, swept, and delta planform tradeoffs.
- [Washout (aeronautics) — Wikipedia](https://en.wikipedia.org/wiki/Washout_(aeronautics)) — why tapered wings need built-in twist to stall root-first.
- [What Are Tip Stalls? How Do They Form? — Flite Test](https://www.flitetest.com/articles/what-are-tip-stalls-how-do-they-form) — RC-specific, practical explanation of tip-stall risk and washout.
- [Wing Geometry Definitions — NASA Glenn Research Center](https://www.grc.nasa.gov/www/k-12/VirtualAero/BottleRocket/airplane/geom.html) — planform and aspect-ratio fundamentals.
