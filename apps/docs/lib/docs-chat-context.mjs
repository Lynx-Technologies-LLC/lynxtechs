import fs from 'fs';
import path from 'path';
import {fileURLToPath} from 'url';

const DOCS_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

const FALLBACK_DOC_PATHS = [
  'docs/lxmaster/getting-started.md',
  'docs/lxmaster/examples/index.md',
  'docs/lxmaster/overview.md',
  'docs/hardware/overview.md',
];

let cachedSources = null;

function stripFrontmatter(content) {
  return content.replace(/^---[\s\S]*?---\n?/, '').trim();
}

function walkMarkdownFiles(dir, files = []) {
  if (!fs.existsSync(dir)) {
    return files;
  }

  for (const entry of fs.readdirSync(dir, {withFileTypes: true})) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      if (entry.name === 'api' || entry.name === 'release-notes') {
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
      return {
        filePath,
        relativePath: path.relative(DOCS_ROOT, filePath),
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

function readFallbackSources() {
  return FALLBACK_DOC_PATHS.map((relativePath) => {
    const filePath = path.join(DOCS_ROOT, relativePath);
    if (!fs.existsSync(filePath)) {
      return null;
    }

    return {
      filePath,
      relativePath,
      content: stripFrontmatter(fs.readFileSync(filePath, 'utf8')),
      score: 1,
    };
  }).filter(Boolean);
}

export function retrieveDocsContext(query, {maxChars = 14000, maxSources = 6} = {}) {
  const queryTokens = tokenize(query);
  const sources = loadDocSources();

  let ranked = sources
    .map((source) => ({...source, score: scoreSource(queryTokens, source)}))
    .filter((source) => source.score > 0)
    .sort((left, right) => right.score - left.score);

  if (ranked.length === 0 && /\b(lynx|lxmaster|ethercat|example|demo|hardware|lxdio|lxfiber|lxrj45)\b/i.test(query)) {
    ranked = readFallbackSources();
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

export function buildSystemPrompt(basePrompt, query) {
  const context = retrieveDocsContext(query);

  if (!context) {
    return basePrompt;
  }

  return `${basePrompt}

---
DOCUMENTATION CONTEXT (retrieved from the Lynx docs site — treat this as your primary source):

${context}`;
}
