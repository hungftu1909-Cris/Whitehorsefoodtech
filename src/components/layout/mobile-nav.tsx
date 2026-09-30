"use client";

import { useState } from "react";
import { Menu } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { BUYER_NAV, COMPANY_NAV, CUSTOM_SOURCING_HREF, PRODUCT_CATEGORIES, SUPPLIER_HREF } from "@/lib/nav";
import { LocaleSwitcher, type BlogSlugMap } from "./locale-switcher";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { Logo } from "./logo";

const row = "flex min-h-11 cursor-pointer items-center rounded-sm px-2 text-base font-medium hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring/60 focus-visible:outline-none";
const sub = "flex min-h-11 cursor-pointer items-center rounded-sm px-2 text-[0.9375rem] text-muted-foreground hover:bg-muted hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/60 focus-visible:outline-none";

/** Same information architecture as the desktop header, as a sheet. */
export function MobileNav({ blogSlugMap }: { blogSlugMap?: BlogSlugMap }) {
  const t = useTranslations("nav");
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        render={
          <Button variant="ghost" size="icon" className="size-11 cursor-pointer xl:hidden" aria-label={t("openMenu")}>
            <Menu className="size-5" />
          </Button>
        }
      />
      <SheetContent side="right" closeLabel={t("closeMenu")} className="w-full max-w-sm overflow-y-auto">
        <SheetHeader>
          <SheetTitle>
            <Logo />
          </SheetTitle>
        </SheetHeader>
        <nav aria-label={t("primaryLabel")} className="flex flex-col gap-0.5 px-4 pb-8">
          <Accordion>
            <AccordionItem value="products" className="border-none">
              <AccordionTrigger className="min-h-11 cursor-pointer rounded-sm px-2 py-0 text-base font-medium hover:bg-muted hover:no-underline">
                {t("products")}
              </AccordionTrigger>
              <AccordionContent className="flex flex-col gap-0.5 pl-2">
                <Link href="/products" onClick={close} className={sub}>
                  {t("allProducts")}
                </Link>
                <p className="px-2 pt-2 pb-1 text-xs font-medium tracking-[0.14em] text-muted-foreground uppercase">{t("currentPortfolio")}</p>
                {PRODUCT_CATEGORIES.map((c) => (
                  <Link key={c.slug} href={`/products/${c.slug}`} onClick={close} className={sub}>
                    {t(c.key)}
                  </Link>
                ))}
                <Link href={CUSTOM_SOURCING_HREF} onClick={close} className={`${sub} text-accent`}>
                  {t("customSourcing")}
                </Link>
                <Link href="/packaging" onClick={close} className={sub}>
                  {t("packaging")}
                </Link>
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          {BUYER_NAV.map((item) => (
            <Link key={item.href} href={item.href} onClick={close} className={row}>
              {t(item.key)}
            </Link>
          ))}

          <p className="mt-5 px-2 pb-1 text-xs font-medium tracking-[0.14em] text-muted-foreground uppercase">{t("company")}</p>
          {COMPANY_NAV.map((item) => (
            <Link key={item.href} href={item.href} onClick={close} className={row}>
              {t(item.key)}
            </Link>
          ))}

          <Link
            href="/rfq"
            onClick={close}
            className="mt-6 flex min-h-12 cursor-pointer items-center justify-center rounded-sm bg-primary px-4 text-base font-medium text-primary-foreground hover:bg-primary/90 focus-visible:ring-3 focus-visible:ring-ring/60 focus-visible:outline-none"
          >
            {t("requestQuote")}
          </Link>
          <Link href={SUPPLIER_HREF} locale="vi" hrefLang="vi" onClick={close} className={`${sub} mt-1 justify-center`}>
            {t("forSuppliers")}
          </Link>

          <div className="mt-6 flex items-center justify-between border-t border-border pt-4">
            <LocaleSwitcher blogSlugMap={blogSlugMap} />
            <ThemeToggle className="size-11 cursor-pointer" />
          </div>
        </nav>
      </SheetContent>
    </Sheet>
  );
}
