# Relore, Part 4: product and pitch

Work for Part 4 of the CMPS307 group project (due Wednesday 18 November 2026, presentation Sunday 22 November 2026).

**Read these two sections first:** [Conflicts found in the group files](#5-conflicts-found-in-the-group-files) and [Decisions still needed](#6-decisions-still-needed).

**Updated 17 November** after the group's decisions: see [Changes made after group decisions](#7-changes-made-after-group-decisions-17-november).

---

## 1. What is in this folder

| File or folder | What it is | Where it goes |
|---|---|---|
| `prototype/index.html` | The clickable app prototype. One HTML file with all ten screens, the styling and the code. | **Presentation** (live demo) and **submission zip**. Screen-record it for the pitch video. |
| `prototype/assets/` | Copies of the logo and favicon files the prototype uses. Must stay next to `index.html`. | **Submission zip**, with the prototype. |
| `screenshots/` | 22 PNGs: every screen at phone size (390 × 844, scale 3), numbered in flow order, plus one desktop view. | **Canva decks** (see `slides/part4-slides.md` for which image goes on which slide) and **submission zip**. |
| `mindmap/mindmap.png` | The mind-map "Testing Relore's MVPs", 3840 × 2160. | **Canva detailed deck**, slide 3. |
| `mindmap/mindmap.pdf` | The same mind-map as a sharp, single-page PDF. | **Submission zip**. Also uploads to Canva. |
| `mindmap/mindmap.svg` | Editable source of the mind-map. Opens in a browser, Inkscape, Illustrator or Figma. | Keep for edits. Include in the zip if sources are wanted. |
| `mindmap/mindmap.mmd` | The same content as a Mermaid outline (paste into mermaid.live). | Keep for quick text edits. |
| `pitch/video-script.md` | Two-minute investor pitch: timed table for Speakers 1 to 5 (281 words), sources, shot list and filming tips. | **Group**, for filming. **Submission zip** if the script is requested. |
| `pitch/teleprompter.html` | Scrolling teleprompter for the script, in the brand style. | **Filming and rehearsal.** |
| `slides/part4-slides.md` | Copy-ready slide text: 4 slides for the detailed deck, 2 for the pitch deck, with screenshots and speaker notes. | **Canva decks.** |
| `tools/` | Scripts that re-create the screenshots, re-run the checks and rebuild the mind-map. | Optional. Leave it out of the zip unless the group wants the sources. |
| `README.md` | This file. | Keep with the folder. |

Suggested layout inside `cmps307F25G00.zip` (replace `G00` with our group number):
`part4/prototype/` (with `assets/`), `part4/screenshots/`, `part4/mindmap/` and `part4/pitch/video-script.md`.

---

## 2. How to open the prototype

1. Double-click `prototype/index.html`. It opens in any modern browser. No installation.
2. On a laptop it appears inside a phone frame, with the list of **Demo screens** on the left for jumping to any screen.
3. On a phone, or in a narrow window, it fills the screen. A small tab on the right edge opens the Demo screens menu. Pressing **M** on a keyboard does the same.
4. Add `?clean=1` to the address (`index.html?clean=1`) to hide that tab for screenshots or screen recordings.
5. Reload the page to reset the sample data.

It works offline. Only the Jost font needs the internet (it comes from Google Fonts). Without a connection the text falls back to Arial, as the logo guidelines allow.

**Things worth showing in the demo**
- Checkout: change the delivery address and the fee recalculates (12 km → QAR 24.60, 7 km → QAR 20.60). Switch the item to cash on delivery and the amount to pay now drops to the delivery fee alone.
- Sell → List an item → submit. The listing appears on the seller dashboard as **Awaiting review** and in the admin queue. Approve it in the admin view and it goes **Live** on Home.
- Order tracking: "Demo: move to the next step" walks through the four stages.

### The ten screens

| # | Screen | Screenshot |
|---|---|---|
| 1 | Splash / welcome | `01-splash.png` |
| 2 | Home / browse (search, category chips, size filter, 12 reviewed listings) | `02-home-browse.png` |
| 3 | Item details (4-photo carousel, specifications, seller rating) | `03a`, `03b` |
| 4 | Chat | `04-chat.png` |
| 5 | Checkout (live delivery fee, payment choices, item-problem policy) | `05a`, `05b` |
| 6 | Order tracking, and Report an issue | `06a`, `06b`, `06c` |
| 7 | Sell, steps 1 to 3 | `07a` to `07e` |
| 8 | Seller dashboard (statuses and earnings breakdown) | `08a`, `08b` |
| 9 | Profile / help (WhatsApp Business link, FAQs, app icon) | `09a`, `09b`, `09c` |
| 10 | Admin: Relore team review queue (Approve / Reject) | `10-admin-review-queue.png` |
| | Desktop view of the phone frame | `11-desktop-phone-frame.png` |

---

## 3. Logo kit: which files are used where

I read `Relore-Logo-Guidelines.pdf` (version 1.0) first. Every logo on screen is one of the supplied files. Nothing is retyped, redrawn, recoloured, stretched or given effects.

| Kit file | Copied to | Used for |
|---|---|---|
| `master/relore-horizontal-color.svg` | `prototype/assets/` | Splash screen (236 px wide), Home header (132 px), desktop side panel (196 px). Always on Supermoon. |
| `horizontal/relore-horizontal-white.svg` | `prototype/assets/` | Teleprompter header (136 px wide), on After Hours. |
| `master/relore-symbol-color.svg` | `prototype/assets/` | Centre of the mind-map (96 px), on white. |
| `symbol/relore-symbol-app-icon.svg` | `prototype/assets/` | App icon at the bottom of the Profile screen (48 px). |
| `web-icons/favicon.ico`, `favicon.svg`, `apple-touch-icon.png` | `prototype/assets/` | Browser tab icon and home-screen icon, following `head-snippet.html`. |
| `web-icons/favicon-16/32/48.png`, `icon-192.png`, `icon-512.png`, `maskable-512.png` | `prototype/assets/` | Copied so the full icon set travels with the prototype. Not linked (see note below). |

How the rules are met:
- **Minimum sizes.** The rimmed wordmark is never below 120 px wide (smallest use: 132 px). The symbol is never below 24 px (smallest use: 48 px). The automated check fails if a logo drops below its minimum or is stretched.
- **Clear space.** Nothing sits within one button-diameter of the logo. On the mind-map the title starts 120 px from the centre, outside the symbol's clear zone.
- **Logo backgrounds.** Full colour on Supermoon or white, white on After Hours. These are the palette v2 equivalents of the guidelines' approved pairs (full colour on Linen Sand or white, white on Ink). No logo sits on a tint, a photo or a busy background.
- **Colours (palette v2, 17 November).** Relore Maroon `#8A1538` is kept from the guidelines for the logo's button and every action. The rest of the palette replaces Thread Ink and Linen Sand:

  | Colour | Hex | Used for |
  |---|---|---|
  | Relore Maroon (kept) | `#8A1538` | Logo button, buttons, prices, links, active tab |
  | After Hours | `#38373D` | Text, phone frame, teleprompter background |
  | Modern Love | `#ECCEC4` | Selected options, policy notes, tile backgrounds |
  | 36 Hours in Marrakesh | `#C9877B` | Garment illustrations only. Never text or buttons (2.9:1 with white) |
  | The Patio | `#3D2922` | Dark panels: Relore team header, "measure and decide" branches on the mind-map |
  | Ryokan Guesthouse | `#DDCAB9` | Tile backgrounds and lines |
  | Supermoon | `#EEEFEA` | Page and app background |
  | White | `#FFFFFF` | Cards and panels |

  Body text is 10.2:1 on Supermoon and secondary text (`#57565E`) is 6.3:1, both well above the 4.5:1 minimum. The only other colours are three muted status colours (green for approved or live, amber for awaiting review, rust for errors). To go back to the old palette, the previous values are noted in a comment at the top of `prototype/index.html`.

  The logo files themselves are unchanged. The wordmark letters stay Thread Ink `#221E20`, which is very close to After Hours. **The group's logo guidelines (v1.0) still list the old palette, so they need updating if the group adopts this one.**
- **Font.** Jost throughout, falling back to Arial.
- **Images.** No people in any image. Each listing's front view is a real photo of clothing on a hanger or laid flat. All 17 photos are free to use under the Unsplash License and stored in `prototype/assets/photos/`; each original is listed in [`CREDITS.md`](prototype/assets/photos/CREDITS.md). The defects view uses a real fabric close-up, marked with a dashed circle when the seller reports a defect. The back view and the label stay as drawings, so the label always shows the listing's own brand and size. The abaya and thobe are drawn throughout, because no free photo of either garment without a person wearing it could be found. A group member's own photo, laid flat or on a hanger, would fill that gap.

Two notes:
- `head-snippet.html` uses paths that start with `/`, which only work on a web server. I changed them to `assets/…` so the icons load when the file is opened with a double click. I left out the `site.webmanifest` line for the same reason. Add it back if the prototype is ever hosted.
- The "small" logo versions are not used, because no logo appears at a small size.

### How to swap the logo if the group changes it

All logo uses point at the copies in `prototype/assets/`, including the mind-map and the teleprompter.

1. Replace the files in `prototype/assets/` with the new ones, **keeping the same file names**.
2. Reload the prototype and the teleprompter. They pick up the new files straight away.
3. Rebuild the mind-map image (`node build-mindmap.js` in `tools/`), because the PNG and PDF have the logo baked in.
4. Re-run the screenshots (`node screenshots.js`).

If the new files have different names, change them in one place: the `LOGO` block near the top of the script in `prototype/index.html`, plus the favicon lines in its `<head>`.

Colours also live in one place: the `:root` block at the top of `prototype/index.html`.

---

## 4. Checks carried out

### Automated (`tools/check-prototype.js`): 98 of 98 passed

- **Buyer flow** clicked through: splash → Home → search, category and size filters → item details → photo carousel → chat (message sent) → checkout (address and payment changed, including Fawran) → order placed → tracking advanced to Delivered → issue reported with 3 photos → Orders.
- **Seller and admin flow** clicked through: dashboard → step 1 (error shown when photos are missing, "no visible defects" option) → step 2 (error shown when the price is missing) → step 3 → dashboard → Profile → FAQs → admin queue → Approve, and Reject with a reason → listing live on Home.
- **No dead buttons:** 313 controls on 14 screens each have a working action. All four tabs and all 12 Demo-menu entries navigate.
- **Layout** at 360 × 740, 390 × 844 and 430 × 932: no sideways scrolling, nothing off-screen, no clipped button text, action bars always visible, logos above minimum size and not stretched.
- **Console:** no errors, page errors or failed requests during the whole run.

I also looked through every screenshot and fixed what I found: a wrapping "Chat about this item" button, a misaligned row of listing cards, an error message that showed too early, crowded photo labels, a cramped delivery-fee box and uneven spacing on the splash screen.

### Maths: worked examples

All amounts come from four shared functions at the top of the script in `prototype/index.html`: `deliveryFee(km)`, `commission(price)`, `sellerPayout(price)` and `orderTotals(price, km, itemPay)`. They read one `FEES` block (base QAR 15, QAR 0.80 per km, 20%).

**Delivery fee = QAR 15 + QAR 0.80 × road km**

| Distance | Working | Fee |
|---|---|---|
| 5 km | 15 + 5 × 0.80 = 15 + 4.00 | QAR 19.00 |
| 7 km (Al Sadd → West Bay in the demo) | 15 + 7 × 0.80 = 15 + 5.60 | QAR 20.60 |
| 10 km | 15 + 10 × 0.80 = 15 + 8.00 | QAR 23.00 (matches the BMC PDF) |
| 12 km (Al Sadd → Education City in the demo) | 15 + 12 × 0.80 = 15 + 9.60 | QAR 24.60 (the brief's example) |
| 20 km | 15 + 20 × 0.80 = 15 + 16.00 | QAR 31.00 (matches the feasibility document) |

**Seller payout = sale price − 20% commission**

| Sale price | Commission (20%) | Seller receives (80%) |
|---|---|---|
| QAR 25 | QAR 5 | QAR 20 |
| QAR 45 | QAR 9 | QAR 36 |
| QAR 150 | QAR 30 | QAR 120 (the brief's example, shown on the dashboard) |
| QAR 380 | QAR 76 | QAR 304 |

**Whole order: linen shirt at QAR 45, delivered 12 km**

| Item paid by | Pay now | Pay on delivery | Total |
|---|---|---|---|
| Card | 45.00 + 24.60 = QAR 69.60 | QAR 0 | QAR 69.60 |
| Cash on delivery | QAR 24.60 (delivery fee only) | QAR 45.00 | QAR 69.60 |

### Wording
British English throughout, prices as "QAR", one set of terms (pre-owned, listing, reviewed, collect / collection, delivery fee, commission, decline at handover). Place names are real Doha-area names: Al Sadd, Lusail, Al Rayyan, Al Wakrah, The Pearl, West Bay, Education City, Al Gharrafa.

### To re-run the scripts
In `tools/`: `npm install` once, then `node screenshots.js`, `node check-prototype.js` or `node build-mindmap.js`. They use the Edge or Chrome already on the computer.

---

## 5. Conflicts found in the group files

I followed the facts in my brief wherever a file disagreed. These need raising with the group.

| # | File | What it says | What I used | Action |
|---|---|---|---|---|
| 1 | `Relore_Final.pptx`, slides 5 and 6 | "Relore keeps a **10%** commission" and "10% COMMISSION". | 20%. | **Check the Canva deck.** The group has confirmed 20%, and the 10% is a leftover from an earlier draft. |
| 2 | An earlier group estimate vs `Relore_BMC_Growth_Delivery_Rate_Final.pdf`, page 12 | Earlier estimate: break-even at about **102 orders a month**, assuming delivery fees fully cover transport costs. The final BMC PDF: break-even with one driver at **9 orders a day** (26 working days). The PDF's own inputs give 7,000 ÷ 32.11 ≈ **218 orders a month**, and its growth table agrees. | The PDF's figure, as instructed: "about nine orders a day" with one driver, in the pitch script. | **Agree one number.** I could not reproduce 102 from the PDF's inputs. |
| 3 | `Relore_Final.pptx` and the BMC PDF vs the logo guidelines | The deck uses dark red `#7A0000`, cream `#FFFCE2` and the fonts TT Chocolates and Lovelace. The BMC PDF is green, with "R E L O R E" typed as text. | Guideline colours, Jost and the supplied logo files. | Bring both documents in line with the guidelines (never retype the wordmark). |
| 4 | Deck slides 8, 12, 13, 15 and BMC page 6 | Future growth: **rentals, direct resale and donations**. | My brief says the only future features are AI-assisted listing checks and clothing borrowing. I mention no future features. | Agree one list. |
| 5 | BMC PDF, every page footer | "Qatar **peer-to-peer thrift** marketplace". | "Managed marketplace for pre-owned clothing in Qatar". | Agree one description. |
| 6 | BMC PDF, pages 3, 4, 10 | Same-seller bundles, buyers leaving reviews, saved pickup addresses, and a pilot limited to Greater Doha (about 20 km). | None of these is in my brief, so the prototype has no bundles or review-writing. It shows a seller rating, as my brief asked. Some sample routes are longer than 20 km (for example Al Wakrah → Education City, 28 km). | Decide whether the pilot radius should limit which areas appear. |
| 7 | BMC PDF, page 3 | "Listing review does not mean physical inspection." | The prototype says listings are "reviewed by Relore" and that the team reviews the photos and details by hand. It never says items are inspected. | Keep this wording in all parts. |
| 8 | `Relore_Market_Feasibility_Data.docx`, sections 4 and 6 | The survey (n = 29) suggests the fees are **above** what most respondents accept: the QAR 15 base fee exceeds the limit of 27 of 29, and at most 4 of 29 would accept 20% commission. | The pitch uses the survey only for what it supports (unclear condition 76%, trust in reviews and photos, Instagram and TikTok use). It does not claim the survey validates the fees. | Investors may ask. The feasibility document suggests answers: free delivery above an order value, bundles, or a lower commission. |
| 9 | Feasibility document, section 6 | 48% of respondents want a return policy. Group decision: no returns at launch, buyers "can resell items on Relore". | No general returns, decline at handover, refund. I did not add the "resell" line because it is not in my brief. | Confirm whether to mention reselling. |
| 10 | BMC PDF page 15 vs the feasibility document | Internet use is given as 99% (BMC) and 98.1% (feasibility). | Neither figure is used in my part. | Use one figure in the deck. |
| 11 | Target customers | Deck: students, young professionals, budget-conscious. Feasibility: Gen Z and Millennials. Brief: also expatriate families and sustainability-minded shoppers. | The pitch says "Gen Z and Millennial residents" for the market size only. | Use one list on the segment slide. |
| 12 | Logo | The group has not formally confirmed a logo. An "R" concept was also liked, and one view was that the button version's font looks too minimal. | The button logo from the kit. | **Get a clear yes**, or swap the logo (see section 3). |

I did not open the photographs inside `Relore_Final.pptx` (34 image files). My brief says no photos of people, so someone should check the deck's images against that rule.

---

## 6. Decisions still needed

### The item-problem policy (settled 17 November)

The "[Policy to be confirmed]" placeholder is gone. The agreed rule:

- The delivery fee is paid upfront, even for cash on delivery.
- If the item matches its listing, the purchase is final. There are no change-of-mind returns.
- If it does not match, the buyer declines it at handover and gets a **full refund, including the delivery fee**.
- That delivery fee is **taken from the seller's next payout**. If the seller has no payouts left, Relore covers it.
- The seller also gets penalty points and a lower rating, and repeated or deliberate misrepresentation means a ban linked to their Qatar ID.

The wording lives in one place, the `POLICY` block near the top of the script in `prototype/index.html`, and every screen reads from it: item details, checkout, order tracking, Report an issue, Sell step 2, the seller dashboard, the FAQ and the desktop side panel.

**Still open, but minor:**
- Whether a declined item goes **back to the seller or is relisted** (raised in the feasibility document). The prototype assumes it goes back to the seller.
- The cost of the driver's trip back to the seller isn't charged separately. Only the buyer's delivery fee is recovered from the seller.

### Placeholders I wrote that the group should confirm or replace

| Item | What I used | Where to change it |
|---|---|---|
| Tagline | "Pre-owned clothing, reviewed and delivered." No tagline appears in any group file, so this is my wording. | `BRAND.tagline` in `prototype/index.html`. Also the last line of the pitch script and teleprompter. |
| WhatsApp Business number | +974 0000 0000 (placeholder). The real number isn't needed yet, so the placeholder can stay for the presentation. | `BRAND.whatsappDisplay` and `BRAND.whatsappLink` in `prototype/index.html`. |
| Investment ask | No amount yet. The script says "fund our first driver, vehicle and launch". The group agreed the ask = year-one operating losses from the BMC PDF (about QAR 39,000: 3 × 6,037 + 3 × 4,592 + 6 × 1,220) plus one-off setup costs (licence, building the app, launch marketing). The final figure comes from the funding section. | `pitch/video-script.md` and `pitch/teleprompter.html`. |
| Speaker names | Speaker 1 to Speaker 5. | Same two files. |
| Pivot-or-persevere thresholds | 30+ orders a month by month 3 (the BMC's planning target), 30%+ of listings sold in 30 days, 25%+ of buyers ordering again, pivot if delivery costs exceed the fee. All labelled as assumptions. | `tools/build-mindmap.js` (content at the top), then rebuild. Also slide 4 notes. |
| Condition scale | Like new, Very good, Good, Fair. The brief asks for "a condition rating" but gives no scale. | `CONDITIONS` in `prototype/index.html`. |
| Penalty points | The dashboard shows "0 penalty points". How many points lead to a ban is not stated, because it is not decided. | Seller dashboard section of `prototype/index.html`. |
| Road distances | Sample figures per pair of areas (for example Al Sadd → Education City 12 km). A real app would use a maps service. | `ROAD_KM` in `prototype/index.html`. |
| Brand names on sample listings | Real high-street brands (Zara, H&M, Levi's and others) to look realistic. | `LISTINGS` in `prototype/index.html`, if the group prefers made-up names. |

### Questions to ask the group

1. Which break-even figure do we present: 9 orders a day (BMC PDF) or 102 a month (the earlier estimate)?
2. What is the final investment figure (year-one losses plus setup costs)?
3. Who is Speaker 1 to 5 in the video?
4. How do we answer the survey finding that most respondents would not accept QAR 15 delivery or 20% commission?
5. The brief says "TikTok Reels". Reels is Instagram's name; TikTok calls them videos. The mind-map follows the brief. Change it if the group prefers.

---

## 7. Changes made after group decisions (17 November)

These follow what the group agreed between 13 and 17 November.

| Change | Where | Source |
|---|---|---|
| Seller penalty wording: penalty points and a lower seller rating, Relore reviews each case and asks for the seller's side first, and repeated or deliberate misrepresentation leads to a permanent ban linked to the seller's Qatar ID. | Sell step 2, seller dashboard, FAQ | Group decision, plus the group's policy notes (review first, seller can respond). |
| Fawran added as a way to pay the delivery fee, next to card and Apple Pay. | Checkout, FAQ | Group suggestion. |
| Checkout now says Relore sends a driver only once the delivery fee is paid, even for cash on delivery. | Checkout, FAQ | Group decision (pay upfront, like ride-hailing apps). |
| "This does not affect your legal rights as a consumer in Qatar." added under the item-problem policy. | Everywhere the policy appears | The group's policy notes, which mention Qatar's Consumer Protection Law No. 8 of 2008. I have not checked the law itself, so the wording stays general. |
| Report an issue now takes up to 3 photos as evidence. | Report an issue | The group's policy notes (keep photo evidence). |
| "This item has no visible defects" option: the 4th photo slot becomes a close-up of the fabric. | Sell step 1 | My own decision, to answer the open question about the 4th slot. |
| WhatsApp number question dropped. | README | Not needed yet. |
| "[Policy to be confirmed]" replaced: a declined item's buyer gets a full refund including the delivery fee, which is taken from the seller's next payout (Relore covers it if there is none). | Every screen with the policy, and the side panel | Group decision, 17 Nov. |
| Logo confirmed as the button version. | README | Group decision, 17 Nov. |

Unchanged on purpose: the tagline, the speaker names and the mind-map thresholds, until the group answers.
