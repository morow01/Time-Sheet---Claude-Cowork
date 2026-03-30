/**
 * Rian App Health Check — run in browser console before every push
 * node-compatible stub: paste into DevTools console on localhost:3000/app
 */
const ELEMENTS = [
  // Modals
  'note-voice-confirm-modal', 'voice-confirm-modal', 'voice-listen-modal',
  'ai-fault-modal', 'remind-modal', 'rian-dialog-overlay',
  'note-fs-modal',
  // Voice note confirm fields
  'nvc-heard-text', 'nvc-desc', 'nvc-loc', 'nvc-date-display',
  'nvc-priority-dots', 'nvc-category-chips', 'nvc-reminder-wrap',
  // Table popup
  'tt-cell-popup', 'tt-cell-trigger',
  // Link bubble
  'tt-link-bubble', 'tt-link-bubble-input',
  'tt-link-bbl-confirm', 'tt-link-bbl-open', 'tt-link-bbl-remove',
  // FABs
  'note-voice-fab', 'voice-fab',
];

const FUNCTIONS = [
  // Voice notes
  'startNoteVoice', 'startVoiceEntry', 'cancelVoice',
  'confirmNoteVoice', 'showNoteVoiceConfirm',
  'renderNvcPriorityChips', 'renderNvcCategoryChips',
  'renderNvcReminderField', 'setNvcPriority', 'setNvcCategory',
  // Fullscreen note editor
  'openFieldNoteFullscreen', 'closeNoteFullscreen', 'openNoteFullscreen',
  'startFsDictation',
  // Table
  '_ttCellAct', '_ttToggleCellPopup', '_ttUpdateLinkBubble',
  // Sync
  'scheduleNotesSave', 'fsSetNotes',
  // UI
  'showRianDialog', 'showToast', 'render',
];

const missingEl = ELEMENTS.filter(id => !document.getElementById(id));
const missingFn = FUNCTIONS.filter(f => typeof window[f] !== 'function');

if (missingEl.length === 0 && missingFn.length === 0) {
  console.log('%c✅ Health check PASSED — all elements and functions present', 'color:green;font-weight:bold');
} else {
  if (missingEl.length) console.error('❌ Missing elements:', missingEl);
  if (missingFn.length) console.error('❌ Missing functions:', missingFn);
}
