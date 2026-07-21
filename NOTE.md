# NOTE

## Inbox (unsorted)

- 2026-07-20 **[bug]** Notch zeigt Absender als Zahlen/IDs statt encodierter Benutzernamen — Verdacht: aktueller Branch/`v2-clean`-Basis hinter `macos-parity-p1` / Display-Name-Mapping fehlt oder regressed.
- 2026-07-21 **[bug]** Notch: visuelles Artefakt im Hintergrund (vermutlich DEV opaque bg / `::before` blur-Layer sichtbar seit Sichtbarkeits-Fix).
- 2026-07-21 **[bug]** Notch: History wird beim Hover nicht angezeigt.
- 2026-07-21 **[bug]** Notch wird nicht mittig auf dem Monitor angezeigt.
- 2026-07-21 **[bug]** Notch driftet bei jeder Fake-Nachricht weiter nach links (Resize/Reposition-Feedback-Loop — Fensterbreite wächst pro `setSize`, Zentrierung verschiebt x).
- 2026-07-21 **[task]** Notch-History-Verhalten korrekt wie iOS/Munkel nachbauen: (1) erste Nachricht groß oben; (2) Notch zieht sich nach einigen Sek ohne neue Nachricht ein; (3) danach leicht eingezogene Notch mit Lade-/Timer-Animation; (4) neue Nachricht vor Ablauf → wieder groß oben; Hover → vergangene Nachrichten im Zeitfenster als minimierte History-Ansicht darunter. iOS-Referenz existiert.
- 2026-07-21 **[bug]** Notch-Reply: eigene abgeschickte Antwort wird nicht (oder nicht korrekt) in der History angezeigt — gesendete Nachrichten des Users erscheinen nicht als Einträge im Notch-Verlauf.

## Classified

| Topic | Type | Status | Target/Source | Decision | Defined-on | Done-on/How |
|---|---|---|---|---|---|---|
| Notch single-msg oversize | bug | done | apps/windows notch height + history | Content resize + drop min-height fill; width 280 | 2026-07-20 | 2026-07-21 / content-driven height shipped; QA via fake injector |
| Notch drifts left each message | bug | done | apps/windows `notch-window.ts` resize/reposition | Code: pin `NOTCH_WIDTH` in `setSize` + center | 2026-07-21 | 2026-07-21 / log-verified: `x=928` constant + `widthAfter=283` constant across ~25 resizes / ~4.9min (session 109923); user-confirmed |
| Notch background artifact (DEV) | bug | done | apps/windows `notch-window.ts` | Code: restored transparent + `hasShadow:false` (opaque DEV bg was the rectangle) | 2026-07-21 | 2026-07-21 / user-confirmed no artifact; instrumentation removed |
| Notch not centered | bug | done | apps/windows `notchPositionForDisplay` | Same fix as drift (center from `NOTCH_WIDTH`) | 2026-07-21 | 2026-07-21 / log-verified: actual visual center 1069.5 vs screen center 1069 (~0.5px, DPI rounding); user-confirmed |
| Notch hover history not shown | bug | done | apps/windows notch history hover | Was rendering all rows full-size; fixed with compact HistoryRow for past msgs | 2026-07-21 | 2026-07-21 / user-confirmed: main large + past compact |
| Notch history size (main large / rest compact) | task | done | apps/windows NotchWidget + global.css | `renderHistoryRowCompact` for index>0; full `renderMessageRow` for newest/replying | 2026-07-21 | 2026-07-21 / user-confirmed |
| Notch history lifecycle (iOS parity) | task | in_progress | apps/windows notch lifecycle vs iOS Munkel | Keep FULL→PEEK→RETRACT; hover ceiling + leave re-arm + bottom hit-target + collapsed resize | 2026-07-21 | 2026-07-21 / code+unit green; human QA pending |
| Sent reply missing from notch history | bug | idea | apps/windows notch reply → history | Own sent reply not appended/rendered in notch history; verify sendReply path echoes into history entries | 2026-07-21 | — |
| Notch sender shows numbers not names | bug | idea | apps/windows notch sender display / identity mapping | Verify against macos-parity-p1 / member displayName path; may be stale base branch | 2026-07-20 | — |
| Dev fake-message injector | task | done | apps/windows notch QA tooling | Tray DEV checkbox → `showNotchMessage`, jitter 5–10s; first inject was delayed 5–10s (felt broken) → now immediate first tick | 2026-07-20 | 2026-07-20 / `7da7079` + debug fix immediate start |
| Notch loading spinner clip | task | done | apps/windows notch UI | peek geometry CSS | 2026-07-18 | stashed on peek-hover WIP |
| Notch hover history missing | task | done | apps/windows notch history | main reopen hover poll | 2026-07-18 | stashed on peek-hover WIP |
