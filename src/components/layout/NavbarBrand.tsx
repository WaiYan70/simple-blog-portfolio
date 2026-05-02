import Link from "next/link";

export function NavbarBrand() {
  return (
    <Link
      href="/"
      className="text-base font-semibold tracking-tight hover:opacity-80"
    >
      <span className="text-primary">Khant</span>.dev
    </Link>
  );
}
