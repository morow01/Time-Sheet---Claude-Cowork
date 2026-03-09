// MOCKUP C (revised) — Gemini-style full-screen account menu
// - Google avatar photo pulled from Firebase Auth (photoURL)
// - Sign Out moved to account section at top
// - Flat SVG icons matching the existing app icons

import { useState } from "react";

const NAV_BG = "#0f1f30";
const ACCENT = "#5856D6";
const TEXT = "#ffffff";
const MUTED = "rgba(255,255,255,0.45)";
const DIVIDER = "rgba(255,255,255,0.08)";
const ROW_HOVER = "rgba(255,255,255,0.06)";
const DANGER = "#ef4444";

// Simulated Firebase currentUser (in real app: state.currentUser)
const mockUser = {
  displayName: "Rob Morrow",
  email: "morow01@gmail.com",
  photoURL: "https://lh3.googleusercontent.com/a/default-user=s96-c", // real: currentUser.photoURL
};

// ── Flat SVG icons (same as in the app) ──────────────────────────
const Icons = {
  calendar: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>
    </svg>
  ),
  email: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
      <polyline points="22,6 12,13 2,6"/>
    </svg>
  ),
  trash: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3 6 5 6 21 6"/>
      <path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/>
      <path d="M9 6V4h6v2"/>
    </svg>
  ),
  userX: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
      <circle cx="12" cy="7" r="4"/>
      <line x1="17" y1="11" x2="23" y2="17"/><line x1="23" y1="11" x2="17" y2="17"/>
    </svg>
  ),
  signOut: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
      <polyline points="16 17 21 12 16 7"/>
      <line x1="21" y1="12" x2="9" y2="12"/>
    </svg>
  ),
  close: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
    </svg>
  ),
};

function Avatar({ user, size = 72 }) {
  const [imgError, setImgError] = useState(false);
  const initials = (user.displayName || user.email || "?")[0].toUpperCase();

  if (user.photoURL && !imgError) {
    return (
      <img
        src={user.photoURL}
        alt={user.displayName}
        onError={() => setImgError(true)}
        style={{
          width: size, height: size, borderRadius: "50%",
          objectFit: "cover",
          boxShadow: `0 0 0 3px rgba(88,86,214,0.4)`,
        }}
      />
    );
  }
  return (
    <div style={{
      width: size, height: size, borderRadius: "50%",
      background: `linear-gradient(135deg, ${ACCENT} 0%, #a78bfa 100%)`,
      display: "flex", alignItems: "center", justifyContent: "center",
      color: "#fff", fontWeight: 700, fontSize: size * 0.42,
      boxShadow: `0 0 0 3px rgba(88,86,214,0.4)`,
    }}>
      {initials}
    </div>
  );
}

function Row({ icon, label, sub, danger, onClick }) {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        width: "100%", display: "flex", alignItems: "center", gap: 16,
        padding: "14px 20px", border: "none", cursor: "pointer",
        background: hovered ? ROW_HOVER : "transparent",
        borderBottom: `1px solid ${DIVIDER}`,
        color: danger ? DANGER : TEXT,
        transition: "background 0.15s",
        fontFamily: "inherit",
      }}
    >
      <span style={{ opacity: danger ? 0.9 : 0.65, flexShrink: 0 }}>{icon}</span>
      <div style={{ flex: 1, textAlign: "left" }}>
        <div style={{ fontSize: 15, fontWeight: 500 }}>{label}</div>
        {sub && <div style={{ fontSize: 12, color: danger ? "rgba(239,68,68,0.55)" : MUTED, marginTop: 2 }}>{sub}</div>}
      </div>
    </button>
  );
}

export default function MenuMockupC() {
  const [open, setOpen] = useState(true);

  return (
    <div style={{ fontFamily: "'Inter', sans-serif", background: "#e8edf4", minHeight: "100vh" }}>

      {/* App Header (context) */}
      <div style={{ background: NAV_BG, color: "#fff", padding: "12px 16px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ width: 32, height: 32, borderRadius: 8, background: "rgba(255,255,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <svg width="6" height="8" viewBox="0 0 6 8"><polygon points="6,0 0,4 6,8" fill="rgba(255,255,255,0.55)"/></svg>
        </div>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontWeight: 700, fontSize: 15 }}>6 Mar – 12 Mar</div>
          <div style={{ fontSize: 11, color: "rgba(255,255,255,0.5)" }}>✓ Synced v3.6.71</div>
        </div>
        <button onClick={() => setOpen(true)} style={{ width: 32, height: 32, borderRadius: 8, background: "rgba(255,255,255,0.1)", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 4 }}>
          <span style={{ display: "block", width: 16, height: 2, background: "rgba(255,255,255,0.8)", borderRadius: 2 }} />
          <span style={{ display: "block", width: 16, height: 2, background: "rgba(255,255,255,0.8)", borderRadius: 2 }} />
          <span style={{ display: "block", width: 16, height: 2, background: "rgba(255,255,255,0.8)", borderRadius: 2 }} />
        </button>
      </div>

      {/* Full-screen menu */}
      {open && (
        <div style={{
          position: "fixed", inset: 0, zIndex: 50,
          background: "#0f1f30",
          display: "flex", flexDirection: "column",
          overflowY: "auto",
          animation: "slideIn 0.22s cubic-bezier(0.4,0,0.2,1)",
        }}>
          <style>{`
            @keyframes slideIn {
              from { opacity: 0; transform: translateX(20px); }
              to   { opacity: 1; transform: translateX(0); }
            }
          `}</style>

          {/* ── TOP BAR: email + close ── */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 20px 0" }}>
            <span style={{ fontSize: 13, color: MUTED }}>{mockUser.email}</span>
            <button onClick={() => setOpen(false)} style={{ background: "none", border: "none", color: TEXT, cursor: "pointer", padding: 4, borderRadius: 8, opacity: 0.6 }}>
              {Icons.close}
            </button>
          </div>

          {/* ── ACCOUNT SECTION ── */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "24px 20px 20px" }}>
            <Avatar user={mockUser} size={72} />
            <div style={{ fontSize: 22, fontWeight: 700, color: TEXT, marginTop: 14, marginBottom: 20 }}>
              Hi, {mockUser.displayName?.split(" ")[0]}!
            </div>

            {/* Sign Out — lives here, next to the account context */}
            <button style={{
              display: "flex", alignItems: "center", gap: 8,
              padding: "10px 24px", borderRadius: 10,
              border: "1.5px solid rgba(255,255,255,0.15)",
              background: "rgba(255,255,255,0.06)",
              color: "rgba(255,255,255,0.75)", fontSize: 13, fontWeight: 600,
              cursor: "pointer", fontFamily: "inherit",
            }}>
              <span style={{ opacity: 0.7 }}>{Icons.signOut}</span>
              Sign Out
            </button>
          </div>

          {/* Divider */}
          <div style={{ height: 1, background: DIVIDER }} />

          {/* ── ACTIONS ── */}
          <Row icon={Icons.calendar} label="Jump to Week"        sub="Navigate to any date" />
          <Row icon={Icons.email}    label="Email / Export Week" sub="Send formatted weekly summary" />

          {/* Divider */}
          <div style={{ height: 1, background: DIVIDER, margin: "8px 0" }} />

          {/* ── DANGER ZONE ── */}
          <div style={{ padding: "8px 20px 4px", fontSize: 11, fontWeight: 700, color: "rgba(239,68,68,0.5)", textTransform: "uppercase", letterSpacing: "0.08em" }}>
            Danger Zone
          </div>
          <Row icon={Icons.trash}  label="Clear This Week"   danger />
          <Row icon={Icons.trash}  label="Clear All My Data" danger />
          <Row icon={Icons.userX}  label="Delete Account"    sub="Permanently removes all your data" danger />

          <div style={{ flex: 1 }} />

          {/* Version */}
          <div style={{ textAlign: "center", padding: "16px 0 28px", fontSize: 11, color: MUTED }}>
            TimeSheet v3.6.71
          </div>
        </div>
      )}

      {!open && (
        <div style={{ display: "flex", justifyContent: "center", marginTop: 60 }}>
          <button onClick={() => setOpen(true)} style={{ background: ACCENT, color: "#fff", border: "none", borderRadius: 10, padding: "10px 20px", fontWeight: 700, cursor: "pointer" }}>
            Open Menu
          </button>
        </div>
      )}
    </div>
  );
}
