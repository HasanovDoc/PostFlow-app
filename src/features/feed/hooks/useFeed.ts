import { useInfiniteQuery } from "@tanstack/react-query";
import { fetchFeed } from "../api/feedApi";

export const useFeed = () => {
  return useInfiniteQuery({
    queryKey: ["feed"],
    queryFn: ({ pageParam }: any) => fetchFeed(pageParam),
    initialPageParam: undefined,
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
  });
};