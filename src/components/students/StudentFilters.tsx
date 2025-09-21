import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X, Filter } from "lucide-react";
import { Course, Program } from "@/types/student";

interface StudentFiltersProps {
  selectedCourse: Course | "All";
  selectedProgram: Program | "All";
  selectedYear: number | "All";
  onCourseChange: (course: Course | "All") => void;
  onProgramChange: (program: Program | "All") => void;
  onYearChange: (year: number | "All") => void;
  onClearFilters: () => void;
}

const courses: (Course | "All")[] = [
  "All",
  "Information Technology",
  "Automotive Aftersales",
  "Electro Mechanic Technology",
  "Mechanical Technology",
];

const programs: (Program | "All")[] = [
  "All",
  "BS",
  "BTVTED",
  "Diploma",
];

const years: (number | "All")[] = ["All", 1, 2, 3, 4];

export const StudentFilters = ({
  selectedCourse,
  selectedProgram,
  selectedYear,
  onCourseChange,
  onProgramChange,
  onYearChange,
  onClearFilters,
}: StudentFiltersProps) => {
  const hasActiveFilters = selectedCourse !== "All" || selectedProgram !== "All" || selectedYear !== "All";

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium text-foreground">Filters</span>
        </div>
        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={onClearFilters}>
            <X className="h-4 w-4 mr-2" />
            Clear All
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground">Course</label>
          <Select value={selectedCourse} onValueChange={onCourseChange}>
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

        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground">Program</label>
          <Select value={selectedProgram} onValueChange={onProgramChange}>
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

        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground">Year Level</label>
          <Select value={selectedYear?.toString()} onValueChange={(value) => onYearChange(value === "All" ? "All" : parseInt(value))}>
            <SelectTrigger>
              <SelectValue placeholder="Select year" />
            </SelectTrigger>
            <SelectContent>
              {years.map((year) => (
                <SelectItem key={year} value={year.toString()}>
                  {year === "All" ? "All Years" : `Year ${year}`}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2">
          <span className="text-sm text-muted-foreground">Active filters:</span>
          {selectedCourse !== "All" && (
            <Badge variant="secondary" className="flex items-center space-x-1">
              <span>{selectedCourse}</span>
              <X 
                className="h-3 w-3 cursor-pointer hover:text-foreground" 
                onClick={() => onCourseChange("All")}
              />
            </Badge>
          )}
          {selectedProgram !== "All" && (
            <Badge variant="secondary" className="flex items-center space-x-1">
              <span>{selectedProgram}</span>
              <X 
                className="h-3 w-3 cursor-pointer hover:text-foreground" 
                onClick={() => onProgramChange("All")}
              />
            </Badge>
          )}
          {selectedYear !== "All" && (
            <Badge variant="secondary" className="flex items-center space-x-1">
              <span>Year {selectedYear}</span>
              <X 
                className="h-3 w-3 cursor-pointer hover:text-foreground" 
                onClick={() => onYearChange("All")}
              />
            </Badge>
          )}
        </div>
      )}
    </div>
  );
};