import { Users, GraduationCap, BookOpen, UserPlus, Calendar, TrendingUp, DollarSign, ClipboardCheck } from "lucide-react";
import { StatCard } from "@/components/dashboard/StatCard";
import { motion } from "framer-motion";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell
} from "recharts";

const studentGrowth = [
  { month: "Jan", students: 180 }, { month: "Feb", students: 195 },
  { month: "Mar", students: 210 }, { month: "Apr", students: 225 },
  { month: "May", students: 240 }, { month: "Jun", students: 255 },
];

const incomeExpense = [
  { month: "Jan", income: 120000, expense: 85000 },
  { month: "Feb", income: 135000, expense: 90000 },
  { month: "Mar", income: 128000, expense: 92000 },
  { month: "Apr", income: 145000, expense: 88000 },
  { month: "May", income: 150000, expense: 95000 },
  { month: "Jun", income: 160000, expense: 98000 },
];

const attendanceData = [
  { name: "Present", value: 85, color: "hsl(152, 60%, 36%)" },
  { name: "Absent", value: 10, color: "hsl(0, 72%, 51%)" },
  { name: "Late", value: 5, color: "hsl(38, 92%, 50%)" },
];

const classSummary = [
  { class: "Nursery", boys: 15, girls: 18, total: 33 },
  { class: "KG-1", boys: 20, girls: 22, total: 42 },
  { class: "KG-2", boys: 18, girls: 20, total: 38 },
  { class: "Class 1", boys: 25, girls: 23, total: 48 },
  { class: "Class 2", boys: 22, girls: 24, total: 46 },
  { class: "Class 3", boys: 20, girls: 18, total: 38 },
];

const upcomingEvents = [
  { date: "Apr 10", event: "Annual Sports Day", place: "School Ground" },
  { date: "Apr 15", event: "Parent-Teacher Meeting", place: "Auditorium" },
  { date: "Apr 22", event: "Science Fair", place: "Lab Building" },
  { date: "May 01", event: "May Day Holiday", place: "-" },
];

export default function Dashboard() {
  return (
    <div className="space-y-6">
      {/* Welcome */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h2 className="text-2xl font-bold text-foreground">Welcome back, Admin!</h2>
        <p className="text-muted-foreground text-sm">Here's what's happening at Shapla Kindergarten today.</p>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Students" value={255} change="+12 this month" changeType="up" icon={Users} color="primary" delay={0} />
        <StatCard title="Total Teachers" value={24} change="2 on leave" changeType="neutral" icon={GraduationCap} color="info" delay={0.05} />
        <StatCard title="Classes & Sections" value="12 / 18" change="6 sections" changeType="neutral" icon={BookOpen} color="warning" delay={0.1} />
        <StatCard title="New Admissions" value={18} change="+5 this week" changeType="up" icon={UserPlus} color="destructive" delay={0.15} />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Student Growth */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="stat-card">
          <h3 className="font-semibold text-foreground mb-4">Student Growth</h3>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={studentGrowth}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} />
              <YAxis tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} />
              <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid hsl(var(--border))", background: "hsl(var(--card))" }} />
              <Bar dataKey="students" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Income vs Expense */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="stat-card">
          <h3 className="font-semibold text-foreground mb-4">Income vs Expense</h3>
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={incomeExpense}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} />
              <YAxis tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} />
              <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid hsl(var(--border))", background: "hsl(var(--card))" }} />
              <Line type="monotone" dataKey="income" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="expense" stroke="hsl(var(--destructive))" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Today's Attendance */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="stat-card">
          <h3 className="font-semibold text-foreground mb-4">Today's Attendance</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={attendanceData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={3} dataKey="value">
                {attendanceData.map((entry, index) => (
                  <Cell key={index} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex justify-center gap-4 mt-2">
            {attendanceData.map((item) => (
              <div key={item.name} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                {item.name} ({item.value}%)
              </div>
            ))}
          </div>
        </motion.div>

        {/* Student Summary Table */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} className="stat-card">
          <h3 className="font-semibold text-foreground mb-4">Student Summary</h3>
          <div className="overflow-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-muted-foreground border-b border-border">
                  <th className="text-left py-2 font-medium">Class</th>
                  <th className="text-center py-2 font-medium">Boys</th>
                  <th className="text-center py-2 font-medium">Girls</th>
                  <th className="text-center py-2 font-medium">Total</th>
                </tr>
              </thead>
              <tbody>
                {classSummary.map((row) => (
                  <tr key={row.class} className="border-b border-border/50">
                    <td className="py-2 text-foreground">{row.class}</td>
                    <td className="text-center py-2 text-foreground">{row.boys}</td>
                    <td className="text-center py-2 text-foreground">{row.girls}</td>
                    <td className="text-center py-2 font-medium text-foreground">{row.total}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Upcoming Events */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="stat-card">
          <h3 className="font-semibold text-foreground mb-4">Upcoming Events</h3>
          <div className="space-y-3">
            {upcomingEvents.map((ev, i) => (
              <div key={i} className="flex items-start gap-3 p-2.5 rounded-lg bg-muted/50">
                <div className="px-2 py-1 rounded-md bg-primary/10 text-primary text-xs font-semibold whitespace-nowrap">
                  {ev.date}
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">{ev.event}</p>
                  <p className="text-xs text-muted-foreground">{ev.place}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Finance Summary */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }} className="stat-card">
        <h3 className="font-semibold text-foreground mb-4">Finance Summary</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {[
            { label: "Total Income", value: "৳8,38,000", color: "text-primary" },
            { label: "Today Income", value: "৳12,500", color: "text-primary" },
            { label: "Due Amount", value: "৳1,25,000", color: "text-warning" },
            { label: "Total Expense", value: "৳5,48,000", color: "text-destructive" },
            { label: "Today Expense", value: "৳8,200", color: "text-destructive" },
            { label: "Payable", value: "৳45,000", color: "text-info" },
          ].map((item) => (
            <div key={item.label} className="text-center p-3 rounded-lg bg-muted/50">
              <p className="text-xs text-muted-foreground">{item.label}</p>
              <p className={`text-lg font-bold mt-1 ${item.color}`}>{item.value}</p>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
