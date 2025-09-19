import { ThemeProvider } from "@/components/theme/ThemeProvider";
import { Dashboard } from "@/components/dashboard/Dashboard";
import { Login } from "@/components/auth/Login";

const Index = () => {
  return (
    <ThemeProvider defaultTheme="light" storageKey="student-violations-theme">
      <Dashboard />
    </ThemeProvider>
  );
};

export default Index;
