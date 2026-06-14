# Server E2E Relay Tests

> 16 nodes · cohesion 0.13

## Key Concepts

- **TestClient** (8 connections) — `apps/server/test/e2e/relay.e2e.test.ts`
- **relay.e2e.test.ts** (7 connections) — `apps/server/test/e2e/relay.e2e.test.ts`
- **.send()** (2 connections) — `apps/server/test/e2e/relay.e2e.test.ts`
- **.sendRaw()** (2 connections) — `apps/server/test/e2e/relay.e2e.test.ts`
- **waitForReady()** (2 connections) — `apps/server/test/e2e/relay.e2e.test.ts`
- **.fetch()** (2 connections) — `apps/server/src/group-room.ts`
- **findAvailablePort()** (1 connections) — `apps/server/test/e2e/relay.e2e.test.ts`
- **Frame** (1 connections) — `apps/server/test/e2e/relay.e2e.test.ts`
- **GROUP_A** (1 connections) — `apps/server/test/e2e/relay.e2e.test.ts`
- **GROUP_B** (1 connections) — `apps/server/test/e2e/relay.e2e.test.ts`
- **openClients** (1 connections) — `apps/server/test/e2e/relay.e2e.test.ts`
- **.close()** (1 connections) — `apps/server/test/e2e/relay.e2e.test.ts`
- **.connect()** (1 connections) — `apps/server/test/e2e/relay.e2e.test.ts`
- **.constructor()** (1 connections) — `apps/server/test/e2e/relay.e2e.test.ts`
- **.expectNone()** (1 connections) — `apps/server/test/e2e/relay.e2e.test.ts`
- **.next()** (1 connections) — `apps/server/test/e2e/relay.e2e.test.ts`

## Relationships

- [[Server Relay and Protocol]] (1 shared connections)

## Source Files

- `apps/server/src/group-room.ts`
- `apps/server/test/e2e/relay.e2e.test.ts`

## Audit Trail

- EXTRACTED: 31 (94%)
- INFERRED: 2 (6%)
- AMBIGUOUS: 0 (0%)

---

*Part of the graphify knowledge wiki. See [[index]] to navigate.*