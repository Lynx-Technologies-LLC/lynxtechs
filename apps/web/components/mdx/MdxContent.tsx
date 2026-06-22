import type { AnchorHTMLAttributes, HTMLAttributes } from "react";
import { MDXRemote } from "next-mdx-remote/rsc";

const components = {
  h2: (props: HTMLAttributes<HTMLHeadingElement>) => (
    <h2 className="mt-10 text-2xl font-semibold tracking-tight" {...props} />
  ),
  h3: (props: HTMLAttributes<HTMLHeadingElement>) => (
    <h3 className="mt-8 text-xl font-semibold tracking-tight" {...props} />
  ),
  p: (props: HTMLAttributes<HTMLParagraphElement>) => (
    <p className="mt-4 leading-7 text-muted-foreground" {...props} />
  ),
  ul: (props: HTMLAttributes<HTMLUListElement>) => (
    <ul className="mt-4 list-disc space-y-2 pl-6 text-muted-foreground" {...props} />
  ),
  li: (props: HTMLAttributes<HTMLLIElement>) => (
    <li className="leading-7" {...props} />
  ),
  a: (props: AnchorHTMLAttributes<HTMLAnchorElement>) => (
    <a className="font-medium text-primary hover:underline" {...props} />
  ),
};

type MdxContentProps = {
  source: string;
};

export function MdxContent({ source }: MdxContentProps) {
  return (
    <div className="prose prose-neutral max-w-none dark:prose-invert">
      <MDXRemote source={source} components={components} />
    </div>
  );
}
