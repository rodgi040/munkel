# Windows Integration State

## Branches

- Integration branch: `platform/windows-integration`
- Current working branch: `platform/windows/phase-2-app-scaffold`
- Feature sub-branches: `platform/windows/<short-feature>` off
  `platform/windows-integration`
- Main branch protection: do not commit, push, rebase, or fast-forward `main`.

## Active Phase

Phase 1: Stack and Architecture Decision — **Completed**

Phase 2: Shared Core Package — **Completed**

Phase 3: Windows App Scaffold/Shell — **Completed**

Phase 4: Protocol and Crypto Compatibility in the App — **In Progress**

## Last Action

- Agent-Swarm review + blocker fix + core wiring.
- Reverted root `package.json` `esbuild` override to `0.28.1` and regenerated
  `bun.lock` with workspace entries for `@munkel/core` and `@munkel/windows`.
- Fixed scaffold blockers in `apps/windows/`:
  - Converted `tray-icon.svg` to `tray-icon.png` and corrected the asset path.
  - Locked down the preload script to a typed `window.electronAPI` allowlist.
  - Fixed dev vs. production routing for renderer windows.
  - Made the notch widget main-driven with `notch-show` / `notch-hide` /
    `notch-update` events and added a 5-second demo button.
  - Added small UI guards and the `main` entry to `apps/windows/package.json`.
- Wired `@munkel/core` into the Electron main process:
  - Added `derive-group-id`, `seal-chat`, and `open-chat` IPC handlers.
  - Added a dev-only golden-vector smoke test for `blue-table-42`.
- Created Phase 4 stubs: `session-store.ts`, `relay-client.ts`, renderer
  `app-store.ts`, and `docs/ipc-contract.md`.
- Updated planning docs to reflect completed Phases 1–3 and Phase 4 in progress.

## Next Action

Continue Phase 4: implement `RelayClient`/`GroupSession` and wire real state
between the main process and the renderer.

1. Implement a live `RelayClient` using `@munkel/core` protocol types.
2. Implement `GroupSession` (one per joined circle) on top of `session-store.ts`.
3. Handle relay frames: `welcome`, `peer-joined`, `peer-left`, `message`,
   `pong`, `error`.
4. Wire the renderer `app-store.ts` to main-process state updates.
5. Implement the named-pipe control server for CLI IPC (Phase 7 prep).

## What Is Done

- `platform/windows-integration` integration branch exists.
- Local agent guardrails exist in root `AGENTS.md`.
- Lightweight `.planning/` project tracking files are initialized and current.
- Phase 1 decisions are documented and approved.
- Phase 2–8 roadmap and phase plans are documented.
- `packages/munkel-core/` is scaffolded with crypto, payload, and transport
  primitives and golden-vector tests.
- `apps/windows/` Electron scaffold builds and typechecks:
  - single-instance lock, tray, menu/palette/notch windows;
  - secure preload with typed `electronAPI`;
  - `@munkel/core` wired into the main process;
  - dev-only golden-vector smoke test prints on startup.

## Blockers

None.

## Open Questions

- Which image library should implement the avatar codec? (`sharp` is the
  default candidate; a pure-JS alternative may be preferred to avoid native
  module complexity.)
- What is the exact named-pipe name and user-suffix scheme?
  (`\\.\pipe\Munkel-<user>-Control` is the working assumption.)
- How should the CLI locate the installed Windows app for auto-start?
  (Registry key, well-known install path, or protocol handler.)
- UI framework for `apps/windows/` is locked to **React + Vite**.

## Update Rule

Update this file after every meaningful work session. Keep `Last Action`,
`Next Action`, `Blockers`, and `Open Questions` current.

---

Last updated: 2026-06-14 after Phase 2/3 completion and Phase 4 prep.
