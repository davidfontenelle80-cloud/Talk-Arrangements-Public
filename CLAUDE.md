---
project: Talk Arrangements
repo: davidfontenelle80-cloud/Talk-Arrangements-Public
live_url: https://davidfontenelle80-cloud.github.io/Talk-Arrangements-Public/
local_clone: C:\Users\david\OneDrive\Documents\GitHub\Talk-Arrangements-Public
deploy_method: COMPOSIO GitHub API (no git bash — OneDrive .git write restriction)
tools:
  read_repo: COMPOSIO_MULTI_EXECUTE_TOOL + GITHUB_GET_REPOSITORY_CONTENT
  push_repo: COMPOSIO_MULTI_EXECUTE_TOOL + GITHUB_CREATE_OR_UPDATE_FILE_CONTENTS
  bash_analysis: COMPOSIO_REMOTE_BASH_TOOL (parameter name is "command:", not "cmd:")
  desktop_control: mcp__computer-use__* (requires request_access first)
  web_interaction: mcp__claude-in-chrome__*
last_updated: 2026-07-09
---

# Talk Arrangements — Build Rules

## What this app is
Single-file HTML/JS/CSS PWA for managing JW talk assignments.
Live: https://davidfontenelle80-cloud.github.io/Talk-Arrangements-Public/

## Architecture
- Single file: all HTML, CSS, and JS in one file (index.html or app.html)
- PWA: manifest + service worker
- localStorage for persistence

## Deploy rules
- NEVER run git in bash — OneDrive mount blocks .git writes
- Use COMPOSIO GitHub API to push changes
- Bump CACHE_VERSION in sw.js on every deploy

## Repo-first rule
Always fetch current files from GitHub before editing — local clone may be months stale.
