# Structures & Materials

## Wing loading: the single number that most shapes how an aircraft flies

Wing loading is simply weight divided by wing area (W/S). It's the number most responsible for how forgiving an aircraft is to fly: low wing loading means the wing has plenty of area for the aircraft's weight, so it flies slowly, stalls gently, and tolerates a wide margin of angle-of-attack and speed. High wing loading means faster stall speed, faster cruise speed, and less margin for error — the traditional trade-off traded for efficiency and speed in larger, faster aircraft.

For a first hybrid VTOL, biasing toward lower wing loading than you might otherwise pick is a reasonable trade — it buys you a wider, more forgiving transition speed window (see the transition-aerodynamics content) at some cost in outright cruise efficiency, which is exactly the right trade to make while you're still learning to fly and tune the thing.

A related, more scale-aware metric used a lot in the RC community is **wing cube loading** (weight ÷ (wing area)^1.5), which corrects for the fact that a simple weight/area ratio doesn't scale fairly between very different-sized aircraft — worth knowing the name of if you go looking for comparison numbers against other builds.

## Spars, bending, and why the wing doesn't just snap

In level flight, the wing's lift is distributed along its span, while the wing's weight — and everything hanging off structurally supported points — acts as concentrated loads. This creates a **bending moment**: the further out from the fuselage you go, the more the accumulated lift from everything outboard of that point is trying to bend the wing upward at the root. The wing's structural job is to resist that bending without excessive flex or failure, and in almost all wing designs — full-scale or model — that job is done primarily by a **spar**: a stiff beam running spanwise, usually positioned near the point of maximum airfoil thickness where it has the most structural depth to work with.

The intuitive version of why spar *material* placement matters: bending resistance comes overwhelmingly from material placed far from the neutral bending axis (the top and bottom "caps" of the spar), while the material connecting them (the "web") mostly just needs to resist shear, not bending, directly. This is why efficient spars — in balsa builders' box-spars, in composite I-beam spars, in aluminum wing spars alike — put strong material at the top and bottom and lighter material in between, rather than being a uniformly solid beam.

For a tilt-rotor tricopter specifically, remember that the wingtip-mounted tilt nacelles introduce their own significant point loads (motor thrust and the servo torque needed to tilt them) right where a normal fixed-wing design usually has none — that mounting point deserves deliberate reinforcement, not an afterthought, since it's simultaneously carrying aerodynamic bending load and a dynamic, vibrating thrust load.

## Material choices for a first build

- **3D-printed PLA/PETG** — the most common choice for a first scratch-built hybrid VTOL (it's what MiniHawk VTOL and many similar open designs use). Cheap, fast to iterate, and design freedom for organic shapes like tilt nacelles that would be hard to build from sheet materials. Trade-offs: heavier per unit strength than balsa or composite, and layer-line weakness means print orientation and infill pattern matter for anything load-bearing (a spar-equivalent internal structure, printed in the right orientation, matters more than raw infill percentage).
- **Balsa/foam built-up structure** — lighter for the same strength in experienced hands, the traditional RC construction method, but demands more building skill and doesn't lend itself as naturally to complex tilt-mechanism geometry.
- **Carbon fiber reinforcement** — even a thin CF strip or tube added along a 3D-printed or foam spar dramatically increases stiffness for very little added weight; a common and worthwhile upgrade once v1 has proven the geometry.

## Weight and CG budgeting

Keep a running spreadsheet of every component's mass and its position relative to a fixed reference point (e.g., the nose) from the moment you start Phase 03 sizing through the end of fabrication. Center of gravity (CG) position is not just a performance detail — an aircraft with CG too far aft can be dangerously unstable in pitch, and one too far forward may not have enough elevator/elevon authority to flare or maintain level flight at low speed. Re-verify actual CG by physically balancing the finished airframe before the first flight; a spreadsheet estimate and the real, built aircraft frequently disagree by more than people expect.

## Further reading

- [AeroToolbox — Introduction to Wing Structural Design](https://aerotoolbox.com/wing-structural-design/) — a clear, modern treatment of spar/rib structural roles.
- [Bending Moments in RC wings (ciurpita.tripod.com)](https://ciurpita.tripod.com/rc/rcsd/bendMom/bendMom.html) and [Strength of Wings](https://ciurpita.tripod.com/rc/notes/wingStrength.html) — long-standing, RC-specific structural references from the aeromodeling community.
- [Understanding Wing Loading and Its Effect on RC Model Aircraft](https://medium.com/@neelaydeshmukhtp1/understanding-wing-loading-how-it-affects-your-rc-model-aircraft-be3fc8ea8ec3) — an approachable, RC-focused explainer.
