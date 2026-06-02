# Cursor configuration (agent-skills)

Cursor discovers this repo's agent-skills package from `.cursor/`.

## Layout

| Path | Role |
|------|------|
| [`.cursor/skills/`](./skills/) | 23 lifecycle skills (copied from `skills/`) + 7 SDLC slash skills (`/spec` … `/ship`) |
| [`.cursor/agents/`](./agents/) | Specialist subagents: code-reviewer, security-auditor, test-engineer |
| [`.cursor/rules/`](./rules/) | Project rules — orchestration index |

Lifecycle skills under `.cursor/skills/<name>/` are **copies** of `skills/<name>/`. After editing canonical content in `skills/`, re-copy to `.cursor/skills/` if you want Cursor to pick up changes.

## Quick start

1. Open this repo in Cursor.
2. **Settings → Rules** — confirm skills appear under **Agent Decides**.
3. In Agent chat, type `/` and pick e.g. `/spec`, `/plan`, `/code-build`, `/review`, `/ship`.
4. For a single perspective: `@code-reviewer` or ask to use the `code-reviewer` subagent.

## Team guide

See [USAGE.md](./USAGE.md).

## Vendor docs (summaries)

[_knowledge/cursor-docs/](../_knowledge/cursor-docs/) — rules, skills, subagents, standards stack.
