"use client";
import Link from "next/link";
import Image from "next/image";
import { Users, Home, Book } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
} from "@/components/ui/sidebar";

import { useUser } from "@/lib/UserContext";

const adminItems = [
  { title: "Home", url: "/home", icon: Home },
  { title: "Users", url: "/users", icon: Users },
  { title: "Courses", url: "/courses", icon: Book },
];

const professorItems = [
  { title: "Home", url: "/home", icon: Home },
  { title: "Courses", url: "/courses", icon: Book },
];

const studentItems = [
  { title: "Home", url: "/home", icon: Home },
  { title: "My Courses", url: "/my-courses", icon: Book },
];

export function AppSidebar() {
  const { user, loading } = useUser();

  let items: any[] = [];
  if (user?.role?.toLowerCase() === "admin") items = adminItems;
  else if (user?.role?.toLowerCase() === "professor") items = professorItems;
  else if (user?.role?.toLowerCase() === "student") items = studentItems;

  if (loading) {
    return (
      <Sidebar>
        <SidebarHeader>Loading...</SidebarHeader>
      </Sidebar>
    );
  }

  return (
    <Sidebar>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link href="/home" className="flex items-center gap-2">
                <Image src="/school.png" alt="Logo" width={20} height={20} />
                <span className="font-bold">My Academy</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link href={item.url} className="flex items-center gap-2">
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
    </Sidebar>
  );
}
