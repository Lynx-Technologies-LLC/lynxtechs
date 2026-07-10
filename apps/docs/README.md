# @lynxtechs/docs

The Lynx Technologies documentation site (Docusaurus 3), served at
`https://docs.lynxtechs.com`. Part of the `lynxtechs` monorepo.

## Local development

```bash
# from the repo root
npm install
npm run dev:docs        # or: cd apps/docs && npm run dev
```

`dev` and `build` first run `scripts/prebuild.mjs`, which syncs generated content
(LXMASTER API reference, release notes, example projects). Without network/tokens
those steps warn and fall back to the committed placeholder pages, so the site
always builds.

## Content model

| Path | Source | Committed? |
| --- | --- | --- |
| `docs/intro.md`, `docs/lxmaster/ethercat-basics/**` | Hand-authored | Yes |
| `docs/lxmaster/overview.md`, `getting-started.md` | Hand-authored | Yes |
| `docs/lxmaster/tutorials/**` | Migrated from lxmaster (`scripts/migrate-recovered-docs.mjs`) | Yes |
| `docs/hardware/**` | Hand-authored | Yes |
| `docs/lxmaster/api/**` | Generated: lxmaster release asset (Doxygen -> doxybook2) | No (placeholder only) |
| `docs/lxmaster/release-notes/**` | Generated: lxmaster GitHub Releases | No (placeholder only) |
| `docs/lxmaster/examples/**` | Generated: `lxmaster-demos` repo | No (placeholder only) |

Generated folders are git-ignored except their placeholder `index.md` /
`_category_.json`. See `.gitignore`.

## Sync scripts (`scripts/`)

| Script | Purpose |
| --- | --- |
| `prebuild.mjs` | Orchestrates all syncs before dev/build (best-effort). |
| `sync-api.mjs` | Downloads `lxmaster-api-<version>.tar.gz` from the lxmaster release. |
| `sync-release-notes.mjs` | Pulls lxmaster GitHub Releases into `release-notes/`. |
| `sync-examples.mjs` | Syncs `lxmaster-demos` projects into `examples/`. |
| `migrate-recovered-docs.mjs` | One-time import of deleted lxmaster prose docs. |
| `cut-version.mjs` | Cuts a Docusaurus version keyed to an LXMASTER release. |

### Environment variables

| Var | Used by | Notes |
| --- | --- | --- |
| `LXMASTER_DOCS_TOKEN` / `GITHUB_TOKEN` | api / release-notes / examples sync | Required only if the lxmaster repos are private. |
| `LXMASTER_DOCS_VERSION` | api / release-notes sync, version cut | Defaults to the latest release. |
| `LXMASTER_REPO_SLUG` | api / release-notes sync | Default `Lynx-Technologies-LLC/lxmaster`. |
| `LXMASTER_DEMOS_SLUG` | examples sync | Default `Lynx-Technologies-LLC/lxmaster-demos`. |
| `SYNC_STRICT=1` | prebuild | Make a failed sync fatal (used by the version cut). |
| `ANTHROPIC_API_KEY` | Ask AI (`api/docs-chat`) | Required in Vercel for the navbar Ask AI chat. Never expose in the browser. |
| `ANTHROPIC_MODEL` | Ask AI | Optional Claude model override. Defaults to `claude-haiku-4-5`. |

## Ask AI

The navbar **Ask AI** button opens a chat panel backed by the Anthropic API.

- **Frontend:** `src/components/AskAi/`, wired through `src/theme/Root.tsx` and a custom navbar item.
- **API:** `api/docs-chat.ts` (Vercel serverless function).
- **Prompts & scope rules:** `lib/docs-chat-prompts.mjs` — edit `SYSTEM_PROMPT`, `OFF_TOPIC_REFUSAL`, or the on/off-topic pattern lists. Restart the dev server after changes.
- **Doc retrieval for answers:** `lib/docs-chat-context.mjs` — searches local Lynx docs and injects relevant excerpts into each Ask AI request.

### Local testing

`npm run dev` serves the UI and the `/api/docs-chat` route in development.

```bash
cd apps/docs
cp .env.example .env.local   # add ANTHROPIC_API_KEY
npm run dev
```

Restart the dev server after creating or changing `.env.local`.

Deploy to Vercel with `ANTHROPIC_API_KEY` set in the project environment variables.

Internal doc retrieval (RAG) can be added later inside `api/docs-chat.ts` before the Anthropic request.

## Versioning

Docs versions are keyed to LXMASTER semver:

```bash
cd apps/docs
node scripts/cut-version.mjs 1.0.10   # syncs 1.0.10 content, then snapshots it
```

In CI this is automated by `.github/workflows/docs-version.yml`
(`workflow_dispatch`, or `repository_dispatch` of type `lxmaster-release` sent by
the lxmaster release workflow), which opens a PR with the new `versioned_docs/`.

## Deployment (Vercel)

Deploy as a **separate Vercel project** from the same repo:

- **Root Directory:** `apps/docs`
- **Framework preset:** Docusaurus (see `vercel.json`)
- **Build command:** `npm run build` (runs the prebuild sync automatically)
- **Output directory:** `build`
- **Domain:** `docs.lynxtechs.com`
- **Environment variables:** set `LXMASTER_DOCS_TOKEN` (if the lxmaster repos are
  private) and optionally `LXMASTER_DOCS_VERSION`.

The marketing site (`apps/web`) already links to `https://docs.lynxtechs.com`, so
no change is needed there.

> The previous standalone `lynxtechsdocs` repository is superseded by this app
> and can be archived: `gh repo archive Lynx-Technologies-LLC/lynxtechsdocs`.
