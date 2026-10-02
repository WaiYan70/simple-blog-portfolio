import { requireAdmin } from "@/lib/auth/require-admin";
import {
  AdminPostListInput,
  adminPostListSchema,
} from "./schema/post-list-schema";
import { logServerError } from "@/lib/log-server-error";
import { listAdminPosts } from "@/db/repositories/post-repository";
import { AdminPostListItem, PostPageResult } from "@/types/post";

export async function getAdminPostPage(
  input: AdminPostListInput = {},
): Promise<PostPageResult<AdminPostListItem>> {
  await requireAdmin();
  const options = adminPostListSchema.parse(input);
  try {
    return await listAdminPosts(options);
  } catch (error) {
    const reference = logServerError("posts.list", error);
    throw new Error(`Unable to load posts. Reference ${reference}`);
  }
}
