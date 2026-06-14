# Windows Integration Decisions

Record durable decisions here. Prefer short entries that explain the decision,
why it was made, and which alternatives were considered.

## Decision Log

| Date | Status | Decision | Rationale | Alternatives |
|------|--------|----------|-----------|--------------|
| 2026-06-14 | Accepted | Use lightweight `.planning/` Markdown tracking, not the GSD framework runtime. | The project needs clear state, roadmap, handoff, and decision tracking without generated framework files or commands. | Full GSD setup, loose root Markdown files only. |
| 2026-06-14 | Accepted | Version `.planning/` on the Windows integration work. | Planning should survive across sessions and PR review for `platform/windows`. | Keep planning files local-only. |
| 2026-06-14 | Accepted | Use WinUI 3 / Windows App SDK for the Windows client. | Native Windows runtime with modern UI, system-tray support, full Win32 API access for named pipes, and MSIX packaging path. Keeps the client Windows-native while matching the macOS app\'s role as a menu-bar/notch-style relay owner. | WPF (older, less future-proof), Avalonia/Uno (cross-platform but add abstraction overhead), Electron/Tauri (heavy runtime, poor native capture-exclusion APIs). |
| 2026-06-14 | Accepted | Use named pipes for local CLI-to-app IPC on Windows. | Direct Windows equivalent of Unix-domain sockets; supported natively by .NET and accessible from the existing Bun/Node CLI. Allows one request/response per connection with newline-delimited JSON, mirroring `ControlProtocol.swift`. | TCP localhost (requires port management, less secure by default), Windows AppService (UWP-style complexity, unnecessary here), file-based socket emulation. |
| 2026-06-14 | Accepted | Implement crypto/protocol in C# / .NET using `System.Security.Cryptography`. | Provides HKDF-SHA256, AES-256-GCM, and WebSocket client primitives needed to match `apps/server/src/protocol.ts` and `MunkelKit`. Keeps the Windows app self-contained and testable without native CNG calls. | Direct Windows CNG APIs (more complex, no portability benefit), third-party libsodium (extra dependency, not needed), calling into macOS MunkelKit (impossible on Windows). |
| 2026-06-14 | Accepted | Keep GitHub device-flow display identity for Windows, same as macOS. | Preserves cross-platform consistency: the CLI remains send-only and the app owns the relay session and encrypted profile. GitHub device flow works without a client secret and already has a reference in `GitHubDeviceAuth.swift`. | Manual display name only (simpler for scaffold but diverges from macOS), Microsoft account integration (overkill for v1). |
| 2026-06-14 | Accepted | Target MSIX packaging for release, develop unpackaged initially. | MSIX is the modern Windows distribution format and aligns with macOS signed/notarized distribution. During development the app runs unpackaged for faster iteration; packaging work is deferred until the client is functional. | Portable zip (no auto-update, no identity), classic installer (more maintenance), MSIX from day one (slows Phase 2 scaffold). |

## Decision Template

```markdown
## YYYY-MM-DD: Decision Title

Status: Pending | Accepted | Superseded

Decision:

Rationale:

Alternatives considered:

Consequences:
```

