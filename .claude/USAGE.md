# Using agent-skills in Claude

## Three layers (this repo)

| Layer | Location | Role |
|-------|----------|------|
| **Commands (SLASH)** | `.claude/commands/` | SDLC slash commands — `/spec` `/plan` `/code-build` `/test` `/review` `/code-simplify` `/ship` |
| **Skills (HOW)** | `.claude/skills/` | Workflows with verification gates — 23 lifecycle + `commit-push-with-changelog` |
| **Rules (WHEN)** | `.claude/rules/` | Orchestration index + intent mapping (`agent-skills.md`) |
| **Agents (DELEGATE)** | `.claude/agents/` | Specialist subagents for review and `/ship` |

## SDLC flow

```
/spec → /plan → /code-build → /test → /review → /code-simplify → /ship
```

| Command | When |
|---------|------|
| `/spec` | New feature or change — write SPEC.md first |
| `/plan` | Spec exists — break into tasks |
| `/code-build` | Execute next plan task incrementally |
| `/test` | TDD or Prove-It for bugs |
| `/review` | Before merge |
| `/code-simplify` | Code works but is hard to read |
| `/ship` | Production launch — parallel review + go/no-go |

Slash commands live in `.claude/commands/` — they are user-invocable only via `/` and never auto-invoked by Claude.

## Direct skill invoke

Type `/` and search by skill name, e.g. `/debugging-and-error-recovery`, `/frontend-ui-engineering`.

Or say: "Follow the test-driven-development skill for this change."

## Subagents

| Subagent | Use for |
|----------|---------|
| `code-reviewer` | Five-axis review before merge |
| `security-auditor` | OWASP, secrets, auth |
| `test-engineer` | Coverage and Prove-It gaps |

Example: "Use the security-auditor subagent on `auth.ts`."

`/ship` runs all three in parallel, then merges reports.

## Context discipline

- Do **not** copy all 23 skills into rules — Claude discovers `.claude/skills/` on demand.
- Load phase-specific skills via `/` when needed.
- Reference checklists from `references/` only when relevant.

## Verify installation

1. Claude Settings → **Rules** → skills listed under Agent Decides.
2. Agent chat → `/` → see `spec`, `plan`, `code-build`, `review`, `ship`, etc.
3. `.claude/agents/` → three `.md` persona files present.

## Other projects

To use this package in another repo:

```bash
# Copy skills you need
cp -r /path/to/agent-skills/skills/test-driven-development .claude/skills/
cp /path/to/agent-skills/agents/code-reviewer.md .claude/agents/

# Option C: Claude Settings → Add Rule → Remote Rule (GitHub)
# URL: https://github.com/addyosmani/agent-skills
```

See [`CLAUDE.md`](../CLAUDE.md) for authoring conventions.
