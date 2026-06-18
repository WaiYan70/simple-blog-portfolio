import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import SideBar from "@/features/admin/components/dashboard/Sidebar";
import TopBar from "@/features/admin/components/layout/TopBar";
import { requireAdmin } from "@/lib/auth/require-admin";

export default async function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // return <div className="text-stone-950 bg-stone-100">{children}</div>;

  await requireAdmin();

  return (
    <div className="theme-admin min-h-screen bg-background text-foreground font-mono">
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
    </div>
  );
}
