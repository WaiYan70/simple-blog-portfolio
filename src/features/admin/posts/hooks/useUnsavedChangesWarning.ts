import { useEffect, type RefObject } from "react";

export default function useUnsavedChangesWarning(
  isDirty: boolean,
  saveCompleted: RefObject<boolean>,
) {
  useEffect(() => {
    if (!isDirty) {
      return;
    }
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (saveCompleted.current) {
        return;
      }
      event.preventDefault();
    };
    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [isDirty, saveCompleted]);
}
