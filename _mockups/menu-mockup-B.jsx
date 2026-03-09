// MOCKUP B — Full-width Bottom Sheet with sections & large tap targets
// Account card at top, icon-row shortcuts, list actions, danger items at bottom

import { useState } from "react";

const NAV_BG = "#0f1f30";
const ACCENT = "#5856D6";
const CARD = "#ffffff";
const BORDER = "#e2e8f0";
const TEXT = "#1e293b";
const MUTED = "#94a3b8";
const DANGER = "#ef4444";

function Row({ icon, label, sub, danger, rightEl, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        width: "100%", display: "flex", alignItems: "center", gap: 14,
        padding: "13px 16px", border: "none", background: "none",
        cursor: "pointer", textAlign: "left",
        borderBottom: `1px solid ${BORDER}`,
        color: danger ? DANGER : TEXT,
      }}
    >
      <div style={{
        width: 36, height: 36, borderRadius: 9, flexShrink: 0,
        background: danger ? "rgba(239,68,68,0.08)" : "rgba(88,86,214,0.08)",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 17,
      }}>
        {icon}
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 14, fontWeight: 600, lineHeight: 1.3 }}>{label}</div>
        {sub && <div style={{ fontSize: 11, color: MUTED, marginTop: 1 }}>{sub}</div>}
      </div>
      {rightEl || <span style={{ color: MUTED, fontSize: 16 }}>›</span>}
    </button>
  );
}

export default function MenuMockupB() {
  const [open, setOpen] = useState(true);

  return (
    <div style={{ fontFamily: "'Inter', sans-serif", background: "#e8edf4", minHeight: "100vh" }}>

      {/* App Header */}
      <div style={{ background: NAV_BG, color: "#fff", padding: "12px 16px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ width: 32, height: 32, borderRadius: 8, background: "rgba(255,255,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <span style={{ color: "rgba(255,255,255,0.55)", fontSize: 10 }}>◀</span>
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

      {/* Overlay */}
      {open && (
        <div onClick={() => setOpen(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", zIndex: 40, backdropFilter: "blur(2px)" }} />
      )}

      {/* Bottom Sheet */}
      <div style={{
        position: "fixed", left: 0, right: 0, bottom: 0, zIndex: 50,
        background: CARD,
        borderRadius: "22px 22px 0 0",
        boxShadow: "0 -8px 40px rgba(0,0,0,0.18)",
        transform: open ? "translateY(0)" : "translateY(110%)",
        transition: "transform 0.3s cubic-bezier(0.34, 1.1, 0.64, 1)",
        paddingBottom: "env(safe-area-inset-bottom, 16px)",
        maxWidth: 480,
        margin: "0 auto",
        overflowY: "auto",
        maxHeight: "88vh",
      }}>

        {/* Drag handle */}
        <div style={{ display: "flex", justifyContent: "center", paddingTop: 10, paddingBottom: 2 }}>
          <div style={{ width: 36, height: 4, borderRadius: 2, background: "#cbd5e1" }} />
        </div>

        {/* ── ACCOUNT SECTION ── */}
        <div style={{ padding: "12px 16px 14px", borderBottom: `1px solid ${BORDER}` }}>
          <div style={{ fontSize: 10, fontWeight: 800, color: MUTED, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 10 }}>Account</div>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
            <div style={{ width: 44, height: 44, borderRadius: "50%", background: `linear-gradient(135deg, ${ACCENT}, #a78bfa)`, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 700, fontSize: 18, flexShrink: 0 }}>
              R
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: 700, fontSize: 15, color: TEXT }}>Rob Morrow</div>
              <div style={{ fontSize: 12, color: MUTED, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>morow01@gmail.com</div>
            </div>
          </div>
          <button style={{
            width: "100%", padding: "11px", borderRadius: 10,
            border: "1.5px solid rgba(239,68,68,0.25)",
            background: "rgba(239,68,68,0.05)",
            color: DANGER, fontSize: 13, fontWeight: 700, cursor: "pointer",
          }}>
            Sign Out
          </button>
        </div>

        {/* ── ACTIONS ── */}
        <div>
          <div style={{ padding: "12px 16px 6px", fontSize: 10, fontWeight: 800, color: MUTED, textTransform: "uppercase", letterSpacing: "0.08em" }}>Actions</div>
          <Row icon="📅" label="Jump to Week" sub="Navigate to any date" />
          <Row icon="✉️" label="Email / Export Week" sub="Send formatted summary" />
          <Row icon="🖥" label="Spreadsheet View" sub="Desktop table layout" />
        </div>

        {/* ── DANGER ZONE ── */}
        <div>
          <div style={{ padding: "14px 16px 6px", fontSize: 10, fontWeight: 800, color: "#ef4444", textTransform: "uppercase", letterSpacing: "0.08em" }}>Danger Zone</div>
          <Row icon="🗑" label="Clear This Week" danger />
          <Row icon="🗑" label="Clear All My Data" danger />
          <Row icon="👤" label="Delete Account" sub="Permanently removes all data" danger rightEl={null} />
        </div>

        <div style={{ height: 8 }} />
      </div>

      {/* Label */}
      <div style={{ position: "fixed", top: 70, left: 0, right: 0, textAlign: "center", pointerEvents: "none" }}>
        <span style={{ background: "#0f766e", color: "#fff", fontSize: 11, fontWeight: 700, padding: "4px 12px", borderRadius: 99 }}>OPTION B — Sectioned List Sheet</span>
      </div>

      {!open && (
        <div style={{ display: "flex", justifyContent: "center", marginTop: 60 }}>
          <button onClick={() => setOpen(true)} style={{ background: ACCENT, color: "#fff", border: "none", borderRadius: 10, padding: "10px 20px", fontWeight: 700, cursor: "pointer" }}>Open Menu</button>
        </div>
      )}
    </div>
  );
}
