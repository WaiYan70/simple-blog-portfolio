import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-3xl py-10 text-center">
      <h1 className="text-2xl font-semibold">Post not found</h1>
      <p className="text-muted-foreground mt-2">
        The blog post you are looking for does not exist.
      </p>

      <Link href="/blog" className="mt-4 inline-block text-primary underline">
        Back to blog
      </Link>
    </div>
  );
}
