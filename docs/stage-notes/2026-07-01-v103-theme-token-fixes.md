# v103 — Audit fixes (app-sweep 2/4)

Date: 2026-07-01
Scope: static audit per sweep method. No new features.

## Audit results
- JS syntax (`node --check`): all files clean.
- i18n: EN/ES parity 117/117 in app.js dict; all `data-i18n` and `tt()` keys resolve; i18n.js and toolbar-i18n.js clean.
- Service worker: all 34 precache entries exist on disk; query-string versions (main.css v99, app.js v97) match index.html; no cache drift.
- Theme selectors: `[data-theme]` used consistently; no `.dark`/`.light` class bugs.
- Orphaned files: none. `js/auth.js` is KHub boilerplate, feature-flagged off in config.js — intentional.
- Manifest icons: all present.

## Bugs fixed (index.html only)
1. **Dark theme: white panels.** `.cal-det-panel` and `.up-widget` used `var(--surface,#fff)` — `--surface` is never defined and, unlike `.cal-day`, these have no `[data-theme="dark"]` override. Result: white panels with near-white text in dark mode. Fixed to `var(--panel,#fff)`. `.cal-day` also moved to `--panel` for token correctness (dark override already covered it).
2. **Light theme: unreadable reminder modal.** Stage 9 reminder modal used undefined tokens with hardcoded dark fallbacks: `--surface` → #1e2130, `--input-bg` → #2a2f45 (x4), `--btn-bg` → #444, `--primary` → #5b8cff. In light mode this rendered a dark navy modal with dark `--text`. Remapped to defined tokens: `--panel`, `--panel-2` (x5), `--accent`.

## Not fixed (noted, not provable bugs)
- CLAUDE.md references `scripts/khub-check.mjs` which does not exist in this repo (doc drift from boilerplate).
- Reminder title input placeholder "Reminder title" is untranslated (no `data-i18n-placeholder`); cosmetic, left alone per no-new-features rule.

## SW
- CACHE_VERSION: talk-arrangements-v102-web-push-worker-ready → talk-arrangements-v103-theme-token-fixes.
