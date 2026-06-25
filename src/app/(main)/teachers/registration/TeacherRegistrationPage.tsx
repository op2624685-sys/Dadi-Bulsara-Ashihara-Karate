"use client";

import { useState, useRef } from "react";
import { gsap } from "gsap";

// ── Types ─────────────────────────────────────────────────────────────────────
interface RegistrationFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  age: number;
  state: string;
  city: string;
  dojoName: string;
  dojoLocation: string;
  yearsTraining: number;
  speciality: string;
  belt: string;
  danGrade: string;
  bio: string;
  achievements: string;
  certifications: string;
  photo?: File;
  experience: string;
  agreeTerms: boolean;
}

// ── States ────────────────────────────────────────────────────────────────────
const STATES = ["Maharashtra", "Gujarat", "Delhi", "Kerala", "Karnataka", "Tamil Nadu", "Punjab", "West Bengal", "Andhra Pradesh", "Rajasthan"];
const BELTS = ["White", "Yellow", "Green", "Blue", "Brown", "Black", "Red-White", "Red-Black", "Red"];
const SPECIALITIES = ["Sabaki", "Kumite", "Kata", "Conditioning", "Self-Defense", "Sparring", "General"];

// ── Global Styles ────────────────────────────────────────────────────────────
const GLOBAL_STYLES = `
  @keyframes slide-in { from { opacity:0; transform:translateY(40px); } to { opacity:1; transform:translateY(0); } }
  @keyframes float { 0%,100% { transform:translateY(0px); } 50% { transform:translateY(-10px); } }
  input, textarea, select { font-family: var(--font-montserrat); transition: all 0.3s ease; }
  input:focus, textarea:focus, select:focus { border-color:#c9a84c !important; box-shadow: 0 0 12px rgba(201,168,76,0.3) !important; }
  @media (max-width: 768px) {
    .form-container { padding-left: 20px !important; padding-right: 20px !important; }
  }
`;

// ── Input Field Component ─────────────────────────────────────────────────────
function FormField({
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  required = false,
  error = "",
}: {
  label: string;
  type?: string;
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  required?: boolean;
  error?: string;
}) {
  return (
    <div style={{ marginBottom: "24px" }}>
      <label style={{
        display: "block",
        fontFamily: "var(--font-montserrat)",
        fontSize: "11px",
        fontWeight: 600,
        letterSpacing: "2px",
        color: "#999",
        textTransform: "uppercase",
        marginBottom: "8px",
      }}>
        {label} {required && <span style={{ color: "#e74c3c" }}>*</span>}
      </label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        style={{
          width: "100%",
          padding: "12px 16px",
          background: "#0d0d0d",
          border: error ? "1px solid #e74c3c" : "1px solid #2a2a2a",
          borderRadius: "6px",
          color: "#ccc",
          fontSize: "13px",
          boxSizing: "border-box",
          outline: "none",
        }}
      />
      {error && (
        <span style={{ color: "#e74c3c", fontSize: "11px", marginTop: "4px", display: "block" }}>
          {error}
        </span>
      )}
    </div>
  );
}

// ── Select Field Component ────────────────────────────────────────────────────
function SelectField({
  label,
  value,
  onChange,
  options,
  required = false,
  error = "",
}: {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: string[];
  required?: boolean;
  error?: string;
}) {
  return (
    <div style={{ marginBottom: "24px" }}>
      <label style={{
        display: "block",
        fontFamily: "var(--font-montserrat)",
        fontSize: "11px",
        fontWeight: 600,
        letterSpacing: "2px",
        color: "#999",
        textTransform: "uppercase",
        marginBottom: "8px",
      }}>
        {label} {required && <span style={{ color: "#e74c3c" }}>*</span>}
      </label>
      <select
        value={value}
        onChange={onChange}
        required={required}
        style={{
          width: "100%",
          padding: "12px 16px",
          background: "#0d0d0d",
          border: error ? "1px solid #e74c3c" : "1px solid #2a2a2a",
          borderRadius: "6px",
          color: "#ccc",
          fontSize: "13px",
          boxSizing: "border-box",
          outline: "none",
          cursor: "pointer",
        }}
      >
        <option value="">Select {label}</option>
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
      {error && (
        <span style={{ color: "#e74c3c", fontSize: "11px", marginTop: "4px", display: "block" }}>
          {error}
        </span>
      )}
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function TeacherRegistrationPage() {
  const [formData, setFormData] = useState<RegistrationFormData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    age: 0,
    state: "",
    city: "",
    dojoName: "",
    dojoLocation: "",
    yearsTraining: 0,
    speciality: "",
    belt: "",
    danGrade: "",
    bio: "",
    achievements: "",
    certifications: "",
    experience: "",
    agreeTerms: false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.firstName.trim()) newErrors.firstName = "First name required";
    if (!formData.lastName.trim()) newErrors.lastName = "Last name required";
    if (!formData.email.includes("@")) newErrors.email = "Valid email required";
    if (!formData.phone.match(/^\d{10}$/)) newErrors.phone = "Valid 10-digit phone required";
    if (formData.age < 18) newErrors.age = "Must be 18 or older";
    if (!formData.state) newErrors.state = "State required";
    if (!formData.dojoName.trim()) newErrors.dojoName = "Dojo name required";
    if (!formData.dojoLocation.trim()) newErrors.dojoLocation = "Dojo location required";
    if (formData.yearsTraining < 1) newErrors.yearsTraining = "Must have at least 1 year training";
    if (!formData.belt) newErrors.belt = "Belt level required";
    if (!formData.speciality) newErrors.speciality = "Speciality required";
    if (!formData.bio.trim()) newErrors.bio = "Bio required";
    if (!formData.agreeTerms) newErrors.agreeTerms = "Must agree to terms";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData({ ...formData, photo: file });
      const reader = new FileReader();
      reader.onload = (event) => {
        setPhotoPreview(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      alert("Please fill all required fields correctly.");
      return;
    }

    // Simulate form submission
    console.log("Form submitted:", formData);

    // Show success state
    setSubmitted(true);

    // Reset after 3 seconds
    setTimeout(() => {
      setSubmitted(false);
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        age: 0,
        state: "",
        city: "",
        dojoName: "",
        dojoLocation: "",
        yearsTraining: 0,
        speciality: "",
        belt: "",
        danGrade: "",
        bio: "",
        achievements: "",
        certifications: "",
        experience: "",
        agreeTerms: false,
      });
      setPhotoPreview(null);
      setErrors({});
    }, 3000);
  };

  return (
    <div style={{ minHeight: "100vh", background: "#050505", paddingTop: "80px" }}>
      <style>{GLOBAL_STYLES}</style>

      {/* ── HERO SECTION ── */}
      <div ref={headerRef} style={{
        position: "relative",
        padding: "60px 56px",
        background: "linear-gradient(135deg, rgba(201,168,76,0.08), rgba(58,140,58,0.08))",
        borderBottom: "1px solid #1a1a1a",
        overflow: "hidden",
      }}>
        {/* Floating bg text */}
        <div style={{
          position: "absolute",
          top: "-20px",
          right: "-40px",
          fontFamily: "var(--font-cinzel)",
          fontSize: "200px",
          fontWeight: 900,
          color: "rgba(255,255,255,0.02)",
          letterSpacing: "10px",
          textTransform: "uppercase",
          pointerEvents: "none",
          userSelect: "none",
        }}>
          SENSEI
        </div>

        <div style={{ maxWidth: "1200px", margin: "0 auto", position: "relative", zIndex: 2 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px" }}>
            <div style={{ width: "32px", height: "1px", background: "#555" }} />
            <span style={{
              fontFamily: "var(--font-montserrat)",
              fontSize: "10px",
              letterSpacing: "5px",
              color: "#666",
              textTransform: "uppercase",
            }}>
              Join the Lineage
            </span>
          </div>

          <h1 style={{
            fontFamily: "var(--font-cinzel)",
            fontSize: "clamp(48px, 6vw, 72px)",
            fontWeight: 900,
            color: "#e8e8e8",
            letterSpacing: "4px",
            textTransform: "uppercase",
            margin: "0 0 16px",
            lineHeight: 0.9,
          }}>
            Become a Sensei
          </h1>

          <p style={{
            fontFamily: "var(--font-cormorant)",
            fontSize: "18px",
            color: "#999",
            fontStyle: "italic",
            margin: 0,
            maxWidth: "600px",
          }}>
            Apply to teach Ashihara Karate and share your knowledge with the next generation of martial artists.
          </p>
        </div>
      </div>

      {/* ── FORM SECTION ── */}
      {!submitted ? (
        <div className="form-container" style={{
          maxWidth: "900px",
          margin: "0 auto",
          padding: "56px 56px 80px",
        }}>
          <form ref={formRef} onSubmit={handleSubmit} style={{
            animationName: "slide-in",
            animationDuration: "0.6s",
            animationFillMode: "both",
          }}>
            {/* PERSONAL INFORMATION */}
            <div style={{ marginBottom: "48px" }}>
              <h2 style={{
                fontFamily: "var(--font-cinzel)",
                fontSize: "24px",
                fontWeight: 700,
                color: "#c9a84c",
                letterSpacing: "2px",
                marginBottom: "24px",
                marginTop: 0,
              }}>
                🥋 Personal Information
              </h2>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "20px" }}>
                <FormField
                  label="First Name"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  placeholder="e.g., Dadi"
                  required
                  error={errors.firstName}
                />
                <FormField
                  label="Last Name"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  placeholder="e.g., Bulsara"
                  required
                  error={errors.lastName}
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "20px" }}>
                <FormField
                  label="Email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="your@email.com"
                  required
                  error={errors.email}
                />
                <FormField
                  label="Phone Number"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="10-digit number"
                  required
                  error={errors.phone}
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "20px" }}>
                <FormField
                  label="Age"
                  type="number"
                  value={formData.age}
                  onChange={(e) => setFormData({ ...formData, age: parseInt(e.target.value) })}
                  placeholder="18+"
                  required
                  error={errors.age}
                />
                <SelectField
                  label="State"
                  value={formData.state}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                  options={STATES}
                  required
                  error={errors.state}
                />
              </div>

              <FormField
                label="City"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                placeholder="e.g., Mumbai"
              />

              {/* Photo Upload */}
              <div style={{ marginBottom: "24px" }}>
                <label style={{
                  display: "block",
                  fontFamily: "var(--font-montserrat)",
                  fontSize: "11px",
                  fontWeight: 600,
                  letterSpacing: "2px",
                  color: "#999",
                  textTransform: "uppercase",
                  marginBottom: "12px",
                }}>
                  Profile Photo
                </label>
                <div style={{
                  padding: "20px",
                  background: "#0a0a0a",
                  border: "2px dashed #2a2a2a",
                  borderRadius: "6px",
                  textAlign: "center",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                }}>
                  {photoPreview ? (
                    <div>
                      <img src={photoPreview} alt="Preview" style={{
                        width: "120px",
                        height: "120px",
                        borderRadius: "50%",
                        objectFit: "cover",
                        border: "2px solid #c9a84c",
                        marginBottom: "12px",
                      }} />
                      <p style={{
                        fontFamily: "var(--font-montserrat)",
                        fontSize: "11px",
                        color: "#666",
                        margin: 0,
                      }}>
                        Click to change
                      </p>
                    </div>
                  ) : (
                    <div>
                      <div style={{ fontSize: "32px", marginBottom: "8px" }}>📸</div>
                      <p style={{
                        fontFamily: "var(--font-montserrat)",
                        fontSize: "12px",
                        color: "#666",
                        margin: 0,
                      }}>
                        Upload your photo
                      </p>
                    </div>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    style={{ display: "none", cursor: "pointer" }}
                    id="photo-upload"
                  />
                  <label htmlFor="photo-upload" style={{ cursor: "pointer", display: "block" }} />
                </div>
              </div>
            </div>

            {/* DOJO INFORMATION */}
            <div style={{ marginBottom: "48px" }}>
              <h2 style={{
                fontFamily: "var(--font-cinzel)",
                fontSize: "24px",
                fontWeight: 700,
                color: "#c9a84c",
                letterSpacing: "2px",
                marginBottom: "24px",
                marginTop: 0,
              }}>
                🏢 Dojo Information
              </h2>

              <FormField
                label="Dojo Name"
                value={formData.dojoName}
                onChange={(e) => setFormData({ ...formData, dojoName: e.target.value })}
                placeholder="e.g., Bulsara Ashihara Karate Dojo"
                required
                error={errors.dojoName}
              />

              <FormField
                label="Dojo Location (Full Address)"
                value={formData.dojoLocation}
                onChange={(e) => setFormData({ ...formData, dojoLocation: e.target.value })}
                placeholder="e.g., Mumbai, Maharashtra"
                required
                error={errors.dojoLocation}
              />
            </div>

            {/* MARTIAL ARTS BACKGROUND */}
            <div style={{ marginBottom: "48px" }}>
              <h2 style={{
                fontFamily: "var(--font-cinzel)",
                fontSize: "24px",
                fontWeight: 700,
                color: "#c9a84c",
                letterSpacing: "2px",
                marginBottom: "24px",
                marginTop: 0,
              }}>
                🥋 Martial Arts Background
              </h2>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "20px" }}>
                <FormField
                  label="Years of Training"
                  type="number"
                  value={formData.yearsTraining}
                  onChange={(e) => setFormData({ ...formData, yearsTraining: parseInt(e.target.value) })}
                  placeholder="e.g., 20"
                  required
                  error={errors.yearsTraining}
                />
                <SelectField
                  label="Current Belt Level"
                  value={formData.belt}
                  onChange={(e) => setFormData({ ...formData, belt: e.target.value })}
                  options={BELTS}
                  required
                  error={errors.belt}
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "20px" }}>
                <SelectField
                  label="Dan Grade (if applicable)"
                  value={formData.danGrade}
                  onChange={(e) => setFormData({ ...formData, danGrade: e.target.value })}
                  options={["1", "2", "3", "4", "5", "6", "7", "8"]}
                />
                <SelectField
                  label="Speciality"
                  value={formData.speciality}
                  onChange={(e) => setFormData({ ...formData, speciality: e.target.value })}
                  options={SPECIALITIES}
                  required
                  error={errors.speciality}
                />
              </div>
            </div>

            {/* ADDITIONAL INFO */}
            <div style={{ marginBottom: "48px" }}>
              <h2 style={{
                fontFamily: "var(--font-cinzel)",
                fontSize: "24px",
                fontWeight: 700,
                color: "#c9a84c",
                letterSpacing: "2px",
                marginBottom: "24px",
                marginTop: 0,
              }}>
                📝 Additional Information
              </h2>

              <div style={{ marginBottom: "24px" }}>
                <label style={{
                  display: "block",
                  fontFamily: "var(--font-montserrat)",
                  fontSize: "11px",
                  fontWeight: 600,
                  letterSpacing: "2px",
                  color: "#999",
                  textTransform: "uppercase",
                  marginBottom: "8px",
                }}>
                  Bio / Introduction <span style={{ color: "#e74c3c" }}>*</span>
                </label>
                <textarea
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  placeholder="Tell us about yourself, your teaching philosophy, and experience..."
                  rows={4}
                  required
                  style={{
                    width: "100%",
                    padding: "12px 16px",
                    background: "#0d0d0d",
                    border: errors.bio ? "1px solid #e74c3c" : "1px solid #2a2a2a",
                    borderRadius: "6px",
                    color: "#ccc",
                    fontSize: "13px",
                    boxSizing: "border-box",
                    outline: "none",
                    resize: "vertical",
                    fontFamily: "var(--font-montserrat)",
                  }}
                />
                {errors.bio && <span style={{ color: "#e74c3c", fontSize: "11px", marginTop: "4px", display: "block" }}>{errors.bio}</span>}
              </div>

              <div style={{ marginBottom: "24px" }}>
                <label style={{
                  display: "block",
                  fontFamily: "var(--font-montserrat)",
                  fontSize: "11px",
                  fontWeight: 600,
                  letterSpacing: "2px",
                  color: "#999",
                  textTransform: "uppercase",
                  marginBottom: "8px",
                }}>
                  Notable Achievements & Awards
                </label>
                <textarea
                  value={formData.achievements}
                  onChange={(e) => setFormData({ ...formData, achievements: e.target.value })}
                  placeholder="e.g., National Champion 2023, World Silver Medal 1998..."
                  rows={3}
                  style={{
                    width: "100%",
                    padding: "12px 16px",
                    background: "#0d0d0d",
                    border: "1px solid #2a2a2a",
                    borderRadius: "6px",
                    color: "#ccc",
                    fontSize: "13px",
                    boxSizing: "border-box",
                    outline: "none",
                    resize: "vertical",
                    fontFamily: "var(--font-montserrat)",
                  }}
                />
              </div>

              <div style={{ marginBottom: "24px" }}>
                <label style={{
                  display: "block",
                  fontFamily: "var(--font-montserrat)",
                  fontSize: "11px",
                  fontWeight: 600,
                  letterSpacing: "2px",
                  color: "#999",
                  textTransform: "uppercase",
                  marginBottom: "8px",
                }}>
                  Certifications & Qualifications
                </label>
                <textarea
                  value={formData.certifications}
                  onChange={(e) => setFormData({ ...formData, certifications: e.target.value })}
                  placeholder="e.g., ISKA Master Instructor, International Referee License..."
                  rows={3}
                  style={{
                    width: "100%",
                    padding: "12px 16px",
                    background: "#0d0d0d",
                    border: "1px solid #2a2a2a",
                    borderRadius: "6px",
                    color: "#ccc",
                    fontSize: "13px",
                    boxSizing: "border-box",
                    outline: "none",
                    resize: "vertical",
                    fontFamily: "var(--font-montserrat)",
                  }}
                />
              </div>
            </div>

            {/* TERMS & CONDITIONS */}
            <div style={{ marginBottom: "32px", padding: "20px", background: "rgba(201,168,76,0.05)", borderRadius: "6px", border: "1px solid rgba(201,168,76,0.2)" }}>
              <label style={{
                display: "flex",
                alignItems: "flex-start",
                gap: "12px",
                cursor: "pointer",
              }}>
                <input
                  type="checkbox"
                  checked={formData.agreeTerms}
                  onChange={(e) => setFormData({ ...formData, agreeTerms: e.target.checked })}
                  style={{
                    width: "18px",
                    height: "18px",
                    cursor: "pointer",
                    marginTop: "2px",
                    flexShrink: 0,
                  }}
                />
                <span style={{
                  fontFamily: "var(--font-montserrat)",
                  fontSize: "12px",
                  color: "#999",
                  lineHeight: 1.6,
                }}>
                  I agree to the Dadi Bulsara Ashihara Karate teaching standards and code of conduct. I understand that all information provided will be verified.
                  {errors.agreeTerms && <span style={{ color: "#e74c3c", display: "block", marginTop: "4px" }}>{errors.agreeTerms}</span>}
                </span>
              </label>
            </div>

            {/* SUBMIT BUTTON */}
            <button
              type="submit"
              style={{
                width: "100%",
                padding: "16px 32px",
                background: "linear-gradient(135deg, #c9a84c, #8b6914)",
                color: "#fff",
                border: "none",
                borderRadius: "6px",
                fontFamily: "var(--font-montserrat)",
                fontSize: "13px",
                fontWeight: 700,
                letterSpacing: "2px",
                textTransform: "uppercase",
                cursor: "pointer",
                transition: "all 0.3s ease",
                boxShadow: "0 8px 24px rgba(201,168,76,0.3)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-3px)";
                e.currentTarget.style.boxShadow = "0 12px 32px rgba(201,168,76,0.5)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 8px 24px rgba(201,168,76,0.3)";
              }}
            >
              Submit Application
            </button>
          </form>
        </div>
      ) : (
        /* SUCCESS MESSAGE */
        <div style={{
          maxWidth: "600px",
          margin: "60px auto",
          padding: "56px",
          textAlign: "center",
          animationName: "slide-in",
          animationDuration: "0.6s",
          animationFillMode: "both",
        }}>
          <div style={{
            fontSize: "80px",
            marginBottom: "24px",
            animationName: "float",
            animationDuration: "2s",
            animationIterationCount: "infinite",
          }}>
            🎉
          </div>
          <h2 style={{
            fontFamily: "var(--font-cinzel)",
            fontSize: "36px",
            fontWeight: 700,
            color: "#c9a84c",
            letterSpacing: "2px",
            marginBottom: "16px",
            margin: "0 0 16px",
          }}>
            Application Submitted!
          </h2>
          <p style={{
            fontFamily: "var(--font-cormorant)",
            fontSize: "18px",
            color: "#999",
            fontStyle: "italic",
            marginBottom: "24px",
          }}>
            Thank you for applying to join our teaching community. We will review your application and contact you within 5-7 business days.
          </p>
          <div style={{
            padding: "20px",
            background: "rgba(201,168,76,0.1)",
            borderRadius: "6px",
            border: "1px solid rgba(201,168,76,0.3)",
          }}>
            <p style={{
              fontFamily: "var(--font-montserrat)",
              fontSize: "12px",
              color: "#ccc",
              margin: 0,
            }}>
              📧 Confirmation email sent to <strong>{formData.email}</strong>
            </p>
          </div>
        </div>
      )}

      {/* FOOTER */}
      <footer style={{
        padding: "40px 56px",
        background: "#0a0a0a",
        borderTop: "1px solid #1a1a1a",
        textAlign: "center",
        marginTop: "80px",
      }}>
        <p style={{
          fontFamily: "var(--font-montserrat)",
          fontSize: "11px",
          color: "#555",
          letterSpacing: "1px",
          margin: 0,
        }}>
          © 2024 Dadi Bulsara Ashihara Karate. All rights reserved.
        </p>
      </footer>
    </div>
  );
}