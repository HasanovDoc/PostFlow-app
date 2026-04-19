import React from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import PostCard from './components/PostCard';
import CommentsSection from './components/CommentsSection';
import { tokens } from '../../shared/lib/theme';

export const CommentsScreen = ({ route }: any) => {
  const { post } = route.params;

  return (
    <View style={styles.container}>
      <CommentsSection 
        postId={post.id} 
        totalCount={post.comments} 
        postData={post}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: tokens.colors.background,
  },
});