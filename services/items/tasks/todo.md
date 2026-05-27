# Tasks: items-service

> **Plan:** [`plan.md`](plan.md) · **Spec:** [`../SPEC.md`](../SPEC.md)  
> **Status:** Complete — all tasks done

---

## Phase 1: Foundation

- [x] **Task 1:** Project bootstrap + health probes
  - **Acceptance:** `npm run lint` ผ่าน, `GET /healthz` → 200, `.env.example` ครบ
  - **Verify:** `npm install && npm run lint && curl localhost:3000/healthz`
  - **Files:** `package.json`, `.env.example`, `src/app.js`, `src/server.js`, `src/routes/health.routes.js`
  - **Scope:** M · **Deps:** None

- [x] **Task 2:** MongoDB connection + readiness + index bootstrap
  - **Acceptance:** `/readyz` 200 เมื่อ DB พร้อม, unique index `{ ou_id, branch_id, name }` สร้างตอน startup
  - **Verify:** start server + curl `/readyz`; หยุด MongoDB → 503
  - **Files:** `src/config/database.js`, `src/models/items.model.js`, `src/server.js`
  - **Scope:** S–M · **Deps:** Task 1

### ⛳ Checkpoint: Foundation
- [ ] Server boot + health probes ทำงาน
- [ ] MongoDB connect + index พร้อม
- [ ] `npm run lint` ผ่าน
- [ ] Human review ✋

---

## Phase 2: Core Feature

- [ ] **Task 3:** Shared utilities + middleware stack
  - **Acceptance:** response envelope, audit, ETag, auth (401), user-context (403), Joi validate (400), duplicate header (400)
  - **Verify:** `npm test -- tests/unit/`
  - **Files:** `src/utils/*`, `src/middlewares/*`, `tests/unit/*`
  - **Scope:** M · **Deps:** Task 1

- [ ] **Task 4:** POST /api/v1/items — happy path
  - **Acceptance:** 201 CREATED + ETag, document บันทึกใน MongoDB พร้อม tenant + audit fields
  - **Verify:** `npm test -- tests/integration/items.routes.test.js --grep "creates"`
  - **Files:** `src/models/items.model.js`, `src/services/`, `src/controllers/`, `src/routes/items.routes.js`, `tests/integration/`
  - **Scope:** M · **Deps:** Task 2, Task 3

- [ ] **Task 5:** POST error paths + duplicate handling
  - **Acceptance:** 400 validation, 401 auth, 403 context, 409 duplicate — integration tests ครบ
  - **Verify:** `npm test -- tests/integration/items.routes.test.js`
  - **Files:** `src/services/items.service.js`, `src/middlewares/error.middleware.js`, tests
  - **Scope:** S–M · **Deps:** Task 4

### ⛳ Checkpoint: Core Feature
- [ ] POST create + ทุก error path ทำงาน
- [ ] `npm test` ผ่าน, coverage ≥ 80% (services + controllers)
- [ ] Human review ✋

---

## Phase 3: Contract & Quality Gate

- [ ] **Task 6:** OpenAPI contract + Spectral lint
  - **Acceptance:** `openapi.yaml` OpenAPI 3.1.0, POST documented, `npm run lint:openapi` ผ่าน
  - **Verify:** `npm run lint:openapi`
  - **Files:** `openapi.yaml`, `package.json`
  - **Scope:** S–M · **Deps:** Task 4, Task 5

- [ ] **Task 7:** Final quality gate + service unit tests
  - **Acceptance:** `npm run lint && npm test -- --coverage && npm run lint:openapi` ผ่านทั้งหมด
  - **Verify:** รัน quality gate command + ตรวจ SPEC checklist
  - **Files:** `tests/unit/items.service.test.js`, `jest.config.js`
  - **Scope:** S · **Deps:** Task 5, Task 6

### ⛳ Checkpoint: Complete
- [ ] SPEC success criteria ครบทุกข้อ
- [ ] Quality gate ผ่าน
- [ ] พร้อม `/build`

---

## Quick Reference — SPEC Success Criteria

- [ ] POST 201 CREATED + ETag
- [ ] Duplicate name → 409 DUPLICATE
- [ ] Wrong gateway secret → 401
- [ ] Missing tenant headers → 403
- [ ] Validation fail → 400
- [ ] `npm test` + `npm run lint` + `npm run lint:openapi` ผ่าน
