# Wild Pixels_kmv

Wildlife &amp; nature photography site for Mugil (Studio KMV) — a plain HTML/CSS/JS static site, no build step required.

## Structure

```
index.html      Home — about Mugil, why Wild Pixels, upcoming tours teaser, gallery snippets
gallery.html    My Gallery — full filterable photo grid with lightbox
guests.html     Guests Gallery — placeholder for tour guests' photos
tours.html      Upcoming Tours — full detail pages for scheduled tours (itinerary, species, CTA)
gear.html       Gear Sale & Rehoming — pre-loved camera gear listings (currently empty state)
contact.html    Contact Us — WhatsApp, call, email, Instagram
css/style.css   All site styling
js/main.js      Nav, random hero backgrounds, scroll reveal, gallery filter, lightbox
js/footer.js    Shared footer injected on every page
assets/img/     Web-optimized photos (originals from Mugil's shoots live outside the repo)
assets/brand/   Logo + favicon files
Images/         Raw full-resolution originals — gitignored, local only, not deployed
```

## Running locally

No build tools needed — just open `index.html` in a browser, or serve the folder:

```bash
npx serve .
```

## To update

- **Upcoming Tours**: full details live in `tours.html` as `.tour-detail` blocks (copy an existing one for a new tour — badges, features, itinerary, species chips, WhatsApp CTA). `index.html`'s `#tours` section is just a 2-card teaser linking to `tours.html`; keep both in sync.
- **Gear Sale & Rehoming** (`gear.html`): currently an empty state. To list an item, replace the `.empty-state` block with `.tour-card`-style listing cards (image, condition, price note, WhatsApp enquiry link with the item name pre-filled in the message).
- **Guests Gallery** (`guests.html`): replace the empty state / placeholder tiles with `<figure>` guest photos once available (copy the pattern used in `gallery.html`).
- **Hero images**: `.hero` / `.page-hero` sections use `data-random-hero` — `js/main.js`'s `HERO_POOL` array picks a random image from a curated list on every load. Add/remove filenames there to change the pool.
- **Photos** (`assets/img/`): add new JPGs and reference them from `gallery.html` (and `index.html`'s snippet strip) — keep the long edge around 1600–1920px for web.
- **Contact details**: phone, email, WhatsApp and Instagram links live in `contact.html` and `js/footer.js`.

## Deploying to GitHub Pages

1. Push this folder's contents to the `main` branch of the repo.
2. In the repo's Settings → Pages, set the source to the `main` branch, root folder.
3. The site will be live at `https://<username>.github.io/<repo-name>/`.
