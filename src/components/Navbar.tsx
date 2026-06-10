"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Teacher", href: "/teacher" },
  { label: "Student", href: "/student" },
  { label: "Events", href: "/events" },
  { label: "Contact", href: "/contact" },
];

const NOTIFICATIONS = [
  {
    id: 1,
    title: "New Batch Starting",
    desc: "Kids program batch starts 15 July",
    time: "2 hours ago",
    unread: true,
  },
  {
    id: 2,
    title: "Tournament Registration",
    desc: "Register before 20 July for the state championship",
    time: "1 day ago",
    unread: true,
  },
  {
    id: 3,
    title: "Dojo Closed",
    desc: "Dojo will remain closed on Sunday 13 July",
    time: "2 days ago",
    unread: false,
  },
];

export default function Navbar() {
  const navRef = useRef<HTMLElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const [scrolled, setScrolled] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeLink, setActiveLink] = useState("/");
  const [notifications, setNotifications] = useState(NOTIFICATIONS);
  const notifRef = useRef<HTMLDivElement>(null);
  const unreadCount = notifications.filter((n) => n.unread).length;

  // Scroll detection — change navbar style on scroll
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Entrance animation
  useEffect(() => {
    const nav = navRef.current;
    if (!nav) return;
    gsap.fromTo(
      nav,
      { y: -80, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, ease: "power3.out", delay: 5.2 }
    );
  }, []);

  // Close notification dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotifOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Close mobile menu on resize
  useEffect(() => {
    const onResize = () => { if (window.innerWidth > 900) setMobileOpen(false); };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const markAllRead = () =>
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));

  return (
    <>
      <nav ref={navRef} className={`navbar ${scrolled ? "navbar--scrolled" : ""}`}>
        <div className="navbar__inner">

          {/* ── Logo ── */}
          <div ref={logoRef} className="navbar__logo">
            <div className="logo-mark" aria-hidden="true">
              <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
                <polygon
                  points="18,2 34,10 34,26 18,34 2,26 2,10"
                  stroke="#c8102e"
                  strokeWidth="1.5"
                  fill="none"
                />
                <text
                  x="18"
                  y="23"
                  textAnchor="middle"
                  fontSize="13"
                  fontFamily="serif"
                  fill="#c8102e"
                >
                  芦
                </text>
              </svg>
            </div>
            <div className="logo-text">
              <span className="logo-name">Dadi Bulsara</span>
              <span className="logo-sub">Ashihara Karate</span>
            </div>
          </div>

          {/* ── Desktop Nav Links ── */}
          <ul className="navbar__links" role="list">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className={`nav-link ${activeLink === link.href ? "nav-link--active" : ""}`}
                  onClick={(e) => {
                    e.preventDefault();
                    setActiveLink(link.href);
                  }}
                  aria-current={activeLink === link.href ? "page" : undefined}
                >
                  {link.label}
                  <span className="nav-link__underline" aria-hidden="true" />
                </a>
              </li>
            ))}
          </ul>

          {/* ── Right Actions ── */}
          <div className="navbar__actions">

            {/* Notification Bell */}
            <div className="notif-wrapper" ref={notifRef}>
              <button
                className="notif-btn"
                onClick={() => setNotifOpen((v) => !v)}
                aria-label={`Notifications — ${unreadCount} unread`}
                aria-expanded={notifOpen}
                aria-haspopup="true"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                  <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                </svg>
                {unreadCount > 0 && (
                  <span className="notif-badge" aria-hidden="true">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Notification Dropdown */}
              {notifOpen && (
                <div className="notif-dropdown" role="dialog" aria-label="Notifications">
                  <div className="notif-header">
                    <span className="notif-title">Notifications</span>
                    {unreadCount > 0 && (
                      <button className="notif-clear" onClick={markAllRead}>
                        Mark all read
                      </button>
                    )}
                  </div>
                  <ul className="notif-list" role="list">
                    {notifications.map((n) => (
                      <li
                        key={n.id}
                        className={`notif-item ${n.unread ? "notif-item--unread" : ""}`}
                      >
                        <div className="notif-dot" aria-hidden="true" />
                        <div className="notif-content">
                          <p className="notif-item-title">{n.title}</p>
                          <p className="notif-item-desc">{n.desc}</p>
                          <p className="notif-item-time">{n.time}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                  <div className="notif-footer">
                    <a href="/notifications" className="notif-all">
                      View all notifications
                    </a>
                  </div>
                </div>
              )}
            </div>

            {/* Register Now CTA */}
            <a href="/register" className="register-btn">
              <span>Register Now</span>
              <svg
                width="12"
                height="12"
                viewBox="0 0 12 12"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M1 11L11 1M11 1H4M11 1V8"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </a>

            {/* Hamburger (mobile) */}
            <button
              className="hamburger"
              onClick={() => setMobileOpen((v) => !v)}
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileOpen}
            >
              <span className={`ham-line ${mobileOpen ? "ham-line--top-open" : ""}`} />
              <span className={`ham-line ${mobileOpen ? "ham-line--mid-open" : ""}`} />
              <span className={`ham-line ${mobileOpen ? "ham-line--bot-open" : ""}`} />
            </button>
          </div>
        </div>

        {/* ── Mobile Menu ── */}
        <div className={`mobile-menu ${mobileOpen ? "mobile-menu--open" : ""}`}>
          <ul role="list">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className={`mobile-link ${activeLink === link.href ? "mobile-link--active" : ""}`}
                  onClick={(e) => {
                    e.preventDefault();
                    setActiveLink(link.href);
                    setMobileOpen(false);
                  }}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
          <a href="/register" className="mobile-register">
            Register Now
          </a>
        </div>
      </nav>

      <style jsx>{`
        /* ═══════════════════════════════════════
           NAVBAR BASE
        ═══════════════════════════════════════ */
        .navbar {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 900;
          padding: 0 2.5rem;
          transition: background 0.4s ease, backdrop-filter 0.4s ease,
            border-color 0.4s ease, padding 0.4s ease;
          border-bottom: 1px solid transparent;
        }

        /* Scrolled state — frosted glass */
        .navbar--scrolled {
          background: rgba(0, 0, 0, 0.82);
          backdrop-filter: blur(20px) saturate(180%);
          -webkit-backdrop-filter: blur(20px) saturate(180%);
          border-bottom-color: rgba(255, 255, 255, 0.06);
          padding: 0 2.5rem;
        }

        .navbar__inner {
          max-width: 1280px;
          margin: 0 auto;
          height: 72px;
          display: flex;
          align-items: center;
          gap: 2rem;
        }

        /* ═══════════════════════════════════════
           LOGO
        ═══════════════════════════════════════ */
        .navbar__logo {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          text-decoration: none;
          flex-shrink: 0;
          cursor: pointer;
        }

        .logo-mark {
          flex-shrink: 0;
          transition: transform 0.3s ease;
        }

        .navbar__logo:hover .logo-mark {
          transform: rotate(15deg);
        }

        .logo-text {
          display: flex;
          flex-direction: column;
          line-height: 1.1;
        }

        .logo-name {
          font-family: var(--font-cinzel), "Cinzel", serif;
          font-size: 0.9rem;
          font-weight: 700;
          letter-spacing: 0.12em;
          color: #fff;
          text-transform: uppercase;
        }

        .logo-sub {
          font-family: var(--font-cormorant), "Cormorant Garamond", serif;
          font-size: 0.65rem;
          letter-spacing: 0.4em;
          color: rgba(200, 16, 46, 0.85);
          text-transform: uppercase;
          font-weight: 300;
        }

        /* ═══════════════════════════════════════
           NAV LINKS
        ═══════════════════════════════════════ */
        .navbar__links {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          list-style: none;
          margin: 0 auto;
          padding: 0;
        }

        .nav-link {
          position: relative;
          display: inline-flex;
          flex-direction: column;
          align-items: center;
          padding: 0.4rem 0.75rem;
          font-family: var(--font-cinzel), "Cinzel", serif;
          font-size: 0.68rem;
          font-weight: 400;
          letter-spacing: 0.22em;
          color: rgba(255, 255, 255, 0.6);
          text-decoration: none;
          text-transform: uppercase;
          transition: color 0.25s ease;
          white-space: nowrap;
        }

        .nav-link:hover {
          color: rgba(255, 255, 255, 0.95);
        }

        .nav-link--active {
          color: #fff;
        }

        /* Animated underline */
        .nav-link__underline {
          position: absolute;
          bottom: 0;
          left: 50%;
          transform: translateX(-50%) scaleX(0);
          width: calc(100% - 1.5rem);
          height: 1px;
          background: #c8102e;
          transition: transform 0.3s ease;
          transform-origin: center;
        }

        .nav-link:hover .nav-link__underline,
        .nav-link--active .nav-link__underline {
          transform: translateX(-50%) scaleX(1);
        }

        /* ═══════════════════════════════════════
           RIGHT ACTIONS
        ═══════════════════════════════════════ */
        .navbar__actions {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          flex-shrink: 0;
        }

        /* ── Notification Bell ── */
        .notif-wrapper {
          position: relative;
        }

        .notif-btn {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 40px;
          height: 40px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 50%;
          color: rgba(255, 255, 255, 0.7);
          cursor: pointer;
          transition: background 0.25s ease, color 0.25s ease,
            border-color 0.25s ease, transform 0.2s ease;
        }

        .notif-btn:hover {
          background: rgba(200, 16, 46, 0.12);
          border-color: rgba(200, 16, 46, 0.4);
          color: #fff;
          transform: scale(1.05);
        }

        .notif-badge {
          position: absolute;
          top: 6px;
          right: 6px;
          width: 16px;
          height: 16px;
          background: #c8102e;
          border-radius: 50%;
          font-family: var(--font-cinzel), "Cinzel", serif;
          font-size: 0.55rem;
          font-weight: 700;
          color: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1.5px solid #000;
          animation: badgePulse 2s ease-in-out infinite;
        }

        /* ── Notification Dropdown ── */
        .notif-dropdown {
          position: absolute;
          top: calc(100% + 12px);
          right: 0;
          width: 320px;
          background: #0d0d0d;
          border: 1px solid rgba(255, 255, 255, 0.08);
          box-shadow: 0 24px 60px rgba(0, 0, 0, 0.7),
            0 0 0 1px rgba(200, 16, 46, 0.08);
          animation: dropdownIn 0.22s ease;
          overflow: hidden;
        }

        .notif-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1rem 1.25rem 0.75rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.06);
        }

        .notif-title {
          font-family: var(--font-cinzel), "Cinzel", serif;
          font-size: 0.7rem;
          letter-spacing: 0.35em;
          color: #fff;
          text-transform: uppercase;
        }

        .notif-clear {
          font-family: var(--font-cormorant), "Cormorant Garamond", serif;
          font-size: 0.8rem;
          letter-spacing: 0.1em;
          color: #c8102e;
          background: none;
          border: none;
          cursor: pointer;
          transition: opacity 0.2s;
        }

        .notif-clear:hover {
          opacity: 0.75;
        }

        .notif-list {
          list-style: none;
          padding: 0;
          margin: 0;
          max-height: 280px;
          overflow-y: auto;
          scrollbar-width: thin;
          scrollbar-color: rgba(200, 16, 46, 0.3) transparent;
        }

        .notif-item {
          display: flex;
          gap: 0.875rem;
          padding: 0.9rem 1.25rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.04);
          transition: background 0.2s ease;
          cursor: default;
        }

        .notif-item:hover {
          background: rgba(255, 255, 255, 0.03);
        }

        .notif-item:last-child {
          border-bottom: none;
        }

        .notif-dot {
          flex-shrink: 0;
          width: 7px;
          height: 7px;
          border-radius: 50%;
          margin-top: 5px;
          background: transparent;
          transition: background 0.2s;
        }

        .notif-item--unread .notif-dot {
          background: #c8102e;
        }

        .notif-content {
          display: flex;
          flex-direction: column;
          gap: 0.2rem;
        }

        .notif-item-title {
          font-family: var(--font-cinzel), "Cinzel", serif;
          font-size: 0.72rem;
          letter-spacing: 0.08em;
          color: rgba(255, 255, 255, 0.9);
          margin: 0;
        }

        .notif-item-desc {
          font-family: var(--font-cormorant), "Cormorant Garamond", serif;
          font-size: 0.9rem;
          color: rgba(255, 255, 255, 0.45);
          margin: 0;
          line-height: 1.5;
        }

        .notif-item-time {
          font-family: var(--font-cormorant), "Cormorant Garamond", serif;
          font-size: 0.72rem;
          color: rgba(200, 16, 46, 0.6);
          margin: 0.1rem 0 0;
          letter-spacing: 0.05em;
        }

        .notif-footer {
          padding: 0.75rem 1.25rem;
          border-top: 1px solid rgba(255, 255, 255, 0.06);
          text-align: center;
        }

        .notif-all {
          font-family: var(--font-cormorant), "Cormorant Garamond", serif;
          font-size: 0.8rem;
          letter-spacing: 0.2em;
          color: rgba(255, 255, 255, 0.35);
          text-decoration: none;
          text-transform: uppercase;
          transition: color 0.2s ease;
        }

        .notif-all:hover {
          color: #c8102e;
        }

        /* ── Register Button ── */
        .register-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          font-family: var(--font-cinzel), "Cinzel", serif;
          font-size: 0.65rem;
          letter-spacing: 0.3em;
          text-transform: uppercase;
          color: #fff;
          background: #c8102e;
          padding: 0.65rem 1.4rem;
          text-decoration: none;
          border: 1px solid #c8102e;
          transition: background 0.3s ease, color 0.3s ease,
            letter-spacing 0.3s ease, transform 0.2s ease;
          white-space: nowrap;
        }

        .register-btn:hover {
          background: transparent;
          color: #c8102e;
          letter-spacing: 0.38em;
        }

        .register-btn:active {
          transform: scale(0.97);
        }

        /* ── Hamburger ── */
        .hamburger {
          display: none;
          flex-direction: column;
          justify-content: center;
          gap: 5px;
          width: 36px;
          height: 36px;
          background: none;
          border: none;
          cursor: pointer;
          padding: 4px;
        }

        .ham-line {
          display: block;
          width: 100%;
          height: 1px;
          background: rgba(255, 255, 255, 0.8);
          transition: transform 0.35s ease, opacity 0.35s ease;
          transform-origin: center;
        }

        .ham-line--top-open {
          transform: translateY(6px) rotate(45deg);
        }

        .ham-line--mid-open {
          opacity: 0;
          transform: scaleX(0);
        }

        .ham-line--bot-open {
          transform: translateY(-6px) rotate(-45deg);
        }

        /* ═══════════════════════════════════════
           MOBILE MENU
        ═══════════════════════════════════════ */
        .mobile-menu {
          display: none;
          flex-direction: column;
          background: rgba(0, 0, 0, 0.96);
          backdrop-filter: blur(20px);
          padding: 0;
          max-height: 0;
          overflow: hidden;
          transition: max-height 0.45s ease, padding 0.3s ease;
          border-top: 1px solid rgba(255, 255, 255, 0.05);
        }

        .mobile-menu--open {
          max-height: 500px;
          padding: 1.5rem 0 2rem;
        }

        .mobile-menu ul {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .mobile-link {
          display: block;
          padding: 0.9rem 2.5rem;
          font-family: var(--font-cinzel), "Cinzel", serif;
          font-size: 0.8rem;
          letter-spacing: 0.3em;
          color: rgba(255, 255, 255, 0.55);
          text-decoration: none;
          text-transform: uppercase;
          border-bottom: 1px solid rgba(255, 255, 255, 0.04);
          transition: color 0.2s ease, padding-left 0.2s ease;
        }

        .mobile-link:hover,
        .mobile-link--active {
          color: #fff;
          padding-left: 3rem;
        }

        .mobile-link--active {
          color: #c8102e;
        }

        .mobile-register {
          display: inline-flex;
          margin: 1.5rem 2.5rem 0;
          font-family: var(--font-cinzel), "Cinzel", serif;
          font-size: 0.7rem;
          letter-spacing: 0.35em;
          text-transform: uppercase;
          color: #fff;
          background: #c8102e;
          padding: 0.9rem 2rem;
          text-decoration: none;
          text-align: center;
          justify-content: center;
          transition: background 0.3s ease;
        }

        .mobile-register:hover {
          background: #e01535;
        }

        /* ═══════════════════════════════════════
           RESPONSIVE
        ═══════════════════════════════════════ */
        @media (max-width: 900px) {
          .navbar__links {
            display: none;
          }

          .register-btn {
            display: none;
          }

          .hamburger {
            display: flex;
          }

          .mobile-menu {
            display: flex;
          }
        }

        @media (max-width: 480px) {
          .navbar {
            padding: 0 1.25rem;
          }

          .logo-sub {
            display: none;
          }

          .notif-dropdown {
            right: -50px;
            width: 290px;
          }
        }

        /* ═══════════════════════════════════════
           ANIMATIONS
        ═══════════════════════════════════════ */
        @keyframes badgePulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(200, 16, 46, 0.6); }
          50% { box-shadow: 0 0 0 4px rgba(200, 16, 46, 0); }
        }

        @keyframes dropdownIn {
          from { opacity: 0; transform: translateY(-8px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </>
  );
}