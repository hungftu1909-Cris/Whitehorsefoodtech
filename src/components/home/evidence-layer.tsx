import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { hasPublicFile } from "@/lib/media";

// Owner-supplied supply-network image (docs/asset-provenance.md, "Platform
// and supply-network imagery"), always with its representative caption.
const EVIDENCE_IMAGE = "/images/platform/network-air-freight.webp";

/**
 * Evidence is scoped to a request; this section never implies universal
 * certificates or live lot data. One composition (statement + captioned
 * image) followed by ruled evidence rows, not a grid of cards.
 */
export function EvidenceLayer() {
  const t = useTranslations("home.evidence");
  const items = t.raw("items") as { label: string; title: string; body: string }[];
  const showImage = hasPublicFile(EVIDENCE_IMAGE);

  return (
    <section aria-labelledby="evidence-title" className="bg-muted">
      <div className="mx-auto max-w-7xl px-5 py-20 sm:px-6 md:py-32 lg:px-8 lg:py-40">
        <div className="grid gap-12 lg:grid-cols-12 lg:items-end lg:gap-8">
          <div className="lg:col-span-5">
            <p className="text-xs font-medium tracking-[0.24em] text-accent uppercase">{t("eyebrow")}</p>
            <h2 id="evidence-title" className="mt-5 font-serif text-[2.1rem] leading-[1.1] font-medium tracking-[-0.01em] text-balance text-foreground md:text-5xl">
              {t("title")}
            </h2>
            <p className="mt-6 max-w-md text-base leading-relaxed text-pretty text-muted-foreground md:text-[1.0625rem]">{t("subtitle")}</p>
            <Link
              href="/certifications"
              className="mt-8 inline-block text-[0.9375rem] font-medium text-foreground underline decoration-accent/50 underline-offset-8 transition-colors hover:decoration-accent"
            >
              {t("cta")}
            </Link>
          </div>

          {showImage && (
            <figure className="lg:col-span-6 lg:col-start-7">
              <div className="relative aspect-[3/2] overflow-hidden">
                <Image
                  src={EVIDENCE_IMAGE}
                  alt={t("image.alt")}
                  fill
                  sizes="(min-width: 1280px) 36rem, (min-width: 1024px) 48vw, 100vw"
                  className="object-cover object-[65%_50%] saturate-[0.85]"
                />
              </div>
              <figcaption className="mt-3 text-xs leading-relaxed text-muted-foreground">{t("image.caption")}</figcaption>
            </figure>
          )}
        </div>

        <ol className="mt-20 border-b border-foreground/15 md:mt-28">
          {items.map((item) => (
            <li
              key={item.title}
              className="grid gap-2 border-t border-foreground/15 py-7 md:grid-cols-12 md:gap-8 md:py-8"
            >
              <span className="text-xs tracking-[0.2em] text-accent uppercase md:col-span-2 md:pt-2">{item.label}</span>
              <h3 className="font-serif text-2xl leading-snug font-medium text-foreground md:col-span-4">{item.title}</h3>
              <p className="max-w-xl text-base leading-relaxed text-muted-foreground md:col-span-6 md:pt-1">{item.body}</p>
            </li>
          ))}
        </ol>
        <p className="mt-6 max-w-3xl text-sm leading-relaxed text-muted-foreground">{t("note")}</p>
      </div>
    </section>
  );
}
