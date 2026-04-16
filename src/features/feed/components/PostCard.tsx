import { View, Text, Image, StyleSheet } from "react-native";
import { tokens } from "../../../shared/lib/theme";
import { Post } from "../api/feedApi";
import LockedPost from "../../../shared/ui/LockedPost";

export default function PostCard({ post }: { post: Post }) {
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
          <Text style={styles.preview} numberOfLines={3}>{post.preview}</Text>
        )}
        
        <View style={styles.footer}>
          <Text style={styles.metrics}>❤️ {post.likes}</Text>
          <Text style={[styles.metrics, { marginLeft: tokens.spacing.md }]}>💬 {post.comments}</Text>
        </View>
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
    padding: tokens.spacing.md,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: tokens.radius.round,
    backgroundColor: tokens.colors.surface,
  },
  authorName: {
    marginLeft: tokens.spacing.sm,
    fontWeight: '600',
    fontSize: 15,
  },
  cover: {
    width: '100%',
    aspectRatio: 16 / 9,
    backgroundColor: tokens.colors.surface,
  },
  content: {
    padding: tokens.spacing.md,
  },
  preview: {
    fontSize: 14,
    color: tokens.colors.primary,
    lineHeight: 20,
  },
  footer: {
    flexDirection: 'row',
    marginTop: tokens.spacing.md,
  },
  metrics: {
    color: tokens.colors.secondary,
    fontSize: 13,
  }
});