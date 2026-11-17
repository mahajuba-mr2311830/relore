// Shared helpers for the Part 4 scripts. Uses the Edge or Chrome already installed on the computer.
const path = require('path');
const { pathToFileURL } = require('url');
const { chromium } = require('playwright-core');

const ROOT = path.resolve(__dirname, '..');
const PROTOTYPE = pathToFileURL(path.join(ROOT, 'prototype', 'index.html')).href;

async function launch() {
  for (const channel of ['msedge', 'chrome']) {
    try { return await chromium.launch({ channel }); } catch (e) { /* try the next browser */ }
  }
  return chromium.launch(); // falls back to Playwright's own browser, if installed
}

// Open the prototype at a route such as 'home' or 'item/linen-shirt'. clean = hide the demo handle.
async function open(page, route, clean = true) {
  await page.goto(`${PROTOTYPE}${clean ? '?clean=1' : ''}#/${route}`);
  await page.evaluate(() => document.fonts.ready);
}
const settle = (page, ms = 350) => page.waitForTimeout(ms);

module.exports = { ROOT, PROTOTYPE, launch, open, settle };
