---
name: no-slop-humanizer
description: Detect and strip AI writing slop, filler, binary contrasts, and synthetic prose patterns (unifying humanizer-skill, humanize-skill, and ai-slop-detector best practices).
---

# No-Slop Humanizer & AI Slop Detector

Apply this two-pass filter before finalizing documentation, READMEs, PR descriptions, or UI copy.

## Pass 1: Slop Detection (Audit)

Flag and remove:
1. **Binary contrasts & false profundity**: "Not just X, but Y", "It's not about A; it's about B", "delve into", "tapestry", "testament to", "game-changer".
2. **Throat-clearing & meta-filler**: "In today's fast-paced world", "Let's dive in", "It is worth noting that", "Importantly,".
3. **Punctuation & cadence tells**: Excessive em-dashes (`—`), triadic synonym cycling, uniform sentence lengths, and dramatic one-line closers.
4. **Hype & unverified claims**: "revolutionary", "seamless", "cutting-edge", "blazingly fast" without concrete benchmark numbers.

## Pass 2: Direct Rewrite

- Replace abstract nouns with concrete verbs and measured facts.
- Vary sentence length naturally; prefer active voice and short paragraphs.
- Keep technical terms exact; never invent metrics or benchmarks.
