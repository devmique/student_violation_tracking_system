import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { User, Upload, Trash } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { SidebarNav } from "@/components/layout/SidebarNav";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { AuthUser } from "@/types/user";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

export const ProfilePage = () => {
  const token = localStorage.getItem("token");
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const storedUser = localStorage.getItem("user");
  const [user, setUser] = useState<AuthUser | null>(storedUser ? JSON.parse(storedUser) : null);

  const [username, setUsername] = useState(user?.username || "");
  const [email, setEmail] = useState(user?.email || "");
  const [savingDetails, setSavingDetails] = useState(false);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [savingPassword, setSavingPassword] = useState(false);

  const userId = (user as any)?._id || user?.id;
  const profilePicUrl = user?.profilePic
    ? `${API_BASE.replace("/api", "")}${user.profilePic}`
    : null;

  // The rest of the app reads the logged-in user straight from localStorage
  const persistUser = (fresh: any) => {
    const merged = { ...(user || {}), ...fresh, id: fresh._id || fresh.id || userId };
    localStorage.setItem("user", JSON.stringify(merged));
    setUser(merged);
  };

  // Keep the page in sync with the server, not just the localStorage snapshot
  useEffect(() => {
    axios
      .get(`${API_BASE}/profile/me`, { headers: { Authorization: `Bearer ${token}` } })
      .then(({ data }) => {
        persistUser(data);
        setUsername(data.username);
        setEmail(data.email);
      })
      .catch(() => {
        toast({ title: "Error", description: "Failed to load your profile", variant: "destructive" });
      });
  }, []);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("profilePic", file);

    try {
      const { data } = await axios.post(`${API_BASE}/profile/upload/${userId}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });
      persistUser(data.user);
      toast({ title: "Profile updated", description: "Profile picture uploaded successfully" });
    } catch (err: any) {
      toast({
        title: "Upload failed",
        description: err.response?.data?.message || "Error uploading profile picture",
        variant: "destructive",
      });
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleDeletePic = async () => {
    if (!window.confirm("Are you sure you want to delete your profile picture?")) return;

    try {
      const { data } = await axios.delete(`${API_BASE}/profile/delete/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      persistUser({ ...data.user, profilePic: "" });
      toast({ title: "Deleted", description: "Profile picture removed" });
    } catch (err: any) {
      toast({
        title: "Delete failed",
        description: err.response?.data?.message || "Error deleting profile picture",
        variant: "destructive",
      });
    }
  };

  const handleSaveDetails = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingDetails(true);
    try {
      const { data } = await axios.put(
        `${API_BASE}/profile/me`,
        { username, email },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      persistUser(data.user);
      toast({ title: "Saved", description: "Your account details were updated" });
    } catch (err: any) {
      toast({
        title: "Update failed",
        description: err.response?.data?.message || "Error updating your details",
        variant: "destructive",
      });
    } finally {
      setSavingDetails(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      toast({
        title: "Passwords do not match",
        description: "The new password and its confirmation must match",
        variant: "destructive",
      });
      return;
    }

    setSavingPassword(true);
    try {
      await axios.put(
        `${API_BASE}/profile/password`,
        { currentPassword, newPassword },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      toast({ title: "Password changed", description: "Your password was updated" });
    } catch (err: any) {
      toast({
        title: "Change failed",
        description: err.response?.data?.message || "Error changing your password",
        variant: "destructive",
      });
    } finally {
      setSavingPassword(false);
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
              <h2 className="text-2xl font-bold text-foreground">Profile</h2>
              <p className="text-sm text-muted-foreground">
                View and update your account information.
              </p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Profile picture</CardTitle>
                <CardDescription>Shown next to your name across the app.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                  <div className="w-20 h-20 shrink-0 rounded-full overflow-hidden flex items-center justify-center gradient-primary">
                    {profilePicUrl ? (
                      <img src={profilePicUrl} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <User className="h-10 w-10 text-primary-foreground" />
                    )}
                  </div>

                  <div className="min-w-0">
                    <p className="text-sm font-medium text-foreground">{user?.username}</p>
                    <div className="mt-1">
                      <Badge variant="secondary">
                        {user?.role === "admin" ? "Administrator" : "Staff"}
                      </Badge>
                    </div>

                    <div className="flex flex-wrap gap-2 mt-3">
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleUpload}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <Upload className="h-4 w-4 mr-2" />
                        Upload
                      </Button>
                      {user?.profilePic && (
                        <Button type="button" variant="destructive" size="sm" onClick={handleDeletePic}>
                          <Trash className="h-4 w-4 mr-2" />
                          Remove
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Account details</CardTitle>
                <CardDescription>Your username and the email you sign in with.</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSaveDetails} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="username">Username</Label>
                    <Input
                      id="username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <Button type="submit" disabled={savingDetails}>
                    {savingDetails ? "Saving..." : "Save changes"}
                  </Button>
                </form>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Change password</CardTitle>
                <CardDescription>Use at least 6 characters.</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleChangePassword} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword">Current password</Label>
                    <Input
                      id="currentPassword"
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="newPassword">New password</Label>
                    <Input
                      id="newPassword"
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      minLength={6}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm new password</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      minLength={6}
                      required
                    />
                  </div>
                  <Button type="submit" disabled={savingPassword}>
                    {savingPassword ? "Updating..." : "Update password"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
};
