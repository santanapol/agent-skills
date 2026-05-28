# Changelog

All notable changes to this repository are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [Unreleased]

### Added

- Root `.gitignore` — ignores local `code-base/` sandbox, secrets (`.env`, `*.pem`, `*.key`), build artifacts, and Claude session caches.
- Cursor-first layout under `.cursor/` — lifecycle skills, seven slash-command wrappers (`/spec` … `/ship`), orchestration rule (`agent-skills.mdc`), subagents, and team guide (`USAGE.md`).
- Claude Code parity under `.claude/` — core lifecycle skills and review subagents.
- `commit-push-with-changelog` skill with repo-confirmation gates and CHANGELOG requirements.
- Coding standards reorganized by surface: `coding-standard/backend`, `auth`, `gateway`, and `frontend`.
- Auth and gateway Spectral packs plus error-code registries: `coding-standard/{auth,gateway}/spectral/org-api.yaml` and `coding-standard/{auth,gateway}/codes.yaml`.

### Changed

- Spectral shared rules moved from `_coding-standards/spectral/` to `coding-standard/backend/spectral/` and backend validation docs updated to the new paths.
- Backend Spectral rules (`coding-standard/backend/spectral/org-api.yaml`) now enable `trustedHeaderOrder` and add automated checks for OpenAPI version and `/api/v1` path prefix.
- OpenAPI contract/validation docs in `coding-standard/{auth,backend,gateway}` now mark Spectral-enforced constraints as `[Automated by Spectral]`.
- Slash-command wrappers are now hosted again under `.cursor/skills/*` (`spec`, `plan`, `build`, `test`, `review`, `code-simplify`, `ship`, `commit-push-with-changelog`) and `README` links were updated accordingly.
- **Coding standards:** `coding-standard/{auth,backend,gateway}/9-operations-and-deployment.md` — document `/healthz` and `/readyz` JSON schemas, forbid `/health`, and specify `503` `application/problem+json` readiness failures.
- **Backend standard:** `coding-standard/backend/9-operations-and-deployment.md` now uses the project response envelope for `/readyz` failure (`503` JSON with `success/code/message/data/requestId`) instead of RFC 7807.
- **Backend standard:** `coding-standard/backend/5-security-and-validation.md` clarifies validation error handling to return the custom JSON wrapper consistently.
- **Slash skills:** `/spec` and `/plan` write artifacts under `_mission-control/` (`SPEC.md`, `tasks/plan.md`, `tasks/todo.md`).
- `README.md` and `CLAUDE.md` refocused on Cursor SDLC workflow and `.cursor/` discovery paths.
- `references/orchestration-patterns.md` aligned with Cursor rules and subagent orchestration.

### Removed

- `.claude/` mirror skills and agents from this repo scope (Cursor remains source of truth).
- `.cursor/commands/` wrapper tree (commands consolidated back into `.cursor/skills/`).
- Multi-IDE plugin and command trees (`.claude-plugin/`, `.gemini/commands/`, legacy `docs/*-setup.md`).
- Session hooks under `hooks/` and `scripts/validate-skills.js`.
- Demo `services/items/` sample service and root `skills/` tree (content lives under `.cursor/skills/`).
- Legacy `coding-standard/service/` monolith and root `agents/` copies (moved under `.cursor/agents/` and `.claude/agents/`).
