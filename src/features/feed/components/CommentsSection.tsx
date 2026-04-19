import React, { useEffect, useState, useMemo, useCallback, useRef } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Image, TouchableOpacity, FlatList } from 'react-native';
import { tokens } from '../../../shared/lib/theme';
import { fetchComments, Comment, sendComment } from '../api/feedApi';
import Input from '../../../shared/ui/Input';
import { WS_URL } from '../../../shared/lib/api';

type SortOrder = 'new' | 'old';

export default function CommentsSection({ postId, totalCount }: { postId: string, totalCount: number }) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [commentText, setCommentText] = useState('');
  const [sortOrder, setSortOrder] = useState<SortOrder>('new');
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const ws = useRef<WebSocket | null>(null);

  useEffect(() => {
    const loadComments = async () => {
      try {
        const data = await fetchComments(postId);
        setComments(data.items);
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    };
    loadComments();

    ws.current = new WebSocket(WS_URL);

    ws.current.onmessage = (e) => {
      try {
        const message = JSON.parse(e.data);

        if (message && message.type === 'comment_added') {
          const newComment = message.comment;

          if (newComment && newComment.postId === postId) {
            const formattedComment: Comment = {
              id: newComment.id,
              postId: newComment.postId,
              text: newComment.text,
              author: {
                name: newComment.author.displayName,
                avatar: newComment.author.avatarUrl
              },
              createdAt: newComment.createdAt
            };

            setComments(prev => [formattedComment, ...prev]);
          }
        }
      } catch (err) {
        console.error("WS Message Error:", err);
      }
    };

    return () => ws.current?.close();
  }, [postId]);

  const handleSend = async () => {
    if (!commentText.trim()) return;

    try {
      const textToSend = commentText.trim();
      setCommentText('');
      await sendComment(postId, textToSend);
    } catch (e) {
      console.error("Failed to send comment:", e);
    }
  }; 

  const toggleSort = () => {
    setSortOrder(prev => (prev === 'new' ? 'old' : 'new'));
  };

  const loadMoreComments = useCallback(async () => {
    if (isFetchingMore) return;
    setIsFetchingMore(true);
    try {
      const data = await fetchComments(postId);
      setComments(prevComments => [...prevComments, ...data.items]);
    } catch (e) {
      console.error(e);
    } finally {
      setIsFetchingMore(false);
    }
  }, [postId, isFetchingMore]);

  const sortedComments = useMemo(() => {
    return [...comments].sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return sortOrder === 'new' ? dateB - dateA : dateA - dateB;
    });
  }, [comments, sortOrder]);

  const renderItem = ({ item }: { item: Comment }) => (
    <View style={styles.commentItem}>
      <Image source={{ uri: item.author.avatar }} style={styles.avatar} />
      <View style={styles.content}>
        <Text style={styles.authorName}>{item.author.name}</Text>
        <Text style={styles.text}>{item.text}</Text>
      </View>
    </View>
  );

  if (isLoading) return <ActivityIndicator style={{ margin: 20 }} color={tokens.colors.brand} />;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.countText}>{totalCount} комментариев</Text>
        
        <TouchableOpacity onPress={toggleSort} activeOpacity={0.7}>
          <Text style={styles.sortButton}>
            {sortOrder === 'new' ? 'Сначала новые' : 'Сначала старые'}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.list}>
        <FlatList
          style={styles.flatlist}
          data={sortedComments}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.list}
          onEndReached={loadMoreComments}
          onEndReachedThreshold={0.5}
          ListFooterComponent={isFetchingMore ? <ActivityIndicator size="small" color={tokens.colors.brand} /> : null}
        />
      </View>
      
      <View style={styles.inputWrapper}>
        <Input 
          placeholder="Ваш комментарий" 
          value={commentText}
          onChangeText={setCommentText}
          onSend={handleSend}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: tokens.colors.background,
    borderTopWidth: 1,
    borderTopColor: tokens.colors.border,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: tokens.spacing.md,
    paddingVertical: 14,
  },
  countText: {
    fontSize: 14,
    fontWeight: '700',
    color: tokens.colors.primary,
  },
  sortButton: {
    fontSize: 13,
    color: tokens.colors.brand,
    fontWeight: '600',
  },
  list: {
    maxHeight: 232,
    paddingHorizontal: tokens.spacing.md,
    overflow: 'scroll',
  },
  commentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: tokens.radius.round,
    backgroundColor: tokens.colors.surface,
  },
  content: {
    flex: 1,
    marginLeft: 10,
  },
  authorName: {
    fontWeight: '700',
    fontSize: 15,
    lineHeight: 20,
    color: tokens.colors.blackText,
  },
  text: {
    fontWeight: '500',
    fontSize: 14,
    color: tokens.colors.blackText,
    lineHeight: 20,
  },
  flatlist: {
    // flex: 1
  },
  inputWrapper: {
    padding: tokens.spacing.md,
    borderTopWidth: 1,
    borderTopColor: tokens.colors.border,
  }
});