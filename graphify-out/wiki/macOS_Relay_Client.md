# macOS Relay Client

> 12 nodes · cohesion 0.17

## Key Concepts

- **ServerMessage** (14 connections) — `apps/macos/Sources/MunkelKit/WireMessage.swift`
- **RelayClient.runLoop** (3 connections) — `apps/macos/Sources/MunkelKit/RelayClient.swift`
- **Decodable** (1 connections)
- **RelayClient.start** (1 connections) — `apps/macos/Sources/MunkelKit/RelayClient.swift`
- **RelayClient.startPingLoop** (1 connections) — `apps/macos/Sources/MunkelKit/RelayClient.swift`
- **error** (1 connections) — `apps/macos/Sources/MunkelKit/WireMessage.swift`
- **.init()** (1 connections) — `apps/macos/Sources/MunkelKit/WireMessage.swift`
- **message** (1 connections) — `apps/macos/Sources/MunkelKit/WireMessage.swift`
- **peerJoined** (1 connections) — `apps/macos/Sources/MunkelKit/WireMessage.swift`
- **peerLeft** (1 connections) — `apps/macos/Sources/MunkelKit/WireMessage.swift`
- **pong** (1 connections) — `apps/macos/Sources/MunkelKit/WireMessage.swift`
- **welcome** (1 connections) — `apps/macos/Sources/MunkelKit/WireMessage.swift`

## Relationships

- [[Macos Cluster]] (3 shared connections)
- [[macOS Message Notch UI]] (1 shared connections)
- [[macOS Crypto and Auth Kit]] (1 shared connections)

## Source Files

- `apps/macos/Sources/MunkelKit/RelayClient.swift`
- `apps/macos/Sources/MunkelKit/WireMessage.swift`

## Audit Trail

- EXTRACTED: 26 (96%)
- INFERRED: 1 (4%)
- AMBIGUOUS: 0 (0%)

---

*Part of the graphify knowledge wiki. See [[index]] to navigate.*