import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import { Login } from "./components/auth/Login";
import NotFound from "./pages/NotFound";
import { Dashboard } from "./components/dashboard/Dashboard";
const queryClient = new QueryClient();
const token = localStorage.getItem("token");


// (only for logged-in users)
const ProtectedRoute = ({ element }) => {
  return token ? element : <Navigate to="/login" />;
};

// prevents logged-in users from accessing login/register)
const PublicRoute = ({ element }) => {
  return token ? <Navigate to="/dashboard" /> : element;
};
const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
           <Route path="login" element={<PublicRoute element={<Login />} />} />
           <Route
            path="dashboard"
            element={<ProtectedRoute element={<Dashboard />} />}
           />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
