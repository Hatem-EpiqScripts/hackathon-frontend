"use client";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { NavBar } from "@/components/NavBar";
import { usePathname } from "next/navigation";

export function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const isAuthPage =
    pathname.startsWith("/login") || pathname.startsWith("/register");

  if (isAuthPage) {
    return <>{children}</>; // Don't show sidebar/nav
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="w-full">
        <NavBar />
        <div className="px-4">{children}</div>
      </main>
    </SidebarProvider>
  );
}
