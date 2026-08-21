import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertTriangle, Users, TrendingUp, CheckCircle2 } from "lucide-react";
import { PeriodStats } from "@/lib/violationBuckets";

export interface StatsCardsProps {
  stats: PeriodStats | null;
}

interface StatPart {
  label: string;
  value: number;
  textColor: string;
}

const StatCardShell = ({
  title,
  icon: Icon,
  iconColor,
  iconBg,
  children,
}: {
  title: string;
  icon: typeof AlertTriangle;
  iconColor: string;
  iconBg: string;
  children: React.ReactNode;
}) => (
  <Card className="shadow-soft hover:shadow-medium transition-smooth">
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
      <div className={`p-2 rounded-lg ${iconBg}`}>
        <Icon className={`h-4 w-4 ${iconColor}`} />
      </div>
    </CardHeader>
    <CardContent>{children}</CardContent>
  </Card>
);

const SingleStat = ({ value, subtitle }: { value?: number; subtitle: string }) =>
  value === undefined ? (
    <>
      <Skeleton className="h-8 w-16" />
      <Skeleton className="h-3 w-24 mt-2" />
    </>
  ) : (
    <>
      <div className="text-2xl font-bold text-foreground">{value}</div>
      <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
    </>
  );

const SplitStat = ({ parts }: { parts?: [StatPart, StatPart] }) => {
  if (!parts) {
    return (
      <div className="flex items-baseline gap-4">
        {[0, 1].map((i) => (
          <div key={i}>
            <Skeleton className="h-8 w-10" />
            <Skeleton className="h-3 w-14 mt-1.5" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="flex items-baseline gap-4">
      {parts.map((part) => (
        <div key={part.label}>
          <div className={`text-2xl font-bold ${part.textColor}`}>{part.value}</div>
          <p className="text-xs text-muted-foreground mt-0.5">{part.label}</p>
        </div>
      ))}
    </div>
  );
};

export const StatsCards = ({ stats }: StatsCardsProps) => (
  <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
    <StatCardShell title="Total Violations" icon={AlertTriangle} iconColor="text-danger" iconBg="bg-danger/10">
      <SingleStat value={stats?.total} subtitle="In selected period" />
    </StatCardShell>

    <StatCardShell title="Students Involved" icon={Users} iconColor="text-primary" iconBg="bg-primary/10">
      <SingleStat value={stats?.students} subtitle="With violations" />
    </StatCardShell>

    <StatCardShell title="Severity" icon={TrendingUp} iconColor="text-muted-foreground" iconBg="bg-muted">
      <SplitStat
        parts={
          stats && [
            { label: "Major", value: stats.major, textColor: "text-danger" },
            { label: "Minor", value: stats.minor, textColor: "text-warning" },
          ]
        }
      />
    </StatCardShell>

    <StatCardShell title="Resolution" icon={CheckCircle2} iconColor="text-muted-foreground" iconBg="bg-muted">
      <SplitStat
        parts={
          stats && [
            { label: "Resolved", value: stats.resolved, textColor: "text-success" },
            { label: "Unresolved", value: stats.unresolved, textColor: "text-danger" },
          ]
        }
      />
    </StatCardShell>
  </div>
);
