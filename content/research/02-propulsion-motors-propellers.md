# Propulsion: Propellers, Motors, ESCs, and Batteries

## Propeller theory: how a spinning blade makes thrust

The simplest useful model is **momentum (actuator disk) theory**: treat the propeller as an infinitely thin disk that accelerates the air passing through it. The propeller takes in air at the free-stream velocity and accelerates it, and the thrust produced equals the rate of change of momentum of that air:

$$T = \dot{m} \, \Delta V$$

where ṁ is the mass flow rate of air through the disk and ΔV is the velocity increase it imparts. The power required to do this, in ideal hover (zero forward speed), works out to:

$$P = \frac{T^{3/2}}{\sqrt{2 \rho A}}$$

where A is the propeller's disk area (πr²) and ρ is air density. The term that matters most for a hobbyist: power required to hover scales with T^1.5, but drops with the **square root of disk area**. In plain terms — a bigger, slower-spinning propeller producing the same thrust is dramatically more power-efficient than a smaller, faster one. This is exactly why heavy-lift multirotors use big, low-kV motors with large props instead of small, screaming-fast ones, and it's the same reason your rear (hover-dedicated) motor benefits from being sized generously rather than minimally.

**Disk loading** (thrust ÷ disk area) is the practical way people compare this across aircraft: helicopters have low disk loading and are efficient hoverers; jets have effectively infinite disk loading and are terrible at hovering. Your tilt-rotor tricopter sits closer to the helicopter end of that spectrum in hover mode, which is exactly why VTOL hover is inherently power-hungry compared to cruise flight on the wing.

Real propellers lose some efficiency relative to this ideal (tip losses, blade drag, swirl in the wake) — actual **Blade Element Momentum Theory (BEMT)** accounts for this by analyzing each radial slice of the blade as its own small airfoil, which is what tools like eCalc are doing behind the scenes when you plug in a prop's diameter and pitch.

## Brushless motors: what kV actually means

A brushless DC motor has no brushes to wear out — instead, the ESC electronically switches (commutates) current through a set of stator windings in sequence, creating a rotating magnetic field that drags the permanent-magnet rotor around with it. This is why a brushless motor needs an ESC to run at all; it can't just be wired to a battery like a brushed motor.

**kV** is the motor's unloaded RPM per volt applied — a 1000kV motor free-spins at roughly 1000 RPM per volt (a 4S LiPo at ~16.8V fully charged would free-spin it near 16,800 RPM, before any propeller load pulls that down). Lower-kV motors are wound with more turns of thinner wire: more torque per amp, less RPM per volt — a better match for big, slow propellers. Higher-kV motors do the opposite — more RPM, less torque per amp — a match for small, fast propellers. Getting kV badly mismatched to your propeller is one of the most common first-build mistakes: too high a kV for your prop size and you'll draw excessive current and overheat the motor; too low and you'll be underpowered no matter how large a battery you strap on.

## ESCs

The Electronic Speed Controller reads a throttle command from the flight controller and switches the three motor phases on and off in the right sequence and timing (using either sensor feedback or, far more commonly on small aircraft, sensorless back-EMF detection) to spin the motor at the commanded speed. ESCs are rated by continuous/burst current — always leave real headroom between your calculated peak current draw and the ESC's rating, since running an ESC near its limit for sustained hover is a common cause of thermal failure mid-flight.

## Batteries: LiPo basics

Lithium polymer batteries are prized in RC/drone use for their high energy density and high discharge rates, at the cost of being genuinely more fire-prone than most consumer battery chemistries if damaged, punctured, over-discharged, or charged incorrectly.

Two numbers matter constantly:

- **Capacity (mAh)** — how much energy it stores; roughly, more capacity for the same cell count means more flight time but more weight.
- **C-rating** — the manufacturer's claimed continuous discharge rate as a multiple of capacity. A 1300mAh 30C pack can theoretically sustain 1.3A × 30 = 39A continuous. In practice, real-world sustained current is often lower than the printed rating, especially as the pack ages — treat C-ratings as optimistic marketing more than a lab-verified spec, and size with margin.

**Voltage sag** is the voltage drop under load — a fresh 4S pack reads about 16.8V resting but might sag to 14.5–15V under full hover throttle. This is normal, but it's also why your ESCs, motors, and flight controller failsafe voltages all need to account for sag rather than assuming resting voltage, and why a pack that seemed fine on the bench can trigger a low-voltage failsafe mid-hover.

## Further reading

- [NASA — Propeller Thrust](https://www.grc.nasa.gov/WWW/K-12/VirtualAero/BottleRocket/airplane/propth.html) — the momentum-theory derivation in NASA's own beginner format.
- [Static Thrust of Propellers (mh-aerotools)](https://www.mh-aerotools.de/airfoils/prpstati.htm) — a long-standing, detailed hobbyist-technical reference on real propeller performance.
- [Propeller theory (Wikipedia)](https://en.wikipedia.org/wiki/Propeller_theory) — a broader overview linking momentum theory to blade element theory.
- [Tyto Robotics — How Brushless Motors Work](https://www.tytorobotics.com/blogs/articles/how-brushless-motors-work) — clear technical explanation of commutation and kV.
- [Oscar Liang — LiPo Battery Guide](https://oscarliang.com/lipo-battery-guide/) — widely used, practically-oriented reference in the FPV/drone-building community.
- [eCalc](https://www.ecalc.ch/) — plug in real motor/prop/battery combinations and get BEMT-based performance predictions instead of hand-calculating.
