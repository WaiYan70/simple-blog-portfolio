import { Calendar } from "lucide-react";
import Greeting from "../dashboard/Greeting";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";

export default function TopBar() {
  return (
    <div className="border-b px-4 mb-4 mt-2 pb-4 border-stone-200">
      <div className="flex items-center justify-between p-0.5">
        <div className="flex gap-2">
          <SidebarTrigger />
          <Separator orientation="vertical" />
          <Greeting />
        </div>

        <div className="flex gap-4">
          <ThemeToggle />
          <Button variant="secondary">
            <Calendar />
            <span>Prev 6 months</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
