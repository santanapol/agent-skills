# Changelog

All notable changes to this repository are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [Unreleased]

### Added

- Cursor-first layout under `.cursor/` — lifecycle skills, seven slash-command wrappers (`/spec` … `/ship`), orchestration rule (`agent-skills.mdc`), subagents, and team guide (`USAGE.md`).
- Claude Code parity under `.claude/` — core lifecycle skills and review subagents.
- `commit-push-with-changelog` skill with repo-confirmation gates and CHANGELOG requirements.
- Coding standards reorganized by surface: `coding-standard/backend`, `auth`, `gateway`, and `frontend`.

### Changed

- `README.md` and `CLAUDE.md` refocused on Cursor SDLC workflow and `.cursor/` discovery paths.
- `references/orchestration-patterns.md` aligned with Cursor rules and subagent orchestration.

### Removed

- Multi-IDE plugin and command trees (`.claude-plugin/`, `.gemini/commands/`, legacy `docs/*-setup.md`).
- Session hooks under `hooks/` and `scripts/validate-skills.js`.
- Demo `services/items/` sample service and root `skills/` tree (content lives under `.cursor/skills/`).
- Legacy `coding-standard/service/` monolith and root `agents/` copies (moved under `.cursor/agents/` and `.claude/agents/`).
