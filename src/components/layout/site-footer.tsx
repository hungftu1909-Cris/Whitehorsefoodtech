import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Logo } from "./logo";
import { MAIN_NAV, PRODUCT_CATEGORIES } from "@/lib/nav";
import { siteConfig } from "@/lib/site";

export function SiteFooter() {
  const t = useTranslations("nav");
  const tf = useTranslations("footer");

  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-primary text-primary-foreground">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-10 md:grid-cols-4">
          <div className="col-span-2 md:col-span-1">
            <Logo className="text-primary-foreground [&_.text-muted-foreground]:text-primary-foreground/70" />
            <p className="mt-4 max-w-xs text-sm text-primary-foreground/70">
              {tf("tagline")}
            </p>
          </div>

          <div>
            <h3 className="text-xs font-semibold tracking-wide text-primary-foreground/60 uppercase">
              {tf("quickLinksTitle")}
            </h3>
            <ul className="mt-4 space-y-2.5 text-sm">
              {[{ href: "/about", key: "about" as const }, ...MAIN_NAV.filter((i) => !i.hasChildren && i.key !== "about")].map(
                (item) => (
                  <li key={item.href}>
                    <Link href={item.href} className="cursor-pointer text-primary-foreground/80 hover:text-primary-foreground">
                      {t(item.key)}
                    </Link>
                  </li>
                )
              )}
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-semibold tracking-wide text-primary-foreground/60 uppercase">
              {tf("productsTitle")}
            </h3>
            <ul className="mt-4 space-y-2.5 text-sm">
              {PRODUCT_CATEGORIES.map((c) => (
                <li key={c.slug}>
                  <Link
                    href={`/products/${c.slug}`}
                    className="cursor-pointer text-primary-foreground/80 hover:text-primary-foreground"
                  >
                    {t(c.key)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-semibold tracking-wide text-primary-foreground/60 uppercase">
              {tf("addressLabel")}
            </h3>
            <ul className="mt-4 space-y-2.5 text-sm text-primary-foreground/80">
              <li>{siteConfig.address}</li>
              <li>
                <a href={`tel:${siteConfig.phone}`} className="cursor-pointer hover:text-primary-foreground">
                  {siteConfig.phone}
                </a>
              </li>
              <li>
                <a href={`mailto:${siteConfig.email}`} className="cursor-pointer hover:text-primary-foreground">
                  {siteConfig.email}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-4 border-t border-primary-foreground/15 pt-6 text-xs text-primary-foreground/60 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {siteConfig.name}. {tf("rights")}
          </p>
          <div className="flex gap-5">
            <Link href="/privacy" className="cursor-pointer hover:text-primary-foreground">
              {tf("privacy")}
            </Link>
            <Link href="/terms" className="cursor-pointer hover:text-primary-foreground">
              {tf("terms")}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
