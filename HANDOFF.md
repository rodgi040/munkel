# Handoff — munkel (2026-08-06)

## current_state

- **Branch:** `cursor/notch-sender-display-names-0ab4` (off `platform/windows/v2-clean`).
- **Contribution PR:** https://github.com/limehq/munkel/pull/80 — open; human review required (do not self-merge upstream).

## completed

1. **Notch Aufgabe 2 — sender display names:** macOS-parity `memberLabel()` (`displayName ?? memberId.slice(0, 8)`) in `group-session` + CLI control handlers; notch UI resolves sender from live circle roster via `resolveNotchSender()` so profiles that arrive after the chat message update the label on the next `state-update`.

## remaining

1. Human review / CI gates on limehq/munkel#80 (do not self-merge upstream).
2. **Notch Aufgabe 3:** own sent reply missing from notch history.
3. Optional: live Windows QA for notch hover → leave → retract.

## next_action

Implement Notch Aufgabe 3 (own sent reply in notch history) on a feature sub-branch off `platform/windows/v2-clean`, or wait for upstream review on PR #80.
