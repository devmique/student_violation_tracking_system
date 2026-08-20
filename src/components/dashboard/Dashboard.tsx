import { useState, useMemo, useEffect } from "react";
import { Header } from "@/components/layout/Header";
import { SidebarNav } from "@/components/layout/SidebarNav";
import { StatsCards } from "./StatsCards";
import { StudentWithViolations } from "@/types/student";
import { TrendAreaChart, TrendSeries } from "./TrendAreaChart";
import { ViolationDonutCard } from "./ViolationDonutCard";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Card, CardContent } from "@/components/ui/card";
import { AlertTriangle } from "lucide-react";
import { Preset, PRESETS, filterByPreset, deriveStats } from "@/lib/violationBuckets";
import axios from "axios";

const SEVERITY_SERIES: TrendSeries[] = [
  { key: "minor", label: "Minor", color: "hsl(var(--warning))", match: (v) => v.severity === "Minor" },
  { key: "major", label: "Major", color: "hsl(var(--danger))", match: (v) => v.severity === "Major" },
];

const RESOLUTION_SERIES: TrendSeries[] = [
  { key: "resolved", label: "Resolved", color: "hsl(var(--success))", match: (v) => v.resolved },
  { key: "unresolved", label: "Unresolved", color: "hsl(var(--danger))", match: (v) => !v.resolved },
];

export const Dashboard = () => {
  const [students, setStudents] = useState<StudentWithViolations[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [preset, setPreset] = useState<Preset>("month");
  const token = localStorage.getItem("token");

  const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

  const allViolations = useMemo(() => students.flatMap((s) => s.violations), [students]);
  const periodViolations = useMemo(() => filterByPreset(allViolations, preset), [allViolations, preset]);
  const stats = useMemo(() => (loading ? null : deriveStats(periodViolations)), [loading, periodViolations]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const resStudents = await axios.get(`${API_BASE}/students`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const dataStudents = resStudents.data;
        setStudents(Array.isArray(dataStudents) ? dataStudents : []);
      } catch (err) {
        console.error("Fetch error:", err);
        setStudents([]);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto px-6 flex flex-col md:flex-row">
        <SidebarNav />
        <div className="flex-1 min-w-0 py-8 md:pl-6">
          <div className="flex items-center justify-between flex-wrap gap-3 mb-6">
            <h2 className="text-2xl font-semibold text-foreground">Dashboard</h2>
            <ToggleGroup
              type="single"
              size="sm"
              value={preset}
              onValueChange={(value) => value && setPreset(value as Preset)}
            >
              {PRESETS.map((p) => (
                <ToggleGroupItem key={p.value} value={p.value} className="text-xs px-3">
                  {p.label}
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
          </div>

          {error ? (
            <Card className="shadow-soft">
              <CardContent className="text-center py-12">
                <AlertTriangle className="h-12 w-12 mx-auto mb-4 text-danger opacity-70" />
                <h3 className="text-lg font-semibold text-foreground mb-2">Couldn't load dashboard data</h3>
                <p className="text-muted-foreground">
                  The server didn't respond. These figures would otherwise read as zero, so nothing is shown.
                </p>
              </CardContent>
            </Card>
          ) : (
            <>
              <div className="mb-8">
                <StatsCards stats={stats} />
              </div>

              {/* Each row pairs a trend with the donut for the same dimension. */}
              <div className="mb-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
                <TrendAreaChart
                  title="Violations Over Time"
                  series={SEVERITY_SERIES}
                  violations={allViolations}
                  preset={preset}
                  loading={loading}
                />
                <ViolationDonutCard
                  title="Severity"
                  data={
                    stats && [
                      { key: "minor", label: "Minor", value: stats.minor, color: "hsl(var(--warning))" },
                      { key: "major", label: "Major", value: stats.major, color: "hsl(var(--danger))" },
                    ]
                  }
                />

                <TrendAreaChart
                  title="Resolution Over Time"
                  series={RESOLUTION_SERIES}
                  violations={allViolations}
                  preset={preset}
                  loading={loading}
                />
                <ViolationDonutCard
                  title="Resolution"
                  data={
                    stats && [
                      { key: "resolved", label: "Resolved", value: stats.resolved, color: "hsl(var(--success))" },
                      { key: "unresolved", label: "Unresolved", value: stats.unresolved, color: "hsl(var(--danger))" },
                    ]
                  }
                />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
