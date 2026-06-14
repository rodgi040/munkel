# Windows Integration Decisions

Record durable decisions here. Prefer short entries that explain the decision,
why it was made, and which alternatives were considered.

## Decision Log

| Date | Status | Decision | Rationale | Alternatives |
|------|--------|----------|-----------|--------------|
| 2026-06-14 | Accepted | Use lightweight `.planning/` Markdown tracking, not the GSD framework runtime. | The project needs clear state, roadmap, handoff, and decision tracking without generated framework files or commands. | Full GSD setup, loose root Markdown files only. |
| 2026-06-14 | Accepted | Version `.planning/` on the Windows integration work. | Planning should survive across sessions and PR review for `platform/windows`. | Keep planning files local-only. |
| 2026-06-14 | Pending | Select Windows UI/runtime stack. | The choice determines app structure, packaging, UI capabilities, and build/CI setup. | WinUI 3 / Windows App SDK, WPF, Avalonia, Uno, Electron/Tauri-style approaches if justified. |
| 2026-06-14 | Pending | Select Windows local IPC transport. | The CLI needs a Windows-compatible replacement for the macOS Unix-domain socket. | Named pipe, TCP localhost, Windows AppService, other local transport. |
| 2026-06-14 | Pending | Select Windows packaging direction. | Packaging affects project type, signing assumptions, CI, and user install flow. | MSIX, installer, portable zip, defer packaging until after core client. |

## Decision Template

```markdown
## YYYY-MM-DD: Decision Title

Status: Pending | Accepted | Superseded

Decision:

Rationale:

Alternatives considered:

Consequences:
```

