# Client-side DNS leak protection

The DNS and TUN part of [Perfect-Rules Clash_mi.js](https://raw.githubusercontent.com/n0de-sudo/Perfect-Rules/refs/heads/main/Clash/Clash_mi.js) informed this project's small [ClashMiDnsGuard.js](ClashMiDnsGuard.js) override. The repository's existing `GoodrulesWithFallback.ini` already points subconverter to `OpenClashBase.yaml` for DNS and routing defaults. Apply the override to the resulting ClashMi/Mihomo subscription profile; it leaves proxies, proxy groups, and rules intact.

Override URL:

```text
https://raw.githubusercontent.com/ironstraight/fenliuguize/main/ClashMiDnsGuard.js
```

In ClashMi, add this URL as a JavaScript override for the profile, select it for that profile, and reconnect. Check the effective runtime configuration: `dns.enable`, `dns.enhanced-mode: fake-ip`, `tun.enable`, `tun.strict-route`, and both UDP and TCP entries in `tun.dns-hijack` must survive ClashMi's built-in overrides. If ClashMi's built-in DNS/TUN override replaces these values, set the built-in override for this profile to not override them, and use the app's TUN setting that accepts TUN from the profile. TUN may need elevated OS or VPN permission.

The script sends general and non-CN lookups to IP-addressed encrypted resolvers via Mihomo routing rules. CN/private/Apple/Microsoft names and proxy-node bootstrap use domestic DNS; DIRECT traffic follows the domain policy too. It removes the old fallback and direct resolver settings so unmatched foreign names do not also go to the domestic default or a domestic-only direct resolver. Its DNS listener binds only to loopback. The Fake-IP exceptions cover LAN, reverse DNS, NTP, STUN, captive portals, and common console discovery. IPv6 is disabled in both the core and DNS until an IPv6 TUN route and resolver policy are configured together.

Do not use this TUN override in OpenClash: OpenClash owns the router's interception and firewall integration. Continue using `OpenClashBase.yaml` there and configure OpenClash's DNS redirection and traffic capture in OpenClash itself. The three Cloudflare Workers aggregate subscriptions and cannot intercept a client's OS DNS, so they do not inject TUN settings into every subscription.

This reduces ordinary port-53 DNS leaks when the client's TUN is active. It cannot intercept browser/application DoH, Android Private DNS, or local-network DNS on macOS/Windows in all cases. Check the runtime configuration and test foreign-domain resolution on the target device. A DNS test can still show the deliberately configured domestic resolver for CN or proxy-node bootstrap lookups; that is expected routing, not evidence that a foreign-domain lookup leaked.

References: [Mihomo DNS settings](https://wiki.metacubex.one/en/config/dns/), [Mihomo TUN settings](https://wiki.metacubex.one/en/config/inbound/tun/), and [ClashMi override behavior](https://github.com/KaringX/clashmi-docu/blob/main/guide/faq.md).
