"use client";

import "@google/model-viewer";

type ProductModelViewerProps = {
  src: string;
  alt: string;
  poster?: string;
};

export function ProductModelViewer({
  src,
  alt,
  poster,
}: ProductModelViewerProps) {
  return (
    <model-viewer
      src={src}
      alt={alt}
      poster={poster}
      camera-controls
      auto-rotate
      shadow-intensity="1"
      interaction-prompt="auto"
      className="h-full w-full bg-white"
    />
  );
}
