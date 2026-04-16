import { apiFetch } from "../../../shared/lib/api";

export type Post = {
  id: string;
  author: { name: string; avatar: string };
  preview: string;
  cover: string;
  likes: number;
  comments: number;
  tier: "free" | "paid";
};

type FeedResponse = {
  items: Post[];
  nextCursor?: string;
};

export async function fetchFeed(cursor?: string): Promise<FeedResponse> {
  const response = await apiFetch("/posts", { cursor, limit: 10 });
  const apiData = response.data; 
  const apiPosts = apiData?.posts || [];

  return {
    items: apiPosts.map((apiPost: any) => ({
      id: apiPost.id,
      author: { 
        name: apiPost.author.displayName,
        avatar: apiPost.author.avatarUrl
      },
      preview: apiPost.preview || "",
      cover: apiPost.coverUrl,
      likes: apiPost.likesCount || 0,
      comments: apiPost.commentsCount || 0,
      tier: apiPost.tier,
    })),
    nextCursor: apiData?.nextCursor || undefined,
  };
}