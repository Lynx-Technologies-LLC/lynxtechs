import Image from "next/image";
import Link from "next/link";

import { getSiteConfig } from "@/lib/site";
import { cn } from "@/lib/utils";

type LogoProps = {
  showName?: boolean;
  className?: string;
  imageClassName?: string;
};

export function Logo({
  showName = true,
  className,
  imageClassName,
}: LogoProps) {
  const site = getSiteConfig();

  return (
    <Link
      href="/"
      className={cn("flex items-center gap-3 font-semibold tracking-tight", className)}
    >
      <Image
        src="/logo.png"
        alt={site.companyName}
        width={40}
        height={40}
        className={cn("h-9 w-9 rounded-md object-contain sm:h-10 sm:w-10", imageClassName)}
        priority
      />
      {showName ? (
        <span className="hidden text-base sm:inline">{site.companyName}</span>
      ) : null}
    </Link>
  );
}
