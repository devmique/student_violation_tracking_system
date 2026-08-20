import { Violation } from "@/types/student";

export type Preset = "week" | "month" | "year" | "all";

export const PRESETS: { value: Preset; label: string }[] = [
  { value: "week", label: "This Week" },
  { value: "month", label: "This Month" },
  { value: "year", label: "This Year" },
  { value: "all", label: "All Time" },
];

const startOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate());

export interface PeriodStats {
  total: number;
  minor: number;
  major: number;
  resolved: number;
  unresolved: number;
  students: number;
}

/** Violations falling inside the preset's window — the same window bucketViolations charts. */
export const filterByPreset = (violations: Violation[], preset: Preset): Violation[] => {
  if (preset === "all") return violations;
  const now = new Date();

  if (preset === "week") {
    const start = startOfDay(now);
    start.setDate(start.getDate() - 6);
    return violations.filter((v) => startOfDay(new Date(v.dateCommitted)) >= start);
  }

  return violations.filter((v) => {
    const d = new Date(v.dateCommitted);
    if (d.getFullYear() !== now.getFullYear()) return false;
    return preset === "year" || d.getMonth() === now.getMonth();
  });
};

export const deriveStats = (violations: Violation[]): PeriodStats => ({
  total: violations.length,
  minor: violations.filter((v) => v.severity === "Minor").length,
  major: violations.filter((v) => v.severity === "Major").length,
  resolved: violations.filter((v) => v.resolved).length,
  unresolved: violations.filter((v) => !v.resolved).length,
  students: new Set(violations.map((v) => v.studentId)).size,
});

export const bucketViolations = <T,>(
  violations: Violation[],
  preset: Preset,
  aggregate: (bucket: Violation[]) => T
): (T & { label: string })[] => {
  const now = new Date();

  if (preset === "week") {
    const start = startOfDay(now);
    start.setDate(start.getDate() - 6);
    return Array.from({ length: 7 }, (_, i) => {
      const day = new Date(start);
      day.setDate(start.getDate() + i);
      const bucket = violations.filter(
        (v) => startOfDay(new Date(v.dateCommitted)).getTime() === day.getTime()
      );
      return { label: day.toLocaleDateString("default", { weekday: "short" }), ...aggregate(bucket) };
    });
  }

  if (preset === "month") {
    const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
    return Array.from({ length: daysInMonth }, (_, i) => {
      const day = i + 1;
      const bucket = violations.filter((v) => {
        const d = new Date(v.dateCommitted);
        return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth() && d.getDate() === day;
      });
      return { label: String(day), ...aggregate(bucket) };
    });
  }

  if (preset === "year") {
    return Array.from({ length: 12 }, (_, month) => {
      const bucket = violations.filter((v) => {
        const d = new Date(v.dateCommitted);
        return d.getFullYear() === now.getFullYear() && d.getMonth() === month;
      });
      const label = new Date(now.getFullYear(), month, 1).toLocaleString("default", { month: "short" });
      return { label, ...aggregate(bucket) };
    });
  }

  // all time: bucket by month across the full data range
  if (violations.length === 0) return [];
  const times = violations.map((v) => new Date(v.dateCommitted).getTime());
  const min = new Date(Math.min(...times));
  const max = new Date(Math.max(...times));
  const cursor = new Date(min.getFullYear(), min.getMonth(), 1);
  const end = new Date(max.getFullYear(), max.getMonth(), 1);
  const months: (T & { label: string })[] = [];
  while (cursor <= end) {
    const bucket = violations.filter((v) => {
      const d = new Date(v.dateCommitted);
      return d.getFullYear() === cursor.getFullYear() && d.getMonth() === cursor.getMonth();
    });
    months.push({
      label: cursor.toLocaleString("default", { month: "short", year: "2-digit" }),
      ...aggregate(bucket),
    });
    cursor.setMonth(cursor.getMonth() + 1);
  }
  return months;
};
