import { requireAdmin } from "@/lib/auth/require-admin";
import {
  AdminPostListInput,
  adminPostListSchema,
} from "./schema/post-list-schema";
import { logServerError } from "@/lib/log-server-error";
import {
  findAdminPostBySlug,
  listAdminPosts,
  StoredPost,
} from "@/db/repositories/post-repository";
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

export async function getAdminPostPageBySlug(
  slug: string,
): Promise<StoredPost | null> {
  await requireAdmin();

  try {
    return await findAdminPostBySlug(slug);
  } catch (error) {
    const reference = logServerError("posts.read", error);
    throw new Error(`Unable to load posts. Reference ${reference}`);
  }
}
