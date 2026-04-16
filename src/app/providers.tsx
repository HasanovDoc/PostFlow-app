import React, { ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { rootStore, StoreContext } from "./store/rootStore";

const queryClient = new QueryClient();

export function Providers({ children }: { children: ReactNode }) {
  return (
    <StoreContext.Provider value={rootStore}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </StoreContext.Provider>
  );
}