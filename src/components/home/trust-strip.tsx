import { useTranslations } from "next-intl";
import { CheckCircle2 } from "lucide-react";

export function TrustStrip() {
  const t = useTranslations("home.trustStrip");
  const items = t.raw("items") as string[];

  return (
    <section className="border-b border-border bg-background">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((item) => (
            <div key={item} className="flex items-center gap-2.5 text-sm text-muted-foreground">
              <CheckCircle2 className="size-4 shrink-0 text-accent" aria-hidden="true" />
              <span>{item}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
