import { useState, useMemo, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Users, AlertTriangle } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { SidebarNav } from "@/components/layout/SidebarNav";
import { StudentCard } from "@/components/students/StudentCard";
import { StudentFilters } from "@/components/students/StudentFilters";
import { ViolationModal } from "@/components/violations/ViolationModal";
import { StudentDetailModal } from "@/components/violations/StudentDetailModal";
import { StudentWithViolations, Course, Program, ViolationData, StudentData } from "@/types/student";
import { AuthUser } from "@/types/user";
import { useToast } from "@/hooks/use-toast";
import { StudentModal } from "@/components/students/StudentModal";
import axios from "axios";
import { ProfilePicModal } from "@/components/students/ProfilePicModal";

export const StudentsPage = () => {

  const [isStudentModalOpen, setIsStudentModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCourse, setSelectedCourse] = useState<Course | "All">("All");
  const [selectedProgram, setSelectedProgram] = useState<Program | "All">("All");
  const [selectedYear, setSelectedYear] = useState<number | "All">("All");
  const [selectedStudent, setSelectedStudent] = useState<StudentWithViolations | null>(null);
  const [isViolationModalOpen, setIsViolationModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [students, setStudents] = useState<StudentWithViolations[]>([]);
  const [loadError, setLoadError] = useState(false);

  //profile state
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [profileStudent, setProfileStudent] = useState<StudentWithViolations | null>(null);
   const token = localStorage.getItem("token");

   const storedUser = localStorage.getItem("user");
   const currentUser: AuthUser | null = storedUser ? JSON.parse(storedUser) : null;
   const isAdmin = currentUser?.role === "admin";

  const { toast } = useToast();
const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

// Upload student profile picture
const handleUploadProfilePic = async (id: string, file: File) => {
  if (!file) return;
  try {
    const formData = new FormData();
    formData.append("profilePic", file);

    const res = await axios.post(
      `${API_BASE}/students/${id}/profile-pic`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const updatedStudent = res.data;

    //  Update state to reflect new profile pic
   setStudents(prev =>
    prev.map(s =>
      s._id === updatedStudent._id
      ? { ...s, ...updatedStudent }
      : s
  )
);



  toast({
      title: "Profile Updated",
      description: "Profile picture updated successfully",
    });


  } catch (err: any) {
    console.error(err);
    toast({
      title: "Error",
      description: err.message || "Could not update profile picture",
      variant: "destructive",
    });
  }
};

useEffect(() => {
if(!profileStudent) return

const updated = students.find((s)=> s._id === profileStudent._id);
if(updated){
  setProfileStudent(updated)
}
},[students])
  // Filter students based on search and filters
  const filteredStudents = useMemo(() => {
    return students.filter(student => {
      const matchesSearch = searchQuery === "" ||
        `${student.firstName} ${student.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.studentId.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCourse = selectedCourse === "All" || student.course === selectedCourse;
      const matchesProgram = selectedProgram === "All" || student.program === selectedProgram;
      const matchesYear = selectedYear === "All" || student.year === selectedYear;

      return matchesSearch && matchesCourse && matchesProgram && matchesYear;
    });
  }, [students, searchQuery, selectedCourse, selectedProgram, selectedYear]);

//fetch students on mount
useEffect(() => {
  const fetchData = async () => {
    try {
      const resStudents = await axios.get(`${API_BASE}/students`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const dataStudents = resStudents.data;
      setStudents(Array.isArray(dataStudents) ? dataStudents : []);
      localStorage.setItem("students", JSON.stringify(dataStudents));
    } catch (err) {
      console.error("Fetch error:", err);
      setStudents([]);
      setLoadError(true);
    }
  };

  fetchData();
}, []);


//Add student
const handleAddStudent = async (studentData: StudentData) => {
  try {
    // ✅ Add student
    await axios.post(`${API_BASE}/students`, studentData, {
      headers: { Authorization: `Bearer ${token}` },
    });

    // ✅ Refresh students list
    const resUpdated = await axios.get(`${API_BASE}/students`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const updatedStudents = resUpdated.data;

    setStudents(Array.isArray(updatedStudents) ? updatedStudents : []);
    localStorage.setItem("students", JSON.stringify(updatedStudents));

    toast({
      title: "Student Added",
      description: `${studentData.firstName} ${studentData.lastName} has been added.`,
    });
  } catch (err) {
    console.error("Error adding student:", err);

    toast({
      title: "Error",
      description: "There was an issue adding the student. Please try again.",
      variant: "destructive",
    });
  }
};

  const handleAddViolation = (student: StudentWithViolations) => {
    setSelectedStudent(student);
    setIsViolationModalOpen(true);
  };

  const handleViewDetails = (student: StudentWithViolations) => {
    setSelectedStudent(student);
    setIsDetailModalOpen(true);
  };

const handleSubmitViolation = async (violationData: ViolationData) => {
  if (!selectedStudent) return;

  try {
    // ✅ Add violation
    await axios.post(
      `${API_BASE}/violations`,
      {
        studentId: selectedStudent.studentId,
        ...violationData,
        createdBy: currentUser?.username || "Unknown User",
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    // ✅ Refresh students
    const resStudents = await axios.get(`${API_BASE}/students`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const updatedStudents = resStudents.data;
    setStudents(Array.isArray(updatedStudents) ? updatedStudents : []);
    localStorage.setItem("students", JSON.stringify(updatedStudents)); // ✅ persist

    toast({
      title: "Violation Added",
      description: `Successfully recorded violation for ${selectedStudent.firstName} ${selectedStudent.lastName}`,
    });
  } catch (err) {
    console.error("Error adding violation:", err);
    toast({
      title: "Error",
      description: "There was an issue adding the violation. Please try again.",
      variant: "destructive",
    });
  }
};
  const handleOpenProfileModal = (student: StudentWithViolations) => {
  setProfileStudent(student);
  setIsProfileModalOpen(true);
};

  const handleClearFilters = () => {
    setSelectedCourse("All");
    setSelectedProgram("All");
    setSelectedYear("All");
  };

  //delete student
  const handleDeleteStudents = async (student: StudentWithViolations) => {
  try {
    await axios.delete(`${API_BASE}/students/${student._id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    // Remove from UI instantly (no refetch needed)
    setStudents((prev) => prev.filter((s) => s._id !== student._id));

    setIsDetailModalOpen(false);
    toast({
      title: "Student Deleted",
      description: `${student.firstName} ${student.lastName} has been removed.`,
    });

  } catch (err) {
    console.error("Delete student error:", err);
    toast({
      title: "Error",
      description: "Failed to delete student",
      variant: "destructive",
    });
  }
};

//update student course/program/year
const handleUpdateStudent = async (id: string, data: { course: string; program: string; year: number }) => {
  try {
    const res = await axios.put(`${API_BASE}/students/${id}`, data, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const updated = res.data.student;

    setStudents((prev) => prev.map((s) => (s._id === id ? { ...s, ...updated } : s)));
    setSelectedStudent((prev) => (prev && prev._id === id ? { ...prev, ...updated } : prev));

    toast({
      title: "Student Updated",
      description: "Academic info updated successfully.",
    });
  } catch (err) {
    console.error("Update student error:", err);
    toast({
      title: "Error",
      description: "Failed to update student",
      variant: "destructive",
    });
  }
};

//toggle violation resolved status
const handleToggleViolationResolved = async (id: string, resolved: boolean) => {
  try {
    const res = await axios.put(
      `${API_BASE}/violations/${id}`,
      { resolved },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    const updated = res.data;

    setStudents((prev) =>
      prev.map((student) => ({
        ...student,
        violations: student.violations.map((v) =>
          v._id === id ? { ...v, resolved: updated.resolved } : v
        ),
      }))
    );
  } catch (err) {
    console.error("Toggle violation resolved error:", err);
    toast({
      title: "Error",
      description: "Failed to update violation status.",
      variant: "destructive",
    });
  }
};

//delete violation
const handleDeleteViolation = async (id: string) => {
  try {
    await axios.delete(`${API_BASE}/violations/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    //  Update UI without refetch
    setStudents((prev) =>
      prev.map((student) => ({
        ...student,
        violations: student.violations.filter((v) => v._id !== id),
      }))
    );

    toast({
      title: "Violation Deleted",
      description: "The violation has been removed.",
    });

  } catch (err) {
    console.error("Delete violation error:", err);
    toast({
      title: "Error",
      description: "Failed to delete violation",
      variant: "destructive",
    });
  }
};

  return (
    <div className="min-h-screen bg-background">
      <Header searchQuery={searchQuery} onSearch={setSearchQuery} />

      <div className="container mx-auto px-6 flex flex-col md:flex-row">
        <SidebarNav />
        <div className="flex-1 min-w-0 py-8 md:pl-6">
        {/* Filters and Content */}
        <div className="grid gap-8 xl:grid-cols-[260px_minmax(0,1fr)]">
          {/* Sidebar with Filters */}
          <div>
            <Card className="shadow-soft">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Users className="h-5 w-5" />
                  <span>Student Filters</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <StudentFilters
                  selectedCourse={selectedCourse}
                  selectedProgram={selectedProgram}
                  selectedYear={selectedYear}
                  onCourseChange={setSelectedCourse}
                  onProgramChange={setSelectedProgram}
                  onYearChange={setSelectedYear}
                  onClearFilters={handleClearFilters}
                />
              </CardContent>
            </Card>
          </div>

          {/* Main Content Area */}
          <div className="min-w-0">
            <div className="flex items-center justify-between flex-wrap gap-3 mb-6">
              <div>
                <h2 className="text-2xl font-semibold text-foreground">
                  Students ({filteredStudents.length})
                </h2>
                <p className="text-muted-foreground">
                  Showing {filteredStudents.length} of {students.length} students
                </p>
              </div>
             {isAdmin && (
               <Button
                 className="bg-primary text-primary-foreground hover:bg-primary-hover transition-smooth"
                 onClick={() => setIsStudentModalOpen(true)}
               >
                 <Plus className="h-4 w-4 mr-2" />
                 Add New Student
               </Button>
             )}
             <StudentModal
               isOpen={isStudentModalOpen}
               onClose={() => setIsStudentModalOpen(false)}
               onAddStudent={handleAddStudent}
             />

            </div>

            {/* Students Grid */}
            {filteredStudents.length > 0 ? (
              <div className="grid gap-6 grid-cols-[repeat(auto-fill,minmax(min(300px,100%),1fr))]">
                {filteredStudents.map((student) => (
                  <StudentCard
                    key={student._id}
                    student={student}
                    isAdmin={isAdmin}
                    onViewDetails={handleViewDetails}
                    onAddViolation={handleAddViolation}
                    onChangeProfilePic={handleOpenProfileModal}
                  />
                ))}
              </div>
            ) : (
              <Card className="shadow-soft">
                <CardContent className="text-center py-12">
                  <AlertTriangle
                    className={`h-12 w-12 mx-auto mb-4 ${
                      loadError ? "text-danger opacity-70" : "text-muted-foreground opacity-50"
                    }`}
                  />
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    {loadError ? "Couldn't load students" : "No Students Found"}
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    {loadError
                      ? "The server didn't respond. This is a connection problem, not an empty list."
                      : searchQuery
                        ? "Try adjusting your search query or filters"
                        : "No students match the current filters"}
                  </p>
                  {searchQuery && !loadError && (
                    <Button variant="outline" onClick={() => setSearchQuery("")}>
                      Clear Search
                    </Button>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
        </div>
      </div>

      {/* Modals */}
      <ViolationModal
        isOpen={isViolationModalOpen}
        onClose={() => setIsViolationModalOpen(false)}
        student={selectedStudent}
        onAddViolation={handleSubmitViolation}
      />
      <ProfilePicModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        student={profileStudent}
        onUpload={handleUploadProfilePic}
      />

      <StudentDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        student={selectedStudent}
        isAdmin={isAdmin}
        onAddViolation={handleAddViolation}
        onDeleteStudent={handleDeleteStudents}
        onDeleteViolation={handleDeleteViolation}
        onUpdateStudent={handleUpdateStudent}
        onToggleViolationResolved={handleToggleViolationResolved}
      />
    </div>
  );
};
