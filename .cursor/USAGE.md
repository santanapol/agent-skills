# Using agent-skills in Cursor

## Three layers (this repo)

| Layer | Location | Role |
|-------|----------|------|
| **Skills (HOW)** | `.cursor/skills/` | Workflows with verification gates — 23 lifecycle + 7 slash commands |
| **Rules (WHEN)** | `.cursor/rules/` | Orchestration index + intent mapping (`agent-skills.mdc`) |
| **Agents (DELEGATE)** | `.cursor/agents/` | Specialist subagents for review and `/ship` |

## SDLC flow

```
/spec → /plan → /build → /test → /review → /code-simplify → /ship
```

| Command | When |
|---------|------|
| `/spec` | New feature or change — write SPEC.md first |
| `/plan` | Spec exists — break into tasks |
| `/build` | Execute next plan task incrementally |
| `/test` | TDD or Prove-It for bugs |
| `/review` | Before merge |
| `/code-simplify` | Code works but is hard to read |
| `/ship` | Production launch — parallel review + go/no-go |

Slash skills use `disable-model-invocation: true` — invoke them explicitly with `/` so they are not loaded on every message.

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

- Do **not** copy all 23 skills into rules — Cursor discovers `.cursor/skills/` on demand.
- Load phase-specific skills via `/` when needed.
- Reference checklists from `references/` only when relevant.

## Verify installation

1. Cursor Settings → **Rules** → skills listed under Agent Decides.
2. Agent chat → `/` → see `spec`, `plan`, `build`, `review`, `ship`, etc.
3. `.cursor/agents/` → three `.md` persona files present.

## Other projects

To use this package in another repo:

```bash
# Copy skills you need
cp -r /path/to/agent-skills/skills/test-driven-development .cursor/skills/
cp /path/to/agent-skills/agents/code-reviewer.md .cursor/agents/

# Option C: Cursor Settings → Add Rule → Remote Rule (GitHub)
# URL: https://github.com/addyosmani/agent-skills
```

See [docs/cursor-setup.md](../docs/cursor-setup.md) for details.
