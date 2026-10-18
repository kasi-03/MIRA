---
name: ponytail-debt
description: >-
  List every shortcut: comment as a debt ledger. One-shot report,
  changes nothing. Use for "ponytail debt", "what did ponytail defer", "list the
  shortcuts", /ponytail-debt.
---

# Ponytail Debt

Every deliberate ponytail shortcut is marked with a `shortcut:` comment naming
its ceiling and upgrade path.

## Scan
Grep the repo for `shortcut:` and `ponytail:` comment markers, skipping `.git` and ignored paths.

## Output
`<file>:<line>, <what was simplified>. ceiling: <limit>. upgrade: <trigger>.`
