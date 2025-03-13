import Chat from "./pages/Chat";
import { ThemeProvider } from "./components/chat/theme-provider";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import NotFound from "./pages/NotFound";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { SocialInbox } from "@/components/chat/SocialInbox";
import Index from "./pages/Index";
import ViewDemo from "./pages/ViewDemo";
import Description from "./pages/Description";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/view-demo" element={<ViewDemo />} />
              <Route path="/description" element={<Description />} />
              <Route path="/chat" element={<Chat />} />
              <Route path="/chat/inbox" element={<SocialInbox />} />
              {/* Redirect routes for specific inbox types */}
              <Route path="/chat/inbox/email" element={<Navigate to="/chat/inbox?tab=email" replace />} />
              <Route path="/chat/inbox/linkedin" element={<Navigate to="/chat/inbox?tab=linkedin" replace />} />
              <Route path="/chat/inbox/twitter" element={<Navigate to="/chat/inbox?tab=twitter" replace />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
          <Toaster />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
