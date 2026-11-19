---
name: "perf-math"
description: "Performance laws and measurement discipline for Bun and Rust work: Little's law, Amdahl, Gustafson, Universal Scalability Law, queueing (M/M/1/K, M/M/c, M/G/1), work-span, plus how to measure with hyperfine, criterion and Bun mitata scripts. Use before claiming a speedup, sizing a worker pool, setting a queue bound, or interpreting a load test."
---

# perf-math

Derivations, worked numbers and sources: `$WORKSPACE_ROOT/ay/docs/science/async.md` (section 6 laws, section 7 queueing) and
`.../limits.md`. Calculator and tests: `bun $WORKSPACE_ROOT/ay/tools/science.ts` (prints worked examples; `fit <file>` fits the USL from
"N X" lines). Online: https://github.com/aphrody-dev/ay/tree/main/docs/science

## Laws (use the smallest that answers the question)

- Little: `L = lambda * W`, any stable system. Closed loop with C clients: `W = C/X - Z`. Use it to cross-check any load test (X*W must equal C).
- Amdahl (fixed problem): `S(N) = 1 / ((1-p) + p/N)`, ceiling `1/(1-p)`. p=0.95: S(8)=5.93, S(64)=15.42, ceiling 20.
- Gustafson (fixed time): `S(N) = N - alpha (N-1)`. alpha=0.05, N=64: 60.85.
- USL: `C(N) = N / (1 + sigma (N-1) + kappa N (N-1))`, peak at `N* = sqrt((1-sigma)/kappa)`. Beyond N* throughput falls. Fit from >= 6 points.
- Work-span: `T_P >= max(T1/P, Tinf)`; greedy `<= T1/P + Tinf`; speedup cap is `T1/Tinf`.
- M/M/1/K (bounded queue): `P_K = (1-rho) rho^K / (1 - rho^(K+1))`; `lambda_eff = lambda (1-P_K)`.
- M/M/c (pooled workers): Erlang C `C(c,a)`, `Wq = C/(c mu - lambda)`, `P(Wq>t) = C exp(-(c mu - lambda) t)`.
- M/G/1: `Wq = rho s (1 + cs2) / (2 (1 - rho))`; cs2 = 0 deterministic, 1 exponential. Near rho=0.95 queueing dominates: keep rho <= 0.7 for latency goals.

## Procedure before any performance claim

1. State the hypothesis as a number (metric, workload, expected change). Name the law that predicts it.
2. Measure the baseline on the target machine; record CPU, OS, tool versions, power plan. Close noisy processes; expect 10-25% run-to-run spread on a shared desktop.
3. Change one thing. Re-measure. Report mean, spread and run count. A difference smaller than the spread is not a result.
4. Compare to the prediction; if it misses, the model's input (service time, serial fraction) was wrong: measure it, do not tune the model.

## Tools

- Commands and scripts: `hyperfine -N -w 3 -r 20 --export-json out.json 'cmd A' 'cmd B'` (`-N` no shell, `-w` warm-ups, `-r` runs;
  `--prepare` to reset state; compare means, check `stddev`). Use `-S` only when shell syntax is needed.
- Rust micro-benchmarks: criterion (`cargo bench`, `--save-baseline main` then `--baseline main` to compare; it reports confidence intervals and
  change significance). Instruction counts without noise: iai-callgrind. Compiler and std regressions: perf.rust-lang.org (see `rust-upstream`).
- Bun/JS micro-benchmarks: there is no `bun bench` subcommand (verified 2026-11-17, "Script not found"). Upstream benchmarks are mitata scripts run as
  `bun run <name>` from `bench/` after `bun install` there (`BUN=path/to/bun bun run <name>` selects the binary). Write `bench(name, fn)` / `group` /
  `summary` with mitata; compare `bun`, `node`, `deno` on the same script. Always run a release build, never `bun bd` debug.
- Load tests: closed loop finds capacity (`bun $WORKSPACE_ROOT/ay/tools/serve-closed-loop.ts`, wrk, oha, bombardier); open loop at fixed arrival rate gives
  latency under load (closed loops hide queueing: coordinated omission). Report p50/p99/p99.9, not only the mean.
- System view: `perf stat` (Linux), `strace -c -f` for syscall counts, ETW/WPA on Windows, Instruments on macOS.

## Sizing recipes

- Worker pool: measure service time s, target rho <= 0.7, `c >= lambda s / 0.7`; check `P(Wq > SLO)` with Erlang C.
- Queue bound: K from latency budget `K ~ SLO * mu`; overload then sheds `(rho-1)/rho` instead of growing latency.
- Retries: offered load multiplies by `sum p^i`; budget retries (10% of traffic) and add jitter.
- Parallelising: measure p (serial share) first; if `1/(1-p)` is below the needed speedup, parallelism is the wrong lever.

## Pitfalls

Debug builds; cold caches in one arm only; benchmarking the optimiser's dead-code elimination (use `black_box` in Rust, return values in JS);
averaging percentiles; reporting a speedup without the run count; load generator on the same saturated core as the server.
