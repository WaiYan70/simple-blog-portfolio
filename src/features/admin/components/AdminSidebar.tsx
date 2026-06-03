import Profile from "./Profile";
import SearchBar from "./SearchBar";
import Bottom from "./Bottom";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar";
import AdminNav from "./AdminNav";

export default function AdminSideBar() {
  return (
    <Sidebar variant="inset">
      <SidebarHeader>
        <Profile />
      </SidebarHeader>
      <SidebarContent>
        <SearchBar />
        <AdminNav />
      </SidebarContent>
      <SidebarFooter>
        <Bottom />
      </SidebarFooter>
    </Sidebar>
  );
}
