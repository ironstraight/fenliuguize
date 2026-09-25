# Project-wide Engineering Instructions for Rules and Subscription Frontends

This file applies to the repository root and every child directory. It is the single source of truth for project-wide engineering policy. Before changing, testing, committing, deploying, or pushing anything, every AI agent, automation tool, and maintainer must read this file, `REPOSITORY_MAP.md`, and `PROJECT_PROGRESS.md` in full.

`CLAUDE.md` and `.github/copilot-instructions.md` are compatibility entry points for other agents; they do not duplicate the policy body. Act on actual files, Git state, command output, and remote responses. Never guess an account, repository, deployment variable, or completion state from memory.

## 0.1 Workspace file safety

- AI agents must not create, edit, move, or delete files outside the resolved project root containing this `AGENTS.md`. This includes home directories, system directories, sibling projects, external temporary directories, and global tool configuration. Read-only access is allowed when needed. Treat symlinks and junctions by their resolved targets, not by their apparent paths.
- Before any batch file deletion, including wildcard deletion, recursive cleanup, `git clean`, and removal of temporary clones or generated directories, enumerate every affected file. Show a modal warning that lists the exact file paths and the purpose of each file, then wait for the user to press a button labeled `确认`. A chat reply, an assumed approval, or a successful tool call is not a substitute for that button. If the exact set cannot be enumerated or the UI cannot present that confirmation button, do not run the deletion.
- A confirmation covers only the files listed in that modal. If the file set changes, present a new warning and obtain a new confirmation. Never include files outside the project root in the proposed deletion.

## 0.2 Authoritative language and Chinese user documentation

- The English policy text in this `AGENTS.md` is the authoritative project-governance source. This English-first rule governs agent behavior only; it does not make English the default language for documents delivered to the user.
- All new or substantively updated user-facing documentation must use Simplified Chinese as its primary language unless the user explicitly requests another language. This includes README content, setup and deployment guides, usage tutorials, troubleshooting instructions, compatibility and migration notes, operational runbooks, release notes, and other explanatory files intended for the user.
- User-facing explanations, progress summaries, and final delivery reports must also be written in Simplified Chinese by default.
- Preserve commands, code, filenames, paths, configuration keys, API names, protocol terms, log text, product names, and exact UI labels in their required original form. Surround them with clear Chinese instructions or explanations instead of translating strings that users must match exactly.
- An optional English companion may be maintained for upstream collaboration or ecosystem compatibility, but it never replaces the required Chinese primary document. When an existing user-facing file is English-only and receives a substantive documentation change, add or update a discoverable Chinese version in the same task.
- Governance and machine-facing files may remain English-first when consistency or parsing requires it, including this file, `REPOSITORY_MAP.md`, `PROJECT_PROGRESS.md`, compatibility instruction entry points, source code, schemas, and configuration files. This exception must not be used to classify an ordinary user guide or explanatory document as machine-facing.
- Before committing documentation work, verify that every user-facing deliverable has a Chinese entry point and that links between English companion material and the Chinese primary version are discoverable.

## 0.3 Token-saving silent mode

If the final non-whitespace text of a user instruction is exactly:

```text
静默处理无需汇报
```

the user is explicitly asking to conserve the remaining token budget. For that task:

- Do not send routine progress reports, narration, status updates, or intermediate summaries to the user.
- Continue working autonomously until the task is complete, while still performing all required safety checks, tests, reviews, Git verification, and progress-file updates.
- Send a user-facing message only when permission, authorization, approval, credentials, or indispensable user input is required. The request must be concise and limited to the blocking authorization or decision.
- When the task is complete, send one concise final report containing the outcome, verification, and pushed commit information.
- Do not interpret silent mode as permission to skip checks, broaden scope, hide failures, or perform destructive actions.
- A later user instruction that does not end with the exact phrase returns communication to the normal mode.

System, platform, and safety requirements always remain in force, including any mandatory approval prompt.

## 1. Workspace purpose and repository boundaries

The parent directory is the repository for **remote routing rules, rule sets, domain sets, and base configurations used by OpenClash, Mihomo, ClashMi, and related clients**. It is not a monorepo containing the three subscription frontends.

Important root files include:

- `GoodrulesWithFallback.ini`: the primary subconverter remote configuration and policy-group orchestration file.
- `OpenClashBase.yaml`: the OpenClash/Mihomo base configuration, including DNS and Fake-IP compatibility settings.
- `ClashMiDnsGuard.js`, `OpenClashDnsGuard.module`, `DNS_LEAK_PROTECTION.zh-CN.md`, and `DNS_LEAK_PROTECTION.md`: client-specific DNS capture helpers, the primary Chinese guide, and its English compatibility companion.
- `AI.list`, `Apple.list`, `Microsoft.list`, `Direct.list`, `Global.list`, `HK.list`, `localnetwork.list`, `tk.list`, `youtube.list`, and similar files: rule sets or domain sets maintained by this repository.
- Other `.ini`, `.yaml`, `.list`, and `.txt` files: historical configurations, supplementary rules, or compatibility data. Inspect references before changing them.

The following child directories are independently published Cloudflare Workers subscription aggregation projects:

- `allsub/`
- `asub/`
- `EthanSub/`

They may be working copies without their own `.git` directories. The root `.gitignore` intentionally excludes them. Never remove those ignore rules and add the complete child projects to `ironstraight/fenliuguize`. Publish each child only to the remote listed in `REPOSITORY_MAP.md`.

## 2. Repository mapping is authoritative

| Relative path | Role | GitHub remote | Required CLI account | Default branch |
| --- | --- | --- | --- | --- |
| `.` | Rules, rule sets, domain sets, and OpenClash base configuration | `ironstraight/fenliuguize` | `ironstraight` | `main` |
| `allsub/` | AllSub subscription frontend | `yiloveM/allsub` | `yiloveM` | `main` |
| `asub/` | Astrowave SUB subscription frontend | `ironstraight/asub` | `ironstraight` | `main` |
| `EthanSub/` | Ethan SUB subscription frontend | `ironstraight/EthanSub` | `ironstraight` | `main` |

Before every push, verify all of the following independently:

1. The local directory being published.
2. The exact owner and repository in `origin`.
3. The active GitHub CLI account.
4. The target branch.
5. The staged file list and its relationship to the current task.

Stop immediately if any item does not match. Never infer a remote from a similar folder name, and never “test push” to a repository that merely looks plausible.

### 2.1 Automatic discovery and registration of new child projects

At the start of every task, scan the root-level child directories in addition to reading the mapping table. Treat any of the following as a possible new or changed project:

- The user explicitly says a child project was added, imported, copied, or moved into the workspace.
- A previously unmapped directory contains an independent `.git`, `package.json`, `wrangler.toml`, another project manifest, or a Git remote.
- An existing directory changes its origin, owner, default branch, technology stack, or purpose.

When a new or changed child project is found:

1. Inspect its project type, entry points, technology stack, Git-root status, and existing remotes using read-only commands.
2. Classify it as a rule asset, a member of the subscription-frontend family, or another independent project.
3. Determine its account, remote, and branch from actual Git metadata, GitHub metadata, or explicit user instructions. If any value is unknown, record it as `PENDING CONFIRMATION`, ask the user, and do not push.
4. Add the project to this file's topology and parity group, and add a full row to `REPOSITORY_MAP.md`.
5. Add it to the current baseline and completion history in `PROJECT_PROGRESS.md`, including discovery date, role, remote, account, branch, initial SHA, and verification status.
6. Add an appropriate root `.gitignore` entry when the project is an independent repository or working copy.
7. Update the child project's own `AGENTS.md`, README, deployment guide, or AI-instruction file when applicable. If it will be cloned independently and has no instructions, create a minimal project-level `AGENTS.md` describing its remote, required account, validation, and parity obligations.
8. If it shares the subscription-frontend stack, include it in every future backend-capability, frontend-interaction, and shared-style parity check.
9. In the final response, include a clearly labeled “New child project registration” result: what was detected, which files were updated, the remote mapping, parity group, verification result, and whether it was pushed.

Do not fabricate a registration when no new project exists. When discovery is incomplete, explicitly record and report `PENDING CONFIRMATION / NOT PUSHED`.

## 3. Parent rules repository policy

### 3.1 Scope

- Prefer rules, rule sets, and domain sets actually maintained by this repository.
- External rule-set references in `GoodrulesWithFallback.ini` or other configuration files stay external unless the user explicitly asks to vendor or replace them.
- Before adding a domain, confirm that the target list is referenced by the active configuration. Avoid creating unused files.
- Put a service rule in the semantically correct existing list and avoid unexplained duplication across lists.

### 3.2 Compatibility requirements

- Consider OpenClash, Mihomo, ClashMi, and subconverter syntax together.
- Domain rules must contain domains or supported rule values, never URL paths disguised as `DOMAIN-SUFFIX` entries.
- Check duplicates, case, invisible whitespace, NBSP characters, trailing spaces, invalid regular expressions, and invalid YAML.
- When changing policy groups, verify group names, rule-set targets, manual groups, health-check groups, fallback groups, and `FINAL` references as a complete graph.
- Do not attach `url-test` or `fallback` health-check parameters to `select` groups.
- For DNS and Fake-IP changes, explicitly consider LAN and reverse-DNS namespaces, NTP, STUN, discovery protocols, captive-portal checks, Microsoft/Apple updates, and the resolver path for AI/video services.
- Treat DNS policy and operating-system DNS capture as separate layers. Review `OpenClashBase.yaml`, `ClashMiDnsGuard.js`, `OpenClashDnsGuard.module`, `DNS_LEAK_PROTECTION.zh-CN.md`, `DNS_LEAK_PROTECTION.md`, and their tests together whenever DNS leak protection changes. OpenClash owns router firewall/dnsmasq capture; desktop/mobile Mihomo clients own TUN/VPN capture; subscription Workers cannot enforce either layer.
- Do not claim universal Clash compatibility for Mihomo-only fields. Document the supported core and require runtime validation when a client can overwrite DNS/TUN settings.
- Increment cache-busting query versions only when referenced rule content actually changes.
- Do not expand domain sets mechanically. Every addition needs a clear owner, purpose, and compatibility benefit.

### 3.3 Minimum validation for root rules

- Run `git diff --check`.
- Parse YAML and verify required root keys.
- Verify that every INI rule-set target and policy-group reference resolves to an intended group.
- Check changed `.list` files for path-like pseudo-domains, obvious duplicates, and invisible trailing characters.
- Search all references affected by the change to catch omissions.

## 4. Parity contract for subscription frontends

### 4.1 Backend and engineering capability parity

All three subscription projects must provide equivalent backend capability, including:

- Subscription URL parsing, deduplication, limits, and outbound safety validation.
- Multiple URLs separated by line breaks or `|`.
- Clash/Mihomo YAML, Base64 lists, and common share-URI formats.
- Global exclusion, literal replacement, regex replacement, slash-separated keyword exclusion, and standard regex exclusion.
- Per-source URL name mapping.
- The fixed order: global exclusion first, then per-source naming and numbering.
- `Source Name|Region|001`, `002`, and later serials, with blank source labels preserving original names.
- YAML name uniqueness and synchronized proxy-group references.
- Stateless one-time subscriptions, old-link compatibility, stable configuration-based cache keys, last-known-good background refresh, CORS, HEAD fallback, timeouts, and size limits.
- Admin login, unlock-password protection, view/delete/save controls, source-name protection, and theme switching.
- QR generation, error handling, legacy KV migration, and client response headers.

The shared `subscription-transform.js` should normally remain byte-for-byte identical across the projects. Any project-specific exception requires an explicit code comment, a progress-log explanation, and dedicated tests.

### 4.2 Frontend interaction and visual parity

Frontend interaction, layout structure, breakpoint behavior, card hierarchy, button placement, form behavior, prompt structure, and common Terminal/Water theme styling must remain aligned across the projects:

- A shared interaction or style change in one project must be reviewed and faithfully ported to the other projects in the same task.
- In “查看所有订阅链接” (view all subscriptions), the delete button, URL, and source-name field must not overlap at desktop or mobile widths.
- Each subscription card displays only its URL and per-source name. Global rename/exclusion rules appear once in a dedicated card below the list.
- URL guidance must consistently say that each URL can be entered on its own line and that `|` or a line break can be used as the separator.
- Dialogs must distinguish persistent configuration from one-time subscriptions and must not add unnecessary frontend password gates.

Allowed visual differences are limited to project names, branding copy, center images, desktop backgrounds, mobile backgrounds, and other explicitly branded assets. Interaction structure and shared visual behavior are expected to match unless the user explicitly requests a project-specific exception.

### 4.3 Visual asset boundaries

- `allsub` owns `asset/001.webp` through `008.webp`, `mobile01.webp` through `mobile04.webp`, `c01.webp` through `c03.webp`, and its local ripple scripts.
- `asub` owns `asset/pcbackground.webp`, `mobilebackground.webp`, and `centerpic.webp`; it must not regain a dependency on an EthanSub hostname.
- `EthanSub` owns the same three filenames and serves them through same-origin `/asset/...` URLs.
- Prefer replacing images without changing filenames, aspect ratios, or formats. If names are added, removed, or changed, update the Worker allowlist, preload paths, CSS, and JavaScript references together.
- Do not redesign an approved theme without a direct request. If the user requests a visual rollback, roll back visual presentation without rolling back verified engineering logic.

### 4.4 Persistence boundaries

- Only “添加到部署阵列” (add to deployment array) can add a new persistent subscription source; it requires `ADMIN_UNLOCK_PASSWORD`.
- “管理和查看所有订阅” requires `ADMIN_UNLOCK_PASSWORD`; after unlock, “固化保存所有订阅配置” may save management edits without a second password prompt.
- Filling temporary URLs or rules and clicking “一键复制订阅” (one-click copy) creates a one-time URL without writing KV or requiring the unlock password. When URLs are present, only those temporary sources are used.
- When the URL field is empty but temporary rename, exclusion, or custom-converter fields are filled, one-click copy generates a signed temporary URL that reads the persistent source list with those temporary settings.
- When all temporary fields are empty, one-click copy returns the default URL backed by the persistent KV list, without temporary parameters.
- Global exclusion and rename rules apply to every persistent source.
- A source name is a per-URL mapping. Entering the view/management UI requires `ADMIN_UNLOCK_PASSWORD`; solidifying changes from that unlocked UI must not prompt again.
- A one-time subscription must never modify `sub_links`, global rules, themes, backgrounds, or source-name mappings.

### 4.5 Cloudflare configuration protection

The Workers are already in production and may have dashboard-managed variables and secrets:

- Do not change or remove existing `wrangler.toml` variables, `keep_vars`, `ASSETS`, `MY_KV`, Worker names, compatibility dates, or build/deploy settings without an explicit user request.
- Do not create a new KV namespace to replace the existing `MY_KV`, clear KV, or migrate user data without authorization.
- Never write `ADMIN_PASSWORD`, `ADMIN_UNLOCK_PASSWORD`, `SUBCONVERTER_TOKEN`, real subscription URLs, or other secrets to the repository, test output, or progress log.
- Do not respond to a GitHub/Cloudflare deployment failure by creating a new Worker, token, Deploy Hook, or modifying another project in the same account unless the user explicitly authorizes it.
- Code upgrades must remain compatible with existing KV data. Prefer lazy, reversible migration that becomes persistent only after user confirmation.

## 5. Required workflow for subscription-project changes

When any subscription project changes:

1. Read the corresponding files in all parity-group projects and separate shared logic from allowed branded differences.
2. Implement in one project, then port the shared behavior to every other project in the same task.
3. Hash or diff shared modules to prove parity.
4. Review Worker, admin-page, and test differences project by project; remaining differences should be entry-point, branding, or asset implementation only.
5. Run tests and Wrangler dry-run separately for every project.
6. Browser-test Terminal and Water themes at desktop width and approximately 390px mobile width.
7. Check console errors, horizontal overflow, delete-button/URL/input overlap, and dialog copy.
8. Commit and push each repository separately after switching to its mapped account. Never combine the three remotes into one commit or push.
9. Record every final remote SHA in `PROJECT_PROGRESS.md`.

For README-only work, still verify capability descriptions across all projects while preserving actual entry files, routes, variables, and asset differences.

## 6. GitHub CLI credential handling

The machine may already contain valid credentials for both `ironstraight` and `yiloveM`. A sandbox, offline environment, or restricted permission context can make `gh auth status` falsely report those credentials as invalid.

Rules:

- Never reauthorize solely because one sandboxed `gh auth status` call failed.
- Do not casually run `gh auth logout`, delete credentials, or overwrite existing entries.
- Verify the active account first. Switch only if the account is wrong and the switch can be performed without changing files outside this project; otherwise ask the user to switch accounts. The workspace file-safety rule also applies to authentication commands:

```powershell
gh auth switch --hostname github.com --user <expected-account>
```

- Verify actual identity in a network-enabled context:

```powershell
gh api user --jq .login
```

- Then verify the remote:

```powershell
git remote get-url origin
```

- Trigger browser authorization only when the network is confirmed working, the expected account is selected, and a real `gh api` or push returns 401, `Bad credentials`, or an explicit login requirement:

```powershell
gh auth login --hostname github.com --git-protocol https --web
```

- After authorization, verify the returned login again. A zero exit status alone is not identity proof.
- Treat 403 permission errors, 404/private-repository visibility, remote-name mistakes, and network timeouts as distinct problems.

## 7. Network policy: direct first, port 7890 only as fallback

Use a direct connection first for GitHub, npm, Cloudflare, rule URLs, and documentation.

Only after a real DNS failure, connection timeout, TLS connection failure, or connection reset may the task temporarily retry through `127.0.0.1:7890`. Do not switch proxy because of 401, 403, 404, syntax errors, or a nonexistent repository.

Temporary Git proxy example:

```powershell
git -c http.proxy=http://127.0.0.1:7890 -c https.proxy=http://127.0.0.1:7890 fetch origin
```

Temporary proxy for the current PowerShell process:

```powershell
$env:HTTP_PROXY = "http://127.0.0.1:7890"
$env:HTTPS_PROXY = "http://127.0.0.1:7890"
gh api user --jq .login
Remove-Item Env:HTTP_PROXY -ErrorAction SilentlyContinue
Remove-Item Env:HTTPS_PROXY -ErrorAction SilentlyContinue
```

Never persist the proxy in global Git configuration, repository configuration, Cloudflare variables, or source code. Remove any process-scoped proxy created by the task before completion.

## 8. Git and publishing safety

- Inspect `git status` before editing. Preserve unrelated user changes.
- If a child working copy has no `.git`, clone the exact mapped remote's latest `main` into a clearly named temporary directory and synchronize only task-related files.
- Check that a temporary target does not exist before creating it. Resolve and verify its absolute path before recursive cleanup.
- Never use `git reset --hard`, `git checkout --`, force-push, or delete a remote branch without explicit user authorization.
- Before pushing, run `git diff --check` and inspect both `git diff --stat` and `git diff --name-only`.
- Never commit `node_modules/`, `dist/`, `.wrangler/`, `.env*`, `.dev.vars*`, logs, temporary clones, or real KV data.
- Fetch the current remote state before publishing so another computer's or agent's changes are not overwritten.
- After push, record the full SHA and remote URL and confirm that the local branch is synchronized with `origin/main`.

## 9. Validation and definition of done

### 9.1 Subscription projects

Run in every affected project:

```powershell
npm ci
npm run check
```

`npm run check` should cover unit tests, syntax validation, and Wrangler dry-run. Add browser regression appropriate to the change. If any check cannot run, write `NOT VERIFIED` and the reason in `PROJECT_PROGRESS.md`; never assume success.

### 9.2 Definition of done

A task is complete only when all applicable items are satisfied:

- The request is implemented in the correct local project.
- Shared subscription capabilities and interactions are aligned, or the reason no parity update was needed is documented.
- Existing Cloudflare variables, KV, secrets, and unrelated Workers remain untouched.
- Relevant tests, dry-runs, and browser checks pass.
- GitHub CLI uses the account required by the mapping.
- Origin and branch are correct; push succeeds and produces a full commit SHA.
- `PROJECT_PROGRESS.md` contains the task record.
- New child-project discovery was performed and any discovery was registered and reported.
- Temporary directories, logs, and proxy settings created by the task are cleaned up.

## 10. Progress record requirements

At the start of every task, read the current baseline and latest entries in `PROJECT_PROGRESS.md`. At task completion, append a record containing:

- Date and timezone.
- User goal and actual scope.
- Repositories and key files changed.
- Important design decisions and compatibility behavior.
- Actual test, dry-run, and browser results.
- Cloudflare variable/KV/secret impact.
- GitHub account, exact remote, branch, and full commit SHA.
- Failures, actual causes, and resolutions.
- Remaining work or `None`.
- Whether a new child project was detected; if so, its registration files, mapping, and parity group.

Records must be evidence-based. Never guess and never include passwords, tokens, subscription URLs, KV contents, or other sensitive data.
