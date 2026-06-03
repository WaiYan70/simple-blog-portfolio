import { Command, Search } from "lucide-react";

export default function SearchBar() {
  return (
    <div className="bg-stone-200 mx-2 relative rounded flex items-center px-2 py-1.5 text-sm">
      <Search className="mr-2" size={16} />
      <input
        type="text"
        placeholder="Search"
        className="w-full bg-transparent placeholder:text-stone-400 focus:outline-none"
      />
      <span className="p-1 text-xs flex items-center gap-0.5 shadow bg-stone-50 rounded absolute right-1.5 top-1/2 -translate-y-1/2 font-bold">
        <Command size={14} />K
      </span>
    </div>
  );
}
