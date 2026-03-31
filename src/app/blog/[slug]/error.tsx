"use client";

import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div className="mx-auto max-w-3xl py-10 text-center">
      <h1 className="text-2xl font-semibold">Something went wrong</h1>

      <p className="text-muted-foreground mt-2">{error.message}</p>

      <Button onClick={() => reset()} className="mt-4">
        Try again
      </Button>
    </div>
  );
}
