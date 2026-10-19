import { type ReactNode, useRef, useState, useTransition } from "react";
import { previewPostAction } from "../actions";

export default function usePostPreview(content: string) {
  const [previewContent, setPreviewContent] = useState<ReactNode>(null);
  const [previewError, setPreviewError] = useState<string | null>(null);
  const [previewPending, startPreviewTransition] = useTransition();

  const previewRequestId = useRef(0);

  const resetPreview = (): void => {
    previewRequestId.current += 1;
    setPreviewContent(null);
    setPreviewError(null);
  };

  const refreshPreview = (): void => {
    const requestId = ++previewRequestId.current;

    setPreviewError(null);
    // Keep the previous preview visible while rendering its replacement.
    startPreviewTransition(async () => {
      try {
        const result = await previewPostAction(content);

        if (requestId !== previewRequestId.current) {
          return;
        }

        if (result.success) {
          setPreviewContent(result.preview);
        } else {
          setPreviewError(result.message);
        }

      } catch {
        if (requestId !== previewRequestId.current) {
          return;
        }
        setPreviewError("Unable to render the preview")
      }
    });
  };

  return {
    previewContent,
    previewError,
    previewPending,
    resetPreview,
    refreshPreview,
  };
}
