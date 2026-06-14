# Macos Cluster

> 8 nodes · cohesion 0.25

## Key Concepts

- **openSession()** (9 connections) — `apps/macos/Sources/MunkelApp/AppModel.swift`
- **init()** (4 connections) — `apps/macos/Sources/MunkelApp/AppModel.swift`
- **join()** (4 connections) — `apps/macos/Sources/MunkelApp/AppModel.swift`
- **leave()** (4 connections) — `apps/macos/Sources/MunkelApp/AppModel.swift`
- **persistGroups()** (3 connections) — `apps/macos/Sources/MunkelApp/AppModel.swift`
- **fakeApp()** (2 connections) — `apps/cli/test/munkel.test.ts`
- **GroupSession.start** (1 connections) — `apps/macos/Sources/MunkelApp/GroupSession.swift`
- **GroupSession.stop** (1 connections) — `apps/macos/Sources/MunkelApp/GroupSession.swift`

## Relationships

- [[macOS App Model]] (6 shared connections)
- [[Macos Cluster]] (4 shared connections)
- [[macOS Menu and Groups]] (1 shared connections)
- [[macOS Crypto and Auth Kit]] (1 shared connections)
- [[macOS Message Notch UI]] (1 shared connections)
- [[Cli Cluster]] (1 shared connections)

## Source Files

- `apps/cli/test/munkel.test.ts`
- `apps/macos/Sources/MunkelApp/AppModel.swift`
- `apps/macos/Sources/MunkelApp/GroupSession.swift`

## Audit Trail

- EXTRACTED: 23 (82%)
- INFERRED: 5 (18%)
- AMBIGUOUS: 0 (0%)

---

*Part of the graphify knowledge wiki. See [[index]] to navigate.*