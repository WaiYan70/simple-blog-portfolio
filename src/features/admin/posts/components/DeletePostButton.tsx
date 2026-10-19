"use client";

import { Button } from "@/components/ui/button";
import { FieldError } from "@/components/ui/field";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { deletePostAction } from "../actions";

type DeletePostButtonProps = {
  postId: string;
  expectedVersion: number;
  title: string;
};

export const DeletePostButton = ({
  postId,
  expectedVersion,
  title,
}: DeletePostButtonProps) => {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const requestDelete = (): void => {
    if (pending) return;

    const confirmed = window.confirm(
      'Permanently delete "' + title + '"? This cannot be undone.',
    );

    if (!confirmed) return;

    setErrorMessage(null);

    startTransition(async () => {
      try {
        const result = await deletePostAction(postId, expectedVersion);
        if (!result.success) {
          setErrorMessage(result.message);
          return;
        }
        router.refresh();
      } catch {
        setErrorMessage("Unable to delete the post. Please try again.");
      }
    });
  };

  return (
    <div>
      <Button
        type="button"
        variant="destructive"
        size="sm"
        disabled={pending}
        onClick={requestDelete}
      >
        {pending ? "Deleting" : "Delete"}
      </Button>
      <FieldError>{errorMessage}</FieldError>
    </div>
  );
};
