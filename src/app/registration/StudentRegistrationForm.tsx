"use client";

import React, { useEffect, useRef, useState } from "react";

// ── Types ────────────────────────────────────────────────────────────
type Belt =
  | "white"
  | "yellow"
  | "orange"
  | "green"
  | "blue"
  | "purple"
  | "brown"
  | "black";

type BloodGroup = "A+" | "A-" | "B+" | "B-" | "AB+" | "AB-" | "O+" | "O-";

interface FormData {
  // Pre-filled from signup
  firstName: string;
  lastName: string;
  email: string;
  currentBelt: Belt | "";
  // Personal details
  fatherName: string;
  motherName: string;
  dob: string;
  bloodGroup: BloodGroup | "";
  mobileNumber: string;
  address: string;
  state: string;
  pinCode: string;
  // Identity documents
  aadharCard: File | null;
  passportPhoto: File | null;
  // Karate info
  beltCertificate: File | null;
  instructorName: string;
  signature: File | null;
  // Declarations
  declareTruth: boolean;
  agreeRules: boolean;
}

interface FieldError {
  [key: string]: string;
}

// ── Constants ────────────────────────────────────────────────────────
const BELTS: { value: Belt; label: string; color: string }[] = [
  { value: "white", label: "White Belt", color: "#ffffff" },
  { value: "yellow", label: "Yellow Belt", color: "#FFD700" },
  { value: "orange", label: "Orange Belt", color: "#FF8C00" },
  { value: "green", label: "Green Belt", color: "#228B22" },
  { value: "blue", label: "Blue Belt", color: "#1E3A8A" },
  { value: "purple", label: "Purple Belt", color: "#6B21A8" },
  { value: "brown", label: "Brown Belt", color: "#78350F" },
  { value: "black", label: "Black Belt", color: "#000000" },
];

const BLOOD_GROUPS: BloodGroup[] = [
  "A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-",
];

const INDIAN_STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
  "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka",
  "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram",
  "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu",
  "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal",
  "Delhi", "Jammu & Kashmir", "Ladakh", "Puducherry",
];

const PASSPORT_PHOTO_LIMIT_KB = 200;
const CERTIFICATE_LIMIT_KB = 2048; // 2MB
const SIGNATURE_LIMIT_KB = 512;

// ── Utility ──────────────────────────────────────────────────────────
function formatFileSize(kb: number): string {
  return kb >= 1024 ? `${(kb / 1024).toFixed(0)} MB` : `${kb} KB`;
}

// ── Sub-components ───────────────────────────────────────────────────
interface SectionHeaderProps {
  number: string;
  title: string;
  subtitle?: string;
}

function SectionHeader({ number, title, subtitle }: SectionHeaderProps) {
  return (
    <div className="section-header">
      <div className="section-number">{number}</div>
      <div>
        <h2 className="section-title">{title}</h2>
        {subtitle && <p className="section-subtitle">{subtitle}</p>}
      </div>
    </div>
  );
}

interface FileUploadFieldProps {
  label: string;
  name: string;
  accept: string;
  limitKb: number;
  value: File | null;
  error?: string;
  hint?: string;
  onChange: (file: File | null) => void;
}

function FileUploadField({
  label,
  name,
  accept,
  limitKb,
  value,
  error,
  hint,
  onChange,
}: FileUploadFieldProps) {
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
    <div className="field-wrapper">
      <label className="bd-label" htmlFor={name}>
        {label}
      </label>
      {hint && <p className="field-hint">{hint}</p>}
      <div
        className={`file-drop ${error ? "file-drop--error" : ""} ${value ? "file-drop--filled" : ""}`}
        onClick={() => inputRef.current?.click()}
      >
        <input
          ref={inputRef}
          id={name}
          type="file"
          accept={accept}
          className="sr-only"
          onChange={handleChange}
        />
        {value ? (
          <div className="file-info">
            <span className="file-icon">✓</span>
            <div>
              <p className="file-name">{value.name}</p>
              <p className="file-size">{(value.size / 1024).toFixed(1)} KB</p>
            </div>
            <button
              type="button"
              className="file-remove"
              onClick={(e) => {
                e.stopPropagation();
                onChange(null);
                if (inputRef.current) inputRef.current.value = "";
              }}
            >
              ×
            </button>
          </div>
        ) : (
          <div className="file-placeholder">
            <span className="upload-icon">↑</span>
            <span className="upload-text">
              Click to upload · Max {formatFileSize(limitKb)}
            </span>
          </div>
        )}
      </div>
      {error && <p className="field-error">{error}</p>}
    </div>
  );
}

// ── Main Component ───────────────────────────────────────────────────
export default function StudentRegistrationForm() {
  // Simulate pre-filled data from signup
  const [formData, setFormData] = useState<FormData>({
    firstName: "Arjun",
    lastName: "Sharma",
    email: "arjun.sharma@email.com",
    currentBelt: "yellow",
    fatherName: "",
    motherName: "",
    dob: "",
    bloodGroup: "",
    mobileNumber: "",
    address: "",
    state: "",
    pinCode: "",
    aadharCard: null,
    passportPhoto: null,
    beltCertificate: null,
    instructorName: "",
    signature: null,
    declareTruth: false,
    agreeRules: false,
  });

  const [errors, setErrors] = useState<FieldError>({});
  const [submitted, setSubmitted] = useState(false);
  const [activeSection, setActiveSection] = useState(0);

  const formRef = useRef<HTMLFormElement>(null);
  const sectionsRef = useRef<(HTMLDivElement | null)[]>([]);

  // GSAP-like stagger reveal on mount (vanilla JS since we can't import gsap in artifact)
  useEffect(() => {
    const sections = sectionsRef.current.filter(Boolean);
    sections.forEach((el, i) => {
      if (!el) return;
      el.style.opacity = "0";
      el.style.transform = "translateY(28px)";
      setTimeout(() => {
        el.style.transition = "opacity 0.55s ease, transform 0.55s ease";
        el.style.opacity = "1";
        el.style.transform = "translateY(0)";
      }, 120 + i * 100);
    });
  }, []);

  // ── Handlers ────────────────────────────────────────────────────
  const set = <K extends keyof FormData>(key: K, val: FormData[K]) => {
    setFormData((prev) => ({ ...prev, [key]: val }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: "" }));
  };

  const validate = (): boolean => {
    const e: FieldError = {};
    if (!formData.firstName.trim()) e.firstName = "First name is required";
    if (!formData.lastName.trim()) e.lastName = "Last name is required";
    if (!formData.email.trim() || !/\S+@\S+\.\S+/.test(formData.email))
      e.email = "Valid email is required";
    if (!formData.currentBelt) e.currentBelt = "Please select your belt";
    if (!formData.fatherName.trim()) e.fatherName = "Father's name is required";
    if (!formData.motherName.trim()) e.motherName = "Mother's name is required";
    if (!formData.dob) e.dob = "Date of birth is required";
    if (!formData.bloodGroup) e.bloodGroup = "Blood group is required";
    if (!formData.mobileNumber.trim() || !/^\d{10}$/.test(formData.mobileNumber))
      e.mobileNumber = "Enter a valid 10-digit mobile number";
    if (!formData.address.trim()) e.address = "Address is required";
    if (!formData.state) e.state = "State is required";
    if (!formData.pinCode.trim() || !/^\d{6}$/.test(formData.pinCode))
      e.pinCode = "Enter a valid 6-digit PIN code";
    if (!formData.aadharCard) e.aadharCard = "Aadhar card copy is required";
    if (!formData.passportPhoto) e.passportPhoto = "Passport photo is required";
    if (!formData.instructorName.trim())
      e.instructorName = "Instructor name is required";
    if (!formData.signature) e.signature = "Signature is required";
    if (!formData.declareTruth)
      e.declareTruth = "You must declare the information is true";
    if (!formData.agreeRules) e.agreeRules = "You must agree to the rules";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="success-screen">
        <div className="success-inner">
          <div className="success-icon">✓</div>
          <h1 className="success-title">Registration Submitted</h1>
          <p className="success-body">
            Your registration has been received. You will be notified once it is
            reviewed by the federation.
          </p>
          <button className="btn-primary" onClick={() => setSubmitted(false)}>
            Edit Registration
          </button>
        </div>

        <style>{globalStyles}</style>
      </div>
    );
  }

  return (
    <>
      <style>{globalStyles}</style>

      <div className="page-root">
        {/* ── Page Header ── */}
        <header className="page-header">
          <div className="header-inner">
            <div className="header-kamon"></div>
            <div>
              <p className="header-eyebrow">Dadi Bulsara Karate Federation</p>
              <h1 className="header-title">Student Registration</h1>
            </div>
          </div>
          <p className="header-subtitle">
            Complete your profile to receive your official federation membership.
          </p>
        </header>

        {/* ── Progress Ribbon ── */}
        <div className="progress-ribbon">
          {["Account", "Personal", "Identity", "Karate", "Declaration"].map(
            (step, i) => (
              <div
                key={step}
                className={`progress-step ${activeSection >= i ? "progress-step--active" : ""}`}
              >
                <div className="progress-dot" />
                <span className="progress-label">{step}</span>
              </div>
            )
          )}
        </div>

        {/* ── Form ── */}
        <form
          ref={formRef}
          onSubmit={handleSubmit}
          noValidate
          className="form-root"
        >
          {/* ══ SECTION 1: Account Details ══ */}
          <div
            className="form-section"
            ref={(el) => { sectionsRef.current[0] = el; }}
            onFocus={() => setActiveSection(0)}
          >
            <SectionHeader
              number="01"
              title="Account Details"
              subtitle="Pre-filled from your sign-up. Update if anything is incorrect."
            />
            <div className="grid-2">
              <div className="field-wrapper">
                <label className="bd-label" htmlFor="firstName">First Name</label>
                <input
                  id="firstName"
                  className={`bd-input ${errors.firstName ? "bd-input--error" : ""}`}
                  value={formData.firstName}
                  onChange={(e) => set("firstName", e.target.value)}
                  placeholder="Arjun"
                />
                {errors.firstName && <p className="field-error">{errors.firstName}</p>}
              </div>
              <div className="field-wrapper">
                <label className="bd-label" htmlFor="lastName">Last Name</label>
                <input
                  id="lastName"
                  className={`bd-input ${errors.lastName ? "bd-input--error" : ""}`}
                  value={formData.lastName}
                  onChange={(e) => set("lastName", e.target.value)}
                  placeholder="Sharma"
                />
                {errors.lastName && <p className="field-error">{errors.lastName}</p>}
              </div>
            </div>
            <div className="field-wrapper">
              <label className="bd-label" htmlFor="email">Email Address</label>
              <input
                id="email"
                type="email"
                className={`bd-input ${errors.email ? "bd-input--error" : ""}`}
                value={formData.email}
                onChange={(e) => set("email", e.target.value)}
                placeholder="arjun@example.com"
              />
              {errors.email && <p className="field-error">{errors.email}</p>}
            </div>
            <div className="field-wrapper">
              <label className="bd-label" htmlFor="currentBelt">Current Belt</label>
              <div className="belt-grid">
                {BELTS.map((b) => (
                  <button
                    key={b.value}
                    type="button"
                    className={`belt-chip ${formData.currentBelt === b.value ? "belt-chip--active" : ""}`}
                    onClick={() => set("currentBelt", b.value)}
                  >
                    <span
                      className="belt-swatch"
                      style={{
                        background: b.color,
                        border: b.value === "white" ? "1px solid #ccc" : "none",
                      }}
                    />
                    {b.label}
                  </button>
                ))}
              </div>
              {errors.currentBelt && <p className="field-error">{errors.currentBelt}</p>}
            </div>
          </div>

          {/* ══ SECTION 2: Personal Details ══ */}
          <div
            className="form-section"
            ref={(el) => { sectionsRef.current[1] = el; }}
            onFocus={() => setActiveSection(1)}
          >
            <SectionHeader
              number="02"
              title="Personal Details"
              subtitle="Fill in your family and contact information."
            />
            <div className="grid-2">
              <div className="field-wrapper">
                <label className="bd-label" htmlFor="fatherName">Father&apos;s Full Name</label>
                <input
                  id="fatherName"
                  className={`bd-input ${errors.fatherName ? "bd-input--error" : ""}`}
                  value={formData.fatherName}
                  onChange={(e) => set("fatherName", e.target.value)}
                  placeholder="Rajesh Sharma"
                />
                {errors.fatherName && <p className="field-error">{errors.fatherName}</p>}
              </div>
              <div className="field-wrapper">
                <label className="bd-label" htmlFor="motherName">Mother&apos;s Full Name</label>
                <input
                  id="motherName"
                  className={`bd-input ${errors.motherName ? "bd-input--error" : ""}`}
                  value={formData.motherName}
                  onChange={(e) => set("motherName", e.target.value)}
                  placeholder="Sunita Sharma"
                />
                {errors.motherName && <p className="field-error">{errors.motherName}</p>}
              </div>
            </div>

            <div className="grid-3">
              <div className="field-wrapper">
                <label className="bd-label" htmlFor="dob">Date of Birth</label>
                <input
                  id="dob"
                  type="date"
                  className={`bd-input ${errors.dob ? "bd-input--error" : ""}`}
                  value={formData.dob}
                  onChange={(e) => set("dob", e.target.value)}
                />
                {errors.dob && <p className="field-error">{errors.dob}</p>}
              </div>
              <div className="field-wrapper">
                <label className="bd-label" htmlFor="bloodGroup">Blood Group</label>
                <select
                  id="bloodGroup"
                  className={`bd-input bd-select ${errors.bloodGroup ? "bd-input--error" : ""}`}
                  value={formData.bloodGroup}
                  onChange={(e) => set("bloodGroup", e.target.value as BloodGroup)}
                >
                  <option value="">Select blood group</option>
                  {BLOOD_GROUPS.map((bg) => (
                    <option key={bg} value={bg}>{bg}</option>
                  ))}
                </select>
                {errors.bloodGroup && <p className="field-error">{errors.bloodGroup}</p>}
              </div>
              <div className="field-wrapper">
                <label className="bd-label" htmlFor="mobileNumber">
                  Mobile Number
                </label>
                <div className="input-prefix-wrap">
                  <span className="input-prefix">+91</span>
                  <input
                    id="mobileNumber"
                    type="tel"
                    maxLength={10}
                    className={`bd-input bd-input--prefixed ${errors.mobileNumber ? "bd-input--error" : ""}`}
                    value={formData.mobileNumber}
                    onChange={(e) => set("mobileNumber", e.target.value.replace(/\D/g, ""))}
                    placeholder="9876543210"
                  />
                </div>
                {errors.mobileNumber && <p className="field-error">{errors.mobileNumber}</p>}
              </div>
            </div>

            <div className="field-wrapper">
              <label className="bd-label" htmlFor="address">Address</label>
              <textarea
                id="address"
                rows={3}
                className={`bd-input bd-textarea ${errors.address ? "bd-input--error" : ""}`}
                value={formData.address}
                onChange={(e) => set("address", e.target.value)}
                placeholder="House/Flat No., Street, Colony, Landmark"
              />
              {errors.address && <p className="field-error">{errors.address}</p>}
            </div>

            <div className="grid-2">
              <div className="field-wrapper">
                <label className="bd-label" htmlFor="state">State</label>
                <select
                  id="state"
                  className={`bd-input bd-select ${errors.state ? "bd-input--error" : ""}`}
                  value={formData.state}
                  onChange={(e) => set("state", e.target.value)}
                >
                  <option value="">Select state</option>
                  {INDIAN_STATES.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
                {errors.state && <p className="field-error">{errors.state}</p>}
              </div>
              <div className="field-wrapper">
                <label className="bd-label" htmlFor="pinCode">PIN Code</label>
                <input
                  id="pinCode"
                  type="text"
                  maxLength={6}
                  className={`bd-input ${errors.pinCode ? "bd-input--error" : ""}`}
                  value={formData.pinCode}
                  onChange={(e) => set("pinCode", e.target.value.replace(/\D/g, ""))}
                  placeholder="800001"
                />
                {errors.pinCode && <p className="field-error">{errors.pinCode}</p>}
              </div>
            </div>
          </div>

          {/* ══ SECTION 3: Identity Documents ══ */}
          <div
            className="form-section"
            ref={(el) => { sectionsRef.current[2] = el; }}
            onFocus={() => setActiveSection(2)}
          >
            <SectionHeader
              number="03"
              title="Identity Documents"
              subtitle="Upload clear scans or photos of your documents."
            />
            <div className="grid-2">
              <FileUploadField
                label="Aadhar Card"
                name="aadharCard"
                accept="image/jpeg,image/png,application/pdf"
                limitKb={1024}
                value={formData.aadharCard}
                error={errors.aadharCard}
                hint="Accepted: JPG, PNG, PDF · Max 1 MB"
                onChange={(f) => set("aadharCard", f)}
              />
              <FileUploadField
                label="Passport Size Photo"
                name="passportPhoto"
                accept="image/jpeg,image/png"
                limitKb={PASSPORT_PHOTO_LIMIT_KB}
                value={formData.passportPhoto}
                error={errors.passportPhoto}
                hint={`Recent photo, white background · Max ${PASSPORT_PHOTO_LIMIT_KB} KB`}
                onChange={(f) => set("passportPhoto", f)}
              />
            </div>
          </div>

          {/* ══ SECTION 4: Karate Information ══ */}
          <div
            className="form-section"
            ref={(el) => { sectionsRef.current[3] = el; }}
            onFocus={() => setActiveSection(3)}
          >
            <SectionHeader
              number="04"
              title="Karate Information"
              subtitle="Your dojo and grading details."
            />
            <FileUploadField
              label="Belt Certificate"
              name="beltCertificate"
              accept="image/jpeg,image/png,application/pdf"
              limitKb={CERTIFICATE_LIMIT_KB}
              value={formData.beltCertificate}
              hint={`Upload your current belt certificate · Max ${formatFileSize(CERTIFICATE_LIMIT_KB)}`}
              onChange={(f) => set("beltCertificate", f)}
            />
            <div className="field-wrapper">
              <label className="bd-label" htmlFor="instructorName">
                Instructor / Sensei Name
              </label>
              <input
                id="instructorName"
                className={`bd-input ${errors.instructorName ? "bd-input--error" : ""}`}
                value={formData.instructorName}
                onChange={(e) => set("instructorName", e.target.value)}
                placeholder="Sensei Vikram Singh"
              />
              {errors.instructorName && (
                <p className="field-error">{errors.instructorName}</p>
              )}
            </div>
          </div>

          {/* ══ SECTION 5: Declaration ══ */}
          <div
            className="form-section"
            ref={(el) => { sectionsRef.current[4] = el; }}
            onFocus={() => setActiveSection(4)}
          >
            <SectionHeader
              number="05"
              title="Declaration & Signature"
              subtitle="Sign and confirm your registration."
            />

            <FileUploadField
              label="Signature (Student / Parent if Minor)"
              name="signature"
              accept="image/jpeg,image/png"
              limitKb={SIGNATURE_LIMIT_KB}
              value={formData.signature}
              error={errors.signature}
              hint={`Upload a clear image of your signature · Max ${formatFileSize(SIGNATURE_LIMIT_KB)}`}
              onChange={(f) => set("signature", f)}
            />

            <div className="declaration-box">
              <div className="checkbox-row">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    className="checkbox-input"
                    checked={formData.declareTruth}
                    onChange={(e) => set("declareTruth", e.target.checked)}
                  />
                  <span className="checkbox-custom" />
                  <span className="checkbox-text">
                    I hereby declare that the information provided by me is{" "}
                    <strong>true and correct</strong> to the best of my knowledge.
                  </span>
                </label>
                {errors.declareTruth && (
                  <p className="field-error">{errors.declareTruth}</p>
                )}
              </div>

              <div className="checkbox-row">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    className="checkbox-input"
                    checked={formData.agreeRules}
                    onChange={(e) => set("agreeRules", e.target.checked)}
                  />
                  <span className="checkbox-custom" />
                  <span className="checkbox-text">
                    I agree to abide by the{" "}
                    <strong>rules and regulations</strong> of the federation.
                  </span>
                </label>
                {errors.agreeRules && (
                  <p className="field-error">{errors.agreeRules}</p>
                )}
              </div>
            </div>

            {Object.keys(errors).length > 0 && (
              <div className="form-error-banner">
                Please fix the errors above before submitting.
              </div>
            )}

            <button type="submit" className="btn-submit">
              Submit Registration
              <span className="btn-arrow">→</span>
            </button>
          </div>
        </form>

        {/* ── Footer ── */}
        <footer className="form-footer">
          <p>© 2025 Bushido Karate Federation · All rights reserved</p>
        </footer>
      </div>
    </>
  );
}

// ── Styles ────────────────────────────────────────────────────────────
const globalStyles = `

  :root {
    --primary: #BE0027;
    --primary-dark: #91001b;
    --charcoal: #121212;
    --surface: #fbf9f8;
    --dojo-grey: #F4F4F4;
    --outline: #E0E0E0;
    --on-surface: #1b1c1c;
    --on-surface-var: #5c3f3f;
    --font-sans: "Inter", "Segoe UI", system-ui, sans-serif;
    --font-display: "Montserrat", "Segoe UI", system-ui, sans-serif;
    --radius: 4px;
  }

  body { font-family: var(--font-sans); background: #0a0a0a; color: var(--on-surface); }

  .sr-only { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0,0,0,0); white-space: nowrap; }

  /* ── Page ── */
  .page-root {
    min-height: 100vh;
    background: linear-gradient(160deg, #0f0f0f 0%, #1a0005 50%, #0a0a0a 100%);
    padding-bottom: 60px;
    margin-Top: 45px;
  }

  /* ── Header ── */
  .page-header {
    background: linear-gradient(135deg, #0a0a0a 0%, #1c0007 100%);
    border-bottom: 1px solid rgba(190,0,39,0.25);
    padding: 48px 24px 36px;
    text-align: center;
  }
  .header-inner {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 16px;
    margin-bottom: 12px;
    flex-wrap: wrap;
  }
  .header-kamon {
    font-size: 2.5rem;
    color: var(--primary);
    font-family: serif;
    line-height: 1;
    opacity: 0.85;
  }
  .header-eyebrow {
    font-family: var(--font-display);
    font-size: 0.65rem;
    font-weight: 700;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: var(--primary);
    margin-bottom: 4px;
  }
  .header-title {
    font-family: var(--font-display);
    font-size: clamp(1.5rem, 4vw, 2.25rem);
    font-weight: 700;
    color: #fff;
    letter-spacing: -0.01em;
    line-height: 1.1;
  }
  .header-subtitle {
    color: rgba(255,255,255,0.5);
    font-size: 0.875rem;
    max-width: 480px;
    margin: 0 auto;
    line-height: 1.6;
  }

  /* ── Progress ── */
  .progress-ribbon {
    display: flex;
    justify-content: center;
    gap: 0;
    padding: 16px 24px;
    background: rgba(0,0,0,0.4);
    border-bottom: 1px solid rgba(255,255,255,0.05);
    overflow-x: auto;
    scrollbar-width: none;
  }
  .progress-ribbon::-webkit-scrollbar { display: none; }
  .progress-step {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 6px;
    min-width: 64px;
    position: relative;
  }
  .progress-step::after {
    content: '';
    position: absolute;
    top: 7px;
    left: calc(50% + 10px);
    right: calc(-50% + 10px);
    height: 1px;
    background: rgba(255,255,255,0.12);
  }
  .progress-step:last-child::after { display: none; }
  .progress-dot {
    width: 14px;
    height: 14px;
    border-radius: 50%;
    border: 2px solid rgba(255,255,255,0.2);
    background: transparent;
    transition: background 0.3s, border-color 0.3s;
    z-index: 1;
  }
  .progress-step--active .progress-dot {
    background: var(--primary);
    border-color: var(--primary);
    box-shadow: 0 0 8px rgba(190,0,39,0.5);
  }
  .progress-label {
    font-size: 0.6rem;
    font-family: var(--font-display);
    font-weight: 600;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: rgba(255,255,255,0.35);
  }
  .progress-step--active .progress-label { color: rgba(255,255,255,0.75); }

  /* ── Form root ── */
  .form-root {
    max-width: 1100px;
    margin: 0 auto;
    padding: 32px 24px 0;
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  @media (min-width: 1024px) {
    .form-root {
      padding: 40px 48px 0;
    }
  }

  @media (min-width: 1280px) {
    .form-root {
      padding: 48px 64px 0;
    }
  }

  /* ── Form section card ── */
  .form-section {
    background: rgba(251,249,248,0.97);
    border-radius: 8px;
    padding: clamp(20px, 4vw, 40px);
    display: flex;
    flex-direction: column;
    gap: 20px;
    box-shadow: 0 2px 20px rgba(0,0,0,0.35), 0 1px 0 rgba(255,255,255,0.04) inset;
  }
  @media (min-width: 1024px) {
    .form-section { padding: 40px 48px; gap: 24px; }
  }

  /* ── Section header ── */
  .section-header {
    display: flex;
    align-items: flex-start;
    gap: 14px;
    padding-bottom: 16px;
    border-bottom: 1px solid var(--outline);
  }
  .section-number {
    font-family: var(--font-display);
    font-size: 0.65rem;
    font-weight: 800;
    letter-spacing: 0.12em;
    color: var(--primary);
    background: rgba(190,0,39,0.08);
    border: 1px solid rgba(190,0,39,0.2);
    border-radius: 3px;
    padding: 4px 7px;
    flex-shrink: 0;
    margin-top: 2px;
  }
  .section-title {
    font-family: var(--font-display);
    font-size: 1.05rem;
    font-weight: 700;
    color: var(--charcoal);
    line-height: 1.2;
  }
  .section-subtitle {
    font-size: 0.8rem;
    color: var(--on-surface-var);
    margin-top: 3px;
    line-height: 1.5;
  }

  /* ── Grid ── */
  .grid-2 {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
  }
  .grid-3 {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: 16px;
  }
  @media (max-width: 768px) {
    .grid-3 { grid-template-columns: 1fr 1fr; }
  }
  @media (max-width: 540px) {
    .grid-2, .grid-3 { grid-template-columns: 1fr; }
  }

  /* ── Field wrapper ── */
  .field-wrapper { display: flex; flex-direction: column; gap: 0; }
  .field-hint {
    font-size: 0.72rem;
    color: var(--on-surface-var);
    margin-bottom: 6px;
    line-height: 1.4;
  }
  .field-error {
    font-size: 0.72rem;
    color: var(--primary);
    margin-top: 5px;
    font-weight: 500;
  }

  /* ── Inputs ── */
  .bd-label {
    display: block;
    font-family: var(--font-display);
    font-size: 0.68rem;
    font-weight: 700;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--on-surface);
    margin-bottom: 6px;
  }
  .bd-input {
    width: 100%;
    background: #fff;
    color: var(--on-surface);
    font-family: var(--font-sans);
    font-size: 0.9rem;
    border: 1.5px solid var(--outline);
    border-radius: var(--radius);
    padding: 11px 14px;
    outline: none;
    transition: border-color 0.15s, box-shadow 0.15s;
    -webkit-appearance: none;
    appearance: none;
  }
  .bd-input::placeholder { color: #b0aaaa; }
  .bd-input:focus {
    border-color: var(--primary);
    box-shadow: 0 0 0 3px rgba(190,0,39,0.1);
  }
  .bd-input--error { border-color: var(--primary) !important; }
  .bd-textarea { resize: vertical; min-height: 88px; }
  .bd-select { cursor: pointer; }

  /* ── Prefix input ── */
  .input-prefix-wrap {
    display: flex;
    align-items: stretch;
    border: 1.5px solid var(--outline);
    border-radius: var(--radius);
    overflow: hidden;
    transition: border-color 0.15s, box-shadow 0.15s;
  }
  .input-prefix-wrap:focus-within {
    border-color: var(--primary);
    box-shadow: 0 0 0 3px rgba(190,0,39,0.1);
  }
  .input-prefix {
    background: var(--dojo-grey);
    color: var(--on-surface-var);
    font-size: 0.85rem;
    font-weight: 600;
    padding: 11px 12px;
    border-right: 1.5px solid var(--outline);
    white-space: nowrap;
    display: flex;
    align-items: center;
  }
  .bd-input--prefixed {
    border: none;
    border-radius: 0;
    box-shadow: none !important;
  }
  .bd-input--prefixed:focus { box-shadow: none !important; }

  /* ── Belt chips ── */
  .belt-grid {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }
  .belt-chip {
    display: flex;
    align-items: center;
    gap: 7px;
    padding: 7px 13px;
    border: 1.5px solid var(--outline);
    border-radius: 999px;
    background: #fff;
    cursor: pointer;
    font-family: var(--font-sans);
    font-size: 0.78rem;
    font-weight: 500;
    color: var(--on-surface);
    transition: border-color 0.15s, background 0.15s, color 0.15s;
  }
  .belt-chip:hover { border-color: var(--primary); background: rgba(190,0,39,0.04); }
  .belt-chip--active {
    border-color: var(--primary);
    background: var(--primary);
    color: #fff;
  }
  .belt-swatch {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    flex-shrink: 0;
  }

  /* ── File upload ── */
  .file-drop {
    border: 2px dashed var(--outline);
    border-radius: var(--radius);
    padding: 20px 16px;
    cursor: pointer;
    transition: border-color 0.15s, background 0.15s;
    background: #fafafa;
    user-select: none;
  }
  .file-drop:hover { border-color: var(--primary); background: rgba(190,0,39,0.03); }
  .file-drop--error { border-color: var(--primary); }
  .file-drop--filled { border-style: solid; border-color: #22c55e; background: rgba(34,197,94,0.04); }
  .file-placeholder {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 6px;
    color: #9ca3af;
  }
  .upload-icon {
    font-size: 1.5rem;
    display: block;
    line-height: 1;
  }
  .upload-text { font-size: 0.8rem; font-weight: 500; }
  .file-info {
    display: flex;
    align-items: center;
    gap: 10px;
  }
  .file-icon {
    width: 32px;
    height: 32px;
    background: #22c55e;
    color: #fff;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.9rem;
    font-weight: 700;
    flex-shrink: 0;
  }
  .file-name {
    font-size: 0.82rem;
    font-weight: 600;
    color: var(--charcoal);
    word-break: break-all;
  }
  .file-size { font-size: 0.72rem; color: #6b7280; }
  .file-remove {
    margin-left: auto;
    background: none;
    border: none;
    font-size: 1.3rem;
    color: #9ca3af;
    cursor: pointer;
    padding: 0 4px;
    line-height: 1;
    flex-shrink: 0;
  }
  .file-remove:hover { color: var(--primary); }

  /* ── Declaration ── */
  .declaration-box {
    background: rgba(190,0,39,0.04);
    border: 1px solid rgba(190,0,39,0.15);
    border-radius: 6px;
    padding: 20px;
    display: flex;
    flex-direction: column;
    gap: 16px;
  }
  .checkbox-row { display: flex; flex-direction: column; gap: 4px; }
  .checkbox-label {
    display: flex;
    align-items: flex-start;
    gap: 12px;
    cursor: pointer;
  }
  .checkbox-input { display: none; }
  .checkbox-custom {
    width: 18px;
    height: 18px;
    border: 2px solid var(--outline);
    border-radius: 3px;
    flex-shrink: 0;
    margin-top: 2px;
    transition: background 0.15s, border-color 0.15s;
    position: relative;
  }
  .checkbox-input:checked + .checkbox-custom {
    background: var(--primary);
    border-color: var(--primary);
  }
  .checkbox-input:checked + .checkbox-custom::after {
    content: '✓';
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    font-size: 0.7rem;
    font-weight: 700;
  }
  .checkbox-text {
    font-size: 0.83rem;
    line-height: 1.55;
    color: var(--on-surface);
  }

  /* ── Error banner ── */
  .form-error-banner {
    background: rgba(190,0,39,0.08);
    border: 1px solid rgba(190,0,39,0.3);
    border-radius: var(--radius);
    padding: 12px 16px;
    font-size: 0.82rem;
    color: var(--primary);
    font-weight: 600;
  }

  /* ── Submit button ── */
  .btn-submit {
    width: 100%;
    padding: 15px 24px;
    background: var(--primary);
    color: #fff;
    border: none;
    border-radius: var(--radius);
    font-family: var(--font-display);
    font-size: 0.85rem;
    font-weight: 700;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    transition: background 0.15s, transform 0.1s;
    margin-top: 4px;
  }
  .btn-submit:hover { background: var(--primary-dark); }
  .btn-submit:active { transform: scale(0.99); }
  .btn-arrow { font-size: 1.1rem; }

  /* ── Success ── */
  .success-screen {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(160deg, #0f0f0f 0%, #1a0005 50%, #0a0a0a 100%);
    padding: 24px;
  }
  .success-inner {
    text-align: center;
    background: rgba(251,249,248,0.97);
    border-radius: 10px;
    padding: 48px 36px;
    max-width: 420px;
    width: 100%;
  }
  .success-icon {
    width: 64px;
    height: 64px;
    background: #22c55e;
    color: #fff;
    border-radius: 50%;
    font-size: 1.8rem;
    font-weight: 700;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 20px;
  }
  .success-title {
    font-family: var(--font-display);
    font-size: 1.4rem;
    font-weight: 700;
    color: var(--charcoal);
    margin-bottom: 12px;
  }
  .success-body {
    font-size: 0.87rem;
    color: var(--on-surface-var);
    line-height: 1.6;
    margin-bottom: 28px;
  }
  .btn-primary {
    background: var(--primary);
    color: #fff;
    border: none;
    padding: 12px 28px;
    border-radius: var(--radius);
    font-family: var(--font-display);
    font-size: 0.8rem;
    font-weight: 700;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    cursor: pointer;
  }

  /* ── Footer ── */
  .form-footer {
    text-align: center;
    padding: 32px 16px 0;
    font-size: 0.72rem;
    color: rgba(255,255,255,0.2);
    letter-spacing: 0.04em;
  }

  /* ── Focus visible ── */
  *:focus-visible { outline: 2px solid var(--primary); outline-offset: 2px; }
`;