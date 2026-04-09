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
 * Optimized for CRM: 5-minute data freshness, 
 * focus refetching disabled to minimize unnecessary API calls.
 */
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false, // Prevents server spam on tab switching
      retry: 1,                    // Single retry attempt for transient errors
      staleTime: 1000 * 60 * 5,    // Data is considered fresh for 5 minutes
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
        
        {/* 3. Session Logic: Validates user session before mounting the app */}
        <AppInitializer>
          
          {/* 4. Routing Layer: React Router */}
          <RouterProvider router={appRouter} />
          
        </AppInitializer>
        
        {/* Global Toast Notifications */}
        <Toaster /> 
        
      </ChakraProvider>
      
    </QueryClientProvider>
  </StrictMode>
);