# Crypto Key Derivation

> 18 nodes · cohesion 0.18

## Key Concepts

- **GroupKey** (20 connections) — `apps/macos/Sources/MunkelKit/GroupKey.swift`
- **GroupKeyTests** (7 connections) — `apps/macos/Tests/MunkelKitTests/CryptoTests.swift`
- **MessageCryptoTests** (5 connections) — `apps/macos/Tests/MunkelKitTests/CryptoTests.swift`
- **CryptoTests.swift** (2 connections) — `apps/macos/Tests/MunkelKitTests/CryptoTests.swift`
- **.init()** (2 connections) — `apps/macos/Sources/MunkelKit/GroupKey.swift`
- **.normalize()** (2 connections) — `apps/macos/Sources/MunkelKit/GroupKey.swift`
- **.derivationIsDeterministic()** (2 connections) — `apps/macos/Tests/MunkelKitTests/CryptoTests.swift`
- **.differentCodesYieldDifferentGroups()** (2 connections) — `apps/macos/Tests/MunkelKitTests/CryptoTests.swift`
- **.groupIdIs32LowercaseHexChars()** (2 connections) — `apps/macos/Tests/MunkelKitTests/CryptoTests.swift`
- **.interopVectorMatchesTypeScript()** (2 connections) — `apps/macos/Tests/MunkelKitTests/CryptoTests.swift`
- **.messageKeyDiffersFromGroupId()** (2 connections) — `apps/macos/Tests/MunkelKitTests/CryptoTests.swift`
- **.normalizationFoldsCaseAndWhitespace()** (2 connections) — `apps/macos/Tests/MunkelKitTests/CryptoTests.swift`
- **.openFailsOnTamperedCiphertext()** (2 connections) — `apps/macos/Tests/MunkelKitTests/CryptoTests.swift`
- **.openFailsWithWrongKey()** (2 connections) — `apps/macos/Tests/MunkelKitTests/CryptoTests.swift`
- **.payloadLayoutIsNoncePlusCiphertextPlusTag()** (2 connections) — `apps/macos/Tests/MunkelKitTests/CryptoTests.swift`
- **.sealOpenRoundtrip()** (2 connections) — `apps/macos/Tests/MunkelKitTests/CryptoTests.swift`
- **HKDF-SHA256 Key Derivation** (1 connections) — `.planning/PROJECT.md`
- **GroupKey.swift** (1 connections) — `apps/macos/Sources/MunkelKit/GroupKey.swift`

## Relationships

- [[Macos Cluster]] (5 shared connections)
- [[macOS Crypto and Auth Kit]] (1 shared connections)

## Source Files

- `.planning/PROJECT.md`
- `apps/macos/Sources/MunkelKit/GroupKey.swift`
- `apps/macos/Tests/MunkelKitTests/CryptoTests.swift`

## Audit Trail

- EXTRACTED: 34 (57%)
- INFERRED: 26 (43%)
- AMBIGUOUS: 0 (0%)

---

*Part of the graphify knowledge wiki. See [[index]] to navigate.*