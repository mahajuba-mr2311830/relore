// Automated checks for the Relore prototype. Run: node check-prototype.js
// 1. Fee and payout maths (worked examples)   2. Buyer flow click-through
// 3. Seller and admin flow click-through      4. No dead buttons on any screen
// 5. Layout at 360, 390 and 430 px widths     6. No console errors
const { launch, open, settle } = require('./common');

const results = [];
const ok = (name, pass, detail = '') => { results.push({ name, pass, detail }); console.log(`${pass ? 'PASS' : 'FAIL'}  ${name}${detail ? '  (' + detail + ')' : ''}`); };
const eq = (name, got, want) => ok(name, JSON.stringify(got) === JSON.stringify(want), `got ${JSON.stringify(got)}, expected ${JSON.stringify(want)}`);

(async () => {
  const browser = await launch();
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1, isMobile: true, hasTouch: true });
  const page = await ctx.newPage();
  const problems = [];
  page.on('console', m => { if (m.type() === 'error') problems.push('console: ' + m.text()); });
  page.on('pageerror', e => problems.push('pageerror: ' + e.message));
  page.on('requestfailed', r => problems.push('request failed: ' + r.url()));

  const tap = async sel => { await page.locator(sel).first().click(); await settle(page, 200); };
  const text = sel => page.locator(sel).first().innerText();
  const hash = () => page.evaluate(() => location.hash);
  const visible = sel => page.locator(sel).first().isVisible();

  /* ---------- 1. Maths ---------- */
  console.log('\n== 1. Fee and payout maths ==');
  await open(page, 'home');
  const maths = await page.evaluate(() => {
    const R = window.Relore;
    return {
      fee0: R.deliveryFee(0), fee5: R.deliveryFee(5), fee10: R.deliveryFee(10), fee12: R.deliveryFee(12), fee20: R.deliveryFee(20), fee7_5: R.deliveryFee(7.5),
      com150: R.commission(150), pay150: R.sellerPayout(150), com45: R.commission(45), pay45: R.sellerPayout(45), com380: R.commission(380), pay380: R.sellerPayout(380), pay25: R.sellerPayout(25),
      card: R.orderTotals(45, 12, 'card'), cod: R.orderTotals(45, 12, 'cod'), fees: R.FEES
    };
  });
  eq('FEES constants', maths.fees, { deliveryBase: 15, deliveryPerKm: 0.8, commissionRate: 0.2 });
  eq('Delivery 0 km = QAR 15.00', maths.fee0, 15);
  eq('Delivery 5 km = QAR 19.00', maths.fee5, 19);
  eq('Delivery 10 km = QAR 23.00 (matches the BMC PDF)', maths.fee10, 23);
  eq('Delivery 12 km = QAR 24.60 (brief example)', maths.fee12, 24.6);
  eq('Delivery 20 km = QAR 31.00', maths.fee20, 31);
  eq('Delivery 7.5 km = QAR 21.00', maths.fee7_5, 21);
  eq('QAR 150 sale: commission 30, seller receives 120', [maths.com150, maths.pay150], [30, 120]);
  eq('QAR 45 sale: commission 9, seller receives 36', [maths.com45, maths.pay45], [9, 36]);
  eq('QAR 380 sale: commission 76, seller receives 304', [maths.com380, maths.pay380], [76, 304]);
  eq('QAR 25 sale: seller receives 20', maths.pay25, 20);
  eq('Order QAR 45 + 12 km, item by card', maths.card, { item: 45, delivery: 24.6, total: 69.6, payNow: 69.6, payOnDelivery: 0 });
  eq('Order QAR 45 + 12 km, cash on delivery', maths.cod, { item: 45, delivery: 24.6, total: 69.6, payNow: 24.6, payOnDelivery: 45 });

  /* ---------- 2. Buyer flow ---------- */
  console.log('\n== 2. Buyer flow ==');
  await open(page, 'splash');
  ok('Splash shows the logo file and tagline', await visible('.splash img.logo[src="assets/relore-horizontal-color.svg"]') && (await text('.tagline')).length > 10);
  await tap('.splash [data-go="home"]');
  eq('Start browsing opens Home', await hash(), '#/home');
  const cards = await page.locator('#grid .card').count();
  ok('Home shows 8 to 12 reviewed listings', cards >= 8 && cards <= 12, cards + ' listings');
  ok('Every listing is marked as reviewed', (await page.locator('#grid .card .sewn').count()) === cards);
  const prices = await page.evaluate(() => window.Relore.state.listings.map(l => l.price));
  ok('Prices are within QAR 25 to 400', prices.every(p => p >= 25 && p <= 400), prices.join(', '));
  await page.fill('#q', 'zara'); await settle(page, 150);
  ok('Search filters the grid', (await page.locator('#grid .card').count()) === 2, await text('#count'));
  await page.fill('#q', ''); await settle(page, 150);
  await tap('.chip[data-v="abaya"]');
  ok('Category chip filters the grid', (await page.locator('#grid .card').count()) === 2, await text('#count'));
  await tap('.chip[data-v="all"]');
  await page.selectOption('#size', 'M'); await settle(page, 150);
  ok('Size filter filters the grid', (await page.locator('#grid .card').count()) === 4, await text('#count'));
  await page.selectOption('#size', 'kids'); await page.fill('#q', 'blazer'); await settle(page, 150);
  ok('Empty state appears with a working Clear filters button', await visible('[data-act="clear-filters"]'));
  await tap('[data-act="clear-filters"]');
  eq('Clear filters restores all listings', await page.locator('#grid .card').count(), cards);

  await tap('[data-go="item/linen-shirt"]');
  eq('Listing opens Item details', await hash(), '#/item/linen-shirt');
  await page.waitForFunction(() => { const i = document.querySelector('#carousel .slide img.photo'); return i && i.complete && i.naturalWidth > 0; }, null, { timeout: 5000 }).catch(() => {});
  ok('Item details shows a real front photo that has loaded', await page.evaluate(() => { const i = document.querySelector('#carousel .slide img.photo'); return !!i && i.naturalWidth > 0 && i.getAttribute('src').startsWith('assets/photos/'); }));
  ok('Every photo file the app uses exists', await page.evaluate(async () => {
    const names = new Set(['fabric-closeup', ...Relore.state.listings, ...Relore.state.mine, ...Relore.state.queue, ...Relore.state.orders].map(x => typeof x === 'string' ? x : x.photo).filter(Boolean));
    const res = await Promise.all([...names].map(n => new Promise(r => { const i = new Image(); i.onload = () => r(true); i.onerror = () => r(false); i.src = 'assets/photos/' + n + '.jpg'; })));
    return res.every(Boolean) && names.size >= 15;
  }));
  eq('Carousel has 4 photos (front, back, label, defects)', await page.locator('#carousel .slide').evaluateAll(s => s.map(x => x.dataset.shot)), ['front', 'back', 'label', 'defects']);
  await tap('[data-act="shot"][data-v="3"]'); await settle(page, 700);
  ok('Photo buttons move the carousel', (await page.evaluate(() => { const c = document.querySelector('#carousel'); return Math.round(c.scrollLeft / c.clientWidth); })) === 3);
  const itemText = await text('#view');
  ok('Item details show size, measurements, brand, condition, area and seller rating', ['Size', 'Measurements', 'Brand', 'Condition', 'Area', 'seller rating'].every(k => itemText.includes(k)));
  await tap('[data-go="chat/linen-shirt"]');
  eq('Chat about this item opens Chat', await hash(), '#/chat/linen-shirt');
  const before = await page.locator('.msg').count();
  ok('Chat shows a sample conversation', before >= 4, before + ' messages');
  await page.fill('#msg', 'Could you confirm the sleeve length?'); await tap('.composer .send');
  eq('Sending a chat message adds it to the thread', await page.locator('.msg').count(), before + 1);
  await tap('.bar [data-go="item/linen-shirt"]');
  await tap('.actionbar [data-go="checkout/linen-shirt"]');
  eq('Buy now opens Checkout', await hash(), '#/checkout/linen-shirt');
  eq('Checkout shows the 12 km example fee', await text('#feeResult'), 'QAR 24.60');
  ok('Checkout shows the formula', (await text('#feeFormula')).replace(/\s+/g, ' ') === 'QAR 15 + 12 km × QAR 0.80', await text('#feeFormula'));
  await page.locator('input[name="addr"][value="wb"]').check({ force: true }); await settle(page, 200);
  eq('Changing the address recalculates the fee live (7 km)', await text('#feeResult'), 'QAR 20.60');
  eq('Pay-now total follows (45 + 20.60)', await text('#cta'), 'QAR 65.60');
  await page.locator('input[name="itemPay"][value="cod"]').check({ force: true }); await settle(page, 200);
  eq('Cash on delivery: only the delivery fee is paid now', await text('#cta'), 'QAR 20.60');
  eq('Cash on delivery amount shown', await text('#sumCod'), 'QAR 45.00');
  await page.locator('input[name="feePay"][value="fawran"]').check({ force: true }); await settle(page, 200);
  ok('Fawran can be chosen for the delivery fee', (await text('#sumNow')) === 'QAR 20.60' && (await text('#checkoutForm')).includes('Pay now by Fawran'));
  ok('Checkout says a driver is sent only once the delivery fee is paid', (await text('#checkoutForm')).includes('only once the delivery fee is paid'));
  await page.locator('input[name="feePay"][value="applepay"]').check({ force: true }); await settle(page, 200);
  await page.locator('input[name="addr"][value="ec"]').check({ force: true }); await settle(page, 200);
  const coText = await text('#view');
  ok('Checkout states the item-problem policy', coText.includes('no general returns') && coText.includes('decline it at handover') && coText.includes('including the delivery fee') && coText.includes('from their next payout') && !coText.includes('[Policy to be confirmed]') && coText.includes('legal rights'));
  await tap('[data-act="place-order"]');
  ok('Place order opens Order tracking', (await hash()).startsWith('#/track/RL-'), await hash());
  eq('Tracking has the 4 steps', await page.locator('.steps b').allInnerTexts(), ['Order placed', 'Collected from seller', 'Out for delivery', 'Delivered']);
  for (let i = 0; i < 3; i++) await tap('[data-act="advance"]');
  ok('Order can be advanced to Delivered', (await page.locator('.steps li.done').count()) === 4 && !(await page.locator('[data-act="advance"]').count()));
  await tap('[data-go^="issue/"]');
  ok('Report an issue opens the form', (await hash()).startsWith('#/issue/'));
  for (let i = 0; i < 3; i++) await tap('[data-act="issue-photo"]');
  ok('Up to 3 photos can be added to an issue report', (await page.locator('#evidence figure').count()) === 3 && !(await page.locator('[data-act="issue-photo"]').count()));
  await tap('#issueForm button[type="submit"]');
  ok('Sending the report returns to tracking with a confirmation', (await hash()).startsWith('#/track/') && (await text('#view')).includes('Issue reported'));
  await tap('.tabbar [data-go="orders"]');
  eq('Orders tab lists both orders', await page.locator('[data-go^="track/"]').count(), 2);
  await tap('.tabbar [data-go="home"]');
  eq('The bought item leaves the Home grid', await page.locator('#grid .card').count(), cards - 1);

  /* ---------- 3. Seller and admin flow ---------- */
  console.log('\n== 3. Seller and admin flow ==');
  await tap('.tabbar [data-go="sell"]');
  eq('Sell tab opens the seller dashboard', await hash(), '#/sell');
  const dash = (await text('#view')).replace(/\s+/g, ' ');
  ok('Dashboard shows statuses Awaiting review, Live and Sold', ['Awaiting review', 'Live', 'Sold'].every(s => dash.includes(s)));
  ok('Seller standing explains penalty points, the review and the Qatar ID ban', dash.includes('penalty points') && dash.includes('asks for your side') && dash.includes('Qatar ID'));
  ok('Dashboard shows the QAR 150 → 30 → 120 breakdown', dash.includes('Sold for QAR 150.00') && dash.includes('− QAR 30.00') && dash.includes('You receive QAR 120.00'));
  await tap('[data-act="new-listing"]');
  eq('List an item opens step 1', await hash(), '#/sell/photos');
  eq('Step 1 has 4 guide slots', await page.locator('.slot').count(), 4);
  ok('Error is hidden to begin with', !(await visible('#photoError')));
  await tap('[data-act="photos-next"]');
  ok('Next without photos shows an error and stays on step 1', (await visible('#photoError')) && (await hash()) === '#/sell/photos');
  await page.check('#noDefects'); await settle(page, 150);
  ok('"No visible defects" turns the 4th slot into a fabric close-up', (await text('[data-act="slot"][data-v="defects"]')).includes('Fabric close-up'));
  for (const k of ['front', 'back', 'label', 'defects']) await tap(`[data-act="slot"][data-v="${k}"]`);
  ok('All 4 photos can be added', (await page.locator('.slot.filled').count()) === 4 && !(await visible('#photoError')));
  await tap('[data-act="photos-next"]');
  eq('Next opens step 2', await hash(), '#/sell/details');
  await page.fill('#f-price', ''); await tap('[data-act="submit-listing"]');
  ok('Submitting without a price shows an error', (await page.locator('.field.invalid').count()) === 1 && (await hash()) === '#/sell/details');
  await page.fill('#f-title', 'Wool scarf jumper'); await page.fill('#f-price', '150'); await settle(page, 150);
  ok('Payout updates live: QAR 150 → QAR 30 → QAR 120', (await text('#payout')).replace(/\s+/g, ' ').includes('QAR 150.00') && (await text('#payout')).includes('QAR 30.00') && (await text('#payout')).includes('QAR 120.00'));
  await tap('[data-act="submit-listing"]');
  eq('Submit opens step 3', await hash(), '#/sell/done');
  ok('Step 3 shows the confirmation text', (await text('#view')).replace(/\s+/g, ' ').includes('Submitted — awaiting review by Relore'));
  await tap('.actionbar [data-go="sell"]');
  ok('New listing appears on the dashboard as Awaiting review', (await text('.panel:has(.listing) >> nth=0')).includes('Wool scarf jumper') && (await text('.panel:has(.listing) >> nth=0')).includes('Awaiting review'));
  await tap('.tabbar [data-go="profile"]');
  const prof = await text('#view');
  ok('Profile has WhatsApp Business support link and FAQs', (await page.locator('a[href^="https://wa.me/"]').count()) === 1 && prof.includes('What fees does Relore charge?') && prof.includes('How are listings reviewed?') && prof.includes('How does delivery work?'));
  for (const i of [1, 2, 3]) await tap(`.faq details:nth-child(${i + 1}) summary`);
  ok('FAQs open', (await page.locator('.faq details[open]').count()) === 4);
  await tap('[data-go="admin"]');
  eq('Profile links to the admin review queue', await hash(), '#/admin');
  const queued = await page.locator('.review').count();
  ok('Admin queue lists the submitted listing', queued === 4 && (await text('.review >> nth=0')).includes('Wool scarf jumper'));
  await tap('.review >> nth=0 >> [data-act="approve"]');
  eq('Approve removes it from the queue', await page.locator('.review').count(), queued - 1);
  await tap('.review >> nth=0 >> [data-act="reject"]');
  ok('Reject asks for a reason', await visible('[data-act="reject-confirm"]'));
  await tap('[data-act="reject-cancel"]');
  await tap('.review >> nth=0 >> [data-act="reject"]'); await tap('[data-act="reject-confirm"]');
  eq('Confirming a rejection removes it from the queue', await page.locator('.review').count(), queued - 2);
  await tap('.bar [data-go="profile"]'); await tap('.tabbar [data-go="home"]');
  ok('Approved listing is now live on Home', (await text('#grid')).includes('Wool scarf jumper'));
  await tap('.tabbar [data-go="sell"]');
  const dash2 = await text('#view');
  ok('Dashboard now shows it as Live, and the rejected one as Not approved', (await text('.panel:has(.listing) >> nth=0')).includes('Live') && dash2.includes('Not approved'));

  /* ---------- 4. Dead buttons ---------- */
  console.log('\n== 4. No dead buttons ==');
  const routes = ['splash', 'home', 'item/denim-jacket', 'chat/denim-jacket', 'checkout/denim-jacket', 'orders', 'track/RL-1038', 'issue/RL-1038', 'sell', 'sell/photos', 'sell/details', 'sell/done', 'profile', 'admin'];
  let controls = 0;
  for (const r of routes) {
    await open(page, r);
    const dead = await page.evaluate(() => {
      const known = k => { const key = k.startsWith('sell/') ? k : k.split('/')[0]; return typeof screens[key] === 'function'; };
      return [...document.querySelectorAll('#app button, #app a, #app [data-go], #app [data-act]')].filter(el => {
        if (el.dataset.go) return !known(el.dataset.go);
        if (el.dataset.act) return typeof actions[el.dataset.act] !== 'function';
        if (el.dataset.demo !== undefined) return false;
        if (el.tagName === 'A') return !el.getAttribute('href');
        if (el.tagName === 'BUTTON' && el.type === 'submit' && el.form) return false;
        return true;
      }).map(el => el.outerHTML.slice(0, 90));
    });
    controls += await page.locator('#app button, #app a').count();
    ok(`Screen "${r}": every control has an action`, dead.length === 0, dead.join(' | '));
  }
  console.log(`      ${controls} controls checked across ${routes.length} screens`);
  // Every tab and every demo-menu entry navigates
  await open(page, 'home', false);
  for (const t of ['sell', 'orders', 'profile', 'home']) { await tap(`.tabbar [data-go="${t}"]`); eq(`Tab "${t}" navigates`, await hash(), '#/' + t); }
  const demoCount = await page.locator('#demoSheet [data-demo]').count();
  const seen = [];
  for (let i = 0; i < demoCount; i++) { await tap('#demoHandle'); await tap(`#demoSheet [data-demo="${i}"]`); seen.push(await hash()); }
  ok('Demo screens menu reaches all 12 entries', new Set(seen).size === 12, seen.join(' '));

  /* ---------- 5. Layout at phone widths ---------- */
  console.log('\n== 5. Layout at 360, 390 and 430 px ==');
  for (const [w, h] of [[360, 740], [390, 844], [430, 932]]) {
    await page.setViewportSize({ width: w, height: h });
    const bad = [];
    for (const r of routes) {
      await open(page, r); await settle(page, 400);   // let the screen transition finish
      if (r === 'sell/photos') for (const k of ['front', 'label']) await tap(`[data-act="slot"][data-v="${k}"]`);
      const issues = await page.evaluate(() => {
        const out = [], W = innerWidth, H = innerHeight;
        if (document.documentElement.scrollWidth > W) out.push('page scrolls sideways');
        const scrollers = ['.chips', '.carousel', '.rail'];   // sideways scrollers, and the splash tags, which are tilted on purpose
        for (const el of document.querySelectorAll('#view *, #tabbar *')) {
          if (scrollers.some(s => el.closest(s))) continue;
          const b = el.getBoundingClientRect();
          if (!b.width || !b.height) continue;
          if (b.right > W + 0.5 || b.left < -0.5) out.push('off-screen: ' + (el.className || el.tagName) + ' ' + Math.round(b.left) + '..' + Math.round(b.right));
          if (el.matches('button, .btn, .pill, .sewn, h1, .chip') && el.scrollWidth > el.clientWidth + 1 && getComputedStyle(el).textOverflow !== 'ellipsis') out.push('text clipped: ' + el.textContent.trim().slice(0, 30));
        }
        const sp = document.querySelector('.splash');
        if (sp && sp.scrollHeight > sp.clientHeight + 1) out.push('splash content taller than the screen by ' + (sp.scrollHeight - sp.clientHeight) + 'px');
        const ab = document.querySelector('.actionbar');
        if (ab && ab.getBoundingClientRect().bottom > H + 0.5) out.push('action bar below the fold');
        // minimum logo sizes from the guidelines
        for (const img of document.querySelectorAll('#app img[src*="assets/relore-"]')) {   // logos only; product photos are cropped on purpose
          const min = /small/.test(img.src) ? 72 : /horizontal/.test(img.src) ? 120 : 24;
          if (img.getBoundingClientRect().width < min) out.push('logo below minimum size: ' + img.src.split('/').pop());
          const r = img.getBoundingClientRect(), nat = img.naturalWidth / img.naturalHeight;
          if (Math.abs(r.width / r.height - nat) > 0.02) out.push('logo stretched: ' + img.src.split('/').pop());
        }
        return [...new Set(out)].slice(0, 6);
      });
      if (issues.length) bad.push(r + ': ' + issues.join('; '));
    }
    ok(`${w} x ${h}: no overflow, clipped text or logo breaches on ${routes.length} screens`, bad.length === 0, bad.join(' || '));
  }

  /* ---------- 6. Console ---------- */
  console.log('\n== 6. Console ==');
  ok('No console errors, page errors or failed requests during all checks', problems.length === 0, problems.slice(0, 5).join(' | '));

  await browser.close();
  const failed = results.filter(r => !r.pass);
  console.log(`\n${results.length - failed.length} of ${results.length} checks passed.`);
  process.exit(failed.length ? 1 : 0);
})().catch(e => { console.error(e); process.exit(1); });
