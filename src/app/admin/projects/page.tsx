import { getAdminProjects } from "@/features/projects/queries";
import { ProjectManager } from "./_client";

export const metadata = { title: "Projects — Admin" };

export default async function AdminProjectsPage() {
  const projects = await getAdminProjects();

  return <ProjectManager projects={projects} />;
}
