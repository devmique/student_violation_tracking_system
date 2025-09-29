import { useState, useMemo, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Users, AlertTriangle } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { StatsCards } from "./StatsCards";
import { StudentCard } from "@/components/students/StudentCard";
import { StudentFilters } from "@/components/students/StudentFilters";
import { ViolationModal } from "@/components/violations/ViolationModal";
import { StudentDetailModal } from "@/components/violations/StudentDetailModal";
import { StudentWithViolations, Course, Program, ViolationData, StudentData, ViolationStats } from "@/types/student";
import { useToast } from "@/hooks/use-toast";
import { StudentModal } from "@/components/students/StudentModal";
import axios from "axios";
import academicHeaderImage from "@/assets/dbbg.jpg";
import { ProfilePicModal } from "../students/ProfilePicModal";

export const Dashboard = () => {

  const [isStudentModalOpen, setIsStudentModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCourse, setSelectedCourse] = useState<Course | "All">("All");
  const [selectedProgram, setSelectedProgram] = useState<Program | "All">("All");
  const [selectedYear, setSelectedYear] = useState<number | "All">("All");
  const [selectedStudent, setSelectedStudent] = useState<StudentWithViolations | null>(null);
  const [isViolationModalOpen, setIsViolationModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [students, setStudents] = useState<StudentWithViolations[]>([]);
  const [stats, setStats] = useState<ViolationStats>(null);

  //profile state
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [profileStudent, setProfileStudent] = useState<StudentWithViolations | null>(null);
   const token = localStorage.getItem("token");
 
   const storedUser = localStorage.getItem("user");
   const currentUser = storedUser ? JSON.parse(storedUser) : null;

  const { toast } = useToast();
const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

const student = localStorage.getItem("student");

// Upload student profile picture
const handleUploadProfilePic = async (id: string, file: File) => {

  try {
    const formData = new FormData();
    formData.append("profilePic", file);

    // ✅ Use axios.post
    const res = await axios.post(
      `${API_BASE}/students/${id}/profile-pic`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`, // don't set Content-Type manually
        },
      }
    );

    const updatedStudent: StudentWithViolations = res.data; 

    //  Update state to reflect new profile pic
    setStudents((prev) => {
      const updated = prev.map((s) =>
        s._id === updatedStudent._id ? updatedStudent : s
      );
      localStorage.setItem("students", JSON.stringify(updated)); 
      return updated;
    });

   
    if (profileStudent && profileStudent._id === updatedStudent._id) {
      setProfileStudent(updatedStudent);
    }

   
  toast({
      title: "Profile Updated",
      description: "Profile picture updated successfully",
    });
    window.location.reload();
   
  } catch (err: any) {
    console.error(err);
    toast({
      title: "Error",
      description: err.message || "Could not update profile picture",
      variant: "destructive",
    });
  }
};

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

//fetch students and stats on component mount
useEffect(() => {
  const fetchData = async () => {
    try {
      // ✅ Fetch students
      const resStudents = await axios.get(`${API_BASE}/students`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const dataStudents = resStudents.data;
      setStudents(Array.isArray(dataStudents) ? dataStudents : []);
      localStorage.setItem("students", JSON.stringify(dataStudents));

      // ✅ Fetch stats
      const resStats = await axios.get(`${API_BASE}/violations/stats`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setStats(resStats.data);

    } catch (err) {
      console.error("Fetch error:", err);
      setStudents([]);
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

    // ✅ Refresh stats
    const resStats = await axios.get(`${API_BASE}/violations/stats`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setStats(resStats.data);

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

  return (
    <div className="min-h-screen bg-background">
      <Header searchQuery={searchQuery} onSearch={setSearchQuery} />
      
      {/* Hero Section */}
      <div className="relative">
        <div 
          className="h-48 bg-gradient-primary flex items-center justify-center bg-cover bg-center"
          style={{ backgroundImage: `url(${academicHeaderImage})` }}
        >
          <div className="absolute inset-0 bg-primary/80"></div>
          <div className="relative text-center text-primary-foreground">
            <h1 className="text-3xl font-bold mb-2">Student Violation Tracking System</h1>
            <p className="text-primary-foreground/90">Monitor and manage student violations efficiently</p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        {/* Statistics Cards */}
        <div className="mb-8">
         {stats && (
  <StatsCards stats={stats} studentCount={students.length} />
)}

        </div>

        {/* Filters and Content */}
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar with Filters */}
          <div className="lg:col-span-1">
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
          <div className="lg:col-span-3">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-semibold text-foreground">
                  Students ({filteredStudents.length})
                </h2>
                <p className="text-muted-foreground">
                  Showing {filteredStudents.length} of {students.length} students
                </p>
              </div>
             <Button 
               className="bg-primary text-primary-foreground hover:bg-primary-hover transition-smooth"
               onClick={() => setIsStudentModalOpen(true)}
             >
               <Plus className="h-4 w-4 mr-2" />
               Add New Student
             </Button>
             <StudentModal
               isOpen={isStudentModalOpen}
               onClose={() => setIsStudentModalOpen(false)}
               onAddStudent={handleAddStudent}
             />

            </div>

            {/* Students Grid */}
            {filteredStudents.length > 0 ? (
              <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                {filteredStudents.map((student) => (
                  <StudentCard
                    key={student._id}
                    student={student}
                    onViewDetails={handleViewDetails}
                    onAddViolation={handleAddViolation}
                    onChangeProfilePic={handleOpenProfileModal}
                  />
                ))}
              </div>
            ) : (
              <Card className="shadow-soft">
                <CardContent className="text-center py-12">
                  <AlertTriangle className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">No Students Found</h3>
                  <p className="text-muted-foreground mb-4">
                    {searchQuery ? "Try adjusting your search query or filters" : "No students match the current filters"}
                  </p>
                  {searchQuery && (
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
        onAddViolation={handleAddViolation}
      />
    </div>
  );
};