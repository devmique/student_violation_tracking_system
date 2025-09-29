import { Search,  LogOut, User, Trash, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ThemeToggle } from "@/components/theme/ThemeToggle";

import logo from "@/assets/DON-BOSCO-COLLEGE-LOGO.png"
import axios from "axios";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";



interface HeaderProps {
  onSearch: (query: string) => void;
  searchQuery: string;
}
const handleLogout = () =>{

  if (!window.confirm("Are you sure you want to logout?")) return;
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  window.location.href = "/login"
}

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";



export const Header = ({ onSearch, searchQuery }: HeaderProps) => {
 
  const storedUser = localStorage.getItem("user");
    const token = localStorage.getItem("token");



  const [currentUser, setCurrentUser] = useState(
    storedUser ? JSON.parse(storedUser) : { username: "Guest", profilePic: "" }
  );
const [isUserModalOpen, setIsUserModalOpen] = useState(false);

const { toast } = useToast();
 // ✅ Upload profile picture
  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;


    const formData = new FormData();
    formData.append("profilePic", e.target.files[0]);

    try {
      const { data } = await axios.post(
        `${API_BASE}/profile/upload/${currentUser._id || currentUser.id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      localStorage.setItem("user", JSON.stringify(data.user));
      setCurrentUser(data.user);

      toast({ title: "Profile updated", description: "Profile picture uploaded successfully" });
       setIsUserModalOpen(false); 
    } catch (err: any) {
      toast({
        title: "Upload failed",
        description: err.response?.data?.message || "Error uploading profile picture",
        variant: "destructive",
      });
    }
  };

  // ✅ Delete profile picture
  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete your profile picture?")) return;

    try {
      const { data } = await axios.delete(
        `${API_BASE}/profile/delete/${currentUser._id || currentUser.id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      localStorage.setItem("user", JSON.stringify(data.user));
      setCurrentUser(data.user);

      toast({ title: "Deleted", description: "Profile picture removed" });
    } catch (err: any) {
      toast({
        title: "Delete failed",
        description: err.response?.data?.message || "Error deleting profile picture",
        variant: "destructive",
      });
    }
  };

    const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsUserModalOpen(false);
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    if(!fileInput?.files?.[0]) {
      toast({ title: "No file selected", description: "Please select a file to upload", variant: "destructive" });
      return;
    }
    
  };

  return (
    <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b shadow-soft">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo and Title */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10  rounded-lg flex items-center justify-center">
                <img src={logo} alt="logo" />
      
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">DBC Violation Tracker</h1>
                <p className="text-sm text-muted-foreground">Academic Tracking System</p>
              </div>
            </div>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-md mx-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search students by name or ID..."
                value={searchQuery}
                onChange={(e) => onSearch(e.target.value)}
                className="pl-10 transition-smooth focus:shadow-medium"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-3">
           
            <ThemeToggle />
            
            <Button onClick={handleLogout} variant="ghost" size="icon">
              <LogOut className="h-4 w-4" />
            </Button>

            <div className="flex items-center space-x-2 pl-3 border-l">
                
          

                 {/* Profile dropdown */}
             <div
              className="w-8 h-8 rounded-full overflow-hidden flex items-center justify-center gradient-primary hover:opacity-90 transition-opacity"
              onClick={() => setIsUserModalOpen(true)}
              >
              {currentUser.profilePic ? (
                <img
                
                  src={currentUser.profilePic}
                  alt="User Avatar"
                  className="w-full h-full object-cover"
                />
              ) : (
                <User className="h-6 w-6 text-primary-foreground" />
              )}
            </div>

              
              <div className="hidden md:block">
                <p className="text-sm font-medium">{currentUser.username}</p>
                <p className="text-xs text-muted-foreground">Vice Dean of Student Affairs</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* ADDED: Profile modal */}
      <Dialog open={isUserModalOpen} onOpenChange={setIsUserModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Profile Picture</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-4">
            {currentUser.profilePic && (
            <img
              src={currentUser.profilePic || ""}
              alt="Profile"
              className="w-24 h-24 rounded-full object-cover mx-auto"
            />
            )}
             <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <input type="file" accept="image/*" onChange={handleUpload} />
              <div className="flex justify-between gap-2">
            <Button type="submit">Upload</Button>
            {currentUser.profilePic && (
              <Button variant="destructive" onClick={handleDelete}>
                Delete Picture
              </Button>
            )}
            </div>
            </form>
          </div>
        </DialogContent>
      </Dialog>
    </header>
  );
};