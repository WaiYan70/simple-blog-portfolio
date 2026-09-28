"use client";

import { useRouter } from "next/navigation";
import { startTransition } from "react";

type Props = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function AdminError({ error, reset }: Props) {
  const router = useRouter();

  const retry = (): void => {
    startTransition(() => {
      router.refresh();
      reset();
    });
  };

  return (
    <main className="space-y-4 p-6">
      <h1 className="text-xl font-semibold">
        We could not load this admin page
      </h1>
      <p className="text-sm text-muted-foreground">
        Please try again. If the problem continues, check the server logs.
      </p>
      {error.digest && (
        <p className="text-xs text-muted-foreground">
          Reference: {error.digest}
        </p>
      )}
      <button
        type="button"
        onClick={retry}
        className="rounded-md border px-4 py-2"
      >
        Try Again
      </button>
    </main>
  );
}
