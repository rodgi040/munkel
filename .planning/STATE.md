# Windows Integration State

## Branches

- Integration branch: `platform/windows-integration`
- Current working branch: `platform/windows/planning`
- Main branch protection: do not commit, push, rebase, or fast-forward `main`.

## Active Phase

Phase 1: Stack and Architecture Decision

## Last Action

Created lightweight planning structure under `.planning/` to replace the loose
root `Roadmap.md` and `State.md` as the project tracking source of truth.

## Next Action

Research and decide the Windows architecture:

- UI/runtime stack.
- Local IPC transport.
- Crypto/protocol implementation strategy.
- Packaging direction.
- How the Windows client maps to the existing macOS app, CLI, and relay.

## What Is Done

- `platform/windows` integration branch exists.
- Local agent guardrails exist in root `AGENTS.md`.
- Existing loose root planning files exist as local scratch/history files.
- Lightweight `.planning/` project tracking files are now initialized.

## Blockers

None.

## Open Questions

- Which Windows UI/runtime stack should be used?
- Should Windows IPC use named pipes, TCP localhost, or another transport?
- Should Windows start with GitHub device-flow display identity or manual
  display names?
- What Windows packaging format is the initial target?
- Which Windows API, if any, can provide capture-excluded message surfaces
  comparable to macOS `NSWindow.sharingType = .none`?

## Update Rule

Update this file after every meaningful work session. Keep `Last Action`,
`Next Action`, `Blockers`, and `Open Questions` current.

---

Last updated: 2026-06-14 after lightweight planning setup.

