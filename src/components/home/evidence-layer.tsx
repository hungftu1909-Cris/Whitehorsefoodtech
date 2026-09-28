import { ArrowRight, FileCheck2, FlaskConical, MapPinned, ShieldCheck } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

const icons = [MapPinned, FlaskConical, ShieldCheck, FileCheck2];

/** Evidence is scoped to a request; this section never implies universal certificates or live lot data. */
export function EvidenceLayer() {
  const t = useTranslations("home.evidence");
  const items = t.raw("items") as { label: string; title: string; body: string }[];

  return (
    <section className="border-b border-border bg-background">
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 md:py-28 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20">
          <div>
            <p className="text-xs font-semibold tracking-[0.22em] text-accent uppercase">{t("eyebrow")}</p>
            <h2 className="mt-4 max-w-xl font-serif text-3xl leading-tight font-semibold tracking-tight text-balance text-foreground md:text-5xl">
              {t("title")}
            </h2>
            <p className="mt-5 max-w-lg leading-relaxed text-muted-foreground">{t("subtitle")}</p>
            <Link href="/certifications" className="mt-7 inline-flex items-center gap-2 text-sm font-medium text-accent hover:underline">
              {t("cta")}
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </div>

          <ol className="grid gap-4 sm:grid-cols-2">
            {items.map((item, index) => {
              const Icon = icons[index];
              return (
                <li key={item.title} className="rounded-xl border border-border bg-card p-6 shadow-[0_18px_50px_-40px_rgba(36,21,5,0.45)]">
                  <div className="flex items-center justify-between gap-4">
                    <span className="flex size-10 items-center justify-center rounded-full bg-muted text-accent">
                      <Icon className="size-5" aria-hidden="true" />
                    </span>
                    <span className="text-[0.65rem] font-semibold tracking-[0.15em] text-muted-foreground uppercase">{item.label}</span>
                  </div>
                  <h3 className="mt-8 font-serif text-xl font-semibold text-foreground">{item.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.body}</p>
                </li>
              );
            })}
          </ol>
        </div>
        <p className="mt-8 border-l-2 border-accent pl-4 text-xs leading-relaxed text-muted-foreground">{t("note")}</p>
      </div>
    </section>
  );
}
