"use client";

import { useEffect, useState } from "react";
import { ArrowUpRight, Building2, Sprout } from "lucide-react";
import { Link, usePathname } from "@/i18n/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const STORAGE_KEY = "whitehorse-audience-selected";

function readChoice() {
  try {
    return window.localStorage?.getItem(STORAGE_KEY) ?? null;
  } catch {
    return null;
  }
}

function writeChoice(value: string) {
  try {
    window.localStorage?.setItem(STORAGE_KEY, value);
  } catch {
    // Some privacy modes disable storage. The gateway still works for the
    // current page lifecycle; it may simply reappear after a full reload.
  }
}

/**
 * One-time platform entry: the visitor chooses a side of the platform, and
 * the side sets the language (buyers → English, Vietnamese suppliers →
 * Vietnamese, with Zalo on the supplier page). The copy is bilingual on
 * purpose because it appears before a locale has been chosen. The proof
 * line uses current facts only (claim registry rows 3, 4 and 9).
 */
export function AudienceGateway() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (pathname === "/" && !readChoice()) {
      const frame = window.requestAnimationFrame(() => setOpen(true));
      return () => window.cancelAnimationFrame(frame);
    }
  }, [pathname]);

  function rememberChoice() {
    writeChoice("1");
    setOpen(false);
  }

  function handleOpenChange(nextOpen: boolean) {
    if (!nextOpen) {
      writeChoice("dismissed");
    }
    setOpen(nextOpen);
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-h-[calc(100dvh-2rem)] gap-0 sm:max-w-2xl overflow-y-auto p-0" aria-label="Enter the Whitehorse platform">
        <DialogHeader className="border-b border-border px-6 py-6 pr-14 sm:px-8 sm:py-7">
          <p className="text-[0.68rem] font-semibold tracking-[0.18em] text-accent uppercase">Enter the Whitehorse platform</p>
          <DialogTitle className="font-serif text-2xl leading-tight text-balance sm:text-3xl">
            Premium ingredients from Vietnam. One qualified supply workflow.
          </DialogTitle>
          <DialogDescription lang="vi" className="leading-relaxed">
            Nguyên liệu cao cấp từ Việt Nam · Một quy trình cung ứng được thẩm định.
          </DialogDescription>
          <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
            <span className="font-semibold text-foreground">Current · Hiện tại:</span> 29 defined core SKUs · 50+ screened suppliers · 10+ market relationships
          </p>
        </DialogHeader>
        <div className="grid grid-cols-1 gap-px bg-border sm:grid-cols-2">
          <Link
            href="/products"
            locale="en"
            lang="en"
            onClick={rememberChoice}
            className="group cursor-pointer bg-background p-6 transition-colors hover:bg-muted/50 sm:p-8"
          >
            <div className="flex items-start justify-between gap-4">
              <Building2 className="size-6 text-accent" aria-hidden="true" />
              <ArrowUpRight className="size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden="true" />
            </div>
            <p className="mt-6 text-[0.65rem] font-semibold tracking-[0.16em] text-muted-foreground uppercase sm:mt-8">Global buyers</p>
            <p className="mt-1 font-serif text-xl font-semibold text-foreground">Source qualified Vietnamese ingredients.</p>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">Continue in English · Current portfolio, custom sourcing and quote requests.</p>
          </Link>
          <Link
            href="/suppliers/apply"
            locale="vi"
            lang="vi"
            onClick={rememberChoice}
            className="group cursor-pointer bg-background p-6 transition-colors hover:bg-muted/50 sm:p-8"
          >
            <div className="flex items-start justify-between gap-4">
              <Sprout className="size-6 text-accent" aria-hidden="true" />
              <ArrowUpRight className="size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden="true" />
            </div>
            <p className="mt-6 text-[0.65rem] font-semibold tracking-[0.16em] text-muted-foreground uppercase sm:mt-8">Nhà cung cấp Việt Nam</p>
            <p className="mt-1 font-serif text-xl font-semibold text-foreground">Tham gia mạng lưới nguồn cung được thẩm định.</p>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">Tiếp tục bằng tiếng Việt · Đăng ký năng lực hoặc trao đổi nhanh qua Zalo.</p>
          </Link>
        </div>
      </DialogContent>
    </Dialog>
  );
}
