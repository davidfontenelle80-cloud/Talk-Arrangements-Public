---
project: Talk Arrangements
repo: davidfontenelle80-cloud/Talk-Arrangements-Public
live_url: https://davidfontenelle80-cloud.github.io/Talk-Arrangements-Public/
local_clone: C:\Users\david\OneDrive\Documents\GitHub\Talk-Arrangements-Public
deploy_method: COMPOSIO GitHub API (no git bash - OneDrive .git write restriction)
tools:
  read_repo: COMPOSIO_MULTI_EXECUTE_TOOL + GITHUB_GET_REPOSITORY_CONTENT
  push_repo: COMPOSIO_MULTI_EXECUTE_TOOL + GITHUB_CREATE_OR_UPDATE_FILE_CONTENTS
  bash_analysis: COMPOSIO_REMOTE_BASH_TOOL (parameter name is "command:", not "cmd:")
  desktop_control: mcp__computer-use__* (requires request_access first)
  web_interaction: mcp__claude-in-chrome__*
last_updated: 2026-07-13
---

# Talk Arrangements - Build Rules

## Session startup (every time)
1. Read this file before touching any code
2. Fetch current sw.js from GitHub to note the live CACHE_VERSION before any work begins

## What this app is
Multi-file PWA for managing JW public talk assignments (Spanish-speaking congregation).
Live: https://davidfontenelle80-cloud.github.io/Talk-Arrangements-Public/

## Architecture
- Multi-file: index.html + js/*.js + css/*.css + sw.js + manifest.json
- PWA: manifest + service worker (cache-first with network-first for polished assets)
- Firebase: optional cloud backup/auth (CDN-loaded compat SDK, not intercepted by SW)
- localStorage for persistence
- Language: EN/ES (i18n.js)

## Script load order (DO NOT change)
1. Firebase CDN (app-compat, auth-compat, firestore-compat from gstatic.com)
2. js/config.js
3. js/firebase/firebase-config.js, cloud-backup.js
4. js/i18n.js, theme.js, error-boundary.js, a11y.js
5. js/components/button.js, modal.js, card.js, input.js
6. js/perf.js, push-config.js, push.js
7. js/app.js?v=stage9a-v97  (version param must match PRECACHE_URLS in sw.js)
8. js/dashboard-notes.js, fixed-preview.js, fixed-manager-ux.js
9. js/planning-conflicts.js, rollover-preview.js, toolbar-i18n.js
10. js/planning-clear-row.js, unified-note-modal.js, mobile-toolbar.js
11. js/duplicate-congregation-guardrail.js

## Service Worker rules (CRITICAL)
- ALWAYS bump CACHE_VERSION in sw.js on EVERY deploy, even if sw.js itself is not changing
- Current format: talk-arrangements-vNNN-slug
- Skipping the bump means devices with old caches never receive the update

### Safe offline fallback pattern (REQUIRED)
WRONG - causes SyntaxError on devices with broken caches:
  catch(() => caches.match('./'))

CORRECT - only serve HTML for page navigations:
  .catch(() => {
    if (event.request.destination === 'document') {
      return caches.match('./');
    }
    return Response.error();
  })

Serving index.html for JS asset requests causes: SyntaxError: Unexpected token '<'
Error label: JS-ERROR-unknown:1, Where: unknown:1

## Deploy rules
- NEVER run git in bash - OneDrive mount blocks .git writes
- Use COMPOSIO GitHub API to push changes (GITHUB_CREATE_OR_UPDATE_FILE_CONTENTS)
- Always get the current file SHA before pushing (GITHUB_GET_REPOSITORY_CONTENT)
- Content must be base64-encoded
- DO NOT commit API keys or VAPID private keys

## Repo-first rule
Always fetch current files from GitHub before editing - local clone may be months stale.

## PRECACHE_URLS notes
- js/cloud-account-ui.js is in PRECACHE but NOT in index.html - loaded dynamically by app.js
- All js files in index.html must also appear in PRECACHE_URLS
- Version params (e.g. ?v=stage9a-v97) must match exactly between index.html and sw.js

## Ship checklist
Run ALL checks before pushing:

1. CACHE_VERSION bumped - fetch sw.js from GitHub, confirm version string changed
2. Version param sync - if app.js modified, ensure ?v= in index.html matches sw.js PRECACHE_URLS
3. SW fallback is safe - offline fallback uses destination === 'document' check, not blanket HTML
4. PRECACHE_URLS complete - all JS files in index.html are also in the precache list
5. No garbled UTF-8 - Spanish characters display correctly (not double-encoded)
6. No console errors expected

## Post-deploy verification (run after every push, ~2 min for GitHub Pages)
1. Fetch live sw.js via Chrome MCP - confirm new CACHE_VERSION string is present
2. Spot-check one JS file response - Content-Type must be application/javascript not text/html
3. Confirm app loads at live URL without error boundary firing

## Known issue patterns
- SyntaxError: Unexpected token '<' -- SW returning HTML for JS asset. Check offline fallback.
- JS-ERROR-unknown:1 -- script tag failed completely. Check SW cache state and PRECACHE_URLS.
- Double-encoded UTF-8 (e.g. A-tilde-o instead of o-acute) -- use Python decode('utf-8') when processing base64.
- Stale cache after fix -- if CACHE_VERSION was not bumped, tell user to clear browser site data.
