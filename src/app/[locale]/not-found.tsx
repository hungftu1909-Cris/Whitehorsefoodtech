import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function NotFound() {
  const t = useTranslations("notFound");

  return (
    <section className="mx-auto flex max-w-3xl flex-col items-center px-4 py-32 text-center sm:px-6 lg:px-8">
      <p className="font-serif text-6xl font-semibold text-accent">404</p>
      <h1 className="mt-4 font-serif text-2xl font-semibold text-foreground">{t("title")}</h1>
      <p className="mt-2 text-muted-foreground">{t("subtitle")}</p>
      <Link href="/" className={cn(buttonVariants(), "mt-8 cursor-pointer")}>
        {t("cta")}
      </Link>
    </section>
  );
}
