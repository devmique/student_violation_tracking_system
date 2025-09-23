import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { StudentData } from "@/types/student";

interface StudentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddStudent: (studentData: StudentData) => void;
}

const courses = [
  "Information Technology",
  "Automotive Aftersales",
  "Electro Mechanic Technology",
  "Mechanical Technology",
];

const programs = ["BS", "BTVTED", "Diploma"];

const years = [1, 2, 3, 4];

export const StudentModal = ({
  isOpen,
  onClose,
  onAddStudent,
}: StudentModalProps) => {
  const [formData, setFormData] = useState({
       studentId: "",
    firstName: "",
    middlename:"",
    lastName: "",
 
    email: "",
    course: "",
    program: "",
    year: "",
  });

  const handleChange = (name: string, value: string) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = () => {
    onAddStudent(formData);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Student</DialogTitle>
        </DialogHeader>

        <div className="space-y-3">
               <Input
            placeholder="Student ID"
            value={formData.studentId}
            onChange={(e) => handleChange("studentId", e.target.value)}
          />
          <Input
            placeholder="First Name"
            value={formData.firstName}
            onChange={(e) => handleChange("firstName", e.target.value)}
            />
          <Input
            placeholder="Middle Name"
            value={formData.middlename}
            onChange={(e) => handleChange("middlename", e.target.value) }
            />
          <Input
            placeholder="Last Name"
            value={formData.lastName}
            onChange={(e) => handleChange("lastName", e.target.value)}
            />
          <Input
            placeholder="Email"
            value={formData.email}
            onChange={(e) => handleChange("email", e.target.value)}
       />
          {/* Course Select */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">
              Course
            </label>
            <Select
              value={formData.course}
              onValueChange={(val) => handleChange("course", val)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select course" />
              </SelectTrigger>
              <SelectContent>
                {courses.map((course) => (
                  <SelectItem key={course} value={course}>
                    {course}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Program Select */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">
              Program
            </label>
            <Select
              value={formData.program}
              onValueChange={(val) => handleChange("program", val)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select program" />
              </SelectTrigger>
              <SelectContent>
                {programs.map((program) => (
                  <SelectItem key={program} value={program}>
                    {program}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Year Select */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">
              Year Level
            </label>
            <Select
              value={formData.year}
              onValueChange={(val) => handleChange("year", val)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select year" />
              </SelectTrigger>
              <SelectContent>
                {years.map((year) => (
                  <SelectItem key={year} value={year.toString()}>
                    Year {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>Add Student</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
