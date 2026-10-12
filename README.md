# Lilula Beverages

A mobile-first shop and mobile bar booking site for Lilula Beverages (Unique Gin, Toffolux Vodka).
Nothing is charged online: orders and enquiries are saved on the visitor's device and handed to
Lilula as a WhatsApp message.

## What is in it

- **Spirits**: five Unique Gin flavours and Toffolux Vodka, R199 a bottle, with a bag and checkout.
- **Mobile bar**: R15,000 and R10,000 packages, shots and cocktail menus, an event enquiry form.
- **Our story**: the brand and the team.
- **WhatsApp**: a floating button on every page, plus WhatsApp and call buttons on the bar and story pages.
- **18+ age gate** before the shop opens.

## Run it

Needs Node 22 or newer.

```bash
npm install
npm run dev      # http://localhost:8080
```

| Command             | What it does                                  |
| ------------------- | --------------------------------------------- |
| `npm run build`     | Production build (Vercel output via Nitro)    |
| `npm run typecheck` | TypeScript check                              |
| `npm test`          | Unit tests                                    |
| `npm run lint`      | ESLint                                        |

## Change prices, number and packages

Everything a shop owner edits is in [`src/lib/catalog.ts`](src/lib/catalog.ts):

- `BOTTLE_PRICE`: price of one bottle, used on the shelf, the bag and the mobile bar page.
- `WHATSAPP_NUMBER`: digits only, with country code and no `+`. `PHONE_DISPLAY` is the number as shown.
- `products`, `barPackages`, `barShots`, `barCocktails`.

## Deploy

Import the repository into Vercel. No environment variables are needed. [`vercel.json`](vercel.json)
sets the install command and the Nitro `vercel` preset produces the build output.

Link previews (the image shown when the site is shared on WhatsApp) are only added on a custom
domain. On a plain `*.vercel.app` address the site works but shares without a preview image.

## Android app

[`android/`](android) is a small Android app that shows the live website. After deploying the site,
check that `HOME_URL` in `android/app/src/main/java/za/co/lilulabeverages/app/MainActivity.java`
is your site address. Then open the **Actions** tab on GitHub, run **Build Lilula Beverages Android
APK**, and download the `lilula-beverages-android-debug-apk` artifact. Details are in
[`android/README.md`](android/README.md).

## Good to know

- **Orders stay in the visitor's browser** (localStorage). Lilula only sees what arrives on WhatsApp.
  For a shared order list you would add a database; the Postgres and auth scaffolding in
  `src/lib` and `migrations/` is present but switched off.
- **`.grok/app-env.json`** sets `VITE_AUTH_ENABLED=false` (the shop has no accounts) and is read by
  `scripts/with-app-env.mjs`. Keep it tracked.
- **Grok platform files** (`public/__grok`, `server/`, `scripts/grok-pwa-*`) are imported by
  `vite.config.ts`. They provide the install-to-home-screen manifest. The "Created with Grok" badge
  script from `grok.com` is **off by default** (`scripts/grok-extensions.test.mjs` checks this);
  set `VITE_GROK_EXTENSIONS=1` at build time only if you want it back. Do not delete these files
  without also editing `vite.config.ts`.
- `npm test` skips three Grok tooling suites (`brand-check`, `grok-pwa-plugin`, `write-atomic`):
  they expect the Grok workspace docs, a template-default `src/lib/og/site.json`, or the badge on.
