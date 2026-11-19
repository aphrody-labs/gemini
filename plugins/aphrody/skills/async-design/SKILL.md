---
name: "async-design"
description: "Design and review asynchronous code in Rust (tokio, futures, Pin) and Bun/JavaScript (Bun.serve, promises, streams, workers): structured concurrency, future size, cancellation, backpressure, work stealing, readiness versus completion I/O, io_uring and IOCP choices. Use when writing or reviewing an async server, scheduler, channel pipeline or event-loop code."
---

# async-design

Theory, measurements and sources: `$WORKSPACE_ROOT/ay/docs/science/async.md`; OS limits: `.../os.md`; open language work: `.../compilers-languages.md`.
Online: https://github.com/aphrody-dev/ay/tree/main/docs/science. Numbers for sizing: skill `perf-math`.

## Checklist

1. **Scope**: every spawned task has an owner that awaits it (`JoinSet`, `tokio::select!` over a handle, `Promise.all`/`AbortSignal`). No detached tasks in libraries.
2. **Cancellation**: dropping a future cancels it at an `.await`; make each await point safe to stop (no half-applied state, guard with RAII or do the mutation after the last await). In JS pass an `AbortSignal` down and honour it.
3. **Blocking**: nothing blocking on an async worker (file or CPU work in `spawn_blocking`/rayon, or a Bun `Worker`). One blocked worker lowers capacity: `c_eff = c - b`. A synchronous loop in a `Bun.serve` handler stalls every connection (measured: 0.2 ms spin gives saturation near 3.6k req/s on one thread).
4. **Backpressure**: every queue is bounded. Rust: `mpsc::channel(n)`, `Semaphore`, `Stream` with demand; JS: stream `highWaterMark`, honour `write()` return and `drain`. Overload is shed at admission (503) with a budgeted, jittered retry on the client. Unbounded queue turns overload into unbounded latency.
5. **Future size**: `size_of_val(&fut)` for hot futures. Locals live across `.await` are stored; end their scope before the await (measured: two arrays in function scope, 1024 B + 2048 B, give a 3075 B future; scoped, about 2051 B). `Box::pin` large futures; recursive `async fn` needs boxing.
6. **Send bounds**: a future spawned on a multi-thread runtime must be `Send`: no `std::sync::MutexGuard`, `Rc`, or non-Send locals across `.await`. Generic async-fn-in-trait cannot yet name `Send` for its return future without return type notation (check the current status in `compilers-languages.md` before relying on it).
7. **Locks**: never hold a sync lock across `.await`; use `tokio::sync::Mutex` only when the critical section awaits; prefer message passing to a single owner task.
8. **Fan-out**: tail latency `P(slow) = 1-(1-q)^n`; q=0.01, n=100 gives 63%. Hedge or time-box fan-out calls.
9. **Timeouts everywhere**: every network await has a deadline; deadlines propagate (pass the remaining budget, not a fresh timeout).
10. **Idempotency**: retries and at-least-once delivery need idempotency keys (two generals, FLP: see `limits.md`).

## Choosing the I/O model

| Platform  | Use                                                                                              | Note                                                                               |
| --------- | ------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------- |
| Linux     | epoll via the runtime; io_uring only if the kernel probe and `kernel.io_uring_disabled` allow it | syscalls per request 2 + 1/E (epoll) vs 2/B (io_uring); security record in `os.md` |
| Windows   | IOCP (the runtime does it)                                                                       | IoRing is Windows 11 only and file-only                                            |
| macOS/BSD | kqueue                                                                                           | readiness only; disk I/O uses a thread pool                                        |

Do not adopt io_uring because it is faster in theory: count syscalls (`strace -c -f`) and measure on the target first.

## Bun specifics

- One JS thread per event loop; scale with `Worker`s or several processes (`reusePort`), not threads in one loop. Microtasks and `process.nextTick` drain after each macrotask.
- Prefer `Bun.serve` + `Response` streaming over Node shims; keep handlers non-blocking; offload CPU to `Worker` or `Bun.spawn`.
- Model a single-thread server as one server (M/G/1): measure service time with `bun $WORKSPACE_ROOT/ay/tools/serve-closed-loop.ts`, then size from `perf-math`.

## Tokio specifics

- Multi-thread scheduler: per-worker local queue (256), LIFO slot, global injection queue, steal half. Do not rely on the LIFO slot for fairness.
- Pooled workers behave like M/M/c: at rho 0.8 with 8 workers, 46% of requests wait but mean wait is 0.57 ms for 2 ms service (worked in `async.md` 7.2).
- Use `tokio-console` or `tokio-metrics` to see poll durations; a poll longer than about 100 microseconds is a blocking bug.

## Review questions

What bounds the queue? Who owns each task? What happens on cancel at every await? What is the service time and utilisation at peak? What is shed first?
