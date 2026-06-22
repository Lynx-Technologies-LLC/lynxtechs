import { cn } from "@/lib/utils";

type SectionHeaderProps = {
  label?: string;
  title: string;
  description?: string;
  className?: string;
  align?: "left" | "center";
};

export function SectionHeader({
  label,
  title,
  description,
  className,
  align = "left",
}: SectionHeaderProps) {
  return (
    <div
      className={cn(
        align === "center" && "mx-auto max-w-3xl text-center",
        className,
      )}
    >
      {label ? (
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
          {label}
        </p>
      ) : null}
      <h2 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
        {title}
      </h2>
      {description ? (
        <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
          {description}
        </p>
      ) : null}
    </div>
  );
}
