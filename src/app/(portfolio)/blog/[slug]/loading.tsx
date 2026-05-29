export default function Loading() {
  return (
    <div className="mx-auto max-w-3xl py-10">
      <div className="animate-pulse space-y-4">
        <div className="h-8 w-3/4 bg-muted rounded" />
        <div className="h-4 w-1/2 bg-muted rounded" />
        <div className="h-4 w-full bg-muted rounded" />
        <div className="h-4 w-full bg-muted rounded" />
      </div>
    </div>
  );
}
