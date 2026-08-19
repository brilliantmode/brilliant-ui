export const analyticsOverviewSource = `import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";
import { DashboardGrid, DashboardLayout, DashboardSection, DashboardSectionHeader, DashboardSectionTitle } from "@/components/ui/dashboard-layout";
import { Stat, StatDescription, StatHeader, StatLabel, StatValue, TrendIndicator } from "@/components/ui/stat";

const data = [{ day: "Mon", revenue: 18 }, { day: "Tue", revenue: 24 }, { day: "Wed", revenue: 21 }, { day: "Thu", revenue: 31 }, { day: "Fri", revenue: 37 }, { day: "Sat", revenue: 34 }, { day: "Sun", revenue: 44 }];
const config = { revenue: { label: "Revenue", color: "var(--brilliant-chart-1)" } } satisfies ChartConfig;

export function AnalyticsOverviewDashboard() {
  return (
    <DashboardLayout>
      <DashboardGrid>{[["Revenue", "$128.4K", "12.4%"], ["Customers", "24,892", "4.8%"], ["Conversion", "8.2%", "1.1%"], ["Churn", "1.8%", "0.3%"]].map(([label, value, trend]) => <Stat key={label}><StatHeader><StatLabel>{label}</StatLabel><TrendIndicator direction={label === "Churn" ? "negative" : "positive"} value={trend} /></StatHeader><StatValue>{value}</StatValue><StatDescription>Previous 30 days</StatDescription></Stat>)}</DashboardGrid>
      <DashboardSection><DashboardSectionHeader><DashboardSectionTitle>Revenue trend</DashboardSectionTitle><span className="text-xs text-muted-foreground">Last 7 days</span></DashboardSectionHeader><div className="rounded-lg border border-border bg-surface p-4"><ChartContainer className="h-64" config={config} title="Seven day revenue trend"><AreaChart accessibilityLayer data={data}><CartesianGrid vertical={false} /><XAxis dataKey="day" /><YAxis /><ChartTooltip content={<ChartTooltipContent />} /><Area dataKey="revenue" fill="var(--color-revenue)" fillOpacity={0.14} stroke="var(--color-revenue)" strokeWidth={2} /></AreaChart></ChartContainer></div></DashboardSection>
    </DashboardLayout>
  );
}
`;

export const systemHealthDashboardSource = `import { DashboardGrid, DashboardLayout, DashboardSection, DashboardSectionHeader, DashboardSectionTitle } from "@/components/ui/dashboard-layout";
import { Meter } from "@/components/ui/meter";
import { Stat, StatLabel, StatValue } from "@/components/ui/stat";
import { Status, StatusBar } from "@/components/ui/status";

const services = [["API gateway", "99.99%", "positive"], ["Event pipeline", "99.94%", "warning"], ["Billing sync", "98.72%", "critical"]] as const;

export function SystemHealthDashboard() {
  return (
    <DashboardLayout>
      <DashboardGrid><Stat><StatLabel>Uptime</StatLabel><StatValue>99.98%</StatValue></Stat><Stat><StatLabel>P95 latency</StatLabel><StatValue>184 ms</StatValue></Stat><Stat><StatLabel>Open incidents</StatLabel><StatValue>2</StatValue></Stat><Stat><StatLabel>Error rate</StatLabel><StatValue>0.08%</StatValue></Stat></DashboardGrid>
      <DashboardSection><DashboardSectionHeader><DashboardSectionTitle>Service health</DashboardSectionTitle><Status pulse tone="positive">Monitoring live</Status></DashboardSectionHeader><div className="grid gap-4 rounded-lg border border-border bg-surface p-4"><StatusBar items={[{ label: "Healthy", tone: "positive", value: 82 }, { label: "Degraded", tone: "warning", value: 12 }, { label: "Failed", tone: "critical", value: 6 }]} />{services.map(([service, uptime, tone]) => <div className="flex items-center justify-between border-t border-border pt-3" key={service}><Status tone={tone}>{service}</Status><span className="font-mono text-xs tabular-nums">{uptime}</span></div>)}<Meter label="Regional capacity" value={74} valueLabel="74%" /></div></DashboardSection>
    </DashboardLayout>
  );
}
`;

export const capacityDashboardSource = `import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";
import { DashboardLayout, DashboardSection, DashboardSectionHeader, DashboardSectionTitle } from "@/components/ui/dashboard-layout";
import { Meter } from "@/components/ui/meter";

const data = [{ team: "Core", used: 82, available: 18 }, { team: "Growth", used: 64, available: 36 }, { team: "Data", used: 91, available: 9 }, { team: "Support", used: 48, available: 52 }];
const config = { used: { label: "Used", color: "var(--brilliant-chart-1)" }, available: { label: "Available", color: "var(--brilliant-chart-4)" } } satisfies ChartConfig;

export function CapacityDashboard() {
  return <DashboardLayout><DashboardSection><DashboardSectionHeader><DashboardSectionTitle>Capacity by team</DashboardSectionTitle><span className="text-xs text-muted-foreground">Current billing period</span></DashboardSectionHeader><div className="grid gap-5 rounded-lg border border-border bg-surface p-4 lg:grid-cols-[1.4fr_0.6fr]"><ChartContainer className="h-64" config={config} title="Capacity used by team"><BarChart accessibilityLayer data={data}><CartesianGrid vertical={false} /><XAxis dataKey="team" /><YAxis /><ChartTooltip content={<ChartTooltipContent />} /><ChartLegend content={<ChartLegendContent />} /><Bar dataKey="used" fill="var(--color-used)" stackId="capacity" /><Bar dataKey="available" fill="var(--color-available)" stackId="capacity" /></BarChart></ChartContainer><div className="grid content-center gap-5"><Meter label="Storage" value={82} valueLabel="8.2 / 10 TB" tone="warning" /><Meter label="Events" value={64} valueLabel="6.4 / 10M" /><Meter label="Seats" value={91} valueLabel="91 / 100" tone="critical" /></div></div></DashboardSection></DashboardLayout>;
}
`;
