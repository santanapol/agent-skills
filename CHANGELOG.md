# Changelog

All notable changes to this repository are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [Unreleased]

### Added

- `.cursor/commands/` — slash command wrappers (`/spec`, `/plan`, `/build`, `/test`, `/review`, `/code-simplify`, `/ship`, `/commit-push-with-changelog`) separated from lifecycle skills.
- `_coding-standards/spectral/` — shared Spectral rule packs for API linting.
- Root `.gitignore` — ignores local `code-base/` sandbox, secrets (`.env`, `*.pem`, `*.key`), build artifacts, and Claude session caches.
- Cursor-first layout under `.cursor/` — lifecycle skills, seven slash-command wrappers (`/spec` … `/ship`), orchestration rule (`agent-skills.mdc`), subagents, and team guide (`USAGE.md`).
- Claude Code parity under `.claude/` — core lifecycle skills and review subagents.
- `commit-push-with-changelog` skill with repo-confirmation gates and CHANGELOG requirements.
- Coding standards reorganized by surface: `coding-standard/backend`, `auth`, `gateway`, and `frontend`.

### Changed

- `.cursor/skills/README.md` now points slash command docs to `.cursor/commands/*`.
- **Coding standards:** `coding-standard/{auth,backend,gateway}/9-operations-and-deployment.md` — document `/healthz` and `/readyz` JSON schemas, forbid `/health`, and specify `503` `application/problem+json` readiness failures.
- **Backend standard:** `coding-standard/backend/9-operations-and-deployment.md` now uses the project response envelope for `/readyz` failure (`503` JSON with `success/code/message/data/requestId`) instead of RFC 7807.
- **Backend standard:** `coding-standard/backend/5-security-and-validation.md` clarifies validation error handling to return the custom JSON wrapper consistently.
- **Slash skills:** `/spec` and `/plan` write artifacts under `_mission-control/` (`SPEC.md`, `tasks/plan.md`, `tasks/todo.md`).
- `README.md` and `CLAUDE.md` refocused on Cursor SDLC workflow and `.cursor/` discovery paths.
- `references/orchestration-patterns.md` aligned with Cursor rules and subagent orchestration.

### Removed

- `.claude/` mirror skills and agents from this repo scope (Cursor remains source of truth).
- Legacy slash-command wrappers under `.cursor/skills/{spec,plan,build,test,review,code-simplify,ship,commit-push-with-changelog}`.
- Multi-IDE plugin and command trees (`.claude-plugin/`, `.gemini/commands/`, legacy `docs/*-setup.md`).
- Session hooks under `hooks/` and `scripts/validate-skills.js`.
- Demo `services/items/` sample service and root `skills/` tree (content lives under `.cursor/skills/`).
- Legacy `coding-standard/service/` monolith and root `agents/` copies (moved under `.cursor/agents/` and `.claude/agents/`).
