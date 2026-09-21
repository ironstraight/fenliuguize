# 防 DNS 泄露快速操作手册

只按下面步骤操作即可。OpenClash 使用 `.module`，ClashMi 使用 `.js`，不要混用。

## 一、OpenClash

### 准备

- OpenClash 使用 Meta/Mihomo 内核。
- 先确认当前配置能够正常联网。

模块地址：

```text
https://raw.githubusercontent.com/ironstraight/fenliuguize/main/OpenClashDnsGuard.module
```

### 添加模块

1. 登录 OpenWrt。
2. 进入 **服务 -> OpenClash -> 运行状态**。
3. 在运行状态页顶部，找到与“启动/停止”“重启”并排的英文按钮 **`Overwrite Module`**。

   **不要进入左侧菜单里的“覆写设置”。那是另一个页面。**

4. 点击 **`Overwrite Module`**，会弹出标题为 **`Overwrite Edit`** 的窗口。
5. 在窗口顶部的模块卡片栏中，点击最左侧的 **`+`**。
6. 弹出 **`Add Overwrite Module`** 后，点击 **`Subscribe Link`** 页签。
7. 按下表填写：

| 页面字段 | 填写内容 |
| --- | --- |
| `File Name` | `OpenClashDnsGuard.module` |
| `Config File` | 选择当前正在运行的配置文件 |
| `Type` | `http` |
| `Subscription URL` | 粘贴上面的模块地址 |
| `Update Time` | 两项都选 `OFF` |
| `Environment variable` | 留空 |

`Config File` 不能留空，否则模块不会生效。首次使用不要选全部配置。

8. 点击窗口右下角 **`Add`**。
9. 回到 **`Overwrite Edit`**，找到新出现的 `OpenClashDnsGuard.module` 卡片，打开卡片上的**启用开关**。
10. 关闭弹窗，回到运行状态页，点击 **重启 OpenClash**。

### 检查是否成功

1. 等 OpenClash 重新显示“运行中”。
2. 手机连接这台路由器的 Wi-Fi，并暂时关闭蜂窝数据、Android“私人 DNS”和浏览器“安全 DNS”。
3. 打开 [BrowserLeaks DNS](https://browserleaks.com/dns) 测试。
4. 结果中不应出现本地运营商 DNS。出现配置使用的 Cloudflare、Google、阿里或 DNSPod 属于正常情况。

### 找不到 `Overwrite Module`

先确认你位于 **服务 -> OpenClash -> 运行状态**，并查找英文 `Overwrite Module`，不是“覆写设置”。

如果运行状态页顶部确实没有这个按钮，说明当前 OpenClash 界面版本不包含官方指南中的新版覆写编辑器。请先升级 OpenClash，再重新按本节操作。

### OpenClash 回退

进入 **运行状态 -> `Overwrite Module`**，关闭 `OpenClashDnsGuard.module` 卡片的启用开关，然后重启 OpenClash。

## 二、ClashMi

脚本地址：

```text
https://raw.githubusercontent.com/ironstraight/fenliuguize/main/ClashMiDnsGuard.js
```

### 添加脚本

1. 先导入正常的 Clash/Mihomo 订阅，并确认它可以联网。
2. 进入 **核心设置 -> 覆写**。
3. 点击右上角 **`+`**，选择 **添加配置链接**。
4. 粘贴上面的脚本地址，类型选择 **`js`**，名称填写 `DNS Guard`，然后保存。
5. 打开刚添加的 `DNS Guard` 进行编辑，将 **追加覆写** 设为 **内置-不覆写**，然后保存。
6. 回到配置列表，点击目标订阅右侧的三点菜单，选择 **编辑**。
7. 在 **核心覆写** 中选择 `DNS Guard`，然后保存。
8. 进入 **核心设置 -> TUN**：

   - **启用**：打开
   - **覆写**：关闭

9. 完全断开 ClashMi，再重新连接。

### 检查是否成功

1. 在 ClashMi 的当前运行配置中搜索 `strict-route`，应为 `true`。
2. `dns-hijack` 中应同时存在 `any:53` 和 `tcp://any:53`。
3. 关闭 Android“私人 DNS”和浏览器“安全 DNS”后，再打开 [BrowserLeaks DNS](https://browserleaks.com/dns) 测试。

如果添加覆写时没有 `js` 类型，当前 ClashMi 版本不能使用此脚本，请先升级 ClashMi。

### ClashMi 回退

断开 ClashMi，编辑目标订阅，将 **核心覆写** 改回 **内置-覆写** 或原来的选项，保存后重新连接。

## 三、最常见的两个问题

- OpenClash 模块已添加但不生效：检查 `Config File` 是否选中了当前配置、模块卡片开关是否打开，并重启 OpenClash。
- 启用后无法联网：先按对应的“回退”步骤恢复；OpenClash 再到 **运行日志 -> 生成日志** 获取调试日志，不要继续盲目修改其他 DNS 选项。

参考：[OpenClash 官方用户指南](https://github.com/vernesong/OpenClash/blob/dev/.github/skills/openclash-user-guide/SKILL.md)、[OpenClash 覆写模块操作说明](https://github.com/vernesong/OpenClash/blob/dev/.github/skills/openclash-user-guide/16-overwrite-module-format.md)、[ClashMi 官方 FAQ](https://github.com/KaringX/clashmi-docu/blob/main/guide/faq.md)。
