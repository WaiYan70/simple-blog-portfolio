import { SquareTerminal } from "lucide-react";

export default function TopBar() {
  return (
    <div className="border-b px-4 mb-4 mt-2 pb-4 border-stone-200">
      <div className="flex items-center justify-between p-0.5">
        <div>
          <div className="text-sm font-bold flex items-center gap-2">
            <SquareTerminal size={18} />
            <p>Good Morning, Khant Wai Yan!</p>
          </div>
          <p className="text-xs block text-stone-500">Tuesday, June 3rd 2026</p>
        </div>
      </div>
    </div>
  );
}
