import fs from 'fs';
import path from 'path';
import {fileURLToPath} from 'url';

const DOCS_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

// Fallback sources per domain, used when no scored results match.
const FALLBACK_DOC_PATHS = {
  software: [
    'docs/lxmaster/getting-started.md',
    'docs/lxmaster/overview.md',
    'docs/lxmaster/examples/index.md',
  ],
  hardware: [
    'docs/hardware/overview.md',
    'docs/hardware/lxdio33-16/overview.md',
    'docs/hardware/lxfiber/overview.md',
    'docs/hardware/lxrj45/overview.md',
  ],
};

let cachedSources = null;

function stripFrontmatter(content) {
  return content.replace(/^---[\s\S]*?---\n?/, '').trim();
}

/**
 * Derive the domain tags for a source file.
 * - 'software': LXMASTER docs (lxmaster_versioned_docs/ or docs/lxmaster/)
 * - 'hardware': PCB module docs (docs/hardware/)
 * - ['software','hardware']: ethercat-basics pages (relevant to both)
 */
function getDomainTags(relativePath) {
  const p = relativePath.replace(/\\/g, '/');
  const isEthercat = p.includes('ethercat-basics');
  const isLxmaster =
    p.startsWith('lxmaster_versioned_docs/') ||
    p.startsWith('docs/lxmaster/') ||
    p.startsWith('lxmaster_versioned_docs\\') ||
    p.startsWith('docs\\lxmaster\\');
  const isHardware =
    p.startsWith('docs/hardware/') || p.startsWith('docs\\hardware\\');

  if (isEthercat) return ['software', 'hardware'];
  if (isLxmaster) return ['software'];
  if (isHardware) return ['hardware'];
  return ['software', 'hardware']; // other docs default to both
}

function walkMarkdownFiles(dir, files = []) {
  if (!fs.existsSync(dir)) {
    return files;
  }

  for (const entry of fs.readdirSync(dir, {withFileTypes: true})) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      if (entry.name === 'release-notes') {
        continue;
      }
      walkMarkdownFiles(fullPath, files);
      continue;
    }

    if (entry.name.endsWith('.md')) {
      files.push(fullPath);
    }
  }

  return files;
}

function getLatestVersionedDocsDir() {
  const versionedRoot = path.join(DOCS_ROOT, 'lxmaster_versioned_docs');
  if (!fs.existsSync(versionedRoot)) {
    return null;
  }

  const latestVersion = fs
    .readdirSync(versionedRoot)
    .filter((entry) => entry.startsWith('version-'))
    .sort()
    .at(-1);

  return latestVersion ? path.join(versionedRoot, latestVersion) : null;
}

function loadDocSources() {
  if (cachedSources) {
    return cachedSources;
  }

  const files = walkMarkdownFiles(path.join(DOCS_ROOT, 'docs'));
  const latestVersionedDir = getLatestVersionedDocsDir();

  if (latestVersionedDir) {
    files.push(...walkMarkdownFiles(latestVersionedDir));
  }

  cachedSources = files
    .filter((filePath, index, all) => all.indexOf(filePath) === index)
    .map((filePath) => {
      const raw = fs.readFileSync(filePath, 'utf8');
      const relativePath = path.relative(DOCS_ROOT, filePath);
      return {
        filePath,
        relativePath,
        domains: getDomainTags(relativePath),
        content: stripFrontmatter(raw),
      };
    });

  return cachedSources;
}

function tokenize(text) {
  const tokens = text.toLowerCase().match(/\b[a-z][a-z0-9_-]{2,}\b/g) ?? [];
  const expanded = [...tokens];

  if (/\bexample|demo|sample|starter|first\s+project\b/i.test(text)) {
    expanded.push('example', 'examples', 'demo', 'getting-started');
  }
  if (/\bfirst\b/i.test(text)) {
    expanded.push('getting-started', 'overview', 'index');
  }
  if (/\blxmaster\b/i.test(text)) {
    expanded.push('lxmaster', 'getting-started', 'overview');
  }
  if (/\bethercat\b/i.test(text)) {
    expanded.push('ethercat');
  }
  if (/\bhardware|lxdio|lxfiber|lxrj45\b/i.test(text)) {
    expanded.push('hardware', 'lxdio', 'lxfiber', 'lxrj45');
  }

  return [...new Set(expanded)];
}

function scoreSource(queryTokens, source) {
  const searchable = `${source.relativePath}\n${source.content}`.toLowerCase();
  let score = 0;

  for (const token of queryTokens) {
    if (searchable.includes(token)) {
      score += 1;
    }
    if (source.relativePath.toLowerCase().includes(token)) {
      score += 3;
    }
  }

  if (source.relativePath.endsWith('examples/index.md')) {
    score += queryTokens.includes('example') || queryTokens.includes('demo') ? 10 : 0;
  }
  if (source.relativePath.includes('/examples/')) {
    score += queryTokens.includes('example') || queryTokens.includes('demo') ? 4 : 0;
  }
  if (source.relativePath.endsWith('getting-started.md')) {
    score +=
      queryTokens.includes('getting-started') ||
      queryTokens.includes('start') ||
      queryTokens.includes('first')
        ? 8
        : 0;
  }

  return score;
}

function readFallbackSources(domain) {
  const paths = domain === 'hardware'
    ? FALLBACK_DOC_PATHS.hardware
    : FALLBACK_DOC_PATHS.software;

  return paths
    .map((relativePath) => {
      const filePath = path.join(DOCS_ROOT, relativePath);
      if (!fs.existsSync(filePath)) {
        return null;
      }

      return {
        filePath,
        relativePath,
        domains: getDomainTags(relativePath),
        content: stripFrontmatter(fs.readFileSync(filePath, 'utf8')),
        score: 1,
      };
    })
    .filter(Boolean);
}

export function retrieveDocsContext(query, {domain = 'software', maxChars = 14000, maxSources = 6} = {}) {
  const queryTokens = tokenize(query);
  const allSources = loadDocSources();

  // Filter to sources relevant to the requested domain.
  const domainSources = allSources.filter((s) => s.domains.includes(domain));

  let ranked = domainSources
    .map((source) => ({...source, score: scoreSource(queryTokens, source)}))
    .filter((source) => source.score > 0)
    .sort((left, right) => right.score - left.score);

  if (
    ranked.length === 0 &&
    /\b(lynx|lxmaster|ethercat|example|demo|hardware|lxdio|lxfiber|lxrj45)\b/i.test(query)
  ) {
    ranked = readFallbackSources(domain);
  }

  const selected = ranked.slice(0, maxSources);
  let context = '';

  for (const source of selected) {
    const section = `### ${source.relativePath}\n${source.content.slice(0, 3500)}`;
    if (context.length + section.length > maxChars) {
      break;
    }
    context += `${context ? '\n\n' : ''}${section}`;
  }

  return context.trim();
}

export function buildSystemPrompt(basePrompt, query, domain = 'software') {
  const context = retrieveDocsContext(query, {domain});

  if (!context) {
    return basePrompt;
  }

  return `${basePrompt}

---
DOCUMENTATION CONTEXT (retrieved from the Lynx docs site — treat this as your primary source):

${context}`;
}
