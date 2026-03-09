import { useState } from "react";

const menuItems = {
  navigation: [
    {
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>
        </svg>
      ),
      label: "Jump to Week",
      sub: "Navigate to any date",
    },
    {
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>
        </svg>
      ),
      label: "Email / Export Week",
      sub: "Send formatted summary",
    },
    {
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="18" height="18" rx="2"/>
          <line x1="3" y1="9" x2="21" y2="9"/><line x1="3" y1="15" x2="21" y2="15"/>
          <line x1="9" y1="3" x2="9" y2="21"/><line x1="15" y1="3" x2="15" y2="21"/>
        </svg>
      ),
      label: "Spreadsheet View",
      sub: "Desktop only",
    },
    {
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
        </svg>
      ),
      label: "Preferences",
      sub: "Theme & display options",
    },
  ],
  danger: [
    {
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4h6v2"/>
        </svg>
      ),
      label: "Clear This Week",
    },
    {
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4h6v2"/>
        </svg>
      ),
      label: "Clear All My Data",
    },
    {
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
          <line x1="17" y1="11" x2="23" y2="17"/><line x1="23" y1="11" x2="17" y2="17"/>
        </svg>
      ),
      label: "Delete Account",
    },
  ],
};

const Chevron = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 18 15 12 9 6"/>
  </svg>
);

export default function MenuMockupD() {
  const [open, setOpen] = useState(true);

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", background: "#E8EEF5", minHeight: "100vh", display: "flex", alignItems: "stretch", position: "relative" }}>

      {/* Main app content (behind) */}
      <div style={{ flex: 1, padding: 24, opacity: open ? 0.4 : 1, transition: "opacity 0.3s" }}>
        <div style={{ background: "#0F1C2E", borderRadius: 12, padding: "14px 18px", color: "#fff", marginBottom: 16 }}>
          <div style={{ fontSize: 13, opacity: 0.6 }}>Week of</div>
          <div style={{ fontSize: 18, fontWeight: 700 }}>10 – 14 Mar 2026</div>
        </div>
        <div style={{ background: "#fff", borderRadius: 12, padding: 16, marginBottom: 10 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: "#0F1C2E", marginBottom: 8 }}>Monday</div>
          <div style={{ height: 8, background: "#E8EEF5", borderRadius: 4, marginBottom: 6 }}/>
          <div style={{ height: 8, background: "#E8EEF5", borderRadius: 4, width: "70%" }}/>
        </div>
        <div style={{ background: "#fff", borderRadius: 12, padding: 16 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: "#0F1C2E", marginBottom: 8 }}>Tuesday</div>
          <div style={{ height: 8, background: "#E8EEF5", borderRadius: 4, marginBottom: 6 }}/>
          <div style={{ height: 8, background: "#E8EEF5", borderRadius: 4, width: "55%" }}/>
        </div>

        {/* Toggle button for demo */}
        <button
          onClick={() => setOpen(o => !o)}
          style={{ marginTop: 20, padding: "10px 20px", background: "#0F1C2E", color: "#fff", border: "none", borderRadius: 8, cursor: "pointer", fontSize: 13, fontWeight: 600 }}
        >
          {open ? "Close Menu" : "Open Menu ☰"}
        </button>
      </div>

      {/* Backdrop */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.25)", zIndex: 40, transition: "background 0.3s" }}
        />
      )}

      {/* Slide-in panel from right */}
      <div style={{
        position: "fixed",
        top: 0,
        right: 0,
        bottom: 0,
        width: "82%",
        maxWidth: 340,
        background: "#F4F7FA",
        zIndex: 50,
        display: "flex",
        flexDirection: "column",
        overflowY: "auto",
        transform: open ? "translateX(0)" : "translateX(100%)",
        transition: "transform 0.28s cubic-bezier(0.4,0,0.2,1)",
        boxShadow: open ? "-8px 0 32px rgba(0,0,0,0.18)" : "none",
      }}>

        {/* ── Dark header block ── */}
        <div style={{ background: "#0F1C2E", padding: "44px 20px 24px", display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 14 }}>
          {/* Close btn */}
          <button
            onClick={() => setOpen(false)}
            style={{ position: "absolute", top: 16, right: 16, background: "rgba(255,255,255,0.1)", border: "none", borderRadius: 8, width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#fff" }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>

          {/* Avatar + name */}
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ width: 52, height: 52, borderRadius: "50%", background: "linear-gradient(135deg, #2D6BE4, #7c73e6)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, fontWeight: 700, color: "#fff", flexShrink: 0 }}>
              MX
            </div>
            <div>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", marginBottom: 2 }}>Signed in as</div>
              <div style={{ fontSize: 17, fontWeight: 700, color: "#fff" }}>Morow X</div>
            </div>
          </div>

          {/* Sign Out */}
          <button style={{ width: "100%", padding: "11px 16px", borderRadius: 10, border: "1.5px solid rgba(239,68,68,0.4)", background: "rgba(239,68,68,0.08)", color: "#ff6b6b", fontSize: 13, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, fontFamily: "inherit" }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
            Sign Out
          </button>
        </div>

        {/* ── Navigation section ── */}
        <div style={{ padding: "18px 0 4px" }}>
          <div style={{ padding: "0 18px 8px", fontSize: 10, fontWeight: 800, letterSpacing: "0.09em", textTransform: "uppercase", color: "#8BA5BE" }}>
            Navigation
          </div>

          <div style={{ background: "#fff", borderRadius: 12, margin: "0 12px", overflow: "hidden", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
            {menuItems.navigation.map((item, i) => (
              <button key={i} style={{
                display: "flex", alignItems: "center", gap: 14,
                width: "100%", padding: "13px 16px",
                border: "none", background: "none", cursor: "pointer",
                borderBottom: i < menuItems.navigation.length - 1 ? "1px solid #EDF1F7" : "none",
                textAlign: "left", fontFamily: "inherit",
              }}>
                <span style={{ color: "#4A6580", flexShrink: 0, display: "flex" }}>{item.icon}</span>
                <span style={{ flex: 1 }}>
                  <span style={{ display: "block", fontSize: 14, fontWeight: 500, color: "#0F1C2E" }}>{item.label}</span>
                  {item.sub && <span style={{ display: "block", fontSize: 11, color: "#8BA5BE", marginTop: 1 }}>{item.sub}</span>}
                </span>
                <span style={{ color: "#C4D0DC", flexShrink: 0 }}><Chevron /></span>
              </button>
            ))}
          </div>
        </div>

        {/* ── Data Management section ── */}
        <div style={{ padding: "18px 0 4px" }}>
          <div style={{ padding: "0 18px 8px", fontSize: 10, fontWeight: 800, letterSpacing: "0.09em", textTransform: "uppercase", color: "rgba(239,68,68,0.6)" }}>
            Data Management
          </div>

          <div style={{ background: "#fff", borderRadius: 12, margin: "0 12px", overflow: "hidden", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
            {menuItems.danger.map((item, i) => (
              <button key={i} style={{
                display: "flex", alignItems: "center", gap: 14,
                width: "100%", padding: "13px 16px",
                border: "none", background: "none", cursor: "pointer",
                borderBottom: i < menuItems.danger.length - 1 ? "1px solid #FEF0F0" : "none",
                textAlign: "left", fontFamily: "inherit",
              }}>
                <span style={{ color: "#ef4444", flexShrink: 0, display: "flex" }}>{item.icon}</span>
                <span style={{ flex: 1, fontSize: 14, fontWeight: 500, color: "#ef4444" }}>{item.label}</span>
                <span style={{ color: "rgba(239,68,68,0.3)", flexShrink: 0 }}><Chevron /></span>
              </button>
            ))}
          </div>
        </div>

        {/* Version */}
        <div style={{ marginTop: "auto", padding: "24px 0 32px", textAlign: "center", fontSize: 11, color: "#8BA5BE" }}>
          TimeSheet v3.6.73
        </div>
      </div>
    </div>
  );
}
