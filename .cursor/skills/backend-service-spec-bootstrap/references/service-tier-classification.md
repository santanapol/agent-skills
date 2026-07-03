# Service Tier Classification

Classify before bootstrapping. Output tier in audit report.

## Tier A — Reference (done)

**Example:** staff

**Signals:**

- `docs/specs/backend/staff/staff-spec.md` with `status: implemented`
- Full doc set under central spec folder
- AC traceability + `WORKFLOW.md`
- `npm run ci` includes spec gates

**Action:** Use as golden template only. Audit drift if requested; do not full bootstrap.

## Tier B — Implemented, thin spec

**Examples:** auth, gateway, agent-invoice (draft `*-spec.md`)

**Signals:**

- Working code + tests + openapi
- Central `*-spec.md` exists but short / `status: draft`
- Rich docs may still live in package `docs/`

**Action:** DISCOVER → consolidate → upgrade `*-spec.md` → interview gaps → harden

## Tier C — Uneven docs

**Examples:** branch-report, smart-report

**Signals:**

- Multiple doc files with unclear SoT
- Partial central spec
- Domain docs in package (`docs/design/`, `erd/`)

**Action:** DISCOVER + **ask human which legacy files are authoritative** before merge

## Tier D — Scaffold only

**Signals:**

- Thin or no implementation
- Spec is aspirational
- Few or no integration tests

**Action:** **Stop bootstrap.** Use `spec-driven-development` to define spec before code.

## Tier E — Legacy, no central spec

**Example:** demo-service (no `docs/specs/backend/demo-service/`)

**Signals:**

- Code + openapi + tests exist
- No `docs/specs/backend/<service>/` folder (or empty)

**Action:** Full REVERSE_ENGINEER — create entire doc set from code + interview

## Decision tree

```
Has working code + tests?
  No  → Tier D → spec-driven-development
  Yes → Has docs/specs/backend/<service>/*-spec.md implemented?
          Yes → Tier A (or B if draft) → audit / upgrade
          No  → Has scattered package docs?
                  Yes → Tier B or C
                  No  → Tier E → full reverse-engineer
```
