import { useTranslations } from "next-intl";
import { ShieldCheck } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function CertificationsTeaser() {
  const t = useTranslations("home.certifications");

  return (
    <section className="border-t border-border bg-muted/30">
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-4 px-4 py-16 text-center sm:px-6 lg:px-8">
        <div className="flex size-12 items-center justify-center rounded-full bg-accent/15 text-accent">
          <ShieldCheck className="size-6" aria-hidden="true" />
        </div>
        <p className="text-xs font-semibold tracking-[0.2em] text-accent uppercase">
          {t("eyebrow")}
        </p>
        <h2 className="font-serif text-2xl font-semibold text-balance text-foreground md:text-3xl">
          {t("title")}
        </h2>
        <p className="max-w-xl text-sm text-muted-foreground">{t("subtitle")}</p>
        <Link href="/certifications" className={cn(buttonVariants({ variant: "outline" }), "mt-2 cursor-pointer")}>
          {t("cta")}
        </Link>
      </div>
    </section>
  );
}
