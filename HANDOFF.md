# Handoff — munkel (2026-07-21)

## current_state

- **Branch:** `platform/windows/notch-lifecycle-harden` (from `debug/notch-single-msg-oversize` WIP + lifecycle harden).
- **Workspace:** `C:/Users/rodgi/CODING/Test/munkel`.
- **Focus:** Notch lifecycle harden (Aufgabe 1) — hover-stuck / post-hover retract.
- **App:** `cd apps/windows && bun run dev` → Tray → **Inject fake notch messages**.

## completed

1. DEV fake-notch injector; single-msg oversize; history size hierarchy; drift/center; transparent artifact — prior debug session, user-confirmed.
2. **T1 Branch:** `platform/windows/notch-lifecycle-harden` created. Stash `wip: notch-peek-hover-fix before fake-injector` decision: **cherry-pick CSS bottom-anchor only**; defer full `notch-reopen-hover` cursor-poll (stash^3 module) until live QA proves T2–T4 insufficient.
3. **T2 Hover-stuck:** `closeReply` re-arms suppressed leave; `HOVER_CEILING_MS=8000` clears stuck `hovering` in peek/retracted; tests updated (no longer assert bug).
4. **T3 Hit-target:** `.notch-peek/.notch-retracted` hover-target + sliver bottom-anchored in `global.css`.
5. **T4 Geometry:** `resolveNotchResizeHeight` — collapsed footprint 56px when peek/retract && !reopening; resize deps include `reopening`/`replyOpen`; immediate shrink on collapse.
6. **T5 Dead code:** removed unused `notchPhaseForElapsed` + its test.
7. Unit: 15 pass (lifecycle + resize-height); `bun run typecheck` green.

## remaining

1. **Human QA (T7):** Fake-injector matrix on real Windows — especially hover→leave→retract and hover→reply→leave→close→retract.
2. **T6 conditional:** If QA still shows stuck reopen under click-through, land stash `notch-reopen-hover.ts` cursor poll as follow-up.
3. **Aufgabe 2:** Sender shows numbers/IDs instead of display names.
4. **Aufgabe 3:** Own sent reply missing from notch history.
5. Commit / PR to `platform/windows/v2-clean` when user asks.

## decisions

- Keep Windows FULL→PEEK→RETRACT (not macOS teaser).
- Hover clear: leave re-arm + ceiling first; cursor-poll only if needed.
- Collapse resize uses collapsed footprint — do **not** keep-mounted + tall window (would reintroduce oversize + force poll).
- Stash peek-hover: CSS yes; main poll deferred.

## blockers

- Manual live QA still needed for post-hover retract on hardware.
- Cursor integrated shell sometimes hangs — prefer external terminal for `bun run dev`.

## next_action

Run fake-injector QA for post-hover retract. If green → Aufgabe 2 (sender display names). If still stuck → T6 cursor-poll from stash.
