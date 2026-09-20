# Project Maintenance Progress and Cross-device Handoff Log

Use this file to continue work across computers, AI agents, and human maintainers. Record engineering state only. Never include passwords, tokens, private subscription URLs, KV contents, or other sensitive data.

## Current baseline

| Relative path | Remote | Account | Branch | Last known remote baseline |
| --- | --- | --- | --- | --- |
| `.` | `ironstraight/fenliuguize` | `ironstraight` | `main` | `a558b45d40739da0a18bf8b30fdf0e92641022b5` |
| `allsub/` | `yiloveM/allsub` | `yiloveM` | `main` | `854af701572876abcca505ea49d7d25592ccda10` |
| `asub/` | `ironstraight/asub` | `ironstraight` | `main` | `b2f62fb64ce02069510dfa396897096c3415c354` |
| `EthanSub/` | `ironstraight/EthanSub` | `ironstraight` | `main` | `834b14aa73a79d61c063da8ddfcccdcb4d9e748b` |

> At the start of every task, compare these values with the actual remote `main` branches. If a remote has advanced, update the baseline before editing. Never roll back newer work from another computer or agent.

## Completed work

| Date (Asia/Shanghai) | Scope | Status | Completed work | Verification | Remote commit | Configuration/KV impact | Follow-up |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 2026-09-20 | Parent rules repository | Complete | Hardened `GoodrulesWithFallback.ini`, `OpenClashBase.yaml`, and the AI/Apple/Microsoft/local/TikTok/YouTube rule sets; corrected region matching, group parameters, DNS behavior, and Fake-IP compatibility | Commit present on `origin/main`; eight rule/configuration files changed | `ironstraight/fenliuguize` `17d6b7eda83fa1159ff1d39aa3f510ab63e06b55` | No Cloudflare variable or KV impact | Continue checking local-rule references and cache versions when adding domains |
| 2026-09-20 | allsub visual layer | Complete | Reverted the rejected Water-theme visual refresh while retaining verified engineering behavior | Remote commit confirmed | `yiloveM/allsub` `63ed4e5` | None | Included by later baseline |
| 2026-09-20 | asub visual assets | Complete | Bundled desktop background, mobile background, and center image in asub and removed its EthanSub-host dependency | Local-asset test and remote commit confirmed | `ironstraight/asub` `92508ef` | None | Included by later baseline |
| 2026-09-20 | EthanSub visual layer | Complete | Reverted the rejected Water-theme visual refresh while retaining verified engineering behavior | Remote commit confirmed | `ironstraight/EthanSub` `3a59f96` | None | Included by later baseline |
| 2026-09-21 | allsub | Complete | Added per-source URL naming, exclusion-before-numbering, legacy fixed-name migration, unlock protection for source names, one global-rules card, and a modular README | 19 tests passed; syntax checks and Wrangler dry-run passed; local desktop/mobile checks covered Terminal and Water themes | `yiloveM/allsub` `854af701572876abcca505ea49d7d25592ccda10` | Did not change `wrangler.toml`, variables, secrets, or KV binding | None |
| 2026-09-21 | asub | Complete | Aligned per-source naming, exclusion, one-time subscriptions, permissions, and admin interaction with allsub/EthanSub; documented novice deployment, regex examples, and local image paths | 20 tests passed; syntax checks and Wrangler dry-run passed; local-asset independence test and desktop/mobile layout checks passed | `ironstraight/asub` `b2f62fb64ce02069510dfa396897096c3415c354` | Did not change `wrangler.toml`, variables, secrets, or KV binding | None |
| 2026-09-21 | EthanSub | Complete | Aligned per-source naming, exclusion, one-time subscriptions, permissions, and admin interaction with allsub/asub; documented novice deployment, regex examples, and image paths | 19 tests passed; syntax checks and Wrangler dry-run passed; desktop/mobile layout checks passed | `ironstraight/EthanSub` `834b14aa73a79d61c063da8ddfcccdcb4d9e748b` | Did not change `wrangler.toml`, variables, secrets, or KV binding | None |
| 2026-09-21 | Parent-repository engineering governance | Complete | Added global `AGENTS.md`, the repository map, this cross-device progress log, Claude/Copilot entry points, and root ignore rules; defined automatic discovery/registration of child projects, parity grouping, and mandatory final reporting | Root-level discovery found only the already mapped allsub/asub/EthanSub projects; staged diff check passed; six governance files entered the commit | `ironstraight/fenliuguize` `2a367e577d8dfb9783716dbf0743980da543d500` | No Cloudflare variable, secret, or KV impact; new child projects: none | Continue appending a record after every task |
| 2026-09-21 | Governance language and communication policy | Complete | Converted `AGENTS.md`, `REPOSITORY_MAP.md`, and `PROJECT_PROGRESS.md` to English-first versions; retained only exact Chinese UI labels and added the exact `静默处理无需汇报` token-saving trigger | `git diff --check` and staged-file review passed; exactly three governance files changed; no unmapped child project detected | `ironstraight/fenliuguize` `a558b45d40739da0a18bf8b30fdf0e92641022b5` | No Cloudflare variable, secret, KV, Worker, or child-project source impact | None |

## Current shared behavior

- The three subscription projects use the same `subscription-transform.js` implementation.
- Multiple URL input accepts line breaks or `|` without requiring spaces around the separator.
- Persistent global exclusion processes original node names before per-source numbering.
- Source names use `Source Name|Region|001`; a duplicate region is not appended, and an unrecognized region produces `Source Name|001`.
- A blank source name preserves the original node name unless a separate global rename rule is configured.
- One-time subscriptions do not write KV and do not require the unlock password; only “添加到部署阵列” persists data.
- When all temporary inputs are blank, “一键复制订阅” returns the persistent default subscription.
- Each subscription card displays only its URL and source name; global rules appear once below the list.
- asub owns its Water-theme assets and does not depend on the EthanSub hostname.

## Template for a new completed task

Append a row to **Completed work** and update **Current baseline**:

```markdown
| YYYY-MM-DD | Relative path or feature scope | Complete / Partial / Blocked | Changes and key decisions | Actual tests, dry-run, and browser results | `owner/repo` `full SHA` | Variable/KV/secret impact | Remaining work or `None` |
```

When more detail is required, add a section after the table:

```markdown
### YYYY-MM-DD: Task title

- User goal:
- Files changed:
- Compatibility decisions:
- Network: whether direct access worked; if port 7890 was used, state that it was temporary fallback only.
- GitHub: selected account, actual API login, origin, and branch.
- Verification:
- Failures and actual causes:
- Remote commit:
- Configuration/KV/secret impact:
- Follow-up:
- New child project: `None`, or provide directory, remote, account, parity group, and registration files.
```

## Handoff checklist

After changing computers or agents:

1. Read `AGENTS.md` and `REPOSITORY_MAP.md`.
2. Fetch the latest `main` from all four remotes. Do not rely only on the baseline recorded here.
3. Inspect every working tree for pre-existing uncommitted changes and identify their owner.
4. Compare shared-module hashes and engineering capability across the subscription projects.
5. Keep existing Cloudflare variables, KV, and secrets under deployment control; never copy them into Git.
6. Use direct networking first. Retry through `127.0.0.1:7890` only after a real network failure.
7. Switch to the existing correct GitHub CLI account. A sandbox false negative does not justify reauthorization.
8. Update this file with accurate full commit SHAs after completion.
9. Scan root-level child directories. Register and explicitly report any unmapped project according to `AGENTS.md`.
