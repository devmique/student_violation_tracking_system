import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Cell, Pie, PieChart } from "recharts";
import { ViolationStats } from "@/types/student";

type SliceConfig = Record<string, { label: string; color: string }>;

const resolutionConfig: SliceConfig = {
  resolved: { label: "Resolved", color: "hsl(var(--success))" },
  unresolved: { label: "Unresolved", color: "hsl(var(--danger))" },
};

const severityConfig: SliceConfig = {
  minor: { label: "Minor", color: "hsl(var(--warning))" },
  major: { label: "Major", color: "hsl(var(--danger))" },
};

const Donut = ({ title, config, data }: { title: string; config: SliceConfig; data: { key: string; value: number }[] }) => {
  const total = data.reduce((sum, d) => sum + d.value, 0);

  return (
    <div>
      <p className="text-sm font-medium text-muted-foreground mb-1 text-center">{title}</p>
      <ChartContainer config={config} className="mx-auto aspect-square h-[130px]">
        <PieChart>
          <ChartTooltip content={<ChartTooltipContent hideLabel nameKey="key" />} />
          <Pie data={data} dataKey="value" nameKey="key" innerRadius={35} outerRadius={55} strokeWidth={2}>
            {data.map((entry) => (
              <Cell key={entry.key} fill={config[entry.key].color} />
            ))}
          </Pie>
        </PieChart>
      </ChartContainer>
      <div className="flex flex-wrap justify-center gap-x-3 gap-y-1 mt-2 text-xs">
        {data.map((entry) => (
          <div key={entry.key} className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full" style={{ background: config[entry.key].color }} />
            <span className="text-muted-foreground">
              {config[entry.key].label} ({total ? Math.round((entry.value / total) * 100) : 0}%)
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export const ViolationBreakdownDonuts = ({ stats }: { stats: ViolationStats }) => (
  <Card className="shadow-soft h-full">
    <CardHeader>
      <CardTitle className="text-lg">Breakdown</CardTitle>
    </CardHeader>
    <CardContent className="grid grid-cols-2 gap-2">
      <Donut
        title="Resolution"
        config={resolutionConfig}
        data={[
          { key: "resolved", value: stats.resolved },
          { key: "unresolved", value: stats.unresolved },
        ]}
      />
      <Donut
        title="Severity"
        config={severityConfig}
        data={[
          { key: "minor", value: stats.minor },
          { key: "major", value: stats.major },
        ]}
      />
    </CardContent>
  </Card>
);
