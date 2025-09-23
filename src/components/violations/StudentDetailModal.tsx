import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { StudentWithViolations, Violation } from "@/types/student";
import { User, Mail, Calendar, AlertTriangle, FileText, Clock, Plus } from "lucide-react";

interface StudentDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  student: StudentWithViolations | null;
  onAddViolation: (student: StudentWithViolations) => void;
}

export const StudentDetailModal = ({ isOpen, onClose, student, onAddViolation }: StudentDetailModalProps) => {
  if (!student) return null;

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
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <User className="h-5 w-5 text-primary" />
            <span>Student Details</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Student Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Student Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 gradient-primary rounded-full flex items-center justify-center">
                  <User className="h-8 w-8 text-primary-foreground" />
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

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t">
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
                    {student.violationCount}
                  </Badge>
                </div>
              </div>

              {student.email && (
                <div className="flex items-center space-x-2 pt-2 border-t">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">{student.email}</span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Violations History */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <AlertTriangle className="h-5 w-5 text-warning" />
                <span>Violation History ({student.violationCount})</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {sortedViolations.length > 0 ? (
                <ScrollArea className="h-[300px]">
                  <div className="space-y-4">
                    {sortedViolations.map((violation, index) => (
                      <ViolationItem key={violation._id} violation={violation} isLatest={index === 0} />
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

        <div className="flex justify-end pt-4">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const ViolationItem = ({ violation, isLatest }: { violation: Violation; isLatest: boolean }) => {
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "Major": return "bg-warning text-warning-foreground";
      case "Minor": return "bg-muted text-muted-foreground";
      default: return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div className={`p-4 rounded-lg border ${isLatest ? 'bg-muted/50 border-primary/20' : 'bg-background'} transition-smooth`}>
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center space-x-2">
          <Badge className={getSeverityColor(violation.severity)} variant="secondary">
            {violation.severity}
          </Badge>
          {isLatest && (
            <Badge variant="outline" className="text-xs">Latest</Badge>
          )}
        </div>
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <Calendar className="h-4 w-4" />
          <span>{new Date(violation.dateCommitted).toLocaleDateString()}</span>
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
    </div>
  );
};