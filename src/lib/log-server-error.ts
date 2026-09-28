import { NeonDbError } from "@neondatabase/serverless";
import { randomUUID } from "node:crypto";

type Operation =
  | "posts.create"
  | "posts.update"
  | "posts.preview"
  | "posts.list"
  | "posts.read";

export const logServerError = (operation: Operation, error: unknown) => {
  const reference = randomUUID();
  const databaseCode =
    error instanceof NeonDbError &&
    typeof error.code === "string" &&
    /^[A-Z0-9]{5}$/.test(error.code)
      ? error.code
      : undefined;

  console.error(
    JSON.stringify({
      level: "error",
      event: "post_operation_failed",
      operation,
      reference,
      databaseCode,
      timestamp: new Date().toISOString(),
    }),
  );
  return reference;
};
