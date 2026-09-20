# 项目维护进度与跨设备接力记录

此文件用于不同电脑、不同 AI Agent 和人工维护者之间接续工作。记录只包含工程状态，不得写入密码、Token、私有订阅 URL、KV 内容或其他敏感数据。

## 当前基线

| 相对目录 | 远端 | 账号 | 分支 | 已知远端基线 |
| --- | --- | --- | --- | --- |
| `.` | `ironstraight/fenliuguize` | `ironstraight` | `main` | `2a367e577d8dfb9783716dbf0743980da543d500` |
| `allsub/` | `yiloveM/allsub` | `yiloveM` | `main` | `854af701572876abcca505ea49d7d25592ccda10` |
| `asub/` | `ironstraight/asub` | `ironstraight` | `main` | `b2f62fb64ce02069510dfa396897096c3415c354` |
| `EthanSub/` | `ironstraight/EthanSub` | `ironstraight` | `main` | `834b14aa73a79d61c063da8ddfcccdcb4d9e748b` |

> 新任务开始时先用远端实际状态核对这些 SHA；如果远端已经前进，更新基线后再工作，不要回退新提交。

## 已完成记录

| 日期（Asia/Shanghai） | 范围 | 状态 | 完成内容 | 验证 | 远端提交 | 配置/KV 影响 | 后续 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 2026-09-20 | 父规则仓库 | 已完成 | 强化 `GoodrulesWithFallback.ini`、`OpenClashBase.yaml` 和 AI/Apple/Microsoft/local/TikTok/YouTube 规则；修正地区匹配、策略组参数、DNS 与 Fake-IP 兼容 | Git 提交已在 `origin/main`；共修改 8 个规则文件 | `ironstraight/fenliuguize` `17d6b7eda83fa1159ff1d39aa3f510ab63e06b55` | 无 Cloudflare 变量或 KV | 后续新增域名时继续核对本地规则引用与缓存版本 |
| 2026-09-20 | allsub 视觉层 | 已完成 | 回退不满意的水主题视觉刷新，保留既有工程逻辑 | 远端提交存在 | `yiloveM/allsub` `63ed4e5` | 无 | 已被后续基线包含 |
| 2026-09-20 | asub 视觉资源 | 已完成 | 将桌面背景、手机背景和中心图内置到 asub，移除对 EthanSub 域名的资源依赖 | 本地资源测试与远端提交存在 | `ironstraight/asub` `92508ef` | 无 | 已被后续基线包含 |
| 2026-09-20 | EthanSub 视觉层 | 已完成 | 回退不满意的水主题视觉刷新，保留既有工程逻辑 | 远端提交存在 | `ironstraight/EthanSub` `3a59f96` | 无 | 已被后续基线包含 |
| 2026-09-21 | allsub | 已完成 | 增加按来源 URL 命名；全局排除先于编号；旧 KV 固定名称迁移；来源名称高级密码保护；列表中全局规则独立显示；更新模块化 README | 19 项测试通过；语法检查和 Wrangler dry-run 通过；桌面/手机、数字雨/水主题本地布局检查通过 | `yiloveM/allsub` `854af701572876abcca505ea49d7d25592ccda10` | 未修改 `wrangler.toml`、变量、Secret 或 KV 绑定 | 无 |
| 2026-09-21 | asub | 已完成 | 与 allsub/EthanSub 对齐按来源命名、排除、临时订阅、权限和后台交互；README 增加新手部署、正则示例及本地图片位置 | 20 项测试通过；语法检查和 Wrangler dry-run 通过；本地图片独立性测试通过；桌面/手机布局检查通过 | `ironstraight/asub` `b2f62fb64ce02069510dfa396897096c3415c354` | 未修改 `wrangler.toml`、变量、Secret 或 KV 绑定 | 无 |
| 2026-09-21 | EthanSub | 已完成 | 与 allsub/asub 对齐按来源命名、排除、临时订阅、权限和后台交互；README 增加新手部署、正则示例及图片位置 | 19 项测试通过；语法检查和 Wrangler dry-run 通过；桌面/手机布局检查通过 | `ironstraight/EthanSub` `834b14aa73a79d61c063da8ddfcccdcb4d9e748b` | 未修改 `wrangler.toml`、变量、Secret 或 KV 绑定 | 无 |
| 2026-09-21 | 父仓库工程治理 | 已完成 | 新增全局 `AGENTS.md`、远端映射表、跨设备进度表、Claude/Copilot 入口和父仓库忽略规则；规定新子项目自动发现、登记、同步分组及最终答复告知 | 一级目录扫描仅发现已登记的 allsub/asub/EthanSub；暂存差异检查通过；6 个治理文件进入提交 | `ironstraight/fenliuguize` `2a367e577d8dfb9783716dbf0743980da543d500` | 未修改任何 Cloudflare 变量、Secret 或 KV；新增子项目：无 | 后续任务按本文件持续追加 |

## 当前统一行为

- 三个订阅项目共享相同的 `subscription-transform.js` 实现。
- 多 URL 输入支持换行或 `|`，无需在分隔符旁添加空格。
- 持久化全局排除先处理原节点，再按来源独立编号。
- 来源名称格式为 `来源名称|地区|001`；来源名称已有同一地区时不重复；无法识别地区时为 `来源名称|001`。
- 来源名称留空时保留原节点名，若存在全局重命名则使用全局规则。
- 一次性订阅不落库、不要求高级密码；只有“添加到部署阵列”写入持久化数据。
- 所有临时输入为空时，一键复制持久化默认订阅。
- 每条订阅卡仅显示 URL 和该 URL 的来源名称；全局规则只在列表底部显示一次。
- asub 水主题资源已本地化，不依赖 EthanSub 当前域名。

## 新任务记录模板

完成任务后复制下面的表格行追加到“已完成记录”，并更新“当前基线”：

```markdown
| YYYY-MM-DD | 相对目录/功能范围 | 已完成/部分完成/阻塞 | 修改内容与关键决定 | 测试、dry-run、浏览器验证的实际结果 | `owner/repo` `完整 SHA` | 是否影响变量/KV/Secret | 未完成事项或“无” |
```

需要更详细信息时，在表格后追加小节：

```markdown
### YYYY-MM-DD：任务标题

- 用户目标：
- 修改文件：
- 兼容性决定：
- 网络：直连是否成功；如使用 7890，说明只用于临时网络兜底。
- GitHub：切换账号、API 返回账号、origin、分支。
- 验证：
- 失败及真实原因：
- 远端提交：
- 配置/KV/Secret 影响：
- 下次建议：
- 新增子项目：无，或填写目录、远端、账号、同步分组和登记文件。
```

## 接力检查清单

换电脑或更换 Agent 后：

1. 阅读 `AGENTS.md` 和 `REPOSITORY_MAP.md`。
2. 获取四个远端最新 `main`，不要只相信本文件中的旧 SHA。
3. 检查工作区是否已有未提交内容并确认归属。
4. 核对三个订阅项目的共享模块哈希和工程能力是否仍一致。
5. 核对 Cloudflare 变量、KV 和 Secret 仍由现有部署管理，不把它们写入仓库。
6. 网络先直连，真实网络失败才临时使用 `127.0.0.1:7890`。
7. GitHub CLI 只切换已有正确账号；沙箱误报不等于需要重新授权。
8. 完成后更新本文件并记录准确 commit SHA。
9. 扫描一级子目录；发现未登记项目时，按 `AGENTS.md` 自动识别、登记并在最终答复中明确报告。
