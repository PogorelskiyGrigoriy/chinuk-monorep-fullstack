/**
 * @module EntryPoint
 * Main entry point for the Chinook Explorer application.
 */
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider } from "react-router-dom";

// UI Providers and Components
import { Provider as ChakraProvider } from "@/components/chakra-ui/provider";
import { Toaster } from './components/chakra-ui/toaster';

// Application Configuration
import { appRouter } from "./router/app-router";
import { AppInitializer } from "./components/auth/AppInitializer";

/**
 * QueryClient Initialization.
 * Optimized for CRM: 5-minute stale time, 
 * window focus refetching disabled to prevent excessive API calls.
 */
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false, // Prevents spamming backend on tab switch
      retry: 1,                    // Single retry on network failure
      staleTime: 1000 * 60 * 5,    // Data considered fresh for 5 minutes
    },
  },
});

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error('Failed to find #root element. Check index.html');
}

createRoot(rootElement).render(
  <StrictMode>
    {/* 1. Data Layer: TanStack Query */}
    <QueryClientProvider client={queryClient}>
      
      {/* 2. UI Layer: Chakra UI */}
      <ChakraProvider> 
        
        {/* 3. Session Logic: Validates token before app starts */}
        <AppInitializer>
          
          {/* 4. Navigation Layer: React Router */}
          <RouterProvider router={appRouter} />
          
        </AppInitializer>
        
        {/* Global Notifications */}
        <Toaster /> 
        
      </ChakraProvider>
      
    </QueryClientProvider>
  </StrictMode>
);