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
import { CUSTOM_SOURCING_HREF, MAIN_NAV, PRODUCT_CATEGORIES } from "@/lib/nav";
import { LocaleSwitcher, type BlogSlugMap } from "./locale-switcher";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { Logo } from "./logo";

export function MobileNav({ blogSlugMap }: { blogSlugMap?: BlogSlugMap }) {
  const t = useTranslations("nav");
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        render={
          <Button variant="ghost" size="icon" className="cursor-pointer xl:hidden" aria-label={t("home")}>
            <Menu className="size-5" />
          </Button>
        }
      />
      <SheetContent side="right" className="w-full max-w-sm">
        <SheetHeader>
          <SheetTitle>
            <Logo />
          </SheetTitle>
        </SheetHeader>
        <nav className="flex flex-col gap-1 px-4">
          <Link
            href="/about"
            onClick={() => setOpen(false)}
            className="cursor-pointer rounded-md px-2 py-2.5 text-base font-medium hover:bg-muted"
          >
            {t("about")}
          </Link>

          <Accordion>
            <AccordionItem value="products" className="border-none">
              <AccordionTrigger className="cursor-pointer rounded-md px-2 py-2.5 text-base font-medium hover:bg-muted hover:no-underline">
                {t("products")}
              </AccordionTrigger>
              <AccordionContent className="flex flex-col gap-1 pl-2">
                <Link
                  href="/products"
                  onClick={() => setOpen(false)}
                  className="cursor-pointer rounded-md px-2 py-2 text-sm font-medium hover:bg-muted"
                >
                  {t("products")}
                </Link>
                <p className="px-2 pt-2 text-[0.65rem] font-semibold tracking-[0.16em] text-muted-foreground uppercase">
                  {t("currentPortfolio")}
                </p>
                {PRODUCT_CATEGORIES.map((c) => (
                  <Link
                    key={c.slug}
                    href={`/products/${c.slug}`}
                    onClick={() => setOpen(false)}
                    className="cursor-pointer rounded-md px-2 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground"
                  >
                    {t(c.key)}
                  </Link>
                ))}
                <Link
                  href={CUSTOM_SOURCING_HREF}
                  onClick={() => setOpen(false)}
                  className="cursor-pointer rounded-md px-2 py-2 text-sm font-medium text-accent hover:bg-muted"
                >
                  {t("customSourcing")}
                </Link>
                <Link
                  href="/packaging"
                  onClick={() => setOpen(false)}
                  className="mt-1 cursor-pointer rounded-md border-t border-border px-2 py-2 pt-3 text-sm font-medium hover:bg-muted"
                >
                  {t("packaging")}
                </Link>
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          {MAIN_NAV.filter((item) => item.key !== "about" && !item.hasChildren).map(
            (item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="cursor-pointer rounded-md px-2 py-2.5 text-base font-medium hover:bg-muted"
              >
                {t(item.key)}
              </Link>
            )
          )}

          <Link
            href="/rfq"
            onClick={() => setOpen(false)}
            className="mt-3 cursor-pointer rounded-md bg-primary px-2 py-2.5 text-center text-base font-medium text-primary-foreground hover:bg-primary/90"
          >
            {t("requestQuote")}
          </Link>

          <div className="mt-6 flex items-center justify-between border-t border-border pt-4">
            <LocaleSwitcher blogSlugMap={blogSlugMap} />
            <ThemeToggle className="cursor-pointer" />
          </div>
        </nav>
      </SheetContent>
    </Sheet>
  );
}
