"use client";

import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { AppSidebar } from "./admin-sidebar";

/**
 * AdminShell -- client component that wires up the shadcn sidebar layout.
 *
 * Must be rendered inside a server layout that has already called
 * `requireAdmin()`.  Provides:
 *  - SidebarProvider (global sidebar state + keyboard shortcut Cmd+B)
 *  - AppSidebar with declarative nav groups
 *  - SidebarInset with a minimal top bar (trigger + "Admin" label)
 *  - Children rendered below the bar
 */
export function AdminShell({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider defaultOpen={true}>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-10 shrink-0 items-center gap-2 border-b border-border px-6">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="h-4" />
          <span className="text-xs font-medium text-muted-foreground">
            Admin
          </span>
        </header>
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}
