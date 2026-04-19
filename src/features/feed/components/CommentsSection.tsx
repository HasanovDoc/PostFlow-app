import React, { useEffect, useState, useMemo, useCallback, useRef } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Image, TouchableOpacity, FlatList, KeyboardAvoidingView, Platform } from 'react-native';
import { tokens } from '../../../shared/lib/theme';
import { fetchComments, Comment, sendComment } from '../api/feedApi';
import Input from '../../../shared/ui/Input';
import { WS_URL } from '../../../shared/lib/api';
import PostCard from './PostCard';

type SortOrder = 'new' | 'old';

export default function CommentsSection({ 
  postId,
  totalCount,
  postData
}: { 
  postId: string,
  totalCount: number,
  postData: any
}) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [commentText, setCommentText] = useState('');
  const [sortOrder, setSortOrder] = useState<SortOrder>('new');
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [nextCursor, setNextCursor] = useState<string | undefined>(undefined);
  
  const ws = useRef<WebSocket | null>(null);

  const loadComments = async (cursor?: string) => {
    try {
      const data = await fetchComments(postId, cursor);
      
      if (cursor) {
        setComments(prev => [...prev, ...data.items]);
      } else {
        setComments(data.items);
      }
      setNextCursor(data.nextCursor);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
      setIsFetchingMore(false);
    }
  };

  useEffect(() => {
    loadComments();
    const socket = new WebSocket(WS_URL);
    ws.current = socket;

    socket.onmessage = (e) => {
      try {
        const data = JSON.parse(e.data);
        if (data.type === 'new_comment' && data.payload) {
          setComments(prev => {
            if (prev.some(c => c.id === data.payload.id)) return prev;
            return [data.payload, ...prev];
          });
        }
      } catch (err) {
        console.warn("WS parsing error:", err);
      }
    };

    return () => {
      if (socket) socket.close();
    };
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

  const handleLoadMore = () => {
    if (nextCursor && !isFetchingMore) {
      setIsFetchingMore(true);
      loadComments(nextCursor);
    }
  };

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
    <KeyboardAvoidingView 
      style={{ flex: 1 }} 
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0} 
    >
      <View style={styles.container}>
        <FlatList
          data={sortedComments}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          ListHeaderComponent={
            <View>
              <PostCard post={postData} />
              <View style={styles.header}>
                <Text style={styles.countText}>{totalCount} комментариев</Text>
                <TouchableOpacity onPress={toggleSort}>
                  <Text style={styles.sortButton}>
                    {sortOrder === 'new' ? 'Сначала новые' : 'Сначала старые'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          }
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.3}
          ListFooterComponent={
            isFetchingMore ? <ActivityIndicator style={{ marginVertical: 10 }} color={tokens.colors.brand} /> : null
          }
          ListEmptyComponent={
            !isLoading ? <Text style={styles.emptyText}>Комментариев пока нет</Text> : null
          }
        />

        <View style={styles.inputWrapper}>
          <Input 
            placeholder="Ваш комментарий" 
            value={commentText}
            onChangeText={setCommentText}
            onSend={handleSend}
          />
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: tokens.colors.background,
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
  commentItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 12,
    paddingHorizontal: tokens.spacing.md,
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
    color: tokens.colors.blackText,
    marginBottom: 2,
  },
  text: {
    fontWeight: '500',
    fontSize: 14,
    color: tokens.colors.blackText,
    lineHeight: 18,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 30,
    color: tokens.colors.secondary,
    fontSize: 14,
  },
  inputWrapper: {
    paddingHorizontal: tokens.spacing.md,
    paddingVertical: tokens.spacing.sm,
    borderTopWidth: 1,
    borderTopColor: tokens.colors.border,
    backgroundColor: tokens.colors.background,
    paddingBottom: Platform.OS === 'android' ? 40 : tokens.spacing.sm,
  }
});