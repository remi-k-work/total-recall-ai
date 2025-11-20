"use client";

// services, features, and other libraries
import { isServer, QueryClient, QueryClientProvider } from "@tanstack/react-query";

// types
import type { ReactNode } from "react";

// With SSR, we usually want to set some default staleTime above 0 to avoid refetching immediately on the client
const makeQueryClient = () => new QueryClient({ defaultOptions: { queries: { staleTime: 60 * 1000 } } });

let browserQueryClient: QueryClient | undefined = undefined;

function getQueryClient() {
  if (isServer) {
    // Server: always make a new query client
    return makeQueryClient();
  } else {
    // Browser: make a new query client if we do not already have one
    if (!browserQueryClient) browserQueryClient = makeQueryClient();
    return browserQueryClient;
  }
}

export default function TanStackQueryProvider({ children }: { children: ReactNode }) {
  const queryClient = getQueryClient();

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
