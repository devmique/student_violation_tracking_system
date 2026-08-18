import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { StudentWithViolations, Violation, Course, Program } from "@/types/student";
import { User, Mail, Calendar, AlertTriangle, FileText, Clock, Plus, Trash, Pencil, Check, X as XIcon } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
} from "@/components/ui/alert-dialog";
import { useState } from "react";

const courses: Course[] = [
  "Information Technology",
  "Automotive Aftersales",
  "Electro Mechanic Technology",
  "Mechanical Technology",
];

const programs: Program[] = ["BS", "BTVTED", "Diploma"];

const years = [1, 2, 3, 4];

interface StudentDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  student: StudentWithViolations | null;
  onAddViolation: (student: StudentWithViolations) => void;
  onDeleteStudent: (student: StudentWithViolations) => void;
  onDeleteViolation: (id: string) => void;
  onUpdateStudent: (id: string, data: { course: string; program: string; year: number }) => void;
  onToggleViolationResolved: (id: string, resolved: boolean) => void;
}

export const StudentDetailModal = ({ isOpen, onClose, student, onAddViolation, onDeleteStudent, onDeleteViolation, onUpdateStudent, onToggleViolationResolved }: StudentDetailModalProps) => {
  const [openDelete, setOpenDelete] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({ course: "", program: "", year: "" });

  if (!student) return null;

  const startEdit = () => {
    setEditData({ course: student.course, program: student.program, year: student.year.toString() });
    setIsEditing(true);
  };

  const saveEdit = () => {
    onUpdateStudent(student._id, {
      course: editData.course,
      program: editData.program,
      year: parseInt(editData.year),
    });
    setIsEditing(false);
  };
   
  const getSeverityColor = (severity: string) => {
    switch (severity) {
   
      case "Major": return "bg-warning text-warning-foreground";
      case "Minor": return "bg-muted text-muted-foreground";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const sortedViolations = student.violations.sort((a, b) => 
    new Date(b.dateCommitted).getTime() - new Date(a.dateCommitted).getTime()
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose} >
      <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
          
    <User className="h-8 w-8 text-primary-foreground" />

            <span>Student Details</span>
          </DialogTitle>
             
        </DialogHeader>
    
        <div className="space-y-6">
          {/* Student Information */}
          <Card className="">
            <CardHeader>
              <CardTitle className="text-lg">Student Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className=" overflow-hidden w-16 h-16 gradient-primary rounded-full flex items-center justify-center">
                   
           {student.profilePic ? (
              <img 
                src={student.profilePic} 
                alt={`${student.firstName} ${student.lastName}`} 
                className="h-full w-full object-cover"
              />
            ) : (
                  <User className="h-8 w-8 text-primary-foreground" />
            )}
                
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-foreground">
                    {student.firstName} {student.lastName}
                  </h3>
                  <p className="text-muted-foreground">{student.studentId}</p>
                </div>
                <Button onClick={() => onAddViolation(student)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Violation
                </Button>
              </div>

              <div className="flex items-center justify-between pt-4 border-t">
                <span className="text-sm font-medium text-muted-foreground">Academic Info</span>
                {isEditing ? (
                  <div className="flex gap-1">
                    <Button size="sm" variant="ghost" onClick={saveEdit}>
                      <Check className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => setIsEditing(false)}>
                      <XIcon className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <Button size="sm" variant="ghost" onClick={startEdit}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                )}
              </div>

              {isEditing ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">Course</label>
                    <Select value={editData.course} onValueChange={(val) => setEditData({ ...editData, course: val })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select course" />
                      </SelectTrigger>
                      <SelectContent>
                        {courses.map((course) => (
                          <SelectItem key={course} value={course}>{course}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">Program</label>
                    <Select value={editData.program} onValueChange={(val) => setEditData({ ...editData, program: val })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select program" />
                      </SelectTrigger>
                      <SelectContent>
                        {programs.map((program) => (
                          <SelectItem key={program} value={program}>{program}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">Year Level</label>
                    <Select value={editData.year} onValueChange={(val) => setEditData({ ...editData, year: val })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select year" />
                      </SelectTrigger>
                      <SelectContent>
                        {years.map((year) => (
                          <SelectItem key={year} value={year.toString()}>Year {year}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">Course</p>
                    <p className="text-sm text-foreground">{student.course}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">Program</p>
                    <Badge variant="outline">{student.program}</Badge>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">Year Level</p>
                    <p className="text-sm text-foreground">Year {student.year}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">Total Violations</p>
                    <Badge variant={student.violationCount > 0 ? "destructive" : "secondary"}>
                      {student.violations.length}
                    </Badge>
                  </div>
                </div>
              )}

              {student.email && (
                <div className="flex items-center space-x-2 pt-2 border-t">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">{student.email}</span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Violations History */}
          <Card className="">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <AlertTriangle className="h-5 w-5 text-warning" />
                <span>Violation History ({student.violations.length})</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {sortedViolations.length > 0 ? (
                <ScrollArea className="h-[300px]">
                  <div className="space-y-4">
                    {sortedViolations.map((violation, index) => (
                      <ViolationItem key={violation._id} violation={violation} isLatest={index === 0}  onDeleteViolation={onDeleteViolation} onToggleViolationResolved={onToggleViolationResolved} />
                    ))}
                  </div>
                </ScrollArea>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <AlertTriangle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No violations recorded for this student.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-between pt-4">
            <Button 
               variant="destructive" 
               size="sm"
               onClick={() => setOpenDelete(true)}
            >
               Delete Student
            </Button>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>

          {/* Delete Student AlertDialog */}
        <AlertDialog open={openDelete} onOpenChange={setOpenDelete}>
  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle>Delete Student?</AlertDialogTitle>
      <AlertDialogDescription>
        This action cannot be undone. This will permanently delete 
        <strong> {student.firstName} {student.lastName} </strong> 
        and all associated violations.
      </AlertDialogDescription>
    </AlertDialogHeader>

    <AlertDialogFooter>
      <AlertDialogCancel>Cancel</AlertDialogCancel>
      <AlertDialogAction
        onClick={() => onDeleteStudent(student)}
        className="bg-destructive text-white hover:bg-destructive/90"
      >
        Delete
      </AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const ViolationItem = ({ violation, isLatest, onDeleteViolation, onToggleViolationResolved }: { violation: Violation; isLatest: boolean; onDeleteViolation: (id: string) => void; onToggleViolationResolved: (id: string, resolved: boolean) => void; }) => {
  const [openDelete, setOpenDelete] = useState(false);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "Major": return "bg-warning text-warning-foreground";
      case "Minor": return "bg-muted text-muted-foreground";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const resolvedColor = violation.resolved
    ? "bg-success text-success-foreground"
    : "bg-danger text-danger-foreground";

  return (
    <div className={`p-4 rounded-lg border ${isLatest ? 'bg-muted/50 border-primary/20' : 'bg-background'} transition-smooth`}>
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center space-x-2">
          <Badge className={getSeverityColor(violation.severity)} variant="secondary">
            {violation.severity}
          </Badge>
          <Badge
            className={`${resolvedColor} cursor-pointer`}
            variant="secondary"
            onClick={() => onToggleViolationResolved(violation._id, !violation.resolved)}
          >
            {violation.resolved ? "Resolved" : "Not Resolved"}
          </Badge>
          {isLatest && (
            <Badge variant="outline" className="text-xs">Latest</Badge>
          )}
        </div>
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <Calendar className="h-4 w-4" />
          <span>{new Date(violation.dateCommitted).toLocaleDateString()}</span>
           <Button
             variant="destructive"
             size="sm"
            onClick={() => setOpenDelete(true)}
            >
             <Trash />
           </Button>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-start space-x-2">
          <FileText className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
          <p className="text-sm text-foreground">{violation.description}</p>
        </div>

        {violation.notes && (
          <div className="flex items-start space-x-2 pl-6">
            <div className="text-xs text-muted-foreground bg-muted/50 px-2 py-1 rounded">
              Note: {violation.notes}
            </div>
          </div>
        )}

        <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t border-border/50">
          <span>Recorded by: {violation.createdBy}</span>
          <div className="flex items-center space-x-1">
            <Clock className="h-3 w-3" />
            <span>{new Date(violation.createdAt).toLocaleDateString()}</span>
          </div>
        </div>
      </div>
      {/* Delete Violation AlertDialog */}
      <AlertDialog open={openDelete} onOpenChange={setOpenDelete}>
  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle>Delete Violation?</AlertDialogTitle>
      <AlertDialogDescription>
        This action cannot be undone. This will permanently delete this violation.
      </AlertDialogDescription>
    </AlertDialogHeader>

    <AlertDialogFooter>
      <AlertDialogCancel>Cancel</AlertDialogCancel>
      <AlertDialogAction
        onClick={() => onDeleteViolation(violation._id)}
        className="bg-destructive text-white hover:bg-destructive/90"
      >
        Delete
      </AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>

    </div>

  );
};