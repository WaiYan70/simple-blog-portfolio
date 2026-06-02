import { PanelRight } from "lucide-react";
import Image from "next/image";

export default function Profile() {
  return (
    <div className="border-b mb-4 mt-2 pb-4 border-stone-300">
      <div className="flex items-center gap-2 p-0.5 rounded transition-colors relative w-full">
        <Image
          width={32}
          height={32}
          src="/profile.jpeg"
          alt="avatar"
          className="rounded-full"
        />
        <div className="text-start">
          <p className="uppercase text-sm font-semibold tracking-tighter">
            khant wai yan
          </p>
          <p className="text-xs block text-stone-500">
            status: <span className="text-primary">dev</span>
          </p>
        </div>
        <PanelRight size={18} className="absolute right-1 top-1.5" />
      </div>
    </div>
  );
}
