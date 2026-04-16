import React, { useCallback, useState, useMemo } from "react";
import { FlatList, RefreshControl, ActivityIndicator, View, StyleSheet } from "react-native";
import { observer } from "mobx-react-lite";
import { useFeed } from "./hooks/useFeed";
import PostCard from "./components/PostCard";
import ErrorView from "../../shared/ui/ErrorView";
import { SafeAreaView } from "react-native-safe-area-context";
import Tabs, { TabOption } from "../../shared/ui/Tabs";

const FEED_TABS: TabOption[] = [
  { label: "Все", value: "all" },
  { label: "Бесплатные", value: "free" },
  { label: "Платные", value: "paid" },
];

export const FeedScreen = observer(() => {
  const [filter, setFilter] = useState<"all" | "free" | "paid">("all");
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

  const allPosts = useMemo(() => data?.pages.flatMap((p) => p.items) ?? [], [data]);

  const filteredPosts = useMemo(() => {
    if (filter === "all") return allPosts;
    return allPosts.filter(post => post.tier === filter);
  }, [allPosts, filter]);
  
  const onEndReached = useCallback(() => {
    if (!isFetchingNextPage && hasNextPage) {
      fetchNextPage();
    }
  }, [isFetchingNextPage, hasNextPage, fetchNextPage]);

  if (isError) return <ErrorView onRetry={refetch} />;

  return (
    <SafeAreaView style={styles.container}>
      <Tabs 
        options={FEED_TABS} 
        activeValue={filter} 
        onChange={setFilter} 
      />
      <FlatList
        data={filteredPosts}
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