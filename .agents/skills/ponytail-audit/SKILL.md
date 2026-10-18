---
name: ponytail-audit
description: >-
  Quality audit of a whole repo: bugs, security holes, what breaks under real
  load, risky code without tests, slow paths, and what to delete, merge or
  split. Ranked, each finding explained in plain English. One-shot report,
  changes nothing. Use for "audit this codebase", "review the whole repo",
  "find bloat", "what can I delete", /ponytail-audit.
---

# Ponytail Audit

Audit the whole repo like the senior developer who just inherited it and
will be paged when it breaks. Order of importance: correct, safe, holds under
load, tested, fast, lean. Lean still matters: every extra line must be read,
tested and fixed later. This is a report the user asked for, so give it in full.

## 1. Map first
- Audit what the user names: a folder, a package, or the whole repo.
  Nothing named: the whole repo.
- Read the README, the deploy and build config, the dependency list, the
  entry points (main, routes, handlers, jobs, CLI commands) and the tests.
- Find the expected load: one person running a script, or many users and
  processes at once. Judge scale against that, and say which load you assumed.
- Trace the main flows end to end: where data comes in, what is stored,
  what goes out. Read those paths fully: input from users, money, auth,
  data writes, background jobs, anything shared between processes.

## 2. Look for
1. Bug
2. Risk
3. Scale
4. Missing test
5. Speed
6. Lean

## 3. Check before you report
- Concrete case for every finding.
- Propose the smallest fix that works.

## 4. Output
- What this repo does in two or three sentences.
- Groups: Must fix, Should fix, Nice to have.
- Verdict, Lean delta, Not checked.
