import Link from "next/link";
import { PublicNav } from "@/components/layout/public-nav";
import { SocialFooter } from "@/components/layout/social-footer";
import { Button } from "@/components/ui/button";
import { AnimateIn } from "@/components/animation/animate-in";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <PublicNav />
      {children}

      {/* Secondary CTA — consistent across every public page */}
      <section className="section-primary-tint border-t border-border px-6 py-16 lg:px-16 lg:py-24">
        <div className="mx-auto max-w-3xl space-y-6 text-center">
          <AnimateIn animation="fade-up" duration={700}>
            <h2 className="font-serif text-3xl tracking-tight text-foreground">
              Ready to build something that lasts?
            </h2>
          </AnimateIn>
          <AnimateIn animation="fade-up" duration={700} delay={150}>
            <p className="text-base leading-relaxed text-muted-foreground">
              Let&rsquo;s talk about your project. I&rsquo;ll bring the
              discipline, you bring the vision.
            </p>
          </AnimateIn>
          <AnimateIn animation="fade-up" duration={700} delay={300}>
            <Button asChild size="lg">
              <Link href="/work-with-me">Work With Me</Link>
            </Button>
          </AnimateIn>
        </div>
      </section>

      <SocialFooter />
    </>
  );
}
