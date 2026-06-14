# Windows Integration Phases

Use this file for implementation-level tracking. `ROADMAP.md` gives the order;
this file gives scope, exclusions, done criteria, likely files, and tests.

## Phase 1: Stack and Architecture Decision

Status: Active

Goal: Decide the Windows architecture before writing scaffold code.

Scope:

- Compare Windows UI/runtime stack options.
- Decide local IPC transport for CLI-to-app control.
- Decide crypto/protocol implementation strategy.
- Decide initial identity approach: GitHub device flow or manual display name.
- Decide packaging direction enough to guide scaffolding.
- Document accepted decisions in `DECISIONS.md`.

Out of scope:

- Creating `apps/windows/`.
- Implementing crypto, relay sessions, UI, or CLI changes.
- Release automation or changelog work.

Likely affected files:

- `.planning/DECISIONS.md`
- `.planning/STATE.md`
- `.planning/HANDOFF.md`
- Optional architecture note under `.planning/` if the decision needs more
  detail than fits the decision log.

Done criteria:

- UI/runtime stack is accepted.
- IPC transport is accepted.
- Crypto/protocol strategy is accepted.
- Packaging direction is accepted or explicitly deferred.
- Next phase can scaffold without revisiting foundational choices.

Tests/checks:

- Documentation review only.

## Phase 2: Windows App Scaffold

Status: Pending

Goal: Add a minimal Windows app project under `apps/windows/`.

Scope:

- Create the selected project structure.
- Add build tooling and root workspace/Turborepo wiring if required.
- Add Windows-specific ignore rules for build artifacts.
- Add minimal app entry point.
- Document local build/run commands.

Out of scope:

- Full relay client.
- Full UI flows.
- CLI integration.
- Packaging release artifacts.

Likely affected files:

- `apps/windows/`
- `package.json`
- `turbo.json`
- `.gitignore`
- `README.md` if development commands are useful immediately.

Done criteria:

- Windows app scaffold builds locally on Windows or has a documented reason if
  validation must wait.
- Repo tooling recognizes the app where appropriate.
- Generated user/machine-specific files are ignored.

Tests/checks:

- Run the selected Windows build command.
- Run `bun run typecheck` if root workspace metadata changes.

## Phase 3: Protocol and Crypto Compatibility

Status: Pending

Goal: Implement Windows protocol models and crypto compatible with macOS and
server references.

Scope:

- Implement circle-code normalization and key derivation.
- Implement AES-256-GCM payload sealing/opening.
- Implement app payload models for chat and profile data.
- Add golden-vector or cross-reference tests.

Out of scope:

- UI display.
- Relay reconnect behavior beyond what tests require.
- Pairwise encryption.

Likely affected files:

- `apps/windows/`
- `apps/server/scripts/dev-send.ts` only if new golden vectors are needed.
- Existing macOS/server files only if compatibility gaps are found.

Done criteria:

- Windows produces the same `groupId` and compatible `messageKey` behavior as
  existing references.
- Windows can decrypt payloads produced by the TypeScript/Swift references and
  vice versa where test tooling permits.

Tests/checks:

- Windows unit tests for normalization, HKDF, AES-GCM, payload encoding.
- Existing server/macOS tests if shared protocol files change.

## Phase 4: Relay and Session Client

Status: Pending

Goal: Connect the Windows app to the relay and handle live circle sessions.

Scope:

- Implement WebSocket connection to `/ws?group=<groupId>&member=<memberId>`.
- Handle server frames from `apps/server/src/protocol.ts`.
- Send ping and encrypted send frames.
- Manage basic presence state.
- Send/receive profile payloads if identity is in scope.

Out of scope:

- Rich Windows UI polish.
- CLI IPC.
- Offline message history.

Likely affected files:

- `apps/windows/`
- Tests under `apps/windows/`
- `apps/server/src/protocol.ts` only if a protocol issue is discovered.

Done criteria:

- Windows can join a circle against local or production relay.
- Windows can send and receive encrypted messages with another reference client.
- Presence changes are reflected in app state.

Tests/checks:

- Unit tests for frame parsing and session state.
- Manual or scripted interop test against `apps/server/scripts/dev-send.ts`.

## Phase 5: Windows Shell and UI

Status: Pending

Goal: Build the first usable Windows app experience.

Scope:

- App shell/tray/taskbar behavior according to selected stack.
- Create/join circle flow.
- Member list and connection state.
- Send message flow.
- Incoming message display surface.
- Capture-exclusion research and implementation if practical.

Out of scope:

- Store-ready packaging.
- Advanced animations or nonessential polish.
- Changing macOS UI.

Likely affected files:

- `apps/windows/`
- `README.md` only if user-facing development instructions change.

Done criteria:

- A user can join a circle and see connection/member state.
- A user can send a message.
- Incoming messages are visible in the Windows app.
- Capture-exclusion decision is recorded, implemented, or explicitly deferred.

Tests/checks:

- UI smoke test/manual verification.
- Any automated tests supported by the selected stack.

## Phase 6: CLI Windows IPC

Status: Pending

Goal: Make the `munkel` CLI control the Windows app on Windows.

Scope:

- Add platform detection to the CLI.
- Implement selected Windows IPC client.
- Preserve macOS Unix-domain socket behavior.
- Define and implement Windows app auto-start if practical.
- Keep request/response JSON shape compatible unless a decision says otherwise.

Out of scope:

- Moving crypto into the CLI.
- Breaking macOS CLI behavior.
- Release packaging.

Likely affected files:

- `apps/cli/src/munkel.ts`
- `apps/cli/test/`
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

## Phase 7: Tests, CI, Docs, Packaging

Status: Pending

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

