# Confidence Map — {{service}}

Generated after GAP_ANALYSIS (post full source scan). Update after each DOMAIN_INTERVIEW round.

## Source scan (prerequisite)

| Check | Value |
|-------|-------|
| Package root | `...` (user confirmed: yes/no) |
| `src/` files total | N |
| `src/` files read | N (must equal total) |
| Modules discovered | auth, internal, ... |
| Routes from code | [list from *.route.js] |
| OpenAPI paths | [list] |
| Legacy spec trusted | **no** until row verified |

## Section confidence
| Section | Confidence | Source | Labels | Ask user? |
|---------|------------|--------|--------|-----------|
| `<service>-spec` Objective | % | src/modules, README | OBSERVED | |
| Consumers | % | grep, api-mapping, src callers | OBSERVED | |
| technical-architecture | % | app.js, plugins, modules | OBSERVED | |
| endpoint summary | % | *.route.js + openapi.yaml | OBSERVED | |
| permissions / RBAC | % | route guards | INFERRED? | |
| business-domain lifecycle | % | tests, code | | |
| business-domain rules | % | validation | INFERRED? | |
| database-erd | % | init-db, schemas | INFERRED? | |
| AC table | % | integration tests | OBSERVED | |
| out-of-scope | % | — | UNKNOWN | **yes** |
| owner | % | — | | **yes** |

## Extraction coverage (จาก DISCOVER Step 2c — บังคับ ต้อง synced ก่อน harden)

ให้คะแนน coverage โดยเทียบ **code จริง** ไม่ใช่ docs เก่า — ทุกแถวต้อง `synced` (ถ้า `DRIFT` = blocking จนกว่าจะ resolve)

**grep-driven:** คอลัมน์ "ปรากฏที่ไหนบ้าง" = grep ค่านั้นทั่ว `backend/<service>/` **และ** `docs/specs/backend/<service>/` แล้ว list ทุก hit — `synced` ต่อเมื่อค่าตรงกัน **ทุก hit** (รวม prose ใน markdown, ไม่ใช่แค่ openapi/enum ที่ CI เช็ค)

| Artifact | Extracted from code | ปรากฏที่ไหนบ้าง (grep — ต้องตรงทุก hit) | สถานะ |
|----------|--------------------|----------------|-------|
| Role naming / permission keys | `@zero-platform/roles` / shared / route guards | business-domain RBAC **prose** + openapi enum + golden staff | synced / DRIFT |
| Validation + password policy | `*.validator.js` (minLength/pattern/enum) | business-domain + technical §API + openapi **schema+prose** + **design-*.md ทุกไฟล์** | synced / DRIFT |
| **JWT claims (ทุก claim)** | `signAccessJwt()` / `lib/jwt-*.js` | JWT contract section + ADR | synced / DRIFT |
| Collections + indexes (ครบ) | `mongo-collections.js`, `init-db.mjs`, repos | database-erd (superset — ทุก collection มี schema/index) | synced / DRIFT |
| Audit events (ทุกตัว) | grep `event_type:` ใน `*.service.js` | business-domain audit table | synced / DRIFT |
| Env vars (+required/default) | `.env.example`, `config/env.js` | technical §Configuration | synced / DRIFT |
| Error codes ↔ status ↔ type | `codes.yaml` ↔ `problem*.js` ↔ openapi | error section + openapi examples | synced / DRIFT |
| Cross-service naming | golden `docs/specs/backend/staff/` | ทุก section ที่ share contract | synced / DRIFT |

## Pre-harden gate

- [ ] ทุก Section confidence ≥ threshold
- [ ] Extraction coverage 0 `DRIFT` (grep ทุก hit ตรง code)
- [ ] `npm run ci` ผ่าน — รวม **`spec:consistency`** (broken links 0 + prose↔code↔openapi ตรง; automate ไม่ใช่ self-report)

## Thresholds

| Section | Minimum for harden |
|---------|-------------------|
| technical-architecture | 85% |
| endpoint summary | 85% |
| database-erd | 80% |
| business-domain | 85% |
| orchestrator overall | 90% |

## Blocking open questions

| ID | Question | Round | Status |
|----|----------|-------|--------|
| Q1 | | Meta / Drift / Business / Boundaries | open / resolved |

## Drift register

| Item | Code | OpenAPI | Legacy doc | Resolution |
|------|------|---------|------------|------------|
| | | | | pending / spec follows X |

## Interview progress

- [ ] Round 1 Meta
- [ ] Round 2 Drift (all rows resolved)
- [ ] Round 3 Business rules
- [ ] Round 4 Boundaries
- [ ] RESTATE confirmed by user
