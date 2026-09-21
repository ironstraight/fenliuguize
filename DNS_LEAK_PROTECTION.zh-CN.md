# 防 DNS 泄露：OpenClash 与 ClashMi 手把手教程

本教程配套使用项目中的两个可选文件：

- [OpenClashDnsGuard.module](OpenClashDnsGuard.module)：交给 OpenClash 接管路由器上的 53 端口 DNS 重定向，并阻止 OpenClash 额外加入 WAN/默认 DNS。
- [ClashMiDnsGuard.js](ClashMiDnsGuard.js)：交给 ClashMi 或兼容 `main(config)` 的 Mihomo 客户端补上 Fake-IP、TUN 严格路由以及 UDP/TCP 53 端口劫持。

它们解决的是不同位置的问题，**不要把 `ClashMiDnsGuard.js` 导入 OpenClash，也不要把 `.module` 当作 ClashMi 配置导入。**

## 一、开始前先确认

1. 订阅应当由本项目的 `GoodrulesWithFallback.ini` 和 `OpenClashBase.yaml` 生成。
2. OpenClash 必须使用 Meta/Mihomo 内核；旧版 Dreamacro Clash 内核不支持本方案的全部字段。
3. ClashMi 应升级到能添加 JavaScript/JS 覆写的版本。如果添加覆写时没有 `JS` 类型，不要把 `.js` 改名为 `.yaml`，也不要直接粘进 YAML 配置。
4. 先保留一份当前能联网的配置。出现问题时，可以取消覆写并重新连接，不需要删除订阅。
5. 如果路由器已经安装 AdGuard Home、MosDNS、SmartDNS，或另一个程序正在接管 53 端口，先看本教程的“多 DNS 服务冲突”部分，不要直接启用 OpenClash 模块。

本仓库的在线地址如下：

```text
OpenClash 模块：
https://raw.githubusercontent.com/ironstraight/fenliuguize/main/OpenClashDnsGuard.module

ClashMi JavaScript 覆写：
https://raw.githubusercontent.com/ironstraight/fenliuguize/main/ClashMiDnsGuard.js
```

在正式设备上希望固定版本、不随 `main` 更新时，可使用当前实现提交的固定地址：

```text
https://raw.githubusercontent.com/ironstraight/fenliuguize/0bf193a05340fcf946b4728131707b6383f2f6f6/OpenClashDnsGuard.module
https://raw.githubusercontent.com/ironstraight/fenliuguize/0bf193a05340fcf946b4728131707b6383f2f6f6/ClashMiDnsGuard.js
```

## 二、OpenClash 安装步骤

### 第 1 步：确认内核与当前配置

1. 登录 OpenWrt 的 LuCI 管理页面。
2. 打开 **服务 -> OpenClash**。
3. 确认 OpenClash 当前可以正常启动，且核心类型为 Meta/Mihomo。
4. 记下当前使用的配置文件名。第一次启用时，建议只匹配这个配置，不要直接匹配全部配置。

### 第 2 步：添加覆写模块

1. 进入 OpenClash 的 **运行状态** 页面。
2. 点击页面上方的 **覆写模块**。它通常位于启动/停止按钮附近。
3. 点击右下角或模块列表中的 **+**。
4. 选择 **Subscribe / 订阅模块**，不要选普通 Clash 配置订阅。
5. 按下面填写：

| 项目 | 填写内容 |
| --- | --- |
| 名称 | `DNS-Guard` |
| 类型 | `Subscribe` / 订阅 |
| URL | `https://raw.githubusercontent.com/ironstraight/fenliuguize/main/OpenClashDnsGuard.module` |
| 匹配配置 | 选择第 1 步记下的当前配置 |
| 顺序 | 保持默认即可 |
| 自动更新 | 初次测试建议关闭；验证通过后再按需要开启 |

**匹配配置不能留空。** OpenClash 的模块配置为空时，模块不会应用。等一个配置验证通过后，再决定是否改为 `all`。

### 第 3 步：检查模块内容并启用

1. 保存模块，回到覆写模块列表。
2. 打开刚添加的 `DNS-Guard`，确认能看到以下内容：

```ini
[General]
ENABLE_REDIRECT_DNS = 2
ENABLE_CUSTOM_DNS = 0
APPEND_WAN_DNS = 0
APPEND_DEFAULT_DNS = 0
```

3. 打开这个模块卡片的 **启用** 开关。
4. 点击 OpenClash 的 **保存并应用** 或 **重启 OpenClash**。
5. 等待 OpenClash 完全启动，再继续验证。只保存模块但不重启，不算生效。

这四项的含义是：

- `ENABLE_REDIRECT_DNS = 2`：使用防火墙将 LAN 设备的 UDP/TCP 53 查询重定向给 OpenClash。
- `ENABLE_CUSTOM_DNS = 0`：不让 OpenClash 的“自定义 DNS”页面覆盖订阅中的 DNS 配置。
- `APPEND_WAN_DNS = 0`：不把运营商/WAN DNS 加入运行配置。
- `APPEND_DEFAULT_DNS = 0`：不额外加入 OpenClash 默认 DNS。

### 第 4 步：验证 OpenClash 确实生效

先看 **运行状态/调试日志**，确认没有 YAML 校验失败、DNS 端口占用或模块下载失败。然后检查 OpenClash 的**运行时配置**，不要只看下载目录里的原始 YAML。

运行时配置至少应满足：

```yaml
dns:
  enable: true
  enhanced-mode: fake-ip
  nameserver:
    - https://1.1.1.1/dns-query#RULES
    - https://8.8.8.8/dns-query#RULES
```

同时检查：

- `nameserver-policy` 中仍有 `geosite:cn,private,apple,microsoft` 的国内加密 DNS。
- `proxy-server-nameserver` 仍然存在，用于代理节点域名的启动解析。
- 不应重新出现运营商/WAN DNS。
- 不应重新出现全局 `fallback` 或 `direct-nameserver`。

熟悉 SSH 的用户还可以在路由器上只读检查模块对应的 UCI 值：

```sh
uci -q get openclash.config.enable_redirect_dns
uci -q get openclash.config.enable_custom_dns
uci -q get openclash.config.append_wan_dns
uci -q get openclash.config.append_default_dns
```

预期依次为 `2`、`0`、`0`、`0`。如果命令没有输出，先以 OpenClash 页面和调试日志为准，不要手工写 UCI；不同 OpenClash 版本的内部项可能变化。

### 第 5 步：从真实 LAN 设备测试

1. 手机或电脑连接这个 OpenWrt 路由器的 Wi-Fi/LAN。
2. 暂时关闭手机蜂窝数据，防止测试流量绕过路由器。
3. Android 测试时将 **私人 DNS / Private DNS** 暂时设为关闭；浏览器“安全 DNS”也先关闭。它们使用应用层 DoH，普通 53 端口重定向无法拦截。
4. 断开并重新连接 Wi-Fi，或清理本机 DNS 缓存。
5. 先访问一个国内网站，再访问一个国外网站，确认两者均可正常打开。
6. 打开 [BrowserLeaks DNS](https://browserleaks.com/dns) 或 [DNSLeakTest](https://www.dnsleaktest.com/) 运行测试。

结果判断：

- 国外域名测试不应显示本地运营商的普通 DNS。
- 测试中出现 Cloudflare/Google 等本方案配置的海外解析服务，属于预期结果。
- 国内域名、Apple/Microsoft 域名和代理节点启动解析会按策略使用国内加密 DNS，因此测试偶尔看到阿里/DNSPod 不一定是泄露。
- 如果仍看到运营商 DNS，检查 OpenClash 是否真的使用当前配置、模块是否匹配该配置、浏览器 DoH/Android 私人 DNS 是否仍开启，以及 IPv6 是否绕过。

### 第 6 步：OpenClash 回退

如果启用后不能解析域名：

1. 回到 **运行状态 -> 覆写模块**。
2. 关闭 `DNS-Guard` 的 **启用** 开关。
3. 重启 OpenClash。
4. 确认恢复联网后，再排查 53 端口冲突或运行配置被其他覆写模块改写的问题。

回退只需禁用模块，不必删除订阅或基础配置。

## 三、ClashMi 安装步骤

ClashMi 的页面名称会随平台和版本略有差异，例如“配置/我的配置”“覆写/核心覆写”。操作逻辑相同：先添加 JS 覆写，再把它绑定到具体订阅。

### 第 1 步：先导入正常的 Clash/Mihomo 订阅

1. 在 ClashMi 中导入由本项目生成的 Clash/Mihomo 订阅。
2. 先不添加 DNS Guard，连接一次并确认这个订阅本身可用。
3. 如果订阅本身无法通过配置校验，先修复订阅，不要用覆写掩盖错误。

### 第 2 步：添加 JavaScript 覆写

1. 打开 ClashMi 的 **核心设置**。
2. 进入 **覆写**。
3. 点击右上角 **+**、**添加覆写**，或 **添加覆写链接**。
4. 选择通过 URL 添加，填写：

| 项目 | 填写内容 |
| --- | --- |
| 名称 | `DNS Guard` |
| 类型 | `JS` / `JavaScript` |
| URL | `https://raw.githubusercontent.com/ironstraight/fenliuguize/main/ClashMiDnsGuard.js` |

5. 保存后打开这条覆写。如果编辑页面把 JS 的用途分为“追加-覆写”和“内置-覆写”，应让该 JS 成为处理完整配置的覆写脚本，不要把它当作 YAML 片段追加。部分版本或教程把这个脚本槽位称为 **内置-覆写**；这与下一步中 ClashMi 自带 DNS/TUN 的最终“内置-覆写”开关不是同一件事。
6. 如果列表里完全没有 `JS` 或 `JavaScript` 类型，说明当前版本没有暴露兼容的 JS 覆写入口。本文件不能在这个版本中使用，跳到“其他 Mihomo 客户端”按原生 YAML/TUN 字段配置。

### 第 3 步：把覆写绑定到订阅

1. 回到 **配置/我的配置** 列表。
2. 点击目标订阅右侧的 **三点菜单**。
3. 选择 **编辑**。
4. 找到 **核心覆写/覆写**，选择刚才创建的 `DNS Guard`。
5. 保存。

仅仅把脚本添加到覆写列表，不会自动作用于所有订阅；必须完成绑定。

### 第 4 步：处理 ClashMi 内置 DNS/TUN 覆写

ClashMi 的组合顺序通常是：订阅配置 -> 自定义覆写 -> ClashMi 内置覆写。最后一步可能再次盖掉脚本，所以要这样设置：

1. 在当前配置的最终覆写选项中选择 **内置-不覆写**，让脚本提供的 DNS、`proxy-server-nameserver` 和 TUN 字段保留下来。不要选择会重新套用 ClashMi 默认 DNS 的 **内置-覆写**。
2. 打开 **核心设置 -> DNS**。如果还有单独的 **覆写** 开关，将它关闭，避免内置 DNS 改写脚本结果。
3. 打开 **核心设置 -> TUN**。
4. 将 TUN 的 **启用** 打开，让系统建立 VPN/TUN 接口。
5. 将 TUN 的 **覆写** 关闭，让脚本中的 `tun` 配置生效。
6. Windows 版如果无流量，以管理员身份运行 ClashMi；Android/iOS/macOS 按系统提示允许 VPN/TUN 权限。

这里“启用”和“覆写”不是同一个开关：本方案需要 TUN 服务启用，但不需要 ClashMi 内置 TUN 配置覆盖脚本。ClashMi 官方 FAQ 也说明，TUN 来源于订阅配置时应禁用内置 TUN“覆写”。

### 第 5 步：重连并检查运行配置

1. 完全断开当前连接。
2. 重新选择目标订阅并连接。
3. 打开 ClashMi 的 **运行配置/配置预览/当前配置**。不同版本名称不同，目标是查看组合后的最终配置。
4. 搜索并确认下面这些值存在：

```yaml
dns:
  enable: true
  enhanced-mode: fake-ip
  ipv6: false

tun:
  enable: true
  stack: system
  auto-route: true
  auto-detect-interface: true
  strict-route: true
  dns-hijack:
    - any:53
    - tcp://any:53
```

还应确认：

- 默认 `nameserver` 为脚本中的加密海外 DNS，并带有 `#RULES`。
- `nameserver-policy` 保留国内/私有/Apple/Microsoft 策略。
- `fallback`、`fallback-filter`、`direct-nameserver` 没有被其他覆写重新加入。

如果脚本存在但最终配置不是这些值，优先检查第 4 步的 ClashMi 内置覆写。判断是否成功必须看**最终运行配置**，不能只看 JS 文件内容。

### 第 6 步：ClashMi 设备测试

1. Android：测试期间关闭系统 **私人 DNS / Private DNS**；它能绕过 TUN 的 53 端口劫持。
2. iOS/macOS：关闭其他 VPN、DNS 描述文件或同时运行的网络扩展。
3. Windows：确认 ClashMi 有管理员权限，且没有另一个 VPN/TUN 软件抢占路由。
4. 关闭浏览器“安全 DNS/使用安全 DNS”，清理 DNS 缓存后重开浏览器。
5. 访问国内和国外网站确认连通，再运行 [BrowserLeaks DNS](https://browserleaks.com/dns) 或 [DNSLeakTest](https://www.dnsleaktest.com/)。

与 OpenClash 一样，看到策略中明确配置的国内加密 DNS 不等于国外域名发生泄露；重点是国外查询不应走本地运营商 DNS。

### 第 7 步：ClashMi 回退

如果添加脚本后不能联网：

1. 断开 ClashMi。
2. 打开目标订阅的 **编辑** 页面。
3. 将 **核心覆写/覆写** 改为“无”或原来的覆写。
4. 保存并重新连接。

无需删除订阅。恢复后依次检查 JS 是否下载成功、TUN 权限、内置覆写、Android 私人 DNS 和其他 VPN 冲突。

## 四、其他 Mihomo/Clash 客户端

### 支持 `main(config)` JavaScript 覆写的 Mihomo 客户端

可以尝试使用 `ClashMiDnsGuard.js`，但必须同时满足：

1. 客户端文档明确支持 JavaScript 覆写入口 `main(config)`。
2. 最终内核为近期 Mihomo，而不是旧 Clash。
3. 客户端能启用系统 TUN/VPN。
4. 最终运行配置保留 `strict-route` 和 UDP/TCP 两条 `dns-hijack`。

界面名称不同不影响原理。导入脚本后，仍要检查最终配置并做真实设备测试。

### 只支持 YAML 覆写的 Mihomo 客户端

不要导入 `.js`。直接使用本项目生成的 Mihomo 配置，并在客户端原生 TUN 设置中确认：

```yaml
tun:
  enable: true
  auto-route: true
  auto-detect-interface: true
  strict-route: true
  dns-hijack:
    - any:53
    - tcp://any:53
```

同时保留 `OpenClashBase.yaml` 的 `dns` 部分。客户端若有自己的 DNS/TUN 覆写，必须检查它是否覆盖这些字段。

### 旧版 Clash/Dreamacro 内核

旧内核可能不认识 `#RULES`、`strict-route` 或部分 Mihomo DNS 字段，因此本方案不能承诺兼容。配置校验失败时，不要逐项删除字段后继续使用；应升级到 Mihomo 内核，或为旧客户端单独维护兼容 DNS 配置并使用客户端自身的系统 DNS 捕获功能。

## 五、常见问题

### 1. OpenClash 模块下载成功，但没有生效

- 检查模块卡片是否启用。
- 检查“匹配配置”是否是当前正在运行的配置；空值不会生效。
- 重启 OpenClash。
- 查看调试日志中是否有其他覆写模块在后面重新修改相同设置。

### 2. OpenClash 开启后所有域名都无法解析

最常见原因是 53 端口被 AdGuard Home、MosDNS、SmartDNS 或另一个 DNS 服务占用。先禁用 `DNS-Guard` 恢复网络，再明确 DNS 链路的唯一入口。

如果希望由 AdGuard Home 先接收 LAN DNS，就不能让 OpenClash 防火墙重定向直接绕过它；应把 AdGuard Home 的上游指向 OpenClash/Mihomo 的 DNS 监听端口，并按所用插件的官方联动方案配置。不要同时让两个服务各自把 53 端口抢为入口。

### 3. ClashMi 导入了 JS，但 TUN 配置没有变化

- 确认脚本已经绑定到当前订阅，而不只是存在于覆写列表。
- 确认类型是 JS/JavaScript。
- 确认选择了完整配置覆写模式，而不是把 JS 当 YAML 追加。
- 将当前配置设为“内置-不覆写”，关闭内置 DNS/TUN 的“覆写”，并保留 TUN“启用”。
- 完全断开后重新连接，再看最终运行配置。

### 4. 测试仍显示 DNS 服务器

DNS 泄露测试一定会显示某个实际提供解析的服务器，目标不是让列表为空，而是避免国外查询落到本地运营商或未授权 DNS。Cloudflare、Google，以及策略明确允许的阿里/DNSPod 都可能正常出现。

### 5. 为什么还要关注 IPv6

本项目在 Mihomo DNS 和核心配置中关闭了 IPv6，但这不等于路由器或操作系统彻底关闭 IPv6。OpenClash 环境如果没有完整代理 IPv6 流量和 DNS，要么补齐并测试 IPv6 路由，要么在相关 LAN/WAN 路径禁用 IPv6。否则设备可能绕过 IPv4 的 DNS 捕获。

### 6. 浏览器 DoH、Android 私人 DNS 能否被拦截

不能保证。它们通常把 DNS 封装在 HTTPS/TLS 中，不走普通 UDP/TCP 53。需要在系统或应用里关闭，或用单独的网络访问策略控制其服务地址。

## 六、完成检查表

完成后逐项确认：

- [ ] OpenClash 使用 Meta/Mihomo，或 ClashMi 使用近期 Mihomo。
- [ ] 覆写已绑定到当前配置，而不只是成功下载。
- [ ] OpenClash UCI 四项为 `2/0/0/0`，或 ClashMi 最终配置包含 TUN 严格路由与两条 53 劫持。
- [ ] 最终配置没有被客户端内置覆写重新加入 WAN/运营商 DNS。
- [ ] 已处理 Android 私人 DNS、浏览器安全 DNS、其他 VPN 和 IPv6 绕过。
- [ ] 国内、国外网站均能访问。
- [ ] DNS 泄露测试没有出现未授权的本地运营商 DNS。
- [ ] 已记住回退方法：OpenClash 禁用模块；ClashMi 解绑核心覆写。

## 七、参考资料

- [本项目技术说明](DNS_LEAK_PROTECTION.md)
- [OpenClash 官方用户指南](https://github.com/vernesong/OpenClash/blob/dev/.github/skills/openclash-user-guide/SKILL.md)
- [OpenClash 覆写模块格式](https://github.com/vernesong/OpenClash/blob/dev/.github/skills/openclash-user-guide/16-overwrite-module-format.md)
- [OpenClash DNS 覆写设置](https://github.com/vernesong/OpenClash/blob/dev/.github/skills/openclash-user-guide/11-overwrite-settings.md)
- [ClashMi 官方 FAQ：覆写和 TUN 行为](https://github.com/KaringX/clashmi-docu/blob/main/guide/faq.md)
- [ClashMi `proxy-server-nameserver` 被内置覆写覆盖的案例](https://github.com/KaringX/clashmi/issues/485)
- [Mihomo DNS 配置](https://wiki.metacubex.one/config/dns/)
- [Mihomo TUN 配置](https://wiki.metacubex.one/config/inbound/tun/)

这套配置用于降低常见系统 DNS 泄露风险，不代表在所有操作系统、所有应用层 DoH 和所有多 VPN 环境中自动实现绝对阻断。最终以客户端的运行配置和真实设备测试结果为准。
