import { useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { User } from "lucide-react";
import { StudentWithViolations, Violation } from "@/types/student";
import { rankStudentsByViolations, SEVERITY_WEIGHT } from "@/lib/violationBuckets";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

export const TopStudentsCard = ({
  students,
  violations,
  loading,
}: {
  students: StudentWithViolations[];
  violations: Violation[];
  loading?: boolean;
}) => {
  const ranked = useMemo(
    () => rankStudentsByViolations(students, violations),
    [students, violations]
  );

  return (
    <Card className="shadow-soft h-full">
      <CardHeader>
        <CardTitle className="text-lg">Top Students with Violations</CardTitle>
        <CardDescription>
          Ranked by severity score (Major counts {SEVERITY_WEIGHT.Major}×)
        </CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-3">
            {[0, 1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-center gap-3">
                <Skeleton className="h-9 w-9 rounded-full" />
                <div className="flex-1">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-20 mt-1.5" />
                </div>
                <Skeleton className="h-4 w-6" />
              </div>
            ))}
          </div>
        ) : ranked.length === 0 ? (
          <p className="h-[300px] grid place-items-center text-sm text-muted-foreground">
            No violations in this period.
          </p>
        ) : (
          <ol className="space-y-3">
            {ranked.map((row, index) => {
              const picUrl = row.student.profilePic
                ? `${API_BASE.replace("/api", "")}${row.student.profilePic}`
                : null;

              return (
                <li key={row.student._id} className="flex items-center gap-3">
                  <span className="w-4 text-sm font-medium text-muted-foreground shrink-0">
                    {index + 1}
                  </span>

                  <div className="h-9 w-9 shrink-0 overflow-hidden rounded-full gradient-primary flex items-center justify-center">
                    {picUrl ? (
                      <img
                        src={picUrl}
                        alt={`${row.student.firstName} ${row.student.lastName}`}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <User className="h-4 w-4 text-primary-foreground" />
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-foreground">
                      {row.student.firstName} {row.student.lastName}
                    </p>
                    <p className="truncate text-xs text-muted-foreground">
                      {row.student.studentId}
                    </p>
                  </div>

                  <div className="shrink-0 text-right">
                    <div className="text-sm font-semibold text-foreground">{row.score}</div>
                    <p className="text-xs text-muted-foreground">
                      <span className="text-danger">{row.major}</span> /{" "}
                      <span className="text-warning">{row.minor}</span>
                    </p>
                  </div>
                </li>
              );
            })}
          </ol>
        )}
      </CardContent>
    </Card>
  );
};
