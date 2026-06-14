# Windows Integration Roadmap

This roadmap is the source of truth for Windows integration order. Phase details
and done criteria live in `PHASES.md`; current status lives in `STATE.md`.

## Phase 1: Stack and Architecture Decision

Status: Active

Goal: Choose the Windows app stack and document how the Windows client maps to
the existing Munkel architecture before scaffolding code.

Key outcomes:

- Windows UI/runtime stack selected.
- Local IPC transport selected, with named pipe as the default candidate.
- Crypto/protocol implementation strategy selected.
- Packaging direction selected enough to avoid scaffolding dead ends.
- Compatibility risks documented in `DECISIONS.md`.

## Phase 2: Windows App Scaffold

Status: Pending

Goal: Add `apps/windows/` with the selected project structure, build tooling,
and minimal runnable Windows app shell.

Key outcomes:

- `apps/windows/` exists.
- Root workspace and Turborepo wiring are updated if needed.
- Windows build artifacts are ignored.
- A minimal local development flow is documented.

## Phase 3: Protocol and Crypto Compatibility

Status: Pending

Goal: Implement or reuse Windows-compatible group derivation, member identity,
application payload encoding, and AES-256-GCM payload encryption.

Key outcomes:

- Windows crypto matches the macOS and TypeScript reference behavior.
- Protocol payload models match `apps/server/src/protocol.ts`.
- Interop tests or golden vectors prove compatibility.

## Phase 4: Relay and Session Client

Status: Pending

Goal: Implement WebSocket relay sessions and presence handling for Windows.

Key outcomes:

- Windows client can join a circle using the derived group ID.
- Client handles welcome, peer-joined, peer-left, message, pong, and error
  server frames.
- Client sends encrypted chat/profile payloads through the relay.
- Reconnect and ping behavior follows the protocol expectations.

## Phase 5: Windows Shell and UI

Status: Pending

Goal: Build the first usable Windows app surface for joining circles, showing
members, sending messages, and displaying incoming messages.

Key outcomes:

- Windows-native app shell exists.
- Create/join circle flow exists.
- Member list and connection state are visible.
- Incoming messages have a Windows-appropriate display surface.
- Capture-exclusion feasibility is researched and implemented if practical.

## Phase 6: CLI Windows IPC

Status: Pending

Goal: Extend the CLI so Windows can control the Windows app through a local
Windows-compatible transport.

Key outcomes:

- CLI detects Windows and uses the selected IPC transport.
- CLI can list circles and send messages through the Windows app.
- CLI auto-start strategy for Windows is defined and implemented if practical.
- Existing macOS socket behavior stays compatible.

## Phase 7: Tests, CI, Docs, Packaging

Status: Pending

Goal: Make the Windows integration buildable, testable, documented, and ready
for packaging decisions.

Key outcomes:

- Windows unit tests cover crypto/protocol behavior.
- CI builds or validates Windows code where practical.
- README and platform launch docs include Windows development instructions.
- Packaging path is documented: MSIX, installer, zip, or deferred.

