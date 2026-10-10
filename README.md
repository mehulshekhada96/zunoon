# Zunoon Business Club

Next.js 16 App Router client-preview website, React 19, TypeScript and responsive CSS. This is a static marketing site with central content, venture dialogs, gallery filtering/lightbox, Surat group selection and a WhatsApp enquiry flow.

## Local development

Requires Node.js 20.9 or newer.

```sh
npm install
npm run dev
```

Open http://127.0.0.1:3000. `npm run build` creates the static export in `out/`. `npm run typecheck` verifies TypeScript.

## Content updates

- `lib/content.ts`: ventures, groups, leadership, contact details and member inventory.
- `app/page.tsx`: editorial copy, FAQs, activities and gallery.
- `app/globals.css`: visual design and responsive breakpoints.
- `public/images/`: official logo, supplied-deck portrait extracts and labeled illustrative stock assets from the old site.
- `research/zunoon-research.md`: source-backed dossier, known conflicts and client checklist.
- `research/internal/`: archived research page and source excerpts; not served on the website.

The site intentionally prepares a WhatsApp message instead of claiming to send a backend enquiry. Visitors review and send the message themselves in WhatsApp. No personal information is stored by this site. Membership fees, upcoming events, courses and testimonials are not invented.

Metadata is `noindex` for the client-preview stage. Before official public launch: replace illustrative photos with approved real event images, confirm content/figures/roles, supply privacy language and confirm the final visitor-facing copy.
