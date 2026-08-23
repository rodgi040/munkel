# Handoff — munkel (2026-08-23, Abend — #67 geschlossen)

> **Wiederaufsetz-Punkt (2026-08-23, Abend) — #67 ist erledigt und gemerged. Nächstes Issue ist #64.**
> Ältere Abschnitte bleiben historischer Record. Dieser Abschnitt schlägt sie alle.

## current_state

- **Branch:** `platform/windows/v2-clean`, Tip `9976f8e`. Kein offener Feature-Branch — der Sub-Branch zu #67 ist lokal und remote gelöscht.
- **`origin/v2-clean` steht auf `918e822`** — lokal **4 Commits voraus**: `16ede21` (Merge), `d1896d5` + `9976f8e` (Doku) und `1b8c842` (Signing-Doku der Parallel-Session). **Noch nicht gepusht**, bewusst: der Push würde `1b8c842` mitveröffentlichen, das nicht von mir stammt.
- **Uncommitted:** nur `HANDOFF.md` (dieser Eintrag). Bewusst untracked: `Debugging/`, `kimi-export-session_-20260722-145402.md`.
- **Teststand:** `apps/windows` **682 pass / 0 fail** (~8 s idle), Typecheck grün, CI auf PR #72 dreifach grün.
- **Offene Issues: 11.** #67 geschlossen; **#71 und #73 in dieser Session neu angelegt**.

## completed (diese Session)

**#67 — flaky Windows-Suite unter Last.** PR #72 → `918e822`, Tag `windows/fix/flaky-suite-under-load`, Issue von Hand geschlossen ([Kommentar](https://github.com/rodgi040/munkel/issues/67#issuecomment-5386622464)). Auto-Close greift weiterhin nicht.

**Vier Ursachen, nur eine davon die im Issue vermutete.** Keine der dort genannten Konstanten war beteiligt:

1. **Wanduhr-Frist um echtes I/O** — beide `waitFor`-Kopien. Nebenwirkung: die verwaiste Rejection eines abgeschossenen Tests beschuldigt den *nächsten*.
2. **Falscher Anker** — Tests warteten auf das `connection`-Ereignis des *Servers* und handelten, als sei der *Client* offen (`sendChat` → „Circle offline"). Der Presence-Test scheiterte spiegelbildlich an einer nie garantierten Frame-Reihenfolge. **Das war der Teil, den keine Frist gefunden hätte.**
3. **Verwaiste Sessions als Kaskaden-Verstärker** — `afterEach` schloss den Server, trennte aber nie die Session. Ein an der Frist gestorbener Test erreichte sein `disconnect()` nie und retryte weiter gegen einen toten Port. `1006`-Fehler **96 → 4**. Das erklärt, warum die fehlschlagende *Menge* zufällig aussah.
4. **`image-codec.ts`** initialisierte zwei WASM-Module vor dem Guard, der den Aufruf zum No-op macht.

**Danach blieb nur die 5000-ms-Standardfrist des Runners**, die bei ~24-facher Streckung gesunde Tests traf — auch einen `MenuWindow`-Test ohne Socket. Sie ist selbst genau die Wanduhr-Frist, die das Issue ausschließt, nur in der Runner-Vorgabe statt im Test. Auf 30 s angehoben (`bun test --timeout 30000` im Paket-Skript, greift auch in CI). Keine Produktions-Timing-Konstante geändert.

**Belege:** fünf aufeinanderfolgende Lastläufe (24 Burner auf 16 Kernen, ~24-fache Streckung) je **682 pass / 0 fail**; Red/Green unter derselben Harness **674 pass / 8 fail** zurückgedreht gegen **682 / 0**. Die im Issue dokumentierte Bedingung war eine **2-fache** Streckung — verifiziert wurde bei etwa dem Zwölffachen davon. Kimi/DeepSeek read-only: **SHIP-WITH-FOLLOW-UPS**, 10/10 PASS, keine MAJOR.

**Neue Konvention in `CLAUDE.md`** (unter Cross-cutting invariants): Tests warten auf Ereignisse, nie auf Fristen; echte Debounces über die gemeinsame `apps/windows/src/test-support/fake-timers.ts`; keine Fake Timer um echte Sockets; Ressourcen in `afterEach` freigeben, nicht am Ende des Testkörpers.

**Beinahe-Fehler, der es wert ist, gemerkt zu werden:** eine Zwischenfassung meldete `682 pass / 0 fail`, führte aber nur **8 von 29** Tests einer Datei aus — ein `Promise.reject`-Platzhalter brach die Datei ab, und bun zählte die übersprungenen Tests nicht als Fehler. Aufgefallen **nur** durch Vergleich der Testzahl gegen die Baseline, nicht durch das grüne Summary. Behoben in `a1d3ca3`. Lehre: bei Testharness-Umbauten immer die *Anzahl* gegen die Baseline prüfen, nie nur „0 fail" lesen.

**Zwei neue Issues.**

- **#71** — 26 verbliebene Wanduhr-Schlafe in `hover-copy-shortcut.test.ts` (12), `NotchWidget.test.tsx` (10), `Avatar.test.tsx` (4). Keiner ist in einem Lastlauf aufgefallen; Härtung, kein Defekt. `MenuWindow.test.tsx` dient als gearbeitetes Beispiel.
- **#73** — auf deine Fehlermeldung hin untersucht: `Deploy Landing Preview` scheitert bei **jedem** Push auf `v2-clean` und war im Fork **nie** grün (**12 von 12 rot seit 22.07.**). Ursache: keine Repo-Secrets gesetzt (`gh secret list` leer), `wrangler versions upload` bricht ab. Ausgelöst wird er über den **kumulativen** Diff von Draft-PR #45 (`v2-clean → main`), der dauerhaft `package.json`/`bun.lock`/`turbo.json` berührt — deshalb feuert er auch bei reinen Test-Commits. Der Guard `head.repo.full_name == github.repository` greift nicht, weil #45 ein Same-Repo-PR ist. **Kein Regressionssignal**, verwandt mit #62.

## remaining (in Reihenfolge)

1. **#64** — `ImagePreviewOverlay` importiert, aber nie gerendert. Siehe `next_action`.
2. **#54** — Speicher-Guard. **Vorher `.planning/p0-11` lesen**: die Parallelisierung war Absicht, nur die Read-Nebenläufigkeit beschränken.
3. **#56** — Update-Wedge. **Vorher `.planning/p0-12` lesen**; den pinnenden Test umschreiben, nicht reparieren. Berührt `update-service.test.ts`.
4. **#53** — kleiner Doku-Fix, zusammen mit der Korrektur von `.planning/p0-02`.
5. **#61** — Konfigurationsschalter + `PRIVACY.md`; braucht echten Install/Uninstall/**Update**-Zyklus.
6. **#62** — Workflow-Umbau, gegen echten Tag-Push verifizieren.
7. **#70** — Doku-Fix `SECURITY.md`/`README.md`, jederzeit einschiebbar.
8. **#71**, **#73** — Härtung bzw. CI-Hygiene.
9. **#60** zurückgestellt (Team-Entscheidung), **#69** blockiert auf zweitem Windows-Konto.

## decisions

Diese Session, wortgleich wie gewählt:

- **„Direkt hier umsetzen (empfohlen)"** — statt der Kette Grok → Sonnet → Kimi. Begründung: die zwei echten Race-Anker hingen an Diagnose-Details, die vollständig im Kontext lagen; ein mechanischer Rewriter hätte den Test grün gemacht statt den Anker korrigiert. Kimi blieb als read-only Verifikation.
- **„Ja, await-Reihenfolge korrigieren (empfohlen)"** — `image-codec.ts` wird angefasst; `ensureAvifReady()` wandert hinter den bitmap-Guard. Im Renderer verhaltensgleich, keine Timing-Konstante geändert.
- **„Frist anheben (empfohlen)"** — Runner-Frist 5 s → 30 s. Begründung: die 5000 ms sind selbst die Wanduhr-Frist um echtes I/O, die das Issue ausschließt, nur in der Runner-Vorgabe statt im Test.
- **„Nur den erfassten MenuWindow-Fall (empfohlen)"** — ein Schlaf umgestellt, die übrigen 26 als #71. **Nachträgliche Korrektur:** die Begründung trug nicht — der in B3 erfasste `MenuWindow`-Fehlschlag ist ein *anderer* Test ohne eigenen Timer. Die Umstellung ist Konsistenzarbeit, kein Fix für jenen Fehlschlag. Steht so auch im PR und im Close-Kommentar.
- **„Nein, nur als Issue erfassen"** — #73 wird nicht sofort gefixt, nur dokumentiert.

Weiter gültig aus früheren Sessions:

- **Auto-Close greift nicht** — GitHub schließt `Closes #N` nur beim Merge in den Default-Branch; wir mergen nach `v2-clean`. Jeder Windows-PR braucht ein manuelles Close.
- **Red/Green vor jedem Merge**, und **vor dem Experiment committen**.
- **Merge-Marker ohne `v`-Präfix** taggen (`windows/fix/…`), sonst feuert `release.yml`. Wird durch #62 gegenstandslos.
- **Der graphify-Graph ist veraltet und irreführend** — direkt am Code lesen. In dieser Session erneut nicht benutzt.

## blockers

- **Nicht gepusht:** lokaler `v2-clean` (`9976f8e`) ist `origin` **4 Commits voraus**, darunter `1b8c842` der Parallel-Session. Der Push ist Nutzerentscheidung, weil er fremde, möglicherweise noch in Arbeit befindliche Doku mitveröffentlicht. **Erste Frage der nächsten Session an den User.**
- **Zweite Agent-Session arbeitet in derselben Arbeitskopie.** Sie hat während dieser Session einen Commit angelegt und amendiert (`ac30abc` → `1b8c842`) und zwischenzeitlich ausgecheckt. Das hat einen Messlauf verfälscht — ein „Leerlauf"-Lauf brauchte 129 s statt 10 s und meldete 4 Fehlschläge, die auf ruhiger Maschine nicht reproduzierbar waren. **Vor jeder Messung CPU-Last prüfen**, sonst misst man Fremdlast.
- **Zwei Backup-Branches existieren nur lokal — nicht löschen.** `backup/pre-reconcile-78feefd` (9 Commits) und `platform/windows/notch-history-and-preview-fix-pre-reconcile` (7 Commits), Stand 22.07., aus der Reconciliation vom 17.08. `git cherry` meldet die Patches als *nicht* auf `origin` — das ist **kein** Beleg für verlorene Arbeit, sondern die Folge davon, dass die Änderungen damals auf eine neue Basis neu aufgesetzt wurden, wodurch sich die Patch-IDs ändern. Die Zuordnung steht in `STATE.md` (`cc5ba84`, `a3f3966`, `bffcbee`, `9e4165c` → reconciliierter Branch, gemerged über PR #47, danach 654 pass / 0 fail). Mechanisch beweisen lässt sich das nicht, und `origin` ist inzwischen 151 Commits voraus — **genau dafür sind die Refs da.** Bewusst nicht gepusht (tote Branches im geteilten Repo) und bewusst nicht gelöscht.
- Sonst keine. **#69** bleibt auf einem zweiten Windows-Konto blockiert; **#60** ist zurückgestellt, nicht blockiert.

## next_action

**#64 umsetzen** — `ImagePreviewOverlay` ist importiert, aber nie gerendert. Höchster Nutzerwert der Restlichen: Hover zieht heute das Fenster auf Arbeitsflächengröße auf, klaut den Fokus und zeigt nichts. Verursacher ist als Merge `3ed68fa` nachgewiesen, das JSX aus `fa37329` geborgen. **Fallstrick:** ein wörtlicher Restore wäre falsch — `previewImage` war damals ein abgeleiteter Wert aus `previewImageID`, heute ist es der `useState` der Klick-Lightbox. Gleicher Name, andere Bedeutung; ein Verbatim-Restore erzeugte die Kollisionsklasse aus #52/#59 ein drittes Mal.

Vorgehen wie bei #67: eigener Sub-Branch off `v2-clean`, Red/Green vor dem Merge, PR nach `v2-clean` (nie `main`), Merge-Commit `--no-ff`, Tag ohne `v`-Präfix, Issue von Hand schließen.

## suggested_skills

- `/fp-resume` zum Wiederaufsetzen
- `/fp-debug` für #64 — es ist ein echter Defekt mit Reproduktionsbedarf
- `delegate` für Kimi-Verifikation — immer über `~/.claude/agents/delegate.sh --to kimi --readonly --model ds`, **nur im Foreground** (Memory `kimi-delegate-wrapper-must-run-foreground`)
- `gh issue` / `gh pr` gegen `--repo rodgi040/munkel`; PRs nach `platform/windows/v2-clean`
- **Nicht** `graphify query` — der Graph ist veraltet und zeigt auf seit PR #33 gelöschte Pfade
- Last-Harness für Testmessungen liegt unter `…/scratchpad/flaky67/loadrun.sh` (`bash loadrun.sh <label> <burner> <sekunden>`); sie ruft `bun run test` auf, damit die Frist aus dem Paket-Skript greift

---

# Handoff — munkel (2026-08-23, Nachmittag)

> **Wiederaufsetz-Punkt (2026-08-23) — Triage-Runde vollständig abgeschlossen. Nächster Schritt ist Umsetzung, nicht mehr Triage.**
> Ältere Abschnitte bleiben historischer Record.

## current_state

- **Branch:** `platform/windows/v2-clean`, Tip `c10ed37` — **unverändert**. In dieser Session wurde **kein Code angefasst**, nur GitHub.
- **Uncommitted:** nur `HANDOFF.md` + `STATE.md`. Bewusst untracked: `Debugging/`, `kimi-export-session_-20260722-145402.md`.
- **Offene Issues: 10** (8 vorgefunden, #69 und #70 neu angelegt). **Alle sind triagiert** und tragen einen State — acht `ready-for-agent` (#53, #54, #56, #61, #62, #64, #67, #70), zwei `ready-for-human` (#60, #69).
- **Kein `release-blocker` mehr offen.** Das Team hat entschieden: **vorerst keine eigene Signierung** (Antwort auf limehq/munkel#235, dort mit der Antwort geschlossen). Windows liefert öffentlich unsigniert aus, das Risiko wird dokumentiert statt beseitigt. Details unten.
- **Kein offener externer PR.** #45 ist eigener Draft und fällt aus der Triage-Discovery.
- **Die `/triage`-Runde ist zu Ende.** Es gibt nichts mehr zu triagieren; jedes Issue trägt einen umsetzbaren Brief.

## completed (diese Session)

**Alle acht offenen Issues triagiert, jeweils mit Verifikation am Code und einem Agent- bzw. Human-Brief als Kommentar.** Die Briefs sind bewusst pfad- und zeilenfrei geschrieben (Skill-Vorgabe: sie müssen überleben, wenn sich der Code bewegt) und nennen stattdessen Funktions- und Typnamen.

| Issue | Kategorie | State | Kommentar |
|---|---|---|---|
| #53 | bug | ready-for-agent | [5385492559](https://github.com/rodgi040/munkel/issues/53#issuecomment-5385492559) |
| #54 | bug | ready-for-agent | [5385600059](https://github.com/rodgi040/munkel/issues/54#issuecomment-5385600059) |
| #56 | bug | ready-for-agent | [5385903811](https://github.com/rodgi040/munkel/issues/56#issuecomment-5385903811) |
| #60 | enhancement | ready-for-human | [5385921411](https://github.com/rodgi040/munkel/issues/60#issuecomment-5385921411) |
| #61 | enhancement | ready-for-agent | [5385965924](https://github.com/rodgi040/munkel/issues/61#issuecomment-5385965924) |
| #62 | enhancement | ready-for-agent | [5385975296](https://github.com/rodgi040/munkel/issues/62#issuecomment-5385975296) |
| #64 | bug | ready-for-agent | [5386007496](https://github.com/rodgi040/munkel/issues/64#issuecomment-5386007496) |
| #67 | bug | ready-for-agent | [5386015864](https://github.com/rodgi040/munkel/issues/67#issuecomment-5386015864) |
| #69 | *(keine)* | ready-for-human | neu angelegt, Abspaltung aus #53 |

**Sieben Befunde, die die jeweilige Aufgabe gegenüber dem Issue-Text verändert haben.** Sie stehen ausführlich in den verlinkten Kommentaren; hier nur, damit niemand sie beim Umsetzen übersieht:

1. **#54 — die im Issue beschriebene Reproduktion ist bereits geschlossen.** Der CLI-Pfad (`control-handlers.ts`) prüft `stat()`, Endung und `MAX_IMAGE_FILE_SIZE` vor `sendImages`. Die echte Lücke ist der **Renderer/IPC-Pfad** (`session-handlers.ts` → `session-store.ts`), der nur das Sender-Fenster prüft. Dazu eine Schwellendivergenz: CLI 50 MiB gegen Codec 32 MiB — acht Dateien im Band dazwischen werden voll gelesen (~400 MB) und dann abgelehnt.
2. **#54 — der macOS-Vergleich im Issue ist nicht deckungsgleich.** `GroupSession.swift:sendImages` nimmt `[Data]`, keine Pfade; das Read-vor-Guard-Problem existiert dort auf dieser Ebene gar nicht. Divergent ist nur das Fehlerverhalten (`compactMap` vs. `throw`).
3. **#56 — zwei Methodennamen im Issue stimmen nicht.** Der Block sitzt in `confirmInstall()`, nicht `install()`. `declineInstall()` existiert nicht; die Methode heißt `cancelInstall()`.
4. **#56 — ein grüner Test zementiert den Wedge als Soll-Verhalten.** `it('ignores cancel while an install is already in flight')` in `update-service.test.ts`, mit dem Kommentar *„quitAndInstall is a no-op here, so installing stays true"*. Wer #56 fixt, **muss diesen Test umschreiben**. Steht als Akzeptanzkriterium im Brief.
5. **#61 — die im Issue vorgeschlagene Richtung ist die gefährliche.** Ein eigener NSIS-`uninstall.nsh`-Hook läuft bei electron-builder **auch während eines Auto-Updates** und hätte bei jedem Update die Kanäle gelöscht. Die eingebaute Option `deleteAppDataOnUninstall` hängt am `Updated`-Makro (`--updated`-Flag) und ist dagegen abgesichert.
6. **#64 — Verursacher und verlorenes JSX sind nachgewiesen.** Hinzugefügt in `fa37329`, verloren im Merge **`3ed68fa`** (`macos-parity-p1` → `v2-clean`): Parent `3ad4e75` hatte es, Parent `526548d` nicht, Ergebnis nicht. Derselbe Merge, der auch `ref`/`data-testid`/`collapsible`/`pulse` verlor (in #48 repariert). **Aber ein wörtlicher Restore wäre falsch:** `previewImage` war damals ein abgeleiteter Wert aus `previewImageID`, heute ist es der `useState` der Klick-Lightbox. Gleicher Name, andere Bedeutung — ein Verbatim-Restore hätte die Kollisionsklasse aus #52/#59 ein drittes Mal erzeugt.
7. **#67 — die Ursache ist nicht die im Issue vermutete.** Der in CI benannte Test hängt an keiner Debounce-Konstante, sondern an `waitFor`, das alle 10 ms gegen eine **Wanduhr-Frist von 2000 ms** pollt — um einen **echten WebSocket-Handshake** herum (`new WebSocketServer({ port: 0 })`). Fake Timer würden hier schaden. **Dieselbe Helfer-Kopie steckt auch in `relay-client.test.ts`** — dort latent, noch nicht beobachtet.

**#60 — Recherche, die die Fragestellung ersetzt.** Die OV-vs-EV-Frage ist überholt:

- Seit **1. Juni 2023** verlangen die CA/Browser-Forum-Baseline-Requirements FIPS-140-2-L2-Hardware für den privaten Schlüssel — **auch für OV**. Eine herunterladbare `.pfx` für ein Repository-Secret gibt es von keiner öffentlichen CA mehr. Schritt 2 im Issue ist damit nicht ausführbar.
- Seit **1. März 2026** maximale Gültigkeit 458 Tage (SSL.com setzt seit 27.02.2026 durch) → jährliche Verlängerungspflicht.
- Echte Gabelung: Hardware-Token (bräuchte self-hosted Runner mit permanent gestecktem Stick) gegen Cloud-Signing per API.
- **Azure Artifact Signing** (ex Trusted Signing) ist mit $9.99/Monat mit Abstand am günstigsten, aber geografisch beschränkt — **Einzelpersonen nur USA/Kanada, Organisationen USA/Kanada/EU/UK**. Für einen Maintainer in der EU entscheidet also die Rechtsform, ob der günstigste Anbieter überhaupt zur Verfügung steht.
- Zwei Risiken vor dem Kauf: `publisherName` muss exakt dem Common Name entsprechen (sonst baut das Release sauber und verweigert das Update), und die Annahme „EV umgeht die SmartScreen-Reputationsphase" hält für Cloud-Signing möglicherweise nicht — electron-builder #8696 beschreibt genau diesen Umstieg und wurde ohne Antwort als *not planned* geschlossen.

**#53 abgeschlossen und #69 abgespalten.** #53 ist auf den belegbaren Scope eingedampft (falscher Kommentar an `generatePipeName`, ehrliche Doku dessen, was die Pipe schützt). Die ungemessene Frage — kann ein *anderer* User sich verbinden — steckt in **#69**, `ready-for-human`, weil sie ein zweites Windows-Konto braucht.

## Befund mit Folgen für die Umsetzung: `.planning/` ist die Quelle von drei Issues

`.planning/` (Stand ~07.07.2026, aus einer alten Security-Audit-Runde) enthält Pläne, die drei der jetzt triagierten Issues **verursacht haben**. Wer die Issues umsetzt, muss diese Pläne kennen, sonst dreht er bewusste Entscheidungen versehentlich zurück:

- **`p0-02-named-pipe-dacl-fix-plan.md`** (Commit `4bec34f`, Status „✅ umgesetzt und verifiziert") ist die Quelle von #53. Seine Entscheidungstabelle wählt „Zufälliger Pipe-Name + geschützte Datei" mit der Begründung *„gleichwertiger Schutz durch Geheimhaltung des Namens"* — genau die falsche Prämisse, die #53 meldet. Der falsche Kommentar im Code ist die Verschriftlichung dieser Planzeile. **Der Plan sollte mitkorrigiert werden**, sonst steht die Fehlannahme weiter als abgesegnete Entscheidung im Repo.
- **`p0-11-sendimages-parallel-fix-plan.md`** ist die Quelle von #54s `Promise.all`. Die Parallelisierung war **Absicht** — vorher lief eine sequentielle `for...of`-Schleife, und der Plan wollte die Upload-Parallelität von macOS nachbauen. Beim Fix für #54 gilt also: **Upload-Parallelität erhalten, nur die Read-Nebenläufigkeit beschränken.** Ein pauschales Zurück auf sequentiell wäre eine Regression gegen eine bewusste Entscheidung.
- **`p0-12-update-signature-fix-plan.md`** ist die Quelle von #56. Seine Follow-up-Härtung schreibt wörtlich *„Synchroner Fehler in `quitAndInstall` darf den State nicht festkeilen"* und *„`cancelInstall()` während eines laufenden Installs ignorieren"* — beides bewusst. Der grüne Test aus Befund 4 stammt aus dieser Entscheidung. Der Brief für #56 respektiert das: Abbruch **während eines echten laufenden Installs** darf weiter ignoriert werden; was sich ändern muss, ist nur, dass der In-Flight-Zustand nicht mehr dauerhaft ist.

## remaining (in Reihenfolge, mit Begründung der Reihenfolge)

1. **#67 zuerst** — nicht wegen Severity (`minor`), sondern weil es die Verifikation aller anderen Fixes untergräbt. Der etablierte Prozess dieses Projekts ist „Red/Green-Nachweis vor jedem Merge"; der ist wertlos, solange grün „grün diesmal" heißt. Bei PR #68 musste ein Fehlschlag erst als Flakiness bewiesen werden (3× lokal grün + Re-Run), bevor gemerged werden konnte. Jeder weitere Fix zahlt diesen Aufschlag erneut.
2. **#64** — höchster Nutzerwert der Restlichen: heute zieht Hover das Fenster auf Arbeitsflächengröße auf, klaut den Fokus und zeigt nichts. Das JSX ist geborgen, der Fallstrick benannt — kurze Aufgabe mit klarem Ziel.
3. **#54** — `severity: major`, Speicher-Guard. Vorher `p0-11` lesen (siehe oben).
4. **#56** — `severity: major`, Update-Wedge. Vorher `p0-12` lesen.
5. **#53** — kleiner Doku-Fix, gehört zusammen mit der Korrektur von `p0-02`.
6. **#61** — ein Konfigurationsschalter plus PRIVACY.md-Ergänzung; braucht aber einen echten Install/Uninstall/Update-Zyklus zur Verifikation.
7. **#62** — Workflow-Umbau, muss gegen einen echten Tag-Push verifiziert werden.
8. **#70** — reiner Doku-Fix (`SECURITY.md`, `README.md`, ein Kommentar in `electron-builder.yml`), keine Abhängigkeiten, jederzeit einschiebbar. Wird durch die unsignierte Auslieferung dringender, nicht weniger dringend.
9. **#60** — **nicht mehr blockiert, zurückgestellt.** Team hat entschieden, vorerst nicht zu signieren. Bleibt als Tracker offen, heute nichts zu tun.
10. **#69** — blockiert auf einem zweiten Windows-Konto.

## decisions

Alle sieben Entscheidungen dieser Session, wortgleich wie vom User gewählt:

- **#53: „Kommentar-Fix eindampfen + Messung als Folge-Issue (empfohlen)"** — #53 wird `ready-for-agent` mit dem belegbaren Scope; separates Issue für die Messung.
- **#54: „Rest senden, macOS-Parität (empfohlen)"** — ungültige Bilder werden verworfen, die gültigen gehen raus; nur wenn alle scheitern, schlägt der Send fehl. Mit Rückmeldung an den Nutzer, welche wegfielen — stilles Verwerfen wäre schlechter als der heutige Abbruch.
- **#56: „Injizierter Timer (empfohlen)"** — kein `app`-Handle im Service; die Abwesenheit einer Electron-Referenz ist genau das, was ihn testbar hält.
- **#60: „Erst recherchieren, dann Brief (empfohlen)"** — Ergebnis oben.
- **#61: „Löschen via eingebautem Flag (empfohlen)"** — `deleteAppDataOnUninstall: true`. Deinstallieren heißt weg, inklusive Kanalcodes. Preis akzeptiert: Neuinstallation heißt alle Kanäle neu beitreten.
- **#62: „Getrennte Tag-Namensräume (empfohlen)"** — `v*` bleibt macOS/Upstream, Windows bekommt ein eigenes Präfix. Akzeptierter Preis: Fork-spezifische Divergenz in `release.yml`.
- **#64: „Wiederherstellen, mit sauberer Autorität (empfohlen)"** — Hover-Overlay zurück, Bindung korrigiert, ausdrückliche Regel welches System die Oberfläche besitzt.
- **#60, nach der Team-Antwort: „Öffentlich unsigniert ausliefern, Risiko dokumentieren"** — `release-blocker` runter, das Risiko wird zur bewusst akzeptierten Position, die ehrliche Dokumentation in `SECURITY.md` und `README.md` damit zwingend und nicht optional (→ #70).

Weiter gültig aus früheren Sessions:

- **Auto-Close greift in diesem Workflow nicht.** GitHub schließt `Closes #N` nur beim Merge in den Default-Branch; wir mergen nach `v2-clean`. Jeder Windows-PR braucht ein manuelles Close.
- **Red/Green-Nachweis vor jedem Merge**, und **vor dem Experiment committen** (`git checkout -- <datei>` hat einmal uncommittete Executor-Arbeit gelöscht).
- **Merge-Marker ohne `v`-Präfix taggen** (`windows/fix/…`) — wird durch #62 gegenstandslos, gilt bis dahin weiter.
- **Der graphify-Graph ist veraltet und irreführend.** Diese Session hat es erneut bestätigt: er mischt relative Pfade mit absoluten aus einem **anderen Checkout** (`C:/Users/rodgi/OneDrive/Documents/CODING/Test/munkel/...`) und zeigt weiter auf `apps/windows/src/core/control.ts` / `apps/cli/src/control.ts`, die seit PR #33 nicht existieren. Für alle Code-Fragen dieser Session wurde direkt am Code gelesen. `graphify extract --force` würde das schließen.

## Nachtrag am selben Tag: Team-Antwort zu #60 — „vorerst keine eigene Signierung"

Die Frage aus #60 wurde upstream als limehq/munkel#235 gestellt und beantwortet: **es wird vorerst keine Signatur-Identität beschafft.** Entscheidung des Users daraufhin: **öffentlich unsigniert ausliefern und das Risiko dokumentieren.**

Angewendet:

- **`release-blocker` von #60 entfernt** — das Label behauptete eine Sperre, die es nach der Entscheidung nicht mehr gibt. Es gibt jetzt **kein** offenes `release-blocker`-Issue mehr.
- **#60 bleibt offen als Signing-Tracker**, zurückgestellt bis die Rechtsform-Frage neu aufgerufen wird. Heute nichts zu tun; die Recherche im Kommentar bleibt gültig und erspart die Neuherleitung.
- **limehq/munkel#235 mit der Antwort geschlossen**, samt der drei nicht verfallenden Randbedingungen (keine `.pfx` mehr seit Juni 2023 auch für OV; 458 Tage Maximalgültigkeit seit März 2026; Azure-Eignung nach Rechtsform und Land).
- **#70 neu angelegt** (`bug`, `security`, `ready-for-agent`) für die Arbeit, die aus der Entscheidung folgt.

**Der Befund, der #70 nötig macht:** `SECURITY.md` beschreibt den Update-Weg ausschließlich in macOS-Begriffen („Sparkle, EdDSA-signed, notarized") **ohne zu sagen, dass das nur für macOS gilt**, und erwähnt Windows-Updates gar nicht — also auch nicht, dass `verifyUpdateCodeSignature` aus ist. `README.md:9` nennt nur das kosmetische Symptom samt Umgehung („Run anyway"). Ein Leser schließt daraus zu Recht auf dieselbe Garantie wie auf macOS. Dieselbe Fehlerklasse wie #53.

Präzise Formulierung für #70, damit die Korrektur nicht ins andere Extrem kippt: **Integrität wird sehr wohl geprüft** (Prüfsumme aus `latest.yml`, über HTTPS von GitHub Releases), **die Herausgeber-Identität nicht**. Die Vertrauensgrenze ist damit der Release-Feed.

## blockers

- **#69** — braucht ein zweites Windows-Benutzerkonto, gleichzeitig angemeldet. Einziger echter Blocker.
- **#60** — **nicht mehr blockiert, sondern bewusst zurückgestellt.** Die Team-Antwort liegt vor; es wartet auf nichts mehr, es ist entschieden.
- **#67** — kein harter Blocker, aber ein Aufschlag auf jeden anderen Fix; deshalb steht es an Position 1.
- Sonst keine.

## next_action

**#67 umsetzen.** Konkret der erste Schritt aus dem Brief: die Suite unter absichtlicher Last laufen lassen und die fehlschlagenden Testnamen einfangen — nicht in Isolation reproduzieren, das funktioniert nachweislich nicht. Danach pro Fehlschlag nach Mechanismus reparieren: echtes I/O → auf das Ereignis warten statt Frist pollen (beide `waitFor`-Kopien, `group-session.test.ts` **und** `relay-client.test.ts`); echte Debounce → injizierte Uhr nach dem Muster von `useNotchLifecycle.test.ts`.

Arbeitsteilung wie etabliert: Grok 4.6 (Cursor CLI) plant mit inline im Prompt stehendem Kontext, Sonnet-Subagent setzt um, Kimi/DeepSeek verifiziert über `bash ~/.claude/agents/delegate.sh --to kimi --readonly --model ds`. Eigener eigener Red/Green-Nachweis, Commit, PR nach `platform/windows/v2-clean`, manuelles Close des Issues.

**Offen und noch nicht getan:** die Querverweise auf `.planning/p0-02`, `p0-11` und `p0-12` stehen bisher nur hier im Handoff, **nicht in den Issues #53, #54 und #56**. Ein Agent, der nur vom Issue aus arbeitet, sieht sie nicht. Entweder als Kommentar nachtragen oder beim Umsetzen aktiv mitgeben.

## suggested_skills

- `/fp-resume` zum Wiederaufsetzen
- `/fp-debug` für #67 — es ist ein echter Defekt mit Reproduktionsbedarf, nicht eine geplante Änderung
- `delegate` für Cursor/Kimi — immer über `~/.claude/agents/delegate.sh`, nie `herdr` direkt; Kimi-Wrapper **nur im Foreground** (siehe Memory `kimi-delegate-wrapper-must-run-foreground`)
- `gh issue` / `gh pr` gegen `--repo rodgi040/munkel`; PRs nach `platform/windows/v2-clean`, nie nach `main`
- `/triage` wird **nicht** mehr gebraucht — die Runde ist zu Ende. Es ist ohnehin nur vom User aufrufbar (`disable-model-invocation`).

---

# Handoff — munkel (2026-08-23, Vormittag — Triage-Runde gestartet)

> **Wiederaufsetz-Punkt (2026-08-23) — Triage-Runde läuft, pausiert mitten in #53.**
> Ältere Abschnitte bleiben historischer Record.

## current_state

- **Branch:** `platform/windows/v2-clean`, Tip `c10ed37` (Docs-Commit nach dem PR-#68-Merge `eaea5e2`). Uncommitted: nur `HANDOFF.md` + `STATE.md` aus dieser Pause. Bewusst untracked: `Debugging/`, `kimi-export-session_-20260722-145402.md`.
- **Kein Code geändert** in dieser Session — reine Triage- und Aufräumarbeit auf GitHub.
- **Offene Issues: 8** (vorher 12). Kein offener externer PR; #45 ist eigener und fällt aus der Triage-Discovery.
- **Laufende Aktivität:** `/triage` (mattpocock-skills) über alle offenen Issues, ältestes zuerst. #53 ist angefangen, Entscheidung steht aus — siehe `in_progress_exchange`.

## completed (diese Session)

**Befund: Auto-Close greift in diesem Workflow grundsätzlich nicht.** GitHub schließt `Closes #N` nur beim Merge in den **Default-Branch**. Wir mergen nach `platform/windows/v2-clean`, also bleiben Issues nach dem Merge offen und müssen von Hand geschlossen werden. Das betrifft jeden künftigen Windows-PR, nicht nur die vier unten.

**Vier faktisch erledigte Issues geschlossen** (`--reason completed`, jeweils mit Merge-Commit, Dateipfaden und dem Hinweis auf das nicht greifende Auto-Close):

- **#51** ← PR #66 (`527a0f0`) — Grapheme-Clamp
- **#52** ← PR #63 (`4c38884`) — CSS-Kollision Klick-Lightbox
- **#55** ← PR #68 (`eaea5e2`) — blob-download-Timeout
- **#57** ← PR #65 (`bcfa94d`) — verwaister `preview`-State

**Triage-Infrastruktur angelegt:** Die vier fehlenden State-Labels existieren jetzt in `rodgi040/munkel` — `needs-triage` (D93F0B), `needs-info` (FBCA04), `ready-for-agent` (0E8A16), `ready-for-human` (1D76DB). `bug`, `enhancement` und `wontfix` gab es bereits, damit ist das kanonische Mapping des Triage-Skills vollständig. Kein `/setup-matt-pocock-skills` nötig.

**#53 verifiziert (CONFIRMED)**, Belege:

- `packages/shared-wire/src/control.ts:71-74` — der Kommentar an `generatePipeName` behauptet, der Zufallssuffix ersetze die DACL
- `apps/windows/src/main/main.ts:600` — der Server nutzt tatsächlich `generatePipeName()`, nicht den Legacy-Namen
- `packages/shared-wire/src/transport.ts:44-70` — `createControlServer` geht direkt von `JSON.parse(line)` auf `handler(request)`, kein Peer-Check
- Grep nach `secret|handshake|authenticate|authoriz|peercred|sid` über den gesamten Control-Pfad: **leer**
- Enumeration reproduziert: `[System.IO.Directory]::GetFiles` auf dem Pipe-Namespace listet **1640 Pipes** mit vollen Namen aus einem unprivilegierten Prozess
- POSIX ist nicht betroffen: der Socket liegt unter einem `0o700`-Verzeichnis, dort greift Dateisystem-Schutz

## remaining (in Reihenfolge)

1. **#53** — Entscheidung offen, siehe `in_progress_exchange`. Danach Label + Agent-Brief.
2. **#54** Album-`readFile` vor dem Size-Guard (`stat()` davor). Offene Frage im Issue: all-or-nothing vs. partial — macOS sendet den Rest.
3. **#56** Update-Wedge — `installing` bleibt `true`, wenn `quitAndInstall` still fehlschlägt, und blockiert `confirmInstall`, `declineInstall` und `check` bis zum Neustart.
4. **#60** Authenticode — Nutzerentscheidung OV vs. EV. Einziges Issue mit `release-blocker`.
5. **#61** Uninstall-Politik für `%APPDATA%\munkel` — Produktentscheidung.
6. **#62** Tag-Governance — ein `v*`-Tag auf beliebigem Branch löst einen Release-Lauf aus.
7. **#64** `ImagePreviewOverlay` importiert, nie gerendert — **zuerst die Merge-Historie prüfen**, die Render-Stelle ist vermutlich wiederherstellbar statt neu zu schreiben.
8. **#67** flaky Tests unter Last — Testnamen unter absichtlicher Last einfangen, nicht in Isolation suchen.

## decisions

- **Reihenfolge:** erst die vier erledigten Issues abräumen, dann ältestes zuerst durch die verbleibenden acht (User, diese Session).
- **State-Labels anlegen statt `/setup-matt-pocock-skills`** (User, diese Session) — das Mapping war bis auf die vier State-Labels ohnehin deckungsgleich.
- **Die Empfehlung „Shared Secret" für #53 aus dem 2026-08-22-Handoff ist überholt.** Begründung siehe `in_progress_exchange`; sie stand dort ohne die Threat-Model-Prüfung.
- **Der graphify-Graph ist veraltet und führt in die Irre.** Er zeigt `apps/windows/src/core/control.ts` und `apps/cli/src/control.ts`; beide existieren nicht mehr — die Konsolidierung nach `packages/shared-wire/` (PR #33, Ponytail Phase 1) ist nicht im Graph. Vor Verlass auf Pfade aus `graphify query` mit `ls` gegenprüfen, oder `graphify extract --force` laufen lassen.

## in_progress_exchange

**#53 — Control-Pipe, Entscheidungsfrage offen.** Kein Decision-Log auf Platte; der Zustand ist dieser Abschnitt plus die Verifikationsbelege oben. Die Triage-Schritte 1–3 (Kontext, Empfehlung, Verifikation) sind durch, Schritt 5 (Outcome anwenden) fehlt.

**Der Befund, der die Entscheidung nötig macht:** Beide im Issue vorgeschlagenen Fixes lösen das Threat Model nicht, das im Issue selbst steht. Das Issue schreibt „requires local code execution as the same user". Eine DACL auf die User-SID *erlaubt* genau diesen User. Ein Shared Secret in `%LOCALAPPDATA%` kann genau dieser User lesen. Beide schützen gegen *andere* User auf der Maschine — gegen den benannten Angreifer keine von beiden.

Damit zerfällt #53 in zwei Fragen:

1. **Der Kommentar behauptet eine Garantie, die es nicht gibt.** Unstrittig falsch, gehört unabhängig von allem anderen raus.
2. **Ist die Pipe heute gegen *andere* User dicht?** Ungemessen. libuv bindet mit Default-Security-Descriptor; ob das reicht, ist eine Messung und braucht einen zweiten Benutzerkonto-Kontext, der in dieser Session nicht verfügbar war.

**Die offene Frage an den User, wortgleich wie gestellt:**

- **Auf Kommentar-Fix eindampfen + Messung als Folge-Issue (empfohlen)** — #53 wird `ready-for-agent` mit dem belegbaren Scope: falschen Kommentar entfernen, ehrlich dokumentieren was die Pipe schützt und was nicht. Separates Issue für die Messung, ob ein anderer User zugreifen kann.
- **Shared Secret trotzdem umsetzen** — Handshake gegen ein Secret in `%LOCALAPPDATA%`. Schützt gegen andere User, nicht gegen den im Threat Model genannten Angreifer, aber Defense in Depth und billig.
- **Natives Modul mit echter DACL** — gleiche Schutzwirkung wie Shared Secret, aber native Abhängigkeit im Build: node-gyp, Rebuild pro Electron-Version, Signing der `.node`-Datei.
- **`wontfix`** — Kommentar beiläufig im nächsten Windows-PR mitfixen.

## blockers

- **#53** wartet auf die Entscheidung oben.
- **#60 Authenticode** — Zertifikatsbeschaffung (OV vs. EV), reine Nutzerentscheidung.
- **#61 Uninstall-Politik** für `%APPDATA%\munkel` — Produktentscheidung.
- **#67** macht jedes grüne CI angreifbar: bei PR #68 musste erst bewiesen werden, dass ein Fehlschlag Flakiness war (3× lokal grün, Re-Run desselben Commits grün), bevor gemerged werden konnte. Kein harter Blocker, aber ein Aufschlag auf jedes weitere Issue.

## next_action

`/triage` fortsetzen bei **#53**: die vier Optionen im `in_progress_exchange` dem User vorlegen, Entscheidung anwenden (Label + Kommentar bzw. Close), dann weiter mit **#54**. Die Triage-Schritte 1–3 für #53 nicht wiederholen — die Verifikation steht oben.

## suggested_skills

- `/fp-resume`
- `/triage` — **nur vom User aufrufbar** (`disable-model-invocation`). Nicht selbst per Skill-Tool starten und den Ablauf nicht nachbauen.
- `delegate` — für Cursor/Kimi-Aufrufe, immer über `delegate.sh`, nie `herdr` direkt
- `gh issue` / `gh pr` gegen `--repo rodgi040/munkel`; PRs nach `platform/windows/v2-clean`

Pflicht-Präfix für jeden Triage-Kommentar (Skill-Vorgabe, erste Zeile): ein Blockquote mit dem Hinweis, dass der Kommentar während der Triage von einer KI erzeugt wurde.

---

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
