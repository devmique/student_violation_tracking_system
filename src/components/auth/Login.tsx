import { useState } from "react";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import * as Tabs from "@radix-ui/react-tabs";
import logo from "@/assets/DON-BOSCO-COLLEGE-LOGO.png"
const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

export const Login = () => {
  const { toast } = useToast();

  // Shared loading state
  const [loading, setLoading] = useState(false);

  // Login states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Register states
  const [username, setUsername] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");

  // Handle Login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data } = await axios.post(`${API_BASE}/auth/login`, {
        email,
        password,
      });

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      toast({
        title: "Login successful",
        description: `Welcome back, ${data.user.username}!`,
      });
      setEmail("");
      setPassword("");
      window.location.href = "/dashboard";
    } catch (err: any) {
      toast({
        title: "Login failed",
        description: err.response?.data?.message || "Invalid email or password",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle Register
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data } = await axios.post(`${API_BASE}/auth/register`, {
        username,
        email: regEmail,
        password: regPassword,
      });

      toast({
        title: "Registration successful",
        description: `Welcome, ${data.user.username}!`,
      });
     setUsername("");
      setRegEmail("");
      setRegPassword("");
      // Switch to login tab automatically after successful register
      setEmail(regEmail);
      setPassword(regPassword);
      window.location.href = "/login"; 
    } catch (err: any) {
      toast({
        title: "Registration failed",
        description: err.response?.data?.message || "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="flex flex-col items-center ">
                           <img src={logo} alt="logo" className="w-16 h-16" />
          <CardTitle className="text-center text-2xl">Welcome to DBC Violation Tracker
              
       </CardTitle>
               
        </CardHeader>
 
        <CardContent>
          <Tabs.Root defaultValue="login" className="w-full">
            <Tabs.List className="flex justify-center space-x-4 mb-4">
              <Tabs.Trigger
                value="login"
                className="px-4 py-2 text-sm font-medium data-[state=active]:border-b-2 data-[state=active]:border-primary"
              >
                Login
              </Tabs.Trigger>
              <Tabs.Trigger
                value="register"
                className="px-4 py-2 text-sm font-medium data-[state=active]:border-b-2 data-[state=active]:border-primary"
              >
                Register
              </Tabs.Trigger>
            </Tabs.List>

            {/* Login Tab */}
            <Tabs.Content value="login">
              <form onSubmit={handleLogin} className="space-y-4">
                <Input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <Input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <Button
                  type="submit"
                  className="w-full bg-primary text-primary-foreground hover:bg-primary-hover"
                  disabled={loading}
                >
                  {loading ? "Logging in..." : "Login"}
                </Button>
              </form>
            </Tabs.Content>

            {/* Register Tab */}
            <Tabs.Content value="register">
              <form onSubmit={handleRegister} className="space-y-4">
                <Input
                  type="text"
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
                <Input
                  type="email"
                  placeholder="Email"
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  required
                />
                <Input
                  type="password"
                  placeholder="Password"
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  required
                />
                <Button
                  type="submit"
                  className="w-full bg-primary text-primary-foreground hover:bg-primary-hover"
                  disabled={loading}
                >
                  {loading ? "Registering..." : "Register"}
                </Button>
              </form>
            </Tabs.Content>
          </Tabs.Root>
        </CardContent>
      </Card>
    </div>
  );
};
