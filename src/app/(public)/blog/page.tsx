import type { Metadata } from "next";
import Link from "next/link";
import { formatPostDate, getPublishedPosts } from "@/content/blog/loader";
import { JsonLd, breadcrumbListSchema } from "@/components/seo/json-ld";
import { AnimateIn } from "@/components/animation/animate-in";

const DESCRIPTION =
  "Engineering notes by Bagtyyar — process, discipline, and lessons from building and shipping production systems.";

export const metadata: Metadata = {
  title: "Blog",
  description: DESCRIPTION,
  alternates: { canonical: "/blog" },
  openGraph: {
    title: "Blog | Bagtyyar",
    description: DESCRIPTION,
    images: [
      {
        url: `/og?title=${encodeURIComponent("Blog | Bagtyyar")}&description=${encodeURIComponent(DESCRIPTION)}`,
        width: 1200,
        height: 630,
        alt: "Blog | Bagtyyar",
      },
    ],
  },
  twitter: {
    title: "Blog | Bagtyyar",
    description: DESCRIPTION,
    images: [
      `/og?title=${encodeURIComponent("Blog | Bagtyyar")}&description=${encodeURIComponent(DESCRIPTION)}`,
    ],
  },
};

export default function BlogIndexPage() {
  const posts = getPublishedPosts();

  return (
    <main className="mx-auto flex min-h-svh max-w-3xl flex-col gap-8 p-8">
      <JsonLd
        data={breadcrumbListSchema([
          { name: "Home", url: "/" },
          { name: "Blog", url: "/blog" },
        ])}
      />
      <AnimateIn animation="fade-up" duration={700}>
        <header className="space-y-3">
          <h1 className="font-serif text-4xl tracking-tight">Blog</h1>
          <p className="text-muted-foreground">{DESCRIPTION}</p>
        </header>
      </AnimateIn>

      {posts.length === 0 ? (
        <p className="text-muted-foreground">No posts yet.</p>
      ) : (
        <ul className="flex flex-col">
          {posts.map((post, index) => (
            <li key={post.slug}>
              <AnimateIn animation="fade-up" duration={700} delay={index * 80}>
                <Link
                  href={`/blog/${post.slug}`}
                  className="group block border-t border-border py-6 transition-colors duration-200"
                >
                  <div className="flex flex-wrap items-baseline justify-between gap-x-4">
                    <h2 className="font-serif text-2xl tracking-tight text-foreground transition-colors duration-200 group-hover:text-primary">
                      {post.title}
                    </h2>
                  </div>
                  <p className="mt-1 font-mono text-xs text-muted-foreground">
                    {formatPostDate(post.date)} · {post.readingTimeMinutes} min
                    read
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {post.description}
                  </p>
                </Link>
              </AnimateIn>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
