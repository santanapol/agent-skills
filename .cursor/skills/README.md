# Skills index (Cursor)

## SDLC slash commands (`disable-model-invocation: true`)

| Skill | Command | Invokes |
|-------|---------|---------|
| [spec](./spec/SKILL.md) | `/spec` | spec-driven-development |
| [plan](./plan/SKILL.md) | `/plan` | planning-and-task-breakdown |
| [build](./build/SKILL.md) | `/build` | incremental-implementation + TDD |
| [test](./test/SKILL.md) | `/test` | test-driven-development |
| [review](./review/SKILL.md) | `/review` | code-review-and-quality |
| [code-simplify](./code-simplify/SKILL.md) | `/code-simplify` | code-simplification |
| [ship](./ship/SKILL.md) | `/ship` | shipping-and-launch + subagents |

## Lifecycle skills (copied from `skills/`)

| Phase | Skills |
|-------|--------|
| Meta | using-agent-skills |
| Define | interview-me, idea-refine, spec-driven-development |
| Plan | planning-and-task-breakdown |
| Build | incremental-implementation, test-driven-development, context-engineering, source-driven-development, doubt-driven-development, frontend-ui-engineering, api-and-interface-design |
| Verify | browser-testing-with-devtools, debugging-and-error-recovery |
| Review | code-review-and-quality, code-simplification, security-and-hardening, performance-optimization |
| Ship | git-workflow-and-versioning, ci-cd-and-automation, deprecation-and-migration, documentation-and-adrs, shipping-and-launch |

Source of truth for authoring: `skills/<name>/SKILL.md` at repo root. Re-run `cp -a skills/<name> .cursor/skills/<name>` after editing upstream skills.
