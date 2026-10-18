---
name: ponytail-review
description: >-
  Quality review of a change: is the logic right, is it safe, does it hold
  under real load, is risky code tested, is it fast enough, and is every line
  needed. Reads the connected code, not only the diff. Each finding is
  explained in plain English. Use for "review this", "code review", "review
  the last commit", "review my PR", "is this over-engineered", /ponytail-review.
---

# Ponytail Review

Review a change like the senior developer who will be paged when it breaks.
Order of importance: correct, safe, holds under load, tested, fast, lean.

## 1. Understand first
- Read the diff, then the code it touches.
- Trace data flow.

## 2. Findings Groups
- Must fix: bug, security, data loss, breaks at load.
- Should fix: risky code without test, slowness, duplication.
- Nice to have: minor optimizations.

End with:
- Verdict: Ship or fix first.
- Not checked: one line.
