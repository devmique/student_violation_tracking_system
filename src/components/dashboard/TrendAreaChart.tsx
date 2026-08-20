import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Skeleton } from "@/components/ui/skeleton";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import { Violation } from "@/types/student";
import { Preset, bucketViolations } from "@/lib/violationBuckets";

export interface TrendSeries {
  key: string;
  label: string;
  color: string;
  match: (violation: Violation) => boolean;
}

export const TrendAreaChart = ({
  title,
  series,
  violations,
  preset,
  loading,
}: {
  title: string;
  series: TrendSeries[];
  violations: Violation[];
  preset: Preset;
  loading?: boolean;
}) => {
  const data = useMemo(
    () =>
      bucketViolations(violations, preset, (bucket) =>
        Object.fromEntries(series.map((s) => [s.key, bucket.filter(s.match).length]))
      ),
    [violations, preset, series]
  );

  const config = Object.fromEntries(series.map((s) => [s.key, { label: s.label, color: s.color }]));
  const isEmpty = data.length === 0 || data.every((row) => series.every((s) => row[s.key] === 0));

  return (
    <Card className="shadow-soft h-full">
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <Skeleton className="h-[300px] w-full" />
        ) : isEmpty ? (
          <p className="h-[300px] grid place-items-center text-sm text-muted-foreground">
            No violations in this period.
          </p>
        ) : (
          <ChartContainer config={config} className="h-[300px] w-full">
            <AreaChart data={data}>
              <defs>
                {series.map((s) => (
                  <linearGradient key={s.key} id={`fill-${s.key}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={`var(--color-${s.key})`} stopOpacity={0.5} />
                    <stop offset="95%" stopColor={`var(--color-${s.key})`} stopOpacity={0.05} />
                  </linearGradient>
                ))}
              </defs>
              <CartesianGrid vertical={false} />
              <XAxis dataKey="label" tickLine={false} axisLine={false} />
              <ChartTooltip content={<ChartTooltipContent />} />
              {series.map((s) => (
                <Area
                  key={s.key}
                  type="monotone"
                  dataKey={s.key}
                  stroke={`var(--color-${s.key})`}
                  strokeWidth={2}
                  fill={`url(#fill-${s.key})`}
                  dot={false}
                />
              ))}
            </AreaChart>
          </ChartContainer>
        )}
        <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 mt-3 text-xs">
          {series.map((s) => (
            <div key={s.key} className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full" style={{ background: s.color }} />
              <span className="text-muted-foreground">{s.label}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
