# Windows Integration State

## Branches

- Integration branch: `platform/windows-integration`
- Current working branch: `platform/windows/planning`
- Main branch protection: do not commit, push, rebase, or fast-forward `main`.

## Active Phase

Phase 2: Windows App Scaffold

## Last Action

Completed Phase 1 on `platform/windows/phase-1-stack-decision`:

- Decided WinUI 3 / Windows App SDK as the Windows UI/runtime stack.
- Decided named pipes as the Windows CLI-to-app IPC transport.
- Decided .NET `System.Security.Cryptography` for HKDF-SHA256 / AES-256-GCM.
- Decided GitHub device-flow identity, matching macOS.
- Decided MSIX for release, unpackaged for development.
- Documented all decisions in `.planning/DECISIONS.md`.

## Next Action

Create the minimal Windows app scaffold under `apps/windows/`:

- Add a WinUI 3 project (unpackaged desktop app).
- Wire it into the root workspace / Turborepo where appropriate.
- Add a minimal app entry point and system-tray placeholder.
- Document local build/run commands.
- Add Windows-specific `.gitignore` rules for build artifacts.

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

