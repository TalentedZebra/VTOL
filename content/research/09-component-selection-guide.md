# Component Selection Guide

*How to actually evaluate and compare real motors, ESCs, servos, flight controllers, and batteries — the criteria and common mistakes that stay true regardless of which specific products exist when you're reading this. For the underlying physics of what these parts do, see Propulsion: Propellers, Motors, ESCs & Batteries; this page is the comparison/buying layer on top of that theory.*

## Motors

Hobby brushless motors are conventionally sized with a 4-digit stator code (e.g. 2807): the first two digits are stator width in mm, the last two are stator height — a quick way to compare physical motor size across brands before even looking at kV.

The single most useful sizing rule of thumb: total maximum thrust across all motors should be at least **2× the aircraft's all-up weight**, giving margin for wind, maneuvering, and battery sag rather than a bare hover-at-full-throttle design. Don't size off kV and wattage alone — a specific kV rating tells you almost nothing about real thrust without knowing the propeller and voltage it's paired with. Reputable motor manufacturers publish actual bench-test thrust/current/efficiency tables across multiple prop and voltage combinations; use those over a kV number and a marketing thrust claim whenever they're available.

**Common mistake:** trusting a motor's advertised max thrust figure without checking what prop and voltage it was tested at — the number on the box is frequently a best-case combination you may not be running.

## ESCs

Pick continuous current rating with real headroom above your calculated peak draw, not right at the edge of it — sustained hover is the highest-current flight mode this airframe sees, and an ESC run near its limit for minutes at a time is a common cause of in-flight thermal failure that a quick bench test won't reveal. Larger MOSFETs generally mean more current/voltage headroom and better tolerance of voltage spikes, which matters more as cell count goes up (a 6S setup stresses an ESC's MOSFETs harder than 4S at the same current).

Firmware matters too: **BLHeli_S** is older 8-bit firmware still common on budget ESCs; **AM32** is a modern, actively-developed open-source replacement; **BLHeli_32** is the most feature-rich option (bidirectional telemetry, RPM-based filtering) but is closed-source and had its development and licensing terminated in 2024, per firmware-comparison reporting available at time of writing — re-check the current state of BLHeli_32 support before depending on it for a new build. AM32 is the actively-maintained, open path if firmware longevity matters to you.

**Common mistake:** sizing an ESC's current rating off manufacturer-claimed *burst* current rather than *continuous* current — hover is a sustained load, not a burst.

## Servos

Two numbers define a servo: **torque** (commonly kg·cm) and **speed** (seconds per 60° of rotation) — and they trade against each other within a given servo class and voltage. Voltage class matters directly: standard analog servos (roughly 4.8–6V) are cheaper and slower; digital or "HV" (high-voltage, roughly 6–8.4V) servos cost more but deliver meaningfully more torque and speed from the same physical size. Metal gears resist stripping under sustained or shock loading better than plastic/nylon gears, at added cost and weight.

This project's own build has two genuinely different servo jobs, and sizing them the same way is a mistake: elevon/control-surface servos only fight aerodynamic hinge moments, while **tilt-mechanism servos** have to move a live, spinning motor mass against both aerodynamic loading and gyroscopic precession — see Airframe & Body Design for why that's a structurally different job. Size tilt servos from their actual working load, not from a generic "servo for a plane this size" rule of thumb.

**Common mistake:** reusing a control-surface torque/speed spec for a tilt servo, then discovering in testing that it can't hold the nacelle steady against prop torque and vibration in hover.

## Flight controllers

Beyond raw processing power, the criteria that actually matter for this airframe type: enough PWM/servo outputs for two tilt servos, elevons, and however many motor channels your layout needs (a board designed for a simple quad will often come up short); an active, documented firmware ecosystem behind it (dRehmFlight or ArduPilot, in this project's case — see the build manual's own flight-controller decision for the reasoning behind that specific choice, which isn't repeated here since it's a project-specific decision, not a general selection criterion); and genuinely active maintenance and community support, since a board whose firmware has gone stale is a real long-term risk even if its specs look fine on paper today.

**Common mistake:** picking a flight-controller board based on processor specs alone, then discovering mid-build that it doesn't have enough physical outputs for a tilt-rotor's servo/motor count.

## Batteries

Treat printed capacity and C-rating as a starting point, not a guarantee — both are manufacturer-claimed numbers, and real-world sustained discharge is often lower than the label, especially as a pack ages. Where possible, weight your buying decision toward brands and packs with independent, bench-tested discharge reviews (RC community forums and reviewers regularly publish exactly this kind of independent verification) over an unfamiliar brand's aggressive-sounding C-rating claim alone. For the actual sizing methodology (how capacity and C-rating translate into your specific flight-time and current-draw targets), see Phase 03 of the build manual and the eCalc tools already referenced there.

**Common mistake:** choosing a pack purely on its advertised C-rating number without checking whether that number has ever been independently verified for that specific brand/pack.

## Further reading

- [How to Choose FPV Drone Motors — Oscar Liang](https://oscarliang.com/motors/)
- [How to Choose the Best ESC for FPV Drones — Oscar Liang](https://oscarliang.com/esc/)
- [BLHeli_32 ESC Firmware Overview — Oscar Liang](https://oscarliang.com/blheli-32-overview/)
- [BLHeli32, AM32, and BLHeli_S ESCs — ArduPilot Copter documentation](https://ardupilot.org/copter/docs/common-blheli32-passthru.html)
- [ServoDatabase](https://servodatabase.com/) — searchable servo specs (torque, speed, voltage, gear material) for real comparison across brands.
- [eCalc](https://www.ecalc.ch/) — plug in real motor/prop/battery combinations for BEMT-based performance predictions.
