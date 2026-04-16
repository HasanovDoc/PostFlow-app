import React, { useCallback } from "react";
import { FlatList, RefreshControl, ActivityIndicator, View, StyleSheet } from "react-native";
import { observer } from "mobx-react-lite";
import { useFeed } from "./hooks/useFeed";
import PostCard from "./components/PostCard";
import ErrorView from "../../shared/ui/ErrorView";
import { SafeAreaView } from "react-native-safe-area-context";

export const FeedScreen = observer(() => {
  const { 
    data, 
    fetchNextPage, 
    hasNextPage, 
    isFetchingNextPage, 
    refetch, 
    isLoading, 
    isError,
    isRefetching 
  } = useFeed();

  const posts = data?.pages.flatMap((p) => p.items) ?? [];
  console.log(posts);
  
  const onEndReached = useCallback(() => {
    if (!isFetchingNextPage && hasNextPage) {
      fetchNextPage();
    }
  }, [isFetchingNextPage, hasNextPage, fetchNextPage]);

  if (isError) return <ErrorView onRetry={refetch} />;

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={posts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <PostCard post={item} />}
        onEndReached={onEndReached}
        onEndReachedThreshold={0.2}
        refreshControl={
          <RefreshControl 
            refreshing={isRefetching} 
            onRefresh={refetch} 
          />
        }
        ListFooterComponent={
          isFetchingNextPage ? <ActivityIndicator style={{ margin: 20 }} /> : <View style={{ height: 40 }} />
        }
        removeClippedSubviews={true}
      />
    </SafeAreaView>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  }
});