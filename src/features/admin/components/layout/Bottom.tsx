import { LogOut } from "lucide-react";

export default function Bottom() {
  return (
    <div className="sticky top-[calc(100vh-48px-16px)] flex flex-col justify-end h-12 border-t px-2 border-stone-300 text-xs">
      <div className="flex items-center justify-between">
        <div>
          <p className="font-bold">Really?</p>
          <p className="text-stone-500">Are you sure?</p>
        </div>
        <button className="flex items-center justify-start gap-2 px-2 py-1.5 font-medium bg-destructive/15 transition-colors rounded">
          <LogOut size={14} className="text-destructive/60" />
          <span className="text-xs text-destructive/60">Log out</span>
        </button>
      </div>
    </div>
  );
}
