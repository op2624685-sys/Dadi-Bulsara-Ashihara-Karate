"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { gsap } from "gsap";

// ── Types ─────────────────────────────────────────────────────────────────────
type TimePeriod  = "week" | "month" | "3month" | "year";
type RevPeriod   = "week" | "month" | "6month" | "year" | "2year";
type RevSource   = "all" | "camps" | "tournament" | "belt" | "monthly";
type AttFilter   = "week" | "month";
type TrendFilter = "week" | "month" | "year";

// ── Global Styles ─────────────────────────────────────────────────────────────
const GLOBAL_STYLES = `
  *, *::before, *::after { box-sizing: border-box; }
  @keyframes fade-up { from{opacity:0;transform:translateY(20px);} to{opacity:1;transform:translateY(0);} }
  @keyframes glow-pulse { 0%,100%{opacity:.6;} 50%{opacity:1;} }
  select { outline:none; cursor:pointer; }
  select:focus { border-color:#c9a84c !important; box-shadow:0 0 0 2px rgba(201,168,76,0.2) !important; }
  select option { background:#0d0d0d; color:#ccc; }
  canvas { display:block; }
  @media(max-width:900px){
    .two-col { grid-template-columns:1fr !important; }
    .four-col { grid-template-columns:1fr 1fr !important; }
    .hero-pad, .main-pad { padding-left:20px !important; padding-right:20px !important; }
  }
`;

// ── Data ──────────────────────────────────────────────────────────────────────
const C = {
  blue:   "#378ADD",
  green:  "#1D9E75",
  amber:  "#BA7517",
  coral:  "#D85A30",
  purple: "#7F77DD",
  gray:   "#888780",
};

const BELT_CLR: Record<string, string> = {
  White:"#cccccc", Yellow:"#f5c518", Green:"#2d8a2d",
  Blue:"#2255aa", Brown:"#7a4520", Black:"#555555",
};

const TEACHERS = [
  { name:"Dadi Bulsara", initials:"DB", active:48, absent:6,  color:C.blue },
  { name:"Raj Nair",     initials:"RN", active:24, absent:4,  color:C.green },
  { name:"Sunita Rao",   initials:"SR", active:18, absent:3,  color:C.amber },
  { name:"Arun Menon",   initials:"AM", active:35, absent:5,  color:C.coral },
  { name:"Meera Pillai", initials:"MP", active:21, absent:7,  color:C.purple },
];

const STATE_DATA: Record<string, Record<string, number>> = {
  Maharashtra:  { White:4,  Yellow:9,  Green:8,  Blue:6, Brown:7, Black:6 },
  Gujarat:      { White:3,  Yellow:7,  Green:7,  Blue:5, Brown:6, Black:4 },
  Kerala:       { White:5,  Yellow:8,  Green:9,  Blue:7, Brown:8, Black:5 },
  Karnataka:    { White:4,  Yellow:7,  Green:8,  Blue:5, Brown:7, Black:6 },
  "Tamil Nadu": { White:6,  Yellow:9,  Green:7,  Blue:6, Brown:8, Black:5 },
  Delhi:        { White:6,  Yellow:15, Green:11, Blue:9, Brown:9, Black:6 },
};

const BELT_DATA_ALL = Object.values(STATE_DATA).reduce<Record<string,number>>((acc, state) => {
  Object.entries(state).forEach(([b, v]) => { acc[b] = (acc[b] ?? 0) + v; });
  return acc;
}, {});

const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun"];

const TREND: Record<TrendFilter, { labels:string[]; students:number[]; teachers:number[]; users:number[] }> = {
  week:  { labels:["Mon","Tue","Wed","Thu","Fri","Sat","Sun"], students:[210,212,214,216,218,220,222], teachers:[12,12,13,13,13,14,14], users:[260,265,270,275,280,285,290] },
  month: { labels:MONTHS,                                      students:[180,192,205,218,234,248],     teachers:[8,9,10,11,12,14],       users:[210,232,255,278,295,312] },
  year:  { labels:["2019","2020","2021","2022","2023","2024"], students:[80,90,120,160,210,248],       teachers:[3,4,6,8,11,14],         users:[90,110,150,200,265,312] },
};

const ATT: Record<AttFilter, { labels:string[]; present:number[]; late:number[]; absent:number[] }> = {
  week:  { labels:["Mon","Tue","Wed","Thu","Fri","Sat"], present:[148,142,155,138,145,120], late:[18,22,15,25,20,14], absent:[24,26,20,27,25,18] },
  month: { labels:MONTHS,                               present:[3200,3100,3400,3000,3200,3100], late:[420,450,380,480,410,390], absent:[580,550,620,520,590,510] },
};

const REV: Record<RevPeriod, { labels:string[]; fees:number[]; camps:number[]; tourn:number[]; belt:number[] }> = {
  week:    { labels:["Mon","Tue","Wed","Thu","Fri","Sat","Sun"],    fees:[8000,9000,8500,9500,10000,7000,6000],    camps:[2000,1500,3000,2500,2000,4000,1000],   tourn:[0,0,5000,0,0,8000,0],              belt:[3000,0,2000,4000,0,1500,2000] },
  month:   { labels:MONTHS,                                         fees:[28000,30000,32000,30000,34000,36000],    camps:[12000,8000,18000,14000,16000,20000],    tourn:[0,15000,0,20000,0,25000],          belt:[8000,6000,9000,7000,10000,8000] },
  "6month":{ labels:["Jul","Aug","Sep","Oct","Nov","Dec"],           fees:[34000,36000,38000,40000,42000,45000],    camps:[14000,16000,20000,18000,22000,24000],   tourn:[10000,0,15000,0,20000,30000],      belt:[7000,8000,9000,10000,8000,12000] },
  year:    { labels:["Q1","Q2","Q3","Q4"],                           fees:[120000,138000,155000,168000],            camps:[55000,70000,80000,90000],               tourn:[35000,45000,55000,65000],          belt:[28000,32000,38000,42000] },
  "2year": { labels:["2023 H1","2023 H2","2024 H1","2024 H2"],       fees:[240000,290000,330000,380000],            camps:[100000,130000,160000,180000],           tourn:[60000,80000,100000,120000],        belt:[55000,65000,75000,85000] },
};

const OV_DATA: Record<TimePeriod, { students:number; active:number; teachers:number; users:number; absent:number }> = {
  week:    { students:186, active:142, teachers:12, users:240, absent:24 },
  month:   { students:248, active:186, teachers:14, users:312, absent:31 },
  "3month":{ students:248, active:186, teachers:14, users:312, absent:31 },
  year:    { students:248, active:186, teachers:14, users:312, absent:31 },
};

// ── Small UI pieces ───────────────────────────────────────────────────────────
function SectionTitle({ icon, title }: { icon:string; title:string }) {
  return (
    <div style={{ display:"flex", alignItems:"center", gap:"10px", marginBottom:"16px" }}>
      <span style={{ fontSize:"20px" }}>{icon}</span>
      <h2 style={{ fontFamily:"var(--font-cinzel)", fontSize:"18px", fontWeight:700, color:"#c9a84c", letterSpacing:"2px", margin:0 }}>
        {title}
      </h2>
    </div>
  );
}

function MetricCard({ label, value, delta, positive=true, color }: { label:string; value:string; delta?:string; positive?:boolean; color?:string }) {
  return (
    <div style={{ padding:"16px 20px", background:"#0a0a0a", border:"1px solid #1a1a1a", borderRadius:"8px", borderLeft:`4px solid ${color ?? "#2a2a2a"}` }}>
      <div style={{ fontFamily:"var(--font-montserrat)", fontSize:"9px", color:"#666", letterSpacing:"2px", textTransform:"uppercase", marginBottom:"8px" }}>{label}</div>
      <div style={{ fontFamily:"var(--font-cinzel)", fontSize:"28px", fontWeight:700, color:color ?? "#e8e8e8", lineHeight:1 }}>{value}</div>
      {delta && <div style={{ fontFamily:"var(--font-montserrat)", fontSize:"11px", color:positive?"#27ae60":"#e74c3c", marginTop:"6px" }}>{delta}</div>}
    </div>
  );
}

function ChartCard({ title, height=220, id, children }: { title:string; height?:number; id?:string; children?:React.ReactNode }) {
  return (
    <div style={{ padding:"20px", background:"#0a0a0a", border:"1px solid #1a1a1a", borderRadius:"10px" }}>
      <div style={{ fontFamily:"var(--font-montserrat)", fontSize:"10px", fontWeight:700, color:"#666", letterSpacing:"1.5px", textTransform:"uppercase", marginBottom:"14px" }}>{title}</div>
      {children}
      {id && <div style={{ position:"relative", height:`${height}px` }}><canvas id={id} /></div>}
    </div>
  );
}

function FilterSelect({ value, onChange, options }: { value:string; onChange:(v:string)=>void; options:{value:string;label:string}[] }) {
  return (
    <select value={value} onChange={e=>onChange(e.target.value)} style={{ padding:"8px 12px", background:"#0d0d0d", border:"1px solid #2a2a2a", borderRadius:"6px", color:"#ccc", fontFamily:"var(--font-montserrat)", fontSize:"11px", letterSpacing:"0.5px" }}>
      {options.map(o=><option key={o.value} value={o.value}>{o.label}</option>)}
    </select>
  );
}

function Legend({ items }: { items:{color:string;label:string}[] }) {
  return (
    <div style={{ display:"flex", flexWrap:"wrap", gap:"12px", marginBottom:"12px" }}>
      {items.map(i=>(
        <div key={i.label} style={{ display:"flex", alignItems:"center", gap:"5px" }}>
          <div style={{ width:"10px", height:"10px", borderRadius:"2px", background:i.color, flexShrink:0 }} />
          <span style={{ fontFamily:"var(--font-montserrat)", fontSize:"10px", color:"#888" }}>{i.label}</span>
        </div>
      ))}
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function AdminDashboardPage() {
  const [ovFilter,    setOvFilter]    = useState<TimePeriod>("month");
  const [trendFilter, setTrendFilter] = useState<TrendFilter>("month");
  const [attFilter,   setAttFilter]   = useState<AttFilter>("week");
  const [stateFilter, setStateFilter] = useState("all");
  const [revPeriod,   setRevPeriod]   = useState<RevPeriod>("month");
  const [revSource,   setRevSource]   = useState<RevSource>("all");

  const pageRef     = useRef<HTMLDivElement>(null);
  // store chart instances so we can destroy/rebuild
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const chartsRef   = useRef<Record<string, any>>({});
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const ChartRef    = useRef<any>(null);

  // ── Load Chart.js once ─────────────────────────────────────────────────────
  useEffect(() => {
    gsap.fromTo(pageRef.current, { opacity:0 }, { opacity:1, duration:0.4 });
    gsap.fromTo(".dash-s", { opacity:0, y:24 }, { opacity:1, y:0, stagger:0.1, duration:0.6, ease:"power2.out", delay:0.2 });

    import("chart.js/auto").then(mod => {
      ChartRef.current = mod.default;
      buildAll();
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Rebuild when filters change ────────────────────────────────────────────
  useEffect(() => { if (ChartRef.current) buildTrend(); }, [trendFilter]);       // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => { if (ChartRef.current) buildAtt(); },   [attFilter]);          // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => { if (ChartRef.current) buildBelt(); },  [stateFilter]);        // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => { if (ChartRef.current) buildRev(); },   [revPeriod, revSource]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Helpers ────────────────────────────────────────────────────────────────
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const make = useCallback((id:string, type:string, data:any, opts:any) => {
    const Chart = ChartRef.current;
    if (!Chart) return;
    const el = document.getElementById(id) as HTMLCanvasElement | null;
    if (!el) return;
    if (chartsRef.current[id]) chartsRef.current[id].destroy();
    chartsRef.current[id] = new Chart(el, { type, data, options: opts });
  }, []);

  const GRID = "rgba(255,255,255,0.06)";
  const TICK = "#666";

  const base = useCallback((stacked=false, pct=false) => ({
    responsive: true,
    maintainAspectRatio: false,
    animation: { duration: 600, easing: "easeOutQuart" },
    plugins: { legend:{ display:false } },
    scales: {
      x: { stacked, grid:{ color:GRID }, ticks:{ color:TICK, font:{ size:11 } } },
      y: { stacked, grid:{ color:GRID }, ticks:{ color:TICK, font:{ size:11 }, callback: pct ? (v:number)=>v+"%" : undefined } },
    },
  }), []);

  // ── Build functions ────────────────────────────────────────────────────────
  const buildTrend = useCallback(() => {
    const d = TREND[trendFilter];
    make("trendChart","line",{
      labels: d.labels,
      datasets: [
        { label:"Students", data:d.students, borderColor:C.blue,   backgroundColor:C.blue+"22",   tension:.4, fill:true, pointRadius:3, borderDash:[] },
        { label:"Teachers", data:d.teachers, borderColor:C.green,  backgroundColor:C.green+"22",  tension:.4, fill:true, pointRadius:3, borderDash:[4,4] },
        { label:"Users",    data:d.users,    borderColor:C.amber,  backgroundColor:C.amber+"22",  tension:.4, fill:true, pointRadius:3, borderDash:[2,2] },
      ],
    }, base());
  }, [trendFilter, make, base]);

  const buildAtt = useCallback(() => {
    const d = ATT[attFilter];
    const rates = d.present.map((p,i)=>Math.round(p/(p+d.late[i]+d.absent[i])*100));
    make("attChart","bar",{
      labels: d.labels,
      datasets: [
        { label:"Present", data:d.present, backgroundColor:C.green },
        { label:"Late",    data:d.late,    backgroundColor:C.amber },
        { label:"Absent",  data:d.absent,  backgroundColor:C.coral },
      ],
    }, base(true));
    make("attRate","line",{
      labels: d.labels,
      datasets:[{ label:"Rate %", data:rates, borderColor:C.blue, backgroundColor:C.blue+"22", tension:.4, fill:true, pointRadius:4 }],
    }, { ...base(false,true), scales:{ x:{grid:{color:GRID},ticks:{color:TICK,font:{size:11}}}, y:{min:50,max:100,grid:{color:GRID},ticks:{color:TICK,font:{size:11},callback:(v:number)=>v+"%"}} } });
  }, [attFilter, make, base]);

  const buildRecovery = useCallback(() => {
    make("recoverChart","line",{
      labels: MONTHS,
      datasets: [
        { label:"WhatsApp", data:[50,58,65,70,78,82], borderColor:C.amber, tension:.4, pointRadius:3 },
        { label:"Email",    data:[42,48,55,60,68,74], borderColor:C.blue,  tension:.4, pointRadius:3, borderDash:[4,4] },
        { label:"SMS",      data:[35,40,48,53,58,61], borderColor:C.green, tension:.4, pointRadius:3, borderDash:[2,2] },
      ],
    }, { ...base(false,true), scales:{ x:{grid:{color:GRID},ticks:{color:TICK,font:{size:11}}}, y:{min:20,max:100,grid:{color:GRID},ticks:{color:TICK,font:{size:11},callback:(v:number)=>v+"%"}} } });
  }, [make, base]);

  const buildTeacher = useCallback(() => {
    make("teacherChart","bar",{
      labels: TEACHERS.map(t=>t.initials),
      datasets:[
        { label:"Active", data:TEACHERS.map(t=>t.active), backgroundColor:C.green },
        { label:"Absent", data:TEACHERS.map(t=>t.absent), backgroundColor:C.coral },
      ],
    }, base(true));
  }, [make, base]);

  const buildBelt = useCallback(() => {
    const raw = stateFilter === "all" ? BELT_DATA_ALL : (STATE_DATA[stateFilter] ?? BELT_DATA_ALL);
    const labels = Object.keys(raw);
    const vals   = Object.values(raw);
    const colors = labels.map(l => BELT_CLR[l] ?? "#888");
    make("beltChart","doughnut",{
      labels,
      datasets:[{ data:vals, backgroundColor:colors, borderColor:"#0a0a0a", borderWidth:3 }],
    }, { responsive:true, maintainAspectRatio:false, animation:{ duration:600 }, plugins:{ legend:{ display:true, position:"right", labels:{ boxWidth:12, padding:12, color:TICK, font:{ size:11 } } } } });
  }, [stateFilter, make]);

  const buildRev = useCallback(() => {
    const d = REV[revPeriod];
    type DS = { label:string; data:number[]; backgroundColor:string };
    const datasets: DS[] = [];
    if (revSource==="all"||revSource==="monthly")    datasets.push({ label:"Monthly Fees", data:d.fees,  backgroundColor:C.blue });
    if (revSource==="all"||revSource==="camps")      datasets.push({ label:"Camps",        data:d.camps, backgroundColor:C.green });
    if (revSource==="all"||revSource==="tournament") datasets.push({ label:"Tournaments",  data:d.tourn, backgroundColor:C.amber });
    if (revSource==="all"||revSource==="belt")       datasets.push({ label:"Belt Tests",   data:d.belt,  backgroundColor:C.coral });
    make("revenueChart","bar",{ labels:d.labels, datasets }, {
      ...base(true), scales:{
        x:{ stacked:true, grid:{color:GRID}, ticks:{color:TICK,font:{size:11}} },
        y:{ stacked:true, grid:{color:GRID}, ticks:{color:TICK,font:{size:11},callback:(v:number)=>"₹"+Math.round(v/1000)+"K"} },
      },
    });
    make("campChart","bar",{
      labels:["Summer Camp","Winter Camp","National","Regional"],
      datasets:[{ label:"Revenue", data:[58000,42000,38000,26000], backgroundColor:[C.blue,C.green,C.amber,C.coral] }],
    }, { ...base(), scales:{ x:{grid:{color:GRID},ticks:{color:TICK,font:{size:11},maxRotation:25}}, y:{grid:{color:GRID},ticks:{color:TICK,font:{size:11},callback:(v:number)=>"₹"+Math.round(v/1000)+"K"}} } });
    make("tournChart","bar",{
      labels:["National Open","State Open","City Cup","District"],
      datasets:[{ label:"Revenue", data:[52000,34000,22000,18000], backgroundColor:[C.coral,C.amber,C.green,C.blue] }],
    }, { ...base(), scales:{ x:{grid:{color:GRID},ticks:{color:TICK,font:{size:11},maxRotation:25}}, y:{grid:{color:GRID},ticks:{color:TICK,font:{size:11},callback:(v:number)=>"₹"+Math.round(v/1000)+"K"}} } });
  }, [revPeriod, revSource, make, base]);

  const buildAll = useCallback(() => {
    buildTrend();
    buildAtt();
    buildRecovery();
    buildTeacher();
    buildBelt();
    buildRev();
  }, [buildTrend, buildAtt, buildRecovery, buildTeacher, buildBelt, buildRev]);

  // ── Computed values ────────────────────────────────────────────────────────
  const m     = OV_DATA[ovFilter];
  const bData = stateFilter === "all" ? BELT_DATA_ALL : (STATE_DATA[stateFilter] ?? BELT_DATA_ALL);
  const rd    = REV[revPeriod];
  const sum   = (arr:number[]) => arr.reduce((a,b)=>a+b,0);
  const totalRev = sum(rd.fees)+sum(rd.camps)+sum(rd.tourn)+sum(rd.belt);

  return (
    <div ref={pageRef} style={{ minHeight:"100vh", background:"#050505", paddingTop:"80px", opacity:0 }}>
      <style>{GLOBAL_STYLES}</style>

      {/* ── HERO ── */}
      <div className="hero-pad" style={{ position:"relative", overflow:"hidden", padding:"52px 56px 32px", borderBottom:"1px solid #1a1a1a" }}>
        <div style={{ position:"absolute", top:"-10px", right:"-30px", fontFamily:"var(--font-cinzel)", fontSize:"180px", fontWeight:900, color:"rgba(255,255,255,0.02)", pointerEvents:"none", userSelect:"none", lineHeight:1 }}>
          ADMIN
        </div>
        <div style={{ position:"relative", zIndex:1 }}>
          <div style={{ display:"flex", alignItems:"center", gap:"12px", marginBottom:"16px" }}>
            <div style={{ width:"32px", height:"1px", background:"#555" }} />
            <span style={{ fontFamily:"var(--font-montserrat)", fontSize:"10px", letterSpacing:"5px", color:"#555", textTransform:"uppercase" }}>
              Dadi Bulsara Ashihara Karate · Admin Panel
            </span>
          </div>
          <h1 style={{ fontFamily:"var(--font-cinzel)", fontSize:"clamp(40px,5vw,72px)", fontWeight:900, color:"#e8e8e8", letterSpacing:"6px", textTransform:"uppercase", margin:0, lineHeight:0.9 }}>
            Dashboard
          </h1>
        </div>
      </div>

      <div className="main-pad" style={{ padding:"36px 56px 100px" }}>

        {/* ── OVERVIEW ── */}
        <div className="dash-s" style={{ marginBottom:"48px" }}>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:"12px", marginBottom:"16px" }}>
            <SectionTitle icon="📊" title="Overview" />
            <FilterSelect value={ovFilter} onChange={v=>setOvFilter(v as TimePeriod)} options={[
              {value:"week",label:"This Week"},{value:"month",label:"This Month"},
              {value:"3month",label:"3 Months"},{value:"year",label:"This Year"},
            ]} />
          </div>
          <div className="four-col" style={{ display:"grid", gridTemplateColumns:"repeat(5,1fr)", gap:"12px" }}>
            <MetricCard label="Total Students" value={`${m.students}`} delta={`↑ +12 this period`} color={C.blue} />
            <MetricCard label="Active Students" value={`${m.active}`} delta={`↑ +8 this period`}  color={C.green} />
            <MetricCard label="Teachers"        value={`${m.teachers}`} delta={`↑ +2 this period`} color={C.amber} />
            <MetricCard label="App Users"       value={`${m.users}`} delta={`↑ +24 this period`}  color={C.purple} />
            <MetricCard label="Absent Today"    value={`${m.absent}`} delta={`↓ -3 vs last week`} positive={false} color={C.coral} />
          </div>
        </div>

        {/* ── GROWTH TRENDS ── */}
        <div className="dash-s" style={{ marginBottom:"48px" }}>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:"12px", marginBottom:"16px" }}>
            <SectionTitle icon="📈" title="Growth Trends" />
            <FilterSelect value={trendFilter} onChange={v=>setTrendFilter(v as TrendFilter)} options={[
              {value:"week",label:"Weekly"},{value:"month",label:"Monthly"},{value:"year",label:"Yearly"},
            ]} />
          </div>
          <ChartCard title="Students · Teachers · Users over time" id="trendChart" height={240}>
            <Legend items={[{color:C.blue,label:"Students"},{color:C.green,label:"Teachers"},{color:C.amber,label:"Users"}]} />
          </ChartCard>
        </div>

        {/* ── ATTENDANCE ── */}
        <div className="dash-s" style={{ marginBottom:"48px" }}>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:"12px", marginBottom:"16px" }}>
            <SectionTitle icon="📋" title="Attendance Analytics" />
            <FilterSelect value={attFilter} onChange={v=>setAttFilter(v as AttFilter)} options={[
              {value:"week",label:"This Week"},{value:"month",label:"This Month"},
            ]} />
          </div>
          <div className="two-col" style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"16px", marginBottom:"16px" }}>
            <ChartCard title="Daily attendance status" id="attChart" height={200}>
              <Legend items={[{color:C.green,label:"Present"},{color:C.amber,label:"Late"},{color:C.coral,label:"Absent"}]} />
            </ChartCard>
            <ChartCard title="Attendance rate %" id="attRate" height={200} />
          </div>

          {/* Recovery */}
          <div style={{ padding:"20px", background:"#0a0a0a", border:"1px solid #1a1a1a", borderRadius:"10px" }}>
            <div style={{ fontFamily:"var(--font-montserrat)", fontSize:"10px", fontWeight:700, color:"#666", letterSpacing:"1.5px", textTransform:"uppercase", marginBottom:"6px" }}>
              📩 Student Recovery — Returned after outreach
            </div>
            <p style={{ fontFamily:"var(--font-montserrat)", fontSize:"11px", color:"#555", marginBottom:"20px" }}>
              Students absent 3+ consecutive days who returned after SMS / Email / WhatsApp notification
            </p>
            {[
              {label:"WhatsApp",pct:82,color:C.amber},
              {label:"Email",   pct:74,color:C.blue},
              {label:"SMS",     pct:61,color:C.green},
              {label:"No outreach",pct:18,color:C.gray},
            ].map(r=>(
              <div key={r.label} style={{ display:"flex", alignItems:"center", gap:"12px", marginBottom:"12px" }}>
                <span style={{ fontFamily:"var(--font-montserrat)", fontSize:"11px", color:"#888", width:"100px", flexShrink:0 }}>{r.label}</span>
                <div style={{ flex:1, height:"8px", background:"#1a1a1a", borderRadius:"4px", overflow:"hidden" }}>
                  <div style={{ width:`${r.pct}%`, height:"100%", background:r.color, borderRadius:"4px" }} />
                </div>
                <span style={{ fontFamily:"var(--font-cinzel)", fontSize:"13px", fontWeight:700, color:r.color, minWidth:"38px", textAlign:"right" }}>{r.pct}%</span>
              </div>
            ))}
            <div style={{ marginTop:"20px" }}>
              <div style={{ fontFamily:"var(--font-montserrat)", fontSize:"10px", color:"#666", marginBottom:"10px" }}>Monthly recovery trend</div>
              <Legend items={[{color:C.amber,label:"WhatsApp"},{color:C.blue,label:"Email"},{color:C.green,label:"SMS"}]} />
              <div style={{ position:"relative", height:"140px" }}><canvas id="recoverChart" /></div>
            </div>
          </div>
        </div>

        {/* ── TEACHERS ── */}
        <div className="dash-s" style={{ marginBottom:"48px" }}>
          <SectionTitle icon="👥" title="Teacher → Student Breakdown" />
          <div className="two-col" style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"16px" }}>
            <ChartCard title="Active vs Absent per teacher" id="teacherChart" height={260}>
              <Legend items={[{color:C.green,label:"Active"},{color:C.coral,label:"Absent"}]} />
            </ChartCard>
            <div style={{ padding:"20px", background:"#0a0a0a", border:"1px solid #1a1a1a", borderRadius:"10px" }}>
              <div style={{ fontFamily:"var(--font-montserrat)", fontSize:"10px", fontWeight:700, color:"#666", letterSpacing:"1.5px", textTransform:"uppercase", marginBottom:"16px" }}>
                Teacher Roster
              </div>
              <div style={{ display:"flex", flexDirection:"column", gap:"14px" }}>
                {TEACHERS.map(t=>{
                  const total=t.active+t.absent;
                  const pct=Math.round((t.active/total)*100);
                  return (
                    <div key={t.name} style={{ display:"flex", alignItems:"center", gap:"12px", paddingBottom:"14px", borderBottom:"1px solid #1a1a1a" }}>
                      <div style={{ width:"38px", height:"38px", borderRadius:"50%", background:`${t.color}22`, display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"var(--font-cinzel)", fontSize:"12px", fontWeight:700, color:t.color, flexShrink:0 }}>
                        {t.initials}
                      </div>
                      <div style={{ flex:1 }}>
                        <div style={{ fontFamily:"var(--font-montserrat)", fontSize:"12px", fontWeight:700, color:"#ccc", marginBottom:"3px" }}>{t.name}</div>
                        <div style={{ fontFamily:"var(--font-montserrat)", fontSize:"10px", color:"#666" }}>{t.active} active · {t.absent} absent</div>
                        <div style={{ height:"4px", background:"#1a1a1a", borderRadius:"2px", marginTop:"5px" }}>
                          <div style={{ width:`${pct}%`, height:"100%", background:t.color, borderRadius:"2px" }} />
                        </div>
                      </div>
                      <div style={{ fontFamily:"var(--font-cinzel)", fontSize:"14px", fontWeight:700, color:t.color }}>{pct}%</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* ── BELT / STATE ── */}
        <div className="dash-s" style={{ marginBottom:"48px" }}>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:"12px", marginBottom:"16px" }}>
            <SectionTitle icon="🗺️" title="Belt Distribution by State" />
            <FilterSelect value={stateFilter} onChange={setStateFilter} options={[
              {value:"all",label:"All States"},
              ...Object.keys(STATE_DATA).map(s=>({value:s,label:s})),
            ]} />
          </div>
          <div className="two-col" style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"16px" }}>
            <ChartCard title="Belt counts (doughnut)" id="beltChart" height={260} />
            <div style={{ padding:"20px", background:"#0a0a0a", border:"1px solid #1a1a1a", borderRadius:"10px" }}>
              <div style={{ fontFamily:"var(--font-montserrat)", fontSize:"10px", fontWeight:700, color:"#666", letterSpacing:"1.5px", textTransform:"uppercase", marginBottom:"14px" }}>
                Students per state
              </div>
              {Object.entries(stateFilter==="all" ? STATE_DATA : {[stateFilter]:STATE_DATA[stateFilter]??{}}).map(([state,data])=>{
                const total=Object.values(data).reduce((a,b)=>a+b,0);
                return (
                  <div key={state} style={{ display:"flex", justifyContent:"space-between", padding:"8px 0", borderBottom:"1px solid #1a1a1a" }}>
                    <span style={{ fontFamily:"var(--font-montserrat)", fontSize:"12px", color:"#ccc" }}>{state}</span>
                    <span style={{ fontFamily:"var(--font-cinzel)", fontSize:"13px", fontWeight:700, color:C.amber }}>{total}</span>
                  </div>
                );
              })}
              <div style={{ marginTop:"16px", display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:"8px" }}>
                {Object.entries(bData).map(([belt,count])=>(
                  <div key={belt} style={{ padding:"10px", background:`${BELT_CLR[belt]}22`, border:`1px solid ${BELT_CLR[belt]}55`, borderRadius:"6px", textAlign:"center" }}>
                    <div style={{ fontFamily:"var(--font-cinzel)", fontSize:"18px", fontWeight:700, color:BELT_CLR[belt]==="ccc"?"#aaa":BELT_CLR[belt] }}>{count}</div>
                    <div style={{ fontFamily:"var(--font-montserrat)", fontSize:"9px", color:"#666", textTransform:"uppercase", marginTop:"2px" }}>{belt}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── REVENUE ── */}
        <div className="dash-s" style={{ marginBottom:"48px" }}>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:"12px", marginBottom:"16px" }}>
            <SectionTitle icon="💰" title="Revenue" />
            <div style={{ display:"flex", gap:"8px", flexWrap:"wrap" }}>
              <FilterSelect value={revPeriod} onChange={v=>setRevPeriod(v as RevPeriod)} options={[
                {value:"week",label:"Weekly"},{value:"month",label:"Monthly"},
                {value:"6month",label:"6 Months"},{value:"year",label:"Yearly"},{value:"2year",label:"2 Years"},
              ]} />
              <FilterSelect value={revSource} onChange={v=>setRevSource(v as RevSource)} options={[
                {value:"all",label:"All Sources"},{value:"camps",label:"Camps"},
                {value:"tournament",label:"Tournaments"},{value:"belt",label:"Belt Tests"},{value:"monthly",label:"Monthly Fees"},
              ]} />
            </div>
          </div>
          <div className="four-col" style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:"12px", marginBottom:"16px" }}>
            <MetricCard label="Total Revenue"  value={`₹${Math.round(totalRev/1000)}K`}       delta="↑ +18% vs last period" color={C.amber} />
            <MetricCard label="Camps"          value={`₹${Math.round(sum(rd.camps)/1000)}K`}  delta="↑ +22%" color={C.blue} />
            <MetricCard label="Belt Tests"     value={`₹${Math.round(sum(rd.belt)/1000)}K`}   delta="↑ +9%"  color={C.coral} />
            <MetricCard label="Monthly Fees"   value={`₹${Math.round(sum(rd.fees)/1000)}K`}   delta="↑ +14%" color={C.green} />
          </div>
          <ChartCard title="Revenue breakdown over time" id="revenueChart" height={260}>
            <Legend items={[{color:C.blue,label:"Monthly Fees"},{color:C.green,label:"Camps"},{color:C.amber,label:"Tournaments"},{color:C.coral,label:"Belt Tests"}]} />
          </ChartCard>
          <div className="two-col" style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"16px", marginTop:"16px" }}>
            <ChartCard title="Camp-wise revenue" id="campChart" height={180} />
            <ChartCard title="Tournament-wise revenue" id="tournChart" height={180} />
          </div>
        </div>

      </div>

      <footer style={{ padding:"32px 56px", background:"#0a0a0a", borderTop:"1px solid #1a1a1a", textAlign:"center" }}>
        <p style={{ fontFamily:"var(--font-montserrat)", fontSize:"11px", color:"#555", margin:0, letterSpacing:"1px" }}>
          © 2024 Dadi Bulsara Ashihara Karate · Admin Panel
        </p>
      </footer>
    </div>
  );
}