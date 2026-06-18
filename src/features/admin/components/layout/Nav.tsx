"use client";

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { BookMarked, Home, LayoutGrid, Plus } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navSections = [
  {
    label: "Main",
    items: [
      {
        name: "Dashboard",
        href: "/admin",
        icon: Home,
        active: (pathname: string) => pathname === "/admin",
      },
    ],
  },
  {
    label: "Posts",
    items: [
      {
        name: "All Posts",
        href: "/admin/posts",
        icon: BookMarked,
        active: (pathname: string) =>
          pathname === "/admin/posts" ||
          (pathname.startsWith("/admin/posts/") &&
            pathname !== "/admin/posts/new"),
      },
      {
        name: "New Post",
        href: "/admin/posts/new",
        icon: Plus,
        active: (pathname: string) => pathname === "/admin/posts/new",
      },
    ],
  },
  {
    label: "Projects",
    items: [
      {
        name: "All Projects",
        href: "/admin/projects",
        icon: LayoutGrid,
        active: (pathname: string) =>
          pathname === "/admin/projects" ||
          (pathname.startsWith("/admin/projects/") &&
            pathname !== "/admin/projects/new"),
      },
      {
        name: "New Project",
        href: "/admin/projects/new",
        icon: Plus,
        active: (pathname: string) => pathname === "/admin/projects/new",
      },
    ],
  },
];

// export default function AdminNav() {
//   return (
//     <>
//       <AdminNavMain />
//       <AdminNavPost />
//       <AdminNavProject />
//     </>
//   );
// }

// function AdminNavMain() {
//   const pathname = usePathname();

//   return (
//     <>
//       {navSections.map((section) => (
//         <SidebarGroup key={section.label}>
//           <SidebarGroupLabel>{section.label}</SidebarGroupLabel>
//           <SidebarMenu>
//             {section.items.map((item) => {
//               const Icon = item.icon;
//               const isActive = item.active(pathname);

//               return (
//                 <SidebarMenuItem key={item.href}>
//                   <SidebarMenuButton isActive={isActive} asChild>
//                     <Link href={item.href}>
//                       <Icon />
//                       <span>{item.name}</span>
//                     </Link>
//                   </SidebarMenuButton>
//                 </SidebarMenuItem>
//               );
//             })}
//           </SidebarMenu>
//         </SidebarGroup>
//       ))}
//     </>
//   );
// }

// function AdminNavPost() {
//   return (
//     <SidebarGroup>
//       <SidebarGroupLabel>Main</SidebarGroupLabel>
//       <SidebarMenu>
//         {routes.post.map((route) => (
//           <SidebarMenuItem key={route.name}>
//             <SidebarMenuButton asChild>
//               <Link href={route.href}>
//                 <route.icon />
//                 <span>{route.name}</span>
//               </Link>
//             </SidebarMenuButton>
//           </SidebarMenuItem>
//         ))}
//       </SidebarMenu>
//     </SidebarGroup>
//   );
// }

// function AdminNavProject() {
//   return (
//     <SidebarGroup>
//       <SidebarGroupLabel>Main</SidebarGroupLabel>
//       <SidebarMenu>
//         {routes.project.map((route) => (
//           <SidebarMenuItem key={route.name}>
//             <SidebarMenuButton asChild>
//               <Link href={route.href}>
//                 <route.icon />
//                 <span>{route.name}</span>
//               </Link>
//             </SidebarMenuButton>
//           </SidebarMenuItem>
//         ))}
//       </SidebarMenu>
//     </SidebarGroup>
//   );
// }

export default function AdminNav() {
  const pathname = usePathname();

  return (
    <>
      {navSections.map((section) => (
        <SidebarGroup key={section.label}>
          <SidebarGroupLabel>{section.label}</SidebarGroupLabel>
          <SidebarMenu>
            {section.items.map((item) => {
              const Icon = item.icon;
              const isActive = item.active(pathname);

              return (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton isActive={isActive} asChild>
                    <Link href={item.href}>
                      <Icon />
                      <span>{item.name}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarGroup>
      ))}
    </>
  );
}
