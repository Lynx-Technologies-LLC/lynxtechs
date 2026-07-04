// Sync the lxmaster-demos example projects into docs/lxmaster/examples/, so the
// documented examples always match the buildable, installed-package contract.
//
// Each demo becomes one Markdown page: its README (if any) plus the primary
// source file embedded in a code block, and a link back to the repo.
//
// Env:
//   LXMASTER_DEMOS_DIR    local path to a lxmaster-demos checkout (skips network)
//   LXMASTER_DEMOS_SLUG   owner/repo (default: Lynx-Technologies-LLC/lxmaster-demos)
//   LXMASTER_DEMOS_REF    git ref for the tarball (default: default branch)
//   LXMASTER_DOCS_TOKEN /
//   GITHUB_TOKEN          token for a private repo (optional if public)
//
// Best-effort: throws on failure so the orchestrator keeps the placeholder.

import {execFileSync} from 'node:child_process';
import {mkdirSync, mkdtempSync, readdirSync, readFileSync, writeFileSync, existsSync} from 'node:fs';
import {dirname, join, resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
import {tmpdir} from 'node:os';

const scriptDir = dirname(fileURLToPath(import.meta.url));
const outDir = resolve(scriptDir, '..', 'docs', 'lxmaster', 'examples');

const slug = process.env.LXMASTER_DEMOS_SLUG ?? 'Lynx-Technologies-LLC/lxmaster-demos';
const ref = process.env.LXMASTER_DEMOS_REF ?? '';
const token = process.env.LXMASTER_DOCS_TOKEN ?? process.env.GITHUB_TOKEN ?? '';

const SKIP_DIRS = new Set(['build', '.git', '.github', 'cmake', '.vscode']);

function ghHeaders(accept) {
  const headers = {'User-Agent': 'lynxtechs-docs-build', Accept: accept};
  if (token) headers.Authorization = `Bearer ${token}`;
  return headers;
}

async function fetchDemosRoot() {
  if (process.env.LXMASTER_DEMOS_DIR) {
    return resolve(process.env.LXMASTER_DEMOS_DIR);
  }
  const url = `https://api.github.com/repos/${slug}/tarball/${ref}`;
  // The tarball endpoint 302-redirects to codeload; it rejects an
  // octet-stream Accept (415), so use the standard API media type.
  const res = await fetch(url, {headers: ghHeaders('application/vnd.github+json'), redirect: 'follow'});
  if (!res.ok) throw new Error(`Demos tarball download failed (${res.status}) for ${url}`);

  const buf = Buffer.from(await res.arrayBuffer());
  const work = mkdtempSync(join(tmpdir(), 'lxmaster-demos-'));
  const tarPath = join(work, 'demos.tar.gz');
  writeFileSync(tarPath, buf);
  execFileSync('tar', ['-xzf', tarPath, '-C', work]);
  // The tarball extracts to a single top-level directory.
  const top = readdirSync(work, {withFileTypes: true}).find(
    (d) => d.isDirectory() && d.name !== '.',
  );
  if (!top) throw new Error('Could not locate extracted demos directory');
  return join(work, top.name);
}

function findPrimarySource(demoDir) {
  const candidates = ['main.cpp', join('src', 'main.cpp')];
  for (const c of candidates) {
    const p = join(demoDir, c);
    if (existsSync(p)) return p;
  }
  // Fall back to the first .cpp found (shallow, then src/).
  for (const base of [demoDir, join(demoDir, 'src')]) {
    if (!existsSync(base)) continue;
    const cpp = readdirSync(base).find((f) => f.endsWith('.cpp'));
    if (cpp) return join(base, cpp);
  }
  return null;
}

function looksLikeDemo(demoDir) {
  if (!existsSync(demoDir)) return false;
  const entries = readdirSync(demoDir);
  return entries.includes('CMakeLists.txt') || entries.some((f) => f.endsWith('.cpp'));
}

function titleFromName(name) {
  return name
    .replace(/[_-]+/g, ' ')
    .replace(/\b\w/g, (m) => m.toUpperCase());
}

// Rewrite README relative links to absolute repo URLs so they resolve on the
// docs site (e.g. `[main.cpp](main.cpp)` -> the file on GitHub). Skips fenced
// code blocks and leaves http/mailto/anchor links untouched.
function rewriteReadmeLinks(readme, name) {
  const gitRef = ref || 'main';
  const lines = readme.split('\n');
  let inFence = false;
  return lines
    .map((line) => {
      if (/^\s*```/.test(line)) {
        inFence = !inFence;
        return line;
      }
      if (inFence) return line;
      return line.replace(/(!?)\[([^\]]*)\]\(([^)]+)\)/g, (full, bang, label, target) => {
        const t = target.trim();
        if (/^(https?:|mailto:|#)/.test(t)) return full;
        const hashIdx = t.indexOf('#');
        const pathPart = hashIdx === -1 ? t : t.slice(0, hashIdx);
        const anchor = hashIdx === -1 ? '' : t.slice(hashIdx);
        const clean = pathPart.replace(/^\.\//, '');
        const blob = bang === '!' ? 'raw' : 'blob';
        return `${bang}[${label}](https://github.com/${slug}/${blob}/${gitRef}/${name}/${clean}${anchor})`;
      });
    })
    .join('\n');
}

export async function syncExamples() {
  const root = await fetchDemosRoot();

  const demos = readdirSync(root, {withFileTypes: true})
    .filter((d) => d.isDirectory() && !SKIP_DIRS.has(d.name))
    .map((d) => d.name)
    .filter((name) => looksLikeDemo(join(root, name)))
    .sort();

  if (demos.length === 0) throw new Error(`No demo projects found under ${root}`);

  mkdirSync(outDir, {recursive: true});

  demos.forEach((name, i) => {
    const demoDir = join(root, name);
    const title = titleFromName(name);
    const readmePath = ['README.md', 'README.txt'].map((f) => join(demoDir, f)).find(existsSync);
    const readmeRaw = readmePath ? readFileSync(readmePath, 'utf8').trim() : '';
    const readme = readmeRaw ? rewriteReadmeLinks(readmeRaw, name) : '';

    const srcPath = findPrimarySource(demoDir);
    const src = srcPath ? readFileSync(srcPath, 'utf8').trimEnd() : '';
    const srcName = srcPath ? srcPath.slice(demoDir.length + 1) : '';

    const repoUrl = `https://github.com/${slug}/tree/${ref || 'main'}/${name}`;

    let body = `---\ntitle: ${JSON.stringify(title)}\nsidebar_position: ${i + 2}\n---\n\n`;
    body += `<!-- GENERATED - do not edit. Synced from ${slug} by scripts/sync-examples.mjs. -->\n\n`;
    body += `# ${title}\n\n`;
    body += `> Buildable example from [\`${name}\`](${repoUrl}) in the \`lxmaster-demos\` repository.\n\n`;
    if (readme) body += `${readme}\n\n`;
    if (src) {
      body += `## Source: \`${srcName}\`\n\n`;
      body += '```cpp\n' + src + '\n```\n';
    }

    writeFileSync(resolve(outDir, `${name.replace(/_/g, '-')}.md`), body, 'utf8');
  });

  console.log(`[sync-examples] Wrote ${demos.length} example page(s).`);
}
