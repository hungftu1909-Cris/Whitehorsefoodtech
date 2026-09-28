import Image from "next/image";
import { Link } from "@/i18n/navigation";

type HeroImage = {
  src: string;
  alt: string;
};

export function PlatformPageHero({
  eyebrow,
  title,
  subtitle,
  images,
  imageNote,
  facts,
  action,
}: {
  eyebrow: string;
  title: string;
  subtitle: string;
  images: HeroImage[];
  imageNote: string;
  facts?: { value: string; label: string }[];
  action?: { label: string; href: string };
}) {
  const primary = images[0];
  const secondary = images[1];

  return (
    <section className="border-b border-border bg-muted/25">
      <div className="mx-auto grid min-h-[calc(100svh-5rem)] max-w-7xl grid-cols-1 gap-8 px-4 py-10 sm:px-6 md:py-14 lg:min-h-[42rem] lg:grid-cols-[0.92fr_1.08fr] lg:items-center lg:gap-14 lg:px-8">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold tracking-[0.18em] text-accent uppercase">{eyebrow}</p>
          <h1 className="mt-4 max-w-3xl font-serif text-4xl leading-[1.05] font-semibold tracking-tight text-balance text-foreground sm:text-5xl lg:text-6xl">
            {title}
          </h1>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">{subtitle}</p>
          {facts && facts.length > 0 && (
            <dl className="mt-7 grid grid-cols-2 gap-3 sm:grid-cols-3">
              {facts.map((fact) => (
                <div key={`${fact.value}-${fact.label}`} className="border-l border-accent pl-3">
                  <dt className="font-serif text-2xl font-semibold text-foreground">{fact.value}</dt>
                  <dd className="mt-0.5 text-xs leading-snug text-muted-foreground">{fact.label}</dd>
                </div>
              ))}
            </dl>
          )}
          {action && (
            <Link
              href={action.href}
              className="mt-8 inline-flex min-h-11 cursor-pointer items-center rounded-md bg-primary px-5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
            >
              {action.label}
            </Link>
          )}
        </div>

        <figure>
          <div className="relative aspect-[4/3] overflow-hidden rounded-lg bg-muted shadow-[0_24px_70px_-38px_rgba(59,35,20,0.55)]">
            <Image
              src={primary.src}
              alt={primary.alt}
              fill
              priority
              sizes="(min-width: 1024px) 52vw, 100vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-primary/35 via-transparent to-transparent" aria-hidden="true" />
            {secondary && (
              <div className="absolute right-4 bottom-4 aspect-[4/3] w-[42%] overflow-hidden rounded-md border-2 border-background bg-muted shadow-2xl sm:right-6 sm:bottom-6">
                <Image
                  src={secondary.src}
                  alt={secondary.alt}
                  fill
                  sizes="(min-width: 1024px) 22vw, 42vw"
                  className="object-cover"
                />
              </div>
            )}
          </div>
          <figcaption className="mt-3 text-xs leading-relaxed text-muted-foreground">{imageNote}</figcaption>
        </figure>
      </div>
    </section>
  );
}
