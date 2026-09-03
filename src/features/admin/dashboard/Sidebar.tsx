import Profile from "../layout/Profile";
import SearchBar from "../layout/SearchBar";
import Bottom from "../layout/Bottom";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar";
import AdminNav from "../layout/Nav";

export default function SideBar() {
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
