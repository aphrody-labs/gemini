## Best practices

The firewall sits in front of every request. A misconfigured rule can block real users, kill SEO crawlers, or break checkout. Treat changes like a production database migration: stage, review, and let the user pull the trigger.

- **Roll new rules out in stages, not in one shot.** A new rule's blast radius is unpredictable until real traffic hits it. Walk every meaningful rule through the stages below, asking the user to `vercel firewall publish --yes` between each. Don't skip stages even if a rule "obviously" matches only attackers — common JA4s and user agents collide with real users far more often than they look like they will.
  1. **Log everywhere.** Add the rule with `--action log` so it records hits to the Firewall dashboard but blocks nothing.

     ```bash
     vercel firewall rules add "Block exploit probes" \
       --condition '{"type":"path","op":"inc","value":["/wp-admin","/.env","/.git/config","/phpmyadmin"]}' \
       --action log --yes
     ```

  2. **Have the user review traffic in the dashboard.** Get the rule ID from the `rules add` output or `vercel firewall rules list --json` (look for the `id` field — rule IDs start with `rule_`). Read the team and project slugs from `.vercel/project.json` (`orgSlug` / `projectName`) or via `vercel project ls`. Construct the filtered traffic URL and ask the user to open it:

     ```
     https://vercel.com/<team>/<project>/firewall/traffic?filter=<ruleId>
     ```

     Have them confirm only the intended traffic is matching (no real users, no SEO crawlers, no internal tools) before moving on.

  3. **Block in preview first.** Edit the rule to `deny` (or `challenge`) and add an `environment = preview` condition so production stays in log mode. This lets the user hit a preview deployment and confirm the block fires correctly without exposing real users:

     ```bash
     vercel firewall rules update "Block exploit probes" \
       --action deny \
       --condition '{"type":"path","op":"inc","value":["/wp-admin","/.env","/.git/config","/phpmyadmin"]}' \
       --condition '{"type":"environment","op":"eq","value":"preview"}' \
       --yes
     ```

     Have the user publish, then test the affected paths in a preview URL. Re-check the dashboard URL filtered by rule ID to see the blocks land.

  4. **Block in production.** Once the user is satisfied with the production log data, edit to `deny` / `challenge` and have them publish. Keep the dashboard URL handy for the first 24h in case you need to roll back with `--action log` or `rules disable`.

- **Stage drafts; let the user publish.** Mutating commands (`rules add/update/enable/disable/remove/move`, `ip-blocks block/unblock`) only stage. Run `vercel firewall diff` to show what will change, then **ask the user to run `vercel firewall publish --yes` themselves** — don't push to production on their behalf. Use `discard --yes` only if the user asks to abandon staged changes.

- **Don't run commands the CLI blocks for agents.** Surface what the user needs to do instead:
  - `vercel firewall rules add --ai "..."` and `vercel firewall rules add` (wizard) — TTY-only. Use `--condition` flags or `--data`.
  - `vercel firewall attack-mode enable` — requires explicit interactive confirmation; have the user run it.
  - `vercel firewall system-mitigations pause` — pauses platform DDoS protection across the project; have the user run it and resume ASAP.

- **Inspect before recommending publish.** A `deny` with a loose condition (e.g., `path` starts with `/`) blocks the entire site. Always `vercel firewall rules inspect "Name"` and `vercel firewall diff` before handing the publish step to the user.

- **Tune rate limits gently.** Start with a generous `--rate-limit-requests` (5–10× the expected legitimate rate) and `--rate-limit-action log`. After the user reviews dashboard data, tighten the limit and switch the action to `rate_limit`, `challenge`, or `deny`.

- **Keep bypasses narrow.** When unblocking trusted automation, scope by a shared-secret header **plus** an IP or CIDR. Avoid wide-open bypasses (e.g., a single header with a known value an attacker could guess).

- **Don't over-block.** User agents, JA4, and IP addresses may collide with real users far more than they look like they will:
  - **JA4 fingerprints are shared across millions of clients.** A single Chrome point release, a single iOS version, or a popular mobile SDK all produce the same JA4. "Block this JA4" can silently take out an entire browser cohort. Before recommending a JA4 rule, run it through the staged log → preview → log-prod → block flow above and have the user confirm the dashboard shows only attacker behavior (high request rate, suspicious paths, anomalous geos) — not just "this JA4 hit `/login` once."
  - **User-agent substring rules over-match constantly.** `sub` matches like `crawler`, `bot`, `python`, `curl`, or `headless` will block legitimate tools (uptime monitors, link previewers, SEO auditors, partner integrations, the user's own CI). For known-good crawlers (Googlebot, Bingbot, Slack/Discord/X unfurlers, etc.) prefer Vercel's verified-bot signals over UA strings (`bot_name` / `bot_category` on priority projects, otherwise the managed bot rules, which already let verified bots through), and pair UA conditions with another condition (path, geo, rate) so a single UA token can't take down a whole class of clients.
  - **Sanity-check before staging.** Before adding a block, ask the user: "Does this fingerprint also match Chrome on macOS / our mobile app / a partner's webhook?" If you don't know, the answer is "log first, decide later."

## External reverse proxies

External proxies in front of Vercel reduce firewall and Bot Protection accuracy: real client IPs become opaque, signal reliability drops, legitimate users may be repeatedly challenged. Avoid when you can. If required, use **Verified Proxy** so Vercel trusts your proxy's headers from a known egress range. https://vercel.com/docs/security/reverse-proxy

## Official Documentation

- [Vercel Firewall](https://vercel.com/docs/vercel-firewall)
- [Bot management](https://vercel.com/docs/bot-management)
- [Vercel CLI](https://vercel.com/docs/cli/firewall)
