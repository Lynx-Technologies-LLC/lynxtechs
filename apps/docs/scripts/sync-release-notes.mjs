// Pull the lxmaster GitHub Releases (which use GitHub's auto-generated notes)
// and write one Markdown page per release into docs/lxmaster/release-notes/.
//
// Env:
//   LXMASTER_REPO_SLUG   owner/repo for lxmaster (default: Lynx-Technologies-LLC/lxmaster)
//   LXMASTER_DOCS_TOKEN /
//   GITHUB_TOKEN         token for a private repo (optional if public)
//
// Best-effort: throws on failure so the orchestrator keeps the committed
// placeholder index page.

import {mkdirSync, writeFileSync} from 'node:fs';
import {dirname, resolve} from 'node:path';
import {fileURLToPath} from 'node:url';

const scriptDir = dirname(fileURLToPath(import.meta.url));
const outDir = resolve(scriptDir, '..', 'docs', 'lxmaster', 'release-notes');

const repoSlug = process.env.LXMASTER_REPO_SLUG ?? 'Lynx-Technologies-LLC/lxmaster';
const token = process.env.LXMASTER_DOCS_TOKEN ?? process.env.GITHUB_TOKEN ?? '';

function ghHeaders() {
  const headers = {
    'User-Agent': 'lynxtechs-docs-build',
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
  };
  if (token) headers.Authorization = `Bearer ${token}`;
  return headers;
}

function safeName(tag) {
  return tag.replace(/^v/, '').replace(/[^A-Za-z0-9._-]/g, '-');
}

// Strip links that would point at the private lxmaster repository, which is
// inaccessible to the public.  GitHub's auto-generated release body contains:
//   - "Full Changelog: https://github.com/.../compare/..."
//   - PR contribution lines: "* @user made their first contribution in https://..."
//   - PR merge lines: "* Feature/... by @user in https://...pull/N"
function sanitizeReleaseBody(body) {
  return body
    .replace(/^\*\*Full Changelog\*\*:.*$/gm, '')
    .replace(/^.*https:\/\/github\.com\/[^ ]+\/[^ ]+\/pull\/\d+.*$/gm, '')
    .replace(/^.*made their first contribution.*$/gm, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

export async function syncReleaseNotes() {
  const url = `https://api.github.com/repos/${repoSlug}/releases?per_page=100`;
  const res = await fetch(url, {headers: ghHeaders()});
  if (!res.ok) throw new Error(`GitHub releases lookup failed (${res.status}) for ${url}`);

  const releases = (await res.json()).filter((r) => !r.draft);
  if (releases.length === 0) throw new Error('No releases found');

  mkdirSync(outDir, {recursive: true});

  releases.forEach((r, i) => {
    const tag = r.tag_name ?? `release-${i}`;
    const title = (r.name && r.name.trim()) || tag;
    const date = r.published_at ? r.published_at.slice(0, 10) : '';
    const rawBody = (r.body ?? '').trim();
    const body = sanitizeReleaseBody(rawBody) || '_No release notes were provided for this version._';
    const prerelease = r.prerelease ? ' (pre-release)' : '';

    const frontmatter =
      `---\n` +
      `title: ${JSON.stringify(title + prerelease)}\n` +
      // Newest release first: position 2..N (the index page is position 1).
      `sidebar_position: ${i + 2}\n` +
      `---\n\n`;

    const header =
      `# ${title}${prerelease}\n\n` +
      (date ? `_Released ${date}_\n\n` : '');

    const content = frontmatter + header + body + '\n';
    writeFileSync(resolve(outDir, `${safeName(tag)}.md`), content, 'utf8');
  });

  console.log(`[sync-release-notes] Wrote ${releases.length} release page(s).`);
}
