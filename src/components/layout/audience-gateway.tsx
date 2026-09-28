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
      <DialogContent className="max-w-2xl gap-0 overflow-hidden p-0" aria-label="Choose your Whitehorse path">
        <DialogHeader className="border-b border-border px-6 py-6 pr-14 sm:px-8">
          <p className="text-[0.68rem] font-semibold tracking-[0.18em] text-accent uppercase">Whitehorse gateway</p>
          <DialogTitle className="font-serif text-2xl leading-tight sm:text-3xl">
            How would you like to work with us?
          </DialogTitle>
          <DialogDescription className="leading-relaxed">
            Chọn đúng lối vào để xem nội dung và kênh liên hệ phù hợp nhất.
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-1 bg-border gap-px sm:grid-cols-2">
          <Link
            href="/products"
            locale="en"
            onClick={rememberChoice}
            className="group cursor-pointer bg-background p-6 transition-colors hover:bg-muted/50 sm:p-8"
          >
            <div className="flex items-start justify-between gap-4">
              <Building2 className="size-6 text-accent" aria-hidden="true" />
              <ArrowUpRight className="size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden="true" />
            </div>
            <p className="mt-8 font-serif text-xl font-semibold text-foreground">International buyer</p>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">Continue in English · Explore products and request a quote.</p>
          </Link>
          <Link
            href="/suppliers/apply"
            locale="vi"
            onClick={rememberChoice}
            className="group cursor-pointer bg-background p-6 transition-colors hover:bg-muted/50 sm:p-8"
          >
            <div className="flex items-start justify-between gap-4">
              <Sprout className="size-6 text-accent" aria-hidden="true" />
              <ArrowUpRight className="size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden="true" />
            </div>
            <p className="mt-8 font-serif text-xl font-semibold text-foreground">Nhà cung cấp Việt Nam</p>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">Tiếp tục bằng tiếng Việt · Đăng ký năng lực hoặc trao đổi nhanh qua Zalo.</p>
          </Link>
        </div>
      </DialogContent>
    </Dialog>
  );
}
