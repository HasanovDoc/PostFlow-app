import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { tokens } from "../../../shared/lib/theme";
import { Post } from "../api/feedApi";
import LockedPost from "../../../shared/ui/LockedPost";
import { useState } from "react";
import LikeButton from "../../../shared/ui/LikeButton";
import { likePost } from "../api/feedApi";
import CommentButton from "@/shared/ui/CommentButton";
import CommentsSection from "./CommentsSection";

export default function PostCard({ post }: { post: Post }) {
  const [showFullText, setShowFullText] = useState(false);
  const [isLiked, setIsLiked] = useState(post.isLiked);
  const [likes, setLikes] = useState(post.likes);
  const [showComments, setShowComments] = useState(false);

  const handleShowMore = () => {
    setShowFullText(true);
  };

  const handleLike = async () => {
    const next = !isLiked;
    setIsLiked(next);
    setLikes(prev => prev + (next ? 1 : -1));
    try {
      await likePost(post.id);
    } catch {
      setIsLiked(!next);
      setLikes(prev => prev - (next ? 1 : -1));
    }
  };

  const postContent = showFullText ? post.body : post.preview;

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Image source={{ uri: post.author.avatar }} style={styles.avatar} />
        <Text style={styles.authorName}>{post.author.name}</Text>
      </View>

      {post.cover && (
        <Image source={{ uri: post.cover }} style={styles.cover} />
      )}

      <View style={styles.content}>
        {post.tier === "paid" ? (
          <LockedPost />
        ) : (
          <>
            <Text style={styles.title}>{post.title}</Text>
            <Text style={styles.preview} numberOfLines={showFullText ? 0 : 3}>
              {postContent}
              {post.preview.length > 100 && !showFullText && (
                <TouchableOpacity onPress={handleShowMore}>
                  <Text style={styles.showMore}>Показать еще</Text>
                </TouchableOpacity>
              )}
            </Text>
          </>
        )}

        <View style={styles.footer}>
          <LikeButton
            count={likes}
            isLiked={isLiked}
            onPress={handleLike}
          />
          <CommentButton 
            count={post.comments} 
            onPress={() => setShowComments(!showComments)} 
          />
        </View>
      </View>
      {showComments && <CommentsSection postId={post.id} totalCount={post.comments} />}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: tokens.colors.background,
    marginBottom: tokens.spacing.sm,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: tokens.spacing.md,
    paddingTop: 12,
    paddingBottom: tokens.spacing.md,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: tokens.radius.round,
    backgroundColor: tokens.colors.surface,
  },
  authorName: {
    marginLeft: 12,
    fontWeight: '700',
    fontSize: 15,
    color: tokens.colors.blackText,
  },
  cover: {
    width: '100%',
    aspectRatio: 16 / 9,
    backgroundColor: tokens.colors.surface,
  },
  content: {
    paddingHorizontal: tokens.spacing.md,
    paddingVertical: tokens.spacing.sm,
  },
  title: {
    fontSize: 18,
    lineHeight: 26,
    fontWeight: 700,
    marginBottom: tokens.spacing.sm,
  },
  preview: {
    fontSize: 15,
    color: tokens.colors.primary,
    lineHeight: 20,
  },
  showMore: {
    color: tokens.colors.brand,
    fontSize: 15,
    fontWeight: 500,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: tokens.spacing.md,
  },
  metrics: {
    color: tokens.colors.secondary,
    fontSize: 13,
  }
});