import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

type Status = "current" | "building" | "roadmap";
type Node = { label: string; status: Status };

/** Filled = operating now; ring = being built; faint ring = roadmap. */
const MARKER: Record<Status, string> = {
  current: "border-accent bg-accent",
  building: "border-accent bg-deep",
  roadmap: "border-deep-foreground/40 bg-deep",
};

/**
 * Future-facing platform layers, after the operating standard, portfolio
 * and evidence. Every layer shows its delivery status (claim registry
 * row 29), matching the Quality page architecture. Drawn as one data
 * backbone with layers along it, not as a dashboard of tiles.
 */
export function PlatformMap() {
  const t = useTranslations("home.platform");
  const nodes = t.raw("technology.nodes") as Node[];

  const status = (s: Status) => (
    <span className="flex items-center gap-2.5 text-xs tracking-[0.16em] uppercase">
      <span aria-hidden="true" className={cn("size-2.5 shrink-0 rounded-full border", MARKER[s])} />
      <span className={s === "current" ? "text-accent" : "text-deep-foreground/60"}>{t(`statusLabels.${s}`)}</span>
    </span>
  );

  return (
    <section aria-labelledby="platform-title" className="bg-deep text-deep-foreground">
      <div className="mx-auto max-w-7xl px-5 py-20 sm:px-6 md:py-32 lg:px-8 lg:py-40">
        <div className="grid gap-14 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-6">
            <p className="text-xs font-medium tracking-[0.24em] text-accent uppercase">{t("eyebrow")}</p>
            <h2 id="platform-title" className="mt-5 font-serif text-[2rem] leading-[1.12] font-medium tracking-[-0.01em] text-balance md:text-[2.6rem]">
              {t("title")}
            </h2>
            <p className="mt-6 max-w-lg text-base leading-relaxed text-deep-foreground/70 md:text-[1.0625rem]">{t("subtitle")}</p>
          </div>

          <div className="border-l border-accent/50 pl-6 lg:col-span-4 lg:col-start-9 lg:self-end">
            {status("building")}
            <h3 className="mt-4 font-serif text-2xl font-medium">{t("workspace.title")}</h3>
            <p className="mt-3 text-[0.9375rem] leading-relaxed text-deep-foreground/70">{t("workspace.body")}</p>
          </div>
        </div>

        <div className="mt-20 md:mt-28">
          <div className="grid gap-5 lg:grid-cols-12 lg:gap-8">
            <h3 className="font-serif text-2xl font-medium lg:col-span-5 md:text-[1.75rem]">{t("technology.title")}</h3>
            <p className="max-w-2xl text-[0.9375rem] leading-relaxed text-deep-foreground/70 lg:col-span-6 lg:col-start-7">{t("technology.body")}</p>
          </div>

          {/* The backbone: one rule, with each layer marked on it. */}
          <ol className="relative mt-12 grid gap-9 pl-8 before:absolute before:top-1 before:bottom-1 before:left-[4.5px] before:w-px before:bg-deep-foreground/20 sm:grid-cols-2 sm:gap-x-8 lg:mt-16 lg:grid-cols-6 lg:gap-6 lg:pt-10 lg:pl-0 lg:before:top-[4.5px] lg:before:right-0 lg:before:bottom-auto lg:before:left-0 lg:before:h-px lg:before:w-auto">
            {nodes.map((node, i) => (
              <li key={node.label} className="relative">
                <span
                  aria-hidden="true"
                  className={cn("absolute top-1 -left-8 size-2.5 rounded-full border lg:-top-10 lg:left-0", MARKER[node.status])}
                />
                <span className="text-xs tracking-[0.14em] text-deep-foreground/50 tabular-nums">{String(i + 1).padStart(2, "0")}</span>
                <p className="mt-2 font-serif text-xl leading-snug">{node.label}</p>
                <p className="mt-3 text-xs tracking-[0.16em] uppercase">
                  <span className={node.status === "current" ? "text-accent" : "text-deep-foreground/60"}>
                    {t(`statusLabels.${node.status}`)}
                  </span>
                </p>
              </li>
            ))}
          </ol>

          <div className="mt-12 flex flex-col gap-4 border-t border-accent/40 pt-6 sm:flex-row sm:items-center sm:justify-between lg:mt-16">
            <p className="font-serif text-xl">{t("technology.ai")}</p>
            {status("roadmap")}
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-6 md:mt-20 lg:flex-row lg:items-end lg:justify-between lg:gap-16">
          <p className="max-w-3xl text-sm leading-relaxed text-deep-foreground/60">{t("note")}</p>
          <Link
            href="/certifications"
            className="shrink-0 text-[0.9375rem] font-medium underline decoration-accent/60 underline-offset-8 transition-colors hover:decoration-accent"
          >
            {t("cta")}
          </Link>
        </div>
      </div>
    </section>
  );
}
