"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link"; // Next.js Link import kiya
import { usePathname } from "next/navigation"; // Active route detect karne ke liye hook
import gsap from "gsap";

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
  const pathname = usePathname(); // Yeh check karega current URL kya hai

  const [scrolled, setScrolled] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
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
              <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                <defs>
                  <clipPath id="logoCircle">
                    <circle cx="20" cy="20" r="20" />
                  </clipPath>
                </defs>
                <image
                  href="/img/logo.png"
                  width="40"
                  height="40"
                  clipPath="url(#logoCircle)"
                  preserveAspectRatio="xMidYMid slice"
                />
              </svg>
              {/* Optional red border */}
            </div>
            <div className="logo-text">
              <span className="logo-name">Dadi Bulsara</span>
              <span className="logo-sub">Ashihara Karate</span>
            </div>
          </div>

          {/* ── Desktop Nav Links ── */}
          <ul className="navbar__links" role="list">
            {NAV_LINKS.map((link) => {
              const isActive = pathname === link.href;
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={`nav-link ${isActive ? "nav-link--active" : ""}`}
                    aria-current={isActive ? "page" : undefined}
                  >
                    {link.label}
                    <span className="nav-link__underline" aria-hidden="true" />
                  </Link>
                </li>
              );
            })}
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
                    <Link href="/notifications" className="notif-all">
                      View all notifications
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Register Now CTA */}
            <Link href="/signup" className="register-btn">
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
            </Link>

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
            {NAV_LINKS.map((link) => {
              const isActive = pathname === link.href;
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={`mobile-link ${isActive ? "mobile-link--active" : ""}`}
                    onClick={() => setMobileOpen(false)} // Mobile menu close handler bina preventDefault ke
                  >
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>
          <Link href="/sigup" className="mobile-register" onClick={() => setMobileOpen(false)}>
            Register Now
          </Link>
        </div>
      </nav>

      <style jsx>{`
        /* ═══════════════════════════════════════
           NAVBAR BASE (Floating Glassmorphism)
        ═══════════════════════════════════════ */
        .navbar {
          position: fixed;
          top: 16px;
          left: 0;
          right: 0;
          margin: 0 auto;
          width: calc(100% - 2rem);
          max-width: 1240px;
          z-index: 1200;
          background: rgba(15, 15, 15, 0.65);
          backdrop-filter: blur(16px) saturate(120%);
          -webkit-backdrop-filter: blur(16px) saturate(120%);
          border: 1px solid rgba(255, 255, 255, 0.07);
          border-radius: 12px;
          padding: 0 1.5rem;
          transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
        }

        .navbar--scrolled {
          top: 8px;
          width: calc(100% - 1rem);
          background: rgba(8, 8, 8, 0.88);
          backdrop-filter: blur(24px) saturate(150%);
          -webkit-backdrop-filter: blur(24px) saturate(150%);
          border-color: rgba(255, 255, 255, 0.12);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.55), 0 0 0 1px rgba(255, 255, 255, 0.02);
        }

        .navbar__inner {
          max-width: 1200px;
          margin: 0 auto;
          height: 64px;
          display: flex;
          align-items: center;
          gap: 2rem;
          transition: height 0.4s ease;
        }

        .navbar--scrolled .navbar__inner {
          height: 58px;
        }

        /* ── LOGO ── */
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
          transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .navbar__logo:hover .logo-mark {
          transform: scale(1.10);
        }

        .logo-text {
          display: flex;
          flex-direction: column;
          line-height: 1.15;
        }

        .logo-name {
          font-family: var(--font-cinzel), "Cinzel", serif;
          font-size: 0.95rem;
          font-weight: 700;
          letter-spacing: 0.14em;
          color: #fff;
          text-transform: uppercase;
        }

        .logo-sub {
          font-family: var(--font-cormorant), "Cormorant Garamond", serif;
          font-size: 0.68rem;
          letter-spacing: 0.38em;
          color: #BE0027;
          text-transform: uppercase;
          font-weight: 400;
        }

        /* ── NAV LINKS (:global wrapper add kiya Next.js Links ke liye) ── */
        .navbar__links {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          list-style: none;
          margin: 0 auto;
          padding: 0;
        }

        .navbar__links :global(.nav-link) {
          position: relative;
          display: inline-flex;
          flex-direction: column;
          align-items: center;
          padding: 0.5rem 0.85rem;
          font-family: var(--font-inter), "Inter", sans-serif;
          font-size: 0.72rem;
          font-weight: 600;
          letter-spacing: 0.15em;
          color: rgba(255, 255, 255, 0.55);
          text-decoration: none;
          text-transform: uppercase;
          transition: color 0.25s ease;
          white-space: nowrap;
        }

        .navbar__links :global(.nav-link:hover) {
          color: #fff;
        }

        .navbar__links :global(.nav-link--active) {
          color: #BE0027;
        }

        .navbar__links :global(.nav-link__underline) {
          position: absolute;
          bottom: 0px;
          left: 50%;
          transform: translateX(-50%) scaleX(0);
          width: 16px;
          height: 2px;
          background: #BE0027;
          transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          transform-origin: center;
          border-radius: 1px;
        }

        .navbar__links :global(.nav-link:hover .nav-link__underline),
        .navbar__links :global(.nav-link--active .nav-link__underline) {
          transform: translateX(-50%) scaleX(1);
        }

        /* ── RIGHT ACTIONS ── */
        .navbar__actions {
          display: flex;
          align-items: center;
          gap: 0.85rem;
          flex-shrink: 0;
        }

        .notif-wrapper {
          position: relative;
        }

        .notif-btn {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 36px;
          height: 36px;
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 50%;
          color: rgba(255, 255, 255, 0.65);
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .notif-btn:hover {
          background: rgba(190, 0, 39, 0.1);
          border-color: rgba(190, 0, 39, 0.3);
          color: #fff;
          transform: scale(1.05);
        }

        .notif-badge {
          position: absolute;
          top: -2px;
          right: -2px;
          min-width: 15px;
          height: 15px;
          padding: 0 4px;
          background: #BE0027;
          border-radius: 999px;
          font-family: var(--font-inter), "Inter", sans-serif;
          font-size: 0.58rem;
          font-weight: 700;
          color: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1.5px solid #0f0f0f;
          animation: badgePulse 2s ease-in-out infinite;
        }

        .notif-dropdown {
          position: absolute;
          top: calc(100% + 14px);
          right: 0;
          width: 320px;
          background: rgba(15, 15, 15, 0.95);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 8px;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5);
          animation: dropdownIn 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          overflow: hidden;
        }

        .navbar__actions :global(.notif-dropdown a) {
          color: inherit;
          text-decoration: none;
        }

        .notif-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1rem 1.25rem 0.75rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.06);
        }

        .notif-title {
          font-family: var(--font-inter), "Inter", sans-serif;
          font-size: 0.68rem;
          font-weight: 700;
          letter-spacing: 0.1em;
          color: #fff;
          text-transform: uppercase;
        }

        .notif-clear {
          font-family: var(--font-inter), "Inter", sans-serif;
          font-size: 0.68rem;
          font-weight: 600;
          color: #BE0027;
          background: none;
          border: none;
          cursor: pointer;
          transition: opacity 0.2s;
        }

        .notif-clear:hover {
          opacity: 0.8;
        }

        .notif-list {
          list-style: none;
          padding: 0;
          margin: 0;
          max-height: 280px;
          overflow-y: auto;
          scrollbar-width: thin;
          scrollbar-color: rgba(190, 0, 39, 0.3) transparent;
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
          background: rgba(255, 255, 255, 0.02);
        }

        .notif-item:last-child {
          border-bottom: none;
        }

        .notif-dot {
          flex-shrink: 0;
          width: 6px;
          height: 6px;
          border-radius: 50%;
          margin-top: 5px;
          background: transparent;
        }

        .notif-item--unread .notif-dot {
          background: #BE0027;
          box-shadow: 0 0 8px #BE0027;
        }

        .notif-content {
          display: flex;
          flex-direction: column;
          gap: 0.2rem;
        }

        .notif-item-title {
          font-family: var(--font-inter), "Inter", sans-serif;
          font-size: 0.72rem;
          font-weight: 700;
          color: rgba(255, 255, 255, 0.95);
          margin: 0;
        }

        .notif-item-desc {
          font-family: var(--font-inter), "Inter", sans-serif;
          font-size: 0.72rem;
          color: rgba(255, 255, 255, 0.55);
          margin: 0;
          line-height: 1.4;
        }

        .notif-item-time {
          font-family: var(--font-inter), "Inter", sans-serif;
          font-size: 0.65rem;
          color: rgba(190, 0, 39, 0.7);
          margin: 0.15rem 0 0;
          letter-spacing: 0.02em;
        }

        .notif-footer {
          padding: 0.75rem 1.25rem;
          border-top: 1px solid rgba(255, 255, 255, 0.06);
          text-align: center;
        }

        .navbar__actions :global(.notif-all) {
          font-family: var(--font-inter), "Inter", sans-serif;
          font-size: 0.68rem;
          font-weight: 600;
          color: rgba(255, 255, 255, 0.4);
          text-decoration: none;
          text-transform: uppercase;
          transition: color 0.2s ease;
        }

        .navbar__actions :global(.notif-all:hover) {
          color: #BE0027;
        }

        /* ── REGISTER BUTTON ── */
        .navbar__actions :global(.register-btn) {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          font-family: var(--font-inter), "Inter", sans-serif;
          font-size: 0.7rem;
          font-weight: 700;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: #fff;
          background: linear-gradient(135deg, #BE0027, #91001b);
          padding: 0.62rem 1.35rem;
          text-decoration: none;
          border: none;
          border-radius: 4px;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          white-space: nowrap;
          box-shadow: 0 4px 12px rgba(190, 0, 39, 0.2);
        }

        .navbar__actions :global(.register-btn:hover) {
          background: linear-gradient(135deg, #e01235, #BE0027);
          box-shadow: 0 6px 20px rgba(190, 0, 39, 0.35);
          transform: translateY(-1px);
        }

        .navbar__actions :global(.register-btn:active) {
          transform: scale(0.97) translateY(0);
        }

        .navbar__actions :global(.register-btn svg) {
          transition: transform 0.25s ease;
        }

        .navbar__actions :global(.register-btn:hover svg) {
          transform: translate(2px, -2px);
        }

        /* ── HAMBURGER ── */
        .hamburger {
          display: none;
          flex-direction: column;
          justify-content: center;
          gap: 5px;
          width: 36px;
          height: 36px;
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 50%;
          cursor: pointer;
          padding: 9px;
          transition: all 0.25s ease;
        }

        .hamburger:hover {
          background: rgba(255, 255, 255, 0.08);
          border-color: rgba(255, 255, 255, 0.15);
        }

        .ham-line {
          display: block;
          width: 100%;
          height: 1.5px;
          background: rgba(255, 255, 255, 0.85);
          transition: transform 0.3s ease, opacity 0.3s ease;
          transform-origin: center;
        }

        .ham-line--top-open {
          transform: translateY(6.5px) rotate(45deg);
        }

        .ham-line--mid-open {
          opacity: 0;
          transform: scaleX(0);
        }

        .ham-line--bot-open {
          transform: translateY(-6.5px) rotate(-45deg);
        }

        /* ═══════════════════════════════════════
           MOBILE MENU
        ═══════════════════════════════════════ */
        .mobile-menu {
          display: none;
          flex-direction: column;
          background: rgba(12, 12, 12, 0.96);
          backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px);
          padding: 0;
          max-height: 0;
          overflow: hidden;
          transition: max-height 0.4s cubic-bezier(0.16, 1, 0.3, 1), padding 0.3s ease;
          border-radius: 0 0 10px 10px;
          border-top: 1px solid rgba(255, 255, 255, 0.05);
        }

        .mobile-menu--open {
          max-height: 500px;
          padding: 1rem 0 1.75rem;
        }

        .mobile-menu ul {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .mobile-menu :global(.mobile-link) {
          display: block;
          padding: 0.9rem 2.25rem;
          font-family: var(--font-inter), "Inter", sans-serif;
          font-size: 0.78rem;
          font-weight: 600;
          letter-spacing: 0.15em;
          color: rgba(255, 255, 255, 0.55);
          text-decoration: none;
          text-transform: uppercase;
          border-bottom: 1px solid rgba(255, 255, 255, 0.03);
          transition: all 0.25s ease;
        }

        .mobile-menu :global(.mobile-link:hover),
        .mobile-menu :global(.mobile-link--active) {
          color: #fff;
          padding-left: 2.75rem;
          background: rgba(255, 255, 255, 0.02);
        }

        .mobile-menu :global(.mobile-link--active) {
          color: #BE0027;
          border-left: 3px solid #BE0027;
        }

        .mobile-menu :global(.mobile-register) {
          display: inline-flex;
          margin: 1.5rem 2.25rem 0;
          font-family: var(--font-inter), "Inter", sans-serif;
          font-size: 0.72rem;
          font-weight: 700;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: #fff;
          background: linear-gradient(135deg, #BE0027, #91001b);
          padding: 0.85rem 2rem;
          text-decoration: none;
          text-align: center;
          justify-content: center;
          border-radius: 4px;
          transition: background 0.3s ease;
          box-shadow: 0 4px 15px rgba(190, 0, 39, 0.25);
        }

        .mobile-menu :global(.mobile-register:hover) {
          background: linear-gradient(135deg, #e01235, #BE0027);
        }

        /* ═══════════════════════════════════════
           RESPONSIVE
        ═══════════════════════════════════════ */
        @media (max-width: 900px) {
          .navbar {
            padding: 0 1.25rem;
            width: calc(100% - 1.5rem);
            top: 12px;
          }

          .navbar--scrolled {
            top: 6px;
            width: calc(100% - 1rem);
          }

          .navbar__links {
            display: none;
          }

          .navbar__actions :global(.register-btn) {
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
            padding: 0 1rem;
            width: calc(100% - 1rem);
            top: 8px;
          }

          .navbar--scrolled {
            top: 4px;
            width: calc(100% - 0.5rem);
          }

          .logo-sub {
            display: none;
          }

          .notif-dropdown {
            right: -50px;
            width: 290px;
          }
        }

        /* ── ANIMATIONS ── */
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