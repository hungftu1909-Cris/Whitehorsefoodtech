import { ArrowRight, BrainCircuit, Check, CircleDashed, Route } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

type Status = "current" | "building" | "roadmap";
type Node = { label: string; status: Status };

const STATUS_ICON = { current: Check, building: CircleDashed, roadmap: Route } as const;

/**
 * Future-facing platform layers, after the operating standard, portfolio
 * and evidence. Every layer shows its delivery status (claim registry
 * row 29), matching the Quality page architecture.
 */
export function PlatformMap() {
  const t = useTranslations("home.platform");
  const nodes = t.raw("technology.nodes") as Node[];

  const statusBadge = (status: Status) => {
    const Icon = STATUS_ICON[status];
    return (
      <span
        className={cn(
          "inline-flex items-center gap-1.5 text-[0.62rem] font-semibold tracking-[0.14em] uppercase",
          status === "current" ? "text-accent" : "text-primary-foreground/60"
        )}
      >
        <Icon className="size-3" aria-hidden="true" />
        {t(`statusLabels.${status}`)}
      </span>
    );
  };

  return (
    <section className="relative overflow-hidden bg-primary text-primary-foreground">
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-[0.06] [background-image:linear-gradient(to_right,currentColor_1px,transparent_1px),linear-gradient(to_bottom,currentColor_1px,transparent_1px)] [background-size:48px_48px]"
      />
      <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 md:py-24 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[1fr_1fr] lg:items-end lg:gap-20">
          <div>
            <p className="text-xs font-semibold tracking-[0.22em] text-accent uppercase">{t("eyebrow")}</p>
            <h2 className="mt-4 max-w-xl font-serif text-3xl leading-tight font-semibold tracking-tight text-balance md:text-4xl">
              {t("title")}
            </h2>
            <p className="mt-5 max-w-lg leading-relaxed text-primary-foreground/75">{t("subtitle")}</p>
          </div>

          <div className="rounded-xl border border-primary-foreground/15 bg-primary-foreground/[0.04] p-6">
            {statusBadge("building")}
            <h3 className="mt-3 font-serif text-xl font-semibold">{t("workspace.title")}</h3>
            <p className="mt-2 text-sm leading-relaxed text-primary-foreground/70">{t("workspace.body")}</p>
          </div>
        </div>

        <div className="mt-10 rounded-xl border border-primary-foreground/15 bg-primary-foreground/[0.04] p-5 sm:p-6 md:p-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <h3 className="font-serif text-2xl font-semibold md:text-3xl">{t("technology.title")}</h3>
            <p className="max-w-2xl text-sm leading-relaxed text-primary-foreground/70">{t("technology.body")}</p>
          </div>

          <ol className="mt-7 grid gap-2 sm:grid-cols-2 lg:grid-cols-6">
            {nodes.map((node, i) => (
              <li
                key={node.label}
                className="flex min-h-24 flex-col justify-between gap-3 rounded-md border border-primary-foreground/15 bg-primary/70 px-4 py-3 text-sm leading-snug text-primary-foreground/85"
              >
                <span className="flex items-center justify-between gap-2">
                  <span className="font-mono text-xs text-accent">{String(i + 1).padStart(2, "0")}</span>
                  {statusBadge(node.status)}
                </span>
                <span>{node.label}</span>
              </li>
            ))}
          </ol>

          <div className="mt-3 flex flex-wrap items-center justify-between gap-3 rounded-md border border-accent/35 bg-accent/10 px-4 py-3 text-sm font-semibold text-primary-foreground">
            <span className="flex items-center gap-3">
              <BrainCircuit className="size-5 shrink-0 text-accent" aria-hidden="true" />
              {t("technology.ai")}
            </span>
            {statusBadge("roadmap")}
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-4 border-t border-primary-foreground/15 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="max-w-3xl text-xs leading-relaxed text-primary-foreground/60">{t("note")}</p>
          <Link href="/certifications" className="inline-flex shrink-0 items-center gap-2 text-sm font-medium text-accent hover:underline">
            {t("cta")}
            <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}
