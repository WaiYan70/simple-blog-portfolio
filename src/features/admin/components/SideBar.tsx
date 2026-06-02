import AccountToggle from "./AccountToggle";
import Plan from "./Plan";
import RouteSelect from "./RouteSelect";
import SearchBar from "./SearchBar";

export default function SideBar() {
  return (
    <div>
      <div className="overflow-y-scroll sticky top-4 h-[calc(100vh-32px-48px)]">
        {/* Main Sidebar content */}
        <AccountToggle />
        <SearchBar />
        <RouteSelect />
      </div>
      {/* Plan toggle */}
      <Plan />
    </div>
  );
}
