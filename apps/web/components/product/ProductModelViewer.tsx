"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

const MODEL_VIEWER_SCRIPT =
  "https://ajax.googleapis.com/ajax/libs/model-viewer/4.0.0/model-viewer.min.js";

type ProductModelViewerProps = {
  src: string;
  alt: string;
  poster?: string;
};

function loadModelViewerScript(): Promise<void> {
  if (typeof customElements !== "undefined" && customElements.get("model-viewer")) {
    return Promise.resolve();
  }

  const existing = document.querySelector<HTMLScriptElement>(
    `script[src="${MODEL_VIEWER_SCRIPT}"]`,
  );

  if (existing) {
    return customElements.whenDefined("model-viewer").then(() => undefined);
  }

  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.type = "module";
    script.src = MODEL_VIEWER_SCRIPT;
    script.onload = () => {
      customElements.whenDefined("model-viewer").then(() => resolve());
    };
    script.onerror = () => reject(new Error("Failed to load model-viewer"));
    document.head.appendChild(script);
  });
}

export function ProductModelViewer({
  src,
  alt,
  poster,
}: ProductModelViewerProps) {
  const [ready, setReady] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    loadModelViewerScript()
      .then(() => setReady(true))
      .catch(() => setError(true));
  }, []);

  if (error) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-white px-6 text-center text-sm text-muted-foreground">
        Unable to load 3D viewer. Try refreshing the page.
      </div>
    );
  }

  if (!ready) {
    return poster ? (
      <div className="relative h-full w-full bg-white">
        <Image
          src={poster}
          alt={alt}
          fill
          className="object-contain p-6"
          sizes="(max-width: 1024px) 100vw, 50vw"
        />
        <div className="absolute inset-x-0 bottom-4 text-center text-sm text-muted-foreground">
          Loading 3D view...
        </div>
      </div>
    ) : (
      <div className="flex h-full w-full items-center justify-center bg-white text-sm text-muted-foreground">
        Loading 3D view...
      </div>
    );
  }

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
