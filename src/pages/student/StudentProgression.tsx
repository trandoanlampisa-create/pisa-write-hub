import { Navigate } from "react-router-dom";
import { useMemo, useState } from "react";
import { PageShell } from "@/components/pisa/PageShell";
import { HeroBanner } from "@/components/pisa/HeroBanner";
import { MetricCard } from "@/components/pisa/MetricCard";
import { useAuth } from "@/context/AuthContext";
import { mockSubmissions, mockFeedback, getTask } from "@/data/mockData";
import type { TaskType } from "@/types";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip as RTooltip,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
} from "recharts";

const COLORS = {
  navy: "#293A91",
  pink: "#F25A98",
  yellow: "#FFC93C",
  purple: "#7B61FF",
  mint: "#3DD9B0",
};

const StudentProgression = () => {
  const { profile } = useAuth();
  const [taskType, setTaskType] = useState<TaskType>("task1");

  if (!profile) return <Navigate to="/login?role=student" replace />;

  const studentSubs = mockSubmissions
    .filter((s) => s.student_id === profile.id && s.submitted_at)
    .sort((a, b) => (a.submitted_at || "").localeCompare(b.submitted_at || ""));

  // Heatmap (current month)
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const counts = useMemo(() => {
    const map = new Map<number, number>();
    studentSubs.forEach((s) => {
      const d = new Date(s.submitted_at!);
      if (d.getFullYear() === year && d.getMonth() === month) {
        map.set(d.getDate(), (map.get(d.getDate()) || 0) + 1);
      }
    });
    return map;
  }, [studentSubs, year, month]);
  const maxCount = Math.max(1, ...counts.values());

  // Distribution
  const t1Count = studentSubs.filter((s) => getTask(s.task_id)?.task_type === "task1").length;
  const t2Count = studentSubs.filter((s) => getTask(s.task_id)?.task_type === "task2").length;
  const distribution = [
    { name: "Task 1", value: t1Count, color: COLORS.navy },
    { name: "Task 2", value: t2Count, color: COLORS.pink },
  ].filter((d) => d.value > 0);

  // Per-task stats
  const filtered = studentSubs.filter((s) => getTask(s.task_id)?.task_type === taskType);
  const withBand = filtered
    .map((s) => {
      const fb = mockFeedback.find((f) => f.submission_id === s.id);
      return fb ? { date: s.submitted_at!, band: fb.overall_band, id: s.id } : null;
    })
    .filter((x): x is { date: string; band: number; id: string } => !!x);

  const firstScore = withBand[0]?.band;
  const currentScore = withBand[withBand.length - 1]?.band;
  const bestScore = withBand.length ? Math.max(...withBand.map((x) => x.band)) : undefined;
  const targetScore = profile.target_band ?? 7;

  const last5 = withBand.slice(-5).map((x, i) => ({
    label: new Date(x.date).toLocaleDateString(undefined, { month: "short", day: "numeric" }),
    band: x.band,
    n: i + 1,
  }));

  const fmt = (v?: number) => (v == null ? "—" : v.toFixed(1));

  // Build heatmap grid with leading blanks for weekday alignment
  const firstWeekday = new Date(year, month, 1).getDay(); // 0=Sun
  const cells: Array<{ day?: number; count: number } | null> = [];
  for (let i = 0; i < firstWeekday; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push({ day: d, count: counts.get(d) || 0 });

  const heatColor = (count: number) => {
    if (count === 0) return "hsl(var(--muted))";
    const intensity = 0.25 + (count / maxCount) * 0.75;
    return `hsla(229, 56%, 37%, ${intensity})`;
  };

  const monthName = today.toLocaleDateString(undefined, { month: "long", year: "numeric" });

  return (
    <PageShell className="space-y-6">
      <HeroBanner
        tag="Your progression"
        title="Track your IELTS writing journey"
        subtitle="See your activity, your essay mix, and how your band scores are trending."
      />

      <section className="grid gap-4 lg:grid-cols-3">
        <div className="pisa-card lg:col-span-2">
          <div className="flex items-baseline justify-between mb-3">
            <h2 className="font-display text-lg text-pisa-navy">Activity — {monthName}</h2>
            <span className="text-[12px] text-muted-foreground">
              {studentSubs.filter((s) => {
                const d = new Date(s.submitted_at!);
                return d.getFullYear() === year && d.getMonth() === month;
              }).length} submissions
            </span>
          </div>
          <div className="grid grid-cols-7 gap-1 text-[10px] text-muted-foreground mb-1 max-w-md">
            {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
              <div key={i} className="text-center">{d}</div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1 max-w-md">
            {cells.map((cell, i) =>
              cell ? (
                <div
                  key={i}
                  className="aspect-square rounded flex items-center justify-center text-[9px] font-medium"
                  style={{
                    backgroundColor: heatColor(cell.count),
                    color: cell.count > 0 ? "white" : "hsl(var(--muted-foreground))",
                  }}
                  title={`${monthName.split(" ")[0]} ${cell.day}: ${cell.count} submission(s)`}
                >
                  {cell.day}
                </div>
              ) : (
                <div key={i} className="aspect-square" />
              ),
            )}
          </div>
          <div className="mt-3 flex items-center gap-2 text-[11px] text-muted-foreground">
            <span>Less</span>
            {[0, 0.25, 0.5, 0.75, 1].map((v, i) => (
              <div
                key={i}
                className="h-3 w-4 rounded-sm"
                style={{ backgroundColor: v === 0 ? "hsl(var(--muted))" : `hsla(229, 56%, 37%, ${v})` }}
              />
            ))}
            <span>More</span>
          </div>
        </div>

        <div className="pisa-card">
          <h2 className="font-display text-lg text-pisa-navy mb-3">Writing distribution</h2>
          {distribution.length === 0 ? (
            <p className="text-sm text-muted-foreground">No submissions yet.</p>
          ) : (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={distribution}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={50}
                    outerRadius={90}
                    paddingAngle={2}
                    label={(e) => `${e.name}: ${e.value}`}
                  >
                    {distribution.map((d) => (
                      <Cell key={d.name} fill={d.color} />
                    ))}
                  </Pie>
                  <RTooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <h2 className="font-display text-xl text-pisa-navy">Score progression</h2>
          <div className="inline-flex rounded-pill bg-muted p-1">
            {(["task1", "task2"] as TaskType[]).map((t) => (
              <button
                key={t}
                onClick={() => setTaskType(t)}
                className={`px-4 py-1.5 text-[13px] rounded-pill transition-colors ${
                  taskType === t
                    ? "bg-pisa-navy text-white"
                    : "text-muted-foreground hover:text-pisa-navy"
                }`}
              >
                {t === "task1" ? "Task 1" : "Task 2"}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <MetricCard label="First score" value={fmt(firstScore)} accent="navy" />
          <MetricCard label="Current score" value={fmt(currentScore)} accent="purple" />
          <MetricCard label="Best score" value={fmt(bestScore)} accent="mint" />
          <MetricCard label="Target score" value={fmt(targetScore)} accent="pink" />
        </div>

        <div className="pisa-card">
          <div className="flex items-baseline justify-between mb-3">
            <h3 className="font-display text-base text-pisa-navy">
              Last 5 {taskType === "task1" ? "Task 1" : "Task 2"} submissions
            </h3>
            <span className="text-[12px] text-muted-foreground">{last5.length} of {withBand.length}</span>
          </div>
          {last5.length === 0 ? (
            <p className="text-sm text-muted-foreground py-8 text-center">
              No reviewed {taskType === "task1" ? "Task 1" : "Task 2"} essays yet.
            </p>
          ) : (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={last5} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="label" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis
                    domain={[4, 9]}
                    ticks={[4, 5, 6, 7, 8, 9]}
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                  />
                  <RTooltip />
                  <Line
                    type="monotone"
                    dataKey="band"
                    stroke={COLORS.navy}
                    strokeWidth={3}
                    dot={{ r: 5, fill: COLORS.pink, strokeWidth: 0 }}
                    activeDot={{ r: 7 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </section>
    </PageShell>
  );
};

export default StudentProgression;