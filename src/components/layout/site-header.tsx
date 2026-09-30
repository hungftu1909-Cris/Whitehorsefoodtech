"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Logo } from "./logo";
import { LocaleSwitcher, type BlogSlugMap } from "./locale-switcher";
import { MobileNav } from "./mobile-nav";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { BUYER_NAV, COMPANY_NAV, CUSTOM_SOURCING_HREF, PRODUCT_CATEGORIES, SUPPLIER_HREF } from "@/lib/nav";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";

// One quiet style for every top-level item: 44px tall, visible focus ring.
const topItem =
  "inline-flex h-11 cursor-pointer items-center rounded-sm px-3 text-[0.9375rem] font-medium text-foreground/85 transition-colors duration-200 hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/60 focus-visible:outline-none";
const menuLink = "block cursor-pointer rounded-sm px-3 py-2.5 text-[0.9375rem] text-foreground/85 hover:bg-muted hover:text-foreground";

/**
 * Buyer-first header: Products (menu), Quality, How we work and one Company
 * menu, then language, a discreet supplier path (always Vietnamese) and the
 * single primary action. Menus open on click or keyboard as well as hover.
 * No first-visit modal: buyer and supplier paths are inline instead.
 */
export function SiteHeader({ blogSlugMap }: { blogSlugMap?: BlogSlugMap }) {
  const t = useTranslations("nav");

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/60 bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/85">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-5 sm:h-[4.5rem] sm:px-6 lg:px-8">
        <Link href="/" className="shrink-0 cursor-pointer rounded-sm focus-visible:ring-3 focus-visible:ring-ring/60 focus-visible:outline-none">
          <Logo />
        </Link>

        <NavigationMenu className="hidden xl:flex" aria-label={t("primaryLabel")}>
          <NavigationMenuList className="gap-1">
            <NavigationMenuItem>
              <NavigationMenuTrigger className={cn(topItem, "bg-transparent")}>{t("products")}</NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid w-72 gap-0.5 p-1">
                  <li>
                    <NavigationMenuLink render={<Link href="/products" className={cn(menuLink, "font-medium text-foreground")}>{t("allProducts")}</Link>} />
                  </li>
                  <li className="px-3 pt-3 pb-1 text-xs font-medium tracking-[0.14em] text-muted-foreground uppercase">
                    {t("currentPortfolio")}
                  </li>
                  {PRODUCT_CATEGORIES.map((c) => (
                    <li key={c.slug}>
                      <NavigationMenuLink render={<Link href={`/products/${c.slug}`} className={menuLink}>{t(c.key)}</Link>} />
                    </li>
                  ))}
                  <li className="mt-1 border-t border-border pt-1">
                    <NavigationMenuLink render={<Link href={CUSTOM_SOURCING_HREF} className={cn(menuLink, "text-accent")}>{t("customSourcing")}</Link>} />
                  </li>
                  <li>
                    <NavigationMenuLink render={<Link href="/packaging" className={menuLink}>{t("packaging")}</Link>} />
                  </li>
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>

            {BUYER_NAV.map((item) => (
              <NavigationMenuItem key={item.href}>
                <Link href={item.href} className={topItem}>
                  {t(item.key)}
                </Link>
              </NavigationMenuItem>
            ))}

            <NavigationMenuItem>
              <NavigationMenuTrigger className={cn(topItem, "bg-transparent")}>{t("company")}</NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid w-56 gap-0.5 p-1">
                  {COMPANY_NAV.map((item) => (
                    <li key={item.href}>
                      <NavigationMenuLink render={<Link href={item.href} className={menuLink}>{t(item.key)}</Link>} />
                    </li>
                  ))}
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>

        <div className="flex items-center gap-1 sm:gap-2">
          <LocaleSwitcher className="hidden min-[390px]:flex" blogSlugMap={blogSlugMap} />
          <LocaleSwitcher compact className="min-[390px]:hidden" blogSlugMap={blogSlugMap} />
          <Link
            href={SUPPLIER_HREF}
            locale="vi"
            hrefLang="vi"
            className="hidden h-11 cursor-pointer items-center rounded-sm px-3 text-sm text-muted-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline focus-visible:ring-3 focus-visible:ring-ring/60 focus-visible:outline-none lg:inline-flex"
          >
            {t("forSuppliers")}
          </Link>
          <ThemeToggle className="hidden size-11 cursor-pointer sm:inline-flex" />
          <Link
            href="/rfq"
            className="ml-1 hidden h-11 cursor-pointer items-center rounded-sm bg-primary px-5 text-[0.9375rem] font-medium text-primary-foreground transition-colors duration-200 hover:bg-primary/90 focus-visible:ring-3 focus-visible:ring-ring/60 focus-visible:ring-offset-2 focus-visible:outline-none sm:inline-flex"
          >
            {t("requestQuote")}
          </Link>
          <MobileNav blogSlugMap={blogSlugMap} />
        </div>
      </div>
    </header>
  );
}
