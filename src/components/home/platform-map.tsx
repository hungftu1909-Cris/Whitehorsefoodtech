import { ArrowRight, Check, CircleDashed } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

type Stage = {
  number: string;
  title: string;
  body: string;
  status: "current" | "building";
};

/** A truthful platform diagram: what operates today and what is being built. */
export function PlatformMap() {
  const t = useTranslations("home.platform");
  const stages = t.raw("stages") as Stage[];

  return (
    <section className="relative overflow-hidden bg-primary text-primary-foreground">
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-[0.07] [background-image:linear-gradient(to_right,currentColor_1px,transparent_1px),linear-gradient(to_bottom,currentColor_1px,transparent_1px)] [background-size:48px_48px]"
      />
      <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 md:py-28 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <div>
            <p className="text-xs font-semibold tracking-[0.22em] text-accent uppercase">{t("eyebrow")}</p>
            <h2 className="mt-4 max-w-xl font-serif text-3xl leading-tight font-semibold tracking-tight text-balance md:text-5xl">
              {t("title")}
            </h2>
            <p className="mt-5 max-w-lg leading-relaxed text-primary-foreground/75">{t("subtitle")}</p>
            <div className="mt-8 flex flex-wrap gap-3 text-xs">
              <span className="inline-flex items-center gap-2 rounded-full border border-accent/50 bg-accent/10 px-3 py-1.5 text-primary-foreground">
                <Check className="size-3.5 text-accent" aria-hidden="true" />
                {t("current")}
              </span>
              <span className="inline-flex items-center gap-2 rounded-full border border-primary-foreground/25 px-3 py-1.5 text-primary-foreground/75">
                <CircleDashed className="size-3.5" aria-hidden="true" />
                {t("building")}
              </span>
            </div>
          </div>

          <ol className="relative grid gap-px overflow-hidden rounded-xl border border-primary-foreground/15 bg-primary-foreground/15 sm:grid-cols-2">
            {stages.map((stage) => (
              <li key={stage.number} className="group relative flex min-h-56 flex-col bg-primary/95 p-6 md:p-7">
                <div className="flex items-center justify-between gap-4">
                  <span className="font-mono text-xs tracking-[0.18em] text-accent">{stage.number}</span>
                  <span className="inline-flex items-center gap-1.5 text-[0.65rem] font-semibold tracking-[0.14em] text-primary-foreground/60 uppercase">
                    {stage.status === "current" ? (
                      <Check className="size-3 text-accent" aria-hidden="true" />
                    ) : (
                      <CircleDashed className="size-3" aria-hidden="true" />
                    )}
                    {stage.status === "current" ? t("currentShort") : t("buildingShort")}
                  </span>
                </div>
                <h3 className="mt-auto pt-12 font-serif text-xl font-semibold">{stage.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-primary-foreground/70">{stage.body}</p>
              </li>
            ))}
          </ol>
        </div>

        <div className="mt-10 flex flex-col gap-4 border-t border-primary-foreground/15 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="max-w-3xl text-xs leading-relaxed text-primary-foreground/60">{t("note")}</p>
          <Link href="/process" className="inline-flex shrink-0 items-center gap-2 text-sm font-medium text-accent hover:underline">
            {t("cta")}
            <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}
