# Windows Integration Handoff

## Current Snapshot

Phase 1 (Stack and Architecture Decision) is complete. The Windows stack was
changed from the previously accepted **WinUI 3 / Windows App SDK** to
**Electron**, based on user direction. All planning files have been updated to
reflect the new direction.

The chosen architecture is **Option B**: a shared `packages/munkel-core/`
library plus an Electron app under `apps/windows/`. The shared core owns
protocol types, crypto, key derivation, app payloads, avatar codec, and
named-pipe transport helpers.

## Latest Work

- Updated `.planning/DECISIONS.md`:
  - WinUI 3 / .NET decisions marked Superseded.
  - Electron, Node.js crypto, notch widget, and capture-exclusion deferral
    decisions added as Accepted.
- Updated `.planning/ROADMAP.md` with the ordered 8-phase feature roadmap.
- Updated `.planning/PHASES.md` with detailed scope, exclusions, done criteria,
  and tests for each phase.
- Updated `.planning/STATE.md` with current status and next action.

## Next Step

Start **Phase 2: Shared Core Package**.

The next agent should read, in order:

1. `.planning/STATE.md`
2. `.planning/PHASES.md` (Phase 2)
3. `.planning/ROADMAP.md`
4. `.planning/DECISIONS.md`
5. `apps/server/src/protocol.ts`
6. `apps/macos/Sources/MunkelKit/GroupKey.swift`
7. `apps/macos/Sources/MunkelKit/MessageCrypto.swift`
8. `apps/macos/Sources/MunkelKit/AppPayload.swift`
9. `apps/macos/Sources/MunkelKit/ControlProtocol.swift`

Then create branch `platform/windows/shared-core-scaffold` from
`platform/windows-integration` and begin scaffolding `packages/munkel-core/`.

## Do Not Touch Yet

- Do not create `apps/windows/` until the shared core has the crypto and
  protocol primitives it will consume.
- Do not change macOS/server/landing code during Phase 2 unless a shared
  cross-platform interface absolutely requires it.
- Do not run release tooling, version bumps, or changelog generation.
- Do not commit, push, rebase, or fast-forward `main`.

## Branch Setup

- Integration branch: `platform/windows-integration`
- Current feature branch: `platform/windows/planning`
- Next feature branch: `platform/windows/shared-core-scaffold`
- Feature sub-branches: `platform/windows/<short-feature>` off
  `platform/windows-integration`

Note: Git cannot hold both a branch named `platform/windows` and branches under
`platform/windows/<feature>` because branch refs are stored as files. The
integration branch therefore uses the suffix `-integration` so that sub-branches
can live cleanly under `platform/windows/`.
