---
name: owner-accessibility
description: Owner has low vision - use short numbered single-action steps, open URLs/windows directly, and avoid dense visual tables when human action is needed
type: user
---

- The user has low vision.
- Whenever rare human-only input is genuinely required (such as sign-in, CAPTCHA, or billing entry), give short numbered steps with one action per step, naming exact buttons/keys.
- Open target pages or windows directly instead of explaining how to navigate to them, and never ask the user to read dense comparison tables.
- Commands that prompt for hidden input (`gh secret set`, logins) hang under the `!` prefix (no TTY) and get backgrounded; give the owner a separate-terminal command or the exact web settings path instead (2026-11-16, NPM_TOKEN).
