# Staff Golden Path

Reference implementation for `backend-service-spec-bootstrap`.  
Path: `code-base/zero-platform/docs/specs/backend/staff/`

## What staff demonstrates

| Artifact | Role |
|----------|------|
| `staff-spec.md` | Central orchestrator — SoT table, endpoints, permissions, AC-01–AC-10, traceability |
| `business-domain.md` | Business rules, RBAC, flows, out-of-scope |
| `technical-architecture.md` | Plugins, modules, gateway/auth integration |
| `database-erd.md` | Collections, indexes, shared DB notes |
| `TESTING.md` | How to run tests, CI expectations |
| `WORKFLOW.md` | Gated workflow for **new features** after bootstrap |
| `plans/README.md` | Plan file naming convention |

## Runtime artifacts (stay in package)

`backend/service/staff/`:

- `openapi.yaml`, `openapi-via-gateway.yaml`
- `codes.yaml`, `error-codes.js`
- `RUNBOOK.md`
- `src/`, `scripts/`
- `docs/README.md` — redirect stub to central spec

## staff-spec.md sections to replicate

1. Frontmatter: `status`, `created`, `updated`, `owner`, `last-verified`, `source-scan` (`src N/N files`)
2. Objective + Consumers
3. Source of Truth table (with conflict resolution column)
4. Tech stack + Commands (from `package.json`)
5. Project structure (spec folder + package)
6. API endpoint summary table (detail in openapi)
7. Permission model (if applicable)
8. Acceptance criteria + test traceability
9. Dependencies & integrations
10. Spec-driven workflow pointer → `WORKFLOW.md`

## CI gates (staff pattern)

```json
"spec:lint": "spectral lint openapi.yaml ...",
"spec:codes": "node --test codes-registry.test.js",
"ci": "... spec:lint + spec:codes + test ..."
```

Reuse existing package scripts before adding new validators.

## Tier A note

Staff is **Tier A — Reference**. Do not re-bootstrap unless auditing drift. Use as template when bootstrapping other services.
