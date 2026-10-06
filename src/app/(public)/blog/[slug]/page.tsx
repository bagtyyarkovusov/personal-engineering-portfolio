import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  formatPostDate,
  getPublishedPostBySlug,
  getPublishedPosts,
} from "@/content/blog/loader";
import { renderMarkdown } from "@/lib/markdown/renderer";
import { MarkdownContent } from "@/components/ui/markdown-content";
import {
  JsonLd,
  blogPostingSchema,
  breadcrumbListSchema,
} from "@/components/seo/json-ld";
import { AnimateIn } from "@/components/animation/animate-in";

// Only published posts get pages; drafts and unknown slugs 404.
export const dynamicParams = false;

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return getPublishedPosts().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getPublishedPostBySlug(slug);
  if (!post) {
    return { title: "Not Found" };
  }

  const ogTitle = `${post.title} | Bagtyyar`;
  const ogImage = `/og?title=${encodeURIComponent(ogTitle)}&description=${encodeURIComponent(post.description)}`;

  return {
    title: post.title,
    description: post.description,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      type: "article",
      title: ogTitle,
      description: post.description,
      publishedTime: post.date,
      images: [{ url: ogImage, width: 1200, height: 630, alt: ogTitle }],
    },
    twitter: {
      title: ogTitle,
      description: post.description,
      images: [ogImage],
    },
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = getPublishedPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const bodyHtml = await renderMarkdown(post.body);

  return (
    <main className="mx-auto flex min-h-svh max-w-3xl flex-col gap-8 p-8">
      <JsonLd
        data={breadcrumbListSchema([
          { name: "Home", url: "/" },
          { name: "Blog", url: "/blog" },
          { name: post.title, url: `/blog/${post.slug}` },
        ])}
      />
      <JsonLd
        data={blogPostingSchema({
          title: post.title,
          description: post.description,
          slug: post.slug,
          date: post.date,
        })}
      />

      <AnimateIn animation="fade-up" duration={700}>
        <header className="space-y-3">
          <h1 className="font-serif text-4xl tracking-tight text-foreground">
            {post.title}
          </h1>
          <p className="font-mono text-xs text-muted-foreground">
            {formatPostDate(post.date)} · {post.readingTimeMinutes} min read
          </p>
          <p className="text-base text-muted-foreground">{post.description}</p>
        </header>
      </AnimateIn>

      <AnimateIn animation="fade-up" duration={700} delay={100}>
        <article className="border-t border-border pt-8">
          <MarkdownContent html={bodyHtml} />
        </article>
      </AnimateIn>
    </main>
  );
}
