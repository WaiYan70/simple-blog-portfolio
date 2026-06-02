import Image from "next/image";

export default function AccountToggle() {
  return (
    <div className="border-b mb-4 mt-2 pb-4 border-stone-300">
      <div className="flex gap-4">
        <Image
          width={48}
          height={48}
          src="/profile.jpeg"
          alt="avatar"
          className="rounded-full"
        />
        <div>
          <p className="uppercase text-lg font-semibold tracking-tighter">
            khant wai yan
          </p>
          <p className="text-sm">
            status: <span className="text-primary">dev</span>
          </p>
        </div>
      </div>
    </div>
  );
}
