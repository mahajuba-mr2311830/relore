// Saves a PNG of every prototype screen at phone size (390 x 844, device scale 3)
// plus one desktop view of the phone frame. Run: node screenshots.js
const path = require('path');
const fs = require('fs');
const { ROOT, launch, open, settle } = require('./common');

const OUT = path.join(ROOT, 'screenshots');
fs.mkdirSync(OUT, { recursive: true });

(async () => {
  const browser = await launch();
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 3, isMobile: true, hasTouch: true });
  const page = await ctx.newPage();
  const shot = async name => { await settle(page); await page.screenshot({ path: path.join(OUT, name + '.png') }); console.log('saved', name); };
  const tap = async sel => { await page.locator(sel).first().click(); await settle(page); };
  const scrollTo = y => page.evaluate(v => { const s = document.querySelector('#view .scroll'); s.scrollTop = v === 'end' ? s.scrollHeight : v; }, y);

  // Buyer flow
  await open(page, 'splash'); await settle(page, 2000); await shot('01-splash');
  await tap('[data-go="home"]'); await shot('02-home-browse');
  await tap('[data-go="item/linen-shirt"]'); await shot('03a-item-details');
  await scrollTo(430); await shot('03b-item-details-specs');
  await tap('[data-go="chat/linen-shirt"]'); await shot('04-chat');
  await tap('.chat-item [data-go="checkout/linen-shirt"]'); await shot('05a-checkout-delivery-fee');
  await scrollTo('end'); await shot('05b-checkout-summary');
  await open(page, 'checkout/blazer'); await settle(page); await scrollTo(470); await shot('05c-checkout-free-delivery');
  await open(page, 'checkout/linen-shirt'); await settle(page);
  await tap('[data-act="place-order"]'); await settle(page, 2800); await shot('06a-order-tracking-placed');
  await tap('[data-act="advance"]'); await tap('[data-act="advance"]'); await settle(page, 2800); await shot('06b-order-tracking-out-for-delivery');
  await scrollTo('end'); await tap('[data-go^="issue/"]');
  await tap('[data-act="issue-photo"]'); await tap('[data-act="issue-photo"]'); await scrollTo(0); await shot('06c-report-an-issue');

  // Seller flow
  await open(page, 'sell'); await tap('[data-act="new-listing"]'); await shot('07a-sell-step1-photo-guides');
  for (const k of ['front', 'back', 'label', 'defects']) await tap(`[data-act="slot"][data-v="${k}"]`);
  await shot('07b-sell-step1-photos-added');
  await tap('[data-act="photos-next"]'); await shot('07c-sell-step2-details');
  await scrollTo('end'); await shot('07d-sell-step2-price-and-payout');
  await tap('[data-act="submit-listing"]'); await shot('07e-sell-step3-submitted');
  await tap('[data-go="sell"]'); await shot('08a-seller-dashboard');
  await scrollTo(330); await shot('08b-seller-dashboard-earnings-breakdown');

  // Help and admin
  await tap('.tabbar [data-go="profile"]'); await shot('09a-profile-help');
  await scrollTo(360); await shot('09b-profile-help-faqs');
  await scrollTo('end'); await shot('09c-profile-help-relore-team-and-app-icon');
  await tap('[data-go="admin"]'); await shot('10-admin-review-queue');
  await ctx.close();

  // Desktop view of the phone frame
  const desk = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 });
  const dp = await desk.newPage();
  await open(dp, 'home', false); await settle(dp, 600);
  await dp.screenshot({ path: path.join(OUT, '11-desktop-phone-frame.png') }); console.log('saved 11-desktop-phone-frame');
  await browser.close();
})().catch(e => { console.error(e); process.exit(1); });
