# Windows Integration Handoff

## Current Snapshot

Phases 1–3 of the Windows integration are complete. Phase 4 (Protocol and Crypto
Compatibility in the App) is in progress.

The Windows stack is **Electron** with a shared `packages/munkel-core/` library.
`apps/windows/` is scaffolded with React + Vite, a system tray, menu window,
quick-send palette, and macOS-like notch widget. `@munkel/core` is wired into
the main process and a dev-only golden-vector smoke test runs on startup.

## Completed Work

- `packages/munkel-core/`
  - Circle-code normalization.
  - HKDF-SHA256 group-id and message-key derivation.
  - AES-256-GCM seal/open.
  - Chat/profile payload encoding and decoding.
  - Golden-vector tests (e.g. `blue-table-42` → `aaf5dc7308fe4bede46cdebc9390813d`).
- `apps/windows/`
  - Electron + Vite + React scaffold.
  - Single-instance lock, tray icon (PNG), tray menu.
  - Menu, palette, and notch windows with hash-based routing.
  - Secure preload exposing only `window.electronAPI`.
  - Main-driven notch widget with show/hide/update events and a 5-second demo.
  - Crypto IPC handlers (`derive-group-id`, `seal-chat`, `open-chat`) backed by
    `@munkel/core`.
  - Phase 4 stubs: `session-store.ts`, `relay-client.ts`, renderer `app-store.ts`,
    and `docs/ipc-contract.md`.
- Root workspace / lockfile
  - `esbuild` override restored to `0.28.1`.
  - `bun.lock` regenerated with `@munkel/core` and `@munkel/windows`.
  - `turbo.json` already includes Windows and core tasks.

## Next Step

Continue **Phase 4: Relay and Session Client**.

The next agent should read, in order:

1. `.planning/STATE.md`
2. `.planning/PHASES.md` (Phase 4)
3. `.planning/ROADMAP.md`
4. `apps/windows/docs/ipc-contract.md`
5. `apps/windows/src/main/session-store.ts`
6. `apps/windows/src/main/relay-client.ts`
7. `apps/windows/src/renderer/store/app-store.ts`
8. `packages/munkel-core/src/protocol.ts` and `transport.ts`
9. `apps/server/src/protocol.ts`

Then implement a live `RelayClient`, `GroupSession` (one per circle), and wire
real state updates from main to renderer. Prepare the named-pipe control server
for Phase 7 (CLI IPC).

## Do Not Touch Yet

- Do not change macOS/server/landing code during Phase 4 unless a shared
  cross-platform interface absolutely requires it.
- Do not run release tooling, version bumps, or changelog generation.
- Do not commit, push, rebase, or fast-forward `main`.

## Branch Setup

- Integration branch: `platform/windows-integration`
- Current feature branch: `platform/windows/phase-2-app-scaffold`
- Feature sub-branches: `platform/windows/<short-feature>` off
  `platform/windows-integration`

Note: Git cannot hold both a branch named `platform/windows` and branches under
`platform/windows/<feature>` because branch refs are stored as files. The
integration branch therefore uses the suffix `-integration` so that sub-branches
can live cleanly under `platform/windows/`.
