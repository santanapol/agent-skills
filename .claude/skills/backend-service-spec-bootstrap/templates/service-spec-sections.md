# {{service}}-spec.md — Section Checklist

Use when creating or upgrading central spec entry point.

## Frontmatter

```yaml
---
status: reverse-engineered   # → implemented after harden
created: YYYY-MM-DD
updated: YYYY-MM-DD
owner: <name>
last-verified: YYYY-MM-DD
source-scan: YYYY-MM-DD — src N/N files   # from DISCOVER inventory
---
```

## Required sections

### 1. Objective

- One paragraph: what the service does
- Bullet list of core capabilities (from modules + openapi)
- Primary users

### 2. Consumers

- Table or list: who calls this service (backoffice, other services)
- Source: grep + `api-mapping.md` + interview

### 3. Source of Truth

| หัวข้อ | SoT | ชนะเมื่อขัด |
|--------|-----|-------------|
| Business rules | business-domain.md | — |
| HTTP contract | openapi.yaml | ชนะ business doc |
| Persistence | database-erd.md | — |
| Error codes | codes.yaml | sync error-codes.js |
| Ops | RUNBOOK.md | — |
| Testing | TESTING.md | — |
| New features | WORKFLOW.md | — |

### 4. Tech Stack + Commands

From `package.json` — do not guess versions; read lockfile/package.

### 5. Project Structure

```
docs/specs/backend/{{service}}/   → Spec SoT
{{PACKAGE_PATH}}/                 → Runtime package
```

### 6. API Endpoints (summary)

Table: Method, Path, Permission, Notes — detail in openapi.

### 7. Permission Model (if applicable)

From route guards + business-domain interview.

### 8. Acceptance Criteria

```markdown
| ID | Criterion | Test |
|----|-----------|------|
| AC-01 | ... | path/to/test.js |
```

Rules:

- Derive from existing integration tests
- If no test → Open Questions, not AC
- Minimum ~6 core criteria for Tier B/E

### 9. Dependencies & Integrations

- Depends on / Consumed by
- Internal + external

### 10. Spec-driven workflow

Short pointer + link to WORKFLOW.md

### 11. Open Questions

Non-blocking items after interview; empty when `implemented`.
