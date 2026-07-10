// Fetch the versioned LXMASTER API-reference Markdown that the lxmaster release
// CI publishes as a GitHub Release asset (lxmaster-api-<version>.tar.gz), and
// unpack it into docs/lxmaster/api/ before the Docusaurus build.
//
// Env:
//   LXMASTER_DOCS_VERSION  version to fetch, e.g. "1.0.10" (default: latest release)
//   LXMASTER_REPO_SLUG     owner/repo for lxmaster (default: Lynx-Technologies-LLC/lxmaster)
//   LXMASTER_DOCS_TOKEN /
//   GITHUB_TOKEN           token for a private repo (optional if public)
//
// Best-effort: throws on failure so the orchestrator keeps the committed
// placeholder page. Set SYNC_STRICT=1 upstream to make failures fatal.

import {execFileSync} from 'node:child_process';
import {mkdirSync, writeFileSync} from 'node:fs';
import {dirname, resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
import {tmpdir} from 'node:os';

import {sanitizeApiDocs} from './sanitize-api-docs.mjs';

const scriptDir = dirname(fileURLToPath(import.meta.url));
const apiDir = resolve(scriptDir, '..', 'docs', 'lxmaster', 'api');

const repoSlug = process.env.LXMASTER_REPO_SLUG ?? 'Lynx-Technologies-LLC/lxmaster';
const token = process.env.LXMASTER_DOCS_TOKEN ?? process.env.GITHUB_TOKEN ?? '';

function ghHeaders(extra = {}) {
  const headers = {
    'User-Agent': 'lynxtechs-docs-build',
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
    ...extra,
  };
  if (token) headers.Authorization = `Bearer ${token}`;
  return headers;
}

async function getRelease() {
  const version = process.env.LXMASTER_DOCS_VERSION;
  const url = version
    ? `https://api.github.com/repos/${repoSlug}/releases/tags/v${version}`
    : `https://api.github.com/repos/${repoSlug}/releases/latest`;
  const res = await fetch(url, {headers: ghHeaders()});
  if (!res.ok) {
    throw new Error(`GitHub release lookup failed (${res.status}) for ${url}`);
  }
  return res.json();
}

export async function syncApiReference() {
  const release = await getRelease();
  const version = (release.tag_name ?? '').replace(/^v/, '');
  if (!version) throw new Error('Could not determine release version');

  const assetName = `lxmaster-api-${version}.tar.gz`;
  const asset = (release.assets ?? []).find((a) => a.name === assetName);
  if (!asset) {
    throw new Error(`Asset ${assetName} not found on release ${release.tag_name}`);
  }

  // The asset API url + octet-stream Accept works for private repos too.
  const res = await fetch(asset.url, {
    headers: ghHeaders({Accept: 'application/octet-stream'}),
    redirect: 'follow',
  });
  if (!res.ok) throw new Error(`Asset download failed (${res.status}) for ${assetName}`);

  const buf = Buffer.from(await res.arrayBuffer());
  const tmpFile = resolve(tmpdir(), assetName);
  writeFileSync(tmpFile, buf);

  mkdirSync(apiDir, {recursive: true});
  // Overlay the generated Markdown onto the api/ folder (replaces the
  // placeholder index; the generated bundle carries its own _category_.json).
  execFileSync('tar', ['-xzf', tmpFile, '-C', apiDir]);

  const appRoot = resolve(scriptDir, '..');
  const sanitized = sanitizeApiDocs(appRoot);
  console.log(
    `[sync-api] Sanitized API docs: ${sanitized.changedFiles} file(s) updated.`,
  );

  console.log(`[sync-api] Unpacked ${assetName} into docs/lxmaster/api/`);
}
