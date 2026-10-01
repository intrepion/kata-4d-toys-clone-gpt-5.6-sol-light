# Use reproducible bounded simulation

Simulation will use fixed time steps, seeded procedural behavior, and versioned Experiment Files so identical actions produce materially equivalent outcomes within documented tolerances. We deliberately do not promise bit-identical floating-point results across browsers; mathematical invariants, saved state, and player-visible behavior define correctness instead.
