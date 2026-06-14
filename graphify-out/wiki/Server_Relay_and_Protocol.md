# Server Relay and Protocol

> 56 nodes · cohesion 0.06

## Key Concepts

- **GroupRoom** (16 connections) — `apps/server/src/group-room.ts`
- **index.ts** (14 connections) — `apps/server/src/index.ts`
- **group-room.ts** (11 connections) — `apps/server/src/group-room.ts`
- **protocol.ts** (8 connections) — `apps/server/src/protocol.ts`
- **Munkel wire protocol v1** (8 connections) — `apps/server/src/protocol.ts`
- **protocol.test.ts** (7 connections) — `apps/server/test/protocol.test.ts`
- **logger.ts** (5 connections) — `apps/server/src/lib/logger.ts`
- **.handleDisconnect()** (5 connections) — `apps/server/src/group-room.ts`
- **.onConnect()** (5 connections) — `apps/server/src/group-room.ts`
- **.relay()** (5 connections) — `apps/server/src/group-room.ts`
- **.broadcastMessage()** (4 connections) — `apps/server/src/group-room.ts`
- **.findConnections()** (4 connections) — `apps/server/src/group-room.ts`
- **.onMessage()** (4 connections) — `apps/server/src/group-room.ts`
- **.sendError()** (4 connections) — `apps/server/src/group-room.ts`
- **.sendTo()** (4 connections) — `apps/server/src/group-room.ts`
- **MEMBER_ID_REGEX** (4 connections) — `apps/server/src/protocol.ts`
- **createLogger()** (3 connections) — `apps/server/src/lib/logger.ts`
- **Level** (3 connections) — `apps/server/src/lib/logger.ts`
- **Logger** (3 connections) — `apps/server/src/lib/logger.ts`
- **dev-send.ts reference sender** (3 connections) — `apps/server/scripts/dev-send.ts`
- **.onClose()** (3 connections) — `apps/server/src/group-room.ts`
- **GET /ws WebSocket upgrade endpoint** (3 connections) — `apps/server/src/index.ts`
- **AES-256-GCM end-to-end encryption** (3 connections) — `apps/server/src/protocol.ts`
- **clientMessageSchema** (3 connections) — `apps/server/src/protocol.ts`
- **GROUP_ID_REGEX** (3 connections) — `apps/server/src/protocol.ts`
- *... and 31 more nodes in this community*

## Relationships

- [[Server E2E Relay Tests]] (1 shared connections)
- [[macOS Avatar and Palette Views]] (1 shared connections)

## Source Files

- `apps/macos/Tests/MunkelKitTests/AvatarCodecTests.swift`
- `apps/macos/Tests/MunkelKitTests/CryptoTests.swift`
- `apps/macos/Tests/MunkelKitTests/WireMessageTests.swift`
- `apps/server/scripts/dev-send.ts`
- `apps/server/src/group-room.ts`
- `apps/server/src/index.ts`
- `apps/server/src/lib/logger.ts`
- `apps/server/src/protocol.ts`
- `apps/server/test/protocol.test.ts`
- `scripts/simulate-whispers.sh`

## Audit Trail

- EXTRACTED: 163 (94%)
- INFERRED: 11 (6%)
- AMBIGUOUS: 0 (0%)

---

*Part of the graphify knowledge wiki. See [[index]] to navigate.*