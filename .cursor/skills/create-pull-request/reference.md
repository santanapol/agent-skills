# CHANGELOG Template

Use this template for `CHANGELOG.md` updates in this skill.

## Minimal entry for ongoing work (Unreleased)

```markdown
## [Unreleased]

### Added
- <new behavior or endpoint>

### Changed
- <updated behavior, refactor visible to users/devs>

### Fixed
- <bug fix with impact>
```

Only keep sections that have real changes.

## Release entry template

```markdown
## [<version>] - <YYYY-MM-DD>

### Added
- <item>

### Changed
- <item>

### Fixed
- <item>

### Removed
- <item>
```

Version format for `<version>` must follow **Semantic Versioning (SemVer)**:

- Use `MAJOR.MINOR.PATCH` (for example: `1.0.0`, `1.2.3`)
- Do not use `v` prefix in the changelog header (use `1.0.0`, not `v1.0.0`)
- Bump guide:
  - `MAJOR`: breaking changes
  - `MINOR`: backward-compatible features
  - `PATCH`: backward-compatible fixes
