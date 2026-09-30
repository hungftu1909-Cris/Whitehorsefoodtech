"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Logo } from "./logo";
import { LocaleSwitcher, type BlogSlugMap } from "./locale-switcher";
import { MobileNav } from "./mobile-nav";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { CUSTOM_SOURCING_HREF, MAIN_NAV, PRODUCT_CATEGORIES } from "@/lib/nav";
import { buttonVariants } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";

export function SiteHeader({ blogSlugMap }: { blogSlugMap?: BlogSlugMap }) {
  const t = useTranslations("nav");

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/60 bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/85">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:h-20 sm:px-6 lg:px-8">
        <Link href="/" className="cursor-pointer">
          <Logo />
        </Link>

        <NavigationMenu className="hidden xl:flex">
          <NavigationMenuList>
            <NavigationMenuItem>
              <Link
                href="/about"
                className={cn(buttonVariants({ variant: "ghost" }), "cursor-pointer")}
              >
                {t("about")}
              </Link>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuTrigger className="cursor-pointer bg-transparent">
                {t("products")}
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid w-64 gap-1">
                  <li>
                    <NavigationMenuLink
                      render={
                        <Link href="/products" className="cursor-pointer font-medium">
                          {t("products")}
                        </Link>
                      }
                    />
                  </li>
                  <li className="px-2 pt-2 pb-1 text-xs font-semibold tracking-[0.16em] text-muted-foreground uppercase">
                    {t("currentPortfolio")}
                  </li>
                  {PRODUCT_CATEGORIES.map((c) => (
                    <li key={c.slug}>
                      <NavigationMenuLink
                        render={
                          <Link href={`/products/${c.slug}`} className="cursor-pointer">
                            {t(c.key)}
                          </Link>
                        }
                      />
                    </li>
                  ))}
                  <li>
                    <NavigationMenuLink
                      render={
                        <Link href={CUSTOM_SOURCING_HREF} className="cursor-pointer font-medium text-accent">
                          {t("customSourcing")}
                        </Link>
                      }
                    />
                  </li>
                  <li className="mt-1 border-t border-border pt-1">
                    <NavigationMenuLink
                      render={
                        <Link href="/packaging" className="cursor-pointer font-medium">
                          {t("packaging")}
                        </Link>
                      }
                    />
                  </li>
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>

            {MAIN_NAV.filter((item) => item.key !== "about" && !item.hasChildren).map(
              (item) => (
                <NavigationMenuItem key={item.href}>
                  <Link
                    href={item.href}
                    className={cn(buttonVariants({ variant: "ghost" }), "cursor-pointer")}
                  >
                    {t(item.key)}
                  </Link>
                </NavigationMenuItem>
              )
            )}
          </NavigationMenuList>
        </NavigationMenu>

        <div className="flex items-center gap-3">
          <LocaleSwitcher className="hidden sm:flex" blogSlugMap={blogSlugMap} />
          <ThemeToggle className="size-11 cursor-pointer" />
          <Link
            href="/rfq"
            className={cn(buttonVariants({ variant: "default" }), "hidden h-10 cursor-pointer px-5 text-[0.875rem] tracking-[0.01em] sm:inline-flex")}
          >
            {t("requestQuote")}
          </Link>
          <MobileNav blogSlugMap={blogSlugMap} />
        </div>
      </div>
    </header>
  );
}
