import { Calendar } from "lucide-react";
import AdminClock from "./AdminClock";

export default function TopBar() {
  return (
    <div className="border-b px-4 mb-4 mt-2 pb-4 border-stone-200">
      <div className="flex items-center justify-between p-0.5">
        <AdminClock />
        <button className="flex text-sm items-center gap-2 bg-stone-100 transition-colors hover:bg-sky-100 hover:text-sky-700 px-3 py-1.5 rounded">
          <Calendar />
          <span>Prev 6 months</span>
        </button>
      </div>
    </div>
  );
}
