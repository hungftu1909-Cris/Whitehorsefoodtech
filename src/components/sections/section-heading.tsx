import { cn } from "@/lib/utils";

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = "left",
  className,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: "left" | "center";
  className?: string;
}) {
  return (
    <div className={cn("max-w-2xl", align === "center" && "mx-auto text-center", className)}>
      {eyebrow && (
        <p className="text-xs font-semibold tracking-[0.2em] text-accent uppercase">
          {eyebrow}
        </p>
      )}
      <h2 className="mt-3 font-serif text-3xl leading-tight font-semibold tracking-tight text-balance text-foreground md:text-4xl">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-4 text-base text-pretty text-muted-foreground md:text-lg">
          {subtitle}
        </p>
      )}
    </div>
  );
}
