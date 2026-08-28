# Aerodynamics & Airfoil Design

## What an airfoil actually is

An airfoil is the cross-sectional shape of a wing, seen edge-on. A few terms you'll see constantly:

- **Chord line** — the straight line from the leading edge (front) to the trailing edge (back).
- **Camber** — how much the airfoil's centerline curves away from the chord line. A flat-bottomed airfoil has camber only on top; a symmetric airfoil has none.
- **Thickness** — the airfoil's maximum height as a percentage of chord (a "12% airfoil" is 12% as thick as it is long).
- **Angle of attack (AoA)** — the angle between the chord line and the oncoming air. This is the variable a pilot (or autopilot) actually controls in flight, by pitching the aircraft.

## How lift is actually generated

The short, correct version: **a wing generates lift by deflecting air downward**. By Newton's third law, if the wing pushes air down, the air pushes the wing up. The pressure difference between the wing's upper and lower surfaces — lower pressure on top, higher on the bottom — is the mechanism by which that downward deflection happens, and it's real and measurable, but it's a *description* of the same phenomenon, not a separate cause.

Worth knowing explicitly: the popular "equal transit time" explanation — that air splitting at the leading edge must recombine at the trailing edge at the same time, so it has to speed up over the curved top surface — is **wrong**, and NASA and pilot-training sources both call it out directly. Air moving over the top of a wing arrives at the trailing edge well before the corresponding air molecule under the wing. The real reason the flow over the top accelerates is tied to the airfoil's curvature and the pressure field it creates, which is genuinely more subtle than the popular explanation suggests — this is one of the most commonly mis-taught topics in aerodynamics, so it's worth reading the NASA source below rather than the first blog post you find.

## The lift equation

$$L = \tfrac{1}{2} \, \rho \, V^2 \, S \, C_L$$

- **L** — lift force
- **ρ (rho)** — air density (drops with altitude and temperature; at College Station elevation/typical flying temps this is close to sea-level standard, ~1.225 kg/m³, but it matters more once you're doing serious performance calculations)
- **V** — airspeed
- **S** — wing reference area
- **C_L** — the lift coefficient: a dimensionless number that bundles up everything about the airfoil's shape and its current angle of attack

Two things fall directly out of this equation that matter for your build: lift scales with the **square** of airspeed (double your speed, get 4x the lift at the same angle of attack — which is exactly why a VTOL needs so much more rotor thrust at zero airspeed than wing lift once it's cruising), and lift scales linearly with wing area, which is one of your few free design levers when you're sizing the airframe in Phase 03.

C_L itself rises roughly linearly with angle of attack up to a point — then the flow separates from the upper surface, C_L drops sharply, and the wing **stalls**. This happens at a fairly consistent *angle*, not a fixed *speed* — a common misconception. A heavier aircraft or one pulling more g just stalls at a higher airspeed for the same critical angle of attack.

## Reynolds number: why small RC aircraft don't fly like airliners

Reynolds number (Re = ρVc/μ, where c is chord length and μ is air viscosity) describes the ratio of inertial to viscous forces in the flow. A full-size airliner wing operates around Re = 10–50 million. A small VTOL like the one you're building, flying a few chord-lengths at modest speed, operates around Re = 50,000–300,000 — two to three orders of magnitude lower.

This matters more than it sounds like it should. At low Reynolds numbers, the airflow is much more prone to separating from the surface before it reaches the trailing edge (laminar separation), which is why "textbook" thick, high-camber airfoils that work great on full-size aircraft often perform poorly at model scale, and why a lot of successful small-scale designs use thinner airfoils with modest camber instead. This is also why the UIUC Applied Aerodynamics Group built and maintains an airfoil database specifically wind-tunnel-tested at these low Reynolds numbers — it's the right place to pull real airfoil coordinates and polar data from, rather than guessing from a general-aviation airfoil chart.

## Why this matters specifically for your tilt-rotor tricopter

Your wing has to do two very different jobs: sit nearly motionless in the propwash during hover (where its lift is mostly irrelevant and its main job is to not stall the tilt-motor flow across it) and generate efficient lift during cruise. That's part of why a flat-bottomed or slightly undercambered airfoil is a common, forgiving choice for small hybrid VTOLs — it's tolerant of a wide angle-of-attack range and doesn't demand a precisely-built, sharp leading edge the way a high-performance thin airfoil does.

## Further reading

- [NASA Glenn — Lift](https://www1.grc.nasa.gov/beginners-guide-to-aeronautics/lift-3/) and [Factors That Affect Lift](https://www1.grc.nasa.gov/beginners-guide-to-aeronautics/factors-that-affect-lift/) — the authoritative, correct explanation of lift generation.
- [NASA Glenn — Beginner's Guide to Aeronautics (full site)](https://www1.grc.nasa.gov/beginners-guide-to-aeronautics/bga-site-map/) — the whole reference site; worth bookmarking.
- [Pilot Institute — What Is an Airfoil? How Lift Is Generated](https://pilotinstitute.com/what-is-an-airfoil/) — a very readable companion explanation aimed at pilots, not engineers.
- [UIUC Airfoil Data Site](https://m-selig.ae.illinois.edu/ads.html) and its [coordinate database](https://m-selig.ae.illinois.edu/ads/coord_database.html) — real wind-tunnel-tested airfoil coordinates and polars, many at model-aircraft Reynolds numbers.
- [XFLR5](https://xflr5.org/xflr5-is-a-free-aerodynamic-analysis/) — free tool to run your own lift/drag analysis on candidate airfoils at your specific Reynolds number.
