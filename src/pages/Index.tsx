import { ThemeProvider } from "@/components/theme/ThemeProvider";
import { Dashboard } from "@/components/dashboard/Dashboard";


const Index = () => {
  return (
    <ThemeProvider>
      <Dashboard />
    </ThemeProvider>
  );
};

export default Index;
