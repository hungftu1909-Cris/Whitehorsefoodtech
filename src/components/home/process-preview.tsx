import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { buttonVariants } from "@/components/ui/button";
import { SectionHeading } from "@/components/sections/section-heading";
import { Reveal } from "@/components/ui/reveal";
import { cn } from "@/lib/utils";

export function ProcessPreview() {
  const t = useTranslations("home.process");
  const steps = t.raw("steps") as { title: string; description: string }[];

  return (
    <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 md:py-28 lg:px-8">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <SectionHeading eyebrow={t("eyebrow")} title={t("title")} subtitle={t("subtitle")} />
        <Link
          href="/process"
          className={cn(buttonVariants({ variant: "outline" }), "cursor-pointer shrink-0")}
        >
          {t("cta")}
        </Link>
      </div>

      <ol className="mt-14 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {steps.map((step, i) => (
          <Reveal
            key={step.title}
            as="li"
            delay={i * 100}
            className="relative border-t-2 border-accent pt-5"
          >
            <span className="font-serif text-3xl font-semibold text-accent/50">
              {String(i + 1).padStart(2, "0")}
            </span>
            <h3 className="mt-2 font-serif text-lg font-semibold text-foreground">
              {step.title}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              {step.description}
            </p>
          </Reveal>
        ))}
      </ol>
    </section>
  );
}
