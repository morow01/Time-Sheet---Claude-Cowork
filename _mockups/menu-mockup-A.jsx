// MOCKUP A — Bottom Sheet Menu
// Account at top, actions in 2-col grid, danger zone collapsed by default

import { useState } from "react";

const NAV_BG = "#0f1f30";
const ACCENT = "#5856D6";
const CARD = "#ffffff";
const BORDER = "#e2e8f0";
const TEXT = "#1e293b";
const MUTED = "#94a3b8";
const DANGER = "#ef4444";

export default function MenuMockupA() {
  const [open, setOpen] = useState(true);
  const [dangerOpen, setDangerOpen] = useState(false);

  return (
    <div style={{ fontFamily: "'Inter', sans-serif", background: "#e8edf4", minHeight: "100vh", display: "flex", flexDirection: "column" }}>

      {/* App Header (for context) */}
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
        <div
          onClick={() => setOpen(false)}
          style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", zIndex: 40, backdropFilter: "blur(2px)" }}
        />
      )}

      {/* Bottom Sheet */}
      <div style={{
        position: "fixed", left: 0, right: 0, bottom: 0, zIndex: 50,
        background: CARD,
        borderRadius: "20px 20px 0 0",
        boxShadow: "0 -8px 40px rgba(0,0,0,0.18)",
        transform: open ? "translateY(0)" : "translateY(110%)",
        transition: "transform 0.32s cubic-bezier(0.34, 1.1, 0.64, 1)",
        paddingBottom: "env(safe-area-inset-bottom, 16px)",
        maxWidth: 480,
        margin: "0 auto",
      }}>

        {/* Drag handle */}
        <div style={{ display: "flex", justifyContent: "center", paddingTop: 10, paddingBottom: 4 }}>
          <div style={{ width: 36, height: 4, borderRadius: 2, background: "#cbd5e1" }} />
        </div>

        {/* ── ACCOUNT SECTION ── */}
        <div style={{ margin: "8px 16px 0", padding: "14px 16px", background: "#f8fafc", borderRadius: 14, border: `1px solid ${BORDER}` }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 42, height: 42, borderRadius: "50%", background: `linear-gradient(135deg, ${ACCENT}, #a78bfa)`, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 700, fontSize: 16, flexShrink: 0 }}>
              R
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: 700, fontSize: 14, color: TEXT, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>Rob Morrow</div>
              <div style={{ fontSize: 12, color: MUTED, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>morow01@gmail.com</div>
            </div>
            <button style={{ padding: "6px 14px", borderRadius: 8, border: "1.5px solid rgba(239,68,68,0.3)", background: "rgba(239,68,68,0.06)", color: DANGER, fontSize: 12, fontWeight: 700, cursor: "pointer", whiteSpace: "nowrap" }}>
              Sign Out
            </button>
          </div>
        </div>

        {/* ── QUICK ACTIONS GRID ── */}
        <div style={{ padding: "14px 16px 0" }}>
          <div style={{ fontSize: 10, fontWeight: 800, color: MUTED, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 10 }}>Quick Actions</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            {[
              { icon: "📅", label: "Jump to Week", sub: "Go to any date" },
              { icon: "✉️", label: "Email / Export", sub: "Send weekly summary" },
            ].map(item => (
              <button key={item.label} style={{ padding: "14px 12px", borderRadius: 12, border: `1px solid ${BORDER}`, background: "#f8fafc", cursor: "pointer", textAlign: "left", display: "flex", flexDirection: "column", gap: 6 }}>
                <span style={{ fontSize: 22 }}>{item.icon}</span>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: TEXT }}>{item.label}</div>
                  <div style={{ fontSize: 11, color: MUTED }}>{item.sub}</div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* ── DANGER ZONE (collapsible) ── */}
        <div style={{ margin: "14px 16px 0" }}>
          <button
            onClick={() => setDangerOpen(d => !d)}
            style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 14px", borderRadius: 10, border: `1px solid rgba(239,68,68,0.2)`, background: "rgba(239,68,68,0.04)", cursor: "pointer" }}
          >
            <span style={{ fontSize: 12, fontWeight: 700, color: DANGER }}>⚠️ Danger Zone</span>
            <span style={{ fontSize: 11, color: DANGER, transform: dangerOpen ? "rotate(180deg)" : "none", transition: "transform 0.2s", display: "inline-block" }}>▾</span>
          </button>

          {dangerOpen && (
            <div style={{ marginTop: 6, borderRadius: 10, border: `1px solid rgba(239,68,68,0.15)`, overflow: "hidden" }}>
              {["Clear This Week", "Clear All My Data", "Delete Account"].map((label, i) => (
                <button key={label} style={{ width: "100%", display: "flex", alignItems: "center", gap: 10, padding: "12px 14px", border: "none", borderTop: i > 0 ? `1px solid rgba(239,68,68,0.1)` : "none", background: "rgba(239,68,68,0.03)", cursor: "pointer", color: DANGER, fontSize: 13, fontWeight: 600 }}>
                  🗑 {label}
                </button>
              ))}
            </div>
          )}
        </div>

        <div style={{ height: 20 }} />
      </div>

      {/* Label */}
      <div style={{ position: "fixed", top: 70, left: 0, right: 0, textAlign: "center", pointerEvents: "none" }}>
        <span style={{ background: ACCENT, color: "#fff", fontSize: 11, fontWeight: 700, padding: "4px 12px", borderRadius: 99 }}>OPTION A — Bottom Sheet</span>
      </div>

      {!open && (
        <div style={{ display: "flex", justifyContent: "center", marginTop: 60 }}>
          <button onClick={() => setOpen(true)} style={{ background: ACCENT, color: "#fff", border: "none", borderRadius: 10, padding: "10px 20px", fontWeight: 700, cursor: "pointer" }}>Open Menu</button>
        </div>
      )}
    </div>
  );
}
