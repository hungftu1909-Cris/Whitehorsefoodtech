import { useTranslations } from "next-intl";
import { Reveal } from "@/components/ui/reveal";
import { cn } from "@/lib/utils";

/**
 * "Where we stand today" markers — current facts shown next to clearly
 * labelled targets (each item's `tag` says which is which), so a buyer never
 * mistakes a goal for a track record. Values are plain text rather than a
 * count-up animation, so they are correct in the server-rendered HTML too.
 *
 * Shared by the homepage band and the About page — single source of truth:
 * about.status.* in messages/*.json. Keep wording in sync with
 * docs/claim-registry.md before changing any figure.
 */
export function StatusMarkers({ variant = "band" }: { variant?: "band" | "muted" }) {
  const t = useTranslations("about.status");
  const items = t.raw("items") as { tag: string; value: string; label: string }[];
  const band = variant === "band";

  return (
    <section
      className={cn(
        "border-b border-border",
        band ? "bg-primary text-primary-foreground" : "bg-muted/30"
      )}
    >
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <h2
          className={cn(
            "font-serif text-xl font-semibold md:text-2xl",
            band ? "text-primary-foreground" : "text-center text-foreground"
          )}
        >
          {t("title")}
        </h2>
        <ul className="mt-8 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((item, i) => (
            <Reveal key={item.label} as="li" delay={i * 80}>
              <span
                className={cn(
                  "inline-block rounded-full border px-2 py-0.5 text-[0.65rem] font-semibold tracking-[0.15em] uppercase",
                  band
                    ? "border-primary-foreground/30 text-primary-foreground/80"
                    : "border-border text-muted-foreground"
                )}
              >
                {item.tag}
              </span>
              <p className="mt-3 font-serif text-3xl font-semibold text-accent md:text-4xl">
                {item.value}
              </p>
              <p
                className={cn(
                  "mt-2 text-sm leading-relaxed",
                  band ? "text-primary-foreground/85" : "text-muted-foreground"
                )}
              >
                {item.label}
              </p>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
