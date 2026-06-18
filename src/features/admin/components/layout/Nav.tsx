"use client";

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { BookMarked, Home, LayoutGrid } from "lucide-react";
import Link from "next/link";

const routes = {
  main: [
    {
      category: "Main",
      name: "Dashboard",
      href: "/admin",
      icon: Home,
    },
  ],
  post: [
    {
      category: "Posts",
      name: "All Posts",
      href: "/admin/posts",
      icon: BookMarked,
    },
    {
      category: "Posts",
      name: "Edit Posts",
      href: "/admin/posts",
      icon: LayoutGrid,
    },
  ],
  project: [
    {
      category: "Projects",
      name: "All Projects",
      href: "/admin/projects",
      icon: BookMarked,
    },
    {
      category: "Projects",
      name: "Edit Projects",
      href: "/admin/projects",
      icon: LayoutGrid,
    },
  ],
};

export default function AdminNav() {
  return (
    <>
      <AdminNavMain />
      <AdminNavPost />
      <AdminNavProject />
    </>
  );
}

function AdminNavMain() {
  return (
    <SidebarGroup>
      <SidebarGroupLabel>Main</SidebarGroupLabel>
      <SidebarMenu>
        {routes.main.map((route) => (
          <SidebarMenuItem key={route.name}>
            <SidebarMenuButton asChild>
              <Link href={route.href}>
                <route.icon />
                <span>{route.name}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}

function AdminNavPost() {
  return (
    <SidebarGroup>
      <SidebarGroupLabel>Main</SidebarGroupLabel>
      <SidebarMenu>
        {routes.post.map((route) => (
          <SidebarMenuItem key={route.name}>
            <SidebarMenuButton asChild>
              <Link href={route.href}>
                <route.icon />
                <span>{route.name}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}

function AdminNavProject() {
  return (
    <SidebarGroup>
      <SidebarGroupLabel>Main</SidebarGroupLabel>
      <SidebarMenu>
        {routes.project.map((route) => (
          <SidebarMenuItem key={route.name}>
            <SidebarMenuButton asChild>
              <Link href={route.href}>
                <route.icon />
                <span>{route.name}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
