import { useTranslations } from "next-intl";
import { Keywords } from "@/components/ui/keywords";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

type Stage = { number: string; title: string; body: string };
type Status = "current" | "building" | "roadmap";
type Node = { label: string; status: Status };

/** Filled = operating now; ring = being built; faint ring = roadmap. */
const MARKER: Record<Status, string> = {
  current: "border-accent bg-accent",
  building: "border-accent bg-card",
  roadmap: "border-foreground/35 bg-card",
};

/**
 * One short band for how Whitehorse works: the four disciplines (operating
 * today), the request-specific evidence qualification, and links to the
 * full Process and Quality pages. The technology layers — most of them
 * roadmap — stay available in a native disclosure with their delivery
 * status (claim registry row 29), so nothing planned reads as live and the
 * homepage is not dominated by mechanics.
 */
export function QualityMethod() {
  const t = useTranslations("home.operating");
  const te = useTranslations("home.evidence");
  const tp = useTranslations("home.platform");
  const stages = t.raw("stages") as Stage[];
  const nodes = tp.raw("technology.nodes") as Node[];

  return (
    <section aria-labelledby="method-title" className="bg-daylight">
      <div className="mx-auto max-w-7xl px-5 py-16 sm:px-6 md:py-24 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-12 lg:items-end lg:gap-8">
          <div className="lg:col-span-7">
            <p className="text-xs font-medium tracking-[0.2em] text-accent uppercase">{t("eyebrow")}</p>
            <h2 id="method-title" className="mt-4 font-serif text-[2rem] leading-[1.12] font-medium tracking-[-0.01em] text-balance text-foreground md:text-[2.5rem]">
              {t("title")}
            </h2>
          </div>
          <div className="lg:col-span-5">
            <p className="text-base leading-relaxed text-pretty text-muted-foreground">{t("subtitle")}</p>
            <p className="mt-4 flex items-center gap-3 text-sm text-foreground">
              <span aria-hidden="true" className="h-px w-8 bg-accent" />
              {t("status")}
            </p>
          </div>
        </div>

        <ol className="mt-12 grid gap-x-8 gap-y-8 sm:grid-cols-2 lg:grid-cols-4">
          {stages.map((stage) => (
            <li key={stage.number} className="border-t border-foreground/15 pt-5">
              <span className="font-serif text-lg text-accent tabular-nums">{stage.number}</span>
              <h3 className="mt-2 font-serif text-xl leading-snug font-medium text-foreground">{stage.title}</h3>
              <p className="mt-2 text-[0.9375rem] leading-relaxed text-muted-foreground"><Keywords text={stage.body} /></p>
            </li>
          ))}
        </ol>

        <p className="mt-10 max-w-3xl text-[0.9375rem] leading-relaxed text-muted-foreground">{te("note")}</p>

        <div className="mt-6 flex flex-wrap gap-x-8 gap-y-2">
          {[
            { href: "/process", label: t("cta") },
            { href: "/certifications", label: t("qualityCta") },
          ].map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="inline-flex min-h-11 items-center text-[0.9375rem] font-medium text-foreground underline decoration-accent/50 underline-offset-8 transition-colors duration-200 hover:decoration-accent focus-visible:ring-3 focus-visible:ring-ring/60 focus-visible:outline-none"
            >
              {link.label}
            </Link>
          ))}
        </div>

        <details className="group mt-10 border-y border-foreground/12">
          <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between gap-4 py-3 text-[0.9375rem] font-medium text-foreground focus-visible:ring-3 focus-visible:ring-ring/60 focus-visible:outline-none [&::-webkit-details-marker]:hidden">
            {t("techSummary")}
            <span aria-hidden="true" className="text-lg text-accent transition-transform duration-200 group-open:rotate-45">+</span>
          </summary>
          <div className="pb-6">
            <p className="max-w-3xl text-[0.9375rem] leading-relaxed text-muted-foreground">{tp("subtitle")}</p>
            <ul className="mt-5 grid gap-x-8 gap-y-3 sm:grid-cols-2 lg:grid-cols-3">
              {nodes.map((node) => (
                <li key={node.label} className="flex items-center justify-between gap-4 border-b border-foreground/10 pb-3">
                  <span className="text-[0.9375rem] text-foreground">{node.label}</span>
                  <span className="flex shrink-0 items-center gap-2 text-sm">
                    <span aria-hidden="true" className={cn("size-2.5 rounded-full border", MARKER[node.status])} />
                    <span className={node.status === "current" ? "text-accent" : "text-muted-foreground"}>
                      {tp(`statusLabels.${node.status}`)}
                    </span>
                  </span>
                </li>
              ))}
            </ul>
            <p className="mt-5 max-w-3xl text-sm leading-relaxed text-muted-foreground">{tp("note")}</p>
            <Link
              href="/certifications"
              className="mt-3 inline-flex min-h-11 items-center text-[0.9375rem] font-medium text-foreground underline decoration-accent/50 underline-offset-8 hover:decoration-accent focus-visible:ring-3 focus-visible:ring-ring/60 focus-visible:outline-none"
            >
              {tp("cta")}
            </Link>
          </div>
        </details>
      </div>
    </section>
  );
}
