# Windows Integration Roadmap

This roadmap is the source of truth for the order in which the Windows client is
built. Detailed scope, done criteria, and tests for each phase live in
`PHASES.md`; current status lives in `STATE.md`.

The chosen architecture is **Option B**: a shared `packages/munkel-core/`
library that owns protocol, crypto, relay, and transport abstractions, plus an
Electron app under `apps/windows/` that owns the UI and shell.

---

## Phase 1: Stack and Architecture Decision

Status: **Completed**

Goal: Decide the Windows app stack and document how the Windows client maps to
the existing Munkel architecture before scaffolding code.

Key outcomes:

- Windows UI/runtime stack changed from WinUI 3 to **Electron**.
- Local IPC transport selected: **Windows named pipes**.
- Crypto/protocol implementation selected: **TypeScript with Node.js `crypto`**.
- Packaging direction confirmed: **MSIX via Electron tooling**, unpackaged during development.
- Capture-exclusion deferred to v3; macOS-like notch widget chosen for v1 UI.
- Decisions recorded in `DECISIONS.md`.

---

## Phase 2: Shared Core Package (`packages/munkel-core/`)

Status: **Pending**

Goal: Create one source of truth for cross-platform protocol, crypto, and
transport logic used by both the Electron app and the CLI.

Feature order:

1. Scaffold `packages/munkel-core/` (package.json, tsconfig, Vitest, Turbo wiring).
2. Port client-side protocol types from `apps/server/src/protocol.ts`.
3. Implement circle-code normalization (NFC, trim, lowercase).
4. Implement HKDF-SHA256 key derivation (`groupId`, `messageKey`).
5. Implement AES-256-GCM seal/open with golden-vector tests.
6. Implement `chat` and `profile` app-payload encoding/decoding.
7. Implement safe avatar codec interface (resize/encode budget, decode ceiling).
8. Implement named-pipe transport helpers (`createControlServer`, `createControlClient`).
9. Implement control protocol request/response types matching `ControlProtocol.swift`.
10. Add unit tests for all core functions.

Key outcomes:

- `packages/munkel-core/` builds and tests pass.
- Windows crypto matches the macOS and TypeScript reference behavior.
- Named-pipe IPC contract is ready for app and CLI consumption.

---

## Phase 3: Windows App Scaffold (`apps/windows/`)

Status: **Pending**

Goal: Add a minimal Electron project with the selected tooling and a runnable
shell.

Feature order:

1. Scaffold `apps/windows/` with Electron + Vite + React.
2. Add main-process entry point and single-instance lock.
3. Add system-tray icon and tray menu.
4. Add a minimal renderer window ("hello world" / dev placeholder).
5. Add preload script with a locked-down `contextBridge`.
6. Wire `apps/windows/` into root `package.json` workspaces and `turbo.json`.
7. Add Windows-specific `.gitignore` rules for build artifacts.
8. Document local development commands.

Key outcomes:

- `apps/windows/` exists and runs locally.
- Root tooling recognizes the new app.
- Generated files are ignored.

---

## Phase 4: Protocol and Crypto Compatibility in the App

Status: **Pending**

Goal: Integrate `munkel-core` into the Electron app and prove that the Windows
client produces compatible bytes.

Feature order:

1. Add `munkel-core` dependency to `apps/windows/`.
2. Wire crypto helpers into the main process.
3. Add a dev-only "derive group" debug flow.
4. Verify golden vectors against `CryptoTests.swift` and `dev-send.ts`.
5. Add payload round-trip tests inside the app.
6. Resolve any Node/WebCrypto layout differences (nonce || ciphertext || tag).

Key outcomes:

- App can derive the same `groupId`/`messageKey` as macOS from the same code.
- App can seal/open payloads compatible with Swift and `dev-send.ts`.

---

## Phase 5: Relay and Session Client

Status: **Pending**

Goal: Connect the Windows app to the relay and handle live circle sessions.

Feature order:

1. Implement `RelayClient` in the main process using `munkel-core` protocol types.
2. Implement `GroupSession` (one per joined circle).
3. Implement member list and presence tracking.
4. Handle server frames: `welcome`, `peer-joined`, `peer-left`, `message`, `pong`, `error`.
5. Implement auto-reconnect with exponential backoff.
6. Implement 30-second ping loop.
7. Implement profile broadcast on join and on `peer-joined`.
8. Implement encrypted send for `chat` and `profile` payloads.
9. Manual interop test against `apps/server/scripts/dev-send.ts`.
10. Manual interop test against a running macOS app.

Key outcomes:

- Windows client can join a circle and exchange encrypted messages with macOS.
- Presence and reconnect behavior follow the protocol.

---

## Phase 6: Windows Shell and UI

Status: **Pending**

Goal: Build the first usable Windows app surface for joining circles, showing
members, sending messages, and displaying incoming messages.

Feature order:

1. Add identity persistence (`memberId`, display name, avatar) in `userData`.
2. Implement GitHub device-flow UI in the renderer.
3. Implement join/create circle flow.
4. Implement main tray window with circle list and connection state.
5. Implement member list inside each circle.
6. Implement inline send flow.
7. Implement macOS-like notch widget (frameless, top-edge, animated show/hide).
8. Implement incoming-message display queue with hover-to-hold.
9. Implement reply, copy, and 60-second prune behavior.
10. Implement quick-send palette with global hotkey.
11. Research capture-exclusion options and document findings for v3.

Key outcomes:

- A user can join a circle, see members, send messages, and receive messages.
- The incoming-message surface matches the chosen macOS-like design.
- Capture-exclusion is documented as a v3 item.

---

## Phase 7: CLI Windows IPC

Status: **Pending**

Goal: Extend the CLI so Windows can control the Windows app through the local
named-pipe transport.

Feature order:

1. Add platform detection to `apps/cli/src/munkel.ts`.
2. Implement Windows named-pipe client using `munkel-core` transport helpers.
3. Preserve macOS Unix-domain socket behavior unchanged.
4. Implement Windows app auto-start from CLI (locate executable, spawn detached).
5. Add CLI unit tests for the Windows transport branch.
6. Validate `munkel circles` and `munkel <circle> <recipient|all> <message>` on Windows.
7. Update `skills/munkel/SKILL.md` if the agent-facing contract changes.

Key outcomes:

- CLI detects Windows and uses named pipes.
- CLI can list circles and send messages through the Windows app.
- macOS CLI tests still pass.

---

## Phase 8: Tests, CI, Docs, Packaging

Status: **Pending**

Goal: Make the Windows integration buildable, testable, documented, and ready
for packaging decisions.

Feature order:

1. Add unit tests for `munkel-core` (crypto, payload, avatar, transport).
2. Add app-level tests for frame parsing and session state.
3. Add cross-platform interop tests (Windows ↔ macOS via local relay).
4. Add GitHub Actions job for Windows build/test validation.
5. Update `README.md` with Windows development instructions.
6. Update `docs/launch-platforms.md` with Windows packaging notes.
7. Document MSIX packaging path and tooling options.
8. Add release-please exclusions for Windows if needed.

Key outcomes:

- Automated tests cover the critical compatibility surface.
- CI validates Windows code on every PR.
- Windows development and packaging are documented.
