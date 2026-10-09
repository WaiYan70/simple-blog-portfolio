import { Textarea } from "@/components/ui/textarea";
import { PostRecovery } from "../schema/post-recovery-schema";
import { Button } from "@/components/ui/button";

type PostRecoveryPanelProps = {
  raw: string;
  copy: PostRecovery | null;
  versionMatches: boolean;
  slugMatches: boolean;
  pending: boolean;
  onRestore: () => void;
  onDiscard: () => void;
};

export function PostRecoveryPanel({
  raw,
  copy,
  versionMatches,
  slugMatches,
  pending,
  onRestore,
  onDiscard,
}: PostRecoveryPanelProps) {
  const canRestore = copy !== null && versionMatches && slugMatches;

  return (
    <section
      aria-labelledby="post-recovery-title"
      className="mb-6 space-y-4 rounded-md border p-4"
    >
      <h2 id="post-recovery-title" className="font-semibold">
        An unsaved recovery copy is available
      </h2>
      <p className="text-sm text-muted-foreground">
        The editor is paused so this copy cannot be overwritten. Review it, then
        restore or discard it.
      </p>
      {!copy ? (
        <p className="text-sm text-destructive">
          This copy could not be validated. You can inspect and copy the
          original data below before discarding it.
        </p>
      ) : !versionMatches ? (
        <p className="text-sm text-muted-foreground">
          This copy belongs to a different saved version. Automatic restore is
          disabled. Copy any text you need before discarding it and continuing
          with the current post.
        </p>
      ) : !slugMatches ? (
        <p className="text-sm text-destructive">
          This copy does not match the current post slug. Automatic restore is
          disabled. Inspect it before discarding.
        </p>
      ) : (
        <p className="text-sm text-muted-foreground">
          This copy matches the current editing session and can be restored.
        </p>
      )}

      <details className="space-y-3">
        <summary className="cursor-pointer text-sm font-medium">
          Review recovery copy
        </summary>
        {copy && (
          <div className="space-y-2">
            <label htmlFor="recovery-markdown" className="text-sm font-medium">
              Recovered Markdown - read only
            </label>
            <Textarea
              id="recovery-markdown"
              value={copy.fields.content}
              readOnly
              spellCheck={false}
              className="min-h-64 font-mono text-sm"
            />
          </div>
        )}

        <div className="space-y-2">
          <label htmlFor="recovery-data" className="text0sm font-medium">
            Complete recovery data - read only
          </label>
          <Textarea
            id="recovery-data"
            value={raw}
            readOnly
            spellCheck={false}
            className="min-h-40 font-mono text-sm"
          />
          <p className="text-xs text-muted-foreground">
            This includes the metadata and article body. Select and copy it to
            keep a separate backup.
          </p>
        </div>
      </details>

      <div className="flex flex-wrap gap-3">
        <Button
          type="button"
          disabled={pending || !canRestore}
          onClick={onRestore}
        >
          Restore copy
        </Button>
        <Button
          type="button"
          variant="outline"
          disabled={pending}
          onClick={onDiscard}
        >
          Discard copy
        </Button>
      </div>
    </section>
  );
}
