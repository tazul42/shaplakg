import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppLayout } from "@/components/layout/AppLayout";
import Dashboard from "./pages/Dashboard";
import Students from "./pages/Students";
import ComingSoon from "./pages/ComingSoon";
import ClassSections from "./pages/ClassSections";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route element={<AppLayout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/students" element={<Students />} />
            <Route path="/teachers" element={<ComingSoon />} />
            <Route path="/attendance" element={<ComingSoon />} />
            <Route path="/examinations" element={<ComingSoon />} />
            <Route path="/results" element={<ComingSoon />} />
            <Route path="/fees" element={<ComingSoon />} />
            <Route path="/accounts" element={<ComingSoon />} />
            <Route path="/inventory" element={<ComingSoon />} />
            <Route path="/notifications" element={<ComingSoon />} />
            <Route path="/reports" element={<ComingSoon />} />
            <Route path="/classes" element={<ClassSections />} />
            <Route path="/settings" element={<ComingSoon />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
