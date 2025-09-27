import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";

export const ProfilePicModal = ({ isOpen, onClose, student, onUpload }) => {
  const [file, setFile] = useState<File | null>(null);
  const token = localStorage.getItem("token");
  const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";
const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if(!file) {
 toast({ title: "No file selected", description: "Please select a file to upload", variant: "destructive" });
    }
    if (file && student) onUpload(student._id, file);
    onClose();

    
  };

  // ✅ Delete profile picture
  const handleDelete = async () => {
    if (!student) return;
    if (!window.confirm("Are you sure you want to delete this profile picture?")) return;

    try {
      const res = await axios.delete(`${API_BASE}/students/${student._id}/profile-pic`, {
      
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.status!== 200) throw new Error("Failed to delete profile picture");
      onClose();
      window.location.reload(); // or optimistically update state if you prefer
    } catch (err:any) {
      console.error(err);
     
    toast({
        title: "Delete failed",
        description: err.response?.data?.message || "Error deleting profile picture",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update Profile Picture</DialogTitle>
        </DialogHeader>
          <div className="flex flex-col gap-4">
            {student?.profilePic && (
         <img
  src={`${API_BASE.replace("/api", "")}${student.profilePic}`}
  alt={`${student.firstName} profile`}
      className="w-24 h-24 rounded-full object-cover mx-auto"
/> )}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
          />
          <div className="flex justify-between gap-2">

            <Button type="submit">Upload</Button>
            {student?.profilePic && (
              <Button type="button" variant="destructive" onClick={handleDelete}>
                Delete
              </Button>
            )}
          </div>
          
        </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};
