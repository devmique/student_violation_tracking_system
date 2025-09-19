import { useState } from "react";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL|| "http://localhost:5000/api";

export const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data } = await axios.post(`${API_BASE}/auth/login`, { email, password });

      // Save token + user info
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      toast({
        title: "Login successful",
        description: `Welcome back, ${data.user.username}!`,
      });

      // Redirect to dashboard
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

  return (
    <div className="flex items-center justify-center mid-h-screen bg-background">
        <Card className="w-full max-w-md shadow-lg"/>
            <CardHeader>
                <CardTitle className="text-center text-2xl">Login</CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit ={handleSubmit} className="space-y-4">
                    <Input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e)=>setEmail(e.target.value)}
                    required/>

                    <Input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e)=> setPassword(e.target.value)}
                    required />

                    <Button
                    type="submit"
                    className="w-full bg-primary text-primary-foreground hover:bg-primary-hover" 
                    disabled={loading}>
                        {loading ? "Logging in..." : "Login"}
                    </Button>
                </form>
            </CardContent>
    </div>
  )
}
