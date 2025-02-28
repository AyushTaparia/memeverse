"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "@/components/theme-provider";
import { MemeProvider } from "@/context/meme-context";
import { UserProvider } from "@/context/user-context";


const queryClient = new QueryClient();

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <MemeProvider>
          <UserProvider>{children}</UserProvider>
        </MemeProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
