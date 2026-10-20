import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState, type ReactNode } from "react";
import { Provider } from "react-redux";
import { AuthSync } from "@/components/auth-sync";
import { makeStore } from "@/store/store";

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: 1,
        refetchOnWindowFocus: false,
        staleTime: 15_000,
      },
    },
  });
}

/** Redux (session mirror) and TanStack Query (server state) for the App Router-style tree. */
export function AppProviders({ children }: { children: ReactNode }) {
  const [store] = useState(() => makeStore());
  const [queryClient] = useState(() => makeQueryClient());
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <AuthSync />
        {children}
      </QueryClientProvider>
    </Provider>
  );
}
