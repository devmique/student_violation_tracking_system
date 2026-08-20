import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Skeleton } from "@/components/ui/skeleton";
import { Cell, Pie, PieChart } from "recharts";

export interface DonutSlice {
  key: string;
  label: string;
  value: number;
  color: string;
}

export const ViolationDonutCard = ({ title, data }: { title: string; data: DonutSlice[] | null }) => {
  if (!data) {
    return (
      <Card className="shadow-soft h-full">
        <CardHeader>
          <CardTitle className="text-lg">{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className="mx-auto aspect-square h-[300px] rounded-full" />
          <div className="flex justify-center gap-5 mt-3">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-24" />
          </div>
        </CardContent>
      </Card>
    );
  }

  const total = data.reduce((sum, d) => sum + d.value, 0);
  const config = Object.fromEntries(data.map((d) => [d.key, { label: d.label, color: d.color }]));

  return (
    <Card className="shadow-soft h-full">
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={config} className="mx-auto aspect-square h-[300px]">
          <PieChart>
            <ChartTooltip content={<ChartTooltipContent hideLabel nameKey="key" />} />
            <Pie data={data} dataKey="value" nameKey="key" innerRadius={78} outerRadius={122} strokeWidth={2}>
              {data.map((entry) => (
                <Cell key={entry.key} fill={entry.color} />
              ))}
            </Pie>
          </PieChart>
        </ChartContainer>
        <div className="flex flex-wrap justify-center gap-x-5 gap-y-1 mt-3 text-sm">
          {data.map((entry) => (
            <div key={entry.key} className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full" style={{ background: entry.color }} />
              <span className="text-muted-foreground">
                {entry.label} ({total ? Math.round((entry.value / total) * 100) : 0}%)
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
