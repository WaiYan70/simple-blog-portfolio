import Dashboard from "@/features/admin/components/Dashboard";
import SideBar from "@/features/admin/components/SideBar";

export default function AdminHomePage() {
  return (
    <main className="grid grid-cols-[220px_1fr] gap-4 p-4">
      <SideBar />
      <Dashboard />
    </main>
  );
}
