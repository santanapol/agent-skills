---
name: backend-service-spec-bootstrap
description: Bootstrap backend service specs from legacy code and scattered docs — read full src/ before spec; reverse-engineer, consolidate, domain interview, harden until spec-driven ready. Ask user for package path if unknown. Golden reference staff. Invoke with /spec-bootstrap-backend.
---

# Backend Service Spec Bootstrap

## Overview

ยกระดับ spec ของ **backend service ที่มี code แล้ว** ให้พร้อม spec-driven development ครอบคลุม:

- ไม่มี `*-spec.md` (ระบบเก่า)
- มี scaffold `*-spec.md` แต่ `status: draft`
- docs กระจายใน package (`backend/*/docs/`) ไม่ sync กับ code

**ไม่ใช่ skill นี้:** ฟีเจอร์ใหม่ → `spec-driven-development` + `WORKFLOW.md` ของ service หลัง bootstrap เสร็จ

**Golden reference:** `code-base/zero-platform/docs/specs/backend/staff/`

**Target SoT:** `code-base/zero-platform/docs/specs/backend/<service>/`

## When to Use

- "ทำ spec-driven ให้ auth / agent-invoice"
- "ย้าย docs มา docs/specs/backend/"
- "harden *-spec.md" / "เทียบ spec กับ code"
- Service มี implementation + tests แต่ central spec ไม่น่าเชื่อถือ

**เมื่อไม่ใช้:**

- แก้ bug เล็กๆ ใน service ที่ spec พร้อมแล้ว
- ฟีเจอร์ใหม่หลัง bootstrap — ใช้ `spec-driven-development`
- Frontend apps — ใช้ `frontend-app-spec-bootstrap` (อนาคต)

## Gated Workflow

ห้ามข้าม phase หรือตั้ง `status: implemented` ก่อนผ่าน human gates

```
LOCATE → CLASSIFY → DISCOVER → REVERSE_ENGINEER → GAP_ANALYSIS
    → DOMAIN_INTERVIEW → MERGE → RESTATE & CONFIRM
    → HARDEN → CI → VERIFY
```

**LOCATE** = หา package root + ถาม user ถ้าไม่แน่ใจ (ดู [source-code-discovery.md](./references/source-code-discovery.md))

อ่าน phase ร่วม: [references/spec-bootstrap-common.md](./references/spec-bootstrap-common.md)

## Re-audit mode — spec ที่ `status: implemented` แล้ว

"เทียบ spec กับ code อีกครั้ง" / quarterly drift audit / spec ที่เคย harden ไปแล้ว — **ห้าม** patch แบบ ad-hoc ทีละ drift แล้วปล่อย (นี่คือสาเหตุที่ auth re-audit แก้ audit/branch/ERD แต่ลืม roles/password/links)

**Lifecycle บังคับเมื่อ re-audit:**

```
implemented → (พบ drift) → downgrade เป็น reverse-engineered ชั่วคราว
    → DISCOVER (full source scan + extraction matrix grep-driven)
    → อัปเดต plans/confidence-map.md (ต้องมีไฟล์ — ถ้าไม่มี ให้สร้าง)
    → resolve ทุก DRIFT + ทุก section ≥ threshold
    → HARDEN gate + spec:consistency ผ่าน → re-harden กลับเป็น implemented
```

**กฎ:**

- **ห้ามคง `status: implemented`** ระหว่าง re-audit ถ้ายังมี `DRIFT` ค้าง — downgrade ก่อน เพื่อไม่ให้ spec โฆษณาว่า "เชื่อถือได้" ทั้งที่ยังมี drift
- Re-audit **ต้อง** ผ่าน gate เดิมครบ (confidence-map + extraction matrix 0 DRIFT + `spec:consistency`) ไม่ใช่แค่แก้ drift ที่เห็นชัด
- ถ้า `plans/confidence-map.md` ไม่มี (spec เก่าที่ bootstrap ก่อนกฎนี้) → **สร้างก่อน** ถือเป็น deliverable ของ re-audit

## Phase 0: LOCATE — หา source code + สร้าง file inventory

**Spec/docs เก่าอาจผิดหรือไม่มี — source code คือความจริงหลัก เป้าหมายของ bootstrap คือ "ระบบเดิมทำงานจริงอย่างไร" ไม่ใช่ "docs บอกว่าอย่างไร"**

อ่าน [references/source-code-discovery.md](./references/source-code-discovery.md)

1. ระบุ **service name** — ถาม user ถ้าไม่ชัด
2. ระบุ **package root** (`backend/auth/`, `backend/service/<name>/`, …)
3. **ถาม user ทันที** ถ้าไม่รู้ path, มีหลาย candidate, หรือไม่มี `src/`
4. บันทึก `package_root` ใน audit report
5. **สร้าง file inventory ครบ** — enumerate **ทุกไฟล์** ใน `src/`, `test/`, `scripts/` (ยกเว้น `node_modules`) เป็น checklist ก่อนอ่าน:

```bash
cd <package_root>
find src test scripts -type f \( -name '*.js' -o -name '*.mjs' -o -name '*.ts' \) ! -path '*/node_modules/*' | sort
```

บันทึกจำนวนไฟล์ทั้งหมด → นี่คือ `src/ files total` ที่ DISCOVER ต้องอ่านให้ครบ (read === total)

Human gate **G0** — **ห้ามเริ่ม DISCOVER** จนกว่าจะ (a) ยืนยัน package root และ (b) มี file inventory ครบแล้ว
**ห้ามสรุปพฤติกรรมระบบจาก spec/docs/README เก่า** — ทุกข้อสรุปต้องมาจากการอ่าน code ในไฟล์ที่ inventory ไว้

## Phase 1: CLASSIFY

จำแนก service ก่อนทำงาน — ดู [references/service-tier-classification.md](./references/service-tier-classification.md)

| Tier | แนวทาง |
|------|--------|
| **A — Reference** | staff — อ่านเป็น template; แก้เฉพาะ drift |
| **B — Implemented, thin spec** | audit + upgrade + consolidate |
| **C — Uneven docs** | audit ก่อน — ถาม human ว่าไฟล์ไหนเป็น SoT |
| **D — Scaffold only** | หยุด — ใช้ `spec-driven-development` ก่อน |
| **E — Legacy, no spec** | reverse-engineer ครบชุดจาก code |

**Output:** รายงานสั้น — tier, package path, docs ที่พบ, drift หลัก

## Phase 2: DISCOVER — อ่าน source code ทั้งหมดจริง ๆ

**ห้ามเขียน/ย้าย spec ใน phase นี้** — อ่านและ audit เท่านั้น

### กฎการอ่าน (mandatory)

- **อ่านเต็มไฟล์ทุกไฟล์ใน inventory (Phase 0) — ไม่ใช่ skim, ไม่ใช่เดาจากชื่อไฟล์** ติ๊ก checklist ทีละไฟล์
- ถ้าไฟล์ยาว → อ่านหลายรอบจนครบ; ห้ามข้ามส่วนใด
- ทุกประโยคใน source scan report ต้องอ้างอิง `file:line` ที่อ่านมาจริง
- เห็นอะไร "แปลก/ขัดกับ docs" → บันทึกเป็น drift ทันที ห้ามแก้ให้ตรง docs

### Trust hierarchy

`src/` (ทุก module) → tests → openapi → scripts → **legacy spec/docs เป็นแค่ hint**

ห้ามเชื่อ `*-spec.md` หรือ docs เก่าโดยไม่ยืนยันด้วย code/test (ดู [source-code-discovery.md](./references/source-code-discovery.md))

### อ่านครบ (source scan)

| ลำดับ | อ่านอะไร |
|-------|----------|
| 1 | **`src/**`** — ทุก `.js`: `app.js`, `modules/*/*.route.js`, `*.controller.js`, `*.service.js`, `*.repository.js`, `*.validator.js`, `plugins/`, `lib/`, `config/` |
| 2 | **Tests** — `test/**`, `src/**/*.test.js` |
| 3 | **`openapi.yaml`** — เทียบกับ routes จาก (1) |
| 4 | `codes.yaml`, `error-codes.js`, `scripts/init-db.mjs`, `.env.example` |
| 5 | Legacy `*-spec.md`, `docs/` กระจาย — **บันทึกเป็น untrusted จน verify** |
| 6 | Consumers — grep, `api-mapping.md` |

**Checklist:** `src/` files read === `src/` files total (จาก inventory Phase 0; ส่งใน audit report)

### Behavioral walkthrough — "ระบบเดิมทำงานจริงอย่างไร"

**Deliverable หลักของ phase นี้** นอกจากรายการไฟล์ ต้องมี **trace พฤติกรรมจริง end-to-end** ต่อ endpoint/flow:

```
สำหรับแต่ละ endpoint (จาก *.route.js):
  request → guard/auth → validator → controller → service (business logic + side effects) → repository (query) → DB → response/error
```

บันทึกจาก code จริง (label `OBSERVED` + `file:line`):

- **Guards/permissions** ที่ route ใช้จริง (ไม่ใช่ที่ docs บอก)
- **Validation rules** จริงใน validator/schema
- **Business logic + side effects** จริง (revoke session, publish event, cascade update, ฯลฯ) — สังเกต side effect ที่ docs ไม่ได้บอก
- **Error paths** จริง: เงื่อนไขไหนคืน status/code อะไร (map กับ `codes.yaml`)
- **Persistence** จริง: collection, query, index ที่ใช้
- **สิ่งที่ต่างจาก docs เก่า** → drift row

### Source-to-spec extraction matrix (บังคับ)

อ่าน route ครบยังไม่พอ — drift ส่วนใหญ่อยู่ใน artifact ข้าง route (validator, `mongo-collections.js`, shared package เช่น `@zero-platform/roles`, audit `event_type:`, `.env.example`) ต้อง **extract ค่าจริงแล้ว map เข้า section เป้าหมาย** ทุกตัว — ถ้า section ยังไม่ตรง = drift row ห้ามปล่อยผ่าน (ดูตารางเต็มใน [source-code-discovery.md](./references/source-code-discovery.md) Step 2c)

### Output

1. **Source scan report** — package root, files read/total (ต้องเท่ากัน), modules, routes จาก code, openapi paths
2. **Behavioral walkthrough** — trace ต่อ endpoint/flow ตามด้านบน พร้อม `file:line`
3. **Extraction matrix** — validators / collections / shared roles / audit events / env → section เป้าหมาย + สถานะ `synced` / `DRIFT`
4. **Drift table** — code vs openapi vs legacy spec (default: spec ตาม code)
5. **ยังไม่แก้ไฟล์ spec**

Human gate **G1** — ส่ง audit + behavioral walkthrough + extraction matrix ให้ user เห็น drift ก่อน REVERSE_ENGINEER

## Phase 3: REVERSE_ENGINEER

สร้างหรืออัปเกรด draft ที่ `docs/specs/backend/<service>/`:

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

**กฎ consolidation:**

- ย้าย business/technical/persistence/testing docs มาที่นี่
- คงใน package: `openapi.yaml`, `codes.yaml`, `RUNBOOK.md`, `src/`
- เหลือ redirect ใน `backend/.../docs/README.md`
- แก้ relative links — ดู [references/path-conventions.md](./references/path-conventions.md)

**Frontmatter ระหว่าง draft:**

```yaml
status: reverse-engineered
created: <!-- date -->
updated: <!-- date -->
owner: <!-- TBD from interview -->
last-verified: <!-- date after harden -->
source-scan: <!-- YYYY-MM-DD — src N/N files (from DISCOVER inventory) -->
```

**Evidence labels ในเนื้อหา:**

| Label | ความหมาย |
|-------|----------|
| `OBSERVED` | จาก code/test โดยตรง |
| `DOCUMENTED` | จาก docs เก่าที่ย้ายมา |
| `INFERRED` | agent สรุป — ต้อง `USER_CONFIRMED` ก่อน harden |
| `USER_CONFIRMED` | ผู้ใช้ยืนยันใน domain interview |

**กฎ AC:** ดึงจาก integration tests ที่มี — ห้าม invent จากหัว

Templates: [templates/](./templates/)

## Phase 4: GAP_ANALYSIS

สร้าง confidence map เป็น **ไฟล์จริง** ที่ `docs/specs/backend/<service>/plans/confidence-map.md` (จาก [templates/confidence-map.md](./templates/confidence-map.md)) — **artifact บังคับ**: ไม่มีไฟล์นี้ = ห้ามเข้า HARDEN / ห้าม `status: implemented`

ตาราง confidence **ต้อง** มีแถวจาก extraction matrix (Phase 2) อย่างน้อย: RBAC/role naming, validation/password policy, collections ครบ, audit events, env vars, cross-doc links — ให้คะแนนตาม coverage จริงเทียบ code ไม่ใช่เทียบ docs เก่า

**Harden threshold** (เกณฑ์ขั้นต่ำที่จะ `implemented` ได้ — per section):

| Section | Harden threshold |
|---------|-----------|
| technical-architecture | ≥ 85% |
| endpoint summary | ≥ 85% |
| database-erd | ≥ 80% |
| business-domain | ≥ 85% |
| *-spec orchestrator | ≥ 90% |

**เส้นการถาม user** (generic — ดู [spec-bootstrap-common.md](./references/spec-bootstrap-common.md)):

- Section < harden threshold แต่ ≥ 70% → ถามในรอบ DOMAIN_INTERVIEW ถัดไป
- Section **< 70% → blocking** — ต้องได้ `USER_CONFIRMED` ก่อนไปต่อ

**Output:** confidence map + open questions list

## Phase 5: DOMAIN_INTERVIEW

เติมช่องว่างที่ code บอกไม่ได้ — ใช้รูปแบบจาก `interview-me` (GUESS + EVIDENCE)

**รอบคำถาม:**

1. **Meta** (batch) — owner, purpose, consumers, docs เก่าที่ยังเป็น truth
2. **Drift** (ทีละข้อ) — code vs openapi vs docs เก่า
3. **Business rules** (batch ตาม module) — เฉพาะ `INFERRED`
4. **Boundaries** (batch) — out of scope, tech debt, quarterly audit owner

Question bank: [references/domain-interview-questions.md](./references/domain-interview-questions.md)

หลังแต่ละรอบ: merge คำตอบเข้า spec ทันที + อัปเดต confidence

Human gate **G2** — section ที่ต่ำกว่า threshold ต้องได้ `USER_CONFIRMED` ก่อนออกจาก interview

## Phase 6: MERGE → RESTATE & CONFIRM

สรุปให้ user ยืนยันก่อน harden:

- Outcome, Owner, Consumers
- Drift resolutions
- Out of scope
- Open Questions ที่เหลือ (non-blocking)

Human gate **G3** — ต้องได้ **"ใช่"** ชัดเจน — "แล้วแต่คุณ" / "โอเค" ไม่นับ

## Phase 7: HARDEN

**Pre-harden gate (ทุกข้อต้องผ่านก่อนแตะ frontmatter):**

- [ ] มี `plans/confidence-map.md` และทุก section ≥ threshold (Phase 4)
- [ ] extraction matrix (Phase 2) ทุกแถว = `synced` (ไม่มี `DRIFT` ค้าง)
- [ ] เนื้อหาที่มาจาก legacy doc ถูก relabel เป็น `OBSERVED` (reconcile กับ code แล้ว) หรือ `DOCUMENTED`/`USER_CONFIRMED` — **ห้าม** ปล่อย assertion ไม่มี label
- [ ] cross-service naming (role, password policy, internal API) ตรงกับ golden/consumer spec

จากนั้น:

- `status: reverse-engineered` → `implemented`
- เติม `last-verified`, `updated`, `owner`, `source-scan` (`src N/N files`)
- sync backlinks: `openapi.yaml`, `backend/README.md`, cross-service refs, frontend `api-mapping.md`
- เสริม CI gates ถ้าขาด (`spec:lint`, `spec:codes`, `spec:roles`, **`spec:consistency`** — รวมใน `npm run ci`)
- เปลี่ยน headers "spec only" ถ้า implement แล้ว

## Phase 8: CI → VERIFY

### กฎ: gate ต้อง automate — ห้าม self-report

`spec:lint` / `spec:codes` / `spec:roles` ครอบแค่ **machine-readable** (openapi schema, enum) — **prose ใน markdown, cross-doc consistency, และ broken links ไม่มีใครเช็คให้** ถ้าปล่อยเป็น checklist ให้ agent รันเอง มันจะถูกข้ามภายใต้ความเร่ง (เห็นจริงในรอบ re-audit auth) จึง **ต้องแปลงเป็น script ที่ `npm run ci` รันแล้ว fail ได้จริง**

### บังคับ: สร้าง `spec:consistency` gate

**copy reference impl จาก [templates/validate-spec-consistency.mjs](./templates/validate-spec-consistency.mjs)** ไปที่ `<package_root>/scripts/validate-spec-consistency.mjs` แล้วปรับเฉพาะ `CONFIG` (specDir, openapi, rolesModule, rolesHeadingMatch) ให้ตรง service — **ห้ามเขียน logic ใหม่เอง** (link resolution มัก parse ผิด: ต้อง resolve เทียบ dir ของไฟล์ที่มีลิงก์ ไม่ใช่ spec-root — template ทำถูกแล้ว)

สคริปต์ **ต้อง** fail (exit ≠ 0) เมื่อ:

1. **Broken relative link** ใน `docs/specs/backend/<service>/` — resolve ทุก `](...md|yaml)` เทียบ **`dirname(ไฟล์ที่มีลิงก์)`** (ไม่ใช่ spec-root — ไม่งั้น link ใน subfolder เช่น `plans/README.md` จะ false-positive)
2. **Prose ≠ code** สำหรับค่าคงที่ที่ share — อย่างน้อย:
   - **role list** ใน business-domain prose ↔ `@zero-platform/roles` (`VALID_ROLES`)
   - **password policy `minLength`** เทียบ prose (md + openapi description) + openapi schema (เฉพาะ field policy `>1`; login/current `minLength:1` ตั้งใจต่าง จึงข้าม)
3. **openapi schema ≠ openapi prose** (เช่น `description` บอก "min 16" แต่ `minLength: 8`)

```jsonc
// package.json — เพิ่มใน scripts
"spec:consistency": "node scripts/validate-spec-consistency.mjs",
"ci": "... && npm run spec:lint && npm run spec:codes && npm run spec:roles && npm run spec:consistency && npm test && ..."
```

สคริปต์อ่าน source of truth จาก code (import `@zero-platform/roles`) แล้ว grep ค่าเดียวกันในทุก markdown/openapi — ถ้าไม่ตรงหรือ link พัง → `process.exit(1)` พร้อมรายงาน `file:line`

**พิสูจน์แล้วกับ auth:** template นี้จับ `design-password-management.md:50` (min 16 ขัด 8) + §7.1 roles (ชื่อเก่า) ได้จริง โดย 0 false-positive จาก link

```bash
cd code-base/zero-platform/backend/service/<service>   # หรือ backend/auth, backend/gateway
npm run ci   # รวม spec:consistency แล้ว
```

Checklist (ทุกข้อต้อง**พิสูจน์ด้วยผลรัน** ไม่ใช่ self-attest):

- [ ] `npm run ci` ผ่าน — **รวม `spec:consistency`** (broken links 0, prose ↔ code ↔ openapi ตรง)
- [ ] extraction matrix 0 `DRIFT` — ค่าที่ grep ทุกที่ (role list, password `minLength`, collections, audit events, env, JWT claims) **ตรง code ทุก hit**
- [ ] cross-service: role naming / shared contract ตรง golden (`docs/specs/backend/staff/`)
- [ ] AC map กับ test จริง
- [ ] `WORKFLOW.md` ไม่ duplicate เนื้อหายาวใน `*-spec.md`

**ถ้าแพ็กเกจยังไม่มี `spec:consistency`** (เช่น service ที่ bootstrap ก่อนกฎนี้) — สร้างก่อน แล้วรันให้ผ่าน ถือเป็นส่วนหนึ่งของ HARDEN/re-harden

Human gate **G4** — Human sign-off ก่อนถือว่า `implemented`

## Golden Rules

1. **Source code ชนะ legacy spec** — `src/` + tests เป็น SoT; docs เก่าเป็น hint เท่านั้น
2. **OpenAPI ชนะ business doc** เมื่อ HTTP behavior ขัดกัน — แต่ต้อง sync กับ code จริง; ถ้า openapi ≠ code → บันทึก drift, default ตาม code
3. **อ่าน `src/` ครบทุกไฟล์** ก่อน REVERSE_ENGINEER — ส่ง source scan report
4. **ไม่รู้ package path → ถาม user ก่อน** — ห้ามเดาแล้วอ่านผิด repo
5. **ห้าม rewrite business logic หรือ API** ใน skill นี้ — บันทึก drift ให้ human เลือก
6. **ห้าม `status: implemented`** ถ้า: ไม่มี owner, ไม่มี `plans/confidence-map.md`, มี `INFERRED` ที่ยังไม่ `USER_CONFIRMED`, drift/extraction-matrix ยังไม่ resolve, source scan ไม่ครบ, user ยังไม่ยืนยัน RESTATE
7. **ห้าม commit** โดยไม่ถาม user
8. **Propagate ทุก artifact เข้า section** — validator/collection/shared-role/audit/env/JWT-claims ที่อ่านต้องสะท้อนใน spec section ที่ตรงกัน; อ่านครบ (`read === total`) ไม่การันตี spec ครบ
9. **Cross-service naming ต้องตรง** golden/consumer spec — role, password policy, internal API contract ห้ามมีสองมาตรฐาน
10. **grep-everywhere ไม่ใช่ fixed target** — ค่าคงที่ share (role list, password minLength) ต้อง grep ทุกที่ที่ปรากฏ (รวม `design-*.md`, ADR, prose) แล้ว assert ตรงกันทุก hit
11. **gate ต้อง automate** — consistency/link check ต้องเป็น `spec:consistency` ใน `npm run ci` (fail ได้จริง) ไม่ใช่ checklist ที่ agent รันเอง; CI machine-readable gate ไม่ครอบ prose
12. **Re-audit ต้อง downgrade ก่อน** — spec `implemented` ที่พบ drift ต้องกลับเป็น `reverse-engineered` + วิ่ง gate ครบ ห้าม patch ad-hoc คง implemented

## Package Path Conventions

| Service | Package path |
|---------|--------------|
| staff, agent-invoice, … | `backend/service/<name>/` |
| auth | `backend/auth/` |
| gateway | `backend/gateway/` |

## Interaction with Other Skills

| Skill | เมื่อ |
|-------|------|
| `interview-me` | domain interview — รูปแบบ GUESS + ยืนยัน |
| `spec-driven-development` | ฟีเจอร์ใหม่หลัง bootstrap |
| `planning-and-task-breakdown` | แผนงานหลายขั้นหลัง spec พร้อม |
| `documentation-and-adrs` | ADR สำหรับ drift resolution ที่เป็น architectural |

## Deliverables (ทุกครั้ง)

1. **Source scan report** — package root, src files read/total, routes จาก code
2. **Behavioral walkthrough** — trace ระบบเดิม end-to-end ต่อ endpoint พร้อม `file:line`
3. **Extraction matrix** — validators/collections/shared-roles/audit/env → section + สถานะ synced/DRIFT
4. Audit report + drift table (ก่อนแก้)
5. รายการไฟล์ที่ย้าย/สร้าง/แก้
6. `plans/confidence-map.md` (ไฟล์จริง) + AC traceability (AC จาก tests/code เท่านั้น)
7. ผล `npm run ci` — **รวม `spec:consistency`** (broken links 0 + prose↔code↔openapi ตรง)
8. สิ่งที่ยังไม่ทำ (ถ้า tier C/D)

## References

- [templates/validate-spec-consistency.mjs](./templates/validate-spec-consistency.mjs) — **copy เป็น `spec:consistency` gate** (Phase 8) อย่าเขียนใหม่
- [source-code-discovery.md](./references/source-code-discovery.md) — **อ่านก่อน DISCOVER**

- [spec-bootstrap-common.md](./references/spec-bootstrap-common.md) — phases ร่วม (เผื่อ frontend ทีหลัง)
- [staff-golden-path.md](./references/staff-golden-path.md)
- [path-conventions.md](./references/path-conventions.md)
- [service-tier-classification.md](./references/service-tier-classification.md)
- [domain-interview-questions.md](./references/domain-interview-questions.md)
