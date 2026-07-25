# modreq

Chrome extension to modify HTTP request headers and cookies — replace or append headers, override cookies. Free ModHeader alternative.

**Chrome Web Store:** https://chromewebstore.google.com/detail/modreq/calgkmpccmankefjidecombecabommmm

## Apps

| App | Role |
| --- | --- |
| `apps/extapp` | WXT MV3 extension |
| `apps/webapp` | Product landing (Next.js → GitHub Pages) |
| `apps/wuiapp` | Storybook (UI stories for store creatives) |
| `apps/imgapp` | Playwright stills → store screenshots / promo tiles |
| `apps/vidapp` | Remotion promo video |

## Develop

```sh
npm install
npm run dev --workspace=extapp
npm run dev --workspace=webapp
```

## Store assets

Stories live in `wuiapp`; capture runs in `imgapp` (needs Chromium + ImageMagick `magick`).

```sh
npm run screenshots
npm run promo-tiles
npm run shots
npm run render:video
```

## Build

```sh
npm run build
```

## Landing (GitHub Pages)

Static Next.js export (`output: 'export'`). Site URL after Pages is enabled:

https://sargonpiraev.github.io/modreq/

```sh
npm run build --workspace=webapp
# artifacts in apps/webapp/out
```

Deploy: GitHub Actions workflow `.github/workflows/deploy-webapp.yml` on push to `main`.  
In the repo: **Settings → Pages → Source = GitHub Actions**.
