// Mockup B — Full sticky navbar with section links
// Taller bar, logo left, nav links centre, Launch App right
// Version shown under the app name

export default function NavbarMockupB() {
  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", background: "#E8EEF5", minHeight: "100vh" }}>

      {/* ── STICKY NAV ── */}
      <div style={{
        position: "sticky", top: 0, zIndex: 100,
        background: "#0F1C2E",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        padding: "0 28px",
        display: "flex", alignItems: "center",
        height: 62,
        gap: 24,
      }}>

        {/* Logo + version stacked */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
          <div style={{
            width: 32, height: 32, borderRadius: 8,
            background: "linear-gradient(135deg, #2D6BE4, #7c73e6)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 14, fontWeight: 800, color: "#fff",
          }}>F</div>
          <div>
            <div style={{ fontWeight: 800, fontSize: 15, color: "#fff", lineHeight: 1.2 }}>FieldLog</div>
            <div style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", lineHeight: 1.2 }}>v3.6.75</div>
          </div>
        </div>

        {/* Section nav links — centre */}
        <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 4 }}>
          {[
            { label: "Timesheet", active: true },
            { label: "Notes", active: false },
            { label: "Finder", active: false },
          ].map(({ label, active }) => (
            <a key={label} style={{
              padding: "6px 14px", borderRadius: 8,
              fontSize: 13, fontWeight: 600,
              color: active ? "#fff" : "rgba(255,255,255,0.45)",
              background: active ? "rgba(45,107,228,0.2)" : "transparent",
              textDecoration: "none",
              cursor: "pointer",
              transition: "all 0.15s",
              whiteSpace: "nowrap",
            }}>{label}</a>
          ))}
        </div>

        {/* Launch App button — prominent */}
        <a style={{
          display: "flex", alignItems: "center", gap: 7,
          background: "#2D6BE4",
          color: "#fff",
          padding: "9px 20px", borderRadius: 10,
          fontSize: 13, fontWeight: 700,
          textDecoration: "none",
          boxShadow: "0 3px 12px rgba(45,107,228,0.45)",
          cursor: "pointer",
          flexShrink: 0,
          whiteSpace: "nowrap",
        }}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>
          Launch App
        </a>
      </div>

      {/* ── PAGE CONTENT (simulated) ── */}
      <div style={{
        background: "#0F1C2E",
        textAlign: "center",
        padding: "64px 24px",
        color: "#fff",
      }}>
        <div style={{ fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255,255,255,0.4)", marginBottom: 16 }}>Mobile First · Field Ready</div>
        <div style={{ fontSize: 38, fontWeight: 800, lineHeight: 1.15, marginBottom: 14 }}>
          Everything you need<br/><span style={{ color: "#7EB3FF" }}>on the job site</span>
        </div>
        <p style={{ fontSize: 16, color: "rgba(255,255,255,0.55)", maxWidth: 480, margin: "0 auto 32px" }}>
          FieldLog keeps your timesheets, field notes, and site finder in one fast, cloud-synced app.
        </p>
      </div>

      {/* Simulated sections */}
      {[
        { num: "01", label: "Timesheet", title: "Track every hour, every day" },
        { num: "02", label: "Notes", title: "Field notes that actually keep up" },
        { num: "03", label: "Finder", title: "Find any site, exchange or cabinet" },
      ].map(({ num, label, title }, i) => (
        <div key={label} style={{
          padding: "52px 32px",
          background: i % 2 === 0 ? "#E8EEF5" : "#fff",
        }}>
          <div style={{ maxWidth: 800, margin: "0 auto" }}>
            <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase", color: "#2D6BE4", marginBottom: 8 }}>{num} — {label}</div>
            <div style={{ fontSize: 26, fontWeight: 800, marginBottom: 10 }}>{title}</div>
            <div style={{ fontSize: 14, color: "#4A6580", height: 12, background: "#D4E0EC", borderRadius: 6, width: "70%" }}/>
          </div>
        </div>
      ))}

      {/* Footer */}
      <div style={{ background: "#0F1C2E", padding: "36px 24px", textAlign: "center" }}>
        <div style={{ fontSize: 14, color: "rgba(255,255,255,0.4)", marginBottom: 20 }}>
          <strong style={{ color: "#fff" }}>FieldLog</strong> · Data cached locally · Syncs to cloud · Mobile first
        </div>
        <a style={{
          display: "inline-flex", alignItems: "center", gap: 7,
          background: "#2D6BE4", color: "#fff",
          padding: "10px 22px", borderRadius: 10,
          fontSize: 13, fontWeight: 700,
          textDecoration: "none",
          boxShadow: "0 3px 12px rgba(45,107,228,0.4)",
        }}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>
          Launch App
        </a>
      </div>

    </div>
  );
}
