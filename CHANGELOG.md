# Changelog

All notable changes to this repository are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [Unreleased]

### Changed

- Resolved the backoffice shadcn P0 UI/UX audit blockers across staff drawer accessibility, route error mapping, invoice detail confirms, toast theme sync, and layout navigation labels.
- Resolved the backoffice shadcn P2 UI/UX audit consistency findings across shared loading states, invoice parity, list-page actions, dashboard empty states, smart report preview, permission admin empty states, route reload handling, and layout fallback labels.
- Resolved the backoffice shadcn P3 UI/UX audit polish findings across copy alignment, icon sizing, dashboard notes, login affordances, smart report alerts, and audit resolution tracking.

### Added

- **`coding-standard/frontend/backoffice/live-demo-shadcn/`** — shadcn/ui + Tailwind v4 reference template (layout templates, demo views, shared filter/table components) for Zero Platform backoffice migration.
- **`coding-standard/frontend/backoffice/live-demo/`** — standalone Vite demo with interactive sidebar navigation, mock data aligned to production schemas, and copy-paste layout boilerplate (`PageContainer`, `DetailContainer`, `FiltersContainer`, `PageContentCard`, list/detail/dashboard/result views).
- **`coding-standard/frontend/backoffice/1-layout-standards.md`**, **`2-theme-and-tokens.md`**, **`live-demo/PROGRESS.md`**, and **`templates/README.md`** — layout composition rules, design tokens, and migration progress notes for backoffice UI standards.
- Added `code-base.ignore/` and `.agents/` to `.gitignore`, `.cursorignore`, and `.claudeignore` to prevent indexing excluded context.
- `create-pull-request` skill — slash-command wrapper and skill for creating pull requests (added to `.agents`, `.claude`, and `.cursor`).
- `.cursor/skills/code-build/SKILL.md` and `.claude/commands/code-build.md` — `/code-build` slash-command wrapper (incremental-implementation + test-driven-development).
- `.agents/skills/*` and `agent-skills.rules` — Zed-ready skill package and orchestration rules aligned with the Cursor/Claude command set.
- `.agents/skills/README.md` — skills index for the Zed/Agents distribution.
- `.agents/skills/source-driven-development/SKILL.md` — lifecycle skill copy for the Agents package.
- Root `.gitignore` — ignores local `code-base/` sandbox, secrets (`.env`, `*.pem`, `*.key`), build artifacts, and Claude session caches.
- Cursor-first layout under `.cursor/` — lifecycle skills, seven slash-command wrappers (`/spec` … `/ship`), orchestration rule (`agent-skills.mdc`), subagents, and team guide (`USAGE.md`).
- Claude Code distribution under `.claude/` — SDLC commands, lifecycle skills (including `bruno-generator` and `commit-push-with-changelog`), review subagents, orchestration rules, and team guide (`USAGE.md`).
- Root `CLAUDE.md` and `.claudeignore` — Claude entry point; `.claudeignore` keeps `.cursor/` out of Claude agent context.
- `.cursor/skills/bruno-generator/SKILL.md` — Bruno API collection practices (`.bru` / legacy `.yml`, environment variables, token extraction scripts).
- `commit-push-with-changelog` skill with repo-confirmation gates and CHANGELOG requirements.
- Coding standards reorganized by surface: `coding-standard/backend`, `auth`, `gateway`, and `frontend`.
- Auth and gateway Spectral packs plus error-code registries: `coding-standard/{auth,gateway}/spectral/org-api.yaml` and `coding-standard/{auth,gateway}/codes.yaml`.
- **`coding-standard/software-testing/`** — testing standards library (unit through compatibility) with README guides and copy-ready examples per level.
- **`.mcp.json`** — repo-local MCP config for `chrome-devtools` (supports `browser-testing-with-devtools` skill).

### Changed

- **`coding-standard/frontend/backoffice/1-tech-stack.md`** and **`6-ui-and-styling.md`** — document Ant Design (legacy) and shadcn/ui (migration target) UI stacks side by side.
- **`coding-standard/frontend/backoffice/live-demo/`** — align demo views with production field names, sidebar menu structure, and detail navigation flows.
- **Coding standards (Active Branch Selector):** document `home_branch_id` JWT claim and `x-user-home-branch` mesh header order in `coding-standard/{auth,gateway,backend}/4-request-headers.md`; align Redis `token_gen` policy to **fail-closed** when `REDIS_URL` is configured (`auth/3-api-routing.md`, `gateway/3-api-routing.md`); add `x-user-home-branch` to Spectral `trustedHeaderOrder`.
- **Auth error registry:** add `AUTH_BRANCH_SWITCH_FORBIDDEN`, `AUTH_BRANCH_FORBIDDEN`, and `AUTH_BRANCH_NOT_FOUND` to `coding-standard/auth/codes.yaml`.
- Updated "Related Coding Standards" in all slash command files across `.claude`, `.agents`, and `.cursor` to explicitly reference exact filenames mapped independently to Backend, Auth, Frontend, and Gateway.
- Spectral shared rules moved from `_coding-standards/spectral/` to `coding-standard/backend/spectral/` and backend validation docs updated to the new paths.
- Backend Spectral rules (`coding-standard/backend/spectral/org-api.yaml`) now enable `trustedHeaderOrder` and add automated checks for OpenAPI version and `/api/v1` path prefix.
- OpenAPI contract/validation docs in `coding-standard/{auth,backend,gateway}` now mark Spectral-enforced constraints as `[Automated by Spectral]`.
- Slash-command wrappers are now hosted again under `.cursor/skills/*` (`spec`, `plan`, `code-build`, `test`, `review`, `code-simplify`, `ship`, `commit-push-with-changelog`) and `README`/usage links were updated accordingly.
- **Coding standards:** `coding-standard/{auth,backend,gateway}/9-operations-and-deployment.md` — document `/healthz` and `/readyz` JSON schemas, forbid `/health`, and specify `503` `application/problem+json` readiness failures.
- **Backend standard:** `coding-standard/backend/9-operations-and-deployment.md` now uses the project response envelope for `/readyz` failure (`503` JSON with `success/code/message/data/requestId`) instead of RFC 7807.
- **Backend standard:** `coding-standard/backend/5-security-and-validation.md` clarifies validation error handling to return the custom JSON wrapper consistently.
- **Slash skills:** `/spec` and `/plan` write artifacts under `_mission-control/` (`SPEC.md`, `tasks/plan.md`, `tasks/todo.md`).
- `README.md` and `CLAUDE.md` document multi-IDE layout (`.claude/`, `.cursor/`, `.gemini/`).
- Cursor and Claude usage docs now standardize on `/code-build` (replacing `/build`) in SDLC examples and command tables.
- `CLAUDE.md` — prioritize in-repo skills; slim authoring entry point; drop stale multi-IDE setup links.
- `.cursor/USAGE.md` and `.claude/USAGE.md` — point authoring notes to `CLAUDE.md` instead of removed setup docs.
- `.agents/skills/*` slash wrappers — internal path references use `.agents/skills/` for Zed discovery.
- `bruno-generator` — add YAML frontmatter (`name`, `description`) in `.cursor/` and `.claude/` copies.
- `commit-push-with-changelog` — reference `/code-build` instead of legacy `/build` across IDE copies.
- `.cursorignore` — exclude `CLAUDE.md` and `.claude/` from Cursor agent context while both remain tracked for Claude Code users.
- `references/orchestration-patterns.md` aligned with Cursor rules and subagent orchestration.

### Removed

- `.cursor/commands/` wrapper tree (commands consolidated back into `.cursor/skills/`).
- Legacy `/build` wrappers (`.cursor/skills/build/SKILL.md` and `.claude/commands/build.md`) replaced by `/code-build`.
- Duplicate "Related Coding Standards" footer from `.cursor/rules/agent-skills.mdc` and `.claude/rules/agent-skills.md` (standards belong in individual skills).
- Multi-IDE plugin and command trees (`.claude-plugin/`, `.gemini/commands/`, legacy `docs/*-setup.md`).
- Session hooks under `hooks/` and `scripts/validate-skills.js`.
- Demo `services/items/` sample service and root `skills/` tree (content lives under `.cursor/skills/`).
- Legacy `coding-standard/service/` monolith and root `agents/` copies (moved under `.cursor/agents/` and `.claude/agents/`).

### Fixed

- Root `.gitignore` — exclude `.cursor/skills/code-build/` from the global `build/` pattern so the `/code-build` skill is tracked by git.
