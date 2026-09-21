# Client-side DNS leak protection

For a click-by-click Chinese setup and verification guide, see [DNS_LEAK_PROTECTION.zh-CN.md](DNS_LEAK_PROTECTION.zh-CN.md).

The DNS and TUN part of [Perfect-Rules Clash_mi.js](https://raw.githubusercontent.com/n0de-sudo/Perfect-Rules/refs/heads/main/Clash/Clash_mi.js) informed this project's DNS policy and small [ClashMiDnsGuard.js](ClashMiDnsGuard.js) override. `GoodrulesWithFallback.ini` already points subconverter to `OpenClashBase.yaml`, so that base DNS policy reaches converted OpenClash/Mihomo profiles. The optional script adds OS-level capture for ClashMi and other Mihomo clients with JavaScript overrides; it leaves proxies, proxy groups, and rules intact.

| Client | Repository configuration | Required client-side capture |
| --- | --- | --- |
| OpenClash with Meta/Mihomo core | `GoodrulesWithFallback.ini` plus `OpenClashBase.yaml`; optional `OpenClashDnsGuard.module` | Enable OpenClash DNS redirection and ensure its generated DNS settings retain the intended upstreams |
| ClashMi | The converted profile plus `ClashMiDnsGuard.js` | Use the profile's TUN settings and check ClashMi built-in overrides |
| Other Mihomo-based Clash clients | The converted profile; use the script only if that client supports the same JavaScript override API | Enable the client's TUN/VPN mode with strict routing and both UDP/TCP port-53 DNS hijack |
| Legacy Clash core | No universal DNS leak guarantee from this Mihomo-oriented profile | Use a core-compatible DNS configuration and the client's own OS/router DNS capture; verify supported fields before import |

The shared base now resolves unmatched and known non-CN domains through IP-addressed DoH endpoints marked `#RULES`. Its explicit CN/private/Apple/Microsoft policy and proxy-node bootstrap keep domestic resolution where intended. Removing the former domestic default and global fallback prevents ordinary foreign lookups from also reaching a domestic DNS server. A direct connection still follows the domain policy; a deliberately direct CN query can show a domestic resolver.

Override URL:

```text
https://raw.githubusercontent.com/ironstraight/fenliuguize/main/ClashMiDnsGuard.js
```

In ClashMi, add this URL as a JavaScript override for the profile, select it for that profile, and reconnect. Check the effective runtime configuration: `dns.enable`, `dns.enhanced-mode: fake-ip`, `tun.enable`, `tun.strict-route`, and both UDP and TCP entries in `tun.dns-hijack` must survive ClashMi's built-in overrides. If ClashMi's built-in DNS/TUN override replaces these values, set the built-in override for this profile to not override them, and use the app's TUN setting that accepts TUN from the profile. TUN may need elevated OS or VPN permission.

The script sends general and non-CN lookups to IP-addressed encrypted resolvers via Mihomo routing rules. CN/private/Apple/Microsoft names and proxy-node bootstrap use domestic DNS; DIRECT traffic follows the domain policy too. It removes the old fallback and direct resolver settings so unmatched foreign names do not also go to the domestic default or a domestic-only direct resolver. Its DNS listener binds only to loopback. The Fake-IP exceptions cover LAN, reverse DNS, NTP, STUN, captive portals, and common console discovery. IPv6 is disabled in both the core and DNS until an IPv6 TUN route and resolver policy are configured together.

For OpenClash, select its Meta/Mihomo core and keep the converted profile based on `OpenClashBase.yaml`. On the OpenClash **Running Status** page, open **Overwrite Module**, use **+** to add a **Subscribe** module at the URL below, match it to this converted profile, enable it, and restart OpenClash. The module is opt-in: it sets firewall DNS redirection (`ENABLE_REDIRECT_DNS = 2`) and prevents OpenClash from replacing the base DNS servers or appending WAN/default DNS. If another local DNS service owns port 53, review that chain before enabling the module.

```text
https://raw.githubusercontent.com/ironstraight/fenliuguize/main/OpenClashDnsGuard.module
```

Check OpenClash's generated runtime DNS settings, not just the downloaded YAML. In particular, verify that ordinary `nameserver` and `fallback` do not include ISP/WAN DNS for foreign lookups, while `proxy-server-nameserver` remains reachable for node bootstrap. Do not use the ClashMi TUN script in OpenClash because OpenClash owns router interception and firewall integration. Test from an actual LAN client as well as the router.

The base configuration disables IPv6 inside Mihomo, but that alone does not block IPv6 traffic from LAN devices on the router. For OpenClash, either route IPv6 traffic and DNS through an explicitly tested IPv6 setup or disable IPv6 on the affected LAN/WAN path; otherwise the operating system may bypass the IPv4 capture.

For other Mihomo-based Clash clients, enable their native TUN/VPN capture with `auto-route`, `strict-route`, and `dns-hijack` for `any:53` plus `tcp://any:53`; check that the effective DNS policy remains the one from the converted profile. The JavaScript override can be used only where the client's override engine supports `main(config)`. The former Dreamacro Clash core and other older cores may reject Mihomo-only keys such as `#RULES` or `strict-route`. Do not import this profile unchanged into a core that fails validation. Old cores require a separate compatible DNS configuration and client-side DNS capture; DNS settings in a subscription alone cannot enforce that capture.

The three Cloudflare Workers aggregate subscriptions and cannot intercept a client's OS DNS, so they do not inject TUN settings into every subscription.

This reduces ordinary port-53 DNS leaks when the client's TUN is active. It cannot intercept browser/application DoH, Android Private DNS, or local-network DNS on macOS/Windows in all cases. Check the runtime configuration and test foreign-domain resolution on the target device. A DNS test can still show the deliberately configured domestic resolver for CN or proxy-node bootstrap lookups; that is expected routing, not evidence that a foreign-domain lookup leaked.

References: [Mihomo DNS settings](https://wiki.metacubex.one/en/config/dns/), [Mihomo TUN settings](https://wiki.metacubex.one/en/config/inbound/tun/), [OpenClash user guide](https://github.com/vernesong/OpenClash/blob/dev/.github/skills/openclash-user-guide/SKILL.md), [OpenClash DNS settings](https://github.com/vernesong/OpenClash/blob/dev/.github/skills/openclash-user-guide/11-overwrite-settings.md), [OpenClash module format](https://github.com/vernesong/OpenClash/blob/dev/.github/skills/openclash-user-guide/16-overwrite-module-format.md), and [ClashMi override behavior](https://github.com/KaringX/clashmi-docu/blob/main/guide/faq.md).
