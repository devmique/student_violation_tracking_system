import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { StudentWithViolations, ViolationSeverity } from "@/types/student";
import { Calendar, User, AlertTriangle } from "lucide-react";

interface ViolationModalProps {
  isOpen: boolean;
  onClose: () => void;
  student: StudentWithViolations | null;
  onAddViolation: (violation: {
    description: string;
    severity: ViolationSeverity;
    dateCommitted: Date;
    notes?: string;
  }) => void;
}

export const ViolationModal = ({ isOpen, onClose, student, onAddViolation }: ViolationModalProps) => {
  const [description, setDescription] = useState("");
  const [severity, setSeverity] = useState<ViolationSeverity | "">("");
  const [dateCommitted, setDateCommitted] = useState(new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description || !severity) return;

    setIsSubmitting(true);
    
    try {
      await onAddViolation({
        description,
        severity: severity as ViolationSeverity,
        dateCommitted: new Date(dateCommitted),
        notes: notes || undefined,
      });
      
      // Reset form
      setDescription("");
      setSeverity("");
      setDateCommitted(new Date().toISOString().split('T')[0]);
      setNotes("");
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setDescription("");
    setSeverity("");
    setDateCommitted(new Date().toISOString().split('T')[0]);
    setNotes("");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <AlertTriangle className="h-5 w-5 text-warning" />
            <span>Add New Violation</span>
          </DialogTitle>
        </DialogHeader>

        {student && (
          <div className="bg-muted/50 p-4 rounded-lg mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 gradient-primary rounded-full flex items-center justify-center">
                <User className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">
                  {student.firstName} {student.lastName}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {student.studentId} • {student.program} • Year {student.year}
                </p>
              </div>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="description">Violation Description *</Label>
            <Textarea
              id="description"
              placeholder="Describe the violation in detail..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              className="min-h-[80px]"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="severity">Severity *</Label>
              <Select value={severity} onValueChange={(value) => setSeverity(value as ViolationSeverity)} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select severity" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Minor">Minor</SelectItem>
                  <SelectItem value="Major">Major</SelectItem>
          
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="date">Date Committed *</Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  id="date"
                  type="date"
                  value={dateCommitted}
                  onChange={(e) => setDateCommitted(e.target.value)}
                  required
                  className="pl-10"
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Additional Notes</Label>
            <Textarea
              id="notes"
              placeholder="Any additional notes or context..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="min-h-[60px]"
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting || !description || !severity}>
              {isSubmitting ? "Adding..." : "Add Violation"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};