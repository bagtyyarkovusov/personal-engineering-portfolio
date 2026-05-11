"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FolderKanban,
  Milestone,
  ScrollText,
  BookOpen,
  ScanLine,
  Lock,
  Settings,
  ChevronRight,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar";

/**
 * Navigation item definition.
 */
interface NavItem {
  title: string;
  url: string;
  icon: React.ElementType;
}

/**
 * Navigation data organized into named groups.
 * Each group renders as a SidebarGroup with a label.
 */
const navGroups: { label: string; items: NavItem[] }[] = [
  {
    label: "Dashboard",
    items: [{ title: "Overview", url: "/admin", icon: LayoutDashboard }],
  },
  {
    label: "Content",
    items: [
      { title: "Projects", url: "/admin/projects", icon: FolderKanban },
      { title: "Milestones", url: "/admin/milestones", icon: Milestone },
      { title: "Build Logs", url: "/admin/build-logs", icon: ScrollText },
    ],
  },
  {
    label: "Documentation",
    items: [
      {
        title: "Architecture Decisions",
        url: "/admin/architecture-decisions",
        icon: BookOpen,
      },
      {
        title: "Pipeline Evidence",
        url: "/admin/pipeline-evidence",
        icon: ScanLine,
      },
      {
        title: "Private Rooms",
        url: "/admin/private-rooms",
        icon: Lock,
      },
    ],
  },
];

const secondaryItems: NavItem[] = [
  { title: "Settings", url: "/admin/settings", icon: Settings },
];

/**
 * Determines if a nav item is active based on the current pathname.
 * Root-level items must match exactly; all others use prefix matching
 * so sub-routes stay highlighted.
 */
function isActive(pathname: string, item: NavItem): boolean {
  if (item.url === "/admin") return pathname === item.url;
  return pathname.startsWith(item.url);
}

/**
 * AppSidebar -- shadcn sidebar for the admin dashboard.
 *
 * Navigation items are declared declaratively in `navGroups` and rendered
 * via shadcn Sidebar primitives.  Active-route highlighting is computed
 * from `usePathname()`.
 */
export function AppSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/admin">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <ChevronRight className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">Portfolio</span>
                  <span className="truncate text-xs">Admin</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        {navGroups.map((group) => (
          <SidebarGroup key={group.label}>
            <SidebarGroupLabel>{group.label}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive(pathname, item)}
                      tooltip={item.title}
                    >
                      <Link href={item.url}>
                        <item.icon />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}

        <SidebarSeparator />

        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {secondaryItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive(pathname, item)}
                    tooltip={item.title}
                  >
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link href="/">
                <span>Back to Portfolio</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
