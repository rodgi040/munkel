# Munkel Windows Planning

This directory contains lightweight project tracking for the Windows
integration. It is not a GSD framework setup: there are no generated commands,
agent configs, or workflow runtime files here.

## Source of Truth

Use these files in this order:

1. `PROJECT.md` - why the Windows integration exists, what constraints apply,
   and what must stay compatible.
2. `ROADMAP.md` - the ordered phase roadmap.
3. `PHASES.md` - detailed scope, done criteria, affected areas, and tests for
   each phase.
4. `STATE.md` - current branch, active phase, last action, next action,
   blockers, and open questions.
5. `DECISIONS.md` - durable architecture and product decisions.
6. `HANDOFF.md` - short context for the next agent or session.

## Working Loop

Before changing code:

- Read `STATE.md`.
- Read the active phase in `PHASES.md`.
- Check `DECISIONS.md` for constraints that affect the change.

During planning:

- Add unresolved questions to `STATE.md`.
- Add architecture decisions to `DECISIONS.md` once they are made.
- Keep phase scope in `PHASES.md` current.

After each work session:

- Update `STATE.md` with the latest action and next action.
- Update `HANDOFF.md` with a concise continuation note.
- If a phase is completed, mark it in `PHASES.md` and advance the active phase
  in `STATE.md`.

## Git Rules

- These `.planning/` files are versioned on the Windows integration work.
- The long-running integration target is `platform/windows-integration`.
- Feature work should happen on a separate branch and be merged into
  `platform/windows-integration` by PR.
- Do not commit, push, rebase, or fast-forward `main` from this workspace.
- Do not run release tooling, version bumps, or changelog generation
  automatically.

