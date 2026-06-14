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

## Known Branch Note

The requested branch pattern `platform/windows/<feature>` cannot coexist with
an existing local branch named `platform/windows` in Git ref storage. For this
setup, the working branch is `platform-windows-planning-files`, with
`platform/windows` remaining the integration target.

