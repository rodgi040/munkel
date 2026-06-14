# Windows Integration State

## Branches

- Integration branch: `platform/windows-integration`
- Current working branch: `platform/windows/planning`
- Feature sub-branches: `platform/windows/<short-feature>` off
  `platform/windows-integration`
- Main branch protection: do not commit, push, rebase, or fast-forward `main`.

## Active Phase

Phase 1: Stack and Architecture Decision — **Completed**

Phase 2: Shared Core Package — **Pending** (next)

## Last Action

- Reviewed existing `.planning/` documents and the agent-swarm findings.
- User decided to switch the Windows stack from WinUI 3 / Windows App SDK to
  **Electron**.
- User decided to defer **capture-exclusion** to v3.
- User decided to build a **macOS-like notch widget** as the primary v1
  incoming-message surface.
- Updated `.planning/DECISIONS.md`:
  - Marked WinUI 3 stack decision as Superseded.
  - Added Electron as Accepted stack.
  - Marked C#/.NET crypto decision as Superseded.
  - Added Node.js `crypto` / TypeScript crypto as Accepted.
  - Updated packaging rationale for Electron tooling.
  - Added notch-widget and capture-exclusion-deferral decisions.
- Updated `.planning/ROADMAP.md` with the ordered feature list across 8 phases,
  including the new Shared Core Package phase.
- Updated `.planning/PHASES.md` with detailed scope, exclusions, done criteria,
  and tests for each phase.

## Next Action

Start Phase 2: Shared Core Package.

1. Create feature branch `platform/windows/shared-core-scaffold` from
   `platform/windows-integration`.
2. Scaffold `packages/munkel-core/` with `package.json`, `tsconfig.json`, and
   Vitest.
3. Port client-side protocol types from `apps/server/src/protocol.ts`.
4. Implement circle-code normalization and HKDF-SHA256 derivation.
5. Implement AES-256-GCM seal/open with golden-vector tests.
6. Wire `packages/munkel-core/` into root workspaces and `turbo.json`.
7. Open a PR into `platform/windows-integration`.

## What Is Done

- `platform/windows-integration` integration branch exists.
- Local agent guardrails exist in root `AGENTS.md`.
- Lightweight `.planning/` project tracking files are initialized and current.
- Phase 1 decisions are documented and approved.
- Phase 2–8 roadmap and phase plans are documented.

## Blockers

None.

## Open Questions

- Which UI framework should `apps/windows/` use? (React + Vite is the working
  assumption, but not locked.)
- Which image library should implement the avatar codec? (`sharp` is the
  default candidate; a pure-JS alternative may be preferred to avoid native
  module complexity.)
- What is the exact named-pipe name and user-suffix scheme?
  (`\\.\pipe\Munkel-<user>-Control` is the working assumption.)
- How should the CLI locate the installed Windows app for auto-start?
  (Registry key, well-known install path, or protocol handler.)

## Update Rule

Update this file after every meaningful work session. Keep `Last Action`,
`Next Action`, `Blockers`, and `Open Questions` current.

---

Last updated: 2026-06-14 after stack decision change and planning update.
