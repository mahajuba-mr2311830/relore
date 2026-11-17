// Builds the "Testing Relore's MVPs" mind-map.
// Edit the CONTENT section below, then run: node build-mindmap.js
// Output (in ../mindmap): mindmap.svg (editable), mindmap.mmd (Mermaid), mindmap.png, mindmap.pdf
const fs = require('fs');
const path = require('path');
const { pathToFileURL } = require('url');
const { ROOT, launch } = require('./common');

const OUT = path.join(ROOT, 'mindmap');
fs.mkdirSync(OUT, { recursive: true });

/* ------------------------------ CONTENT ------------------------------ */
const TITLE = 'Testing Relore’s MVPs';
// side: R = right of the centre, L = left. kind: 'test' (maroon) or 'decide' (ink).
const BRANCHES = [
  { n: 1, side: 'R', kind: 'test', title: ['Concierge MVP'], leaves: [
    'Orders taken by Instagram and WhatsApp',
    'The team reviews every listing by hand',
    'Log every question buyers and sellers ask',
    'Tests willingness to pay the delivery fee'] },
  { n: 2, side: 'R', kind: 'test', title: ['Wizard of Oz MVP'], leaves: [
    'The app looks complete to the user',
    'Listings reviewed by hand behind the scenes',
    'Collection and delivery arranged manually',
    'Tests the full journey before automating'] },
  { n: 3, side: 'R', kind: 'test', title: ['Clickable prototype', 'usability tests'], leaves: [
    'Task-based tests with QU students',
    'Tasks: find an item, check out, list an item',
    'Record completion, errors and time taken',
    'Check the fee and decline policy are clear'] },
  { n: 4, side: 'R', kind: 'test', title: ['Landing page /', 'smoke test'], leaves: [
    'Waitlist sign-ups for buyers and sellers',
    'Ties in with the Part 5 landing page',
    'Measure visit-to-sign-up conversion',
    'Compare buyer interest with seller interest'] },
  { n: 5, side: 'R', kind: 'test', title: ['Social media tests'], leaves: [
    'A/B test Instagram posts (@relore.qa)',
    'A/B test TikTok Reels',
    'Messages: price, sustainability or trust',
    'Measure saves, clicks and waitlist sign-ups'] },
  { n: 6, side: 'L', kind: 'test', title: ['Campus pilot'], leaves: [
    'Limited launch at Qatar University',
    'Real listings, orders and deliveries',
    'One Relore driver within Greater Doha',
    'Planning target: 30 orders a month (BMC)'] },
  { n: 7, side: 'L', kind: 'test', title: ['Surveys and', 'interviews'], leaves: [
    'Team survey, n = 29 (feasibility study)',
    'Top frustration: unclear condition, 76%',
    'Next: test the QAR 15 + 0.80/km fee and 20%',
    'Interview sellers: only 2 of 29 sell today'] },
  { n: 8, side: 'L', kind: 'decide', title: ['Metrics to track'], leaves: [
    'Listings submitted',
    'Share of listings sold',
    'Repeat buyers',
    'Delivery cost per order',
    'Review turnaround time'] },
  { n: 9, side: 'L', kind: 'decide', title: ['Pivot or persevere', 'criteria'], note: 'All thresholds are assumptions', leaves: [
    'Assumed go: 30+ orders a month by month 3',
    'Assumed go: 30%+ of listings sold in 30 days',
    'Assumed go: 25%+ of buyers order again',
    'Assumed pivot: delivery costs exceed the fee'] }
];
const FOOT = 'Relore · CMPS307 · Part 4: product and pitch';

/* ------------------------------ BRAND ------------------------------- */
// Palette v2: Supermoon background, After Hours text, The Patio for the "measure and decide" branches,
// Ryokan for connector lines, Relore Maroon kept for the logo button and the "ways to test" branches.
const C = { maroon: '#8A1538', ink: '#3D2922', text: '#38373D', sand: '#EEEFEA', white: '#FFFFFF', line: '#B8A28F', soft: '#57565E', tint: '#C9877B' };
const FONT = 'Jost, Arial, sans-serif';
const SYMBOL = '../prototype/assets/relore-symbol-color.svg';   // the kit file; never redrawn

/* ------------------------------ LAYOUT ------------------------------ */
const W = 1920, H = 1080, CX = 960, CY = 540, DISC = 138;
const LH = 36, LEAF = 22, TOP = 62, BOTTOM = 1012;
const PILL_W = 296, PILL_H = 72, PILL_DX = 304;       // pill centre is PILL_DX from the canvas centre
const LEAF_GAP = 40;                                   // pill edge to leaf dot

const esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
let svg = '';
const add = s => { svg += s + '\n'; };

function layoutSide(side) {
  const list = BRANCHES.filter(b => b.side === side);
  const total = list.reduce((s, b) => s + b.leaves.length * LH, 0);
  const gap = (BOTTOM - TOP - total) / (list.length - 1);
  let y = TOP;
  for (const b of list) {
    b.y0 = y; b.h = b.leaves.length * LH; b.cy = y + b.h / 2;
    y += b.h + gap;
  }
}
layoutSide('R'); layoutSide('L');

add(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-labelledby="mmTitle mmDesc">`);
add(`<title id="mmTitle">Mind-map: ${esc(TITLE)}</title>`);
add(`<desc id="mmDesc">Nine branches: ${BRANCHES.map(b => b.title.join(' ')).join('; ')}.</desc>`);
add(`<style>@import url('https://fonts.googleapis.com/css2?family=Jost:ital,wght@0,400;0,500;0,600;0,700;1,400&amp;display=swap'); text { font-family: ${FONT}; }</style>`);
add(`<rect width="${W}" height="${H}" fill="${C.sand}"/>`);

// Connectors first, so the nodes sit on top
for (const b of BRANCHES) {
  const s = b.side === 'R' ? 1 : -1;
  const px = CX + s * PILL_DX, inner = px - s * PILL_W / 2, outer = px + s * PILL_W / 2;
  // leave the disc in the direction of the branch, so the nine connectors fan out
  const ang = Math.atan2((b.cy - CY) * 0.62, inner - CX), r1 = DISC - 6, r2 = DISC + 34;
  const sx = (CX + r1 * Math.cos(ang)).toFixed(1), sy = (CY + r1 * Math.sin(ang)).toFixed(1);
  const c1x = (CX + r2 * Math.cos(ang)).toFixed(1), c1y = (CY + r2 * Math.sin(ang)).toFixed(1);
  add(`<path d="M${sx} ${sy} C${c1x} ${c1y} ${inner - s * 48} ${b.cy} ${inner} ${b.cy}" fill="none" stroke="${b.kind === 'test' ? C.maroon : C.ink}" stroke-width="4.5" stroke-linecap="round"/>`);
  b.leaves.forEach((t, i) => {
    const ly = b.y0 + LH * i + LH / 2, lx = outer + s * LEAF_GAP;
    add(`<path d="M${outer} ${b.cy} C${outer + s * 26} ${b.cy} ${lx - s * 26} ${ly} ${lx} ${ly}" fill="none" stroke="${C.line}" stroke-width="2" stroke-linecap="round"/>`);
  });
}

// Branch pills and leaves
for (const b of BRANCHES) {
  const s = b.side === 'R' ? 1 : -1;
  const px = CX + s * PILL_DX, outer = px + s * PILL_W / 2;
  const fill = b.kind === 'test' ? C.maroon : C.ink;
  add(`<g id="branch-${b.n}">`);
  add(`<rect x="${px - PILL_W / 2}" y="${b.cy - PILL_H / 2}" width="${PILL_W}" height="${PILL_H}" rx="18" fill="${fill}"/>`);
  const tx = px + 20;
  if (b.title.length === 1) add(`<text x="${tx}" y="${b.cy}" dy=".35em" text-anchor="middle" font-size="24" font-weight="600" fill="${C.white}">${esc(b.title[0])}</text>`);
  else b.title.forEach((t, i) => add(`<text x="${tx}" y="${b.cy + (i ? 15 : -13)}" dy=".35em" text-anchor="middle" font-size="23" font-weight="600" fill="${C.white}">${esc(t)}</text>`));
  add(`<circle cx="${px - PILL_W / 2 + 28}" cy="${b.cy}" r="15" fill="${C.white}"/><text x="${px - PILL_W / 2 + 28}" y="${b.cy}" dy=".36em" text-anchor="middle" font-size="18" font-weight="700" fill="${fill}">${b.n}</text>`);
  if (b.note) {
    const nw = 262, ny = b.cy + PILL_H / 2 + 12;
    add(`<rect x="${px - nw / 2}" y="${ny}" width="${nw}" height="32" rx="6" fill="${C.white}"/><rect x="${px - nw / 2 + 4}" y="${ny + 4}" width="${nw - 8}" height="24" rx="3" fill="none" stroke="${C.tint}" stroke-width="1.4" stroke-dasharray="5 4"/>`);
    add(`<text x="${px}" y="${ny + 16}" dy=".36em" text-anchor="middle" font-size="16" font-weight="600" fill="${C.maroon}">${esc(b.note)}</text>`);
  }
  b.leaves.forEach((t, i) => {
    const ly = b.y0 + LH * i + LH / 2, lx = outer + s * LEAF_GAP;
    add(`<circle cx="${lx}" cy="${ly}" r="4.5" fill="${fill}"/>`);
    add(`<text class="leaf" x="${lx + s * 14}" y="${ly}" dy=".35em" text-anchor="${s === 1 ? 'start' : 'end'}" font-size="${LEAF}" fill="${C.text}">${esc(t)}</text>`);
  });
  add(`</g>`);
}

// Centre: the Relore symbol on white, with a clear zone of one button diameter, then the title
const SYM = 96;                                       // the image box; the button inside it is about 78 px across
add(`<g id="centre">`);
add(`<circle cx="${CX}" cy="${CY}" r="${DISC}" fill="${C.white}"/>`);
add(`<image href="${SYMBOL}" x="${CX - SYM / 2}" y="${CY - SYM / 2}" width="${SYM}" height="${SYM}"/>`);
const TW = 252, TH = 88, TY = CY + 120;   // 120 px from the centre keeps the symbol’s clear zone (39 + 78 px)
const TLINES = TITLE.split(' ').length > 2 ? [TITLE.split(' ').slice(0, 2).join(' '), TITLE.split(' ').slice(2).join(' ')] : [TITLE];
add(`<rect x="${CX - TW / 2}" y="${TY}" width="${TW}" height="${TH}" rx="26" fill="${C.text}"/>`);
TLINES.forEach((t, i) => add(`<text x="${CX}" y="${TY + TH / 2 + (TLINES.length === 1 ? 0 : i ? 17 : -15)}" dy=".35em" text-anchor="middle" font-size="28" font-weight="700" fill="${C.white}">${esc(t)}</text>`));
add(`</g>`);

// Key and footer
add(`<g id="key" font-size="16" fill="${C.soft}">`);
add(`<rect x="${CX - 150}" y="${H - 64}" width="18" height="18" rx="5" fill="${C.maroon}"/><text x="${CX - 124}" y="${H - 55}" dy=".35em">Ways to test</text>`);
add(`<rect x="${CX + 4}" y="${H - 64}" width="18" height="18" rx="5" fill="${C.ink}"/><text x="${CX + 30}" y="${H - 55}" dy=".35em">Measure and decide</text>`);
add(`<text x="${CX}" y="${H - 26}" dy=".35em" text-anchor="middle" font-size="15">${esc(FOOT)}</text>`);
add(`</g>`);
add(`</svg>`);

fs.writeFileSync(path.join(OUT, 'mindmap.svg'), svg);

// Mermaid source (paste into mermaid.live to edit as a simple outline)
let mmd = `mindmap\n  root((${TITLE.replace('’', "'")}))\n`;
for (const b of BRANCHES) {
  mmd += `    ${b.n}. ${b.title.join(' ')}${b.note ? ' - ' + b.note.toLowerCase() : ''}\n`;
  for (const l of b.leaves) mmd += `      ${l.replace(/[()]/g, '')}\n`;
}
fs.writeFileSync(path.join(OUT, 'mindmap.mmd'), mmd);

// PNG and PDF through the browser, so that Jost and the logo file are used as they are
(async () => {
  const tmp = path.join(OUT, '_render.html');
  fs.writeFileSync(tmp, `<!doctype html><html lang="en-GB"><head><meta charset="utf-8"><link href="https://fonts.googleapis.com/css2?family=Jost:ital,wght@0,400;0,500;0,600;0,700;1,400&display=swap" rel="stylesheet"><style>@page{size:${W}px ${H}px;margin:0}html,body{margin:0;background:${C.sand}}svg{display:block}</style></head><body>${svg.replace(/<style>.*?<\/style>/s, `<style>text{font-family:${FONT}}</style>`)}</body></html>`);
  const browser = await launch();
  const page = await (await browser.newContext({ viewport: { width: W, height: H }, deviceScaleFactor: 2 })).newPage();
  await page.goto(pathToFileURL(tmp).href);
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(400);
  // Report anything that runs off the canvas or overlaps
  const warn = await page.evaluate(({ W, H }) => {
    const out = [], boxes = [...document.querySelectorAll('text')].map(t => ({ t: t.textContent, b: t.getBoundingClientRect() }));
    for (const { t, b } of boxes) if (b.left < 16 || b.right > W - 16 || b.top < 8 || b.bottom > H - 8) out.push('near edge: ' + t + ' [' + Math.round(b.left) + '..' + Math.round(b.right) + ']');
    const leaves = [...document.querySelectorAll('text.leaf')].map(t => ({ t: t.textContent, b: t.getBoundingClientRect() }));
    const pills = [...document.querySelectorAll('g[id^="branch-"] > rect:first-of-type, #centre circle, #centre rect')].map(r => r.getBoundingClientRect());
    for (const l of leaves) for (const p of pills) if (l.b.left < p.right && l.b.right > p.left && l.b.top < p.bottom && l.b.bottom > p.top) out.push('overlap: ' + l.t);
    const widest = leaves.reduce((m, l) => Math.max(m, l.b.width), 0);
    out.push('widest leaf: ' + Math.round(widest) + 'px; fonts: ' + [...document.fonts].filter(f => f.status === 'loaded').length + ' loaded');
    return out;
  }, { W, H });
  warn.forEach(w => console.log(w));
  await page.screenshot({ path: path.join(OUT, 'mindmap.png') });
  await page.pdf({ path: path.join(OUT, 'mindmap.pdf'), width: W + 'px', height: H + 'px', printBackground: true, pageRanges: '1' });
  await browser.close();
  fs.unlinkSync(tmp);
  console.log('built mindmap.svg, mindmap.mmd, mindmap.png (3840 x 2160), mindmap.pdf');
})().catch(e => { console.error(e); process.exit(1); });
