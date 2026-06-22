"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// ── Types ─────────────────────────────────────────────────────────────────────
type Belt = "White" | "Yellow" | "Green" | "Blue" | "Brown" | "Black";
type AttendanceStatus = "Present" | "Absent" | "Late";
type ViewMode = "attendance" | "analytics";
type TimeFilter = "weekly" | "monthly";

interface Student {
  id: number;
  firstName: string;
  lastName: string;
  age: number;
  belt: Belt;
  state: string;
  photo?: string;
  sensei: string;
  campsCount: number;
  eventsCount: number;
  isChampion: boolean;
  championYear?: number;
}

interface AttendanceRecord {
  id: number;
  studentId: number;
  date: string;
  day: string;
  status: AttendanceStatus;
  classId: number;
  note?: string;
}

interface KarateClass {
  id: number;
  name: string;
  level: string;
  schedule: string;
  students: number;
  color: string;
  glow: string;
}

// ── Data ──────────────────────────────────────────────────────────────────────
const BELT_COLORS: Record<Belt, { bg: string; text: string; border: string; glow: string }> = {
  White:  { bg: "#f5f5f5", text: "#111", border: "#ccc",    glow: "rgba(255,255,255,0.3)" },
  Yellow: { bg: "#f5c518", text: "#111", border: "#d4a800", glow: "rgba(245,197,24,0.5)" },
  Green:  { bg: "#2d6a2d", text: "#fff", border: "#3a8c3a", glow: "rgba(58,140,58,0.5)" },
  Blue:   { bg: "#1a3a6e", text: "#fff", border: "#2255aa", glow: "rgba(34,85,170,0.5)" },
  Brown:  { bg: "#5c3317", text: "#fff", border: "#7a4520", glow: "rgba(122,69,32,0.5)" },
  Black:  { bg: "#111",    text: "#fff", border: "#c9a84c", glow: "rgba(201,168,76,0.5)" },
};

const BELT_GRADIENTS: Record<Belt, string> = {
  White:  "linear-gradient(180deg,#e8e8e8,#aaa,#e8e8e8)",
  Yellow: "linear-gradient(180deg,#f5c518,#d4a800,#f5c518)",
  Green:  "linear-gradient(180deg,#1e4a1e,#3a8c3a,#1e4a1e)",
  Blue:   "linear-gradient(180deg,#0f2548,#2255aa,#0f2548)",
  Brown:  "linear-gradient(180deg,#3e2210,#7a4520,#3e2210)",
  Black:  "linear-gradient(180deg,#111,#555,#c9a84c,#555,#111)",
};

const SAMPLE_CLASSES: KarateClass[] = [
  { id: 1, name: "Beginner Kids",   level: "White–Yellow", schedule: "Mon, Wed  4:00 PM", students: 12, color: "#d4a800", glow: "rgba(245,197,24,0.4)" },
  { id: 2, name: "Advanced Kids",   level: "Green–Brown",  schedule: "Tue, Thu  5:00 PM", students: 8,  color: "#3a8c3a", glow: "rgba(58,140,58,0.4)" },
  { id: 3, name: "Teen Warriors",   level: "Brown–Black",  schedule: "Mon,Wed,Fri 6:30 PM",students: 6, color: "#c9a84c", glow: "rgba(201,168,76,0.4)" },
];

const SAMPLE_STUDENTS: Student[] = [
  { id:1, firstName:"Arjun",  lastName:"Sharma", age:14, belt:"Black",  state:"Maharashtra", sensei:"Dadi Bulsara", campsCount:6, eventsCount:12, isChampion:true,  championYear:2023 },
  { id:2, firstName:"Priya",  lastName:"Mehta",  age:16, belt:"Brown",  state:"Gujarat",     sensei:"Dadi Bulsara", campsCount:4, eventsCount:8,  isChampion:false },
  { id:3, firstName:"Rahul",  lastName:"Verma",  age:12, belt:"Blue",   state:"Delhi",       sensei:"Dadi Bulsara", campsCount:3, eventsCount:5,  isChampion:false },
  { id:4, firstName:"Sneha",  lastName:"Patil",  age:17, belt:"Black",  state:"Maharashtra", sensei:"Dadi Bulsara", campsCount:8, eventsCount:15, isChampion:true,  championYear:2024 },
  { id:5, firstName:"Vikram", lastName:"Singh",  age:13, belt:"Green",  state:"Punjab",      sensei:"Dadi Bulsara", campsCount:2, eventsCount:4,  isChampion:false },
  { id:6, firstName:"Ananya", lastName:"Iyer",   age:15, belt:"Brown",  state:"Tamil Nadu",  sensei:"Dadi Bulsara", campsCount:5, eventsCount:9,  isChampion:false },
];

const INITIAL_ATTENDANCE: AttendanceRecord[] = [
  { id:1,  studentId:1, date:"2025-06-20", day:"Friday",    status:"Present", classId:1 },
  { id:2,  studentId:2, date:"2025-06-20", day:"Friday",    status:"Late",    classId:1 },
  { id:3,  studentId:3, date:"2025-06-20", day:"Friday",    status:"Absent",  classId:1 },
  { id:4,  studentId:4, date:"2025-06-20", day:"Friday",    status:"Present", classId:1 },
  { id:5,  studentId:5, date:"2025-06-20", day:"Friday",    status:"Present", classId:1 },
  { id:6,  studentId:6, date:"2025-06-20", day:"Friday",    status:"Present", classId:1 },
  { id:7,  studentId:1, date:"2025-06-18", day:"Wednesday", status:"Present", classId:1 },
  { id:8,  studentId:2, date:"2025-06-18", day:"Wednesday", status:"Present", classId:1 },
  { id:9,  studentId:3, date:"2025-06-18", day:"Wednesday", status:"Late",    classId:1 },
  { id:10, studentId:4, date:"2025-06-18", day:"Wednesday", status:"Absent",  classId:1 },
  { id:11, studentId:5, date:"2025-06-18", day:"Wednesday", status:"Present", classId:1 },
  { id:12, studentId:6, date:"2025-06-18", day:"Wednesday", status:"Present", classId:1 },
  { id:13, studentId:1, date:"2025-06-15", day:"Sunday",    status:"Present", classId:2 },
  { id:14, studentId:2, date:"2025-06-15", day:"Sunday",    status:"Absent",  classId:2 },
  { id:15, studentId:3, date:"2025-06-15", day:"Sunday",    status:"Present", classId:2 },
  { id:16, studentId:4, date:"2025-06-15", day:"Sunday",    status:"Present", classId:2 },
  { id:17, studentId:1, date:"2025-06-10", day:"Tuesday",   status:"Present", classId:1 },
  { id:18, studentId:2, date:"2025-06-10", day:"Tuesday",   status:"Present", classId:1 },
  { id:19, studentId:5, date:"2025-06-10", day:"Tuesday",   status:"Late",    classId:1 },
];

// ── Global Styles ─────────────────────────────────────────────────────────────
const GLOBAL_STYLES = `
  @keyframes ring-spin    { from{transform:rotate(0deg);} to{transform:rotate(360deg);} }
  @keyframes ring-pulse   { 0%,100%{opacity:.55;transform:scale(1);} 50%{opacity:1;transform:scale(1.07);} }
  @keyframes ring-ripple  { 0%{opacity:.7;transform:scale(1);} 100%{opacity:0;transform:scale(1.5);} }
  @keyframes banner-shine { 0%{top:-50px;opacity:0;} 30%{opacity:1;} 70%{opacity:1;} 100%{top:110%;opacity:0;} }
  @keyframes black-spin   { from{transform:rotate(0deg);} to{transform:rotate(360deg);} }
  @keyframes spark-orbit  { 0%{transform:rotate(0deg) translateX(36px);opacity:1;} 50%{opacity:.3;} 100%{transform:rotate(360deg) translateX(36px);opacity:1;} }
  @keyframes pop-in       { from{opacity:0;transform:scale(.92) translateY(20px);} to{opacity:1;transform:scale(1) translateY(0);} }
  @keyframes overlay-in   { from{opacity:0;} to{opacity:1;} }
  @keyframes status-badge { 0%,100%{opacity:.8;} 50%{opacity:1;} }
  @keyframes glow-border  { 0%,100%{opacity:.6;} 50%{opacity:1;} }
  input::placeholder{color:#333;}
  select option{background:#0d0d0d;}
  .class-btn:hover{border-color:#c9a84c !important; box-shadow:0 0 12px rgba(201,168,76,0.2) !important;}
  * { box-sizing:border-box; }
`;

// ── Belt Banner ───────────────────────────────────────────────────────────────
function BeltBanner({ belt }: { belt: Belt }) {
  const bc = BELT_COLORS[belt];
  const grad = BELT_GRADIENTS[belt];
  const isBlack = belt === "Black";

  return (
    <div style={{ position: "absolute", top: 0, bottom: 0, left: 0, width: "7px", borderRadius: "8px 0 0 8px", overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 0, background: grad, boxShadow: `3px 0 14px ${bc.glow}` }} />
      <div style={{
        position: "absolute", left: 0, width: "100%", height: "50px",
        background: `linear-gradient(to bottom, transparent, ${isBlack ? "rgba(201,168,76,0.9)" : `${bc.border}cc`}, transparent)`,
        animationName: "banner-shine", animationDuration: isBlack ? "2s" : "3s",
        animationTimingFunction: "ease-in-out", animationIterationCount: "infinite",
      }} />
    </div>
  );
}

// ── Avatar Rings — Belt Specific ──────────────────────────────────────────────
function AvatarRings({ belt }: { belt: Belt }) {
  const bc = BELT_COLORS[belt];

  if (belt === "Black") return (
    <>
      <div style={{
        position: "absolute", width: "90px", height: "90px", borderRadius: "50%",
        background: `conic-gradient(#c9a84c 0deg 45deg,transparent 45deg 90deg,#c9a84c 90deg 135deg,transparent 135deg 180deg,#c9a84c 180deg 225deg,transparent 225deg 270deg,#c9a84c 270deg 315deg,transparent 315deg 360deg)`,
        WebkitMask: "radial-gradient(farthest-side,transparent calc(100% - 2px),#fff calc(100% - 2px))",
        animationName: "black-spin", animationDuration: "5s", animationTimingFunction: "linear", animationIterationCount: "infinite",
      }} />
      <div style={{
        position: "absolute", width: "80px", height: "80px", borderRadius: "50%",
        border: "1px solid rgba(201,168,76,0.3)",
        animationName: "ring-spin", animationDuration: "8s", animationTimingFunction: "linear",
        animationDirection: "reverse", animationIterationCount: "infinite",
        boxShadow: "0 0 10px rgba(201,168,76,0.2), inset 0 0 8px rgba(201,168,76,0.1)",
      }} />
      {[{c:"#c9a84c",d:"2.6s",dl:"0s"},{c:"#fff",d:"3.2s",dl:"0.9s"},{c:"#c9a84c",d:"3.8s",dl:"1.8s"}].map((sp,i)=>(
        <div key={i} style={{
          position: "absolute", top: "50%", left: "50%",
          width: "4px", height: "4px", borderRadius: "50%", margin: "-2px 0 0 -2px",
          background: sp.c, boxShadow: `0 0 5px 2px ${sp.c}`,
          animationName: "spark-orbit", animationDuration: sp.d, animationDelay: sp.dl,
          animationTimingFunction: "linear", animationIterationCount: "infinite",
        }} />
      ))}
    </>
  );

  if (belt === "Blue") return (
    <>
      <div style={{ position:"absolute", width:"80px", height:"80px", borderRadius:"50%", border:`2px solid ${bc.border}`, boxShadow:`0 0 14px ${bc.glow}`, animationName:"ring-pulse", animationDuration:"2s", animationTimingFunction:"ease-in-out", animationIterationCount:"infinite" }} />
      <div style={{ position:"absolute", width:"82px", height:"82px", borderRadius:"50%", border:`1px solid ${bc.border}`, opacity:0, animationName:"ring-ripple", animationDuration:"1.6s", animationTimingFunction:"ease-out", animationIterationCount:"infinite" }} />
      <div style={{ position:"absolute", width:"82px", height:"82px", borderRadius:"50%", border:`1px solid ${bc.border}`, opacity:0, animationName:"ring-ripple", animationDuration:"1.6s", animationDelay:"0.8s", animationTimingFunction:"ease-out", animationIterationCount:"infinite" }} />
    </>
  );

  if (belt === "Yellow") return (
    <>
      <div style={{ position:"absolute", width:"80px", height:"80px", borderRadius:"50%", border:`2px solid ${bc.border}`, boxShadow:`0 0 16px ${bc.glow}`, animationName:"ring-pulse", animationDuration:"1.8s", animationTimingFunction:"ease-in-out", animationIterationCount:"infinite" }} />
      <div style={{ position:"absolute", width:"88px", height:"88px", borderRadius:"50%", border:`1px dashed ${bc.border}`, opacity:.45, animationName:"ring-spin", animationDuration:"9s", animationTimingFunction:"linear", animationIterationCount:"infinite" }} />
    </>
  );

  if (belt === "Green") return (
    <>
      <div style={{ position:"absolute", width:"80px", height:"80px", borderRadius:"50%", border:`2px solid ${bc.border}`, boxShadow:`0 0 12px ${bc.glow}`, animationName:"ring-pulse", animationDuration:"3.5s", animationTimingFunction:"ease-in-out", animationIterationCount:"infinite" }} />
      <div style={{ position:"absolute", width:"88px", height:"88px", borderRadius:"50%", border:`1px solid ${bc.border}`, opacity:.2, animationName:"ring-spin", animationDuration:"10s", animationTimingFunction:"linear", animationIterationCount:"infinite" }} />
    </>
  );

  if (belt === "Brown") return (
    <div style={{ position:"absolute", width:"80px", height:"80px", borderRadius:"50%", border:`2px solid ${bc.border}`, boxShadow:`0 0 12px ${bc.glow}`, animationName:"ring-pulse", animationDuration:"3s", animationTimingFunction:"ease-in-out", animationIterationCount:"infinite" }} />
  );

  return (
    <div style={{ position:"absolute", width:"80px", height:"80px", borderRadius:"50%", border:"1px solid rgba(255,255,255,0.3)", boxShadow:"0 0 8px rgba(255,255,255,0.1)", animationName:"ring-pulse", animationDuration:"4s", animationTimingFunction:"ease-in-out", animationIterationCount:"infinite" }} />
  );
}

// ── Student Avatar ────────────────────────────────────────────────────────────
function StudentAvatar({ student, size = 68 }: { student: Student; size?: number }) {
  const bc = BELT_COLORS[student.belt];
  const initials = student.firstName[0] + student.lastName[0];

  return (
    <div style={{ position: "relative", width: `${size + 22}px`, height: `${size + 22}px`, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <AvatarRings belt={student.belt} />
      <div style={{
        width: `${size}px`, height: `${size}px`, borderRadius: "50%",
        background: bc.bg, border: `2.5px solid ${bc.border}`,
        display: "flex", alignItems: "center", justifyContent: "center",
        position: "relative", zIndex: 2, overflow: "hidden",
        boxShadow: `0 0 16px ${bc.glow}88`,
      }}>
        {student.photo
          ? <img src={student.photo} alt={student.firstName} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          : <span style={{ fontFamily: "var(--font-cinzel)", fontSize: `${size * 0.28}px`, fontWeight: 700, color: bc.text, letterSpacing: "2px" }}>{initials}</span>
        }
      </div>
    </div>
  );
}

// ── Student Profile Card Modal ────────────────────────────────────────────────
function StudentProfileModal({ student, attendance, onClose }: { student: Student; attendance: AttendanceRecord[]; onClose: () => void }) {
  const bc = BELT_COLORS[student.belt];
  const grad = BELT_GRADIENTS[student.belt];
  const modalRef = useRef<HTMLDivElement>(null);

  const studentAtt = attendance.filter(a => a.studentId === student.id);
  const presentCount = studentAtt.filter(a => a.status === "Present").length;
  const absentCount = studentAtt.filter(a => a.status === "Absent").length;
  const lateCount = studentAtt.filter(a => a.status === "Late").length;
  const pct = studentAtt.length > 0 ? Math.round((presentCount / studentAtt.length) * 100) : 0;

  useEffect(() => {
    gsap.fromTo(modalRef.current,
      { opacity: 0, scale: 0.9, y: 30 },
      { opacity: 1, scale: 1, y: 0, duration: 0.5, ease: "back.out(1.4)" }
    );
  }, []);

  const handleClose = () => {
    gsap.to(modalRef.current, {
      opacity: 0, scale: 0.9, y: 20, duration: 0.3, ease: "power2.in",
      onComplete: onClose,
    });
  };

  return (
    <div style={{
      position: "fixed", inset: 0, background: "rgba(0,0,0,0.85)", backdropFilter: "blur(6px)",
      display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000,
      animationName: "overlay-in", animationDuration: "0.3s",
    }} onClick={handleClose}>
      <div ref={modalRef} style={{
        position: "relative", width: "min(540px, 92vw)",
        background: "#0a0a0a", borderRadius: "12px", overflow: "hidden",
        boxShadow: `0 30px 80px rgba(0,0,0,0.9), 0 0 40px ${bc.glow}`,
        border: `1px solid ${bc.border}40`,
      }} onClick={e => e.stopPropagation()}>
        {/* Left banner */}
        <div style={{ position: "absolute", top: 0, left: 0, bottom: 0, width: "8px", background: grad, boxShadow: `4px 0 16px ${bc.glow}` }} />

        {/* Top edge glow */}
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "1px", background: `linear-gradient(to right, ${bc.border}00, ${bc.border}cc, ${bc.border}00)` }} />
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "1px", background: `linear-gradient(to right, ${bc.border}00, ${bc.border}66, ${bc.border}00)` }} />
        <div style={{ position: "absolute", top: 0, right: 0, bottom: 0, width: "1px", background: `linear-gradient(to bottom, ${bc.border}00, ${bc.border}99, ${bc.border}00)` }} />

        {/* Close btn */}
        <button onClick={handleClose} style={{
          position: "absolute", top: "14px", right: "14px", zIndex: 10,
          background: "#1a1a1a", border: "1px solid #2a2a2a", borderRadius: "50%",
          width: "28px", height: "28px", cursor: "pointer", color: "#666",
          display: "flex", alignItems: "center", justifyContent: "center", fontSize: "16px",
        }}>×</button>

        <div style={{ padding: "28px 24px 24px 32px" }}>
          {/* Header: avatar + name */}
          <div style={{ display: "flex", gap: "20px", alignItems: "center", marginBottom: "24px" }}>
            <StudentAvatar student={student} size={72} />
            <div style={{ flex: 1, minWidth: 0 }}>
              {student.isChampion && (
                <div style={{ fontFamily: "var(--font-montserrat)", fontSize: "8px", fontWeight: 700, letterSpacing: "2px", color: "#c9a84c", textTransform: "uppercase", marginBottom: "4px" }}>
                  ★ Champion {student.championYear}
                </div>
              )}
              <h2 style={{ fontFamily: "var(--font-cinzel)", fontSize: "20px", fontWeight: 700, color: "#e8e8e8", margin: "0 0 6px", letterSpacing: "0.5px" }}>
                {student.firstName} {student.lastName}
              </h2>
              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                <span style={{
                  display: "inline-flex", alignItems: "center", gap: "4px",
                  padding: "3px 10px 3px 6px", background: bc.bg, color: bc.text,
                  border: `1px solid ${bc.border}`, borderRadius: "3px",
                  fontFamily: "var(--font-montserrat)", fontSize: "10px", fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase",
                }}>
                  <span style={{ width: "7px", height: "7px", borderRadius: "50%", background: bc.text, opacity: 0.6 }} />
                  {student.belt}
                </span>
                <span style={{ fontFamily: "var(--font-montserrat)", fontSize: "10px", color: "#666" }}>Age {student.age}</span>
                <span style={{ color: "#2a2a2a" }}>·</span>
                <span style={{ fontFamily: "var(--font-montserrat)", fontSize: "10px", color: "#666" }}>{student.state}</span>
              </div>
            </div>
          </div>

          {/* Attendance ring stat */}
          <div style={{
            display: "flex", gap: "12px", alignItems: "stretch", marginBottom: "20px",
          }}>
            {/* Donut-like pct */}
            <div style={{
              flex: 1, padding: "16px", background: "#0d0d0d", borderRadius: "8px",
              border: `1px solid ${bc.border}40`, display: "flex", flexDirection: "column",
              alignItems: "center", justifyContent: "center",
            }}>
              <div style={{ fontFamily: "var(--font-cinzel)", fontSize: "36px", fontWeight: 900, color: pct >= 75 ? "#27ae60" : pct >= 50 ? "#f39c12" : "#e74c3c", lineHeight: 1 }}>
                {pct}%
              </div>
              <div style={{ fontFamily: "var(--font-montserrat)", fontSize: "8px", color: "#555", letterSpacing: "2px", textTransform: "uppercase", marginTop: "4px" }}>
                Attendance
              </div>
            </div>

            {/* Mini stats */}
            <div style={{ display: "flex", flexDirection: "column", gap: "8px", justifyContent: "center" }}>
              {[
                { label: "Present", val: presentCount, color: "#27ae60" },
                { label: "Late",    val: lateCount,    color: "#f39c12" },
                { label: "Absent",  val: absentCount,  color: "#e74c3c" },
              ].map(s => (
                <div key={s.label} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: s.color, flexShrink: 0 }} />
                  <span style={{ fontFamily: "var(--font-montserrat)", fontSize: "11px", color: "#888", minWidth: "48px" }}>{s.label}</span>
                  <span style={{ fontFamily: "var(--font-cinzel)", fontSize: "16px", fontWeight: 700, color: "#ccc", lineHeight: 1 }}>{s.val}</span>
                </div>
              ))}
            </div>

            {/* Other stats */}
            <div style={{ display: "flex", flexDirection: "column", gap: "8px", justifyContent: "center", borderLeft: "1px solid #1a1a1a", paddingLeft: "12px" }}>
              {[
                { label: "Camps",  val: student.campsCount },
                { label: "Events", val: student.eventsCount },
              ].map(s => (
                <div key={s.label} style={{ textAlign: "center" }}>
                  <div style={{ fontFamily: "var(--font-cinzel)", fontSize: "16px", fontWeight: 700, color: "#bbb", lineHeight: 1 }}>{s.val}</div>
                  <div style={{ fontFamily: "var(--font-montserrat)", fontSize: "8px", color: "#555", letterSpacing: "1px", textTransform: "uppercase", marginTop: "2px" }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent attendance */}
          <div>
            <div style={{ fontFamily: "var(--font-montserrat)", fontSize: "10px", color: "#555", letterSpacing: "2px", textTransform: "uppercase", marginBottom: "10px", paddingBottom: "8px", borderBottom: "1px solid #1a1a1a" }}>
              Recent Records
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "6px", maxHeight: "180px", overflowY: "auto" }}>
              {studentAtt.length === 0 ? (
                <p style={{ fontFamily: "var(--font-cormorant)", fontSize: "14px", color: "#555", fontStyle: "italic", textAlign: "center", padding: "20px 0" }}>
                  No records yet
                </p>
              ) : studentAtt.map((rec, i) => {
                const statusColors: Record<AttendanceStatus, { bg: string; text: string }> = {
                  Present: { bg: "rgba(39,174,96,0.15)", text: "#27ae60" },
                  Absent:  { bg: "rgba(231,76,60,0.15)",  text: "#e74c3c" },
                  Late:    { bg: "rgba(243,156,18,0.15)", text: "#f39c12" },
                };
                const sc = statusColors[rec.status];
                return (
                  <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 12px", background: "#0d0d0d", borderRadius: "4px" }}>
                    <span style={{ fontFamily: "var(--font-montserrat)", fontSize: "10px", color: "#888" }}>
                      {rec.date} · {rec.day}
                    </span>
                    <span style={{ fontFamily: "var(--font-montserrat)", fontSize: "9px", fontWeight: 700, padding: "3px 8px", borderRadius: "3px", color: sc.text, background: sc.bg, textTransform: "uppercase", letterSpacing: "0.5px" }}>
                      {rec.status}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Sensei */}
          <div style={{ marginTop: "16px", padding: "10px 14px", background: "#0d0d0d", borderRadius: "6px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontFamily: "var(--font-montserrat)", fontSize: "9px", color: "#555", letterSpacing: "1px", textTransform: "uppercase" }}>Sensei</span>
            <span style={{ fontFamily: "var(--font-cormorant)", fontSize: "13px", color: "#999", fontStyle: "italic" }}>{student.sensei}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Attendance Row ────────────────────────────────────────────────────────────
function AttendanceRow({
  student,
  record,
  onStatusChange,
  onAvatarClick,
}: {
  student: Student;
  record: AttendanceRecord | undefined;
  onStatusChange: (studentId: number, status: AttendanceStatus) => void;
  onAvatarClick: (student: Student) => void;
}) {
  const bc = BELT_COLORS[student.belt];
  const rowRef = useRef<HTMLDivElement>(null);
  const statuses: AttendanceStatus[] = ["Present", "Absent", "Late"];
  const statusColors: Record<AttendanceStatus, { bg: string; text: string; border: string }> = {
    Present: { bg: "rgba(39,174,96,0.15)",  text: "#27ae60", border: "#27ae6055" },
    Absent:  { bg: "rgba(231,76,60,0.15)",  text: "#e74c3c", border: "#e74c3c55" },
    Late:    { bg: "rgba(243,156,18,0.15)", text: "#f39c12", border: "#f39c1255" },
  };

  return (
    <div ref={rowRef} style={{
      position: "relative",
      background: "#0a0a0a",
      border: `1px solid #1a1a1a`,
      borderRadius: "8px",
      overflow: "hidden",
      display: "flex",
      alignItems: "center",
      gap: "16px",
      padding: "14px 16px 14px 20px",
      transition: "all 0.25s ease",
    }}
    onMouseEnter={() => gsap.to(rowRef.current, { y: -3, boxShadow: `0 8px 24px rgba(0,0,0,0.6), 0 0 12px ${bc.glow}55`, borderColor: bc.border, duration: 0.25, ease: "power2.out" })}
    onMouseLeave={() => gsap.to(rowRef.current, { y: 0, boxShadow: "none", borderColor: "#1a1a1a", duration: 0.2, ease: "power2.inOut" })}
    >
      {/* Belt banner */}
      <BeltBanner belt={student.belt} />

      {/* Top/bottom edge */}
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "1px", background: `linear-gradient(to right, ${bc.border}00, ${bc.border}66, ${bc.border}00)`, zIndex: 2 }} />
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "1px", background: `linear-gradient(to right, ${bc.border}00, ${bc.border}33, ${bc.border}00)`, zIndex: 2 }} />

      {/* Avatar — clickable */}
      <div onClick={() => onAvatarClick(student)} style={{ cursor: "pointer" }}>
        <StudentAvatar student={student} size={56} />
      </div>

      {/* Name + Belt */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "3px", flexWrap: "wrap" }}>
          <span style={{ fontFamily: "var(--font-cinzel)", fontSize: "14px", fontWeight: 600, color: "#e0e0e0", letterSpacing: "0.5px" }}>
            {student.firstName} {student.lastName}
          </span>
          {student.isChampion && (
            <span style={{ fontFamily: "var(--font-montserrat)", fontSize: "8px", fontWeight: 700, color: "#c9a84c", border: "1px solid #c9a84c44", background: "#c9a84c10", padding: "1px 6px", borderRadius: "2px", letterSpacing: "1px" }}>
              ★ {student.championYear}
            </span>
          )}
        </div>
        <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
          <span style={{
            padding: "2px 8px 2px 5px", display: "inline-flex", alignItems: "center", gap: "4px",
            background: bc.bg, color: bc.text, border: `1px solid ${bc.border}`, borderRadius: "2px",
            fontFamily: "var(--font-montserrat)", fontSize: "9px", fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase",
          }}>
            <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: bc.text, opacity: 0.6 }} />
            {student.belt}
          </span>
          <span style={{ fontFamily: "var(--font-montserrat)", fontSize: "10px", color: "#555" }}>Age {student.age}</span>
        </div>
      </div>

      {/* Attendance buttons */}
      <div style={{ display: "flex", gap: "6px", flexShrink: 0 }}>
        {statuses.map(s => {
          const sc = statusColors[s];
          const isActive = record?.status === s;
          return (
            <button
              key={s}
              onClick={() => onStatusChange(student.id, s)}
              style={{
                padding: "7px 14px",
                background: isActive ? sc.bg : "transparent",
                border: `1px solid ${isActive ? sc.border : "#2a2a2a"}`,
                borderRadius: "5px",
                color: isActive ? sc.text : "#555",
                fontFamily: "var(--font-montserrat)",
                fontSize: "9px",
                fontWeight: 700,
                letterSpacing: "1px",
                textTransform: "uppercase",
                cursor: "pointer",
                transition: "all 0.2s ease",
              }}
              onMouseEnter={e => {
                if (!isActive) {
                  e.currentTarget.style.background = sc.bg;
                  e.currentTarget.style.borderColor = sc.border;
                  e.currentTarget.style.color = sc.text;
                }
              }}
              onMouseLeave={e => {
                if (!isActive) {
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.borderColor = "#2a2a2a";
                  e.currentTarget.style.color = "#555";
                }
              }}
            >
              {s}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ── Analytics Bar ─────────────────────────────────────────────────────────────
function AnalyticsBar({ label, present, late, absent, total }: { label: string; present: number; late: number; absent: number; total: number }) {
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.fromTo(barRef.current, { scaleX: 0 }, { scaleX: 1, duration: 0.9, ease: "power2.out", delay: 0.1 });
  }, []);

  const pPct = total > 0 ? (present / total) * 100 : 0;
  const lPct = total > 0 ? (late / total) * 100 : 0;
  const aPct = total > 0 ? (absent / total) * 100 : 0;

  return (
    <div style={{ marginBottom: "18px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
        <span style={{ fontFamily: "var(--font-montserrat)", fontSize: "11px", color: "#ccc", fontWeight: 600 }}>{label}</span>
        <span style={{ fontFamily: "var(--font-cinzel)", fontSize: "13px", color: "#888" }}>
          {present}<span style={{ color: "#555" }}>/{total}</span>
        </span>
      </div>
      <div style={{ height: "8px", background: "#111", borderRadius: "4px", overflow: "hidden", display: "flex" }}>
        <div ref={barRef} style={{ transformOrigin: "left", display: "flex", width: "100%" }}>
          <div style={{ width: `${pPct}%`, background: "#27ae60", transition: "width 0.3s" }} />
          <div style={{ width: `${lPct}%`, background: "#f39c12", transition: "width 0.3s" }} />
          <div style={{ width: `${aPct}%`, background: "#e74c3c", transition: "width 0.3s" }} />
        </div>
      </div>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function TeacherPanelPage() {
  const [activeClassId, setActiveClassId] = useState<number>(SAMPLE_CLASSES[0].id);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>(INITIAL_ATTENDANCE);
  const [today] = useState(new Date().toISOString().split("T")[0]);
  const [viewMode, setViewMode] = useState<ViewMode>("attendance");
  const [timeFilter, setTimeFilter] = useState<TimeFilter>("weekly");
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [search, setSearch] = useState("");

  const headerRef = useRef<HTMLDivElement>(null);
  const rowsRef = useRef<HTMLDivElement>(null);

  // Animate header on mount
  useEffect(() => {
    gsap.to(".panel-page", { opacity: 1, duration: 0.4 });
    const tl = gsap.timeline({ defaults: { ease: "power4.out" } });
    tl.fromTo(headerRef.current ? headerRef.current.children : [],
      { opacity: 0, y: 30, filter: "blur(8px)" },
      { opacity: 1, y: 0, filter: "blur(0px)", duration: 1, stagger: 0.12 }
    );
  }, []);

  // Animate rows when class/view changes
  useEffect(() => {
    if (!rowsRef.current) return;
    const items = rowsRef.current.querySelectorAll(".att-row");
    gsap.fromTo(items,
      { opacity: 0, y: 24, scale: 0.98 },
      { opacity: 1, y: 0, scale: 1, stagger: 0.06, duration: 0.5, ease: "power2.out" }
    );
  }, [activeClassId, viewMode]);

  const activeClass = SAMPLE_CLASSES.find(c => c.id === activeClassId)!;

  // Today's attendance for active class
  const todayRecords = useMemo(() =>
    attendance.filter(a => a.classId === activeClassId && a.date === today),
    [attendance, activeClassId, today]
  );

  const handleStatusChange = (studentId: number, status: AttendanceStatus) => {
    setAttendance(prev => {
      const existing = prev.findIndex(a => a.studentId === studentId && a.classId === activeClassId && a.date === today);
      const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
      const dayName = days[new Date(today).getDay()];
      if (existing >= 0) {
        const updated = [...prev];
        updated[existing] = { ...updated[existing], status };
        return updated;
      }
      return [...prev, { id: Date.now(), studentId, date: today, day: dayName, status, classId: activeClassId }];
    });
  };

  // Analytics: filter by week or month
  const analyticsData = useMemo(() => {
    const now = new Date();
    return SAMPLE_STUDENTS.map(student => {
      const recs = attendance.filter(a => {
        if (a.studentId !== student.id) return false;
        const d = new Date(a.date);
        if (timeFilter === "weekly") {
          const start = new Date(now); start.setDate(now.getDate() - 7);
          return d >= start;
        } else {
          const start = new Date(now); start.setDate(now.getDate() - 30);
          return d >= start;
        }
      });
      return {
        student,
        present: recs.filter(r => r.status === "Present").length,
        late:    recs.filter(r => r.status === "Late").length,
        absent:  recs.filter(r => r.status === "Absent").length,
        total:   recs.length,
      };
    }).filter(d => d.total > 0);
  }, [attendance, timeFilter]);

  const filteredStudents = SAMPLE_STUDENTS.filter(s =>
    !search || `${s.firstName} ${s.lastName}`.toLowerCase().includes(search.toLowerCase())
  );

  const totalPresent = todayRecords.filter(r => r.status === "Present").length;
  const totalAbsent = todayRecords.filter(r => r.status === "Absent").length;
  const totalLate = todayRecords.filter(r => r.status === "Late").length;
  const totalMarked = todayRecords.length;

  return (
    <div className="panel-page" style={{ minHeight: "100vh", background: "#050505", paddingTop: "80px", opacity: 0 }}>
      <style>{GLOBAL_STYLES}</style>

      {/* ── EPIC HEADER ── */}
      <div style={{ position: "relative", overflow: "hidden", padding: "52px 56px 0" }}>
        <div style={{
          position: "absolute", top: "-20px", right: "-40px",
          fontFamily: "var(--font-cinzel)", fontSize: "200px", fontWeight: 900,
          color: "rgba(255,255,255,0.02)", letterSpacing: "10px",
          textTransform: "uppercase", pointerEvents: "none", userSelect: "none", lineHeight: 1,
        }}>DOJO</div>

        <div ref={headerRef}>
          {/* Eyebrow */}
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px" }}>
            <div style={{ width: "32px", height: "1px", background: "#555" }} />
            <span style={{ fontFamily: "var(--font-montserrat)", fontSize: "10px", letterSpacing: "5px", color: "#555", textTransform: "uppercase" }}>
              Dadi Bulsara Ashihara Karate · Teacher Dashboard
            </span>
          </div>

          {/* Title + stats panel */}
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: "32px", flexWrap: "wrap", marginBottom: "36px" }}>
            <div>
              <div style={{ fontFamily: "var(--font-montserrat)", fontSize: "clamp(10px,1vw,13px)", fontWeight: 300, letterSpacing: "10px", color: "#3a3a3a", marginBottom: "8px", textTransform: "uppercase" }}>
                Manage Your
              </div>
              <h1 style={{ fontFamily: "var(--font-cinzel)", fontSize: "clamp(44px,6vw,80px)", fontWeight: 900, color: "#e8e8e8", letterSpacing: "6px", textTransform: "uppercase", margin: 0, lineHeight: 0.9 }}>
                Classes
              </h1>
            </div>

            {/* Stats bar */}
            <div style={{ display: "flex", border: "1px solid #1a1a1a", borderRadius: "4px", overflow: "hidden" }}>
              {[
                { label: "Students", val: SAMPLE_STUDENTS.length, color: "#e8e8e8" },
                { label: "Present", val: totalPresent, color: "#27ae60" },
                { label: "Late", val: totalLate, color: "#f39c12" },
                { label: "Absent", val: totalAbsent, color: "#e74c3c" },
              ].map((s, i) => (
                <div key={i} style={{ padding: "14px 20px", background: "#080808", borderRight: "1px solid #1a1a1a" }}>
                  <div style={{ fontFamily: "var(--font-cinzel)", fontSize: "26px", fontWeight: 700, color: s.color, lineHeight: 1, marginBottom: "4px" }}>
                    {s.val}
                  </div>
                  <div style={{ fontFamily: "var(--font-montserrat)", fontSize: "9px", color: "#555", letterSpacing: "1.5px", textTransform: "uppercase" }}>
                    {s.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Tabs */}
          <div style={{ display: "flex", gap: "4px", marginBottom: "0" }}>
            {(["attendance", "analytics"] as ViewMode[]).map(mode => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                style={{
                  padding: "10px 24px",
                  background: viewMode === mode ? "#c9a84c" : "transparent",
                  border: viewMode === mode ? "1px solid #8b6914" : "1px solid #222",
                  borderBottom: "none",
                  borderRadius: "6px 6px 0 0",
                  color: viewMode === mode ? "#000" : "#666",
                  fontFamily: "var(--font-montserrat)",
                  fontSize: "11px", fontWeight: 700,
                  letterSpacing: "1.5px", textTransform: "uppercase",
                  cursor: "pointer", transition: "all 0.25s ease",
                }}
              >
                {mode === "attendance" ? "📋 Attendance" : "📊 Analytics"}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Divider */}
      <div style={{ padding: "0 56px" }}>
        <div style={{ height: "1px", background: "linear-gradient(to right, transparent, #1e1e1e 15%, #1e1e1e 85%, transparent)" }} />
      </div>

      {/* ── MAIN CONTENT ── */}
      <div style={{ padding: "28px 56px 100px", display: "grid", gridTemplateColumns: "220px 1fr", gap: "24px", maxWidth: "100%" }}>

        {/* SIDEBAR — Classes */}
        <div>
          <div style={{ fontFamily: "var(--font-montserrat)", fontSize: "10px", fontWeight: 700, color: "#555", letterSpacing: "2px", textTransform: "uppercase", marginBottom: "14px" }}>
            Your Classes
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "24px" }}>
            {SAMPLE_CLASSES.map(c => (
              <button
                key={c.id}
                className="class-btn"
                onClick={() => setActiveClassId(c.id)}
                style={{
                  padding: "14px 16px",
                  background: activeClassId === c.id ? "#0f0f0f" : "#080808",
                  border: activeClassId === c.id ? `1px solid ${c.color}` : "1px solid #1a1a1a",
                  borderLeft: `4px solid ${activeClassId === c.id ? c.color : "#1a1a1a"}`,
                  borderRadius: "6px",
                  color: activeClassId === c.id ? c.color : "#888",
                  fontFamily: "var(--font-montserrat)",
                  fontSize: "11px", fontWeight: 600,
                  cursor: "pointer", transition: "all 0.25s ease",
                  textAlign: "left",
                  boxShadow: activeClassId === c.id ? `0 0 14px ${c.glow}` : "none",
                }}
              >
                <div style={{ fontWeight: 700, marginBottom: "4px", letterSpacing: "0.5px" }}>{c.name}</div>
                <div style={{ fontSize: "9px", opacity: 0.6 }}>{c.students} students</div>
                <div style={{ fontSize: "9px", opacity: 0.5, marginTop: "2px" }}>{c.schedule}</div>
              </button>
            ))}
          </div>

          {/* Today info */}
          <div style={{ padding: "14px", background: "#0a0a0a", borderRadius: "6px", border: "1px solid #1a1a1a" }}>
            <div style={{ fontFamily: "var(--font-montserrat)", fontSize: "9px", color: "#555", letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: "8px" }}>
              Today
            </div>
            <div style={{ fontFamily: "var(--font-cinzel)", fontSize: "14px", color: "#888", marginBottom: "4px" }}>
              {new Date().toLocaleDateString("en-IN", { weekday: "long" })}
            </div>
            <div style={{ fontFamily: "var(--font-montserrat)", fontSize: "10px", color: "#555" }}>
              {today}
            </div>
            <div style={{ marginTop: "10px", paddingTop: "10px", borderTop: "1px solid #1a1a1a" }}>
              <div style={{ fontFamily: "var(--font-montserrat)", fontSize: "9px", color: "#555", marginBottom: "4px" }}>
                {totalMarked}/{SAMPLE_STUDENTS.length} marked
              </div>
              <div style={{ height: "4px", background: "#111", borderRadius: "2px" }}>
                <div style={{ height: "100%", background: "#c9a84c", borderRadius: "2px", width: `${(totalMarked / SAMPLE_STUDENTS.length) * 100}%`, transition: "width 0.4s" }} />
              </div>
            </div>
          </div>
        </div>

        {/* MAIN CONTENT AREA */}
        <div>
          {viewMode === "attendance" ? (
            <>
              {/* Search + class title */}
              <div style={{ display: "flex", gap: "12px", alignItems: "center", marginBottom: "20px" }}>
                <div>
                  <h2 style={{ fontFamily: "var(--font-cinzel)", fontSize: "18px", fontWeight: 700, color: "#e0e0e0", margin: 0, letterSpacing: "1px" }}>
                    {activeClass.name}
                  </h2>
                  <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "10px", color: "#555", margin: "2px 0 0", letterSpacing: "0.5px" }}>
                    Mark attendance for {today}
                  </p>
                </div>

                <div style={{ position: "relative", marginLeft: "auto", minWidth: "200px" }}>
                  <span style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "#444", fontSize: "14px" }}>⌕</span>
                  <input
                    type="text"
                    placeholder="Search student..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    style={{ width: "100%", padding: "9px 12px 9px 34px", background: "#0d0d0d", border: "1px solid #222", borderRadius: "6px", color: "#ccc", fontFamily: "var(--font-montserrat)", fontSize: "11px", outline: "none" }}
                  />
                </div>
              </div>

              {/* Attendance rows */}
              <div ref={rowsRef} style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {filteredStudents.map(student => {
                  const rec = todayRecords.find(r => r.studentId === student.id);
                  return (
                    <div key={student.id} className="att-row">
                      <AttendanceRow
                        student={student}
                        record={rec}
                        onStatusChange={handleStatusChange}
                        onAvatarClick={setSelectedStudent}
                      />
                    </div>
                  );
                })}
              </div>

              {/* Save bar */}
              <div style={{ marginTop: "20px", padding: "16px 20px", background: "#0a0a0a", border: "1px solid #1a1a1a", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span style={{ fontFamily: "var(--font-montserrat)", fontSize: "11px", color: "#666" }}>
                  {totalMarked} students marked today
                </span>
                <button
                  onClick={() => {
                    gsap.fromTo(".save-btn", { scale: 0.95 }, { scale: 1, duration: 0.3, ease: "back.out(2)" });
                    alert("Attendance saved successfully!");
                  }}
                  className="save-btn"
                  style={{
                    padding: "10px 28px",
                    background: "linear-gradient(135deg, #c9a84c, #8b6914)",
                    border: "none", borderRadius: "6px",
                    color: "#fff", fontFamily: "var(--font-montserrat)",
                    fontSize: "11px", fontWeight: 700, letterSpacing: "1.5px",
                    textTransform: "uppercase", cursor: "pointer",
                    boxShadow: "0 6px 20px rgba(201,168,76,0.3)",
                  }}
                >
                  Save Attendance
                </button>
              </div>
            </>
          ) : (
            /* ANALYTICS SECTION */
            <>
              <div style={{ display: "flex", gap: "12px", alignItems: "center", marginBottom: "24px" }}>
                <h2 style={{ fontFamily: "var(--font-cinzel)", fontSize: "18px", fontWeight: 700, color: "#e0e0e0", margin: 0, letterSpacing: "1px" }}>
                  Attendance Analytics
                </h2>
                <div style={{ marginLeft: "auto", display: "flex", border: "1px solid #222", borderRadius: "6px", overflow: "hidden" }}>
                  {(["weekly", "monthly"] as TimeFilter[]).map(tf => (
                    <button
                      key={tf}
                      onClick={() => setTimeFilter(tf)}
                      style={{
                        padding: "8px 20px",
                        background: timeFilter === tf ? "#c9a84c" : "transparent",
                        border: "none",
                        color: timeFilter === tf ? "#000" : "#888",
                        fontFamily: "var(--font-montserrat)",
                        fontSize: "10px", fontWeight: 700,
                        letterSpacing: "1px", textTransform: "uppercase",
                        cursor: "pointer", transition: "all 0.2s ease",
                      }}
                    >
                      {tf === "weekly" ? "7 Days" : "30 Days"}
                    </button>
                  ))}
                </div>
              </div>

              {/* Legend */}
              <div style={{ display: "flex", gap: "20px", marginBottom: "24px" }}>
                {[{ c: "#27ae60", l: "Present" }, { c: "#f39c12", l: "Late" }, { c: "#e74c3c", l: "Absent" }].map(l => (
                  <div key={l.l} style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    <div style={{ width: "10px", height: "10px", borderRadius: "3px", background: l.c }} />
                    <span style={{ fontFamily: "var(--font-montserrat)", fontSize: "10px", color: "#777" }}>{l.l}</span>
                  </div>
                ))}
              </div>

              {/* Student bars */}
              <div ref={rowsRef} style={{ background: "#0a0a0a", border: "1px solid #1a1a1a", borderRadius: "10px", padding: "24px" }}>
                {analyticsData.length === 0 ? (
                  <p style={{ fontFamily: "var(--font-cormorant)", fontSize: "16px", color: "#555", fontStyle: "italic", textAlign: "center", padding: "40px 0", margin: 0 }}>
                    No records in this period
                  </p>
                ) : (
                  analyticsData.map(d => (
                    <div key={d.student.id} className="att-row" style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "20px" }}>
                      {/* Avatar — clickable */}
                      <div onClick={() => setSelectedStudent(d.student)} style={{ cursor: "pointer" }}>
                        <StudentAvatar student={d.student} size={44} />
                      </div>
                      <div style={{ flex: 1 }}>
                        <AnalyticsBar
                          label={`${d.student.firstName} ${d.student.lastName}`}
                          present={d.present} late={d.late} absent={d.absent} total={d.total}
                        />
                      </div>
                      <div style={{
                        fontFamily: "var(--font-montserrat)", fontSize: "9px", fontWeight: 700,
                        color: d.present / d.total >= 0.75 ? "#27ae60" : d.present / d.total >= 0.5 ? "#f39c12" : "#e74c3c",
                        minWidth: "40px", textAlign: "right",
                      }}>
                        {d.total > 0 ? Math.round((d.present / d.total) * 100) : 0}%
                      </div>
                    </div>
                  ))
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {/* STUDENT PROFILE MODAL */}
      {selectedStudent && (
        <StudentProfileModal
          student={selectedStudent}
          attendance={attendance}
          onClose={() => setSelectedStudent(null)}
        />
      )}
    </div>
  );
}