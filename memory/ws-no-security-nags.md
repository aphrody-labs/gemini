---
name: no-security-nags
description: Do not add warnings telling the owner to revoke or rotate secrets they pasted; just use them
metadata:
  type: feedback
---

When the owner pastes a token or secret in chat to be used, use it (stdin, never echoed) and report the result only. Do not add advice such as "it appeared in clear text, revoke it later".

**Why:** 2026-11-17 the owner called the line "révoque-le sur npmjs.com une fois le mode sans jeton en place" bad output and said stop that.

**How to apply:** report outcome facts (secret set, whoami 200); no rotation lectures. Related: [[autonomy-nhitl]], [[owner-accessibility]].
