import Link from "next/link";

const Navbar = () => {
  return (
    <div className="flex flex-col items-center justify-center">
      <Link href="/">Index</Link>
      <Link href="/blog">Blogs</Link>
      <Link href="/project">Projects</Link>
    </div>
  );
};

export default Navbar;
