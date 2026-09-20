# Local Directory to GitHub Repository Map

This file is the authoritative publication map. All paths are relative to the `fenliuguize` directory that contains this file, so the map remains valid after moving the workspace to another computer.

## Repository map

| Relative path | Purpose | GitHub remote | Required GitHub CLI account | Branch | Publishing notes |
| --- | --- | --- | --- | --- | --- |
| `.` | OpenClash/Mihomo/ClashMi rules, rule sets, domain sets, and base configuration | `https://github.com/ironstraight/fenliuguize.git` | `ironstraight` | `main` | Parent repository; never add the three complete child projects |
| `allsub/` | AllSub Cloudflare Workers subscription aggregator | `https://github.com/yiloveM/allsub.git` | `yiloveM` | `main` | The only current project that requires the `yiloveM` account |
| `asub/` | Astrowave SUB Cloudflare Workers subscription aggregator | `https://github.com/ironstraight/asub.git` | `ironstraight` | `main` | Owns its three local Water-theme images |
| `EthanSub/` | Ethan SUB Cloudflare Workers subscription aggregator | `https://github.com/ironstraight/EthanSub.git` | `ironstraight` | `main` | Current custom domain is `https://ebr.arkalpool.eu.org/`; that domain is not a Git remote |

## Workspace structure

- The root directory is the Git working tree for `ironstraight/fenliuguize`.
- `allsub/`, `asub/`, and `EthanSub/` may not contain their own `.git` directories. The root `.gitignore` prevents them from entering the parent repository.
- These directories belong to three independent remotes. Never run `git add allsub asub EthanSub` in the parent repository.
- On another computer, the four repositories may be cloned separately. If the three child working copies are placed under the parent directory again, this mapping remains mandatory.

## Registration of new child projects

When a new child project is detected or added by the user, add a row to the table and update all applicable files:

- The directory topology, parity group, and synchronization requirements in `AGENTS.md`.
- The current baseline and completion history in `PROJECT_PROGRESS.md`.
- The root `.gitignore` when the child is an independent repository or working copy.
- The child's own `AGENTS.md`, README, deployment guide, or other AI-instruction file when applicable.

A new row must include the relative path, project role, complete remote URL, CLI account, default branch, and publishing notes. If the remote or account is not yet known, write `PENDING CONFIRMATION` and do not push. The final response must explicitly report the registration result instead of silently changing these files.

## Mandatory pre-push record

Fill every field for each repository before pushing:

```text
Local relative path:
Expected GitHub account:
Actual result of `gh api user`:
Expected origin:
Actual result of `git remote get-url origin`:
Target branch: main
Files to be committed:
Validation results:
Wrangler/KV/variable changes:
New child project detected or registered:
Final commit SHA:
```

## Required CLI sequence

```powershell
gh auth switch --hostname github.com --user <mapped-account>
gh api user --jq .login
git remote get-url origin
git status --short --branch
git diff --check
git push origin main
```

If `gh auth status` fails in a sandbox, follow the credential and network decision process in `AGENTS.md`. Do not immediately reauthorize.

## Common mapping mistakes to prevent

- `allsub` is not owned by `ironstraight`; it must be pushed to `yiloveM/allsub`.
- `asub` and `EthanSub` use a similar stack but are separate remotes and must never overwrite one another.
- EthanSub's Cloudflare custom domain is not a GitHub remote and must not become an asub asset dependency.
- The parent repository stores rules and domain sets, not complete snapshots of the three Workers projects.
- Treat 403, 404, network timeout, repository mismatch, and invalid credentials as different failures.
