# Theme Migration Plan — v5.6.x series

Started **v5.6.0**. Goal: enable multiple user-selectable themes (dark, Gameboy, Win 3.1, B&W, iOS, etc.) by migrating hardcoded colors to CSS variables and restoring a theme switcher.

## Why this is needed

App has ~1,134 hex color occurrences across 212 distinct values. Of those:
- **~80% are already aliased** via CSS variables (defined in `:root` block at the top of app.html)
- **~180 occurrences** remain hardcoded and are *structural* — backgrounds, text, borders that need to change per theme
- **~170 occurrences** are brand/status colors (red for error, green for success, etc.) that should stay fixed regardless of theme
- **~17 occurrences** are SVG icon fills that should stay fixed

The hardcoded structural colors are concentrated in:
1. CSS rules that were written before the variable system was fleshed out
2. Inline `style=""` attributes inside JS template literals
3. SVG `fill/stroke` attributes in generated HTML

## Current state

- `:root` block (~line 29–83) has 54 variables covering most of the app.
- `[data-theme="claude"]` block (~line 1736) duplicates the root variables — historic artifact from when Rob had multiple themes before.
- `initTheme()` (~line 23781) force-sets `data-theme="claude"` on every load.
- `setTheme()` is a stub (`/* themes removed */`). Earlier themes (Gameboy, Retro, Win 3.1, B&W, iOS) were deleted from the code.

## Variables already defined

```
--font-body, --font-mono
--bg-page, --bg-header, --bg-header-tab, --bg-card, --bg-card-alt, --bg-day-header, --bg-day-header-we
--bg-input, --bg-modal, --bg-modal-search, --bg-code-btn, --bg-code-group, --bg-code-item, --bg-code-item-sel
--bg-ot, --summary-even
--text-header, --text-header-sub, --text-primary, --text-secondary, --text-muted, --text-day, --text-day-we, --text-hours, --text-input, --text-ot
--accent, --accent-light, --accent-chip-bg, --accent-chip-text
--border, --border-input
--btn-danger-color, --btn-danger-bg, --btn-danger-border
--shadow-card, --overlay, --tab-active
--priority-high, --priority-high-dark, --priority-high-bg, --priority-high-bg-strong, --priority-high-border
--priority-medium, --priority-medium-bg, --priority-medium-bg-strong, --priority-medium-border
--priority-low, --priority-low-dark, --priority-low-bg, --priority-low-bg-strong, --priority-low-border
```

## New variables needed (to be added in v5.6.1)

Gaps found during audit that should become themable:

- `--border-strong` — darker divider for section boundaries (currently `#cbd5e1`, `#e2e8f0`)
- `--bg-section-muted` — like `#f8fafc` when `--bg-input` feels too blue for the context
- `--text-display` — heading text distinct from `--text-primary` (currently `#1F2937`, `#3A3836`)
- `--shadow-sm`, `--shadow-md`, `--shadow-lg` — normalize the drop-shadow variants
- `--gradient-success-from`, `--gradient-success-to` — endpoints for the green button gradient used by Battery Recorder
- `--gradient-brand-from`, `--gradient-brand-to` — for any brand gradients
- `--mix-10`, `--mix-20`, `--mix-40` OR individual rgba() variables — for the repeated `rgba(color, 0.x)` tints used on chips and state pills (decide approach in v5.6.1)

## Migration steps (one commit each)

| Version | Scope | Risk |
|---|---|---|
| **v5.6.0** | This plan doc only — no code changes | none |
| **v5.6.1** | Add new variables to `:root` block, values matching current hardcodes | none (nothing consumes them yet) |
| **v5.6.2** | Migrate structural backgrounds in CSS blocks: `#f8fafc`, `#FFFFFF`, `#F4F7FA` → `var(--bg-input)` etc. Skip inline `style=""` for now | low |
| **v5.6.3** | Migrate structural text in CSS blocks: `#94a3b8`, `#6B7280`, `#3A3836` → `var(--text-*)` | low |
| **v5.6.4** | Migrate borders in CSS blocks: `#e2e8f0`, `#D4E0EC`, `#dcdad4` → `var(--border)`/`var(--border-strong)` | low |
| **v5.6.5** | Migrate shadows and rgba overlays to new variables | low |
| **v5.6.6** | Migrate gradients — extract endpoints to vars | low |
| **v5.6.7** | Migrate inline `style=""` in JS template literals — hex → var() | medium (JS refactor) |
| **v5.6.8** | Restore `setTheme()` and add theme selector UI in hamburger menu; persist to localStorage | medium (JS + UI) |
| **v5.6.9** | Add **Dark** theme block | low (just new CSS) |
| **v5.6.10** | Add **Gameboy** theme block | low |
| **v5.6.11** | Add **Win 3.1** theme block | low |
| **v5.6.12** | Add **B&W** theme block | low |
| **v5.6.13** | Add **iOS** theme block | low |

## Guiding rules during migration

1. **Never touch SVG path fills** (`<path fill="#..." />`) in icons — those stay hardcoded by design.
2. **Never change status colors** (red/green/amber for priority, error, success) unless specifically designing a theme that needs them themed.
3. **Use fallback syntax** `var(--name, #hardcoded)` everywhere so a missing variable in a partial theme never breaks the app.
4. **App must look visually identical** through v5.6.0–5.6.7. Only v5.6.9+ should produce visible changes, and only when the user explicitly picks a new theme.
5. **Commit per category** so any single step can be reverted if something breaks.
6. **Track each step** with a short note in this file when completed.

## Known gotchas (from the audit)

- **Case inconsistency**: `#FFFFFF` vs `#ffffff`, `#F5A623` vs `#f5a623`. All search/replace must be case-insensitive.
- **`backdrop-filter` creates containing blocks**: already bit us with the reminder modal. If we add any new blurred surfaces during theming, test every `position: fixed` descendant.
- **JS template literal styles** (e.g. `style="background:${x}"`) — these aren't in the CSS blocks, so CSS-variable migration alone won't fix them. Plan step 5.6.7 handles these.
- **rgba() opacity tints**: `#F5A623` with 10% opacity is written as `rgba(245,166,35,0.10)` — not trivially swappable. Decision needed in v5.6.1: introduce N-variants (`--accent-alpha-10`) or use CSS `color-mix()` (less browser support but cleaner).

## Progress log

- **v5.6.0** — Plan doc committed (this file).
