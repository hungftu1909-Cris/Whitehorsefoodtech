import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import { ArrowLeft } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { getAllSlugs, getPost } from "@/lib/blog";
import { routing, type Locale } from "@/i18n/routing";
import { SmartImage } from "@/components/ui/smart-image";

export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    getAllSlugs(locale as Locale).map((slug) => ({ locale, slug }))
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const post = getPost(locale as Locale, slug);
  if (!post) return {};
  return { title: post.title, description: post.description };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const post = getPost(locale as Locale, slug);
  if (!post) notFound();
  const t = await getTranslations({ locale, namespace: "blog" });
  const tc = await getTranslations({ locale, namespace: "common" });

  return (
    <article className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <Link
        href="/blog"
        className="inline-flex cursor-pointer items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" aria-hidden="true" />
        {t("backToList")}
      </Link>

      <header className="mt-6">
        <p className="text-xs text-muted-foreground">
          {new Date(post.date).toLocaleDateString(locale, {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
          {" · "}
          {post.readingMinutes} {tc("minutesRead")}
          {" · "}
          {post.author}
        </p>
        <h1 className="mt-2 font-serif text-3xl leading-tight font-semibold text-balance text-foreground md:text-4xl">
          {post.title}
        </h1>
      </header>

      <SmartImage
        src={`/images/blog/${post.slug}.jpg`}
        alt={post.title}
        placeholderLabel="Article cover image needed"
        aspect="aspect-[16/9]"
        className="mt-8"
      />

      <div className="prose prose-neutral mt-10 max-w-none prose-headings:font-serif prose-headings:font-semibold prose-a:text-accent prose-a:no-underline hover:prose-a:underline">
        <MDXRemote source={post.content} />
      </div>
    </article>
  );
}

