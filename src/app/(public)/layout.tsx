import { PublicNav } from "@/components/layout/public-nav";
import { ContactBlock } from "@/components/layout/contact-block";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-md focus:bg-foreground focus:px-4 focus:py-2 focus:text-background"
      >
        Skip to content
      </a>
      <PublicNav />
      <div className="lg:pl-56 print:pl-0">
        <div id="main" tabIndex={-1} className="outline-none">
          {children}
        </div>
        <ContactBlock />
      </div>
    </>
  );
}
