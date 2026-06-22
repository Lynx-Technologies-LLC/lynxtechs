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

## Project structure

```text
lynxtechs/
├── apps/
│   ├── web/          # Marketing site (Phase 1)
│   └── store/        # Medusa headless commerce (Phase 2)
├── package.json
└── turbo.json
```

## Phase 2 — Shop

See [apps/store/README.md](apps/store/README.md) for headless commerce setup with Medusa + Stripe.
