# modreq

Chrome extension to modify HTTP request headers and cookies — replace or append headers, override cookies. Free ModHeader alternative.

**Chrome Web Store:** https://chromewebstore.google.com/detail/modreq/calgkmpccmankefjidecombecabommmm

## Apps

| App | Role |
| --- | --- |
| `apps/extapp` | WXT MV3 extension |
| `apps/webapp` | Product landing (Next.js → Vercel) |
| `apps/wuiapp` | Storybook + store screenshot/promo generation |
| `apps/vidapp` | Remotion promo video |

## Develop

```sh
npm install
npm run dev --workspace=extapp
npm run dev --workspace=webapp
```

## Store assets

```sh
npm run screenshots
npm run promo-tiles
npm run render:video
```

## Build

```sh
npm run build
```
