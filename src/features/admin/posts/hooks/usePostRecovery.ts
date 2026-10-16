import {
  type RefObject,
  type SyntheticEvent,
  useEffect,
  useState,
} from "react";
import {
  type PostRecovery,
  postRecoverySchema,
  type RecoveryFields,
  recoveryFieldsSchema,
} from "../schema/post-recovery-schema";

type RecoveryState =
  | { status: "checking" }
  | { status: "ready" }
  | { status: "unavailable" }
  | {
      status: "found";
      raw: string;
      copy: PostRecovery | null;
    };

type UsePostRecoveryOptions = {
  mode: "create" | "edit";
  recoveryKey: string;
  recoveryVersion: number | null;
  originalSlug: string;
  initialSnapshot: string;
  pending: boolean;
  saveCompleted: RefObject<boolean>;
};

export default function usePostRecovery({
  mode,
  recoveryKey,
  recoveryVersion,
  originalSlug,
  initialSnapshot,
  pending,
  saveCompleted,
}: UsePostRecoveryOptions) {
  const [recovery, setRecovery] = useState<RecoveryState>({
    status: "checking",
  });
  const [recoveryMessage, setRecoveryMessage] = useState<string | null>(null);
  const recoveryBlocked =
    recovery.status === "checking" || recovery.status === "found";
  const recoveryCopy = recovery.status === "found" ? recovery.copy : null;
  const recoveryVersionMatches =
    recoveryCopy !== null && recoveryCopy.version === recoveryVersion;
  const recoverySlugMatches =
    recoveryCopy !== null &&
    (mode === "create" || recoveryCopy.fields.slug === originalSlug);
  const canRestoreRecovery = recoveryVersionMatches && recoverySlugMatches;

  useEffect(() => {
    const timer = window.setTimeout(() => {
      let raw: string | null;
      try {
        raw = sessionStorage.getItem(recoveryKey);
      } catch {
        setRecovery({ status: "unavailable" });
        setRecoveryMessage(
          "Local recovery is unavailable. " +
            "You can edit, but keep a separate copy of your work.",
        );
        return;
      }

      if (raw === null) {
        setRecovery({ status: "ready" });
        return;
      }

      let copy: PostRecovery | null = null;

      try {
        const parsed = postRecoverySchema.safeParse(JSON.parse(raw));
        if (parsed.success) {
          copy = parsed.data;
        }
      } catch {
        console.warn(
          "The recovery copy contains invalid JSON. " +
            "The original data has been preserved for manual review.",
        );
      }
      setRecovery({
        status: "found",
        raw,
        copy,
      });
    }, 0);

    return () => {
      window.clearTimeout(timer);
    };
  }, [recoveryKey]);

  const saveRecovery = (event: SyntheticEvent<HTMLFormElement>): void => {
    if (recovery.status !== "ready" || pending || saveCompleted.current) {
      return;
    }

    const formData = new FormData(event.currentTarget);
    const result = recoveryFieldsSchema.safeParse(
      Object.fromEntries(formData.entries()),
    );

    if (!result.success) {
      setRecoveryMessage(
        "Your latest changes exceed the local recovery limits. " +
          "The previous recovery copy was kept. " +
          "Keep a separate copy of your latest work.",
      );
      return;
    }

    try {
      const serializedFields = JSON.stringify(result.data);
      if (serializedFields === initialSnapshot) {
        sessionStorage.removeItem(recoveryKey);
      } else {
        const nextCopy: PostRecovery = {
          version: recoveryVersion,
          fields: result.data,
        };
        sessionStorage.setItem(recoveryKey, JSON.stringify(nextCopy));
      }
    } catch {
      setRecoveryMessage(
        "Your latest changes could not be stored locally. " +
          "Keep a separate copy before leaving.",
      );
    }
  };

  const restoreRecovery = (): RecoveryFields | null => {
    if (
      pending ||
      recovery.status !== "found" ||
      !recovery.copy ||
      !canRestoreRecovery
    ) {
      return null;
    }

    // Preserve the store copy until a successful save or later edit.
    setRecovery({ status: "ready" });
    setRecoveryMessage(
      "Recovery copy restored. It has not been saved to the database.",
    );

    return recovery.copy.fields;
  };

  const discardRecovery = (): void => {
    if (pending || recovery.status !== "found") {
      return;
    }

    const confirmed = window.confirm(
      "Discard this local recovery copy? " +
        "This cannot be undone. Your saved database post will not change.",
    );

    if (!confirmed) {
      return;
    }

    try {
      sessionStorage.removeItem(recoveryKey);
      setRecovery({ status: "ready" });
      setRecoveryMessage("Local recovery copy discarded. You can now edit.");
    } catch {
      // Keep editing blocked until the unresolved copy is removed.
      setRecoveryMessage(
        "The recovery copy could not be discarded. " +
          "It has been preserved. Copy any needed text before leaving.",
      );
    }
  };

  const clearRecoveryAfterSave = () => {
    try {
      sessionStorage.removeItem(recoveryKey);
    } catch {
      console.warn("The post was saved, but local recovery cleanup failed.");
    }
  };

  return {
    recovery,
    recoveryMessage,
    recoveryBlocked,
    recoveryVersionMatches,
    recoverySlugMatches,
    saveRecovery,
    restoreRecovery,
    discardRecovery,
    clearRecoveryAfterSave,
  };
}
