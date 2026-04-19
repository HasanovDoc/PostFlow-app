import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { tokens } from "../../../shared/lib/theme";
import { Post } from "../api/feedApi";
import LockedPost from "../../../shared/ui/LockedPost";
import { useState } from "react";
import LikeButton from "../../../shared/ui/LikeButton";
import { likePost } from "../api/feedApi";
import CommentButton from "@/shared/ui/CommentButton";
import { useNavigation } from "@react-navigation/native";

export default function PostCard({ post }: { post: Post }) {
  const navigation = useNavigation<any>();
  const [showFullText, setShowFullText] = useState(false);
  const [isLiked, setIsLiked] = useState(post.isLiked);
  const [likes, setLikes] = useState(post.likes);

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

  const handleCommentPress = () => {
    navigation.navigate("Comments", {
      post: post, 
    });
  };

  const postContent = showFullText ? post.body : post.preview;

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Image source={{ uri: post.author.avatar }} style={styles.avatar} />
        <Text style={styles.authorName}>{post.author.name}</Text>
      </View>

      {post.cover && post.tier != "paid" ?(
        <Image source={{ uri: post.cover }} style={styles.cover} />
      ) : (
        <LockedPost />
      )}

      <View style={styles.content}>
        {post.tier === "paid" ? (
          <View>
            <View style={styles.skeletonTextContainer}>
              <View style={[styles.skeletonFirstLine, { width: '50%' }]} />
              <View style={[styles.skeletonSecondLine, { width: '100%' }]} />
            </View>
          </View>
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

        {post.tier != "paid" && (
          <View style={styles.footer}>
            <LikeButton
              count={likes}
              isLiked={isLiked}
              onPress={handleLike}
            />
            <CommentButton 
              count={post.comments} 
              onPress={handleCommentPress} 
            />
          </View>
        )}
      </View>
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
  skeletonTextContainer: {
    marginTop: tokens.spacing.sm,
    marginBottom: tokens.spacing.xs,
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacing.xs,
  },
  skeletonFirstLine: {
    width: '50%',
    height: 26,
    backgroundColor: tokens.colors.surface,
    borderRadius: 22,
  },
  skeletonSecondLine: {
    width: '100%',
    height: 40,
    backgroundColor: tokens.colors.surface,
    borderRadius: 22,
  },
});