import { useState, useRef } from "react";

const initialNotes = [
  { id: 1, title: "note", location: "Sallins (SLS)", date: "8 Mar", priority: "low", done: false },
  { id: 2, title: "sunday 3 wil dasn asjdoi asdasiu asoiudp asdpoaisud aisudp", location: "Naas (NAS)", date: "8 Mar", priority: "high", done: false },
  { id: 3, title: "Test number 4", location: "g", date: "2 Mar", priority: "high", done: false },
  { id: 4, title: "Test sunday", location: "Sallins (SLS)", date: "8 Mar", priority: "medium", done: true },
  { id: 5, title: "test of the note 10", location: "Sliabh A Mhadra (SAW)", date: "3 Mar", priority: "medium", done: true },
];

const PRIORITY_COLOR = { high: "#ef4444", medium: "#f97316", low: "#22c55e" };
const FILTERS = ["All", "High", "Med", "Low", "Done"];

export default function NotesApp() {
  const [notes, setNotes] = useState(initialNotes);
  const [filter, setFilter] = useState("All");
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [selectionMode, setSelectionMode] = useState(false);
  const [expandedId, setExpandedId] = useState(1);
  const [showAddModal, setShowAddModal] = useState(false);
  const longPressTimer = useRef(null);

  const counts = {
    All: notes.filter(n => !n.done).length,
    High: notes.filter(n => !n.done && n.priority === "high").length,
    Med: notes.filter(n => !n.done && n.priority === "medium").length,
    Low: notes.filter(n => !n.done && n.priority === "low").length,
    Done: notes.filter(n => n.done).length,
  };

  const filtered = notes.filter(n => {
    if (filter === "All") return !n.done;
    if (filter === "Done") return n.done;
    if (filter === "High") return !n.done && n.priority === "high";
    if (filter === "Med") return !n.done && n.priority === "medium";
    if (filter === "Low") return !n.done && n.priority === "low";
    return true;
  });

  const openNotes = filter === "Done" ? [] : filtered;
  const doneNotes = notes.filter(n => n.done && (filter === "All" || filter === "Done"));

  const handleLongPressStart = (id) => {
    longPressTimer.current = setTimeout(() => {
      setSelectionMode(true);
      setSelectedIds(new Set([id]));
    }, 500);
  };
  const handleLongPressEnd = () => clearTimeout(longPressTimer.current);

  const toggleSelect = (id) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      if (next.size === 0) setSelectionMode(false);
      return next;
    });
  };

  const exitSelection = () => { setSelectionMode(false); setSelectedIds(new Set()); };
  const markSelectedDone = () => { setNotes(prev => prev.map(n => selectedIds.has(n.id) ? { ...n, done: true } : n)); exitSelection(); };
  const deleteSelected = () => { setNotes(prev => prev.filter(n => !selectedIds.has(n.id))); exitSelection(); };
  const selectAll = () => setSelectedIds(new Set(filtered.map(n => n.id)));
  const markDone = (id) => setNotes(prev => prev.map(n => n.id === id ? { ...n, done: true } : n));
  const deleteNote = (id) => setNotes(prev => prev.filter(n => n.id !== id));

  const filterColor = { All: "#3b82f6", High: "#ef4444", Med: "#f97316", Low: "#22c55e", Done: "#9ca3af" };

  return (
    <div style={{ minHeight: "100vh", background: "#e8edf4", fontFamily: "'DM Sans', sans-serif", display: "flex", flexDirection: "column", alignItems: "center" }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap" rel="stylesheet" />

      <div style={{ width: "100%", maxWidth: 560, padding: "16px 16px 100px", boxSizing: "border-box" }}>

        {/* Filter Pills */}
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 16 }}>
          {FILTERS.map(f => {
            const active = filter === f;
            const color = filterColor[f];
            return (
              <button key={f} onClick={() => setFilter(f)} style={{
                padding: "6px 14px", borderRadius: 999,
                border: `1.5px solid ${active ? color : "#d1d5db"}`,
                background: active ? color : "white",
                color: active ? "white" : color,
                fontFamily: "inherit", fontSize: 13, fontWeight: 600,
                cursor: "pointer", transition: "all 0.15s",
              }}>
                {f} ({counts[f]})
              </button>
            );
          })}
        </div>

        {/* Top bar: Add Note OR Selection Banner */}
        {selectionMode ? (
          <div style={{
            background: "white", borderRadius: 14, padding: "12px 16px", marginBottom: 16,
            display: "flex", alignItems: "center", justifyContent: "space-between",
            boxShadow: "0 1px 4px rgba(0,0,0,0.08)", border: "2px solid #3b82f6",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <span style={{ fontSize: 14, fontWeight: 700, color: "#1e3a5f" }}>{selectedIds.size} selected</span>
              <button onClick={selectAll} style={{ fontSize: 12, color: "#3b82f6", background: "none", border: "none", cursor: "pointer", fontFamily: "inherit", fontWeight: 600, padding: 0 }}>
                Select all
              </button>
            </div>
            <button onClick={exitSelection} style={{ fontSize: 13, color: "#6b7280", background: "none", border: "none", cursor: "pointer", fontFamily: "inherit", fontWeight: 500 }}>
              Cancel
            </button>
          </div>
        ) : (
          <button onClick={() => setShowAddModal(true)} style={{
            width: "100%", padding: "14px", borderRadius: 14,
            border: "1.5px dashed #94a3b8", background: "rgba(255,255,255,0.6)",
            color: "#3b82f6", fontFamily: "inherit", fontSize: 15, fontWeight: 600,
            cursor: "pointer", marginBottom: 16, display: "flex",
            alignItems: "center", justifyContent: "center", gap: 6,
          }}>
            + Add Note
          </button>
        )}

        {/* OPEN */}
        {openNotes.length > 0 && (
          <>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#94a3b8", letterSpacing: "0.08em", marginBottom: 8 }}>OPEN</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 16 }}>
              {openNotes.map(note => (
                <NoteCard key={note.id} note={note}
                  expanded={expandedId === note.id && !selectionMode}
                  selectionMode={selectionMode} selected={selectedIds.has(note.id)}
                  onExpand={() => !selectionMode && setExpandedId(expandedId === note.id ? null : note.id)}
                  onLongPressStart={() => handleLongPressStart(note.id)}
                  onLongPressEnd={handleLongPressEnd}
                  onToggleSelect={() => toggleSelect(note.id)}
                  onMarkDone={() => markDone(note.id)}
                  onDelete={() => deleteNote(note.id)}
                />
              ))}
            </div>
          </>
        )}

        {/* DONE */}
        {doneNotes.length > 0 && (
          <>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#94a3b8", letterSpacing: "0.08em", marginBottom: 8 }}>DONE</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {doneNotes.map(note => (
                <NoteCard key={note.id} note={note} expanded={false} isDone
                  selectionMode={selectionMode} selected={selectedIds.has(note.id)}
                  onExpand={() => {}}
                  onLongPressStart={() => handleLongPressStart(note.id)}
                  onLongPressEnd={handleLongPressEnd}
                  onToggleSelect={() => toggleSelect(note.id)}
                  onMarkDone={() => {}} onDelete={() => deleteNote(note.id)}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Bottom action bar — fixed width, never full-screen-wide */}
      {selectionMode && selectedIds.size > 0 && (
        <div style={{
          position: "fixed", bottom: 0, left: 0, right: 0,
          display: "flex", justifyContent: "center",
          padding: "12px 16px 20px",
          background: "rgba(232,237,244,0.95)", backdropFilter: "blur(8px)",
          borderTop: "1px solid #d1d9e6",
        }}>
          <div style={{ width: "100%", maxWidth: 560, display: "flex", gap: 10 }}>
            <button onClick={markSelectedDone} style={{
              flex: 1, padding: "13px", borderRadius: 12, border: "none",
              background: "#22c55e", color: "white", fontFamily: "inherit",
              fontSize: 14, fontWeight: 600, cursor: "pointer",
            }}>✓ Mark Done</button>
            <button onClick={deleteSelected} style={{
              flex: 1, padding: "13px", borderRadius: 12, border: "none",
              background: "#fef2f2", color: "#ef4444", fontFamily: "inherit",
              fontSize: 14, fontWeight: 600, cursor: "pointer",
            }}>🗑 Delete</button>
          </div>
        </div>
      )}

      {/* Add Note Modal */}
      {showAddModal && (
        <div onClick={() => setShowAddModal(false)} style={{
          position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)",
          display: "flex", alignItems: "flex-end", justifyContent: "center", zIndex: 100,
        }}>
          <div onClick={e => e.stopPropagation()} style={{
            width: "100%", maxWidth: 560, background: "white",
            borderRadius: "20px 20px 0 0", padding: 24,
          }}>
            <div style={{ fontWeight: 700, fontSize: 17, marginBottom: 4, color: "#1e3a5f" }}>New Note</div>
            <div style={{ color: "#94a3b8", fontSize: 14, marginBottom: 20 }}>Note form goes here…</div>
            <button onClick={() => setShowAddModal(false)} style={{
              width: "100%", padding: 13, borderRadius: 12, border: "none",
              background: "#3b82f6", color: "white", fontFamily: "inherit",
              fontSize: 15, fontWeight: 600, cursor: "pointer",
            }}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}

function NoteCard({ note, expanded, selectionMode, selected, onExpand, onLongPressStart, onLongPressEnd, onToggleSelect, onMarkDone, onDelete, isDone }) {
  const dot = isDone ? "#d1d5db" : (PRIORITY_COLOR[note.priority] || "#94a3b8");

  const handleClick = () => selectionMode ? onToggleSelect() : onExpand();

  return (
    <div
      onMouseDown={onLongPressStart} onMouseUp={onLongPressEnd} onMouseLeave={onLongPressEnd}
      onTouchStart={onLongPressStart} onTouchEnd={onLongPressEnd}
      onClick={handleClick}
      style={{
        background: "white", borderRadius: 14, overflow: "hidden", cursor: "pointer",
        userSelect: "none", opacity: isDone ? 0.65 : 1,
        border: selected ? "2px solid #3b82f6" : expanded ? "1.5px solid #bfdbfe" : "1.5px solid transparent",
        boxShadow: expanded ? "0 2px 12px rgba(59,130,246,0.1)" : "0 1px 3px rgba(0,0,0,0.06)",
        transition: "border 0.15s, box-shadow 0.15s",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", padding: "12px 14px", gap: 10 }}>
        {selectionMode && (
          <div style={{
            width: 22, height: 22, borderRadius: 6, flexShrink: 0,
            border: selected ? "none" : "2px solid #d1d5db",
            background: selected ? "#3b82f6" : "white",
            display: "flex", alignItems: "center", justifyContent: "center",
            transition: "all 0.15s",
          }}>
            {selected && <span style={{ color: "white", fontSize: 13, fontWeight: 700 }}>✓</span>}
          </div>
        )}
        <div style={{ width: 9, height: 9, borderRadius: "50%", background: dot, flexShrink: 0 }} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            fontWeight: 600, fontSize: 14, color: isDone ? "#9ca3af" : "#1e3a5f",
            textDecoration: isDone ? "line-through" : "none",
            whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
          }}>{note.title}</div>
          <div style={{ fontSize: 12, color: "#9ca3af", marginTop: 1 }}>{note.location} · {note.date}</div>
        </div>
        {!selectionMode && <span style={{ color: "#cbd5e1", fontSize: 16 }}>{expanded ? "▾" : "›"}</span>}
      </div>

      {expanded && !isDone && (
        <div style={{ padding: "0 14px 14px", borderTop: "1px solid #f1f5f9" }}>
          <div style={{ paddingTop: 12, display: "flex", flexDirection: "column", gap: 12 }}>
            {[["DESCRIPTION", note.title], ["LOCATION", note.location]].map(([label, val]) => (
              <div key={label}>
                <div style={{ fontSize: 10, fontWeight: 700, color: "#94a3b8", letterSpacing: "0.08em", marginBottom: 4 }}>{label}</div>
                <div style={{ padding: "10px 12px", borderRadius: 8, border: "1px solid #e2e8f0", fontSize: 14, color: "#374151" }}>{val}</div>
              </div>
            ))}
            <div>
              <div style={{ fontSize: 10, fontWeight: 700, color: "#94a3b8", letterSpacing: "0.08em", marginBottom: 4 }}>PRIORITY</div>
              <div style={{ display: "flex", gap: 8 }}>
                {["high", "medium", "low"].map(p => (
                  <div key={p} style={{
                    flex: 1, padding: "8px 0", borderRadius: 8, textAlign: "center",
                    border: `1.5px solid ${note.priority === p ? PRIORITY_COLOR[p] : "#e2e8f0"}`,
                    background: note.priority === p ? `${PRIORITY_COLOR[p]}12` : "white",
                    color: note.priority === p ? PRIORITY_COLOR[p] : "#9ca3af",
                    fontSize: 11, fontWeight: 700, textTransform: "uppercase",
                  }}>{p === "medium" ? "MED" : p.toUpperCase()}</div>
                ))}
              </div>
            </div>
            <div style={{ display: "flex", gap: 10, marginTop: 4 }}>
              <button onClick={e => { e.stopPropagation(); onMarkDone(); }} style={{
                flex: 1, padding: "11px", borderRadius: 10, border: "none",
                background: "#f0fdf4", color: "#22c55e", fontFamily: "inherit", fontSize: 13, fontWeight: 600, cursor: "pointer",
              }}>✓ Mark Done</button>
              <button onClick={e => { e.stopPropagation(); onDelete(); }} style={{
                flex: 1, padding: "11px", borderRadius: 10, border: "none",
                background: "#fef2f2", color: "#ef4444", fontFamily: "inherit", fontSize: 13, fontWeight: 600, cursor: "pointer",
              }}>🗑 Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
