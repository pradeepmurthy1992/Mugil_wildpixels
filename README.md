# Wild Pixels_kmv

Wildlife &amp; nature photography site for Mugil (Studio KMV) — a plain HTML/CSS/JS static site, no build step required.

## Structure

```
index.html      Home — about Mugil, why Wild Pixels, upcoming tours, gallery snippets
gallery.html    My Gallery — full filterable photo grid with lightbox
guests.html     Guests Gallery — placeholder for tour guests' photos
contact.html    Contact Us — WhatsApp, call, email, Instagram
css/style.css   All site styling
js/main.js      Nav, scroll reveal, gallery filter, lightbox
js/footer.js    Shared footer injected on every page
assets/img/     Photos (sourced from the Studio KMV portfolio PDF)
```

## Running locally

No build tools needed — just open `index.html` in a browser, or serve the folder:

```bash
npx serve .
```

## To update

- **Upcoming Tours** (`index.html`, `#tours` section): each `.tour-card` is a placeholder — swap in real destinations, dates and pricing as tours are scheduled.
- **Guests Gallery** (`guests.html`): replace the empty state / placeholder tiles with `<figure>` guest photos once available (copy the pattern used in `gallery.html`).
- **Photos** (`assets/img/`): add new JPGs and reference them from `gallery.html` (and `index.html`'s snippet strip) — keep the long edge around 1600–1920px for web.
- **Contact details**: phone, email, WhatsApp and Instagram links live in `contact.html` and `js/footer.js`.

## Deploying to GitHub Pages

1. Push this folder's contents to the `main` branch of the repo.
2. In the repo's Settings → Pages, set the source to the `main` branch, root folder.
3. The site will be live at `https://<username>.github.io/<repo-name>/`.
