import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import readingTime from "reading-time";
import type { Locale } from "@/i18n/routing";

const BLOG_DIR = path.join(process.cwd(), "content", "blog");

export type BlogPostMeta = {
  slug: string;
  title: string;
  description: string;
  date: string;
  author: string;
  readingMinutes: number;
};

export type BlogPost = BlogPostMeta & { content: string };

function localeDir(locale: Locale) {
  return path.join(BLOG_DIR, locale);
}

export function getAllSlugs(locale: Locale): string[] {
  const dir = localeDir(locale);
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".mdx"))
    .map((f) => f.replace(/\.mdx$/, ""));
}

export function getAllPosts(locale: Locale): BlogPostMeta[] {
  return getAllSlugs(locale)
    .map((slug) => getPostMeta(locale, slug))
    .filter((p): p is BlogPostMeta => p !== null)
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

function readFile(locale: Locale, slug: string) {
  const filePath = path.join(localeDir(locale), `${slug}.mdx`);
  if (!fs.existsSync(filePath)) return null;
  return fs.readFileSync(filePath, "utf-8");
}

export function getPostMeta(locale: Locale, slug: string): BlogPostMeta | null {
  const raw = readFile(locale, slug);
  if (!raw) return null;
  const { data, content } = matter(raw);
  return {
    slug,
    title: data.title,
    description: data.description,
    date: data.date,
    author: data.author ?? "Whitehorse Foodtech",
    readingMinutes: Math.max(1, Math.round(readingTime(content).minutes)),
  };
}

export function getPost(locale: Locale, slug: string): BlogPost | null {
  const raw = readFile(locale, slug);
  if (!raw) return null;
  const { data, content } = matter(raw);
  return {
    slug,
    title: data.title,
    description: data.description,
    date: data.date,
    author: data.author ?? "Whitehorse Foodtech",
    readingMinutes: Math.max(1, Math.round(readingTime(content).minutes)),
    content,
  };
}
