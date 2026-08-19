import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { CartesianGrid, Line, LineChart, XAxis } from "recharts";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Violation } from "@/types/student";

const chartConfig = {
  count: { label: "Violations", color: "hsl(var(--danger))" },
};

type Preset = "week" | "month" | "year" | "all";

const PRESETS: { value: Preset; label: string }[] = [
  { value: "week", label: "This Week" },
  { value: "month", label: "This Month" },
  { value: "year", label: "This Year" },
  { value: "all", label: "All Time" },
];

const startOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate());

const buildTrendData = (violations: Violation[], preset: Preset) => {
  const now = new Date();

  if (preset === "week") {
    const start = startOfDay(now);
    start.setDate(start.getDate() - 6);
    return Array.from({ length: 7 }, (_, i) => {
      const day = new Date(start);
      day.setDate(start.getDate() + i);
      const count = violations.filter(
        (v) => startOfDay(new Date(v.dateCommitted)).getTime() === day.getTime()
      ).length;
      return { label: day.toLocaleDateString("default", { weekday: "short" }), count };
    });
  }

  if (preset === "month") {
    const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
    return Array.from({ length: daysInMonth }, (_, i) => {
      const day = i + 1;
      const count = violations.filter((v) => {
        const d = new Date(v.dateCommitted);
        return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth() && d.getDate() === day;
      }).length;
      return { label: String(day), count };
    });
  }

  if (preset === "year") {
    return Array.from({ length: 12 }, (_, month) => {
      const count = violations.filter((v) => {
        const d = new Date(v.dateCommitted);
        return d.getFullYear() === now.getFullYear() && d.getMonth() === month;
      }).length;
      const label = new Date(now.getFullYear(), month, 1).toLocaleString("default", { month: "short" });
      return { label, count };
    });
  }

  // all time: bucket by month across the full data range
  if (violations.length === 0) return [];
  const times = violations.map((v) => new Date(v.dateCommitted).getTime());
  const min = new Date(Math.min(...times));
  const max = new Date(Math.max(...times));
  const cursor = new Date(min.getFullYear(), min.getMonth(), 1);
  const end = new Date(max.getFullYear(), max.getMonth(), 1);
  const months: { label: string; count: number }[] = [];
  while (cursor <= end) {
    const count = violations.filter((v) => {
      const d = new Date(v.dateCommitted);
      return d.getFullYear() === cursor.getFullYear() && d.getMonth() === cursor.getMonth();
    }).length;
    months.push({ label: cursor.toLocaleString("default", { month: "short", year: "2-digit" }), count });
    cursor.setMonth(cursor.getMonth() + 1);
  }
  return months;
};

export const ViolationsTrendChart = ({ violations }: { violations: Violation[] }) => {
  const [preset, setPreset] = useState<Preset>("month");
  const data = useMemo(() => buildTrendData(violations, preset), [violations, preset]);

  return (
    <Card className="shadow-soft h-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 flex-wrap gap-2">
        <CardTitle className="text-lg">Violations Over Time</CardTitle>
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
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[250px] w-full">
          <LineChart data={data}>
            <CartesianGrid vertical={false} />
            <XAxis dataKey="label" tickLine={false} axisLine={false} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Line type="monotone" dataKey="count" stroke="var(--color-count)" strokeWidth={2} dot={false} />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};
