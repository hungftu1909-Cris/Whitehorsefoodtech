"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Logo } from "./logo";
import { LocaleSwitcher } from "./locale-switcher";
import { MobileNav } from "./mobile-nav";
import { MAIN_NAV, PRODUCT_CATEGORIES } from "@/lib/nav";
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

export function SiteHeader() {
  const t = useTranslations("nav");

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/80 bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/80">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="cursor-pointer">
          <Logo />
        </Link>

        <NavigationMenu className="hidden lg:flex">
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
          <LocaleSwitcher className="hidden sm:flex" />
          <Link
            href="/rfq"
            className={cn(buttonVariants({ variant: "default" }), "hidden cursor-pointer sm:inline-flex")}
          >
            {t("requestQuote")}
          </Link>
          <MobileNav />
        </div>
      </div>
    </header>
  );
}
