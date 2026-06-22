import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex flex-1 items-center justify-center px-4 py-24">
      <div className="text-center">
        <h1 className="text-4xl font-bold">Page not found</h1>
        <p className="mt-4 text-muted-foreground">
          The page you are looking for does not exist.
        </p>
        <Button asChild className="mt-8">
          <Link href="/">Back to home</Link>
        </Button>
      </div>
    </div>
  );
}
