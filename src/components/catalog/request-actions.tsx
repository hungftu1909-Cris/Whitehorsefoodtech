import { Link } from "@/i18n/navigation";
import { buttonVariants } from "@/components/ui/button";
import { rfqHref } from "@/lib/rfq-links";
import { cn } from "@/lib/utils";

/**
 * The three B2B actions (specification, sample, quote) as prefilled RFQ
 * links. No cart, price or stock — a request starts a conversation.
 */
export function RequestActions({
  family,
  range,
  sku,
  labels,
  className,
}: {
  family: string;
  range?: string;
  sku?: string;
  labels: { sample: string; spec: string; quote: string };
  className?: string;
}) {
  const base = { family, range, sku };
  return (
    <div className={cn("flex flex-wrap gap-3", className)}>
      <Link
        href={rfqHref({ ...base, intent: "sample" })}
        className={cn(buttonVariants({ size: "lg" }), "cursor-pointer px-5")}
      >
        {labels.sample}
      </Link>
      <Link
        href={rfqHref({ ...base, intent: "spec-sheet" })}
        className={cn(buttonVariants({ variant: "outline", size: "lg" }), "cursor-pointer px-5")}
      >
        {labels.spec}
      </Link>
      <Link
        href={rfqHref({ ...base, intent: "quote" })}
        className={cn(buttonVariants({ variant: "ghost", size: "lg" }), "cursor-pointer px-3 text-accent hover:text-accent")}
      >
        {labels.quote}
      </Link>
    </div>
  );
}
