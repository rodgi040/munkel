# Handoff — munkel (2026-08-22)

> **Wiederaufsetz-Punkt (2026-08-22) — beide Release-Blocker geschlossen, Issue-Abarbeitung läuft.**
> Ältere Abschnitte bleiben historischer Record.

## current_state

- **Branch:** `platform/windows/v2-clean`, Tip `527a0f0` (bzw. der Merge von PR #68, falls schon durch).
- **Teststand:** 682 pass / 0 fail in `apps/windows`, 32 in `apps/cli`, 32 in `packages/shared-wire`. Typecheck (main + renderer) grün, CI dreifach grün.
- **GitHub-Issues sind jetzt aktiviert** (waren im Fork deaktiviert), Labels: `windows`, `severity: major`, `severity: minor`, `security`, `release-blocker`, `verified`.

## completed (diese Session)

**Merge-Runde:** PR #48 (origin-drift), #47 (notch history/preview); #46 als redundant geschlossen; zwei Altbranches als `archive/*`-Tags gesichert und gelöscht; lokaler `v2-clean` entdriftet.

**Release-Review** über fünf Cursor-Agents, jeder Befund einzeln gegen den Code geprüft (von 5 gemeldeten CRITICAL/HIGH hielten 2 stand). Report: https://claude.ai/code/artifact/3091a488-7f90-4c6d-b4d4-fdae2a9c2639

**Beide Release-Blocker geschlossen:**
1. **#58 / PR #49** (`c69e8be`) — Versions-Drift. `apps/windows/package.json` stand auf `0.0.1`; electron-builder leitet daraus Installer-Name und `latest.yml` ab, also hätte Auto-Update ab Release 1 nie gegriffen. `scripts/pack-release.mjs` patcht aus `MUNKEL_VERSION` und stellt den Pin im `finally` zurück. Tag `windows/fix/release-version-from-tag`.
2. **#59 / PR #50** (`d6097bb`) — Click-Through-Autorität. Zwei Preview-Systeme steuerten dieselbe Fenster-Eigenschaft; `exitPreviewMode` setzte `setIgnoreMouseEvents(true)` hart. System B gelöscht statt umverdrahtet. Tag `windows/fix/single-click-through-authority`.

**Issues abgearbeitet:**
- **#52 / PR #63** (`4c38884`) — CSS-Kollision: vier Klassen doppelt definiert, das Hover-Overlay überschrieb das Klick-Lightbox inklusive `pointer-events: none`. Klick-Seite auf `image-lightbox-*` umbenannt.
- **#57 / PR #65** (`bcfa94d`) — verwaister `'preview'`-Zustand samt `openFromPreview`, `renderPreview`, 7 CSS-Regeln, 6 Teststellen; 113 Zeilen entfernt.
- **#51 / PR #66** (`527a0f0`) — Emoji-Kürzung: `MAX_CHAT_CHARS` zählte Code-Units, `MAX_MESSAGE_CHARS` Grapheme. `encodeChat` nutzt jetzt `clampMessageText`, `MAX_CHAT_CHARS` ist Alias. **Die CLI war ebenfalls betroffen** und lehnte gültige Nachrichten ab.
- **#55 / PR #68** (`eaea5e2`) — blob-download-Timeout. Der erste Entwurf raste nur den `fetch`-Aufruf, wodurch ein nach den Headern stockender Body ungeschützt blieb; jetzt umspannt der Timeout die ganze Anfrage. Renderer bekam einen Epoch-Fence gegen veraltete Antworten. Tag `windows/fix/blob-download-timeout`.

**Neu gefunden und erfasst:** #64 (`ImagePreviewOverlay` importiert, nie gerendert — Plan-14-Feature nicht verdrahtet), #67 (flaky Tests unter Last, zweifach unabhängig beobachtet).

## remaining (in Reihenfolge)

1. **#56** Update-Wedge — als Nächstes dran.
2. **#56** Details: `installing` bleibt `true`, wenn `quitAndInstall` still fehlschlägt, und blockiert danach `confirmInstall`, `declineInstall` und `check` bis zum Neustart.
3. **#54** Album-`readFile` vor dem Size-Guard — `stat()` davor; dazu die offene Frage all-or-nothing vs. partial (macOS sendet den Rest).
4. **#62** Tag-Governance — ein `v*`-Tag auf beliebigem Branch löst ein Release aus.
5. **#64** — **zuerst die Merge-Historie prüfen**, die Render-Stelle ist vermutlich wiederherstellbar statt neu zu schreiben.
6. **#67** — Testnamen unter absichtlicher Last einfangen, nicht in Isolation suchen.

## decisions

- **Arbeitsteilung, die in dieser Umgebung trägt:** Grok 4.6 (Cursor CLI) **plant** — der Kontext muss inline im Prompt stehen, weil seine Tool-Calls an den globalen PreToolUse-Hooks scheitern. Sonnet-Subagent **setzt um**. Kimi/DeepSeek V4 Pro über `bash ~/.claude/agents/delegate.sh --to kimi --readonly --model ds` **verifiziert** — der kann Tools nutzen und echte Testläufe fahren.
- **Red/Green-Nachweis vor jedem Merge:** den Fix testweise zurückdrehen und zeigen, dass genau die neuen Tests umfallen. Hat mehrfach Lücken aufgedeckt, die grüne Tests nicht zeigten — zuletzt bei #55, wo vier grüne Tests den Body-Stall nicht abdeckten.
- **Vor Red/Green-Experimenten committen.** `git checkout -- <datei>` setzt auf HEAD zurück und löscht uncommittete Executor-Arbeit; einmal passiert, nur dank des vorher gelesenen Diffs rekonstruierbar gewesen.
- **Merge-Marker ohne `v`-Präfix taggen** (`windows/fix/…`), sonst feuert `release.yml`. Siehe #62.

## blockers

- **#60 Authenticode** — Zertifikatsbeschaffung (OV vs. EV), reine Nutzerentscheidung.
- **#61 Uninstall-Politik** für `%APPDATA%\munkel` — Produktentscheidung.
- **#53 Named-Pipe-DACL** — Architekturentscheidung: natives Modul für eine echte DACL vs. Shared-Secret-Handshake. Empfehlung: Shared Secret, weil eine neue native Dependency in einem Krypto-nahen Projekt schwerer wiegt.

## next_action

**#56** mit dem etablierten Dreischritt: Grok plant (Kontext inline), Sonnet setzt um, Kimi verifiziert, eigener Red/Green-Nachweis, Commit, PR, Merge.

## suggested_skills

- `/fp-resume`
- `delegate` — für Cursor/Kimi-Aufrufe, immer über `delegate.sh`, nie `herdr` direkt
- `gh pr create` gegen `platform/windows/v2-clean` (`--repo rodgi040/munkel`)

---

# Handoff — munkel (2026-08-18)

> **Wiederaufsetz-Punkt (2026-08-18) — Origin-Drift-Follow-up lokal grün; Branch committen+pushen, PR als Nächstes, kein Merge.**
> Ältere Abschnitte (2026-07-22) bleiben historischer Record.

> **Wiederaufsetz-Punkt (2026-08-17) — Git-Reconciliation abgeschlossen, PR #47 offen.**
> Die Abschnitte direkt unten sind maßgeblich. Ältere (2026-07-22 und davor) bleiben historischer Record.

## current_state

- **Branch:** `platform/windows/origin-drift-fix` off `origin/platform/windows/v2-clean` (`1109002`).
- **Scope:** Origin-Drift nach `upstream/main`-Sync (`94bc0b8`) + Integration-Merge (`8abd1b4`): Typecheck + 29 pre-existing Testfehler auf der v2-clean-Basis.
- **Lokal verifiziert:** `bunx tsc --noEmit` grün; `bun test` in `apps/windows` = **654 pass / 0 fail** (vorher 625 pass / 29 fail).
- **PR #47** bleibt separat offen: `platform/windows/notch-history-and-preview-fix` → `v2-clean`
  (https://github.com/rodgi040/munkel/pull/47). CI dort rot wegen desselben `identity-store` Typechecks, bis diese Basis landet und #47 rebased wird. Kein Self-Merge.

## completed (diese Session)

1. Feature-Branch `platform/windows/origin-drift-fix` von `origin/platform/windows/v2-clean` angelegt.
2. Typecheck: `PersistedState.version` Literal `1` → `1 | 2` (`identity-store.ts`), Runtime schreibt `version: 2`.
3. Payload-Tests an `shared-wire` angeglichen: fehlender Profil-`status` bleibt `undefined`; unbekannte Werte fallen weiter auf `'online'`.
4. GroupSession-Echo-Test: echter Fehlschlag via Disconnect (`Circle offline`), nicht mehr 60k-Plaintext (wird auf `MAX_CHAT_CHARS` gekürzt). Truncation-Test unangetastet.
5. NotchWidget-Wiring, das der `macos-parity`-Merge verloren hatte:
   - Root: `ref={widgetRef}`, `data-testid="notch-widget"`, `setNotchHovered` + `onMouseMove={reportHoverCopyActivity}`.
   - History-Rows: `{ collapsible: true }`; Full-View: `{ pulse: !replyingTo }`.
6. Hover-Reopen: `reopenFromHoverTarget` setzt `ui === 'open'` (History), auch während `phase === 'full'` — macOS-Parity / Plan-12/13-NotchWidget-Tests. Lifecycle-Tests umbenannt/angepasst.
7. Kein PR-#47-Feature portiert (Sender-Namen, Own-Reply, Quick-Look bleiben dort).

## remaining (in Reihenfolge)

1. **PR öffnen** `origin-drift-fix` → `v2-clean` (kein Self-Merge).
2. **PR #47** auf die neue `v2-clean`-Basis rebasen, sobald dieser PR gemerged ist (sonst bleibt #47-CI am Typecheck rot).
3. **OQ5** (CLI-Distribution) — blockierte Produktentscheidung.
4. Upstream limehq/munkel#80 — human review, kein Self-Merge.

## decisions

- Origin-Drift als eigener Sub-Branch off `v2-clean`, nicht in PR #47 mischen (User/HANDOFF 2026-08-17).
- Payload/Echo: Tests an den Wire-Vertrag anpassen, Production-Encode/Decode und Chat-Truncation nicht zurückdrehen.
- NotchWidget: fehlendes Wiring vorhandener Handler/Optionen wieder anschließen (`ref`, Hover-Copy, `collapsible`, `pulse`) — kein Copy der PR-#47-Features.
- Hover-Reopen-Vertrag: Plan-12/13-NotchWidget-Tests (History sofort) schlagen die origin-3-State-Lifecycle-Tests (`ui === 'preview'` zuerst). Lifecycle-Tests an `open` angepasst. `openFromPreview()` bleibt idempotent.
- Untracked gelassen: `Debugging/`, `apps/windows/docs/plans/15-startup-performance.md`, Vite-Timestamp, `kimi-export-session_*.md`.

## blockers

- Keine harten. ReMe-Tunnel war in der Session down (`ConnectError` 127.0.0.1:2333) — Resume lief über Repo-Dateien.
- PR #47 CI bleibt rot, bis dieser Typecheck auf `v2-clean` liegt.

## next_action

PR `platform/windows/origin-drift-fix` → `platform/windows/v2-clean` öffnen (`gh pr create --repo rodgi040/munkel`). Nicht mergen. Danach #47 rebase.

---

- **Reconciliation DONE + PR offen:** lokaler divergierter `v2-clean` (9 ahead / 111 behind origin) auf
  frischen `origin/platform/windows/v2-clean` (`1109002`) überführt, **nichts verloren**.
- **Feature-Branch:** `platform/windows/notch-history-and-preview-fix` — **gepusht**, **PR #47** →
  `v2-clean` (https://github.com/rodgi040/munkel/pull/47, kein Self-Merge).
- **Backup-Refs:** `backup/pre-reconcile-78feefd` + Tag `backup/pre-reconcile-2026-08-17` (→ `78feefd`).
- **6 Commits** (5 Code + 1 Docs `1a3894d`). Code: `7ef1048`…`a50af19` (siehe completed).

## completed (diese Session)

1. **Phase 0 Backup:** `backup/pre-reconcile-78feefd` + Tag (→ `78feefd`).
2. **Phase 1 Audit (Cursor-Subagent):** `scratchpad/reconcile-manifest.md` — exaktes Re-Apply-Manifest.
   Befund: origin hat Großteil von `cc5ba84` schon (P1.3 + `ee5d1dd`); Sender besser via Parallel-Branch `b5bacc8`.
3. **Phase 2 Implementation (Cursor-Subagent):** Fresh-Branch + 5 Code-Commits:
   `7ef1048` collapsed-Resize (← cc5ba84) · `7e2ea8b` Sender (← b5bacc8) · `873ad7e` Own-Reply (← a3f3966) ·
   `310ea2a` Quick-Look (← bffcbee) · `a50af19` Preview-Dismiss+Echo-Skip (← 9e4165c).
4. **Phase 3 Verifikation:** Baseline-Vergleich (origin-Tip vs Branch) → 0 neue Fehler, 7 pre-existing behoben, +20 Tests.
5. **Phase 4:** Docs (HANDOFF/STATE/NOTE) committet (`1a3894d`), Branch gepusht, PR #47 offen.

## remaining (in Reihenfolge)

1. **Origin-Drift-Follow-up (offen):** origin-Basis rot — 22 pre-existing Testfehler + 2 typecheck-Fehler
   (`identity-store.ts` `version`-Typ-Drift) aus `upstream/main`-Sync (`94bc0b8`) + Integration-Merge
   (`8abd1b4`). Eigener Debugging-Auftrag (NOTE.md).
2. **PR #47:** Review/CI abwarten; kein Self-Merge.
3. **OQ5** (CLI-Distribution) — blockierte Produktentscheidung.

## decisions

- **Umfang „alles wiederherstellen"** (User): 3 Feature-Commits + `cc5ba84`-unique Geometrie/Hit-Targets/Dead-Code.
- **Sender via `b5bacc8` + Own-Reply-Port** (User bestätigt): Parallel-Branch ist die bessere Sender-Impl.
  (shared `member-label.ts`); unser `a3f3966`-Sender-Teil redundant → nur Own-Reply portiert.
- **Fresh-Branch + Re-Apply statt rebase/merge** der 9er-Kette (Duplicate-Merges; `cc5ba84`/`a3f3966` nicht wholesale).
- **Origin-Drift = separater Follow-up**, nicht Teil der Reconciliation (User: „Reconciliation abschließen").

## blockers

- Keine harten. Origin-Drift (22 Tests + typecheck) macht CI rot, ist aber pre-existing (eigener Auftrag).

## next_action

Origin-Drift-Follow-up: 22 pre-existing Testfehler + `identity-store.ts`-typecheck auf
`platform/windows/v2-clean` untersuchen/fixen (Root Cause: `upstream/main`-Sync `94bc0b8` +
origin-`macos-parity`-Tree-Drift `3ed68fa`).

## suggested_skills

- `/fp-resume` (Wiederaufsetz)
- `/fp-pause` / `/fp-resume` (Wiederaufsetz)
- `gh pr create` gegen `platform/windows/v2-clean` (`--repo rodgi040/munkel`)
- Nicht auf `main` pushen.

---

## current_state (2026-07-22, origin-Record)

- **Branch:** `platform/windows/v2-clean` (synced with `platform/windows-integration` + `upstream/main`).
- **Contribution PR:** https://github.com/limehq/munkel/pull/80 — **MERGEABLE** (may be BLOCKED on reviews/checks).
- **Focus:** Windows contribution ready for upstream review.

## remaining (historisch, teilweise überholt)

Notch Aufgabe 2/3 (Sender-Namen, Own-Reply) leben in **PR #47**, nicht mehr als offene Coding-Tasks auf v2-clean.
