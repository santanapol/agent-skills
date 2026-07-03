# Path Conventions (zero-platform)

Base repo root for paths below: `code-base/zero-platform/`

## Central spec SoT

```
docs/specs/backend/<service>/
├── <service>-spec.md
├── business-domain.md
├── technical-architecture.md
├── database-erd.md
├── TESTING.md
├── WORKFLOW.md
└── plans/README.md
```

## Package paths

| Service | Package | OpenAPI |
|---------|---------|---------|
| staff, agent-invoice, branch-report, smart-report, demo-service | `backend/service/<service>/` | `openapi.yaml` |
| auth | `backend/auth/` | `openapi.yaml` |
| gateway | `backend/gateway/` | `openapi.yaml` |

## Relative links from `docs/specs/backend/<service>/`

Spec folder อยู่ลึก 4 ชั้นใต้ `code-base/zero-platform/` (`docs/specs/backend/<service>/`) → ต้อง `../` **4 ตัว** ถึงจะถึง `zero-platform/` root และ **6 ตัว** ถึงจะถึง workspace root (ที่ `coding-standard/` อยู่)

**นับ `../` จาก spec folder เท่ากันทุก service** — auth/gateway/service ใช้จำนวนเท่ากัน ต่างแค่ส่วนท้าย (descending path) เท่านั้น

| Target | Example from `staff/` |
|--------|----------------------|
| OpenAPI in package | `../../../../backend/service/staff/openapi.yaml` |
| Auth openapi | `../../../../backend/auth/openapi.yaml` |
| RUNBOOK | `../../../../backend/service/staff/RUNBOOK.md` |
| codes.yaml | `../../../../backend/service/staff/codes.yaml` |
| coding-standard (workspace root) | `../../../../../../coding-standard/backend/...` |

## Redirect stub (package `docs/README.md`)

**Service tier** (`backend/service/<name>/docs/README.md`) — ลึก 4 ชั้นใต้ `zero-platform/` → `../` **4 ตัว**:

```markdown
# <Service> docs (redirect)

Business, technical, persistence, and testing specs live at:

**[docs/specs/backend/<service>/](../../../../docs/specs/backend/<service>/<service>-spec.md)**

Runtime artifacts remain in this package: `openapi.yaml`, `codes.yaml`, `RUNBOOK.md`, `src/`.
```

**auth / gateway** (`backend/auth/docs/README.md`) — ลึก 3 ชั้น → ใช้ `../` **3 ตัว** (`../../../docs/specs/backend/auth/auth-spec.md`) เพราะไม่มี segment `service/`

## Backlink checklist (after consolidate)

- [ ] `openapi.yaml` description links to central spec
- [ ] `backend/README.md`
- [ ] `docs/test/TESTING-GUIDE.md`
- [ ] Cross-service docs (e.g. auth → staff business-domain)
- [ ] `frontend/backoffice/docs/api-mapping.md`
- [ ] Service `README.md`, `RUNBOOK.md`
- [ ] Grep stale paths: `backend/service/<service>/docs/` (old locations)

## Frontend consumer docs

```
frontend/backoffice/docs/api-mapping.md
frontend/backoffice/README.md
```
