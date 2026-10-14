// Run from the rules workspace with Playwright resolvable through NODE_PATH.
// This fixture uses each real Worker and only synthetic, in-memory KV data.
import assert from "node:assert/strict";
import { readFile, mkdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import { createRequire, register } from "node:module";
import { resolve } from "node:path";

const workspace = resolve(import.meta.dirname, "..");
const require = createRequire(import.meta.url);
const { chromium } = require("playwright");
const projects = [{ name: "allsub", entry: "allsub.js" }, { name: "asub", entry: "ethansub.js" }, { name: "EthanSub", entry: "ethansub.js" }].map(project => ({
  ...project, directory: existsSync(resolve(workspace, project.name, project.entry)) ? project.name : ".sync-" + project.name
}));
register(new URL("../" + projects.find(project => project.name === "asub").directory + "/tests/html-loader.mjs", import.meta.url), import.meta.url);
const artifacts = resolve(workspace, "tests/.browser-artifacts-20261013");
await mkdir(artifacts, { recursive: true });
process.env.TEMP = artifacts;
process.env.TMP = artifacts;
const executablePath = process.env.TEST_BROWSER_PATH || ["C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe", "C:/Program Files/Google/Chrome/Application/chrome.exe"].find(existsSync);
if (!executablePath) throw new Error("Set TEST_BROWSER_PATH to an installed Chromium browser");
const browser = await chromium.launchPersistentContext(resolve(artifacts, "profile"), {
  executablePath, headless: true, hasTouch: true,
  args: ["--disable-crash-reporter", "--disable-breakpad", "--no-first-run", "--disable-component-update"],
  env: { ...process.env, TEMP: artifacts, TMP: artifacts }
});
const results = [];
try {
  for (const project of projects) {
    const directory = resolve(workspace, project.directory);
    const { default: worker } = await import(new URL("../" + project.directory + "/" + project.entry, import.meta.url));
    for (const theme of ["terminal", "water"]) for (const width of [1280, 390]) {
      const data = new Map([["global_theme", theme], ["sub_links", JSON.stringify(["a", "b", "c"].map(key => ({
        url: "https://" + key + ".example.com/sub/" + "synthetic".repeat(20),
        sourceLabel: "Source " + key.toUpperCase(), replaceFrom: "", replaceTo: "", exclude: "Notice", isRegex: false
      })))], ["global_subscription_settings", JSON.stringify({ globalRules: { replaceFrom: "", replaceTo: "", exclude: "Notice", isRegex: false }, subconverterUrl: "", configUrl: "" })]]);
      let saves = 0;
      const env = {
        ADMIN_PATH: "matrix", ADMIN_PASSWORD: "test-admin", ADMIN_UNLOCK_PASSWORD: "test-unlock", SUB_TOKEN: "test-sub",
        MY_KV: { get: async key => data.get(key) ?? null, put: async (key, value) => { data.set(key, value); } },
        ASSETS: { fetch: async req => {
          const pathname = new URL(req.url).pathname;
          const file = resolve(directory, "asset", "." + pathname);
          if (!file.startsWith(directory + "/") && !file.startsWith(directory + "\\")) return new Response(null, { status: 404 });
          try { const body = await readFile(file); return new Response(body, { headers: { "Content-Type": pathname.endsWith(".js") ? "application/javascript" : "image/webp" } }); } catch { return new Response(null, { status: 404 }); }
        } }
      };
      const page = await browser.newPage();
      const errors = [];
      page.on("pageerror", error => errors.push(error.message));
      await page.addInitScript(() => { window.matrixTestEvents = []; for (const type of ["pointerdown", "pointermove", "pointerup", "lostpointercapture"]) document.addEventListener(type, event => { window.matrixTestEvents.push({ type, target: event.target.className, y: event.clientY, button: event.button }); }); });
      await page.setViewportSize({ width, height: 900 });
      await page.addInitScript(() => { Object.defineProperty(navigator, "clipboard", { value: { writeText: async text => { window.testCopiedUrl = text; } } }); });
      await page.route("https://cdn.jsdelivr.net/**", async route => {
        const filename = route.request().url().includes("jquery.ripples") ? "jquery.ripples-min.js" : "jquery.min.js";
        await route.fulfill({ contentType: "application/javascript", body: await readFile(resolve(workspace, projects.find(project => project.name === "allsub").directory, "asset", filename)) });
      });
      await page.route("https://fixture.example.com/**", async route => {
        const incoming = route.request();
        if (new URL(incoming.url()).pathname === "/favicon.ico") return route.fulfill({ status: 204, body: "" });
        if (new URL(incoming.url()).pathname === "/api/save-links") saves++;
        const response = await worker.fetch(new Request(incoming.url(), {
          method: incoming.method(), headers: incoming.headers(),
          body: ["GET", "HEAD"].includes(incoming.method()) ? undefined : incoming.postData()
        }), env, { waitUntil: promise => promise.catch(() => {}) });
        await route.fulfill({ status: response.status, headers: Object.fromEntries(response.headers), body: Buffer.from(await response.arrayBuffer()) });
      });
      const login = async () => {
        await page.locator("#passwordInput").fill("test-admin");
        await page.locator('#login-container button').click();
        await page.locator("#dashboard").waitFor({ state: "visible" });
      };
      const open = async password => {
        await page.locator('[onclick="openAdminModal()"]').click();
        await page.locator("#adminPwdInput").fill(password);
        await page.locator('[onclick="confirmAdminUnlock()"]').click();
      };
      const modalOpen = () => page.locator("#saveUnlockPwdInput").isVisible();
      await page.goto("https://fixture.example.com/matrix");
      await login();
      await open("wrong");
      await page.locator("#admin-error-msg").waitFor({ state: "visible" });
      assert.equal(await page.locator("#hidden-admin-area").isVisible(), false);
      await page.evaluate(() => closeAdminModal());
      await page.locator("#newUrl").fill("https://new.example.com/sub");
      await page.locator('[onclick="addLink()"]').click();
      await page.locator("#saveUnlockPwdInput").waitFor({ state: "visible" });
      await page.locator("#saveUnlockPwdInput").fill("wrong");
      await page.locator('[onclick="confirmSaveUnlockPassword()"]').click();
      await page.waitForFunction(() => document.getElementById("save-unlock-error-msg").textContent.includes("DENIED"));
      assert.equal(saves, 0);
      await page.evaluate(() => closeSaveUnlockModal());
      await open("test-unlock");
      await page.locator("#hidden-admin-area").waitFor({ state: "visible" });
      await page.locator('[onclick="addLink()"]').click();
      await page.waitForFunction(() => document.getElementById("newUrl").value === "");
      assert.equal(await modalOpen(), false);
      assert.equal(saves, 1);
      const persistentBeforeTemporary = data.get("sub_links");
      await page.locator('[onclick="copySubUrl()"]').click();
      await page.waitForFunction(() => window.testCopiedUrl === window.BASE_SUB_URL);
      await page.evaluate(() => closeQrModal());
      await page.locator("#newUrl").fill("https://temporary.example.com/sub");
      await page.locator('[onclick="copySubUrl()"]').click();
      await page.waitForFunction(() => window.testCopiedUrl && window.testCopiedUrl !== window.BASE_SUB_URL);
      assert.equal(data.get("sub_links"), persistentBeforeTemporary);
      await page.evaluate(() => closeQrModal());
      await page.locator("#newUrl").fill("");
      await page.locator(".source-label-input").first().fill("Draft Label");
      const cards = page.locator(".subscription-card");
      const urls = async () => cards.locator(".sub-url").allTextContents();
      const beforeDrag = await urls();
      const countBeforeDrag = saves;
      assert.equal(await page.locator(".matrix-sort-index, .matrix-move-up, .matrix-move-down").count(), 0);
      assert.equal(await page.locator(".matrix-sort-help, .matrix-sort-status, .matrix-sort-ready, .matrix-sort-active").count(), 0);
      assert.equal(await cards.first().getAttribute("tabindex"), "0");
      assert.equal(await cards.first().getAttribute("title"), null, "card hover tips should be removed");
      assert.doesNotMatch(await cards.first().innerText(), /可拖动排序|松开并拖动|正在移动/);
      await cards.first().focus();
      await page.keyboard.press("ArrowDown");
      assert.deepEqual(await urls(), [beforeDrag[1], beforeDrag[0], beforeDrag[2]], "keyboard sorting should remain available on the whole card");
      assert.equal(saves, countBeforeDrag, "keyboard sorting must remain unsaved");
      await page.keyboard.press("ArrowUp");
      assert.deepEqual(await urls(), beforeDrag, "the opposite key should restore the original order");
      assert.equal(saves, countBeforeDrag, "restoring the order must remain unsaved");
      const firstCardContent = cards.first().locator(".sub-url");
      await firstCardContent.scrollIntoViewIfNeeded();
      const start = await firstCardContent.boundingBox();
      const sourceCardBox = await cards.first().boundingBox();
      const target = await cards.nth(1).boundingBox();
      const grabOffsetY = start.y + start.height / 2 - sourceCardBox.y;
      const dropPointerY = target.y + target.height / 2 + 10;
      const assertPhysicalDrag = async () => {
        const state = await page.evaluate(() => {
          const card = document.querySelector("body > .subscription-card.is-dragging");
          const slot = document.querySelector("#subList > .subscription-card-placeholder");
          return card && slot ? {
            fixed: getComputedStyle(card).position === "fixed",
            floatingAboveList: card.parentElement === document.body && !document.getElementById("subList").contains(card),
            followsPointer: card.style.transform.includes("translate3d("),
            liftedShadow: getComputedStyle(card).boxShadow !== "none",
            slotVisible: slot.getBoundingClientRect().height > 0,
            slotTop: slot.getBoundingClientRect().top,
            cardTop: card.getBoundingClientRect().top
          } : null;
        });
        assert.ok(state, "dragging should show a floating card and an in-list drop slot");
        assert.equal(state.fixed, true, "the real card should float above the page");
        assert.equal(state.floatingAboveList, true, "the picked-up card should leave its list slot");
        assert.equal(state.followsPointer, true);
        assert.equal(state.liftedShadow, true, "the lifted card should have a strong shadow");
        assert.equal(state.slotVisible, true, "the original slot should remain visible");
        assert.ok(Math.abs(state.cardTop - (dropPointerY - grabOffsetY - 8)) < 24, "the floating card should track the pointer position");
      };
      if (width === 390) {
        const cdp = await browser.newCDPSession(page);
        const point = (x, y) => [{ x, y, id: 1, radiusX: 2, radiusY: 2, force: 1 }];
        await cdp.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: point(start.x + 15, start.y + start.height / 2) });
        await page.waitForTimeout(300);
        assert.equal(await cards.first().evaluate(card => card.classList.contains("is-drag-armed")), true, "mobile drag should arm after a long press");
        for (let step = 1; step <= 10; step++) {
          await cdp.send("Input.dispatchTouchEvent", { type: "touchMove", touchPoints: point(start.x + 15, start.y + start.height / 2 + (dropPointerY - start.y - start.height / 2) * step / 10) });
          if (step === 2) await page.waitForFunction(() => document.querySelector("body > .subscription-card.is-dragging") && document.querySelector(".subscription-card-placeholder"));
        }
        await assertPhysicalDrag();
        await cdp.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });
        await cdp.detach();
      } else {
        await page.mouse.move(start.x + 15, start.y + start.height / 2);
        await page.mouse.down();
        await page.mouse.move(start.x + 15, dropPointerY, { steps: 10 });
        await page.waitForFunction(() => document.querySelector("body > .subscription-card.is-dragging") && document.querySelector(".subscription-card-placeholder"));
        await assertPhysicalDrag();
        await page.mouse.up();
      }
      await page.waitForFunction(() => !document.querySelector(".is-dragging") && !document.querySelector(".subscription-card-placeholder"));
      const reordered = await urls();
      if (reordered[0] !== beforeDrag[1]) {
        console.log(JSON.stringify({ project: project.name, theme, width, start, target, errors, events: await page.evaluate(() => window.matrixTestEvents.slice(-20)), sorting: await page.locator("#subList").getAttribute("data-matrix-sorting") }));
        await page.screenshot({ path: resolve(artifacts, "drag-failure.png"), fullPage: true });
      }
      assert.equal(reordered[0], beforeDrag[1]);
      assert.equal(reordered[1], beforeDrag[0]);
      assert.equal(await page.locator(".source-label-input").nth(1).inputValue(), "Draft Label");
      assert.equal(saves, countBeforeDrag, "dragging must remain unsaved");
      await cards.first().focus();
      await page.keyboard.press("ArrowDown");
      assert.deepEqual(await urls(), beforeDrag);
      assert.equal(saves, countBeforeDrag, "keyboard sorting must remain unsaved");
      await cards.nth(1).focus();
      await page.keyboard.press("ArrowUp");
      assert.deepEqual(await urls(), reordered);
      const layout = await page.evaluate(() => {
        const overlap = (a, b) => a.left < b.right && a.right > b.left && a.top < b.bottom && a.bottom > b.top;
        return {
          overflow: document.documentElement.scrollWidth > window.innerWidth,
          overlapping: [...document.querySelectorAll(".subscription-card")].some(card => {
            const del = card.querySelector(".btn-danger").getBoundingClientRect();
            return [".sub-url", ".source-label-input"].some(selector => overlap(del, card.querySelector(selector).getBoundingClientRect()));
          }),
          globalCards: document.querySelectorAll(".global-rules-card").length
        };
      });
      assert.equal(layout.overflow, false);
      assert.equal(layout.overlapping, false);
      assert.equal(layout.globalCards, 1);
      await page.locator("#subList").scrollIntoViewIfNeeded();
      await page.screenshot({ path: resolve(artifacts, project.name + "-" + theme + "-" + width + ".png"), fullPage: true });
      await page.locator('[onclick="saveLinks()"]').click();
      await page.waitForFunction(() => document.getElementById("toast").textContent.includes("SAVED"));
      const saved = JSON.parse(data.get("sub_links"));
      assert.equal(saved[1].sourceLabel, "Draft Label");
      assert.deepEqual(saved.map(item => item.url), reordered.map(text => text.replace(/^> /, "")));
      await page.locator('[onclick="collapseAdminArea()"]').click();
      await page.locator("#newUrl").fill("https://locked.example.com/sub");
      await page.locator('[onclick="addLink()"]').click();
      await page.locator("#saveUnlockPwdInput").waitFor({ state: "visible" });
      await page.evaluate(() => closeSaveUnlockModal());
      await page.reload();
      await login();
      await page.locator("#newUrl").fill("https://after-reload.example.com/sub");
      await page.locator('[onclick="addLink()"]').click();
      await page.locator("#saveUnlockPwdInput").waitFor({ state: "visible" });
      await page.evaluate(() => closeSaveUnlockModal());
      await open("test-unlock");
      await page.locator("#hidden-admin-area").waitFor({ state: "visible" });
      assert.deepEqual(await urls(), reordered);
      assert.equal(await page.locator(".source-label-input").nth(1).inputValue(), "Draft Label");
      assert.deepEqual(errors, []);
      await page.close();
      const result = { project: project.name, theme, width, status: "PASS", checks: "unlock reuse/reset, wrong password, whole-card mouse/touch/keyboard sorting with drag animation, draft/save, copy persistence, layout/console" };
      results.push(result);
      console.log(JSON.stringify(result));
    }
  }
} finally { await browser.close(); }
console.log(JSON.stringify({ scenarios: results.length, allPassed: results.length === 12 }));
