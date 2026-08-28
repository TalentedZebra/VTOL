# Flight Control & PID Tuning

## What a flight controller is actually doing

At its core, a flight controller runs a loop, hundreds of times per second: read sensors (gyroscope, accelerometer, sometimes magnetometer/barometer/GPS/airspeed), estimate the aircraft's current attitude and rates from that noisy sensor data, compare that estimate to what the pilot (or autopilot) is commanding, compute a correction, and send updated commands to the motors and control surfaces. Everything else — GPS waypoints, stabilization modes, failsafes — is built on top of that basic loop.

**Sensor fusion** is the step of combining a gyroscope (which measures rotation rate very accurately over short timescales but drifts over time) with an accelerometer (which can sense the direction of gravity to correct that drift, but is noisy and gets confused by the aircraft's own acceleration). A complementary filter — a simple weighted blend that trusts the gyro in the short term and the accelerometer in the long term — is what dRehmFlight uses, and it's a great first filter to actually read the code for, since it's simple enough to fully understand rather than take on faith. More capable systems (including ArduPilot) use a full Extended Kalman Filter, which does the same job more rigorously by explicitly modeling sensor noise and uncertainty.

## PID control, term by term

A PID controller computes a correction as the sum of three terms based on the **error** (the difference between where you want to be and where you are):

$$u(t) = K_p e(t) + K_i \int_0^t e(\tau)\,d\tau + K_d \frac{de(t)}{dt}$$

- **Proportional (P)** — react in proportion to the current error, right now. This is the term that does most of the work; too little P and the aircraft feels sluggish and mushy, too much and it oscillates.
- **Integral (I)** — accumulate error over time and correct for it. This is what eliminates steady-state error — for example, a persistent trim offset from a slightly heavy wingtip that P alone would never fully correct, because P only reacts to error that still exists right now. Too much I causes slow, growing oscillations ("wind-up").
- **Derivative (D)** — react to how fast the error is changing, which acts as a brake against overshoot. Too little D and the aircraft overshoots and bounces around the target; too much D amplifies sensor noise into visible motor jitter, since D is mathematically a rate-of-change calculation and rate-of-change amplifies noise.

## Why tuning is done incrementally, one axis at a time

Pitch, roll, and yaw each get their own PID gains, and hover-mode gains are usually tuned completely separately from cruise-mode gains, because the aircraft's dynamics genuinely change between the two (different effective control authority, different disturbance sources, different mass distribution relative to the control inputs). The standard practical tuning method — and the one built into most guided tuning workflows — is: start with only P, raise it until you see the first hint of oscillation, back off slightly, then bring in D to damp overshoot, then bring in just enough I to kill any remaining steady-state drift. Changing more than one gain at a time makes it far harder to tell which change caused which behavior, which is why "one axis, one gain, one small change at a time" is the rule almost every tuning guide repeats.

## Rate mode vs. attitude mode

Most flight controllers offer at least two stabilization levels: **rate mode**, where stick input commands a rotation *rate* and the aircraft will keep rotating as long as you hold the stick (this is usually what acro/manual mode is doing), and **attitude/self-level mode**, where stick input commands a target *angle* and an outer control loop holds that angle, automatically leveling when the stick is centered. A cascaded controller — an outer attitude loop whose output feeds into an inner rate loop — is the typical structure. For a first hover, self-level/attitude-hold modes are far more forgiving to fly and to debug than rate mode.

## Gain scheduling across flight modes

Because your tilt-rotor's control authority genuinely changes with tilt angle and airspeed (differential thrust dominates in hover, control surfaces dominate in cruise, and both partially work during transition), a single fixed set of PID gains rarely performs equally well everywhere in the envelope. This is why more mature VTOL implementations schedule or blend gains as a function of tilt angle/airspeed rather than using one static tune for the whole flight — something worth planning for once your basic hover and cruise tunes are each independently solid.

## Further reading

- [Purdue ECE 382 — An Introduction to PID Controllers (PDF)](https://engineering.purdue.edu/~zak/ECE_382-Fall_2018/IntroPID_16.pdf) — a rigorous but readable university-level treatment of the math.
- [Oscar Liang — FPV Drone PID Explained](https://oscarliang.com/pid/) — tuning intuition and symptoms-to-gain-adjustment mapping, written for exactly this kind of aircraft.
- [APMonitor — Proportional Integral Derivative (PID)](https://apmonitor.com/pdc/index.php/Main/ProportionalIntegralDerivative) — interactive control-theory reference with simulations.
- [dRehmFlight source (GitHub)](https://github.com/nickrehm/dRehmFlight) — read the actual control loop and complementary filter implementation; there's no substitute for reading real, working code.
