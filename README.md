# Wild Pixels_kmv

Wildlife &amp; nature photography site for Mugil (Studio KMV) — a plain HTML/CSS/JS static site, no build step required.

## Structure

```
index.html      Home — about Mugil, why Wild Pixels, upcoming tours teaser, gallery snippets
gallery.html    My Gallery — full filterable photo grid with lightbox
guests.html     Guests Gallery — placeholder for tour guests' photos
tours.html      Upcoming Tours — full detail pages for scheduled tours + Completed Tours archive
gear.html       Gear Sale & Rehoming — pre-loved camera gear listings, with a "sold" state
submit.html     Submit Your Photo — guest photo intake form (see "Guest submissions" below)
admin.html      Gear sold/available toggle — private, not linked in nav (see "Gear admin panel" below)
contact.html    Contact Us — WhatsApp, call, email, Instagram
css/style.css   All site styling
js/main.js      Nav, random hero backgrounds, scroll reveal, gallery filter, lightbox, slideshow
js/footer.js    Shared footer injected on every page
js/submit.js    Guest submission form logic (posts to a Google Apps Script Web App)
assets/img/     Web-optimized photos (originals from Mugil's shoots live outside the repo)
assets/brand/   Logo + favicon files
apps-script/    Backend scripts run on Google Apps Script (see the two sections below)
Images/         Raw full-resolution originals — gitignored, local only, not deployed
```

## Running locally

No build tools needed — just open `index.html` in a browser, or serve the folder:

```bash
npx serve .
```

## To update

- **Upcoming Tours**: full details live in `tours.html` as `.tour-detail` blocks (copy an existing one for a new tour — badges, features, itinerary, species chips, WhatsApp CTA). `index.html`'s `#tours` section is just a 2-card teaser linking to `tours.html`; keep both in sync.
- **Completed Tours** (`tours.html`, "The Archive" section): once a tour's dates pass, remove its `.tour-detail` block from Upcoming and add a compact entry to the `.archive-grid` instead — copy the template in the HTML comment right above it (image, name, location/dates, optional one-line description).
- **Trip snippets slideshow** (`tours.html`, `.snippet-slideshow` at the bottom of the Archive section): a slow ambient crossfade of candid trip/community photos (logic in `js/main.js`). Add or remove `<img>` tags inside `.snippet-slideshow` to change the rotation — order doesn't matter, it just cycles through whatever's there.
- **Gear Sale & Rehoming** (`gear.html`): listing cards live in `.gear-grid`, one `.gear-card` per item (image, condition badge, price, description, WhatsApp CTA). Each card has `data-item="slug"` and `data-sold="true|false"` — flipping that one attribute (by hand, or via the admin panel below) automatically grays out the photo, shows a "Sold" badge, dims the price and hides the Enquire button, all CSS-driven. To add a brand-new item, copy an existing `<article class="gear-card">` block and give it a unique `data-item` slug.
- **Guests Gallery** (`guests.html`): replace the empty state / placeholder tiles with `<figure>` guest photos once available (copy the pattern used in `gallery.html`).
- **Guest submissions** (`submit.html` + `js/submit.js`): guests fill out a form (name, tour, category, photo, caption, public-consent) which posts to a Google Apps Script Web App. The script saves the photo to a private Drive folder and logs the entry in a private Sheet — nothing publishes automatically. Review submissions in the Sheet, then manually add approved ones to `guests.html` (same as any other photo). See `apps-script/Code.gs` for the backend script and its deployment steps.
- **Hero images**: `.hero` / `.page-hero` sections use `data-random-hero` — `js/main.js`'s `HERO_POOL` array picks a random image from a curated list on every load. Add/remove filenames there to change the pool.
- **Photos** (`assets/img/`): add new JPGs and reference them from `gallery.html` (and `index.html`'s snippet strip) — keep the long edge around 1600–1920px for web.
- **Contact details**: phone, email, WhatsApp and Instagram links live in `contact.html` and `js/footer.js`.

## Gear admin panel (mark items sold, no code editing)

`admin.html` is a private, password-protected page (not linked anywhere in the site's nav) that lists every gear item with a "Mark Sold" / "Mark Available" button. Clicking it calls a Google Apps Script Web App (`apps-script/AdminGear.gs`), which edits `gear.html`'s `data-sold` attribute for that item directly via the GitHub API and pushes the commit — the live site updates in about 30 seconds, same as any other push.

**One-time setup:**

1. Go to [script.google.com](https://script.google.com) → **New project**.
2. Paste in the full contents of `apps-script/AdminGear.gs`.
3. **Project Settings** (gear icon) → **Script Properties** → add two properties:
   - `ADMIN_PASSWORD` — a password of your choosing
   - `GITHUB_TOKEN` — a GitHub **fine-grained personal access token**, scoped to *only* this repo, with **Contents: Read and write** permission and nothing else (create it at github.com → Settings → Developer settings → Personal access tokens → Fine-grained tokens)
   Both stay server-side in Apps Script — paste the token there and nowhere else (not in chat, not in any file in this repo).
4. **Deploy → New deployment → Web app**. Execute as **Me**, who has access **Anyone**. Deploy, authorize when prompted.
5. Copy the deployment URL (ends in `/exec`) into `admin.html`'s `ADMIN_ENDPOINT` constant, then commit and push.

Once set up: open `admin.html` directly (bookmark it — it's intentionally not linked from the site), enter the password, and toggle any item. The item list itself loads without a password (it only reflects what's already publicly visible on `gear.html`); the password is only required to actually change something.

If the token is ever compromised, revoke it from the same GitHub settings page and generate a new one — no code changes needed, just update the `GITHUB_TOKEN` script property.

## Deploying to GitHub Pages

1. Push this folder's contents to the `main` branch of the repo.
2. In the repo's Settings → Pages, set the source to the `main` branch, root folder.
3. The site will be live at `https://<username>.github.io/<repo-name>/`.
