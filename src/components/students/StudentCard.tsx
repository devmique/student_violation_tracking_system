import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Mail, User, AlertCircle, Eye, Plus } from "lucide-react";
import { StudentWithViolations } from "@/types/student";

interface StudentCardProps {
  student: StudentWithViolations;
  onViewDetails: (student: StudentWithViolations) => void;
  onAddViolation: (student: StudentWithViolations) => void;
  onChangeProfilePic: (student: StudentWithViolations) => void; 
}

export const StudentCard = ({ student, onViewDetails, onAddViolation, onChangeProfilePic, }: StudentCardProps) => {
  const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "Major": return "bg-warning text-warning-foreground";
      case "Minor": return "bg-muted text-muted-foreground";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const lastViolationDate = student.lastViolation 
    ? new Date(student.lastViolation).toLocaleDateString()
    : "No violations";

  return (
    <Card className="shadow-soft hover:shadow-medium transition-smooth group ">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 gradient-primary rounded-full flex items-center justify-center">
              <button
                className="w-12 h-12 rounded-full overflow-hidden flex items-center justify-center gradient-primary hover:opacity-90 transition-opacity"
               onClick={() => onChangeProfilePic(student)}
             >
              {student.profilePic ? (
                <img
                 src={`${API_BASE.replace("/api", "")}${student.profilePic}`}
                 alt={`${student.firstName} profile`}
                 className="w-full h-full object-cover"
               />

              ) : (
                <User className="h-6 w-6 text-primary-foreground" />
              )}
             </button>
              
            </div>
            <div>
              <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                {student.firstName} {student.middlename} {student.lastName}
              </h3>
              <p className="text-sm text-muted-foreground">{student.studentId}</p>
             


            </div>
          </div>
          
          {student.violationCount > 0 && (
            <Badge variant="secondary" className="flex items-center space-x-1">
              <AlertCircle className="h-3 w-3" />
              <span>{student.violationCount}</span>
            </Badge>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-3">
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="flex items-center space-x-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span>Year {student.year}</span>
          </div>
          <div>
            <Badge variant="outline">{student.program}</Badge>
          </div>
        </div>
        
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">{student.course}</p>
          {student.email && (
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <Mail className="h-4 w-4" />
              <span className="truncate">{student.email}</span>
            </div>
          )}
        </div>
        
        {student.violations.length > 0 && (
          <div className="space-y-2">
            <p className="text-xs font-medium text-muted-foreground">Recent Violations</p>
            <div className="space-y-1">
              {student.violations.slice(0, 2).map((violation) => (
                <div key={violation._id} className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground truncate flex-1">
                    {violation.description}
                  </span>
                  <Badge 
                    className={`ml-2 text-xs ${getSeverityColor(violation.severity)}`}
                    variant="secondary"
                  >
                    {violation.severity}
                  </Badge>
                </div>
              ))}
              {student.violations.length > 2 && (
                <p className="text-xs text-muted-foreground">
                  +{student.violations.length - 2} more...
                </p>
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              Last violation: {lastViolationDate}
            </p>
          </div>
        )}
        
        <div className="flex space-x-2 pt-2 ">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-1"
            onClick={() => onViewDetails(student)}
          >
            <Eye className="h-4 w-4 mr-2" />
            View Details
          </Button>
          <Button 
            variant="default" 
            size="sm"
            className="flex-1"
            onClick={() => onAddViolation(student)}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Violation
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};