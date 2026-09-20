const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");
const vm = require("node:vm");

const source = fs.readFileSync(path.join(__dirname, "..", "ClashMiDnsGuard.js"), "utf8");
const context = vm.createContext({});
vm.runInContext(source, context);
const main = context.main;

test("configures DNS capture without changing subscription routing", () => {
  const proxies = [{ name: "Node A", type: "ss" }];
  const groups = [{ name: "Proxy", type: "select", proxies: ["Node A"] }];
  const rules = ["MATCH,Proxy"];
  const config = { proxies, "proxy-groups": groups, rules, dns: {
    enable: false,
    "fake-ip-filter": ["+.custom.lan", "*"],
    "direct-nameserver": ["https://doh.pub/dns-query"],
    fallback: ["https://doh.pub/dns-query"]
  } };

  assert.equal(main(config), config);
  assert.equal(config.proxies, proxies);
  assert.equal(config["proxy-groups"], groups);
  assert.equal(config.rules, rules);
  assert.equal(config.dns.enable, true);
  assert.equal(config.dns["enhanced-mode"], "fake-ip");
  assert.equal(config.dns.listen, "127.0.0.1:1053");
  assert.equal(config.dns["fake-ip-filter"].includes("+.custom.lan"), true);
  assert.equal(config.dns["fake-ip-filter"].includes("*"), false);
  assert.equal(config.dns["fake-ip-filter"].includes("+.home.arpa"), true);
  assert.equal("fallback" in config.dns, false);
  assert.equal("direct-nameserver" in config.dns, false);
  assert.equal(config.dns.nameserver.every(value => value.endsWith("#RULES")), true);
  assert.equal(config.dns["nameserver-policy"]["geosite:cn,private,apple,microsoft"].length, 2);
  assert.equal(config.dns["nameserver-policy"]["geosite:geolocation-!cn"].length, 2);
  assert.equal(config.ipv6, false);
  assert.equal(config.dns.ipv6, false);
  assert.equal(config.tun.enable, true);
  assert.equal(config.tun["strict-route"], true);
  assert.equal(config.tun["auto-route"], true);
  assert.deepEqual(Array.from(config.tun["dns-hijack"]), ["any:53", "tcp://any:53"]);
});

test("works on a node-only subscription and is stable on repeat application", () => {
  const config = { proxies: [{ name: "Node A" }] };
  main(config);
  const once = JSON.stringify(config);
  main(config);
  assert.equal(JSON.stringify(config), once);
});

test("rejects non-object configurations", () => {
  assert.throws(() => main(null), { name: "TypeError" });
  assert.throws(() => main([]), { name: "TypeError" });
});
