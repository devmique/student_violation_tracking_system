import { useEffect, useState } from "react";
import axios from "axios";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

interface ManagedUser {
  _id: string;
  username: string;
  email: string;
  role: "admin" | "general";
}

interface UserRolesModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUserId: string;
}

export const UserRolesModal = ({ isOpen, onClose, currentUserId }: UserRolesModalProps) => {
  const [users, setUsers] = useState<ManagedUser[]>([]);
  const token = localStorage.getItem("token");
  const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";
  const { toast } = useToast();

  useEffect(() => {
    if (!isOpen) return;
    axios
      .get(`${API_BASE}/users`, { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => setUsers(res.data))
      .catch(() => {
        toast({ title: "Error", description: "Failed to load users", variant: "destructive" });
      });
  }, [isOpen]);

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
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Manage Users</DialogTitle>
        </DialogHeader>

        <div className="space-y-3">
          {users.map((user) => (
            <div key={user._id} className="flex items-center justify-between gap-4">
              <div className="min-w-0">
                <p className="text-sm font-medium text-foreground truncate">{user.username}</p>
                <p className="text-xs text-muted-foreground truncate">{user.email}</p>
              </div>
              <Select
                value={user.role}
                disabled={user._id === currentUserId}
                onValueChange={(val) => handleRoleChange(user._id, val)}
              >
                <SelectTrigger className="w-[120px]">
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
      </DialogContent>
    </Dialog>
  );
};
