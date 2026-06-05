# Skills index (Claude)

## SDLC slash commands

Slash commands live in `.claude/commands/` — see [`../commands/`](../commands/).

| Command | File | Invokes |
|---------|------|---------|
| `/spec` | [commands/spec.md](../commands/spec.md) | spec-driven-development |
| `/plan` | [commands/plan.md](../commands/plan.md) | planning-and-task-breakdown |
| `/code-build` | [commands/code-build.md](../commands/code-build.md) | incremental-implementation + TDD |
| `/test` | [commands/test.md](../commands/test.md) | test-driven-development |
| `/review` | [commands/review.md](../commands/review.md) | code-review-and-quality |
| `/code-simplify` | [commands/code-simplify.md](../commands/code-simplify.md) | code-simplification |
| `/ship` | [commands/ship.md](../commands/ship.md) | shipping-and-launch + subagents |
| `/commit-push-with-changelog` | [skills/commit-push-with-changelog/SKILL.md](./commit-push-with-changelog/SKILL.md) | git workflow + changelog |

## Lifecycle skills

| Phase | Skills |
|-------|--------|
| Meta | using-agent-skills |
| Define | interview-me, idea-refine, spec-driven-development |
| Plan | planning-and-task-breakdown |
| Build | incremental-implementation, test-driven-development, context-engineering, source-driven-development, doubt-driven-development, frontend-ui-engineering, api-and-interface-design |
| Verify | browser-testing-with-devtools, debugging-and-error-recovery |
| Review | code-review-and-quality, code-simplification, security-and-hardening, performance-optimization |
| Ship | git-workflow-and-versioning, ci-cd-and-automation, deprecation-and-migration, documentation-and-adrs, shipping-and-launch |

Source of truth for authoring: `.claude/skills/<name>/SKILL.md` (lifecycle) and `.claude/commands/<name>.md` (slash commands) at repo root.
