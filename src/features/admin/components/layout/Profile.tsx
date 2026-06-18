import { Crown } from "lucide-react";
import Image from "next/image";

export default function Profile() {
  return (
    <div className="border-b mb-4 mt-2 pb-4 border-stone-300">
      <div className="relative w-auto flex items-center gap-2 p-0.5 transition-colors rounded">
        <Image
          fill
          src="/profile.jpeg"
          alt="avatar"
          sizes="32px"
          className="object-cover"
        />
        <div className="text-start">
          <p className="uppercase text-sm font-semibold tracking-tighter">
            khant wai yan
          </p>
          <p className="text-xs block text-stone-500">
            status: <span className="text-primary">dev</span>
          </p>
        </div>
        <Crown size={18} className="absolute right-1 top-1.5" />
      </div>
    </div>
  );
}
