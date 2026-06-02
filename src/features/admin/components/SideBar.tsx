import Profile from "./Profile";
import RouteSelect from "./RouteSelect";
import SearchBar from "./SearchBar";
import Bottom from "./Bottom";

export default function SideBar() {
  return (
    <div>
      <div className="overflow-y-scroll sticky top-4 h-[calc(100vh-32px-48px)]">
        {/* Main Sidebar content */}
        <Profile />
        <SearchBar />
        <RouteSelect />
      </div>
      {/* Plan toggle */}
      <Bottom />
    </div>
  );
}
