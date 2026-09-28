import { Download, FileClock, FileText } from "lucide-react";
import { hasPublicFile } from "@/lib/media";

type DocumentCopy = {
  title: string;
  description: string;
  meta: string;
  cta: string;
};

type CommercialDocumentsLabels = {
  eyebrow: string;
  title: string;
  subtitle: string;
  brochure: DocumentCopy;
  profile: DocumentCopy;
  note: string;
};

const BROCHURE_PATH = "/documents/whitehorse-foodtech-brochure.pdf";
const COMPANY_PROFILE_PATH = "/documents/whitehorse-foodtech-company-profile.pdf";

/** Public commercial-document library with an honest pre-release state. */
export function CommercialDocuments({ labels }: { labels: CommercialDocumentsLabels }) {
  const documents = [
    {
      key: "brochure",
      path: BROCHURE_PATH,
      copy: labels.brochure,
      Icon: FileText,
      available: hasPublicFile(BROCHURE_PATH),
    },
    {
      key: "profile",
      path: COMPANY_PROFILE_PATH,
      copy: labels.profile,
      Icon: FileClock,
      available: hasPublicFile(COMPANY_PROFILE_PATH),
    },
  ];

  return (
    <section id="commercial-documents" className="border-t border-border bg-muted/35">
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 md:py-24 lg:px-8">
        <div className="grid gap-8 border-b border-border pb-9 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
          <div>
            <p className="text-xs font-semibold tracking-[0.2em] text-accent uppercase">{labels.eyebrow}</p>
            <h2 className="mt-3 font-serif text-3xl font-semibold tracking-tight text-balance text-foreground md:text-4xl">
              {labels.title}
            </h2>
          </div>
          <p className="max-w-2xl leading-relaxed text-muted-foreground lg:justify-self-end">{labels.subtitle}</p>
        </div>

        <ul className="mt-8 grid gap-5 md:grid-cols-2">
          {documents.map(({ key, path, copy, Icon, available }) => (
            <li key={key} className="flex min-h-64 flex-col rounded-xl border border-border bg-card p-6 shadow-sm md:p-8">
              <div className="flex items-start justify-between gap-4">
                <span className="flex size-11 items-center justify-center rounded-full bg-muted text-accent">
                  <Icon className="size-5" aria-hidden="true" />
                </span>
                <span className="font-mono text-xs tracking-wide text-muted-foreground">{copy.meta}</span>
              </div>
              <h3 className="mt-8 font-serif text-2xl font-semibold text-foreground">{copy.title}</h3>
              <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground">{copy.description}</p>
              <div className="mt-auto pt-8">
                {available ? (
                  <a
                    href={path}
                    download
                    className="inline-flex cursor-pointer items-center gap-2 text-sm font-semibold text-accent hover:underline"
                  >
                    <Download className="size-4" aria-hidden="true" />
                    {copy.cta}
                  </a>
                ) : (
                  <span aria-disabled="true" className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground">
                    <FileClock className="size-4" aria-hidden="true" />
                    {copy.cta}
                  </span>
                )}
              </div>
            </li>
          ))}
        </ul>

        <p className="mt-6 max-w-4xl text-xs leading-relaxed text-muted-foreground">{labels.note}</p>
      </div>
    </section>
  );
}
