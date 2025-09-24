import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export const ProfilePicModal = ({ isOpen, onClose, student, onUpload }) => {
  const [file, setFile] = useState<File | null>(null);
  const token = localStorage.getItem("token");
  const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if(!file) {
     toast.error("No file selected. Please select a file to upload.");
    }
    if (file && student) onUpload(student._id, file);
    onClose();

    
  };

  // ✅ Delete profile picture
  const handleDelete = async () => {
    if (!student) return;
    if (!window.confirm("Are you sure you want to delete this profile picture?")) return;

    try {
      const res = await fetch(`${API_BASE}/students/${student._id}/profile-pic`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Failed to delete profile picture");
      onClose();
      window.location.reload(); // or optimistically update state if you prefer
    } catch (err) {
      console.error(err);
      alert("Error deleting profile picture");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update Profile Picture</DialogTitle>
        </DialogHeader>
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
      </DialogContent>
    </Dialog>
  );
};
