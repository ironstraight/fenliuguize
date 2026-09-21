# Project Maintenance Progress and Cross-device Handoff Log

Use this file to continue work across computers, AI agents, and human maintainers. Record engineering state only. Never include passwords, tokens, private subscription URLs, KV contents, or other sensitive data.

## Current baseline

| Relative path | Remote | Account | Branch | Last known remote baseline |
| --- | --- | --- | --- | --- |
| `.` | `ironstraight/fenliuguize` | `ironstraight` | `main` | `ed46b517f288e1241507b4c864c79ddca1732968` |
| `allsub/` | `yiloveM/allsub` | `yiloveM` | `main` | `671df37e0826efb2cf966d0d9e2cb9cf6b001c5b` |
| `asub/` | `ironstraight/asub` | `ironstraight` | `main` | `95cdec0ad8daac52b8f18b1e70698929f3e0fd48` |
| `EthanSub/` | `ironstraight/EthanSub` | `ironstraight` | `main` | `fed1c83c325ee0b5f67c3be6a04ad8a2d10e4491` |

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
| 2026-09-21 | allsub/asub/EthanSub protected-save interaction | Complete | Replaced the native password prompt for protected persistent saves with theme-native password modals matching the existing matrix-management interaction; added inline required, verifying, denied, and network-failure states while preserving cancel semantics and the non-persistent one-time subscription path | 61 tests passed across the three projects; all six inline admin scripts parsed; syntax checks and three Wrangler dry-runs passed; fresh-clone diffs contained only two admin pages and one regression test per project | `yiloveM/allsub` `671df37e0826efb2cf966d0d9e2cb9cf6b001c5b`; `ironstraight/asub` `2db97088f857e502b20270a3d0de1d02b080f129`; `ironstraight/EthanSub` `3d5e310f014cbc733a2816cb9d6139ce20eef394` | No Worker logic, `wrangler.toml`, Cloudflare variable, secret, KV binding, or persisted KV data changed | Direct GitHub access succeeded after sandbox network approval; accounts were switched and verified without reauthorization; proxy `127.0.0.1:7890` was not used; new child projects: none |
| 2026-09-21 | Parent governance and cross-client DNS protection | Code complete; device test NOT VERIFIED | Added project-root-only file mutation rule and per-file modal confirmation for batch deletion; moved the shared base to foreign default DoH with explicit domestic policy, added an optional OpenClash DNS redirection module and ClashMi/Mihomo TUN override, and documented legacy Clash limits | YAML parsed with pinned in-memory parser; INI graph and base reference passed; OpenClash module settings passed; `node --check` and 3 Node tests passed; real-device DNS leak test NOT VERIFIED | `ironstraight/fenliuguize` `594a551bdc82cefacc59f13ffad675ec6914dd32` and `0bf193a05340fcf946b4728131707b6383f2f6f6` | No Cloudflare variable, secret, KV, or Worker impact | Verify effective DNS settings and leak behavior on OpenClash LAN and ClashMi/Mihomo devices; no new child project detected |
| 2026-09-21 | DNS Guard user documentation | Complete; device test remains NOT VERIFIED | Added a 342-line Chinese click-by-click guide for installing, binding, validating, testing, troubleshooting, and rolling back `OpenClashDnsGuard.module` and `ClashMiDnsGuard.js`; clarified ClashMi `内置-不覆写`, TUN enablement, Private DNS/DoH, IPv6, and multi-DNS-service conflicts | Local Markdown links passed; four raw artifact URLs returned HTTP 200; `git diff --check`, `node --check`, and 3 Node tests passed; actual router/device testing remains NOT VERIFIED | `ironstraight/fenliuguize` `7e5f6b0e77fe22c2b1712e4895b3bc950bbe15fd` | No Cloudflare variable, secret, KV, Worker, rule, or runtime configuration impact | Follow the guide on the target OpenClash and ClashMi devices; no new child project detected |
| 2026-09-21 | Documentation-language governance | Complete | Kept English `AGENTS.md` authoritative for governance while requiring Simplified Chinese as the primary language for user-facing READMEs, tutorials, deployment and troubleshooting guides, explanatory files, progress explanations, and final reports; preserved exact technical strings and allowed non-substituting English companions | Required-policy assertions and `git diff --check` passed; only `AGENTS.md` changed in the implementation commit | `ironstraight/fenliuguize` `525d680b8abd5629286b5a3a2e6e2692c5eea86b` | No Cloudflare variable, secret, KV, Worker, rule, runtime, or user-data impact | None; no new child project detected |
| 2026-09-21 | DNS Guard guide usability correction | Complete; device test remains NOT VERIFIED | Replaced the 342-line Chinese guide with a 104-line action-only manual; aligned OpenClash navigation and form labels with the official guide and current `config_edit.htm` source, including `Overwrite Module`, `Overwrite Edit`, `Add Overwrite Module`, `Subscribe Link`, the exact fields, the disabled-by-default module switch, and a short rollback | Required UI-label assertions, local-link check, 120-line maximum, and `git diff --check` passed; no code or configuration changed | `ironstraight/fenliuguize` `ed46b517f288e1241507b4c864c79ddca1732968` | No Cloudflare variable, secret, KV, Worker, rule, module, script, or runtime impact | Follow the shortened manual on the target devices; no new child project detected |

### 2026-09-21: Project file safety and client DNS capture

- User goal: restrict AI file mutations to this project, require an explicit `确认` modal before batch deletion, and extract the DNS leak mitigation mechanism from the linked Perfect-Rules script for OpenClash, ClashMi, and other Clash clients. The user also supplied OpenClash's official user guide as a reference.
- Files changed: `AGENTS.md`, `OpenClashBase.yaml`, `OpenClashDnsGuard.module`, `ClashMiDnsGuard.js`, `DNS_LEAK_PROTECTION.md`, `tests/ClashMiDnsGuard.test.cjs`, and this progress record.
- Compatibility decisions: `GoodrulesWithFallback.ini` still points to the shared base. The base now routes unmatched lookups to encrypted IP-addressed foreign DNS via `#RULES`, while CN/private/Apple/Microsoft domains and proxy-node bootstrap retain domestic DNS. Removing the old domestic default and fallback avoids simultaneous domestic queries for foreign domains. The optional OpenClash module sets firewall port-53 redirection and disables OpenClash custom/WAN/default DNS injection; OpenClash still owns router interception. The ClashMi/Mihomo script preserves proxy/rule arrays and adds Fake-IP, UDP/TCP port-53 TUN capture, strict routing, and IPv6 disabled until fully routed. Legacy Clash cores may not support Mihomo-only syntax and require separate client-side capture. The three Workers cannot capture OS DNS and were unchanged.
- Network: direct GitHub access worked in the approved network context; port 7890 was not used. The normal sandbox falsely reported invalid `gh` credentials and blocked direct sockets.
- GitHub: verified `gh api user` returned `ironstraight`; origin was `https://github.com/ironstraight/fenliuguize.git`; branch was `main`. No account switch or reauthorization changed files outside this project.
- Verification: `node --check ClashMiDnsGuard.js` passed; `node --test tests/ClashMiDnsGuard.test.cjs` passed 3/3; a pinned `js-yaml` parser loaded in memory parsed `OpenClashBase.yaml` and checked required keys and resolver paths; an INI graph check resolved all 10 rule targets across 39 groups and confirmed the base URL; the OpenClash module format and four settings passed; GitHub API confirmed the initial pushed script. Real OpenClash LAN and ClashMi/Mihomo device-side DNS leak tests are NOT VERIFIED because no target router/client was available. Browser checks and Wrangler dry-runs were not applicable to the unchanged frontends.
- Failures and actual causes: this workspace initially lacked Git metadata; it was restored inside the project against the verified remote without overwriting files. The sandbox created `.git` with a different Windows owner, so Git used command-scoped `safe.directory` and the metadata was temporarily moved within the project for patch-tool edits. Bundled Python lacked PyYAML, so YAML was parsed with pinned `js-yaml` in memory without installing files. An initial ad hoc INI check failed because PowerShell consumed its literal backtick; the corrected check passed. `allsub` remote main was NOT VERIFIED with the active `ironstraight` account because that repository was not visible; its last known baseline was retained. Read-only checks found newer `asub` and `EthanSub` main SHAs and updated the table above.
- Remote commits: `ironstraight/fenliuguize` `594a551bdc82cefacc59f13ffad675ec6914dd32` for governance and the initial ClashMi artifact; `0bf193a05340fcf946b4728131707b6383f2f6f6` for the cross-client DNS policy, OpenClash module, compatibility guide, and final implementation tests.
- Configuration/KV/secret impact: none.
- Follow-up: check OpenClash's generated DNS and 53-port redirect on a LAN client, check ClashMi/Mihomo's effective TUN and DNS settings, and run foreign-domain DNS leak tests on those devices. New child project: `None`; only the three mapped child directories were present.

### 2026-09-21: OpenClash and ClashMi DNS Guard tutorial

- User goal: provide a novice-friendly, step-by-step usage guide for `OpenClashDnsGuard.module` and `ClashMiDnsGuard.js`, including other Mihomo/Clash client considerations.
- Files changed: `DNS_LEAK_PROTECTION.zh-CN.md`, `DNS_LEAK_PROTECTION.md`, and this progress record.
- Compatibility decisions: the guide keeps OpenClash router interception separate from ClashMi client TUN capture; requires Meta/Mihomo for the complete feature set; directs ClashMi users to preserve the script with `内置-不覆写` while keeping TUN enabled; explains unsupported JS/legacy Clash fallbacks, Android Private DNS and browser DoH bypasses, IPv6 risk, and AdGuard Home/MosDNS/SmartDNS port-53 conflicts.
- Network: direct GitHub access worked; all main-branch and fixed-SHA artifact URLs returned HTTP 200. Port `7890` was not used.
- GitHub: read-only identity verification returned `ironstraight`; origin was `https://github.com/ironstraight/fenliuguize.git`; branch was `main`; local and remote started at `6e6474fb8439bc28ecc9705520bb5a1af4c787be`.
- Verification: all local Markdown links resolved; BrowserLeaks DNS and DNSLeakTest were reachable; `git diff --check` passed; `node --check ClashMiDnsGuard.js` passed; `node --test tests/ClashMiDnsGuard.test.cjs` passed 3/3. Real OpenClash router and ClashMi device tests remain NOT VERIFIED because no target devices were available.
- Failures and actual causes: an initial identity-check command included an unnecessary `gh auth switch` and was rejected because it would change global authentication outside the project; it was replaced with the required read-only `gh api user` check. One read-only PowerShell URL-check command had a pipeline parser error; the corrected command returned HTTP 200 for all four URLs.
- Remote commit: `ironstraight/fenliuguize` `7e5f6b0e77fe22c2b1712e4895b3bc950bbe15fd` for the tutorial and its entry link.
- Configuration/KV/secret impact: none; no rule, client artifact, Cloudflare variable, secret, KV binding, or persisted data changed.
- Follow-up: perform the guide's final runtime and DNS leak checks on the actual OpenClash LAN and ClashMi devices. New child project: `None`; the scan found only the three mapped child directories.

### 2026-09-21: Chinese-first user documentation governance

- User goal: keep the English project-governance prompt authoritative while requiring documents and explanations delivered to the user to be in Chinese.
- Files changed: `AGENTS.md` and this progress record.
- Governance decision: `AGENTS.md` remains the English single source of truth. New or substantively changed user-facing READMEs, setup/deployment guides, tutorials, troubleshooting, compatibility/migration notes, runbooks, release notes, explanations, progress summaries, and final reports must be Simplified Chinese by default. Commands, code, paths, config keys, APIs, logs, product names, and exact UI labels retain their required spelling with Chinese explanation. English companion documents are allowed but cannot replace the discoverable Chinese primary document. Governance and machine-facing files remain explicit exceptions.
- Verification: required policy phrases were asserted in `AGENTS.md`; `git diff --check` passed; staged scope for the implementation commit contained only `AGENTS.md`.
- GitHub: account remained `ironstraight`; origin remained `https://github.com/ironstraight/fenliuguize.git`; branch remained `main`; local and remote started at `4597d87e24f4678f0b33d82b744a8c8703b23694`.
- Configuration/KV/secret impact: none.
- Remote commit: `ironstraight/fenliuguize` `525d680b8abd5629286b5a3a2e6e2692c5eea86b` for the governance change.
- Follow-up: `None`. New child project: `None`; the scan found only the three mapped child directories.

### 2026-09-21: DNS Guard guide shortened and UI-corrected

- User goal: remove the long and confusing material from the generated tutorial and provide a concise, step-by-step manual whose OpenClash buttons can actually be found.
- Files changed: `DNS_LEAK_PROTECTION.zh-CN.md` and this progress record.
- Documentation decision: reduced the guide from 342 to 104 lines and kept only prerequisites, exact clicks/fields, a short verification, rollback, and two common problems. OpenClash instructions now explicitly distinguish the run-status-page `Overwrite Module` button from the separate left-menu “覆写设置” page and use the current official English UI labels. ClashMi instructions retain only the verified JS import, `追加覆写` = `内置-不覆写`, profile binding, and TUN switches.
- Sources checked: the user-provided OpenClash skill entry, its overwrite-module format/examples documents, current OpenClash `config_edit.htm`, current ClashMi profile-patch/UI localization source, and the ClashMi FAQ.
- Verification: the guide is 104 lines; required UI labels are present; local Markdown links resolve; `git diff --check` passed. DNS code, OpenClash module, ClashMi script, and runtime behavior were unchanged, so code tests were not rerun. Real device testing remains NOT VERIFIED.
- GitHub: account remains `ironstraight`; origin remains `https://github.com/ironstraight/fenliuguize.git`; branch remains `main`; local and remote started at `d0022cd99c91cae31ec72f5a0cb388d756d85756`.
- Configuration/KV/secret impact: none.
- Remote commit: `ironstraight/fenliuguize` `ed46b517f288e1241507b4c864c79ddca1732968` for the shortened guide.
- Follow-up: use the shortened guide on the actual OpenClash and ClashMi devices. New child project: `None`; the scan found only the three mapped child directories.

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
- The shared OpenClash/Mihomo base uses encrypted foreign default DNS with explicit domestic policy; optional OpenClash and ClashMi/Mihomo capture artifacts are documented in `DNS_LEAK_PROTECTION.md`.

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
