# Windows Integration Handoff

## Current Snapshot

The project is setting up lightweight planning for the Munkel Windows
integration. The source of truth now lives under `.planning/`.

## Latest Work

- Created `.planning/README.md`.
- Created `.planning/PROJECT.md`.
- Created `.planning/ROADMAP.md`.
- Created `.planning/STATE.md`.
- Created `.planning/DECISIONS.md`.
- Created `.planning/PHASES.md`.
- Created `.planning/HANDOFF.md`.

## Next Step

Start Phase 1: research and decide the Windows stack and architecture.

The next agent should read, in order:

1. `.planning/STATE.md`
2. `.planning/PHASES.md`
3. `.planning/PROJECT.md`
4. `.planning/DECISIONS.md`

Then update `DECISIONS.md`, `STATE.md`, and this handoff after decisions are
made.

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

