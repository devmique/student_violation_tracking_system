import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, Users, Clock, TrendingUp } from "lucide-react";
import { ViolationStats } from "@/types/student";
//import { Skeleton } from "../ui/skeleton";
export interface StatsCardsProps {
  stats: ViolationStats;
  studentCount: number;
  loading?: boolean;
}

export const StatsCards = ({ stats, studentCount }: StatsCardsProps) => {
  const cards = [
    {
      title: "Total Students",
      value: studentCount.toString(),
      icon: Users,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      title: "Total Violations",
      value: stats.total.toString(),
      icon: AlertTriangle,
      color: "text-danger",
      bgColor: "bg-danger/10",
      subtitle: `${stats.thisMonth} this month`,
    },
    {
      title: "This Week",
      value: stats.thisWeek.toString(),
      icon: Clock,
      color: "text-warning",
      bgColor: "bg-warning/10",
      subtitle: "New violations",
    },
    {
      title: "Cases",
      icon: TrendingUp,
      color: "text-danger",
      bgColor: "bg-danger/10",
      subtitle: `${stats.major} major, ${stats.minor} minor`,
    },
  ];

  return (
 
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {cards.map((card, index) => (
        <Card key={index} className="shadow-soft hover:shadow-medium transition-smooth">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {card.title}
            </CardTitle>
            <div className={`p-2 rounded-lg ${card.bgColor}`}>
              <card.icon className={`h-4 w-4 ${card.color}`} />
            </div>
          </CardHeader>
          <CardContent>
            
              
            <div className="text-2xl font-bold text-foreground">{card.value}</div>
            {card.subtitle && (
              <p className="text-xs text-muted-foreground mt-1">{card.subtitle}</p>

            )}
         
          </CardContent>
        </Card>
      ))}
    </div>
  );
};