import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import { ViolationTrendPoint } from "@/types/student";

const chartConfig = {
  count: { label: "Violations", color: "hsl(var(--danger))" },
};

export const ViolationsTrendChart = ({ data }: { data: ViolationTrendPoint[] }) => (
  <Card className="shadow-soft">
    <CardHeader>
      <CardTitle className="text-lg">Violations Over Time</CardTitle>
    </CardHeader>
    <CardContent>
      <ChartContainer config={chartConfig} className="h-[250px] w-full">
        <BarChart data={data}>
          <CartesianGrid vertical={false} />
          <XAxis dataKey="month" tickLine={false} axisLine={false} />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Bar dataKey="count" fill="var(--color-count)" radius={4} />
        </BarChart>
      </ChartContainer>
    </CardContent>
  </Card>
);
