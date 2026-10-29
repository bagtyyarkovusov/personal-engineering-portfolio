import { PublicNav } from "@/components/layout/public-nav";
import { ContactBlock } from "@/components/layout/contact-block";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <PublicNav />
      <div className="lg:pl-56 print:pl-0">
        {children}
        <ContactBlock />
      </div>
    </>
  );
}
