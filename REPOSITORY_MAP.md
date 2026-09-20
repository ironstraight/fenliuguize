# 本地目录与 GitHub 远端映射表

本文件是发布目标的权威映射。相对路径以本文件所在的 `fenliuguize` 根目录为基准，因此复制到其他电脑后仍然有效。

## 映射表

| 相对路径 | 内容 | GitHub 远端 | GitHub CLI 账号 | 分支 | 发布备注 |
| --- | --- | --- | --- | --- | --- |
| `.` | OpenClash/Mihomo/ClashMi 规则、规则集、域名集、基础配置 | `https://github.com/ironstraight/fenliuguize.git` | `ironstraight` | `main` | 父仓库；不得提交下面三个完整子目录 |
| `allsub/` | AllSub Cloudflare Workers 自定义汇聚订阅 | `https://github.com/yiloveM/allsub.git` | `yiloveM` | `main` | 唯一需要 `yiloveM` 的项目 |
| `asub/` | Astrowave SUB Cloudflare Workers 自定义汇聚订阅 | `https://github.com/ironstraight/asub.git` | `ironstraight` | `main` | asub 自带三张水主题图片 |
| `EthanSub/` | Ethan SUB Cloudflare Workers 自定义汇聚订阅 | `https://github.com/ironstraight/EthanSub.git` | `ironstraight` | `main` | 当前自定义域名为 `https://ebr.arkalpool.eu.org/`；域名不等于 Git 远端 |

## 当前工作区说明

- 根目录本身是 `ironstraight/fenliuguize` 的 Git 工作区。
- `allsub/`、`asub/`、`EthanSub/` 可能没有各自的 `.git`；根目录 `.gitignore` 会阻止它们进入父仓库。
- 这三个目录属于三个独立远端，不能执行 `git add allsub asub EthanSub` 加入父仓库。
- 换电脑后可以把四个仓库分别 clone；若仍采用一个父目录容纳三个工作副本，也必须保持此映射不变。

## 新增子项目登记规则

发现或收到用户加入的新子项目时，必须在本表新增一行，并同时更新：

- `AGENTS.md` 的目录边界、工程分组和同步要求。
- `PROJECT_PROGRESS.md` 的当前基线与完成记录。
- 根 `.gitignore`（独立仓库或独立工作副本必须忽略）。
- 子项目自己的 `AGENTS.md`/README/部署说明（如适用）。

新增行至少填写相对目录、项目角色、完整远端 URL、CLI 账号、默认分支和发布备注。远端或账号尚未确认时写“待确认”，并在确认前禁止 push。任务结束答复必须明确向用户报告登记结果，不能只在文件中静默更新。

## 推送前强制核对模板

对每个仓库逐项填写，不允许跳过：

```text
本地相对目录：
预期 GitHub 账号：
gh api user 实际返回：
预期 origin：
git remote get-url origin 实际返回：
目标分支：main
待提交文件：
测试结果：
是否修改 wrangler/KV/变量：
是否发现/登记新增子项目：
最终 commit SHA：
```

## CLI 操作顺序

```powershell
gh auth switch --hostname github.com --user <映射表账号>
gh api user --jq .login
git remote get-url origin
git status --short --branch
git diff --check
git push origin main
```

如果 `gh auth status` 在沙箱中失败，先按 `AGENTS.md` 的网络和凭据流程判断，不要立刻重新授权。

## 常见错误防护

- `allsub` 不属于 `ironstraight`，它必须推送到 `yiloveM/allsub`。
- `asub` 与 `EthanSub` 名字和技术栈相近，但它们是两个独立远端，不能互相覆盖。
- `EthanSub` 的 Cloudflare 自定义域名不是 GitHub 远端，也不应写进 asub 的资源依赖。
- 父仓库保存规则和域名集，不保存三个 Workers 项目的完整源码快照。
- 403、404、网络超时和凭据失效必须按实际反馈区分处理。
