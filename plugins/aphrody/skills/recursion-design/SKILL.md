---
name: "recursion-design"
description: "Design and review recursion and recursive data structures in Rust and JavaScript/Bun: stack depth bounds, tail calls and Rust `become`, JSC proper tail calls, trampolines, CPS, memoisation and dynamic programming, divide-and-conquer recurrences, recursion schemes, termination measures and well-founded induction. Use when writing a recursive algorithm, parser, tree walk, interpreter or fixing a stack overflow."
---

# recursion-design

Derivations, measurements and sources: `$WORKSPACE_ROOT/ay/docs/science/recursion.md`; limits (halting, Rice): `.../limits.md`;
`become` status: `.../compilers-languages.md`. Online: https://github.com/aphrody-dev/ay/tree/main/docs/science

## Checklist

1. **Measure of decrease**: write the quantity that strictly decreases in a well-founded order (size, structural subterm, lexicographic pair). No measure, no recursion.
2. **Depth bound**: `d_max = floor(S/F)`. Measured frame 112 B (Rust, one small array): 8 MiB gives 74,898 calls; 2 MiB (Rust spawned thread) 18,724; 1 MiB (Windows main) 9,362. JavaScriptCore overflowed a tiny function at about 40,000 calls. If depth can be Theta(n) on untrusted input, it is a DoS bug.
3. **Remove the depth** (pick the first that fits):
   a loop (accumulator); an explicit heap stack (defunctionalised continuation); a guaranteed tail call; a trampoline (return a thunk, loop).
4. **Tail calls are guaranteed only here**: strict-mode JavaScript in Bun/JSC (measured: 10,000,001 tail calls fine, non-tail overflow at 39,908), Wasm `return_call`, LLVM `musttail`, Rust `become` (unstable `explicit_tail_calls`, RFC 3407). Plain Rust and V8 do not guarantee them: never rely on the optimiser.
5. **Divide and conquer**: recurse into the smaller part, loop on the larger; depth <= log2 n. Cost from the master theorem `T(n)=aT(n/b)+f(n)`, `c*=log_b a`.
6. **Overlapping subproblems**: memoise or tabulate (naive Fibonacci makes 2F(n+1)-1 calls: 331,160,281 for n=40; memoised 2n-1 = 79). Bound the memo table when keys are user-controlled. Prefer bottom-up when depth equals n.
7. **Structures**: fold over a flat arena (`Vec<Node>`, indices, children first) instead of a `Box` tree when depth is unbounded. Implement `Drop` iteratively for recursive owned structures (a 10^6-node `Box` list overflows on drop).
8. **Schemes**: separate recursion from logic (fold/unfold/hylo; fusion `f . alg = alg' . F f` implies `f . cata alg = cata alg'`) so the traversal is written and tested once.
9. **Async recursion**: an `async fn` calling itself needs `Box::pin` (infinite state size otherwise); prefer a work queue with a loop.
10. **Compiler-facing recursion** (macros, trait solving, const eval): hitting `recursion_limit` (default 128) or the solver depth is a design signal, not a reason to raise the limit.

## Rust patterns

- Deep input from the network: iterative parser with an explicit `Vec` stack and a max depth parameter returning `Err(TooDeep)`.
- If recursion is truly needed on deep input, grow the stack with `stacker::maybe_grow` (what rustc does) and still cap the depth.
- Interpreter dispatch: with `become` on nightly each handler tail-calls the next; otherwise a `loop { match op }`.

## JavaScript/Bun patterns

- Strict-mode (ES modules and TypeScript files are strict) tail-recursive functions run in constant stack on Bun; this does not hold on Node/V8 or Deno, so code shared with them must use a loop.
- `JSON.parse` and `structuredClone` of hostile deep input have engine-specific depth limits: cap depth before parsing user data.

## Termination and impossibility

Halting and Rice mean no tool proves termination for all programs: prove it per function with the measure, or bound it with fuel/depth/timeout and return an error at the bound.

## Test recipe

Deepest input (list of 10^6 nodes, 10^5-deep nesting), worst-case pivot input (sorted), empty input, and a depth-limit test that expects the error, in a release build and on the smallest stack the platform gives.
