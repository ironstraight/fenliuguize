// ClashMi/Mihomo JavaScript override for subscription profiles.
// Apply after GoodrulesWithFallback.ini conversion; routing rules stay intact.
function main(config) {
  if (!config || typeof config !== "object" || Array.isArray(config)) {
    throw new TypeError("A Mihomo configuration object is required");
  }

  var domestic = [
    "https://dns.alidns.com/dns-query",
    "https://doh.pub/dns-query"
  ];
  var foreign = [
    "https://1.1.1.1/dns-query#RULES",
    "https://8.8.8.8/dns-query#RULES"
  ];
  var existingDns = config.dns && typeof config.dns === "object" && !Array.isArray(config.dns)
    ? config.dns
    : {};
  var fakeIpFilter = [
    "+.lan", "+.local", "+.localdomain", "+.localhost", "+.home.arpa",
    "+.arpa", "+.invalid", "+.test", "+.example", "localhost",
    "time.*.com", "time.*.gov", "time.*.edu.cn", "+.pool.ntp.org",
    "+.ntp.org.cn", "stun.*.*", "stun.*.*.*", "stun.*.*.*.*",
    "+.stun.playstation.net", "+.stun.twilio.com", "+.turn.twilio.com",
    "+.srv.nintendo.net", "+.cdn.nintendo.net", "xbox.*.microsoft.com",
    "+.xboxlive.com", "+.captive.apple.com", "+.msftncsi.com",
    "+.msftconnecttest.com", "+.market.xiaomi.com",
    "localhost.ptlogin2.qq.com"
  ];

  // Keep explicit real-IP exceptions, but reject a catch-all that disables Fake-IP.
  if (existingDns["fake-ip-filter-mode"] !== "whitelist" &&
      Array.isArray(existingDns["fake-ip-filter"])) {
    existingDns["fake-ip-filter"].forEach(function(pattern) {
      if (typeof pattern === "string" && pattern !== "*" &&
          fakeIpFilter.indexOf(pattern) === -1) {
        fakeIpFilter.push(pattern);
      }
    });
  }

  config.ipv6 = false;
  config.dns = Object.assign({}, existingDns, {
    enable: true,
    listen: "127.0.0.1:1053",
    ipv6: false,
    "prefer-h3": false,
    "respect-rules": false,
    "enhanced-mode": "fake-ip",
    "fake-ip-range": "198.18.0.1/16",
    "fake-ip-filter-mode": "blacklist",
    "fake-ip-filter": fakeIpFilter,
    "default-nameserver": ["223.5.5.5", "119.29.29.29"],
    nameserver: foreign,
    "nameserver-policy": {
      "geosite:cn,private,apple,microsoft": domestic
    },
    "proxy-server-nameserver": domestic
  });

  // Direct traffic follows nameserver-policy, including foreign DIRECT domains.
  delete config.dns.fallback;
  delete config.dns["fallback-filter"];
  delete config.dns["direct-nameserver"];
  delete config.dns["direct-nameserver-follow-policy"];

  // A client-side TUN is required to capture OS DNS; a subscription server cannot do it.
  config.tun = {
    enable: true,
    stack: "system",
    "auto-route": true,
    "auto-detect-interface": true,
    "strict-route": true,
    "dns-hijack": ["any:53", "tcp://any:53"]
  };
  return config;
}
