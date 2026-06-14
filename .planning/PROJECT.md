# Munkel Windows Integration

## Goal

Bring Munkel to Windows while preserving the existing product model: ephemeral
encrypted messages between circle members, routed through the relay without the
server seeing plaintext circle codes, profile data, or message content.

The Windows client should interoperate with the existing macOS app, CLI, and
relay protocol. It should eventually provide a Windows-native app experience
with local app-owned crypto, relay sessions, presence, message display, and CLI
control.

## Existing System Context

- `apps/macos/` contains the current Swift app and `MunkelKit` reference
  implementation for group derivation, AES-256-GCM payload encryption, relay
  connection handling, app payloads, GitHub display identity, and the local
  control server.
- `apps/cli/` contains the Bun/TypeScript CLI. It currently talks to the macOS
  app through a Unix-domain socket at
  `~/Library/Application Support/Munkel/control.sock`.
- `apps/server/` contains the relay and the canonical wire protocol in
  `apps/server/src/protocol.ts`.
- `apps/landing/` is the public website and should not be touched unless the
  Windows integration requires documentation or launch copy later.

## Compatibility Constraints

- Keep the wire protocol compatible with `apps/server/src/protocol.ts`.
- Keep circle-code normalization compatible: Unicode NFC, trim, lowercase.
- Keep derivation compatible:
  - `groupId`: HKDF-SHA256 over normalized code, salt `munkel-v1`, info
    `group-id`, 16 bytes encoded as 32 lowercase hex chars.
  - `messageKey`: HKDF-SHA256 over normalized code, salt `munkel-v1`, info
    `message-key`, 32 bytes.
- Keep payload encryption compatible: AES-256-GCM with random 12-byte nonce,
  empty AAD, payload as base64 of `nonce || ciphertext || tag`.
- Direct messages remain relay-targeted under the shared group key for v1.
- The relay remains storage-free and must not learn plaintext application
  payloads.

## Repository Constraints

- Long-running integration branch: `platform/windows`.
- Isolated work should happen on feature branches and merge into
  `platform/windows` by PR.
- Never commit, push, rebase, or fast-forward `main` from this workspace.
- Do not run release tooling, release-please, version bumps, or changelog
  generation automatically.
- Add the Windows app under `apps/windows/`.
- Touch existing macOS, server, CLI, landing, or shared files only when required
  for cross-platform compatibility.

## Product Constraints

- Preserve the no-history, no-message-storage product model.
- Preserve the app-owned crypto model: the CLI should remain a thin control
  client, not the owner of relay sessions or message encryption.
- Windows should use a Windows-compatible local control transport; named pipes
  are the default candidate unless research decides otherwise.
- Capture-proof message surfaces are desirable on Windows but must be treated as
  a research question because Windows APIs and tradeoffs differ from macOS.

## Current Focus

Phase 1: Stack and Architecture Decision. Decide the Windows UI/runtime stack,
local IPC transport, crypto implementation strategy, packaging direction, and
how the Windows client maps to the existing Munkel architecture before
scaffolding `apps/windows/`.

---

Last updated: 2026-06-14 after lightweight planning setup.

