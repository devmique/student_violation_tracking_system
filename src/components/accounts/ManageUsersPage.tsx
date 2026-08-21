import { useEffect, useState } from "react";
import axios from "axios";
import { Header } from "@/components/layout/Header";
import { SidebarNav } from "@/components/layout/SidebarNav";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { AuthUser } from "@/types/user";

interface ManagedUser {
  _id: string;
  username: string;
  email: string;
  role: "admin" | "general";
}

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

export const ManageUsersPage = () => {
  const [users, setUsers] = useState<ManagedUser[]>([]);
  const token = localStorage.getItem("token");
  const { toast } = useToast();

  const storedUser = localStorage.getItem("user");
  const currentUser: AuthUser | null = storedUser ? JSON.parse(storedUser) : null;
  const currentUserId = (currentUser as any)?._id || currentUser?.id;

  useEffect(() => {
    axios
      .get(`${API_BASE}/users`, { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => setUsers(res.data))
      .catch(() => {
        toast({ title: "Error", description: "Failed to load users", variant: "destructive" });
      });
  }, []);

  const handleRoleChange = async (userId: string, role: string) => {
    try {
      const res = await axios.put(
        `${API_BASE}/users/${userId}/role`,
        { role },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUsers((prev) => prev.map((u) => (u._id === userId ? { ...u, role: res.data.role } : u)));
      toast({ title: "Role Updated", description: `${res.data.username} is now ${res.data.role}.` });
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.response?.data?.message || "Failed to update role",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="flex flex-col md:flex-row">
        <SidebarNav />
        <main className="flex-1 px-6 py-8">
          <div className="max-w-2xl space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-foreground">Manage Accounts</h2>
              <p className="text-sm text-muted-foreground">
                Set who can create, edit and delete records.
              </p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Users</CardTitle>
                <CardDescription>
                  Admins can manage records and roles. General users have read-only access. You
                  cannot change your own role.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {users.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No users to show.</p>
                ) : (
                  <div className="space-y-3">
                    {users.map((user) => (
                      <div
                        key={user._id}
                        className="flex items-center justify-between gap-4 border-b pb-3 last:border-b-0 last:pb-0"
                      >
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-foreground truncate">
                            {user.username}
                          </p>
                          <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                        </div>
                        <Select
                          value={user.role}
                          disabled={user._id === currentUserId}
                          onValueChange={(val) => handleRoleChange(user._id, val)}
                        >
                          <SelectTrigger className="w-[120px] shrink-0">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="admin">Admin</SelectItem>
                            <SelectItem value="general">General</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
};
