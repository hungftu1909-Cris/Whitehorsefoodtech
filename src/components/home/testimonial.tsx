import { useTranslations } from "next-intl";
import { Quote } from "lucide-react";
import { Reveal } from "@/components/ui/reveal";

export function Testimonial() {
  const t = useTranslations("home.testimonial");

  return (
    <section className="mx-auto max-w-4xl px-4 py-20 sm:px-6 md:py-28 lg:px-8">
      <Reveal className="rounded-lg border border-border bg-card p-8 md:p-12">
        <Quote className="size-8 text-accent/50" aria-hidden="true" />
        <blockquote className="mt-4 font-serif text-xl leading-relaxed text-balance text-foreground md:text-2xl">
          &ldquo;{t("quote")}&rdquo;
        </blockquote>
        <footer className="mt-6 text-sm text-muted-foreground">
          <span className="font-medium text-foreground">{t("name")}</span>
          {" — "}
          {t("role")}, {t("company")}
        </footer>
      </Reveal>
    </section>
  );
}
