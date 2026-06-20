"use client";

import Link from "next/link";
import React, { useState, useEffect, useRef, useMemo } from "react";
import gsap from "gsap";

type Participant = {
  id: string;
  name: string;
  role: "Student" | "Teacher";
  state: string;
  belt: string;
  placement?: "1st" | "2nd" | "3rd" | null;
};

type EventType = "Tournament" | "Championship" | "Seminar" ;

type KarateEvent = {
  id: string;
  title: string;
  date: string;
  location: string;
  organizer: string;
  type: EventType;
  prizePool?: string;
  status: "upcoming" | "past";
  slug?: string;
  duration?: string;
  totalParticipants?: number;
  highlight?: string;
  participants?: Participant[];
};

const EVENTS: KarateEvent[] = [
  {
    id: "e1",
    title: "National Ashihara Championship 2026",
    date: "15 August 2026",
    location: "Patliputra Sports Complex, Patna, Bihar",
    organizer: "Dadi Bulsara HQ India",
    type: "Championship",
    prizePool: "₹1,50,000",
    status: "upcoming",
    highlight: "India's largest full-contact Ashihara event of the year",
  },
  {
    id: "e2",
    title: "State Level Kumite Tournament",
    date: "10 September 2026",
    location: "Indoor Stadium, Gaya, Bihar",
    organizer: "Sensei Rajesh Kumar",
    type: "Tournament",
    prizePool: "₹50,000",
    status: "upcoming",
    highlight: "Open to all belt grades across Bihar state",
  },
  {
    id: "e3",
    title: "All India Full Contact Karate Championship 2025",
    date: "20 December 2025",
    location: "Talkatora Stadium, New Delhi",
    organizer: "AIKF & Dadi Bulsara",
    type: "Championship",
    prizePool: "₹2,00,000",
    status: "past",
    highlight: "500+ competitors from 18 states across India",
    participants: [
      { id:"p1", name:"Rahul Singh",  role:"Student", state:"Bihar",       belt:"Black Belt (1st Dan)", placement:"1st" },
      { id:"p2", name:"Amit Sharma",  role:"Student", state:"Delhi",       belt:"Brown Belt",           placement:"2nd" },
      { id:"p3", name:"Vikram Das",   role:"Teacher", state:"West Bengal", belt:"Black Belt (3rd Dan)", placement:"3rd" },
      { id:"p4", name:"Neha Gupta",   role:"Student", state:"UP",          belt:"Green Belt",           placement:null  },
      { id:"p5", name:"Suresh Patil", role:"Student", state:"Maharashtra", belt:"Blue Belt",            placement:null  },
    ],
  },
  {
    id: "e4",
    title: "Eastern Region Winter Tournament",
    date: "05 November 2025",
    location: "Kolkata, West Bengal",
    organizer: "Eastern Ashihara Council",
    type: "Tournament",
    prizePool: "₹30,000",
    status: "past",
    highlight: "Regional qualifier for national championship",
    participants: [
      { id:"p6", name:"Anjali Roy",   role:"Student", state:"West Bengal", belt:"Brown Belt",           placement:"1st" },
      { id:"p7", name:"Ravi Teja",    role:"Teacher", state:"Odisha",      belt:"Black Belt (2nd Dan)", placement:"2nd" },
      { id:"p8", name:"Manish Kumar", role:"Student", state:"Bihar",       belt:"Yellow Belt",          placement:null  },
    ],
  },
];

const TYPE_META: Record<EventType, { color:string; dim:string; border:string; label:string }> = {
  Championship: { color:"#FF4D6D", dim:"rgba(255,77,109,0.1)",  border:"rgba(255,77,109,0.3)",  label:"Championship" },
  Tournament:   { color:"#60A5FA", dim:"rgba(96,165,250,0.1)",  border:"rgba(96,165,250,0.3)",  label:"Tournament"   },
  Seminar:      { color:"#A78BFA", dim:"rgba(167,139,250,0.1)", border:"rgba(167,139,250,0.3)", label:"Seminar"      },
};

const TYPE_ICONS: Record<EventType|"All", React.ReactNode> = {
  All: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{width:16,height:16}}>
      <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
      <rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
    </svg>
  ),
  Championship: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{width:16,height:16}}>
      <path d="M6 9H4.5a2.5 2.5 0 010-5H6"/><path d="M18 9h1.5a2.5 2.5 0 000-5H18"/>
      <path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/>
      <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/>
      <path d="M18 2H6v7a6 6 0 0012 0V2z"/>
    </svg>
  ),
  Tournament: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{width:16,height:16}}>
      <polyline points="14.5 17.5 3 6 3 3 6 3 17.5 14.5"/><line x1="13" y1="19" x2="19" y2="13"/>
      <line x1="16" y1="16" x2="20" y2="20"/><line x1="19" y1="21" x2="21" y2="19"/>
    </svg>
  ),

  Seminar: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{width:16,height:16}}>
      <path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z"/><path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z"/>
    </svg>
  ),
};

export default function EventsPage() {
  const [tab,        setTab]        = useState<"upcoming"|"past">("upcoming");
  const [typeFilter, setTypeFilter] = useState<EventType|"All">("All");
  const [search,     setSearch]     = useState("");
  const [expanded,   setExpanded]   = useState<Record<string,boolean>>({});
  const [pSearch,    setPSearch]    = useState<Record<string,string>>({});
  const headerRef = useRef<HTMLDivElement>(null);

  const filtered = useMemo(() => EVENTS.filter(ev => {
    if (ev.status !== tab) return false;
    if (typeFilter !== "All" && ev.type !== typeFilter) return false;
    const q = search.toLowerCase();
    return !q || ev.title.toLowerCase().includes(q) || ev.location.toLowerCase().includes(q) || ev.type.toLowerCase().includes(q);
  }), [tab, typeFilter, search]);

  useEffect(() => {
    if (!headerRef.current) return;
    gsap.fromTo(headerRef.current, { y:-30, opacity:0 }, { y:0, opacity:1, duration:1, ease:"power4.out" });
  }, []);

  useEffect(() => {
    const t = setTimeout(() => {
      gsap.fromTo(".ev-card", { y:48, opacity:0 }, { y:0, opacity:1, duration:0.65, stagger:0.09, ease:"power3.out" });
    }, 40);
    return () => clearTimeout(t);
  }, [tab, typeFilter, search]);

  const toggle = (id: string) => setExpanded(p => ({ ...p, [id]: !p[id] }));

  const counts = useMemo(() => {
    const base = EVENTS.filter(ev => ev.status === tab);
    const result: Record<string,number> = { All: base.length };
    base.forEach(ev => { result[ev.type] = (result[ev.type]||0)+1; });
    return result;
  }, [tab]);

  return (
    <>
      <style>{CSS}</style>
      <div className="ep-root">
        <div className="ep-bg-glow ep-bg-glow--1"/>
        <div className="ep-bg-glow ep-bg-glow--2"/>
        <div className="ep-bg-grid"/>

        <div className="ep-wrap">

          {/* ══ HEADER ══ */}
          <div className="ep-header" ref={headerRef} style={{opacity:0}}>
            <div className="ep-kicker">
              <span className="ep-kicker-line"/>
              <span className="ep-kicker-txt">Dadi Bulsara Federation</span>
              <span className="ep-kicker-line"/>
            </div>
            <h1 className="ep-h1">Events &amp; Tournaments</h1>
            <p className="ep-sub">Track upcoming battles, camps, and championships — or explore the legacy of past competitions.</p>
          </div>

          {/* ══ FILTER PANEL ══ */}
          <div className="ep-filter-panel">

            {/* Row 1 — Status tabs */}
            <div className="ep-filter-row ep-filter-row--top">
              <div className="ep-filter-label-group">
                <span className="ep-filter-section-label">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{width:12,height:12,marginRight:6}}>
                    <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/>
                    <line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
                  </svg>
                  Status
                </span>
                <div className="ep-status-tabs">
                  <button
                    className={`ep-status-tab ${tab==="upcoming"?"ep-status-tab--on":""}`}
                    onClick={() => { setTab("upcoming"); setTypeFilter("All"); }}
                  >
                    <span className="ep-status-dot ep-status-dot--green"/>
                    Upcoming
                  </button>
                  <button
                    className={`ep-status-tab ${tab==="past"?"ep-status-tab--on":""}`}
                    onClick={() => { setTab("past"); setTypeFilter("All"); }}
                  >
                    <span className="ep-status-dot ep-status-dot--gray"/>
                    Past Events
                  </button>
                </div>
              </div>

              {/* Search */}
              <div className="ep-search-group">
                <span className="ep-filter-section-label">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{width:12,height:12,marginRight:6}}>
                    <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                  </svg>
                  Search
                </span>
                <div className="ep-search-box">
                  <svg className="ep-search-ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                  </svg>
                  <input
                    className="ep-search-inp"
                    placeholder="Search by name, location…"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                  />
                  {search && (
                    <button className="ep-search-clear" onClick={() => setSearch("")}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{width:12,height:12}}>
                        <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                      </svg>
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="ep-filter-divider"/>

            {/* Row 2 — Type filter */}
            <div className="ep-filter-row ep-filter-row--bottom">
              <span className="ep-filter-section-label" style={{marginTop:2}}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{width:12,height:12,marginRight:6}}>
                  <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>
                </svg>
                Filter by Type
              </span>
              <div className="ep-type-filters">
                {(["All","Tournament","Championship","Seminar"] as const).map(tp => {
                  const meta  = tp !== "All" ? TYPE_META[tp as EventType] : null;
                  const active = typeFilter === tp;
                  const cnt   = counts[tp] ?? 0;
                  return (
                    <button
                      key={tp}
                      className={`ep-type-btn ${active?"ep-type-btn--active":""}`}
                      style={active && meta ? {
                        background: meta.dim,
                        color:      meta.color,
                        borderColor:meta.border,
                        boxShadow: `0 0 18px ${meta.dim}`,
                      } : active ? {
                        background:"rgba(192,57,43,0.15)",
                        color:"#EEE8DF",
                        borderColor:"rgba(192,57,43,0.4)",
                      } : {}}
                      onClick={() => setTypeFilter(tp)}
                    >
                      <span className="ep-type-btn-icon" style={active && meta ? {color:meta.color} : {}}>
                        {TYPE_ICONS[tp]}
                      </span>
                      <span className="ep-type-btn-txt">{tp}</span>
                      {cnt > 0 && (
                        <span
                          className="ep-type-btn-count"
                          style={active && meta ? { background:meta.dim, color:meta.color, border:`1px solid ${meta.border}` }
                            : active ? { background:"rgba(192,57,43,0.15)", color:"#EEE8DF" } : {}}
                        >
                          {cnt}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* results count */}
          <div className="ep-results-bar">
            <span className="ep-results-num">{filtered.length}</span>
            <span className="ep-results-lbl">result{filtered.length!==1?"s":""}</span>
            {(search||typeFilter!=="All") && (
              <button className="ep-clear-all" onClick={() => { setSearch(""); setTypeFilter("All"); }}>
                Clear filters
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{width:11,height:11,marginLeft:5}}>
                  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            )}
            <div className="ep-results-line"/>
          </div>

          {/* ══ CARDS ══ */}
          <div className="ep-list">
            {filtered.length === 0 && (
              <div className="ep-empty">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{width:40,height:40,marginBottom:14,opacity:.3}}>
                  <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                </svg>
                <p>No events found. Try adjusting your filters.</p>
              </div>
            )}

            {filtered.map(ev => {
              const meta   = TYPE_META[ev.type];
              const isOpen = expanded[ev.id];
              const allP   = ev.participants ?? [];
              const q      = (pSearch[ev.id]||"").toLowerCase();
              const filtP  = allP
                .filter(p => !q || p.name.toLowerCase().includes(q) || p.state.toLowerCase().includes(q) || p.belt.toLowerCase().includes(q) || p.role.toLowerCase().includes(q))
                .sort((a,b) => {
                  const r:Record<string,number> = {"1st":1,"2nd":2,"3rd":3};
                  return (a.placement?r[a.placement]:99)-(b.placement?r[b.placement]:99);
                });

              return (
                <div key={ev.id} className="ev-card ep-card" style={{opacity:0}}>
                  {/* top accent bar */}
                  <div className="ep-card-bar" style={{background:`linear-gradient(90deg,${meta.color} 0%,${meta.color}44 60%,transparent 100%)`}}/>

                  <div className="ep-card-body">
                    {/* ── TOP ── */}
                    <div className="ep-card-top">
                      <div className="ep-card-tl">
                        <div className="ep-badge-row">
                          <span className="ep-badge" style={{color:meta.color,background:meta.dim,border:`1px solid ${meta.border}`}}>
                            {TYPE_ICONS[ev.type]}
                            {meta.label}
                          </span>
                          {ev.status==="upcoming" && (
                            <span className="ep-upcoming-tag">
                              <span className="ep-pulse"/>
                              Upcoming
                            </span>
                          )}
                        </div>
                        <h2 className="ep-card-title">{ev.title}</h2>
                        {ev.highlight && <p className="ep-card-hl">&ldquo;{ev.highlight}&rdquo;</p>}
                      </div>

                      <div className="ep-date-block">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{width:18,height:18,color:meta.color,marginBottom:8}}>
                          <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/>
                          <line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
                        </svg>
                        <span className="ep-date-txt">{ev.date}</span>
                      </div>
                    </div>

                    {/* ── META ── */}
                    <div className="ep-meta-grid">
                      <MetaCell icon="location" label="Location" val={ev.location}/>
                      <MetaCell icon="person"   label="Organizer" val={ev.organizer}/>
                      {ev.prizePool        && <MetaCell icon="prize"  label="Prize Pool"    val={ev.prizePool}  accent={meta.color}/>}
                      {ev.duration         && <MetaCell icon="clock"  label="Duration"      val={ev.duration}/>}
                      {ev.totalParticipants && <MetaCell icon="group" label="Participants"  val={`${ev.totalParticipants} athletes`}/>}
                      {!ev.totalParticipants && allP.length>0 && <MetaCell icon="group" label="Participants" val={`${allP.length} registered`}/>}
                    </div>

                    {/* ── DIVIDER ── */}
                    <div className="ep-divider" style={{background:`linear-gradient(90deg,${meta.color}33,rgba(255,255,255,0.06),transparent)`}}/>

                    <div className="ep-actions">
                      {ev.status === "upcoming" && (
                        <Link href="/signup" className="ep-btn ep-btn--enroll">
                          Enroll Now
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{width:14,height:14}}>
                            <path d="M5 12h14M12 5l7 7-7 7"/>
                          </svg>
                        </Link>
                      )}

                      {/* past: expand participants */}
                      {ev.status==="past" && allP.length>0 && (
                        <button className="ep-btn ep-btn--expand" onClick={e=>{e.stopPropagation();toggle(ev.id);}}>
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                            style={{width:14,height:14,transform:isOpen?"rotate(180deg)":"rotate(0deg)",transition:"transform .35s"}}>
                            <polyline points="6 9 12 15 18 9"/>
                          </svg>
                          {isOpen ? "Hide " : "View "} Results &amp; Participants
                        </button>
                      )}
                    </div>

                    {/* ── EXPANDED ── */}
                    {isOpen && allP.length>0 && (
                      <div className="ep-expanded" onClick={e=>e.stopPropagation()}>
                        <div className="ep-exp-head">
                          <div className="ep-psearch">
                            <svg style={{position:"absolute",left:12,top:"50%",transform:"translateY(-50%)",width:13,height:13,color:"rgba(238,232,223,0.3)"}} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                            </svg>
                            <input className="ep-psearch-inp" placeholder="Search participants…"
                              value={pSearch[ev.id]||""}
                              onChange={e=>setPSearch(p=>({...p,[ev.id]:e.target.value}))}/>
                          </div>
                        </div>

                        {/* Podium */}
                        {filtP.some(p=>p.placement) && (
                          <div className="ep-podium">
                            {filtP.filter(p=>p.placement).map(p=>(
                              <div key={p.id} className="ep-podium-card" style={{
                                borderColor: p.placement==="1st"?"#FFD700":p.placement==="2nd"?"#C0C0C0":"#CD7F32",
                                background:  p.placement==="1st"?"rgba(255,215,0,0.05)":p.placement==="2nd"?"rgba(192,192,192,0.05)":"rgba(205,127,50,0.05)",
                              }}>
                                <div className="ep-podium-medal">{p.placement==="1st"?"🥇":p.placement==="2nd"?"🥈":"🥉"}</div>
                                <div className="ep-podium-place" style={{color:p.placement==="1st"?"#FFD700":p.placement==="2nd"?"#C0C0C0":"#CD7F32"}}>{p.placement}</div>
                                <div className="ep-podium-name">{p.name}</div>
                                <div className="ep-podium-belt">{p.belt}</div>
                                <div className="ep-podium-state">{p.state}</div>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Table */}
                        <div className="ep-tbl-wrap">
                          <table className="ep-tbl">
                            <thead>
                              <tr>
                                {["#","Name","Role","Belt","State","Result"].map(h=>(
                                  <th key={h} className="ep-th">{h}</th>
                                ))}
                              </tr>
                            </thead>
                            <tbody>
                              {filtP.map((p,i)=>(
                                <tr key={p.id} className={`ep-tr ${p.placement?"ep-tr--winner":""}`}>
                                  <td className="ep-td ep-td--num">{i+1}</td>
                                  <td className="ep-td ep-td--name">{p.name}</td>
                                  <td className="ep-td">
                                    <span className={`ep-role ${p.role==="Teacher"?"ep-role--t":"ep-role--s"}`}>{p.role}</span>
                                  </td>
                                  <td className="ep-td">{p.belt}</td>
                                  <td className="ep-td">{p.state}</td>
                                  <td className="ep-td">
                                    {p.placement
                                      ? <span className="ep-medal" style={{color:p.placement==="1st"?"#FFD700":p.placement==="2nd"?"#C0C0C0":"#CD7F32"}}>
                                          {p.placement==="1st"?"🥇 1st":p.placement==="2nd"?"🥈 2nd":"🥉 3rd"}
                                        </span>
                                      : <span className="ep-dash">—</span>
                                    }
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}

function MetaCell({ icon, label, val, accent }: { icon:string; label:string; val:string; accent?:string }) {
  const ICON_SVG: Record<string,React.ReactNode> = {
    location: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{width:15,height:15}}><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>,
    person:   <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{width:15,height:15}}><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
    prize:    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{width:15,height:15}}><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg>,
    clock:    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{width:15,height:15}}><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
    group:    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{width:15,height:15}}><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></svg>,
  };
  return (
    <div className="ep-meta-cell">
      <span className="ep-meta-ico" style={accent?{color:accent}:{}}>{ICON_SVG[icon]}</span>
      <div>
        <div className="ep-meta-lbl">{label}</div>
        <div className="ep-meta-val" style={accent?{color:accent,fontWeight:700,fontSize:"1.05rem"}:{}}>{val}</div>
      </div>
    </div>
  );
}

const CSS = `
.ep-root {
  min-height:100vh;
  background:#060606;
  padding:120px 24px 100px;
  color:#EEE8DF;
  font-family:var(--font-inter,'Inter',sans-serif);
  position:relative;
  overflow-x:hidden;
}
.ep-bg-glow { position:fixed; pointer-events:none; border-radius:50%; z-index:0; }
.ep-bg-glow--1 { top:-10%; left:50%; transform:translateX(-50%); width:80vw; height:50vh; background:radial-gradient(ellipse,rgba(192,57,43,.08) 0%,transparent 70%); }
.ep-bg-glow--2 { bottom:5%; right:-5%; width:50vw; height:50vh; background:radial-gradient(ellipse,rgba(192,57,43,.05) 0%,transparent 70%); }
.ep-bg-grid { position:fixed; inset:0; pointer-events:none; z-index:0; background-image:linear-gradient(rgba(255,255,255,.016) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.016) 1px,transparent 1px); background-size:72px 72px; }
.ep-wrap { max-width:1200px; margin:0 auto; position:relative; z-index:1; }

/* header */
.ep-header { text-align:center; margin-bottom:56px; }
.ep-kicker { display:flex; align-items:center; justify-content:center; gap:16px; margin-bottom:20px; }
.ep-kicker-line { width:36px; height:1px; background:#C0392B; }
.ep-kicker-txt { font-size:9px; letter-spacing:.32em; text-transform:uppercase; color:#C0392B; font-weight:500; }
.ep-h1 { font-family:var(--font-bebas,'Bebas Neue',sans-serif); font-size:clamp(56px,9vw,110px); line-height:.9; letter-spacing:.04em; color:#EEE8DF; margin:0 0 18px; }
.ep-sub { color:rgba(238,232,223,.45); font-size:.92rem; max-width:520px; margin:0 auto; line-height:1.75; font-weight:300; }

/* ══ FILTER PANEL ══ */
.ep-filter-panel {
  background:rgba(8,8,8,.92);
  backdrop-filter:blur(24px);
  border:1px solid rgba(255,255,255,.08);
  margin-bottom:24px;
  overflow:hidden;
}
.ep-filter-row {
  display:flex;
  align-items:center;
  gap:24px;
  padding:20px 28px;
  flex-wrap:wrap;
}
.ep-filter-row--top { gap:32px; }
.ep-filter-row--bottom { gap:20px; }
.ep-filter-divider { height:1px; background:rgba(255,255,255,.06); margin:0; }

.ep-filter-section-label {
  display:flex;
  align-items:center;
  font-size:9px;
  letter-spacing:.24em;
  text-transform:uppercase;
  color:rgba(238,232,223,.3);
  font-weight:600;
  white-space:nowrap;
  flex-shrink:0;
  min-width:90px;
}

/* status tabs */
.ep-filter-label-group { display:flex; align-items:center; gap:16px; flex-wrap:wrap; }
.ep-status-tabs { display:flex; gap:0; background:rgba(0,0,0,.5); border:1px solid rgba(255,255,255,.07); padding:3px; }
.ep-status-tab {
  background:transparent; border:none; color:rgba(238,232,223,.4);
  padding:.5rem 1.3rem; font-family:inherit; font-weight:600; font-size:.72rem;
  cursor:pointer; transition:all .3s; text-transform:uppercase; letter-spacing:.1em;
  display:flex; align-items:center; gap:8px;
}
.ep-status-tab--on { background:#C0392B; color:#fff; box-shadow:0 4px 16px rgba(192,57,43,.4); }
.ep-status-dot { width:7px; height:7px; border-radius:50%; flex-shrink:0; }
.ep-status-dot--green { background:#34D399; box-shadow:0 0 6px rgba(52,211,153,.5); }
.ep-status-dot--gray  { background:rgba(238,232,223,.3); }

/* search */
.ep-search-group { display:flex; align-items:center; gap:16px; flex:1; min-width:200px; }
.ep-search-box { position:relative; flex:1; }
.ep-search-ico { position:absolute; left:13px; top:50%; transform:translateY(-50%); width:14px; height:14px; color:rgba(238,232,223,.3); pointer-events:none; }
.ep-search-inp {
  width:100%; background:rgba(255,255,255,.03); border:1px solid rgba(255,255,255,.08);
  color:#EEE8DF; padding:.62rem 2.5rem .62rem 2.3rem; font-family:inherit; font-size:.82rem; outline:none;
  transition:border-color .3s; letter-spacing:.01em;
}
.ep-search-inp:focus { border-color:rgba(192,57,43,.4); background:rgba(255,255,255,.04); }
.ep-search-inp::placeholder { color:rgba(238,232,223,.2); }
.ep-search-clear {
  position:absolute; right:12px; top:50%; transform:translateY(-50%);
  background:rgba(255,255,255,.07); border:1px solid rgba(255,255,255,.1);
  color:rgba(238,232,223,.5); width:20px; height:20px; display:flex; align-items:center;
  justify-content:center; cursor:pointer; transition:all .2s; border-radius:2px;
}
.ep-search-clear:hover { background:rgba(192,57,43,.2); color:#fff; }

/* type filter buttons */
.ep-type-filters { display:flex; gap:8px; flex-wrap:wrap; }
.ep-type-btn {
  display:inline-flex; align-items:center; gap:8px;
  background:rgba(255,255,255,.03); border:1px solid rgba(255,255,255,.09);
  color:rgba(238,232,223,.45); padding:.45rem 1rem;
  font-family:inherit; font-size:.72rem; font-weight:600;
  letter-spacing:.1em; text-transform:uppercase;
  cursor:pointer; transition:all .3s; white-space:nowrap;
}
.ep-type-btn:hover { background:rgba(255,255,255,.07); color:rgba(238,232,223,.75); border-color:rgba(255,255,255,.15); }
.ep-type-btn--active { }
.ep-type-btn-icon { display:flex; align-items:center; opacity:.8; }
.ep-type-btn-txt { }
.ep-type-btn-count {
  min-width:20px; height:20px; border-radius:2px; display:inline-flex;
  align-items:center; justify-content:center; font-size:.6rem; font-weight:700;
  padding:0 5px; background:rgba(255,255,255,.06); color:rgba(238,232,223,.4);
  border:1px solid rgba(255,255,255,.08);
}

/* results bar */
.ep-results-bar { display:flex; align-items:center; gap:10px; margin-bottom:20px; }
.ep-results-num { font-family:var(--font-bebas,'Bebas Neue',sans-serif); font-size:26px; color:#C0392B; line-height:1; }
.ep-results-lbl { font-size:.65rem; letter-spacing:.2em; text-transform:uppercase; color:rgba(238,232,223,.3); }
.ep-clear-all {
  display:inline-flex; align-items:center; background:rgba(192,57,43,.1); border:1px solid rgba(192,57,43,.2);
  color:rgba(192,57,43,.8); font-size:.65rem; font-weight:600; letter-spacing:.12em;
  text-transform:uppercase; padding:.28rem .8rem; cursor:pointer; font-family:inherit; transition:all .25s;
}
.ep-clear-all:hover { background:rgba(192,57,43,.18); color:#C0392B; }
.ep-results-line { flex:1; height:1px; background:rgba(255,255,255,.06); }

/* ── LIST ── */
.ep-list { display:flex; flex-direction:column; gap:16px; }
.ep-empty { text-align:center; padding:5rem 2rem; color:rgba(238,232,223,.3); border:1px dashed rgba(255,255,255,.07); display:flex; flex-direction:column; align-items:center; font-size:.88rem; }

/* ── CARD ── */
.ep-card {
  background:rgba(255,255,255,.022);
  border:1px solid rgba(255,255,255,.07);
  overflow:hidden;
  transition:border-color .4s, box-shadow .4s, transform .3s;
}
.ep-card:hover {
  border-color:rgba(255,255,255,.13);
  box-shadow:0 16px 56px rgba(0,0,0,.45), 0 0 0 1px rgba(255,255,255,.04);
  transform:translateY(-3px);
}
.ep-card-bar { height:2px; }
.ep-card-body { padding:32px 40px; }

/* card top */
.ep-card-top { display:flex; justify-content:space-between; align-items:flex-start; gap:20px; flex-wrap:wrap; margin-bottom:24px; }
.ep-card-tl { flex:1; }
.ep-badge-row { display:flex; align-items:center; gap:10px; margin-bottom:10px; flex-wrap:wrap; }
.ep-badge { font-size:.6rem; font-weight:700; text-transform:uppercase; letter-spacing:.14em; padding:4px 11px; display:inline-flex; align-items:center; gap:6px; }
.ep-upcoming-tag { display:inline-flex; align-items:center; gap:7px; font-size:.6rem; letter-spacing:.16em; text-transform:uppercase; color:rgba(238,232,223,.35); }
.ep-pulse { width:6px; height:6px; border-radius:50%; background:#34D399; flex-shrink:0; box-shadow:0 0 0 0 rgba(52,211,153,.4); animation:pls 2s infinite; }
@keyframes pls { 0%{box-shadow:0 0 0 0 rgba(52,211,153,.4)} 70%{box-shadow:0 0 0 8px rgba(52,211,153,0)} 100%{box-shadow:0 0 0 0 rgba(52,211,153,0)} }

.ep-card-title { font-family:var(--font-cormorant,'Cormorant Garamond',serif); font-size:clamp(1.3rem,2.8vw,1.9rem); font-weight:600; color:#EEE8DF; margin:0 0 7px; line-height:1.15; }
.ep-card-hl { font-family:var(--font-cormorant,'Cormorant Garamond',serif); font-style:italic; font-size:.9rem; color:rgba(238,232,223,.38); margin:0; }

.ep-date-block { display:flex; flex-direction:column; align-items:center; justify-content:center; gap:2px; padding:16px 22px; border:1px solid rgba(255,255,255,.07); background:rgba(255,255,255,.025); min-width:130px; text-align:center; flex-shrink:0; }
.ep-date-txt { font-size:.76rem; letter-spacing:.06em; color:rgba(238,232,223,.65); line-height:1.5; }

/* meta */
.ep-meta-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(190px,1fr)); gap:18px 32px; margin-bottom:24px; }
.ep-meta-cell { display:flex; align-items:flex-start; gap:11px; }
.ep-meta-ico { color:rgba(238,232,223,.3); margin-top:1px; flex-shrink:0; }
.ep-meta-lbl { font-size:.58rem; letter-spacing:.2em; text-transform:uppercase; color:rgba(238,232,223,.3); font-weight:600; margin-bottom:3px; }
.ep-meta-val { font-size:.88rem; color:rgba(238,232,223,.82); line-height:1.4; }

.ep-divider { height:1px; margin-bottom:20px; }

/* actions */
.ep-actions { display:flex; gap:10px; flex-wrap:wrap; }
.ep-btn { display:inline-flex; align-items:center; gap:8px; padding:.62rem 1.5rem; font-family:inherit; font-size:.7rem; font-weight:700; text-transform:uppercase; letter-spacing:.14em; cursor:pointer; border:none; text-decoration:none; transition:all .25s; }
.ep-btn--enroll { background:#059669; color:#fff; }
.ep-btn--enroll:hover { background:#047857; transform:translateY(-2px); box-shadow:0 6px 20px rgba(5,150,105,.35); }
.ep-btn--expand { background:rgba(255,255,255,.04); color:rgba(238,232,223,.6); border:1px solid rgba(255,255,255,.08); }
.ep-btn--expand:hover { background:rgba(255,255,255,.08); color:#EEE8DF; }

/* expanded */
.ep-expanded { margin-top:24px; border-top:1px solid rgba(255,255,255,.07); padding-top:24px; animation:epIn .4s cubic-bezier(.16,1,.3,1); }
@keyframes epIn { from{opacity:0;transform:translateY(-10px)} to{opacity:1;transform:translateY(0)} }
.ep-exp-head { display:flex; justify-content:space-between; align-items:flex-end; gap:16px; flex-wrap:wrap; margin-bottom:20px; }
.ep-exp-kicker { display:flex; align-items:center; font-size:8px; letter-spacing:.28em; text-transform:uppercase; font-weight:600; margin-bottom:7px; }
.ep-exp-title { font-family:var(--font-cormorant,'Cormorant Garamond',serif); font-size:1.25rem; font-weight:600; color:#EEE8DF; margin:0; }
.ep-psearch { position:relative; width:260px; }
.ep-psearch-inp { width:100%; background:rgba(255,255,255,.03); border:1px solid rgba(255,255,255,.08); color:#EEE8DF; padding:.52rem 1rem .52rem 2.1rem; font-family:inherit; font-size:.74rem; outline:none; }
.ep-psearch-inp::placeholder { color:rgba(238,232,223,.2); }
.ep-psearch-inp:focus { border-color:rgba(192,57,43,.35); }

/* podium */
.ep-podium { display:flex; gap:12px; flex-wrap:wrap; margin-bottom:20px; }
.ep-podium-card { flex:1; min-width:140px; padding:18px 16px; border:1px solid; text-align:center; }
.ep-podium-medal { font-size:26px; margin-bottom:6px; }
.ep-podium-place { font-size:.65rem; letter-spacing:.15em; text-transform:uppercase; font-weight:700; margin-bottom:6px; }
.ep-podium-name { font-family:var(--font-cormorant,'Cormorant Garamond',serif); font-size:.95rem; font-weight:600; color:#EEE8DF; margin-bottom:4px; }
.ep-podium-belt { font-size:.65rem; color:rgba(238,232,223,.4); margin-bottom:3px; }
.ep-podium-state { font-size:.6rem; letter-spacing:.1em; text-transform:uppercase; color:rgba(238,232,223,.28); }

/* table */
.ep-tbl-wrap { overflow-x:auto; border:1px solid rgba(255,255,255,.07); }
.ep-tbl { width:100%; border-collapse:collapse; min-width:560px; font-size:.78rem; }
.ep-th { background:rgba(255,255,255,.025); color:rgba(238,232,223,.35); font-weight:600; text-transform:uppercase; letter-spacing:.1em; padding:.7rem 1rem; font-size:.6rem; border-bottom:1px solid rgba(255,255,255,.07); text-align:left; }
.ep-td { padding:.75rem 1rem; border-bottom:1px solid rgba(255,255,255,.04); color:rgba(238,232,223,.7); vertical-align:middle; }
.ep-tr:last-child .ep-td { border-bottom:none; }
.ep-tr:hover .ep-td { background:rgba(255,255,255,.02); }
.ep-tr--winner .ep-td { background:rgba(255,215,0,.02); }
.ep-td--num  { color:rgba(238,232,223,.22); font-size:.68rem; width:38px; }
.ep-td--name { color:#EEE8DF !important; font-weight:600; font-family:var(--font-cormorant,'Cormorant Garamond',serif); font-size:.92rem; }
.ep-role { font-size:.58rem; font-weight:700; letter-spacing:.1em; text-transform:uppercase; padding:2px 8px; }
.ep-role--t { color:#A78BFA; background:rgba(167,139,250,.1); border:1px solid rgba(167,139,250,.25); }
.ep-role--s { color:#60A5FA; background:rgba(96,165,250,.1);  border:1px solid rgba(96,165,250,.25); }
.ep-medal { font-weight:700; font-size:.72rem; }
.ep-dash  { color:rgba(238,232,223,.18); }

@media(max-width:768px) {
  .ep-filter-row { padding:16px 18px; }
  .ep-filter-section-label { min-width:70px; }
  .ep-card-body { padding:22px 18px; }
  .ep-meta-grid { grid-template-columns:1fr 1fr; gap:14px; }
  .ep-date-block { display:none; }
  .ep-psearch { width:100%; }
  .ep-exp-head { flex-direction:column; align-items:flex-start; }
  .ep-type-filters { gap:6px; }
  .ep-type-btn { padding:.38rem .75rem; font-size:.65rem; }
}
`;
