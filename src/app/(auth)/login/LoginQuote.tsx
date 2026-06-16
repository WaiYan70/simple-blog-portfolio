import { Feather } from "lucide-react";

export default function LoginQuote() {
  return (
    <div className="relative mb-[6.7vh] ml-[8.9%]">
      <span
        className="grid size-15 place-items-center rounded-full bg-white text-primary-dark shadow-accent"
        aria-hidden="true"
      >
        <Feather />
      </span>
      <p className="font-medium mt-5 text-[clamp(1rem,1.25vw,1.25rem)] leading-normal text-white [text-shadow:0_1px_8px_rgb(0_0_0/30%)]">
        Share your ideas.
        <br />
        Inspire the world.
      </p>
    </div>
  );
}
