import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import SideBar from "@/features/admin/components/dashboard/Sidebar";
import TopBar from "@/features/admin/components/layout/TopBar";

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // return <div className="text-stone-950 bg-stone-100">{children}</div>;
  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 60)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <SideBar />
      <SidebarInset className="md:mt-4">
        <header>
          <TopBar />
        </header>
        <div>{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
