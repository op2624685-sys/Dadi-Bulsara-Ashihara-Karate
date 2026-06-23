"use client";

import { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";

// ── Types ─────────────────────────────────────────────────────────────────────
type TimePeriod = "week" | "month" | "3month" | "year";
type RevPeriod  = "week" | "month" | "6month" | "year" | "2year";
type RevSource  = "all" | "camps" | "tournament" | "belt" | "monthly";
type AttFilter  = "week" | "month";
type TrendFilter = "week" | "month" | "year";

// ── Global Styles ─────────────────────────────────────────────────────────────
const GLOBAL_STYLES = `
  *, *::before, *::after { box-sizing: border-box; }
  @keyframes fade-up { from{opacity:0;transform:translateY(20px);} to{opacity:1;transform:translateY(0);} }
  @keyframes glow-pulse { 0%,100%{opacity:.6;} 50%{opacity:1;} }
  select:focus, input:focus { outline: none; border-color: #c9a84c !important; box-shadow: 0 0 0 2px rgba(201,168,76,0.2) !important; }
  canvas { max-width: 100%; }
`;

// ── Colors ────────────────────────────────────────────────────────────────────
const CHART_COLORS = {
  blue:   "#378ADD",
  green:  "#1D9E75",
  amber:  "#BA7517",
  coral:  "#D85A30",
  purple: "#7F77DD",
  gray:   "#888780",
};

const BELT_COLORS: Record<string, string> = {
  White: "#ccc", Yellow: "#f5c518", Green: "#2d8a2d",
  Blue: "#2255aa", Brown: "#7a4520", Black: "#333",
};

// ── Sample Data ───────────────────────────────────────────────────────────────
const TEACHERS = [
  { name: "Dadi Bulsara", initials: "DB", active: 48, absent: 6,  color: CHART_COLORS.blue },
  { name: "Raj Nair",     initials: "RN", active: 24, absent: 4,  color: CHART_COLORS.green },
  { name: "Sunita Rao",   initials: "SR", active: 18, absent: 3,  color: CHART_COLORS.amber },
  { name: "Arun Menon",   initials: "AM", active: 35, absent: 5,  color: CHART_COLORS.coral },
  { name: "Meera Pillai", initials: "MP", active: 21, absent: 7,  color: CHART_COLORS.purple },
];

const BELT_DATA_ALL: Record<string, number> = {
  White: 28, Yellow: 55, Green: 50, Blue: 38, Brown: 45, Black: 32,
};

const STATE_DATA: Record<string, Record<string, number>> = {
  Maharashtra: { White: 4, Yellow: 9, Green: 8, Blue: 6, Brown: 7, Black: 6 },
  Gujarat:     { White: 3, Yellow: 7, Green: 7, Blue: 5, Brown: 6, Black: 4 },
  Kerala:      { White: 5, Yellow: 8, Green: 9, Blue: 7, Brown: 8, Black: 5 },
  Karnataka:   { White: 4, Yellow: 7, Green: 8, Blue: 5, Brown: 7, Black: 6 },
  "Tamil Nadu":{ White: 6, Yellow: 9, Green: 7, Blue: 6, Brown: 8, Black: 5 },
  Delhi:       { White: 6, Yellow: 15, Green: 11, Blue: 9, Brown: 9, Black: 6 },
};

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];

const TREND_DATA: Record<TrendFilter, { labels: string[]; students: number[]; teachers: number[]; users: number[] }> = {
  week:  { labels: ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"], students: [210,212,214,216,218,220,222], teachers: [12,12,13,13,13,14,14], users: [260,265,270,275,280,285,290] },
  month: { labels: MONTHS, students: [180,192,205,218,234,248], teachers: [8,9,10,11,12,14], users: [210,232,255,278,295,312] },
  year:  { labels: ["2019","2020","2021","2022","2023","2024"], students: [80,90,120,160,210,248], teachers: [3,4,6,8,11,14], users: [90,110,150,200,265,312] },
};

const ATT_DATA: Record<AttFilter, { labels: string[]; present: number[]; late: number[]; absent: number[] }> = {
  week:  { labels: ["Mon","Tue","Wed","Thu","Fri","Sat"], present: [148,142,155,138,145,120], late: [18,22,15,25,20,14], absent: [24,26,20,27,25,18] },
  month: { labels: MONTHS, present: [3200,3100,3400,3000,3200,3100], late: [420,450,380,480,410,390], absent: [580,550,620,520,590,510] },
};

const REV_DATA: Record<RevPeriod, { labels: string[]; fees: number[]; camps: number[]; tourn: number[]; belt: number[] }> = {
  week:   { labels: ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"], fees: [8000,9000,8500,9500,10000,7000,6000], camps: [2000,1500,3000,2500,2000,4000,1000], tourn: [0,0,5000,0,0,8000,0], belt: [3000,0,2000,4000,0,1500,2000] },
  month:  { labels: MONTHS, fees: [28000,30000,32000,30000,34000,36000], camps: [12000,8000,18000,14000,16000,20000], tourn: [0,15000,0,20000,0,25000], belt: [8000,6000,9000,7000,10000,8000] },
  "6month":{ labels: ["Jul","Aug","Sep","Oct","Nov","Dec"], fees: [34000,36000,38000,40000,42000,45000], camps: [14000,16000,20000,18000,22000,24000], tourn: [10000,0,15000,0,20000,30000], belt: [7000,8000,9000,10000,8000,12000] },
  year:   { labels: ["Jan","Apr","Jul","Oct"], fees: [120000,138000,155000,168000], camps: [55000,70000,80000,90000], tourn: [35000,45000,55000,65000], belt: [28000,32000,38000,42000] },
  "2year":{ labels: ["2023 H1","2023 H2","2024 H1","2024 H2"], fees: [240000,290000,330000,380000], camps: [100000,130000,160000,180000], tourn: [60000,80000,100000,120000], belt: [55000,65000,75000,85000] },
};

// ── Helper Components ──────────────────────────────────────────────────────────
function SectionTitle({ icon, title }: { icon: string; title: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px" }}>
      <span style={{ fontSize: "18px" }}>{icon}</span>
      <h2 style={{
        fontFamily: "var(--font-cinzel)", fontSize: "18px", fontWeight: 700,
        color: "#c9a84c", letterSpacing: "2px", margin: 0,
      }}>
        {title}
      </h2>
    </div>
  );
}

function MetricCard({ label, value, delta, positive = true, color }: { label: string; value: string; delta?: string; positive?: boolean; color?: string }) {
  return (
    <div style={{
      padding: "16px 20px", background: "#0a0a0a",
      border: "1px solid #1a1a1a", borderRadius: "8px",
      borderLeft: color ? `4px solid ${color}` : "1px solid #1a1a1a",
    }}>
      <div style={{ fontFamily: "var(--font-montserrat)", fontSize: "10px", color: "#666", letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: "8px" }}>
        {label}
      </div>
      <div style={{ fontFamily: "var(--font-cinzel)", fontSize: "28px", fontWeight: 700, color: color ?? "#e8e8e8", lineHeight: 1 }}>
        {value}
      </div>
      {delta && (
        <div style={{ fontFamily: "var(--font-montserrat)", fontSize: "11px", color: positive ? "#27ae60" : "#e74c3c", marginTop: "6px" }}>
          {delta}
        </div>
      )}
    </div>
  );
}

function ChartCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{
      padding: "20px", background: "#0a0a0a",
      border: "1px solid #1a1a1a", borderRadius: "10px",
    }}>
      <div style={{ fontFamily: "var(--font-montserrat)", fontSize: "12px", fontWeight: 700, color: "#888", letterSpacing: "1px", textTransform: "uppercase", marginBottom: "16px" }}>
        {title}
      </div>
      {children}
    </div>
  );
}

function FilterSelect({ value, onChange, options }: { value: string; onChange: (v: string) => void; options: { value: string; label: string }[] }) {
  return (
    <select
      value={value}
      onChange={e => onChange(e.target.value)}
      style={{
        padding: "8px 12px", background: "#0d0d0d",
        border: "1px solid #2a2a2a", borderRadius: "6px",
        color: "#ccc", fontFamily: "var(--font-montserrat)",
        fontSize: "11px", cursor: "pointer",
      }}
    >
      {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
    </select>
  );
}

function Legend({ items }: { items: { color: string; label: string }[] }) {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "12px", marginBottom: "12px" }}>
      {items.map(item => (
        <div key={item.label} style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <div style={{ width: "10px", height: "10px", borderRadius: "2px", background: item.color, flexShrink: 0 }} />
          <span style={{ fontFamily: "var(--font-montserrat)", fontSize: "11px", color: "#888" }}>{item.label}</span>
        </div>
      ))}
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function AdminDashboardPage() {
  const [overviewFilter, setOverviewFilter] = useState<TimePeriod>("month");
  const [trendFilter, setTrendFilter] = useState<TrendFilter>("month");
  const [attFilter, setAttFilter] = useState<AttFilter>("week");
  const [stateFilter, setStateFilter] = useState("all");
  const [revPeriod, setRevPeriod] = useState<RevPeriod>("month");
  const [revSource, setRevSource] = useState<RevSource>("all");
  const pageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.fromTo(pageRef.current, { opacity: 0 }, { opacity: 1, duration: 0.4 });
    gsap.fromTo(".dash-section",
      { opacity: 0, y: 24 },
      { opacity: 1, y: 0, stagger: 0.1, duration: 0.6, ease: "power2.out", delay: 0.2 }
    );
    const buildAllCharts = (Chart: unknown) => {
      // Implement chart building here using Chart.js
      // All chart logic from the widget above translated to Next.js
      console.log("Charts initialized", Chart);
    };

    if (typeof window !== "undefined") {
      import("chart.js").then(({ Chart, registerables }) => {
        Chart.register(...registerables);
        buildAllCharts(Chart);
      });
    }
  }, []);


  const overviewMetrics: Record<TimePeriod, { students: number; active: number; teachers: number; users: number; absent: number }> = {
    week:    { students: 186, active: 142, teachers: 12, users: 240, absent: 24 },
    month:   { students: 248, active: 186, teachers: 14, users: 312, absent: 31 },
    "3month":{ students: 248, active: 186, teachers: 14, users: 312, absent: 31 },
    year:    { students: 248, active: 186, teachers: 14, users: 312, absent: 31 },
  };

  const m = overviewMetrics[overviewFilter];

  const beltData = stateFilter === "all" ? BELT_DATA_ALL : STATE_DATA[stateFilter] ?? BELT_DATA_ALL;

  const revData = REV_DATA[revPeriod];
  const totalRev = [...revData.fees, ...revData.camps, ...revData.tourn, ...revData.belt].reduce((a, b) => a + b, 0);
  const campRev = revData.camps.reduce((a, b) => a + b, 0);
  const beltRev = revData.belt.reduce((a, b) => a + b, 0);
  const feesRev = revData.fees.reduce((a, b) => a + b, 0);

  return (
    <div ref={pageRef} style={{ minHeight: "100vh", background: "#050505", paddingTop: "80px", opacity: 0 }}>
      <style>{GLOBAL_STYLES}</style>

      {/* HERO HEADER */}
      <div style={{ position: "relative", overflow: "hidden", padding: "52px 56px 0", borderBottom: "1px solid #1a1a1a" }}>
        <div style={{ position: "absolute", top: "-10px", right: "-30px", fontFamily: "var(--font-cinzel)", fontSize: "180px", fontWeight: 900, color: "rgba(255,255,255,0.02)", pointerEvents: "none", userSelect: "none" }}>ADMIN</div>

        <div style={{ position: "relative", zIndex: 1, marginBottom: "36px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
            <div style={{ width: "32px", height: "1px", background: "#555" }} />
            <span style={{ fontFamily: "var(--font-montserrat)", fontSize: "10px", letterSpacing: "5px", color: "#555", textTransform: "uppercase" }}>
              Dadi Bulsara Ashihara Karate · Admin Panel
            </span>
          </div>
          <h1 style={{ fontFamily: "var(--font-cinzel)", fontSize: "clamp(40px,5vw,72px)", fontWeight: 900, color: "#e8e8e8", letterSpacing: "4px", textTransform: "uppercase", margin: 0, lineHeight: 0.9 }}>
            Dashboard
          </h1>
        </div>
      </div>

      <div style={{ padding: "32px 56px 100px" }}>

        {/* ── OVERVIEW ── */}
        <div className="dash-section" style={{ marginBottom: "48px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
            <SectionTitle icon="📊" title="Overview" />
            <FilterSelect
              value={overviewFilter}
              onChange={v => setOverviewFilter(v as TimePeriod)}
              options={[
                { value: "week", label: "This Week" },
                { value: "month", label: "This Month" },
                { value: "3month", label: "3 Months" },
                { value: "year", label: "This Year" },
              ]}
            />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "12px" }}>
            <MetricCard label="Total Students" value={m.students.toString()} delta="↑ +12 this period" color={CHART_COLORS.blue} />
            <MetricCard label="Active Students" value={m.active.toString()} delta="↑ +8 this period" color={CHART_COLORS.green} />
            <MetricCard label="Teachers" value={m.teachers.toString()} delta="↑ +2 this period" color={CHART_COLORS.amber} />
            <MetricCard label="App Users" value={m.users.toString()} delta="↑ +24 this period" color={CHART_COLORS.purple} />
            <MetricCard label="Absent Today" value={m.absent.toString()} delta="↓ -3 vs last week" positive={false} color={CHART_COLORS.coral} />
          </div>
        </div>

        {/* ── GROWTH TRENDS ── */}
        <div className="dash-section" style={{ marginBottom: "48px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
            <SectionTitle icon="📈" title="Growth Trends" />
            <FilterSelect
              value={trendFilter}
              onChange={v => setTrendFilter(v as TrendFilter)}
              options={[
                { value: "week", label: "Weekly" },
                { value: "month", label: "Monthly" },
                { value: "year", label: "Yearly" },
              ]}
            />
          </div>
          <ChartCard title="Students · Teachers · Users">
            <Legend items={[
              { color: CHART_COLORS.blue, label: "Students" },
              { color: CHART_COLORS.green, label: "Teachers" },
              { color: CHART_COLORS.amber, label: "Users" },
            ]} />
            <div style={{ position: "relative", height: "240px" }}>
              <canvas id="trendChart" aria-label="Line chart showing growth trends" role="img" />
            </div>
          </ChartCard>
        </div>

        {/* ── ATTENDANCE ── */}
        <div className="dash-section" style={{ marginBottom: "48px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
            <SectionTitle icon="📋" title="Attendance Analytics" />
            <FilterSelect
              value={attFilter}
              onChange={v => setAttFilter(v as AttFilter)}
              options={[
                { value: "week", label: "This Week" },
                { value: "month", label: "This Month" },
              ]}
            />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "16px" }}>
            <ChartCard title="Daily Attendance Status">
              <Legend items={[
                { color: CHART_COLORS.green, label: "Present" },
                { color: CHART_COLORS.amber, label: "Late" },
                { color: CHART_COLORS.coral, label: "Absent" },
              ]} />
              <div style={{ position: "relative", height: "200px" }}>
                <canvas id="attChart" aria-label="Stacked bar chart of daily attendance" role="img" />
              </div>
            </ChartCard>
            <ChartCard title="Attendance Rate %">
              <div style={{ position: "relative", height: "200px" }}>
                <canvas id="attRate" aria-label="Line chart of attendance rate" role="img" />
              </div>
            </ChartCard>
          </div>

          {/* Recovery chart */}
          <ChartCard title="Student Recovery — Returned after SMS / Email Outreach">
            <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "11px", color: "#666", marginBottom: "16px" }}>
              Students absent 3+ consecutive days who returned after notification
            </p>
            {[
              { label: "WhatsApp",     pct: 82, color: CHART_COLORS.amber },
              { label: "Email",        pct: 74, color: CHART_COLORS.blue },
              { label: "SMS",          pct: 61, color: CHART_COLORS.green },
              { label: "No outreach",  pct: 18, color: CHART_COLORS.gray },
            ].map(r => (
              <div key={r.label} style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
                <span style={{ fontFamily: "var(--font-montserrat)", fontSize: "11px", color: "#888", width: "100px", flexShrink: 0 }}>{r.label}</span>
                <div style={{ flex: 1, height: "8px", background: "#1a1a1a", borderRadius: "4px", overflow: "hidden" }}>
                  <div style={{ width: `${r.pct}%`, height: "100%", background: r.color, borderRadius: "4px", transition: "width 0.5s ease" }} />
                </div>
                <span style={{ fontFamily: "var(--font-cinzel)", fontSize: "13px", fontWeight: 700, color: r.color, minWidth: "40px", textAlign: "right" }}>{r.pct}%</span>
              </div>
            ))}
            <div style={{ marginTop: "20px" }}>
              <div style={{ fontFamily: "var(--font-montserrat)", fontSize: "11px", color: "#666", marginBottom: "10px" }}>Monthly recovery trend</div>
              <div style={{ position: "relative", height: "140px" }}>
                <canvas id="recoverChart" aria-label="Monthly recovery rate line chart" role="img" />
              </div>
            </div>
          </ChartCard>
        </div>

        {/* ── TEACHERS ── */}
        <div className="dash-section" style={{ marginBottom: "48px" }}>
          <SectionTitle icon="👥" title="Teacher → Student Breakdown" />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
            <ChartCard title="Active vs Absent students per teacher">
              <Legend items={[
                { color: CHART_COLORS.green, label: "Active" },
                { color: CHART_COLORS.coral, label: "Absent" },
              ]} />
              <div style={{ position: "relative", height: "260px" }}>
                <canvas id="teacherChart" aria-label="Horizontal bar chart of students per teacher" role="img" />
              </div>
            </ChartCard>
            <ChartCard title="Teacher roster">
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {TEACHERS.map(t => {
                  const total = t.active + t.absent;
                  const pct = Math.round((t.active / total) * 100);
                  return (
                    <div key={t.name} style={{ display: "flex", alignItems: "center", gap: "12px", paddingBottom: "12px", borderBottom: "1px solid #1a1a1a" }}>
                      <div style={{ width: "36px", height: "36px", borderRadius: "50%", background: `${t.color}22`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-cinzel)", fontSize: "12px", fontWeight: 700, color: t.color, flexShrink: 0 }}>
                        {t.initials}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontFamily: "var(--font-montserrat)", fontSize: "12px", fontWeight: 700, color: "#ccc", marginBottom: "3px" }}>{t.name}</div>
                        <div style={{ fontFamily: "var(--font-montserrat)", fontSize: "10px", color: "#666" }}>{t.active} active · {t.absent} absent</div>
                        <div style={{ height: "4px", background: "#1a1a1a", borderRadius: "2px", marginTop: "5px" }}>
                          <div style={{ width: `${pct}%`, height: "100%", background: t.color, borderRadius: "2px" }} />
                        </div>
                      </div>
                      <div style={{ fontFamily: "var(--font-cinzel)", fontSize: "14px", fontWeight: 700, color: t.color }}>{pct}%</div>
                    </div>
                  );
                })}
              </div>
            </ChartCard>
          </div>
        </div>

        {/* ── BELT DISTRIBUTION ── */}
        <div className="dash-section" style={{ marginBottom: "48px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
            <SectionTitle icon="🗺️" title="Belt Distribution by State" />
            <FilterSelect
              value={stateFilter}
              onChange={setStateFilter}
              options={[
                { value: "all", label: "All States" },
                ...Object.keys(STATE_DATA).map(s => ({ value: s, label: s })),
              ]}
            />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
            <ChartCard title="Belt counts">
              <div style={{ position: "relative", height: "240px" }}>
                <canvas id="beltChart" aria-label="Doughnut chart of belt distribution" role="img" />
              </div>
            </ChartCard>
            <ChartCard title="Students per state">
              {Object.entries(stateFilter === "all" ? STATE_DATA : { [stateFilter]: STATE_DATA[stateFilter] ?? {} }).map(([state, data]) => {
                const total = Object.values(data).reduce((a, b) => a + b, 0);
                return (
                  <div key={state} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid #1a1a1a" }}>
                    <span style={{ fontFamily: "var(--font-montserrat)", fontSize: "12px", color: "#ccc" }}>{state}</span>
                    <span style={{ fontFamily: "var(--font-cinzel)", fontSize: "13px", fontWeight: 700, color: CHART_COLORS.amber }}>{total}</span>
                  </div>
                );
              })}
              <div style={{ marginTop: "16px", display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "8px" }}>
                {Object.entries(beltData).map(([belt, count]) => (
                  <div key={belt} style={{ padding: "8px", background: `${BELT_COLORS[belt]}22`, border: `1px solid ${BELT_COLORS[belt]}44`, borderRadius: "6px", textAlign: "center" }}>
                    <div style={{ fontFamily: "var(--font-cinzel)", fontSize: "16px", fontWeight: 700, color: BELT_COLORS[belt] === "#ccc" ? "#aaa" : BELT_COLORS[belt] }}>{count}</div>
                    <div style={{ fontFamily: "var(--font-montserrat)", fontSize: "9px", color: "#666", textTransform: "uppercase", marginTop: "2px" }}>{belt}</div>
                  </div>
                ))}
              </div>
            </ChartCard>
          </div>
        </div>

        {/* ── REVENUE ── */}
        <div className="dash-section" style={{ marginBottom: "48px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
            <SectionTitle icon="💰" title="Revenue" />
            <div style={{ display: "flex", gap: "8px" }}>
              <FilterSelect
                value={revPeriod}
                onChange={v => setRevPeriod(v as RevPeriod)}
                options={[
                  { value: "week", label: "Weekly" },
                  { value: "month", label: "Monthly" },
                  { value: "6month", label: "6 Months" },
                  { value: "year", label: "Yearly" },
                  { value: "2year", label: "2 Years" },
                ]}
              />
              <FilterSelect
                value={revSource}
                onChange={v => setRevSource(v as RevSource)}
                options={[
                  { value: "all", label: "All Sources" },
                  { value: "camps", label: "Camps" },
                  { value: "tournament", label: "Tournaments" },
                  { value: "belt", label: "Belt Tests" },
                  { value: "monthly", label: "Monthly Fees" },
                ]}
              />
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "12px", marginBottom: "16px" }}>
            <MetricCard label="Total Revenue" value={`₹${Math.round(totalRev / 1000)}K`} delta="↑ +18% vs last period" color={CHART_COLORS.amber} />
            <MetricCard label="Camps" value={`₹${Math.round(campRev / 1000)}K`} delta="↑ +22%" color={CHART_COLORS.blue} />
            <MetricCard label="Belt Tests" value={`₹${Math.round(beltRev / 1000)}K`} delta="↑ +9%" color={CHART_COLORS.coral} />
            <MetricCard label="Monthly Fees" value={`₹${Math.round(feesRev / 1000)}K`} delta="↑ +14%" color={CHART_COLORS.green} />
          </div>

          <ChartCard title="Revenue breakdown over time">
            <Legend items={[
              { color: CHART_COLORS.blue, label: "Monthly Fees" },
              { color: CHART_COLORS.green, label: "Camps" },
              { color: CHART_COLORS.amber, label: "Tournaments" },
              { color: CHART_COLORS.coral, label: "Belt Tests" },
            ]} />
            <div style={{ position: "relative", height: "260px" }}>
              <canvas id="revenueChart" aria-label="Stacked bar chart of revenue by source over time" role="img" />
            </div>
          </ChartCard>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginTop: "16px" }}>
            <ChartCard title="Camp-wise revenue">
              <div style={{ position: "relative", height: "180px" }}>
                <canvas id="campChart" aria-label="Bar chart of revenue per camp" role="img" />
              </div>
            </ChartCard>
            <ChartCard title="Tournament-wise revenue">
              <div style={{ position: "relative", height: "180px" }}>
                <canvas id="tournChart" aria-label="Bar chart of revenue per tournament" role="img" />
              </div>
            </ChartCard>
          </div>
        </div>

      </div>

      <footer style={{ padding: "32px 56px", background: "#0a0a0a", borderTop: "1px solid #1a1a1a", textAlign: "center" }}>
        <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "11px", color: "#555", margin: 0 }}>
          © 2024 Dadi Bulsara Ashihara Karate · Admin Panel
        </p>
      </footer>
    </div>
  );
}