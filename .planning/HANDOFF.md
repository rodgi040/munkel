# Windows Integration Handoff

## Current Snapshot

Phase 1 (Stack and Architecture Decision) is complete. The Windows integration
now has accepted decisions for UI stack, IPC transport, crypto/protocol,
identity, and packaging. The source of truth lives under `.planning/`.

## Latest Work

- Created the `platform/windows/phase-1-stack-decision` branch.
- Decided WinUI 3 / Windows App SDK for the Windows client.
- Decided named pipes for CLI-to-app IPC.
- Decided .NET `System.Security.Cryptography` for protocol/crypto compatibility.
- Decided GitHub device-flow identity, matching macOS.
- Decided MSIX for release, unpackaged for development.
- Updated `.planning/DECISIONS.md`, `.planning/STATE.md`, and `.planning/PHASES.md`.

## Next Step

Start Phase 2: Windows App Scaffold.

The next agent should read, in order:

1. `.planning/STATE.md`
2. `.planning/PHASES.md` (Phase 2)
3. `.planning/PROJECT.md`
4. `.planning/DECISIONS.md`

Then create the minimal `apps/windows/` WinUI 3 scaffold and update
`STATE.md`, `HANDOFF.md`, and `PHASES.md` as work progresses.

## Do Not Touch Yet

- Do not create `apps/windows/` until Phase 1 decisions are accepted.
- Do not change macOS/server/landing code during planning setup.
- Do not run release tooling, version bumps, or changelog generation.
- Do not commit, push, rebase, or fast-forward `main`.

## Branch Setup

- Integration branch: `platform/windows-integration`
- Current feature branch: `platform/windows/planning`
- Feature sub-branches: `platform/windows/<short-feature>` off `platform/windows-integration`

Note: Git cannot hold both a branch named `platform/windows` and branches under
`platform/windows/<feature>` because branch refs are stored as files. The
integration branch therefore uses the suffix `-integration` so that sub-branches
can live cleanly under `platform/windows/`.

