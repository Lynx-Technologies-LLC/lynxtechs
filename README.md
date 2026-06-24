# Lynx Technologies

Modern marketing site for Lynx Technologies — real-time hardware for robotics and industrial automation.

## Stack

- **Next.js** (App Router) + TypeScript
- **Tailwind CSS** + shadcn-style UI components
- **MDX** content in `apps/web/content/pages/`
- **Turborepo** monorepo (Phase 2 shop scaffold in `apps/store/`)

## Getting started

**Requires Node.js 20.9 or newer** (Next.js 16). Ubuntu’s default `nodejs` package is often v18 — check with `node --version`.

### Install Node.js 22 with apt (Ubuntu)

Add the NodeSource apt repository, then install:

```bash
# Remove old Node if present (optional)
sudo apt remove -y nodejs npm

# Add NodeSource repo for Node 22
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -

# Install Node.js and npm
sudo apt-get install -y nodejs

# Verify
node --version   # should show v22.x
npm --version
```

### Run the site

```bash
cd ~/code/lynxtechs
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Adding a new page

1. Create `apps/web/content/pages/your-page.mdx`
2. Add frontmatter (`title`, `description`, optional `hero`)
3. The page is available at `/your-page`

For nested routes, use folders: `content/pages/docs/guide.mdx` → `/docs/guide`

## Adding a product

Product marketing content lives in dedicated product files. The catalog, homepage teasers, footer links, and product detail pages all read from the same source — no React edits needed.

### Folder structure

```text
apps/web/
├── content/products/
│   └── my-module.mdx           # product copy + frontmatter
├── content/pages/
│   └── products.mdx            # catalog page intro only
└── public/products/
    └── my-module/
        ├── hero.svg            # primary image (default if images omitted)
        ├── front.jpg           # optional gallery images
        └── datasheet.pdf       # optional downloadable docs
```

### Steps

1. Create `apps/web/content/products/my-module.mdx` with product frontmatter (copy an existing product as a template).
2. Add images and PDFs under `apps/web/public/products/my-module/`.
3. Set `listed: true` to show the product in the catalog, homepage, and footer; use `order` to control sort position (lower numbers first).
4. Deploy — catalog, teasers, footer, and detail page update automatically.

### Frontmatter fields

| Field | Purpose |
|-------|---------|
| `title`, `description` | SEO / browser tab |
| `name`, `type`, `summary` | Purchase panel and catalog cards |
| `sku` | SKU line on detail page |
| `images` | Gallery images (`/products/{handle}/...` paths) |
| `overview`, `highlights` | Overview tab |
| `specs` | Specs tab (label/value pairs) |
| `documentation` | Documentation tab links |
| `cta` | Primary quote button label |
| `listed` | Show in catalog/teasers/footer (default `true`) |
| `order` | Sort order in lists (default `0`) |

Price and cart will come from Medusa in Phase 2 ([apps/store/README.md](apps/store/README.md)); marketing copy stays in `content/products/`.

## Project structure

```text
lynxtechs/
├── apps/
│   ├── web/          # Marketing site (Phase 1)
│   └── store/        # Medusa headless commerce (Phase 2)
├── package.json
└── turbo.json
```

## Deploy to Vercel

This is a **monorepo**. Vercel must build the Next.js app inside `apps/web`, not the repo root.

1. Import the GitHub repo in Vercel
2. **Root Directory:** click Edit → select **`apps/web`** → Continue
3. **Framework Preset:** Next.js (auto-detected)
4. **Output Directory:** leave **empty** (do not set `public` or `.next`)
5. **Node.js Version:** 22.x (Settings → General)
6. Deploy — no environment variables needed for the marketing site

If you see `No Output Directory named "public" found`, the Root Directory is wrong (still at repo root) or Output Directory was set to `public` in project settings. Clear Output Directory override and set Root Directory to `apps/web`, then redeploy.

## Phase 2 — Shop

See [apps/store/README.md](apps/store/README.md) for headless commerce setup with Medusa + Stripe.
