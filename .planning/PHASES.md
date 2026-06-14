# Windows Integration Phases

Use this file for implementation-level tracking. `ROADMAP.md` gives the ordered
feature list; this file gives scope, exclusions, done criteria, likely files,
and tests for each phase.

---

## Phase 1: Stack and Architecture Decision

Status: **Completed**

Goal: Decide the Windows architecture before writing scaffold code.

Scope:

- Compare Windows UI/runtime stack options.
- Decide local IPC transport for CLI-to-app control.
- Decide crypto/protocol implementation strategy.
- Decide initial identity approach: GitHub device flow or manual display name.
- Decide packaging direction enough to guide scaffolding.
- Document accepted decisions in `DECISIONS.md`.

Out of scope:

- Creating `apps/windows/` or `packages/munkel-core/`.
- Implementing crypto, relay sessions, UI, or CLI changes.
- Release automation or changelog work.

Likely affected files:

- `.planning/DECISIONS.md`
- `.planning/STATE.md`
- `.planning/HANDOFF.md`
- `.planning/ROADMAP.md`

Done criteria:

- UI/runtime stack is accepted (Electron).
- IPC transport is accepted (named pipes).
- Crypto/protocol strategy is accepted (Node.js `crypto` / TypeScript).
- Packaging direction is accepted or explicitly deferred (MSIX via Electron tooling, unpackaged dev).
- Capture-exclusion and UI paradigm decisions are recorded.
- Next phase can scaffold without revisiting foundational choices.

Tests/checks:

- Documentation review only.

---

## Phase 2: Shared Core Package

Status: **Completed**

Goal: Create `packages/munkel-core/` as the single source of truth for
protocol, crypto, relay primitives, and local IPC transport used by both the
Electron app and the CLI.

Scope:

- Scaffold `packages/munkel-core/` with TypeScript, Vitest, and workspace wiring.
- Port client-side protocol types from `apps/server/src/protocol.ts`.
- Implement circle-code normalization (NFC, trim, lowercase).
- Implement HKDF-SHA256 derivation for `groupId` and `messageKey`.
- Implement AES-256-GCM seal/open with random 12-byte nonce, empty AAD, and
  `base64(nonce || ciphertext || tag)` layout.
- Implement `chat` and `profile` app-payload encoding/decoding.
- Define avatar codec interface and a reference implementation.
- Implement named-pipe transport helpers (`createControlServer`,
  `createControlClient`).
- Implement control-protocol request/response types matching
  `ControlProtocol.swift`.
- Add unit tests with golden vectors.

Out of scope:

- Electron-specific UI or shell code.
- Full relay client lifecycle (reconnect logic lives in the app).
- macOS-specific Unix-socket server implementation (the package may model it,
  but macOS server code stays in Swift).
- CLI argument parsing.

Likely affected files:

- `packages/munkel-core/`
- `package.json` (workspaces)
- `turbo.json`
- `apps/server/src/protocol.ts` only if a shared extraction is attempted
  (prefer copying/adapting client types to keep server untouched).

Done criteria:

- `packages/munkel-core/` builds with `tsc --noEmit`.
- All unit tests pass.
- `groupId` for `blue-table-42` matches the pinned reference vector
  (`aaf5dc7308fe4bede46cdebc9390813d`).
- Windows can seal a payload that `dev-send.ts` can open, and vice versa.
- Named-pipe server/client helpers pass a local round-trip test.

Tests/checks:

- `bun run typecheck` in `packages/munkel-core/`.
- Vitest unit tests for normalization, derivation, AES-GCM, payload encoding.
- Interop test against `apps/server/scripts/dev-send.ts`.

---

## Phase 3: Windows App Scaffold

Status: **Completed**

Goal: Add a minimal Electron project under `apps/windows/` with the selected
project structure, build tooling, and a runnable shell.

Scope:

- Create `apps/windows/` with Electron + Vite + React.
- Add main-process entry point.
- Implement single-instance lock (`app.requestSingleInstanceLock`).
- Add system-tray icon and tray menu.
- Add a minimal renderer window and preload script with `contextBridge`.
- Wire `apps/windows/` into root `package.json` workspaces and `turbo.json`.
- Add Windows-specific `.gitignore` rules for build artifacts.
- Document local build/run commands.

Out of scope:

- Relay client, crypto, or session state.
- Named-pipe control server.
- Full UI flows.
- Packaging release artifacts.

Likely affected files:

- `apps/windows/`
- `package.json`
- `turbo.json`
- `.gitignore`
- `README.md` if development commands are useful immediately.

Done criteria:

- Windows app scaffold builds locally on Windows.
- `bun run dev` (or equivalent) starts the Electron app.
- Tray icon is visible and menu opens.
- Repo tooling recognizes the app.
- Generated user/machine-specific files are ignored.

Tests/checks:

- Run the selected Windows build command.
- Run `bun run typecheck` if root workspace metadata changes.

---

## Phase 4: Protocol and Crypto Compatibility in the App

Status: **In Progress**

Goal: Integrate `munkel-core` into the Electron app and prove Windows produces
compatible crypto bytes and payloads.

Scope:

- Add `munkel-core` dependency to `apps/windows/`.
- Wire crypto helpers into the main process.
- Add a dev-only "derive group" debug flow.
- Verify golden vectors against `CryptoTests.swift` and `dev-send.ts`.
- Add payload round-trip tests inside the app.

Out of scope:

- UI display of derived values beyond debug output.
- Relay connection.
- Avatar UI.

Likely affected files:

- `apps/windows/`
- `packages/munkel-core/`

Done criteria:

- App can derive the same `groupId`/`messageKey` as macOS from the same code.
- App can seal/open payloads compatible with Swift and `dev-send.ts`.
- Crypto code runs only in the main process; renderer never holds raw keys.

Tests/checks:

- Golden-vector tests in `packages/munkel-core/`.
- App-level smoke test that crypto functions are reachable from main.

---

## Phase 5: Relay and Session Client

Status: **Pending**

Goal: Connect the Windows app to the relay and handle live circle sessions.

Scope:

- Implement `RelayClient` in the main process using `munkel-core` protocol types.
- Implement `GroupSession` (one per joined circle).
- Implement member list and presence tracking.
- Handle server frames: `welcome`, `peer-joined`, `peer-left`, `message`,
  `pong`, `error`.
- Implement auto-reconnect with exponential backoff (1 s → 30 s cap).
- Implement 30-second ping loop.
- Implement profile broadcast on join and on `peer-joined`.
- Implement encrypted send for `chat` and `profile` payloads.

Out of scope:

- Rich Windows UI polish.
- CLI IPC.
- Offline message history.
- Capture-exclusion research.

Likely affected files:

- `apps/windows/`
- `packages/munkel-core/`
- `apps/server/src/protocol.ts` only if a protocol issue is discovered.

Done criteria:

- Windows can join a circle against local or production relay.
- Windows can send and receive encrypted messages with another reference client.
- Presence changes are reflected in app state.
- Reconnect and ping behavior follow protocol expectations.

Tests/checks:

- Unit tests for frame parsing and session state.
- Manual or scripted interop test against `apps/server/scripts/dev-send.ts`.
- Manual interop test against a running macOS app.

---

## Phase 6: Windows Shell and UI

Status: **Pending**

Goal: Complete the first usable Windows app experience. The UI shell (tray,
menu, palette, notch widget) is already built in Phase 3; remaining work is
wiring real data and capture-exclusion research.

Scope:

- Add identity persistence (`memberId`, display name, avatar) in `userData`.
- Implement GitHub device-flow UI in the renderer.
- Implement join/create circle flow.
- Implement main tray window with circle list and connection state.
- Implement member list inside each circle.
- Implement inline send flow.
- Implement macOS-like notch widget (frameless, top-edge, animated show/hide).
- Implement incoming-message display queue with hover-to-hold.
- Implement reply, copy, and 60-second prune behavior.
- Implement quick-send palette with global hotkey.
- Research capture-exclusion options and document findings for v3.

Out of scope:

- Store-ready packaging.
- Advanced animations or nonessential polish.
- Changing macOS UI.
- Capture-exclusion implementation in v1.

Likely affected files:

- `apps/windows/`
- `packages/munkel-core/` if avatar codec needs adjustments.
- `README.md` only if user-facing development instructions change.

Done criteria:

- A user can join a circle and see connection/member state.
- A user can send a message.
- Incoming messages are visible in the notch widget.
- Capture-exclusion decision is recorded, implemented, or explicitly deferred.

Tests/checks:

- UI smoke test/manual verification.
- Any automated tests supported by the selected stack.

---

## Phase 7: CLI Windows IPC

Status: **Pending**

Goal: Make the `munkel` CLI control the Windows app on Windows.

Scope:

- Add platform detection to `apps/cli/src/munkel.ts`.
- Implement Windows named-pipe client using `munkel-core` transport helpers.
- Preserve macOS Unix-domain socket behavior unchanged.
- Define and implement Windows app auto-start if practical.
- Keep request/response JSON shape compatible unless a decision says otherwise.

Out of scope:

- Moving crypto into the CLI.
- Breaking macOS CLI behavior.
- Release packaging.

Likely affected files:

- `apps/cli/src/munkel.ts`
- `apps/cli/test/`
- `packages/munkel-core/`
- `apps/windows/`
- Shared protocol docs if needed.

Done criteria:

- `munkel circles` works through the Windows app.
- `munkel <circle> <recipient|all> <message>` works through the Windows app.
- macOS CLI tests still pass.

Tests/checks:

- CLI unit tests for platform transport selection.
- Windows IPC integration test if practical.
- Existing CLI tests.

---

## Phase 8: Tests, CI, Docs, Packaging

Status: **Pending**

Goal: Make Windows support maintainable and documented.

Scope:

- Add or update CI for Windows validation.
- Add docs for Windows development and local testing.
- Document packaging direction.
- Update launch platform docs if distribution planning is in scope.

Out of scope:

- Automatic release tooling.
- Version bumps.
- Changelog generation.
- Publishing artifacts.

Likely affected files:

- `.github/workflows/`
- `README.md`
- `docs/launch-platforms.md`
- `apps/windows/`
- `packages/munkel-core/`

Done criteria:

- Windows build/test path is documented.
- CI validates what can reasonably be validated.
- Packaging decision is recorded.
- No release automation is run.

Tests/checks:

- `bun run typecheck`.
- Affected package tests.
- Windows build command.
- CI workflow syntax review.
