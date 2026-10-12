import { type ReactNode, useRef, useState, useTransition } from "react";
import { PostEditorView } from "../components/PostMarkdownEditor";
import { previewPostAction } from "../actions";

export default function usePostPreview(content: string) {
  const [view, setView] = useState<PostEditorView>("write");
  const [previewContent, setPreviewContent] = useState<ReactNode>(null);
  const [previewError, setPreviewError] = useState<string | null>(null);
  const [previewPending, startPreviewTransition] = useTransition();
  const previewRequestId = useRef(0);

  const resetPreview = (): void => {
    previewRequestId.current += 1;
    setView("write");
    setPreviewContent(null);
    setPreviewError(null);
  };

  const changeView = (nextView: string): void => {
    if (nextView !== "write" && nextView !== "preview") {
      return;
    }
    if (nextView === "write") {
      previewRequestId.current += 1;
      setView("write");
      return;
    }

    const requestId = ++previewRequestId.current;
    setView("preview");
    setPreviewContent(null);
    setPreviewError(null);

    startPreviewTransition(async () => {
      try {
        const result = await previewPostAction(content);
        if (requestId !== previewRequestId.current) {
          return;
        }
        if (result.success) {
          setPreviewContent(result.preview);
          return;
        }
        setPreviewError(result.message);
      } catch {
        if (requestId !== previewRequestId.current) {
          return;
        }
        setPreviewError("Unable to render the preview");
      }
    });
  };
  return {
    view,
    previewContent,
    previewError,
    previewPending,
    resetPreview,
    changeView,
  };
}
