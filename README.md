# New Style Funnel

New Style Funnel is a pnpm monorepo for a React/Vite digital-product sales funnel. The main application, `@workspace/skill-funnel`, walks visitors through a personalized high-income-skills offer flow: hero page, goal selection, challenge selection, personalized messaging, value education, offer, checkout, upsell, and thank-you screens.

The repository also includes a small Express API scaffold, OpenAPI-based generated client/validation packages, a Drizzle database package scaffold, and a mockup preview sandbox used to render individual React components.

## Project Structure

```text
.
├── artifacts/
│   ├── skill-funnel/      # Main customer-facing React funnel app
│   ├── api-server/        # Express API server with /api/healthz
│   └── mockup-sandbox/    # Component preview server for mockups
├── lib/
│   ├── api-spec/          # OpenAPI source and Orval codegen config
│   ├── api-client-react/  # Generated React Query API client
│   ├── api-zod/           # Generated Zod API schemas
│   └── db/                # Drizzle/Postgres package scaffold
├── scripts/               # Workspace scripts
├── pnpm-workspace.yaml    # Workspace packages and dependency catalog
└── package.json           # Root build/typecheck scripts
```

## Main App Flow

The funnel routes are defined in `artifacts/skill-funnel/src/App.tsx` using `wouter`.

| Route | Purpose |
| --- | --- |
| `/` | Hero and primary call to action |
| `/goal` | Captures the visitor's desired outcome |
| `/challenge` | Captures the visitor's main obstacle |
| `/personalized` | Shows tailored copy based on goal/challenge |
| `/pain` | Frames the problem |
| `/future` | Shows the desired future state |
| `/lesson` | Educates before the offer |
| `/authority` | Adds proof and credibility |
| `/system` | Reveals the product system |
| `/value` | Builds perceived value |
| `/faq` | Handles common objections |
| `/offer` | Presents the main $47 offer |
| `/checkout` | Simulated checkout screen |
| `/upsell` | Presents the $27 accelerator upsell |
| `/thankyou` | Final confirmation page |

Funnel state is held in React context at `artifacts/skill-funnel/src/context/FunnelContext.tsx`. It tracks the selected goal, selected challenge, and whether the upsell was accepted. The copy personalization rules live in `artifacts/skill-funnel/src/utils/personalization.ts`.

## Products

Product data is currently static in `artifacts/skill-funnel/src/data/products.ts`.

- Main product: `Complete High-Income Skills System`
- Main price: `$47`
- Displayed value: `$1573`
- Upsell: `Complete Business Accelerator`
- Upsell price: `$27`

The checkout and purchase actions are simulated in the frontend. There is no real payment processor wired in yet.

## Stack

- Package manager: pnpm workspaces
- Language: TypeScript
- Frontend: React 19, Vite, Tailwind CSS 4
- Routing: wouter
- Animation/icons: Framer Motion, lucide-react, react-icons
- UI primitives: Radix UI-based components
- Server: Express 5
- API contracts: OpenAPI, Orval, Zod
- Data layer scaffold: Drizzle ORM and PostgreSQL
- Build/typecheck: Vite, esbuild, TypeScript project references

## Requirements

- Node.js 24 is expected by `.replit`. The project can currently invoke Node locally through Corepack, but matching Node 24 is the safest target.
- pnpm

This workspace intentionally blocks npm/yarn installs via the root `preinstall` script.

## Install

```bash
pnpm install
```

## Run Locally

The Vite config for `@workspace/skill-funnel` requires both `PORT` and `BASE_PATH`.

```bash
PORT=5173 BASE_PATH=/ pnpm --filter @workspace/skill-funnel run dev
```

Then open:

```text
http://localhost:5173/
```

To run the API server instead:

```bash
PORT=5000 pnpm --filter @workspace/api-server run dev
```

Health check:

```text
http://localhost:5000/api/healthz
```

To run the mockup sandbox:

```bash
pnpm --filter @workspace/mockup-sandbox run dev
```

## Common Commands

```bash
pnpm run typecheck
pnpm run build
pnpm --filter @workspace/api-spec run codegen
pnpm --filter @workspace/db run push
```

## API Notes

The API surface is currently minimal. `lib/api-spec/openapi.yaml` defines one endpoint:

- `GET /api/healthz` returns `{ "status": "ok" }`

Generated API code lives in:

- `lib/api-client-react/src/generated/`
- `lib/api-zod/src/generated/`

Run codegen after changing the OpenAPI spec.

## Database Notes

`@workspace/db` is prepared for Drizzle/PostgreSQL, but there are no real tables exported yet. The schema index at `lib/db/src/schema/index.ts` is still a scaffold. Database commands require a valid `DATABASE_URL`.

## Netlify Launch Setup For `ai-business-builder.html`

The standalone `ai-business-builder.html` page is ready to host on Netlify. Netlify serves `/` through `ai-business-builder.html`, and the checkout uses Netlify Functions for Stripe payment creation, purchase confirmation, Cloudflare R2 delivery, and Google Sheets logging.

Add these environment variables in Netlify:

```text
STRIPE_PUBLISHABLE_KEY
STRIPE_SECRET_KEY

R2_ACCOUNT_ID
R2_ACCESS_KEY_ID
R2_SECRET_ACCESS_KEY
R2_BUCKET
R2_BUCKET2
R2_BUCKET3
R2_FILE_KEY_BUNDLE
R2_FILE_KEY_AI_ASSISTANT
R2_FILE_KEY_WEBSITE_VOICE

PRODUCT_WORK_FROM_HOME_BUCKET
PRODUCT_WORK_FROM_HOME_FILE_KEY
PRODUCT_WORK_FROM_HOME_FILE_NAME
PRODUCT_AI_AUTOMATION_BUCKET
PRODUCT_AI_AUTOMATION_FILE_KEY
PRODUCT_AI_AUTOMATION_FILE_NAME
PRODUCT_WEBSITE_SEO_BUCKET
PRODUCT_WEBSITE_SEO_FILE_KEY
PRODUCT_WEBSITE_SEO_FILE_NAME
DOWNLOAD_TOKEN_SECRET

GOOGLE_SHEETS_ID
GOOGLE_SHEETS_TAB
GOOGLE_SERVICE_ACCOUNT_EMAIL
GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY
```

The `PRODUCT_*_BUCKET`, `PRODUCT_*_FILE_KEY`, and `DOWNLOAD_TOKEN_SECRET` values are optional. If omitted, the code uses your existing R2 names from the screenshot and uses `STRIPE_SECRET_KEY` to sign short-lived download tokens.

R2 product file mapping:

| Product | Price | Bucket fallback | File key fallback |
| --- | ---: | --- | --- |
| AI & Digital Skills Bundle | `$97` | `R2_BUCKET` | `R2_FILE_KEY_BUNDLE` |
| AI Automation System | `$297` | `R2_BUCKET2` | `R2_FILE_KEY_AI_ASSISTANT` |
| Website + SEO Client Path | `$47` | `R2_BUCKET3` | `R2_FILE_KEY_WEBSITE_VOICE` |

Checkout delivery mapping:

| Website + SEO checkbox | AI Automation checkbox | Total charged | Delivered file |
| --- | --- | ---: | --- |
| Unchecked | Unchecked | `$97` | `R2_FILE_KEY_BUNDLE` |
| Checked | Unchecked | `$72` | `R2_FILE_KEY_WEBSITE_VOICE` |
| Unchecked | Checked | `$72` | `R2_FILE_KEY_AI_ASSISTANT` |
| Checked | Checked | `$47` | `R2_FILE_KEY_BUNDLE` |

Download behavior:

After Stripe confirms payment, the page shows a download button without sending the user to another page. That button points to an on-site Netlify Function:

```text
/.netlify/functions/download-product?token=...
```

The Function verifies the paid product token, creates a temporary Cloudflare R2 signed URL, and returns the file with an attachment disposition so the buyer downloads the digital product to their computer.

Google Sheets setup:

1. Create or choose a Google Sheet and copy its spreadsheet ID into `GOOGLE_SHEETS_ID`.
2. Create a Google Cloud service account with Sheets API access.
3. Share the sheet with `GOOGLE_SERVICE_ACCOUNT_EMAIL` as an editor.
4. Paste the service account private key into `GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY`. Keep the escaped `\n` line breaks.
5. Create a tab named `Funnel Events` or set `GOOGLE_SHEETS_TAB` to your preferred tab name.

Rows are appended for lead capture, free-offer continuation, checkout opens, Stripe PaymentIntent creation, confirmed purchases, download preparation, and download clicks.

## Current Limitations

- The React funnel under `artifacts/skill-funnel` still has simulated checkout screens.
- The API server only exposes a health check.
- The database package is configured but has no application tables.
- Several app artifacts appear to be generated or recently added, so review Git status before committing.
