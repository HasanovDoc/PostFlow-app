import { apiFetch } from "../../../shared/lib/api";

export type Post = {
  id: string;
  author: { name: string; avatar: string };
  title: string;
  body: string;
  preview: string;
  cover: string;
  likes: number;
  comments: number;
  isLiked: boolean;
  tier: "free" | "paid";
};

type FeedResponse = {
  items: Post[];
  nextCursor?: string;
};

export type Comment = {
  id: string;
  postId: string;
  text: string;
  author: { name: string; avatar: string };
  createdAt: string;
};

export async function fetchFeed(cursor?: string): Promise<FeedResponse> {
  const response = await apiFetch("/posts", {
    params: { cursor, limit: 10 }
  });
  const apiData = response.data; 
  const apiPosts = apiData?.posts || [];

  return {
    items: apiPosts.map((apiPost: any) => ({
      id: apiPost.id,
      author: { 
        name: apiPost.author.displayName,
        avatar: apiPost.author.avatarUrl
      },
      title: apiPost.title || "",
      body: apiPost.body || "",
      preview: apiPost.preview || "",
      cover: apiPost.coverUrl,
      likes: apiPost.likesCount || 0,
      comments: apiPost.commentsCount || 0,
      isLiked: apiPost.isLiked || false,
      tier: apiPost.tier,
    })),
    nextCursor: apiData?.nextCursor || undefined,
  };
}

export async function likePost(postId: string): Promise<void> {
  await apiFetch(`/posts/${postId}/like`, {
    method: 'POST'
  });
}

export async function fetchComments(postId: string, cursor?: string) {
  const response = await apiFetch(`/posts/${postId}/comments`, {
    params: { cursor, limit: 10 }
  });
  return {
    items: response.data.comments.map((c: any) => ({
      id: c.id,
      postId: c.postId,
      text: c.text,
      author: {
        name: c.author.displayName,
        avatar: c.author.avatarUrl
      },
      createdAt: c.createdAt
    })),
    nextCursor: response.data.nextCursor
  };
}

export async function sendComment(postId: string, text: string) {
  return apiFetch(`/posts/${postId}/comments`, {
    method: 'POST',
    body: { text }
  });
}