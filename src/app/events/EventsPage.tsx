"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import gsap from "gsap";

// ─── TYPES & MOCK DATA ────────────────────────────────────────────────────────

type Participant = {
  id: string;
  name: string;
  role: "Student" | "Teacher";
  state: string;
  belt: string;
  placement?: "1st" | "2nd" | "3rd" | null;
};

type KarateEvent = {
  id: string;
  title: string;
  date: string;
  location: string;
  organizer: string;
  type: "Tournament" | "Championship" | "Seminar";
  prizePool?: string;
  status: "upcoming" | "past";
  participants?: Participant[];
};

const MOCK_EVENTS: KarateEvent[] = [
  {
    id: "e1",
    title: "National Ashihara Championship 2026",
    date: "15 August 2026",
    location: "Patliputra Sports Complex, Patna, Bihar",
    organizer: "Dadi Bulsara HQ India",
    type: "Championship",
    prizePool: "₹1,50,000",
    status: "upcoming",
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
    participants: [
      { id: "p1", name: "Rahul Singh", role: "Student", state: "Bihar", belt: "Black Belt (1st Dan)", placement: "1st" },
      { id: "p2", name: "Amit Sharma", role: "Student", state: "Delhi", belt: "Brown Belt", placement: "2nd" },
      { id: "p3", name: "Vikram Das", role: "Teacher", state: "West Bengal", belt: "Black Belt (3rd Dan)", placement: "3rd" },
      { id: "p4", name: "Neha Gupta", role: "Student", state: "UP", belt: "Green Belt", placement: null },
      { id: "p5", name: "Suresh Patil", role: "Student", state: "Maharashtra", belt: "Blue Belt", placement: null },
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
    participants: [
      { id: "p6", name: "Anjali Roy", role: "Student", state: "West Bengal", belt: "Brown Belt", placement: "1st" },
      { id: "p7", name: "Ravi Teja", role: "Teacher", state: "Odisha", belt: "Black Belt (2nd Dan)", placement: "2nd" },
      { id: "p8", name: "Manish Kumar", role: "Student", state: "Bihar", belt: "Yellow Belt", placement: null },
    ],
  },
];

// ─── COMPONENT ────────────────────────────────────────────────────────────────

export default function EventsPage() {
  const [activeTab, setActiveTab] = useState<"upcoming" | "past">("upcoming");
  const [eventSearch, setEventSearch] = useState("");
  const [expandedEvents, setExpandedEvents] = useState<Record<string, boolean>>({});
  const [participantSearchQueries, setParticipantSearchQueries] = useState<Record<string, string>>({});

  const containerRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLElement>(null);

  // Filter Events based on Tab and Search
  const filteredEvents = useMemo(() => {
    return MOCK_EVENTS.filter((ev) => {
      const matchesTab = ev.status === activeTab;
      const matchesSearch =
        ev.title.toLowerCase().includes(eventSearch.toLowerCase()) ||
        ev.location.toLowerCase().includes(eventSearch.toLowerCase()) ||
        ev.type.toLowerCase().includes(eventSearch.toLowerCase());
      return matchesTab && matchesSearch;
    });
  }, [activeTab, eventSearch]);

  // Page Load Animation
  useEffect(() => {
    if (headerRef.current) {
      gsap.fromTo(
        headerRef.current,
        { y: -30, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, ease: "power3.out" }
      );
    }
  }, []);

  // Events Stagger Animation
  useEffect(() => {
    if (filteredEvents.length > 0) {
      const timer = setTimeout(() => {
        gsap.fromTo(
          ".event-card-animate",
          { y: 40, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.6, stagger: 0.1, ease: "power3.out" }
        );
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [activeTab, eventSearch, filteredEvents.length]);

  const toggleExpand = (eventId: string) => {
    setExpandedEvents((prev) => ({ ...prev, [eventId]: !prev[eventId] }));
  };

  const handleParticipantSearch = (eventId: string, value: string) => {
    setParticipantSearchQueries((prev) => ({ ...prev, [eventId]: value }));
  };

  // ── ENROLLMENT HANDLER ──
  const handleEnroll = (eventId: string, eventTitle: string) => {
    alert(`Redirecting to enrollment form for: ${eventTitle}`);
    // Baad mein yahan Next.js ka router use kar sakte hain:
    // router.push(`/enroll/${eventId}`)
  };

  return (
    <div className="events-page" ref={containerRef}>
      <div className="events-container">
        {/* ── Page Header ── */}
        <header className="page-header" ref={headerRef} style={{ opacity: 0 }}>
          <h1 className="page-title">Events & Tournaments</h1>
          <p className="page-subtitle">
            Track upcoming battles and review the legacy of past championships.
          </p>
        </header>

        {/* ── Top Controls (Tabs & Event Search) ── */}
        <div className="controls-section">
          <div className="tabs">
            <button
              className={`tab-btn ${activeTab === "upcoming" ? "tab-btn--active" : ""}`}
              onClick={() => setActiveTab("upcoming")}
            >
              Upcoming Events
            </button>
            <button
              className={`tab-btn ${activeTab === "past" ? "tab-btn--active" : ""}`}
              onClick={() => setActiveTab("past")}
            >
              Past Events
            </button>
          </div>

          <div className="search-box">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <input
              type="text"
              placeholder="Search events by name, location or type..."
              value={eventSearch}
              onChange={(e) => setEventSearch(e.target.value)}
            />
          </div>
        </div>

        {/* ── Events List ── */}
        <div className="events-list">
          {filteredEvents.length === 0 ? (
            <div className="no-results">No events found matching your criteria.</div>
          ) : (
            filteredEvents.map((ev) => (
              <div key={ev.id} className="event-card event-card-animate" style={{ opacity: 0 }}>
                <div className="event-card__main">
                  <div className="event-card__header">
                    <div>
                      <span className={`event-badge badge--${ev.type.toLowerCase()}`}>
                        {ev.type}
                      </span>
                      <h2 className="event-title">{ev.title}</h2>
                    </div>
                    <div className="event-date">
                      <span className="date-icon">📅</span> {ev.date}
                    </div>
                  </div>

                  <div className="event-card__details">
                    <div className="detail-item">
                      <span className="detail-label">Location</span>
                      <span className="detail-value">{ev.location}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Organizer</span>
                      <span className="detail-value">{ev.organizer}</span>
                    </div>
                    {ev.prizePool && (
                      <div className="detail-item">
                        <span className="detail-label">Prize Pool</span>
                        <span className="detail-value highlight-red">{ev.prizePool}</span>
                      </div>
                    )}
                  </div>

                  {/* ── NEW: Enroll Button for Upcoming Events ── */}
                  {ev.status === "upcoming" && (
                    <button
                      className="enroll-btn"
                      onClick={() => handleEnroll(ev.id, ev.title)}
                    >
                      Enroll Now
                    </button>
                  )}

                  {/* ── Expand Button for Past Events ── */}
                  {ev.status === "past" && ev.participants && (
                    <button
                      className="expand-btn"
                      onClick={() => toggleExpand(ev.id)}
                    >
                      {expandedEvents[ev.id] ? "Hide Results & Participants" : "View Results & Participants"}
                      <svg
                        className={`expand-icon ${expandedEvents[ev.id] ? "expand-icon--up" : ""}`}
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <polyline points="6 9 12 15 18 9"></polyline>
                      </svg>
                    </button>
                  )}
                </div>

                {/* ── Collapsible Participants Section (Past Events Only) ── */}
                {ev.status === "past" && expandedEvents[ev.id] && ev.participants && (
                  <div className="event-card__expanded">
                    <div className="expanded-header">
                      <h3>Participants & Winners</h3>
                      
                      {/* Sub-Search for Participants */}
                      <div className="participant-search">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <circle cx="11" cy="11" r="8"></circle>
                          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                        </svg>
                        <input
                          type="text"
                          placeholder="Search by Name, State, Belt or Role..."
                          value={participantSearchQueries[ev.id] || ""}
                          onChange={(e) => handleParticipantSearch(ev.id, e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="participants-table-wrapper">
                      <table className="participants-table">
                        <thead>
                          <tr>
                            <th>Placement</th>
                            <th>Name</th>
                            <th>Role</th>
                            <th>Belt</th>
                            <th>State</th>
                          </tr>
                        </thead>
                        <tbody>
                          {ev.participants
                            .filter((p) => {
                              const q = (participantSearchQueries[ev.id] || "").toLowerCase();
                              return (
                                p.name.toLowerCase().includes(q) ||
                                p.state.toLowerCase().includes(q) ||
                                p.belt.toLowerCase().includes(q) ||
                                p.role.toLowerCase().includes(q)
                              );
                            })
                            .sort((a, b) => {
                              if (a.placement && !b.placement) return -1;
                              if (!a.placement && b.placement) return 1;
                              if (a.placement && b.placement) return a.placement.localeCompare(b.placement);
                              return 0;
                            })
                            .map((p) => (
                              <tr key={p.id} className={p.placement ? `row--winner row--${p.placement}` : ""}>
                                <td className="td-placement">
                                  {p.placement ? (
                                    <span className="medal-badge">
                                      {p.placement === "1st" ? "🥇 1st" : p.placement === "2nd" ? "🥈 2nd" : "🥉 3rd"}
                                    </span>
                                  ) : (
                                    "-"
                                  )}
                                </td>
                                <td className="td-name">{p.name}</td>
                                <td>{p.role}</td>
                                <td>{p.belt}</td>
                                <td>{p.state}</td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      <style jsx>{`
        /* ═══════════════════════════════════════
           BASE & LAYOUT
        ═══════════════════════════════════════ */
        .events-page {
          min-height: 100vh;
          background: #050505;
          padding: 120px 20px 60px;
          color: #fff;
          font-family: var(--font-inter), "Inter", sans-serif;
        }

        .events-container {
          max-width: 1000px;
          margin: 0 auto;
        }

        /* ── Header ── */
        .page-header {
          text-align: center;
          margin-bottom: 3rem;
        }

        .page-title {
          font-family: var(--font-cinzel), "Cinzel", serif;
          font-size: 2.5rem;
          color: #fff;
          margin: 0 0 0.5rem 0;
          text-transform: uppercase;
          letter-spacing: 0.1em;
        }

        .page-subtitle {
          color: rgba(255, 255, 255, 0.6);
          font-size: 1rem;
          max-width: 500px;
          margin: 0 auto;
        }

        /* ── Controls (Tabs & Main Search) ── */
        .controls-section {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          margin-bottom: 3rem;
          background: rgba(15, 15, 15, 0.5);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.08);
          padding: 1.5rem;
          border-radius: 12px;
        }

        @media (min-width: 768px) {
          .controls-section {
            flex-direction: row;
            justify-content: space-between;
            align-items: center;
          }
        }

        .tabs {
          display: flex;
          gap: 0.5rem;
          background: rgba(0, 0, 0, 0.4);
          padding: 0.35rem;
          border-radius: 8px;
          border: 1px solid rgba(255, 255, 255, 0.05);
        }

        .tab-btn {
          background: transparent;
          border: none;
          color: rgba(255, 255, 255, 0.5);
          padding: 0.6rem 1.25rem;
          font-family: inherit;
          font-weight: 600;
          font-size: 0.85rem;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.3s ease;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .tab-btn:hover {
          color: #fff;
        }

        .tab-btn--active {
          background: #BE0027;
          color: #fff;
          box-shadow: 0 4px 12px rgba(190, 0, 39, 0.3);
        }

        .search-box {
          position: relative;
          flex-grow: 1;
          max-width: 400px;
        }

        .search-box svg, .participant-search svg {
          position: absolute;
          left: 14px;
          top: 50%;
          transform: translateY(-50%);
          width: 18px;
          height: 18px;
          color: rgba(255, 255, 255, 0.4);
        }

        .search-box input, .participant-search input {
          width: 100%;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.1);
          color: #fff;
          padding: 0.8rem 1rem 0.8rem 2.5rem;
          border-radius: 8px;
          font-family: inherit;
          font-size: 0.9rem;
          transition: all 0.3s ease;
          outline: none;
        }

        .search-box input:focus, .participant-search input:focus {
          border-color: rgba(190, 0, 39, 0.5);
          background: rgba(255, 255, 255, 0.06);
          box-shadow: 0 0 0 3px rgba(190, 0, 39, 0.1);
        }

        /* ── Event Cards ── */
        .events-list {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .event-card {
          background: rgba(255, 255, 255, 0.03);
          backdrop-filter: blur(16px);
          border: 1px solid rgba(255, 255, 255, 0.06);
          border-radius: 12px;
          overflow: hidden;
          transition: border-color 0.3s ease;
        }

        .event-card:hover {
          border-color: rgba(255, 255, 255, 0.12);
        }

        .event-card__main {
          padding: 1.5rem 2rem;
        }

        .event-card__header {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.06);
          padding-bottom: 1.25rem;
          margin-bottom: 1.25rem;
        }

        @media (min-width: 640px) {
          .event-card__header {
            flex-direction: row;
            justify-content: space-between;
            align-items: flex-start;
          }
        }

        .event-title {
          font-family: var(--font-cinzel), "Cinzel", serif;
          font-size: 1.4rem;
          margin: 0.5rem 0 0 0;
          color: #fff;
        }

        .event-badge {
          display: inline-block;
          font-size: 0.65rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          padding: 0.25rem 0.6rem;
          border-radius: 4px;
        }

        .badge--championship {
          background: rgba(190, 0, 39, 0.15);
          color: #ff4d6d;
          border: 1px solid rgba(190, 0, 39, 0.3);
        }

        .badge--tournament {
          background: rgba(59, 130, 246, 0.15);
          color: #60a5fa;
          border: 1px solid rgba(59, 130, 246, 0.3);
        }

        .event-date {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.9rem;
          color: rgba(255, 255, 255, 0.7);
          background: rgba(255, 255, 255, 0.05);
          padding: 0.4rem 0.8rem;
          border-radius: 6px;
        }

        .event-card__details {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1rem;
        }

        @media (min-width: 640px) {
          .event-card__details {
            grid-template-columns: repeat(3, 1fr);
          }
        }

        .detail-item {
          display: flex;
          flex-direction: column;
          gap: 0.3rem;
        }

        .detail-label {
          font-size: 0.7rem;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: rgba(255, 255, 255, 0.4);
          font-weight: 600;
        }

        .detail-value {
          font-size: 0.95rem;
          color: rgba(255, 255, 255, 0.9);
        }

        .highlight-red {
          color: #ff4d6d;
          font-weight: 700;
          font-size: 1.1rem;
        }

        /* ── Enroll Button (NEW) ── */
        .enroll-btn {
          width: 100%;
          margin-top: 1.5rem;
          background: #10B981;
          color: #fff;
          border: none;
          padding: 0.8rem;
          border-radius: 8px;
          cursor: pointer;
          font-family: inherit;
          font-size: 0.9rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          transition: all 0.2s ease;
          box-shadow: 0 4px 12px rgba(16, 185, 129, 0.2);
        }

        .enroll-btn:hover {
          background: #059669;
          box-shadow: 0 6px 16px rgba(16, 185, 129, 0.2);
          transform: translateY(0) scale(1.02);
        }

        .enroll-btn:active {
          transform: translateY(0) scale(0.95);
          box-shadow: 0 2px 8px rgba(16, 185, 129, 0.2);
        }

        /* ── Expand Button ── */
        .expand-btn {
          width: 100%;
          margin-top: 1.5rem;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.08);
          color: #fff;
          padding: 0.75rem;
          border-radius: 8px;
          cursor: pointer;
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 0.5rem;
          font-family: inherit;
          font-size: 0.85rem;
          font-weight: 600;
          transition: all 0.3s ease;
        }

        .expand-btn:hover {
          background: rgba(190, 0, 39, 0.1);
          border-color: rgba(190, 0, 39, 0.3);
        }

        .expand-icon {
          width: 16px;
          height: 16px;
          transition: transform 0.3s ease;
        }

        .expand-icon--up {
          transform: rotate(180deg);
        }

        /* ── Expanded Section (Participants) ── */
        .event-card__expanded {
          background: rgba(0, 0, 0, 0.3);
          border-top: 1px solid rgba(255, 255, 255, 0.05);
          padding: 1.5rem 2rem;
          animation: slideDown 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .expanded-header {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          margin-bottom: 1.25rem;
        }

        @media (min-width: 640px) {
          .expanded-header {
            flex-direction: row;
            justify-content: space-between;
            align-items: center;
          }
        }

        .expanded-header h3 {
          margin: 0;
          font-family: var(--font-cinzel), "Cinzel", serif;
          font-size: 1.1rem;
          color: #fff;
        }

        .participant-search {
          position: relative;
          width: 100%;
          max-width: 300px;
        }

        .participant-search input {
          padding: 0.6rem 1rem 0.6rem 2.2rem;
          font-size: 0.8rem;
        }

        .participant-search svg {
          width: 14px;
          height: 14px;
          left: 10px;
        }

        /* ── Table ── */
        .participants-table-wrapper {
          overflow-x: auto;
          border-radius: 8px;
          border: 1px solid rgba(255, 255, 255, 0.05);
        }

        .participants-table {
          width: 100%;
          border-collapse: collapse;
          text-align: left;
          font-size: 0.85rem;
          min-width: 600px;
        }

        .participants-table th {
          background: rgba(255, 255, 255, 0.04);
          color: rgba(255, 255, 255, 0.5);
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          padding: 0.8rem 1rem;
          font-size: 0.75rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
        }

        .participants-table td {
          padding: 0.8rem 1rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.03);
          color: rgba(255, 255, 255, 0.8);
        }

        .participants-table tr:last-child td {
          border-bottom: none;
        }

        .participants-table tr:hover td {
          background: rgba(255, 255, 255, 0.02);
        }

        .td-name {
          font-weight: 600;
          color: #fff !important;
        }

        /* Winners Styling */
        .row--winner {
          background: rgba(255, 215, 0, 0.03);
        }
        
        .row--1st td { color: #ffd700; }
        .row--2nd td { color: #c0c0c0; }
        .row--3rd td { color: #cd7f32; }

        .medal-badge {
          display: inline-block;
          background: rgba(0, 0, 0, 0.5);
          padding: 0.2rem 0.5rem;
          border-radius: 4px;
          font-weight: 700;
          letter-spacing: 0.05em;
          font-size: 0.75rem;
        }

        .no-results {
          text-align: center;
          padding: 3rem;
          color: rgba(255, 255, 255, 0.4);
          background: rgba(255, 255, 255, 0.02);
          border-radius: 12px;
          border: 1px dashed rgba(255, 255, 255, 0.1);
        }

        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}