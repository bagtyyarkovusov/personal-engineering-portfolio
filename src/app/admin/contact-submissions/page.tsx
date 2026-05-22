import { getContactSubmissions } from "@/features/contact/queries";
import { ContactSubmissionManager } from "./_client";

export const metadata = { title: "Contact Submissions — Admin" };

export default async function AdminContactSubmissionsPage() {
  const submissions = await getContactSubmissions();
  return <ContactSubmissionManager submissions={submissions} />;
}
