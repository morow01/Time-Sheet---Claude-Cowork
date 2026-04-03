# Rian — Project Context for Claude Code

## What is Rian
A Progressive Web App for field technicians — timesheets, notes (TipTap rich text), site finder, routines, callouts/on-call scheduling, and AI assistant. Single-file architecture (`app.html`, ~26,000 lines) with Firestore sync, IndexedDB offline cache, and Google Apps Script backend.

## Key Files
- `app.html` — the entire app (HTML + CSS + JS, inline). This is the only file you'll edit 99% of the time.
- `index.html` — production landing page
- `Code.gs` — Google Apps Script backend
- `manifest.json` — PWA manifest
- `functions/` — Firebase Cloud Functions (reminders)
- `.git/hooks/pre-commit` — integrity check for 31 critical element IDs (blocks commit if any are missing)

## Version
`const VERSION = 'x.y.z'` in `app.html` (~line 10930). Bump on every change. Only location that needs updating (index.html version references are static).

## Git
- Remote: `https://github.com/morow01/rian.git`, branch: `main`
- Commit style: `vX.Y.Z — Short description of what changed`
- Pre-commit hook checks 31 critical HTML element IDs exist. If commit is blocked, an element was accidentally deleted — fix before committing.

## Architecture Decisions

### Firestore Sync & Data Protection (v4.35.39–4.35.40)
The app syncs week data, notes, callouts, and reminders with Firestore in real-time via `onSnapshot` listeners. Several data protection mechanisms are in place:

**Hours High-Water-Mark (HWM):** Tracks the max total hours ever seen per week in localStorage (`rian_hwm_{weekStart}`). If incoming Firestore data has >4h fewer than the HWM, it's rejected and local data is pushed back. This prevents stale data from another device silently overwriting a week. When the user explicitly saves (scheduleAutoSave), the HWM is SET (can go lower) so deliberate deletions work. When remote data arrives, the HWM is only RAISED.

**Callouts HWM:** Same pattern — tracks max callout entry count (`rian_co_hwm`). Threshold is 2 entries.

**Week Navigation Race Guard:** `_loadWeekInProgress` flag prevents overlapping async `loadWeek()` calls from corrupting state when clicking prev/next rapidly.

**Notes Merge:** Per-note merge using `updatedAt` timestamps. Local-only notes preserved for 2 minutes (not synced yet). Empty remote never overwrites non-empty local.

**Reminders Merge:** Per-reminder merge (keeps newer version). Local-only reminders preserved.

**Snapshots:** Auto-snapshots taken on every save to `users/{uid}/weeks/{weekStart}/snapshots/`. Include notes, callouts, and reminders as `_callouts`, `_notes`, `_reminders` fields. User can restore from ☰ → Cloud Backups.

### Template Literal Gotcha
The `renderCardView()` function builds HTML inside a template literal. You CANNOT nest template literals inside it — use plain string concatenation with `function(){}` expressions instead of arrow functions with backticks. This caused a blank-page bug before (v4.35.32).

### Callouts in Weekly Summary
Callouts are rendered inside the expandable `sum-table-wrap` div in `renderCardView()`. The code uses `state.callouts?.weeks?.[state.weekData.weekStart]?.callouts` to look up entries. CSS classes: `.co-sum-*` prefix.

### Email/Export
`buildEmailHtml(weekData)` and `buildPreviewHtml(weekData)` generate fixed-palette HTML. The `email-preview-modal` is static HTML in the body (not dynamically generated). `showEmailPreview()` / `closeEmailPreview()` control it.

## Key Functions
- `loadWeek(weekStart)` — loads week data from IndexedDB + subscribes to Firestore
- `scheduleAutoSave()` — debounced save (1s) to IndexedDB + Firestore
- `renderCardView()` — renders the mobile card view with weekly summary
- `calcSummary(weekData)` — computes hours by work code
- `loadCallouts()` / `saveCallouts()` — callouts Firestore sync
- `loadNotes()` / `scheduleNotesSave()` — notes Firestore sync with per-note merge
- `maybeTakeAutoSnapshot()` — auto-backup on save
- `buildEmailHtml()` / `buildPreviewHtml()` — email export HTML builders

## State
`state` object holds everything: `weekStart`, `weekData`, `notes`, `callouts`, `view`, `currentUser`, etc. Views: `'week'` (timesheet), `'notes'`, `'exchanges'` (finder), `'callouts'`, `'routines'`, `'ai'`.

## CSS Variables
`--accent: #2D6BE4`, `--bg-card`, `--bg-card-alt`, `--border`, `--text-primary`, `--text-secondary`, `--text-muted`, `--font-mono` (DM Mono).

## About Rob (the developer)
- Field technician who built Rian for his own use
- Prefers concise responses, no fluff
- Expects familiarity with the project — don't ask obvious questions
- Uses Windows, deploys via GitHub
- Currently uses OneNote for field notes (site visits with voltage readings, ticket tables, photos) — long-term goal is to replace OneNote with Rian's TipTap-based notes
- Wants a native Android app eventually (snappier than PWA)

## Testing
- Served locally at `http://localhost:3000/app` for dev
- No test framework — manual testing in browser
- After changes, always hard-reload (Ctrl+Shift+R) to bypass service worker cache
