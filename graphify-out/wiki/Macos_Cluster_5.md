# Macos Cluster

> 10 nodes · cohesion 0.29

## Key Concepts

- **RelayClient** (11 connections) — `apps/macos/Sources/MunkelKit/RelayClient.swift`
- **GroupRoom** (5 connections) — `apps/server/src/group-room.ts`
- **Phase 4: Relay and Session Client** (3 connections) — `.planning/PHASES.md`
- **.init()** (3 connections) — `apps/macos/Sources/MunkelApp/GroupSession.swift`
- **.runLoop()** (3 connections) — `apps/macos/Sources/MunkelKit/RelayClient.swift`
- **.startPingLoop()** (3 connections) — `apps/macos/Sources/MunkelKit/RelayClient.swift`
- **.send()** (2 connections) — `apps/macos/Sources/MunkelKit/RelayClient.swift`
- **.start()** (2 connections) — `apps/macos/Sources/MunkelKit/RelayClient.swift`
- **.close()** (1 connections) — `apps/macos/Sources/MunkelKit/RelayClient.swift`
- **.init()** (1 connections) — `apps/macos/Sources/MunkelKit/RelayClient.swift`

## Relationships

- [[Macos Cluster]] (4 shared connections)
- [[Crypto Key Derivation]] (2 shared connections)
- [[Windows Integration Planning]] (1 shared connections)
- [[macOS Relay Client]] (1 shared connections)

## Source Files

- `.planning/PHASES.md`
- `apps/macos/Sources/MunkelApp/GroupSession.swift`
- `apps/macos/Sources/MunkelKit/RelayClient.swift`
- `apps/server/src/group-room.ts`

## Audit Trail

- EXTRACTED: 22 (65%)
- INFERRED: 12 (35%)
- AMBIGUOUS: 0 (0%)

---

*Part of the graphify knowledge wiki. See [[index]] to navigate.*