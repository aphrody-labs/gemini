# Review checklist

For reviewers and for authors before they ask for review. Rules and sources: [code-style.md](https://github.com/aphrody-labs/.github/blob/main/docs/standards/code-style.md) section 7 (RV-01 to RV-11); the IDs below point into it. Copy this file to `REVIEW.md` in a repository and extend it with local rules.

Standard: approve when the change definitely improves the code base, even if it is not perfect (RV-01). Label every comment `Nit:`, `Optional:`, `FYI:`, or leave it unlabeled when it is required (RV-03). Answer every thread with evidence (RV-04).

## Before anything else

- [ ] CI is green on every required job; a failure on the branch but not on the default branch is the author's (PR-07).
- [ ] The title follows `type(scope): summary` (PR-01) and the description has what and why, how it was verified, risk and rollback (PR-03).
- [ ] The change is one concern and small enough to read in one sitting; if not, ask for a series (PR-02, RV-09).

## Design

- [ ] The fix is at the layer that owns the violated invariant, not where the symptom appears.
- [ ] Whole bug class: every sibling site (sync and async twins, fast and slow paths, platform branches, copy-pasted blocks) is fixed, or the exclusion is stated.
- [ ] One source of truth: no copied tables or helpers; every consumer of a changed signature, enum or struct updated.
- [ ] Simplest mechanism that the invariants allow; no speculative surface that nobody asked for.
- [ ] Public surface is complete in the same change (CLI and API, types, help, docs) and does not break existing users silently (PR-09, CM-05).

## Tests

- [ ] A behavioral change has an automated test in the same change; the description says it fails without the fix (TE-01, TE-02).
- [ ] Assertions are exact and can fail; no sleeps, no external network, resources released before assertions (TE-03 to TE-05).
- [ ] The variant matrix is covered: siblings, flag states, limits, error paths, platforms (TE-06).
- [ ] No test was weakened, skipped or deleted without a reason; no `.only` (TE-07).

## Memory, unsafe and concurrency (native code)

- [ ] Every acquisition is paired with a release at the acquisition site; ownership has one named owner and one allocator (RS-13).
- [ ] Every `unsafe` has an accurate `// SAFETY:` comment, every `unsafe fn` a `# Safety` section; the unsafe block is minimal (RS-06, RS-08).
- [ ] Sizes, indexes and counts from outside are treated as adversarial; validation survives release builds.
- [ ] Nothing user-reachable can panic; failures are recoverable errors (RS-10, TS-16).
- [ ] Thread affinity of every touched line is known; shared state is synchronized; reference counts balance on every terminal path.
- [ ] A second reviewer familiar with the area has seen unsafe code, FFI and parsers of untrusted input (RV-08).

## Errors, security and performance

- [ ] No swallowed failure, no success reported on failure; error messages name the resource, the rejected value, the cause and a remedy (TS-15, CM-06).
- [ ] Untrusted input is validated before any processing or side effect; security checks fail closed and cover every path to the protected effect.
- [ ] A performance claim has before and after numbers over all input classes, and the common case pays nothing for a rare feature (CO-04).
- [ ] New dependencies were reviewed for licence, maintenance and `unsafe` (RB-06).

## Hygiene

- [ ] No debug prints, scratch files, commented-out code, formatter churn, lockfile or submodule ride-alongs (PR-06).
- [ ] Dead code orphaned by this change is deleted and named in the description (CM-07).
- [ ] Comments say what the code cannot (CM-01); docs and the commit messages match the final change (PR-03).
- [ ] No secrets, developer-machine paths or private hostnames in code, messages or fixtures (CO-13).
- [ ] No assistant or bot attribution in commit messages (CO-10).
