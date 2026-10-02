# Angkas Fare Calculator (PWA)

Manila fare estimator with live route distance and GPS ride tracking. Installable and works offline for manual fare calculation.

## Host on GitHub Pages
1. Create a new GitHub repo and upload every file in this folder to the repo root (`index.html`, `sw.js`, `manifest.webmanifest`, the three icons).
2. Go to **Settings → Pages**, set **Source** to *Deploy from a branch*, choose `main` and `/ (root)`, then save.
3. Open `https://<your-username>.github.io/<repo-name>/` after a minute or two.
4. On your phone, open the link and choose **Add to Home Screen** (Chrome/Android) or **Share → Add to Home Screen** (Safari/iOS).

All paths are relative, so it works under a repo subpath. GitHub Pages serves HTTPS, which GPS and service workers require.

## Updating
Change `CACHE = "angkas-fare-v3"` in `sw.js` to `v2`, `v3`, and so on when you ship changes, so installed copies refresh.

## Notes
- Place suggestions use Photon (komoot, OpenStreetMap data), exact-match search uses Nominatim, and routing uses the public OSRM demo server. Both are free but rate-limited, so they suit personal use. For heavy traffic, use your own provider.
- Ride tracking needs location permission and a screen that stays on; browsers pause GPS in the background.
- Offline: fare math, saved trips and the UI work. Route lookup needs a connection.
- Not an official Angkas app. Rates are estimates.

## Troubleshooting: "Could not open app" after installing
- Open the **https://username.github.io/repo-name/** link in Chrome (Android) or Safari (iOS). Installing from a downloaded file, a zip, `file://` or a claude.ai preview will not work.
- Remove the old installed icon, then in Chrome go to **Site settings → Delete data** for the site (this clears the old service worker), reload, and install again.
- Make sure all 6 files are in the repo root, with exact lowercase names, and the Pages build shows green.
- Open `.../manifest.webmanifest` and `.../icon-512.png` in the browser; both should load, not show 404.
