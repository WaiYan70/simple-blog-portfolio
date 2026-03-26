"use client";

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

      <button
        onClick={() => reset()}
        className="mt-4 px-4 py-2 bg-primary text-white rounded"
      >
        Try again
      </button>
    </div>
  );
}
