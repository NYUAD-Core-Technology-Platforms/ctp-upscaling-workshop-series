---
tags:
  - decisions
last_updated: 2026-10-16
---

# Decisions

Lasting decisions, newest at the bottom. Each one has a number (D1, D2, ...), a date, the reason
and a status. Never delete an entry: when a decision changes, add a new one and mark the old one
*superseded by Dn*. Up: [[index]]

## How to add a decision

Copy this block to the bottom, give it the next number and fill it in:

```text
## YYYY-MM-DD - Dn: Short title

- **Decision:** what was decided.
- **Context:** what made a decision necessary.
- **Alternatives:** what else was considered, and why not.
- **Consequences:** what changes now, and which notes were updated.
- **Evidence:** links to the meeting, email or document.
- **Status:** proposed / accepted / superseded by Dn
```

## 2026-10-16 - D1: Keep the project memory in this vault

- **Decision:** notes, decisions and the current state of our projects live in this folder as
  plain Markdown. AI chats are workspaces, not the record.
- **Context:** project knowledge was scattered across chat histories in different tools; it went
  stale and colleagues could not check it.
- **Alternatives:** one long chat per project (goes stale, tied to one tool); a shared document
  (no links, hard for AI tools to navigate).
- **Consequences:** every AI tool follows [[AGENTS]]; outcomes are written back to the project
  note; the folder is versioned with Git.
- **Evidence:** [[Example meeting]]
- **Status:** accepted
