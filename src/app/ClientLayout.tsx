"use client";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/ui/AppSidebar";
import { NavBar } from "@/components/ui/NavBar";
import { usePathname } from "next/navigation";
import { UserProvider } from "@/lib/UserContext";

export function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const isAuthPage =
    pathname.startsWith("/login") || pathname.startsWith("/register");

  if (isAuthPage) {
    return <>{children}</>; // Don't show sidebar/nav
  }

  return (
    <UserProvider>
      <SidebarProvider>
        <AppSidebar />
        <main className="w-full">
          <NavBar />
          <div className="px-4">{children}</div>
        </main>
      </SidebarProvider>
    </UserProvider>
  );
}
