# Claude configuration (agent-skills)

Claude discovers this repo's agent-skills package from `.claude/`.

## Layout

| Path | Role |
|------|------|
| [`.claude/commands/`](./commands/) | SDLC slash commands: `/spec` `/plan` `/build` `/test` `/review` `/code-simplify` `/ship` |
| [`.claude/skills/`](./skills/) | 23 lifecycle skills + `/commit-push-with-changelog` (has supporting reference file) |
| [`.claude/agents/`](./agents/) | Specialist subagents: code-reviewer, security-auditor, test-engineer |
| [`.claude/rules/`](./rules/) | Project rules — orchestration index |

Lifecycle skills under `.claude/skills/<name>/` are **copies** of `skills/<name>/`. After editing canonical content in `skills/`, re-copy to `.claude/skills/` if you want Claude to pick up changes.

## Quick start

1. Open this repo in Claude.
2. **Settings → Rules** — confirm skills appear under **Agent Decides**.
3. In Agent chat, type `/` and pick e.g. `/spec`, `/plan`, `/build`, `/review`, `/ship`.
4. For a single perspective: `@code-reviewer` or ask to use the `code-reviewer` subagent.

## Team guide

See [USAGE.md](./USAGE.md).

## Vendor docs (summaries)

[_knowledge/claude-docs/](../_knowledge/claude-docs/) — rules, skills, subagents, standards stack.
