import fs from "fs";
import path from "path";
import matter from "gray-matter";

const contentDirectory = path.join(process.cwd(), "content/pages");

export type PageFrontmatter = {
  title: string;
  description: string;
  hero?: {
    headline: string;
    subcopy?: string;
  };
};

export type PageContent = {
  slug: string;
  frontmatter: PageFrontmatter;
  content: string;
};

function slugFromRelativePath(relativePath: string): string {
  const withoutExt = relativePath.replace(/\.mdx$/, "");
  if (withoutExt.endsWith("/index") || withoutExt === "index") {
    return withoutExt.replace(/\/?index$/, "");
  }
  return withoutExt;
}

function walkMdxFiles(dir: string, baseDir = dir): string[] {
  if (!fs.existsSync(dir)) {
    return [];
  }

  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const files: string[] = [];

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...walkMdxFiles(fullPath, baseDir));
    } else if (entry.name.endsWith(".mdx")) {
      files.push(path.relative(baseDir, fullPath));
    }
  }

  return files;
}

export function getAllPageSlugs(): string[] {
  return walkMdxFiles(contentDirectory)
    .map(slugFromRelativePath)
    .filter((slug) => slug.length > 0);
}

export function getPageBySlug(slugParts: string[]): PageContent | null {
  const slug = slugParts.join("/");
  const candidates = [
    path.join(contentDirectory, `${slug}.mdx`),
    path.join(contentDirectory, slug, "index.mdx"),
  ];

  const filePath = candidates.find((candidate) => fs.existsSync(candidate));
  if (!filePath) {
    return null;
  }

  const fileContents = fs.readFileSync(filePath, "utf8");
  const { data, content } = matter(fileContents);

  return {
    slug,
    frontmatter: data as PageFrontmatter,
    content,
  };
}
