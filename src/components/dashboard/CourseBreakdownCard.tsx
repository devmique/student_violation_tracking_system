import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Skeleton } from "@/components/ui/skeleton";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { Course, StudentWithViolations, Violation } from "@/types/student";
import { countByCourse } from "@/lib/violationBuckets";

// Full course names don't fit the narrow column; the tooltip carries them instead.
const COURSE_ABBR: Record<Course, string> = {
  "Information Technology": "IT",
  "Automotive Aftersales": "AAS",
  "Electro Mechanic Technology": "EMT",
  "Mechanical Technology": "MT",
};

const config = { count: { label: "Violations", color: "hsl(var(--primary))" } };

export const CourseBreakdownCard = ({
  students,
  violations,
  loading,
}: {
  students: StudentWithViolations[];
  violations: Violation[];
  loading?: boolean;
}) => {
  const data = useMemo(
    () =>
      countByCourse(students, violations).map(({ course, count }) => ({
        abbr: COURSE_ABBR[course],
        course,
        count,
      })),
    [students, violations]
  );

  return (
    <Card className="shadow-soft h-full">
      <CardHeader>
        <CardTitle className="text-lg">Violations by Course</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <Skeleton className="h-[300px] w-full" />
        ) : data.length === 0 ? (
          <p className="h-[300px] grid place-items-center text-sm text-muted-foreground">
            No violations in this period.
          </p>
        ) : (
          <ChartContainer config={config} className="h-[300px] w-full">
            <BarChart data={data} layout="vertical" margin={{ left: 4, right: 16 }}>
              <CartesianGrid horizontal={false} />
              <XAxis type="number" allowDecimals={false} tickLine={false} axisLine={false} />
              <YAxis
                type="category"
                dataKey="abbr"
                width={44}
                tickLine={false}
                axisLine={false}
              />
              <ChartTooltip
                content={<ChartTooltipContent labelKey="course" nameKey="count" />}
              />
              <Bar dataKey="count" fill="var(--color-count)" radius={4} />
            </BarChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
};
