# 分流规则与自定义订阅项目：工程级全局协作提示词

本文件适用于当前目录及全部子目录，是工程策略的唯一正文。任何 AI Agent、自动化工具或维护者开始工作前，必须完整阅读本文件、`REPOSITORY_MAP.md` 和 `PROJECT_PROGRESS.md`，再根据实际代码、Git 状态和命令反馈行动。`CLAUDE.md` 和 `.github/copilot-instructions.md` 只是兼容不同 Agent 的入口，不复制规则正文。不要凭记忆猜测账号、远端、部署变量或完成状态。

## 1. 项目定位与目录边界

当前父目录是 **OpenClash/Mihomo/ClashMi 等客户端使用的远端分流规则、规则集、域名集和基础配置仓库**，不是三个订阅前端的单体仓库。

父目录的核心文件包括：

- `GoodrulesWithFallback.ini`：主要 subconverter 远程配置，负责规则集和策略组编排。
- `OpenClashBase.yaml`：OpenClash/Mihomo 基础配置与 DNS、Fake-IP 等兼容设置。
- `AI.list`、`Apple.list`、`Microsoft.list`、`Direct.list`、`Global.list`、`HK.list`、`localnetwork.list`、`tk.list`、`youtube.list` 等：由本仓库维护的规则集或域名集。
- 其他 `.ini`、`.yaml`、`.list`、`.txt` 文件：历史配置、补充规则或兼容数据；修改前先确认调用关系。

三个子目录是独立发布的 Cloudflare Workers 自定义汇聚订阅项目：

- `allsub/`
- `asub/`
- `EthanSub/`

它们可能只是父目录下的工作副本，未必各自带 `.git`。根目录 `.gitignore` 已明确忽略这三个目录；**绝对不要移除忽略规则后把它们加入 `ironstraight/fenliuguize`。** 发布时必须按 `REPOSITORY_MAP.md` 使用各自远端。

## 2. 远端映射是唯一可信发布依据

| 相对目录 | 工程角色 | GitHub 远端 | 必须使用的 CLI 账号 | 默认分支 |
| --- | --- | --- | --- | --- |
| `.` | 规则、规则集、域名集和 OpenClash 基础配置 | `ironstraight/fenliuguize` | `ironstraight` | `main` |
| `allsub/` | AllSub 自定义订阅前端 | `yiloveM/allsub` | `yiloveM` | `main` |
| `asub/` | Astrowave SUB 自定义订阅前端 | `ironstraight/asub` | `ironstraight` | `main` |
| `EthanSub/` | Ethan SUB 自定义订阅前端 | `ironstraight/EthanSub` | `ironstraight` | `main` |

推送前必须同时验证：

1. 当前处理的本地目录。
2. `origin` 的所有者和仓库名。
3. GitHub CLI 当前账号。
4. 目标分支。
5. 待提交文件是否只属于本次任务。

任一项不匹配都必须停止推送并修正。禁止依靠文件夹名字猜远端，禁止向“名字看起来相似”的仓库试推。

### 2.1 新增子项目的自动发现与登记

每次任务开始时，除读取映射表外，还要扫描根目录一级子目录，检查是否存在以下任一情况：

- 用户明确说“新增、加入、迁入、复制”了一个子项目。
- 出现未登记的新目录、独立 `.git`、`package.json`、`wrangler.toml`、其他项目清单或新的 Git remote。
- 现有目录的 origin、所有者、默认分支、技术栈或用途发生变化。

发现后必须自动执行：

1. 只读识别项目类型、入口文件、技术栈、是否独立 Git 仓库及现有 origin。
2. 判断它是规则资产、三个订阅前端的同源项目，还是其他独立工程。
3. 从实际 `git remote`、GitHub 仓库信息或用户明确说明确定账号、远端和分支；信息不完整时标记“待确认”并询问用户，禁止猜测后 push。
4. 把项目加入本文件的目录拓扑和一致性分组，并更新 `REPOSITORY_MAP.md`。
5. 在 `PROJECT_PROGRESS.md` 的当前基线和完成记录中登记加入时间、来源、用途、远端、账号、分支、初始 SHA 和验证状态。
6. 独立子项目加入父目录时同步更新根 `.gitignore`，防止整个项目误入父仓库。
7. 若子项目已有自己的 `AGENTS.md`、README、部署文档或 AI 指令文件，更新与本项目全局规则相关的内容；若它将被单独 clone 使用且没有说明文件，创建最小的项目级 `AGENTS.md`，写清远端、账号、验证和与同源项目的同步义务。
8. 若它属于自定义订阅同源技术栈，把它纳入工程能力和前台交互同步检查；不能只登记名字而不纳入后续对齐流程。
9. 完成答复中单独列出“新增子项目登记”，明确告诉用户检测到什么、写入了哪些文件、远端映射、同步分组、验证结果和是否已 push。

如果扫描后没有新增项目，不需要制造记录；如果发现但尚未确认，必须在进度表和答复中显式写“待确认/未推送”。

## 3. 父仓库规则维护原则

### 3.1 修改范围

- 优先处理本仓库实际维护和引用的规则、规则集、域名集。
- `GoodrulesWithFallback.ini` 或其他配置引用的外部规则集，除非用户明确要求，不下载、不复制、不在本仓库伪造本地替代品。
- 增加域名时先确认现有列表是否已被主配置引用，避免创建无人使用的新文件。
- 同一服务的规则应放入语义正确的现有列表，避免在多个列表中无理由重复。

### 3.2 兼容性要求

- 同时考虑 OpenClash、Mihomo、ClashMi 和 subconverter 的语法差异。
- 域名规则只能写域名或受支持的规则类型，不把 URL 路径误写成 `DOMAIN-SUFFIX`。
- 检查重复项、大小写、不可见空格、NBSP、尾随空白、无效正则和无效 YAML。
- 修改策略组时同步核对：组名、规则集目标、手动组、测速组、故障转移组和 `FINAL` 的引用是否一致。
- `select` 组不要错误附带仅属于 `url-test`/`fallback` 的测速参数。
- 修改 DNS/Fake-IP 时重点检查：局域网、反向解析、NTP、STUN、主机发现、系统连通性检测、Microsoft/Apple 更新与 AI/视频服务的解析路径。
- 为仓库内远程规则使用版本查询参数时，仅在规则内容实际更新后递增，避免无意义缓存抖动。
- 不为了“补齐”而机械扩张域名；必须能说明归属、用途和客户端兼容价值。

### 3.3 父仓库最低检查

- `git diff --check`
- YAML 可解析且关键根字段存在。
- INI 中规则集目标与策略组名称一致。
- `.list` 文件不含 URL 路径式伪域名、明显重复和不可见尾随字符。
- 对本次修改涉及的规则执行针对性搜索，确认没有遗漏引用。

## 4. 三个自定义订阅项目的一致性契约

### 4.1 必须一致的工程能力

三个项目的后台处理能力必须保持一致，包括但不限于：

- 订阅 URL 的解析、去重、限制和安全校验。
- 换行及 `|` 分隔多条订阅 URL。
- Clash/Mihomo YAML、Base64 和分享 URI 的识别与转换。
- 全局排除、普通替换、正则替换、`/` 分隔关键词排除和标准正则排除。
- 按来源 URL 的名称映射。
- “全局排除先执行，再按来源命名和编号”的顺序。
- `来源名称|地区|001`、`002` 的三位编号行为，以及来源名称留空时保留原名的行为。
- YAML 节点名去重和策略组引用同步。
- 一次性订阅签名、兼容旧链接、缓存刷新、CORS、HEAD 回退、超时和大小限制。
- 后台登录、高级密码、查看/删除/保存、来源名称保护和主题切换权限。
- 二维码、错误提示、旧 KV 数据迁移和客户端响应头。

共享转换核心 `subscription-transform.js` 原则上应保持字节级一致。若确实需要项目专属差异，必须在代码和进度记录中说明原因，并增加覆盖测试。

### 4.2 前台交互和视觉一致性

三个项目的前台交互、布局结构、断点行为、卡片层级、按钮位置、输入体验、提示文案结构和终端/水主题的通用样式能力也应同步：

- 修改其中一个项目的交互或通用样式时，同一任务内检查并完美移植到另外两个项目。
- “查看所有订阅”中的删除按钮、URL、来源名称输入框不得重叠；桌面端和手机端都要验证。
- 每条订阅卡只显示该条 URL 和来源名称；全局重命名/排除规则只在列表下方独立显示一次。
- 输入提示统一说明“每行一个订阅 URL，使用 `|` 或换行分隔”。
- 弹窗要准确区分持久化配置与一次性订阅，不增加没有必要的前端密码门槛。

允许不同的内容：项目名称、品牌文字、中心图片、桌面背景、手机背景和其他明确的品牌素材。除此之外的交互和通用视觉结构默认需要保持一致。

### 4.3 视觉资源边界

- `allsub` 使用自身 `asset/001.webp`～`008.webp`、`mobile01.webp`～`mobile04.webp`、`c01.webp`～`c03.webp` 及本地水波纹脚本。
- `asub` 使用自身 `asset/pcbackground.webp`、`mobilebackground.webp`、`centerpic.webp`，不得重新依赖 EthanSub 域名。
- `EthanSub` 使用自身同名三张资源，资源 URL 应为 `/asset/...` 同源路径。
- 替换图片时优先保持文件名和比例；改名或增删资源时同步 Worker 静态资源允许列表、页面预加载和 CSS/JS 引用。
- 不随意重做用户已确认的主题风格；若用户要求回退，只回退视觉层，不回退已经验证的工程逻辑。

### 4.4 持久化边界

- 只有“添加到部署阵列”写入持久化订阅。
- 填写临时 URL/规则后点击“一键复制订阅”只生成一次性链接，不写 KV，不要求高级密码。
- 所有临时字段为空时，“一键复制订阅”返回读取 KV 持久化列表的默认 URL。
- 全局排除/重命名规则作用于所有持久化来源。
- 来源名称是按 URL 的独立映射；新增、修改或删除来源名称需要 `ADMIN_UNLOCK_PASSWORD`。
- 一次性订阅不得意外修改 `sub_links`、全局规则、主题、背景或来源名称。

### 4.5 Cloudflare 配置保护

三个 Worker 已在使用并可能在 Cloudflare Dashboard 中保存了变量和 Secret：

- 未经用户明确要求，不修改或删除 `wrangler.toml` 中已有变量、`keep_vars`、`ASSETS`、`MY_KV`、Worker 名、兼容日期和部署设置。
- 不创建新 KV 替换现有 `MY_KV`，不清空 KV，不迁移用户数据。
- 不把 `ADMIN_PASSWORD`、`ADMIN_UNLOCK_PASSWORD`、`SUBCONVERTER_TOKEN`、订阅 URL 或其他 Secret 写入仓库、测试输出和进度文件。
- 不因为 GitHub/Cloudflare 自动部署异常而擅自创建新 Worker、Token、Deploy Hook 或修改同账户其他项目。
- 代码升级应兼容现有 KV 数据；需要迁移时优先做惰性、可回退、用户确认后持久化的迁移。

## 5. 三项目修改工作流

修改任一自定义订阅项目时必须执行：

1. 先读取三个项目对应文件，识别工程公共部分和允许的品牌/背景差异。
2. 在一个项目完成实现后，同一任务内移植到另两个项目。
3. 对共享模块计算哈希或做无差异比较。
4. 对 Worker、管理页和测试做逐项目差异审查，确认差异只来自入口名、品牌内容或资源实现。
5. 每个项目分别运行测试和 Wrangler dry-run。
6. 浏览器检查数字雨与水主题，至少覆盖桌面宽度和约 390px 手机宽度。
7. 检查控制台错误、水平溢出、删除按钮/URL/输入框重叠和弹窗文案。
8. 逐仓库提交、逐账号切换、逐远端推送；禁止一个提交跨三个远端混推。
9. 把每个远端最终 commit SHA 写入 `PROJECT_PROGRESS.md`。

若只修改 README，也要核对三份 README 的能力描述一致，并保留各项目实际入口、默认路径、变量和资源差异。

## 6. GitHub CLI 凭据处理

本机可能已保存 `ironstraight` 和 `yiloveM` 多份有效凭据。沙箱、网络隔离或权限限制下，`gh auth status` 可能把无法联网误报为凭据失效。

强制原则：

- 不因一次沙箱内 `gh auth status` 失败就重新授权。
- 不随意执行 `gh auth logout`，不删除、覆盖或重建已有凭据。
- 先根据映射表切换账号：

```powershell
gh auth switch --hostname github.com --user <正确账号>
```

- 在具有正常网络权限的环境用实际 API 反馈确认：

```powershell
gh api user --jq .login
```

- 再检查远端：

```powershell
git remote get-url origin
```

- 只有在网络已确认可用、账号已切换正确，且 `gh api` 或实际 push 明确返回 401/Bad credentials/需要登录时，才触发：

```powershell
gh auth login --hostname github.com --git-protocol https --web
```

- 授权后再次核对登录名，不以“命令退出码为 0”代替身份核验。
- 403 权限不足、404 私有仓库不可见、远端名错误和网络超时是不同问题，不要都当成 Token 失效。

## 7. 网络访问策略：直连优先，7890 兜底

所有 GitHub、npm、Cloudflare、规则 URL 和文档访问都先使用直连。

只有在出现 DNS 失败、连接超时、TLS 建连失败、连接被重置等真实网络问题时，才临时尝试本机 `127.0.0.1:7890` 代理。不要因为 401、403、404、语法错误或仓库不存在而切代理。

Git 临时代理示例：

```powershell
git -c http.proxy=http://127.0.0.1:7890 -c https.proxy=http://127.0.0.1:7890 fetch origin
```

当前 PowerShell 进程临时代理示例：

```powershell
$env:HTTP_PROXY = "http://127.0.0.1:7890"
$env:HTTPS_PROXY = "http://127.0.0.1:7890"
gh api user --jq .login
Remove-Item Env:HTTP_PROXY -ErrorAction SilentlyContinue
Remove-Item Env:HTTPS_PROXY -ErrorAction SilentlyContinue
```

禁止把代理永久写入 Git 全局配置、仓库配置、Cloudflare 变量或项目源码。任务结束前清除本次进程设置的临时代理。

## 8. Git 与发布安全

- 开始修改前检查 `git status`，保留用户已有改动，不覆盖无关文件。
- 子项目不带 `.git` 时，从映射表中的准确远端拉取最新 `main` 到明确的临时目录，再只同步本次文件。
- 创建临时发布目录前检查目标不存在；删除前解析绝对路径并确认位于当前工作区。
- 禁止 `git reset --hard`、`git checkout --`、强制推送或删除远端分支，除非用户明确授权。
- 推送前运行 `git diff --check`、查看 `git diff --stat` 和 `git diff --name-only`。
- 不提交 `node_modules/`、`dist/`、`.wrangler/`、`.env*`、`.dev.vars*`、日志、临时克隆或真实 KV 数据。
- 对已有远端先拉取最新状态，避免覆盖别的设备或 Agent 的新提交。
- 每次 push 后记录完整 SHA 和远端 URL；push 输出成功后仍要确认本地分支与 `origin/main` 同步。

## 9. 验证与完成标准

### 9.1 三个订阅项目

每个项目至少执行：

```powershell
npm ci
npm run check
```

`npm run check` 应覆盖单元测试、语法检查和 Wrangler dry-run。另需针对本次变更进行浏览器回归。若环境无法执行某项检查，必须在进度记录中明确写“未验证”和原因，不能默认通过。

### 9.2 Definition of Done

只有同时满足以下条件才能向用户声明完成：

- 需求已在正确目录实现。
- 三个订阅项目的公共能力和交互已同步，或已说明为什么不需要同步。
- 用户现有 Cloudflare 变量、KV、Secret 和其他 Worker 未被改动。
- 相关自动化测试、dry-run 和必要的浏览器检查通过。
- GitHub CLI 使用了映射表要求的账号。
- origin 和分支正确，push 成功并取得完整 commit SHA。
- `PROJECT_PROGRESS.md` 已追加本次记录。
- 临时目录、临时日志和临时代理已清理。

## 10. 进度记录规范

每次任务开始时先读 `PROJECT_PROGRESS.md` 的“当前基线”和最新记录。每次任务完成时必须追加记录，至少包含：

- 日期与时区。
- 用户目标和实际范围。
- 修改的仓库及关键文件。
- 关键设计决定和兼容行为。
- 测试、dry-run、浏览器验证的真实结果。
- 是否影响 Cloudflare 变量/KV/Secret。
- 使用的 GitHub 账号、准确远端、分支和完整 commit SHA。
- 遇到的失败、真实原因和解决方式。
- 尚未完成事项或下次建议；没有则写“无”。
- 本次是否发现新增子项目；如有，记录登记文件、映射和同步分组。

记录必须基于命令反馈，不猜测，不写入密码、Token、订阅 URL 或其他敏感数据。
