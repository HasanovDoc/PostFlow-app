import React, { useEffect, useState, useMemo } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Image, TouchableOpacity } from 'react-native';
import { tokens } from '../../../shared/lib/theme';
import { fetchComments, Comment } from '../api/feedApi';
import Input from '../../../shared/ui/Input';

type SortOrder = 'new' | 'old';

export default function CommentsSection({ postId, totalCount }: { postId: string, totalCount: number }) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [commentText, setCommentText] = useState('');
  const [sortOrder, setSortOrder] = useState<SortOrder>('new');

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
  }, [postId]);

  // Переключение сортировки
  const toggleSort = () => {
    setSortOrder(prev => (prev === 'new' ? 'old' : 'new'));
  };

  const sortedComments = useMemo(() => {
    return [...comments].sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return sortOrder === 'new' ? dateB - dateA : dateA - dateB;
    });
  }, [comments, sortOrder]);

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
        {sortedComments.map((item) => (
          <View key={item.id} style={styles.commentItem}>
            <Image source={{ uri: item.author.avatar }} style={styles.avatar} />
            <View style={styles.content}>
              <Text style={styles.authorName}>{item.author.name}</Text>
              <Text style={styles.text}>{item.text}</Text>
            </View>
          </View>
        ))}
      </View>
      
      <View style={styles.inputWrapper}>
        <Input 
          placeholder="Ваш комментарий" 
          value={commentText}
          onChangeText={setCommentText}
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
  inputWrapper: {
    padding: tokens.spacing.md,
    borderTopWidth: 1,
    borderTopColor: tokens.colors.border,
  }
});