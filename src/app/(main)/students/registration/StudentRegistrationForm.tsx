"use client";

import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";

// ── Types ────────────────────────────────────────────────────────────
type Belt = "white" | "yellow" | "orange" | "green" | "blue" | "purple" | "brown" | "black";
type BloodGroup = "A+" | "A-" | "B+" | "B-" | "AB+" | "AB-" | "O+" | "O-";

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  currentBelt: Belt | "";
  fatherName: string;
  motherName: string;
  dob: string;
  bloodGroup: BloodGroup | "";
  mobileNumber: string;
  address: string;
  state: string;
  pinCode: string;
  aadharCard: File | null;
  passportPhoto: File | null;
  beltCertificate: File | null;
  instructorName: string;
  signature: File | null;
  declareTruth: boolean;
  agreeRules: boolean;
}

interface FieldError { [key: string]: string }

// ── Constants ────────────────────────────────────────────────────────
const BELTS: { value: Belt; label: string; color: string; text: string; glow: string }[] = [
  { value: "white",  label: "White",  color: "#e8e8e8", text: "#111",    glow: "rgba(255,255,255,0.3)" },
  { value: "yellow", label: "Yellow", color: "#f5c518", text: "#111",    glow: "rgba(245,197,24,0.4)" },
  { value: "orange", label: "Orange", color: "#e07020", text: "#fff",    glow: "rgba(224,112,32,0.4)" },
  { value: "green",  label: "Green",  color: "#2d6a2d", text: "#fff",    glow: "rgba(58,140,58,0.4)" },
  { value: "blue",   label: "Blue",   color: "#1a3a6e", text: "#fff",    glow: "rgba(34,85,170,0.4)" },
  { value: "purple", label: "Purple", color: "#4a1a7a", text: "#fff",    glow: "rgba(107,33,168,0.4)" },
  { value: "brown",  label: "Brown",  color: "#5c3317", text: "#fff",    glow: "rgba(122,69,32,0.4)" },
  { value: "black",  label: "Black",  color: "#111",    text: "#c9a84c", glow: "rgba(201,168,76,0.4)" },
];

const BLOOD_GROUPS: BloodGroup[] = ["A+","A-","B+","B-","AB+","AB-","O+","O-"];

const INDIAN_STATES = [
  "Andhra Pradesh","Arunachal Pradesh","Assam","Bihar","Chhattisgarh","Goa",
  "Gujarat","Haryana","Himachal Pradesh","Jharkhand","Karnataka","Kerala",
  "Madhya Pradesh","Maharashtra","Manipur","Meghalaya","Mizoram","Nagaland",
  "Odisha","Punjab","Rajasthan","Sikkim","Tamil Nadu","Telangana","Tripura",
  "Uttar Pradesh","Uttarakhand","West Bengal","Delhi","Jammu & Kashmir",
  "Ladakh","Puducherry",
];

const STEPS = ["Account","Personal","Identity","Karate","Declaration"];

// ── Global Styles ────────────────────────────────────────────────────
const STYLES = `
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  @keyframes ring-spin    { from{transform:rotate(0deg);} to{transform:rotate(360deg);} }
  @keyframes ring-pulse   { 0%,100%{opacity:.5;transform:scale(1);} 50%{opacity:1;transform:scale(1.07);} }
  @keyframes banner-shine { 0%{top:-50px;opacity:0;} 30%{opacity:1;} 70%{opacity:1;} 100%{top:110%;opacity:0;} }
  @keyframes black-spin   { from{transform:rotate(0deg);} to{transform:rotate(360deg);} }
  @keyframes spark-orbit  { 0%{transform:rotate(0deg) translateX(32px);opacity:1;} 50%{opacity:.3;} 100%{transform:rotate(360deg) translateX(32px);opacity:1;} }
  @keyframes step-glow    { 0%,100%{opacity:.6;} 50%{opacity:1;} }
  @keyframes float-in     { from{opacity:0;transform:translateY(28px);} to{opacity:1;transform:translateY(0);} }
  @keyframes success-pop  { from{opacity:0;transform:scale(.9) translateY(20px);} to{opacity:1;transform:scale(1) translateY(0);} }
  @keyframes check-draw   { from{stroke-dashoffset:50;} to{stroke-dashoffset:0;} }

  input::placeholder  { color:#444; }
  textarea::placeholder { color:#444; }
  select option { background:#0d0d0d; color:#ccc; }

  input[type="date"]::-webkit-calendar-picker-indicator { filter:invert(1) opacity(.4); cursor:pointer; }

  .sr-only { position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap; }

  /* ── ROOT ── */
  .reg-root {
    min-height: 100vh;
    background: #050505;
    padding-bottom: 80px;
    padding-top: 80px;
  }

  /* ── HERO ── */
  .reg-hero {
    position: relative;
    overflow: hidden;
    padding: 56px 56px 0;
    border-bottom: 1px solid #1a1a1a;
  }
  .reg-hero-bg {
    position: absolute; top:-10px; right:-30px; z-index:0;
    font-family: var(--font-cinzel,"serif");
    font-size: 200px; font-weight:900;
    color: rgba(255,255,255,0.02);
    letter-spacing: 10px; text-transform:uppercase;
    pointer-events:none; user-select:none; line-height:1;
  }
  .reg-hero-inner { position:relative; z-index:1; max-width:1100px; margin:0 auto; padding-bottom:40px; }
  .reg-eyebrow {
    display:flex; align-items:center; gap:12px; margin-bottom:20px;
  }
  .reg-eyebrow-line { width:32px; height:1px; background:#555; }
  .reg-eyebrow-text {
    font-family: var(--font-montserrat,"sans-serif");
    font-size:10px; letter-spacing:5px; color:#555; text-transform:uppercase;
  }
  .reg-hero-sub {
    font-family: var(--font-montserrat,"sans-serif");
    font-size: clamp(10px,1.2vw,13px); font-weight:300;
    letter-spacing:10px; color:#3a3a3a;
    margin-bottom:8px; text-transform:uppercase;
  }
  .reg-hero-title {
    font-family: var(--font-cinzel,"serif");
    font-size: clamp(40px,6vw,80px); font-weight:900;
    color:#e8e8e8; letter-spacing:6px; text-transform:uppercase;
    margin:0 0 16px; line-height:.9;
  }
  .reg-hero-desc {
    font-family: var(--font-cormorant,"serif");
    font-size:17px; color:#666; font-style:italic;
    max-width:600px; line-height:1.7;
  }

  /* ── PROGRESS RIBBON ── */
  .reg-progress {
    display:flex; justify-content:center; gap:0;
    padding:20px 56px;
    background:#080808;
    border-bottom:1px solid #111;
    overflow-x:auto; scrollbar-width:none;
  }
  .reg-progress::-webkit-scrollbar { display:none; }
  .reg-step {
    display:flex; flex-direction:column; align-items:center; gap:6px;
    min-width:72px; position:relative;
  }
  .reg-step::after {
    content:''; position:absolute; top:10px;
    left:calc(50% + 10px); right:calc(-50% + 10px);
    height:1px; background:rgba(255,255,255,0.08);
  }
  .reg-step:last-child::after { display:none; }
  .reg-step-dot {
    width:18px; height:18px; border-radius:50%;
    border:2px solid #2a2a2a; background:transparent;
    transition:all .4s ease; z-index:1;
  }
  .reg-step--active .reg-step-dot {
    background:#c9a84c; border-color:#c9a84c;
    box-shadow:0 0 10px rgba(201,168,76,.5);
    animationName:step-glow; animationDuration:2s; animationIterationCount:infinite;
  }
  .reg-step-label {
    font-family: var(--font-montserrat,"sans-serif");
    font-size:9px; font-weight:700; letter-spacing:1px;
    text-transform:uppercase; color:#444; transition:color .3s;
  }
  .reg-step--active .reg-step-label { color:#888; }

  /* ── FORM ── */
  .reg-form {
    max-width:960px; margin:0 auto;
    padding:40px 56px 0;
    display:flex; flex-direction:column; gap:16px;
  }

  /* ── SECTION CARD ── */
  .reg-section {
    position:relative;
    background:#0a0a0a;
    border:1px solid #1a1a1a;
    border-radius:10px;
    overflow:hidden;
    padding:32px 32px 28px 40px;
    display:flex; flex-direction:column; gap:24px;
    opacity:0; transform:translateY(24px);
  }

  /* Left accent banner */
  .reg-section-banner {
    position:absolute; left:0; top:0; bottom:0; width:6px;
    background:linear-gradient(180deg,#c9a84c,#8b6914,#c9a84c);
    box-shadow:3px 0 12px rgba(201,168,76,.3);
    overflow:hidden;
  }
  .reg-section-banner::after {
    content:'';
    position:absolute; left:0; width:100%; height:50px;
    background:linear-gradient(to bottom,transparent,rgba(201,168,76,.9),transparent);
    animationName:banner-shine; animationDuration:3s;
    animationTimingFunction:ease-in-out; animationIterationCount:infinite;
  }

  /* Top/bottom edges */
  .reg-section-edge-top,
  .reg-section-edge-bottom {
    position:absolute; left:0; right:0; height:1px; z-index:4;
    background:linear-gradient(to right,#c9a84c00,#c9a84c55,#c9a84c00);
  }
  .reg-section-edge-top  { top:0; }
  .reg-section-edge-bottom { bottom:0; background:linear-gradient(to right,#c9a84c00,#c9a84c33,#c9a84c00); }
  .reg-section-edge-right {
    position:absolute; top:0; bottom:0; right:0; width:1px; z-index:4;
    background:linear-gradient(to bottom,#c9a84c00,#c9a84c55,#c9a84c00);
  }

  /* ── SECTION HEADER ── */
  .reg-sec-header {
    display:flex; align-items:flex-start; gap:16px;
    padding-bottom:20px; border-bottom:1px solid #1a1a1a;
  }
  .reg-sec-num {
    font-family: var(--font-cinzel,"serif");
    font-size:11px; font-weight:700; letter-spacing:2px;
    color:#c9a84c; border:1px solid #c9a84c44;
    background:rgba(201,168,76,.1); border-radius:4px;
    padding:4px 8px; flex-shrink:0; margin-top:2px;
  }
  .reg-sec-title {
    font-family: var(--font-cinzel,"serif");
    font-size:18px; font-weight:700;
    color:#e0e0e0; letter-spacing:1px; margin-bottom:4px;
  }
  .reg-sec-sub {
    font-family: var(--font-cormorant,"serif");
    font-size:14px; color:#666; font-style:italic;
  }

  /* ── GRIDS ── */
  .grid-2 { display:grid; grid-template-columns:1fr 1fr; gap:20px; }
  .grid-3 { display:grid; grid-template-columns:1fr 1fr 1fr; gap:20px; }
  @media(max-width:768px) { .grid-3{grid-template-columns:1fr 1fr;} }
  @media(max-width:540px) { .grid-2,.grid-3{grid-template-columns:1fr;} }

  /* ── FIELDS ── */
  .f-wrap { display:flex; flex-direction:column; gap:0; }
  .f-label {
    font-family: var(--font-montserrat,"sans-serif");
    font-size:9px; font-weight:700; letter-spacing:2px;
    text-transform:uppercase; color:#888;
    margin-bottom:8px;
  }
  .f-hint {
    font-family: var(--font-montserrat,"sans-serif");
    font-size:10px; color:#555; margin-bottom:6px; line-height:1.5;
  }
  .f-error {
    font-family: var(--font-montserrat,"sans-serif");
    font-size:10px; color:#e74c3c; margin-top:5px; font-weight:600;
  }

  /* ── INPUTS ── */
  .f-input {
    width:100%; padding:12px 16px;
    background:#0d0d0d;
    border:1px solid #2a2a2a;
    border-radius:6px; color:#ccc;
    font-family: var(--font-montserrat,"sans-serif");
    font-size:13px;
    outline:none;
    transition:border-color .2s,box-shadow .2s;
    -webkit-appearance:none; appearance:none;
  }
  .f-input:hover  { border-color:#3a3a3a; }
  .f-input:focus  { border-color:#c9a84c; box-shadow:0 0 0 2px rgba(201,168,76,.2); }
  .f-input--error { border-color:#e74c3c !important; }
  .f-textarea     { resize:vertical; min-height:88px; }

  /* ── PHONE PREFIX ── */
  .f-prefix-wrap {
    display:flex; align-items:stretch;
    border:1px solid #2a2a2a; border-radius:6px; overflow:hidden;
    transition:border-color .2s, box-shadow .2s;
  }
  .f-prefix-wrap:focus-within { border-color:#c9a84c; box-shadow:0 0 0 2px rgba(201,168,76,.2); }
  .f-prefix {
    background:#111; color:#666; font-size:13px; font-weight:600;
    padding:12px 14px; border-right:1px solid #2a2a2a;
    display:flex; align-items:center; white-space:nowrap;
    font-family: var(--font-montserrat,"sans-serif");
  }
  .f-input--prefixed { border:none; border-radius:0; box-shadow:none !important; }

  /* ── BELT CHIPS ── */
  .belt-grid {
    display:flex; flex-wrap:wrap; gap:8px;
  }
  .belt-chip {
    display:flex; align-items:center; gap:7px;
    padding:8px 14px;
    border:1px solid #2a2a2a;
    border-radius:99px;
    background:transparent;
    cursor:pointer;
    font-family: var(--font-montserrat,"sans-serif");
    font-size:11px; font-weight:700;
    letter-spacing:1px; text-transform:uppercase;
    color:#777;
    transition:all .2s ease;
  }
  .belt-chip:hover { border-color:#c9a84c; color:#c9a84c; }
  .belt-swatch {
    width:14px; height:14px; border-radius:50%; flex-shrink:0;
  }

  /* ── FILE UPLOAD ── */
  .f-drop {
    border:2px dashed #2a2a2a; border-radius:8px;
    padding:24px 20px; cursor:pointer;
    background:#0d0d0d;
    transition:all .25s ease;
    user-select:none;
  }
  .f-drop:hover           { border-color:#c9a84c; background:rgba(201,168,76,.04); }
  .f-drop--error          { border-color:#e74c3c; }
  .f-drop--filled         { border-style:solid; border-color:#27ae60; background:rgba(39,174,96,.06); }
  .f-drop-empty           { display:flex; flex-direction:column; align-items:center; gap:8px; color:#555; }
  .f-drop-icon            { font-size:28px; }
  .f-drop-text            { font-family:var(--font-montserrat,"sans-serif"); font-size:12px; font-weight:600; }
  .f-drop-limit           { font-family:var(--font-montserrat,"sans-serif"); font-size:10px; color:#444; }
  .f-drop-filled          { display:flex; align-items:center; gap:12px; }
  .f-drop-check           { width:32px; height:32px; border-radius:50%; background:#27ae60; color:#fff; display:flex; align-items:center; justify-content:center; font-size:16px; font-weight:700; flex-shrink:0; }
  .f-drop-name            { font-family:var(--font-montserrat,"sans-serif"); font-size:12px; font-weight:700; color:#ccc; word-break:break-all; }
  .f-drop-size            { font-family:var(--font-montserrat,"sans-serif"); font-size:10px; color:#666; }
  .f-drop-remove          { margin-left:auto; background:none; border:none; font-size:22px; color:#555; cursor:pointer; flex-shrink:0; transition:color .2s; }
  .f-drop-remove:hover    { color:#e74c3c; }

  /* ── DECLARATION ── */
  .decl-box {
    background:rgba(201,168,76,.06);
    border:1px solid rgba(201,168,76,.2);
    border-radius:8px; padding:20px;
    display:flex; flex-direction:column; gap:16px;
  }
  .decl-row  { display:flex; flex-direction:column; gap:4px; }
  .decl-label { display:flex; align-items:flex-start; gap:12px; cursor:pointer; }
  .decl-cb   { display:none; }
  .decl-custom {
    width:18px; height:18px; border-radius:3px;
    border:1.5px solid #3a3a3a; flex-shrink:0; margin-top:2px;
    transition:all .2s; position:relative; background:#0d0d0d;
  }
  .decl-cb:checked + .decl-custom { background:#c9a84c; border-color:#c9a84c; }
  .decl-cb:checked + .decl-custom::after {
    content:'✓'; position:absolute; inset:0;
    display:flex; align-items:center; justify-content:center;
    color:#000; font-size:11px; font-weight:900;
  }
  .decl-text {
    font-family:var(--font-montserrat,"sans-serif");
    font-size:12px; color:#999; line-height:1.6;
  }
  .decl-text strong { color:#ccc; }

  /* ── ERROR BANNER ── */
  .err-banner {
    background:rgba(231,76,60,.1); border:1px solid rgba(231,76,60,.3);
    border-radius:6px; padding:12px 16px;
    font-family:var(--font-montserrat,"sans-serif");
    font-size:11px; color:#e74c3c; font-weight:700;
  }

  /* ── SUBMIT ── */
  .reg-submit {
    width:100%; padding:16px 32px;
    background:linear-gradient(135deg,#c9a84c,#8b6914);
    color:#fff; border:none; border-radius:8px;
    font-family:var(--font-montserrat,"sans-serif");
    font-size:12px; font-weight:700; letter-spacing:2.5px;
    text-transform:uppercase; cursor:pointer;
    transition:all .3s ease;
    box-shadow:0 8px 24px rgba(201,168,76,.3);
    display:flex; align-items:center; justify-content:center; gap:10px;
  }
  .reg-submit:hover { transform:translateY(-3px); box-shadow:0 14px 32px rgba(201,168,76,.5); }
  .reg-submit:active { transform:translateY(0); }

  /* ── SUCCESS ── */
  .success-root {
    min-height:100vh; background:#050505;
    display:flex; align-items:center; justify-content:center;
    padding:24px;
  }
  .success-card {
    background:#0a0a0a; border:1px solid #c9a84c55;
    border-radius:12px; padding:56px 48px;
    max-width:480px; width:100%; text-align:center;
    animation:success-pop .5s cubic-bezier(.34,1.56,.64,1) both;
    box-shadow:0 0 60px rgba(201,168,76,.1);
    position:relative; overflow:hidden;
  }
  .success-card::before { content:''; position:absolute; top:0; left:0; right:0; height:2px; background:linear-gradient(to right,#c9a84c00,#c9a84c,#c9a84c00); }
  .success-icon { font-size:56px; margin-bottom:20px; display:block; }
  .success-title {
    font-family:var(--font-cinzel,"serif");
    font-size:28px; font-weight:700; color:#c9a84c; letter-spacing:2px;
    margin-bottom:12px;
  }
  .success-body {
    font-family:var(--font-cormorant,"serif");
    font-size:17px; color:#888; font-style:italic;
    line-height:1.7; margin-bottom:28px;
  }
  .success-email {
    padding:12px 20px; background:rgba(201,168,76,.1);
    border:1px solid rgba(201,168,76,.25); border-radius:6px;
    font-family:var(--font-montserrat,"sans-serif");
    font-size:11px; color:#ccc; margin-bottom:28px;
  }
  .success-email strong { color:#c9a84c; }
  .success-btn {
    padding:12px 32px; background:#c9a84c; color:#000;
    border:none; border-radius:6px; cursor:pointer;
    font-family:var(--font-montserrat,"sans-serif");
    font-size:11px; font-weight:700; letter-spacing:2px;
    text-transform:uppercase; transition:all .2s;
  }
  .success-btn:hover { background:#dfd4a8; }

  /* ── FOOTER ── */
  .reg-footer {
    text-align:center; padding:32px 56px 0;
    font-family:var(--font-montserrat,"sans-serif");
    font-size:10px; color:#333; letter-spacing:1px;
  }

  /* ── RESPONSIVE ── */
  @media(max-width:900px) {
    .reg-hero, .reg-form, .reg-progress, .reg-footer { padding-left:24px !important; padding-right:24px !important; }
    .reg-section { padding:24px 24px 20px 30px; }
  }
  @media(max-width:540px) {
    .reg-hero { padding-top:36px; }
    .reg-hero-title { font-size:36px; }
  }

  *:focus-visible { outline:2px solid #c9a84c; outline-offset:2px; }
`;

// ── File size formatter ──────────────────────────────────────────────
function fmtKb(kb: number): string {
  return kb >= 1024 ? `${(kb / 1024).toFixed(0)} MB` : `${kb} KB`;
}

// ── Section card wrapper ─────────────────────────────────────────────
function Section({
  num, title, subtitle, children, sref,
}: {
  num: string; title: string; subtitle: string; children: React.ReactNode;
  sref: (el: HTMLDivElement | null) => void;
}) {
  return (
    <div className="reg-section" ref={sref}>
      <div className="reg-section-banner" />
      <div className="reg-section-edge-top" />
      <div className="reg-section-edge-bottom" />
      <div className="reg-section-edge-right" />

      <div className="reg-sec-header">
        <span className="reg-sec-num">{num}</span>
        <div>
          <div className="reg-sec-title">{title}</div>
          <div className="reg-sec-sub">{subtitle}</div>
        </div>
      </div>

      {children}
    </div>
  );
}

// ── Label + error ────────────────────────────────────────────────────
function Label({ children, required }: { children: React.ReactNode; required?: boolean }) {
  return (
    <label className="f-label">
      {children}
      {required && <span style={{ color: "#e74c3c", marginLeft: 3 }}>*</span>}
    </label>
  );
}
function FError({ msg }: { msg?: string }) {
  return msg ? <p className="f-error">{msg}</p> : null;
}

// ── File upload field ────────────────────────────────────────────────
function FileField({
  label, name, accept, limitKb, value, error, hint, onChange,
}: {
  label: string; name: string; accept: string; limitKb: number;
  value: File | null; error?: string; hint?: string;
  onChange: (f: File | null) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    if (file && file.size > limitKb * 1024) {
      onChange(null);
      if (inputRef.current) inputRef.current.value = "";
    } else {
      onChange(file);
    }
  };

  return (
    <div className="f-wrap">
      <Label>{label}</Label>
      {hint && <p className="f-hint">{hint}</p>}
      <div
        className={`f-drop ${error ? "f-drop--error" : ""} ${value ? "f-drop--filled" : ""}`}
        onClick={() => inputRef.current?.click()}
      >
        <input ref={inputRef} id={name} type="file" accept={accept} className="sr-only" onChange={handleChange} />
        {value ? (
          <div className="f-drop-filled">
            <div className="f-drop-check">✓</div>
            <div>
              <p className="f-drop-name">{value.name}</p>
              <p className="f-drop-size">{(value.size / 1024).toFixed(1)} KB</p>
            </div>
            <button type="button" className="f-drop-remove" onClick={e => { e.stopPropagation(); onChange(null); if (inputRef.current) inputRef.current.value = ""; }}>×</button>
          </div>
        ) : (
          <div className="f-drop-empty">
            <span className="f-drop-icon">📂</span>
            <span className="f-drop-text">Click to upload</span>
            <span className="f-drop-limit">Max {fmtKb(limitKb)} · {accept.replace(/\./g, "").toUpperCase()}</span>
          </div>
        )}
      </div>
      <FError msg={error} />
    </div>
  );
}

// ── Main component ───────────────────────────────────────────────────
export default function StudentRegistrationForm() {
  const [formData, setFormData] = useState<FormData>({
    firstName: "Arjun", lastName: "Sharma",
    email: "arjun.sharma@email.com", currentBelt: "yellow",
    fatherName: "", motherName: "", dob: "", bloodGroup: "",
    mobileNumber: "", address: "", state: "", pinCode: "",
    aadharCard: null, passportPhoto: null, beltCertificate: null,
    instructorName: "", signature: null,
    declareTruth: false, agreeRules: false,
  });

  const [errors, setErrors]       = useState<FieldError>({});
  const [submitted, setSubmitted] = useState(false);
  const [activeStep, setActiveStep] = useState(0);

  const pageRef     = useRef<HTMLDivElement>(null);
  const sectionsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    gsap.fromTo(pageRef.current, { opacity: 0 }, { opacity: 1, duration: 0.4 });
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
    tl.fromTo(".reg-hero-inner > *",
      { opacity: 0, y: 28, filter: "blur(8px)" },
      { opacity: 1, y: 0, filter: "blur(0px)", stagger: 0.12, duration: 0.9 }
    );
    tl.fromTo(".reg-section",
      { opacity: 0, y: 28 },
      { opacity: 1, y: 0, stagger: 0.1, duration: 0.65 },
      "-=0.5"
    );
  }, []);

  const set = <K extends keyof FormData>(key: K, val: FormData[K]) => {
    setFormData(prev => ({ ...prev, [key]: val }));
    if (errors[key]) setErrors(prev => ({ ...prev, [key]: "" }));
  };

  const validate = (): boolean => {
    const e: FieldError = {};
    if (!formData.firstName.trim())  e.firstName    = "Required";
    if (!formData.lastName.trim())   e.lastName     = "Required";
    if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email)) e.email = "Valid email required";
    if (!formData.currentBelt)       e.currentBelt  = "Select your belt";
    if (!formData.fatherName.trim()) e.fatherName   = "Required";
    if (!formData.motherName.trim()) e.motherName   = "Required";
    if (!formData.dob)               e.dob          = "Required";
    if (!formData.bloodGroup)        e.bloodGroup   = "Required";
    if (!formData.mobileNumber || !/^\d{10}$/.test(formData.mobileNumber)) e.mobileNumber = "10-digit number required";
    if (!formData.address.trim())    e.address      = "Required";
    if (!formData.state)             e.state        = "Required";
    if (!formData.pinCode || !/^\d{6}$/.test(formData.pinCode)) e.pinCode = "6-digit PIN required";
    if (!formData.aadharCard)        e.aadharCard   = "Aadhar card required";
    if (!formData.passportPhoto)     e.passportPhoto= "Passport photo required";
    if (!formData.instructorName.trim()) e.instructorName = "Required";
    if (!formData.signature)         e.signature    = "Signature required";
    if (!formData.declareTruth)      e.declareTruth = "Please confirm";
    if (!formData.agreeRules)        e.agreeRules   = "Please agree to continue";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) setSubmitted(true);
  };

  // Selected belt data
  const selectedBelt = BELTS.find(b => b.value === formData.currentBelt);

  if (submitted) {
    return (
      <div className="success-root">
        <style>{STYLES}</style>
        <div className="success-card">
          <span className="success-icon">🎖️</span>
          <h2 className="success-title">Registration Submitted!</h2>
          <p className="success-body">Your application has been received and will be reviewed by the federation. You will be notified once it is approved.</p>
          <div className="success-email">📧 Confirmation sent to <strong>{formData.email}</strong></div>
          <button className="success-btn" onClick={() => setSubmitted(false)}>Edit Registration</button>
        </div>
      </div>
    );
  }

  return (
    <div ref={pageRef} className="reg-root" style={{ opacity: 0 }}>
      <style>{STYLES}</style>

      {/* ── HERO ── */}
      <div className="reg-hero">
        <div className="reg-hero-bg">DOJO</div>
        <div className="reg-hero-inner">
          <div className="reg-eyebrow">
            <div className="reg-eyebrow-line" />
            <span className="reg-eyebrow-text">Dadi Bulsara Ashihara Karate · Member Registration</span>
          </div>
          <div className="reg-hero-sub">Apply for</div>
          <h1 className="reg-hero-title">Federation<br />Membership</h1>
          <p className="reg-hero-desc">
            Complete your official registration to receive your federation membership card and unlock access to national camps, tournaments, and belt examinations.
          </p>
        </div>
      </div>

      {/* ── PROGRESS ── */}
      <div className="reg-progress">
        {STEPS.map((step, i) => (
          <div key={step} className={`reg-step ${activeStep >= i ? "reg-step--active" : ""}`}>
            <div className="reg-step-dot" />
            <span className="reg-step-label">{step}</span>
          </div>
        ))}
      </div>

      {/* ── FORM ── */}
      <form className="reg-form" onSubmit={handleSubmit} noValidate>

        {/* ── 01 ACCOUNT ── */}
        <Section num="01" title="Account Details"
          subtitle="Pre-filled from your sign-up. Update if anything is incorrect."
          sref={el => { sectionsRef.current[0] = el; }}
        >
          <div className="grid-2">
            <div className="f-wrap" onFocus={() => setActiveStep(0)}>
              <Label required>First Name</Label>
              <input className={`f-input ${errors.firstName ? "f-input--error" : ""}`} value={formData.firstName} onChange={e => set("firstName", e.target.value)} placeholder="Arjun" />
              <FError msg={errors.firstName} />
            </div>
            <div className="f-wrap">
              <Label required>Last Name</Label>
              <input className={`f-input ${errors.lastName ? "f-input--error" : ""}`} value={formData.lastName} onChange={e => set("lastName", e.target.value)} placeholder="Sharma" />
              <FError msg={errors.lastName} />
            </div>
          </div>

          <div className="f-wrap">
            <Label required>Email Address</Label>
            <input type="email" className={`f-input ${errors.email ? "f-input--error" : ""}`} value={formData.email} onChange={e => set("email", e.target.value)} placeholder="arjun@example.com" />
            <FError msg={errors.email} />
          </div>

          <div className="f-wrap">
            <Label required>Current Belt</Label>
            <div className="belt-grid">
              {BELTS.map(b => {
                const isActive = formData.currentBelt === b.value;
                return (
                  <button
                    key={b.value}
                    type="button"
                    className="belt-chip"
                    onClick={() => set("currentBelt", b.value)}
                    style={{
                      background:   isActive ? b.color : "transparent",
                      borderColor:  isActive ? b.color : "#2a2a2a",
                      color:        isActive ? b.text  : "#777",
                      boxShadow:    isActive ? `0 0 12px ${b.glow}` : "none",
                    }}
                  >
                    <span className="belt-swatch" style={{
                      background: b.color,
                      border: b.value === "white" ? "1px solid #999" : "none",
                      boxShadow: `0 0 6px ${b.glow}`,
                    }} />
                    {b.label}
                  </button>
                );
              })}
            </div>
            {selectedBelt && (
              <div style={{ marginTop: 8, padding: "8px 14px", background: `${selectedBelt.color}18`, border: `1px solid ${selectedBelt.color}44`, borderRadius: 6, display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ width: 10, height: 10, borderRadius: "50%", background: selectedBelt.color, boxShadow: `0 0 8px ${selectedBelt.glow}` }} />
                <span style={{ fontFamily: "var(--font-montserrat,sans-serif)", fontSize: 11, color: "#999", letterSpacing: "0.5px" }}>
                  Selected: <strong style={{ color: selectedBelt.color }}>{selectedBelt.label} Belt</strong>
                </span>
              </div>
            )}
            <FError msg={errors.currentBelt} />
          </div>
        </Section>

        {/* ── 02 PERSONAL ── */}
        <Section num="02" title="Personal Details"
          subtitle="Fill in your family and contact information accurately."
          sref={el => { sectionsRef.current[1] = el; }}
        >
          <div className="grid-2">
            <div className="f-wrap" onFocus={() => setActiveStep(1)}>
              <Label required>Father&apos;s Full Name</Label>
              <input className={`f-input ${errors.fatherName ? "f-input--error" : ""}`} value={formData.fatherName} onChange={e => set("fatherName", e.target.value)} placeholder="Rajesh Sharma" />
              <FError msg={errors.fatherName} />
            </div>
            <div className="f-wrap">
              <Label required>Mother&apos;s Full Name</Label>
              <input className={`f-input ${errors.motherName ? "f-input--error" : ""}`} value={formData.motherName} onChange={e => set("motherName", e.target.value)} placeholder="Sunita Sharma" />
              <FError msg={errors.motherName} />
            </div>
          </div>

          <div className="grid-3">
            <div className="f-wrap">
              <Label required>Date of Birth</Label>
              <input type="date" className={`f-input ${errors.dob ? "f-input--error" : ""}`} value={formData.dob} onChange={e => set("dob", e.target.value)} />
              <FError msg={errors.dob} />
            </div>
            <div className="f-wrap">
              <Label required>Blood Group</Label>
              <select className={`f-input ${errors.bloodGroup ? "f-input--error" : ""}`} value={formData.bloodGroup} onChange={e => set("bloodGroup", e.target.value as BloodGroup)}>
                <option value="">Select</option>
                {BLOOD_GROUPS.map(bg => <option key={bg} value={bg}>{bg}</option>)}
              </select>
              <FError msg={errors.bloodGroup} />
            </div>
            <div className="f-wrap">
              <Label required>Mobile Number</Label>
              <div className={`f-prefix-wrap ${errors.mobileNumber ? "f-input--error" : ""}`} style={{ border: errors.mobileNumber ? "1px solid #e74c3c" : "1px solid #2a2a2a" }}>
                <span className="f-prefix">+91</span>
                <input type="tel" maxLength={10} className="f-input f-input--prefixed" value={formData.mobileNumber} onChange={e => set("mobileNumber", e.target.value.replace(/\D/g, ""))} placeholder="9876543210" />
              </div>
              <FError msg={errors.mobileNumber} />
            </div>
          </div>

          <div className="f-wrap">
            <Label required>Address</Label>
            <textarea className={`f-input f-textarea ${errors.address ? "f-input--error" : ""}`} rows={3} value={formData.address} onChange={e => set("address", e.target.value)} placeholder="House/Flat No., Street, Colony, Landmark" />
            <FError msg={errors.address} />
          </div>

          <div className="grid-2">
            <div className="f-wrap">
              <Label required>State</Label>
              <select className={`f-input ${errors.state ? "f-input--error" : ""}`} value={formData.state} onChange={e => set("state", e.target.value)}>
                <option value="">Select State</option>
                {INDIAN_STATES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
              <FError msg={errors.state} />
            </div>
            <div className="f-wrap">
              <Label required>PIN Code</Label>
              <input maxLength={6} className={`f-input ${errors.pinCode ? "f-input--error" : ""}`} value={formData.pinCode} onChange={e => set("pinCode", e.target.value.replace(/\D/g, ""))} placeholder="800001" />
              <FError msg={errors.pinCode} />
            </div>
          </div>
        </Section>

        {/* ── 03 IDENTITY ── */}
        <Section num="03" title="Identity Documents"
          subtitle="Upload clear scans or photos. Accepted formats: JPG, PNG, PDF."
          sref={el => { sectionsRef.current[2] = el; }}
        >
          <div className="grid-2" onFocus={() => setActiveStep(2)}>
            <FileField
              label="Aadhar Card *" name="aadharCard"
              accept=".jpg,.jpeg,.png,.pdf" limitKb={1024}
              value={formData.aadharCard} error={errors.aadharCard}
              hint="Front & back · JPG / PNG / PDF · Max 1 MB"
              onChange={f => set("aadharCard", f)}
            />
            <FileField
              label="Passport Size Photo *" name="passportPhoto"
              accept=".jpg,.jpeg,.png" limitKb={200}
              value={formData.passportPhoto} error={errors.passportPhoto}
              hint="White background, recent · JPG / PNG · Max 200 KB"
              onChange={f => set("passportPhoto", f)}
            />
          </div>
        </Section>

        {/* ── 04 KARATE ── */}
        <Section num="04" title="Karate Information"
          subtitle="Your dojo details and grading certificate."
          sref={el => { sectionsRef.current[3] = el; }}
        >
          <div onFocus={() => setActiveStep(3)}>
            <FileField
              label="Belt Certificate (Optional)" name="beltCertificate"
              accept=".jpg,.jpeg,.png,.pdf" limitKb={2048}
              value={formData.beltCertificate}
              hint="Upload your current belt grading certificate · Max 2 MB"
              onChange={f => set("beltCertificate", f)}
            />
          </div>
          <div className="f-wrap">
            <Label required>Instructor / Sensei Name</Label>
            <input className={`f-input ${errors.instructorName ? "f-input--error" : ""}`} value={formData.instructorName} onChange={e => set("instructorName", e.target.value)} placeholder="Sensei Dadi Bulsara" />
            <FError msg={errors.instructorName} />
          </div>
        </Section>

        {/* ── 05 DECLARATION ── */}
        <Section num="05" title="Declaration & Signature"
          subtitle="Read carefully, sign, and confirm your registration details."
          sref={el => { sectionsRef.current[4] = el; }}
        >
          <div onFocus={() => setActiveStep(4)}>
            <FileField
              label="Signature *" name="signature"
              accept=".jpg,.jpeg,.png" limitKb={512}
              value={formData.signature} error={errors.signature}
              hint="Clear image of your signature (or parent's if minor) · Max 512 KB"
              onChange={f => set("signature", f)}
            />
          </div>

          <div className="decl-box">
            <div className="decl-row">
              <label className="decl-label">
                <input type="checkbox" className="decl-cb" checked={formData.declareTruth} onChange={e => set("declareTruth", e.target.checked)} />
                <span className="decl-custom" />
                <span className="decl-text">
                  I hereby declare that the information provided by me is <strong>true and correct</strong> to the best of my knowledge and belief.
                </span>
              </label>
              <FError msg={errors.declareTruth} />
            </div>
            <div className="decl-row">
              <label className="decl-label">
                <input type="checkbox" className="decl-cb" checked={formData.agreeRules} onChange={e => set("agreeRules", e.target.checked)} />
                <span className="decl-custom" />
                <span className="decl-text">
                  I agree to abide by the <strong>rules and regulations</strong> of the Dadi Bulsara Ashihara Karate Federation and uphold the code of conduct.
                </span>
              </label>
              <FError msg={errors.agreeRules} />
            </div>
          </div>

          {Object.keys(errors).length > 0 && (
            <div className="err-banner">⚠ Please fix the errors above before submitting.</div>
          )}

          <button type="submit" className="reg-submit">
            <span>Submit Registration</span>
            <span>→</span>
          </button>
        </Section>
      </form>

      <footer className="reg-footer">
        <p>© 2025 Dadi Bulsara Ashihara Karate Federation · All rights reserved</p>
      </footer>
    </div>
  );
}