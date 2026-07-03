# Source Code Discovery — read before spec

Bootstrap ต้องยึด **source code เป็นความจริงหลัก** — spec/docs เก่าอาจผิดหรือไม่มีเลย ห้ามคัดลอก spec เดิมโดยไม่อ่าน code

## Trust hierarchy (สูง → ต่ำ)

| Rank | Source | ใช้เมื่อ |
|------|--------|---------|
| 1 | **`src/`** (routes, controllers, services, repos, validators) | พฤติกรรมจริง, business rules ที่ encode แล้ว |
| 2 | **Tests** (`test/`, `**/*.test.js`) | พฤติกริจที่ยืนยันได้, AC candidates |
| 3 | **`openapi.yaml`** | HTTP contract — ต้อง **สอดคล้องกับ (1)**; ถ้าไม่ตรง บันทึก drift |
| 4 | **Scripts** (`init-db.mjs`, seed, validators) | schema, indexes |
| 5 | **`codes.yaml` / `error-codes.js`** | error model |
| 6 | **Legacy docs + `*-spec.md`** | แค่ hint — **ไม่ใช่ SoT** จนกว่าจะยืนยันด้วย (1)–(3) |
| 7 | **User interview** | เติม intent ที่ code ไม่บอก |

**กฎ:** ห้ามตั้ง `DOCUMENTED` จาก legacy spec โดยไม่มี `OBSERVED` จาก code/test รองรับ — หรือ `USER_CONFIRMED`

---

## Step 0 — หา package path (ถาม user ถ้าไม่แน่ใจ)

ก่อน DISCOVER ต้องรู้ **package root** ที่จะอ่าน `src/`

### ถาม user ทันทีเมื่อ

- ไม่รู้ว่า service อยู่ repo ไหน / path ไหน
- ชื่อ service คลุมเครือ (เช่น "report" มีหลายตัว)
- ไม่มี `src/` ที่ path ที่คาด
- โค้ดกระจายหลาย package (microservice แยก repo)

### คำถามตัวอย่าง

```
Q: package root ของ <service> คือ path ไหน?
GUESS: backend/auth/ (zero-platform convention)
OPTIONS: A) backend/auth/  B) backend/service/<name>/  C) อื่น (ระบุ path)
```

### Default paths (zero-platform)

| Service | Package root |
|---------|--------------|
| auth | `code-base/zero-platform/backend/auth/` |
| gateway | `code-base/zero-platform/backend/gateway/` |
| staff, agent-invoice, … | `code-base/zero-platform/backend/service/<name>/` |

**Output:** บันทึก `package_root` ใน audit report ก่อนอ่านไฟล์

---

## Step 1 — Source inventory (อ่านครบก่อนเขียน spec)

สแกน `package_root` แล้วบันทึกรายการไฟล์ที่อ่านแล้ว — **ห้ามข้าม `src/`**

### 1.1 Entry & wiring

| Path pattern | หาอะไร |
|--------------|--------|
| `src/server.js` | listen, port |
| `src/app.js` | plugins, module registration, hooks |
| `src/config/**` | env, collections, DB names |

### 1.2 Modules (อ่านทุก module)

สำหรับแต่ละ `src/modules/<name>/`:

| File | หาอะไร |
|------|--------|
| `*.route.js` | HTTP paths, methods, guards |
| `*.controller.js` | request/response flow |
| `*.service.js` | business logic, side effects |
| `*.repository.js` | persistence, queries |
| `*.validator.js` / `*.schema.js` | validation rules |
| `src/plugins/**` | cross-cutting (auth, mongo, redis, metrics) |
| `src/lib/**` | shared utilities (JWT, problem, permissions) |

**กฎ:** เปิดอ่าน **ทุกไฟล์ `.js`/`.mjs` ใน `src/`** ที่ไม่ใช่ `node_modules` — **อ่านเต็มไฟล์ทุกไฟล์ ไม่ใช่ skim และห้ามเดาพฤติกรรมจากชื่อไฟล์** อ่าน route/service/validator/controller ให้ละเอียดเป็นพิเศษ เพราะเป็นที่อยู่ของ business rule จริง

### 1.3 Tests

| Path | หาอะไร |
|------|--------|
| `test/**/*.test.js` | behaviors, AC, edge cases |
| `src/**/*.test.js` | co-located unit tests |

รัน `find <package_root>/src <package_root>/test -name '*.js' ! -path '*/node_modules/*'` แล้วติ๊กว่าอ่านครบ

### 1.4 Contracts & ops

| Path | หาอะไร |
|------|--------|
| `openapi.yaml` | compare กับ routes จริง |
| `package.json` | scripts, CI gates |
| `scripts/init-db.mjs` | indexes, collections |
| `.env.example` | env vars |
| `RUNBOOK.md` | ops (ถ้ามี) |

### 1.5 Cross-repo consumers

- `grep -r "<service>"` ใน monorepo
- `frontend/.../api-mapping.md`

---

## Step 2 — Source scan checklist (ส่งใน audit report)

```markdown
## Source scan — <service>

- Package root: `...` (confirmed: convention / user)
- src/ files total: N — read: N (must be equal)
- Modules: auth, internal, admin, ...
- Routes registered (from code): [list]
- OpenAPI paths: [list]
- Drift (code vs openapi vs legacy spec): [table]
- Legacy spec trusted: NO until verified row-by-row
```

**ห้ามเข้า REVERSE_ENGINEER** ถ้า `read < total` โดยไม่มีเหตุผล (เช่น generated vendor code — ไม่มีใน backend services)

---

## Step 2b — Behavioral walkthrough (บังคับ)

เป้าหมายของ bootstrap = จับ **"ระบบเดิมทำงานจริงอย่างไร"** จาก code ไม่ใช่จาก docs ต่อแต่ละ endpoint/flow ให้ trace end-to-end แล้วบันทึกพร้อม `file:line`:

```markdown
### <METHOD> <path>  (module: <name>)

- Guard/auth:   <ที่ route ใช้จริง>            — src/modules/<m>/<m>.route.js:LL
- Validation:   <rule จริง>                    — <m>.validator.js:LL
- Flow:         request → controller → service → repository → DB
- Business:     <logic + branch จริง>          — <m>.service.js:LL
- Side effects: <revoke/notify/cascade/publish> — <m>.service.js:LL
- Errors:       <cond → status/code>           — <m>.service.js:LL ↔ codes.yaml
- Persistence:  <collection/query/index>        — <m>.repository.js:LL
- Response:     <shape จริง>                    — <m>.controller.js:LL
- Diff vs docs: <ต่างจาก legacy doc ตรงไหน → drift row>
```

**กฎ:** ทุกบรรทัดต้องมาจาก code ที่อ่านจริง — side effect / error branch ที่ docs ไม่ได้บอกคือสิ่งที่ walkthrough นี้ต้องเปิดโปงให้เจอ

---

## Step 2c — Source-to-spec extraction matrix (บังคับ, grep-driven)

Behavioral walkthrough จับพฤติกรรม **ต่อ endpoint** แต่ drift จำนวนมากอยู่ใน **artifact ข้าง ๆ ที่ไม่ใช่ route** (validator, config, shared package, audit call, env, JWT claims) — ถ้าอ่านแล้วไม่ **propagate เข้า section ที่ตรงกัน** spec จะยังค้าง legacy ทั้งที่ `files read === total`

### กฎเหล็ก: grep-everywhere ไม่ใช่ fixed target list

Target section ด้านล่างเป็น **ขั้นต่ำ** — ตารางนี้ **ไม่ใช่** รายการปลายทางแบบตายตัว เพราะค่าคงที่หนึ่งค่า (เช่น password `minLength`, role list) มักปรากฏใน **หลายไฟล์** รวม docs ที่ไม่ได้ลิสต์ (เช่น `design-*.md`, ADR) การ sync แค่ target ที่ลิสต์ไว้แล้วปล่อยที่อื่น = drift เงียบ

**สำหรับค่าคงที่ทุกตัวที่ extract:**

1. **grep ค่านั้นทั่วทั้ง repo** — ทั้ง `backend/<service>/` และ `docs/specs/backend/<service>/` (รวม design docs, ADR, business-domain, technical, openapi prose **และ** schema)

```bash
# ตัวอย่าง: password minLength ปรากฏกี่ที่ (ต้องเท่ากันทุกที่)
rg -n "min(Length)?|min \*?\*?(8|16)" backend/<service>/src backend/<service>/openapi.yaml docs/specs/backend/<service>/
# ตัวอย่าง: role list
rg -n "platform_admin|Owner|Manager|VALID_ROLES" backend/<service>/ docs/specs/backend/<service>/
```

2. **assert ว่าค่าตรงกันทุก hit** — ถ้าต่างแม้แต่ที่เดียว (เช่น prose บอก 16, schema บอก 8) = `DRIFT`
3. **ครอบทั้ง machine-readable และ prose** — CI gate (`spec:lint`/`spec:codes`/`spec:roles`) ครอบแค่ openapi/enum; **prose ใน markdown ไม่มีใครเช็คให้** ต้อง grep เอง

### Artifact classes (ขั้นต่ำ — extract ทุก class)

| Source artifact (code) | ต้อง extract | Target section (grep เพิ่มทุกที่ที่ปรากฏ) |
|------------------------|--------------|---------------------|
| ทุก `*.validator.js` / `*.schema.js` | field, `minLength`/`maxLength`, `pattern`, `enum`, required | business-domain field rules + technical §API + openapi **schema และ prose** + **design-*.md ทุกไฟล์** |
| `config/*collections*.js` + `scripts/init-db.mjs` + `*.repository.js` | **ทุก** collection + index ที่ code แตะจริง | database-erd — collection list ต้อง **superset ของ code** (ครบทุก collection มี schema/index ไม่ใช่แค่ footnote) |
| shared imports (`@zero-platform/roles`, `shared/*`) | ค่า enum/const จริง (role list, permission keys) | business-domain RBAC **prose table** — **ห้าม** ใช้ role naming จาก docs เก่า; enum ผ่าน CI ไม่ได้แปลว่า prose ตรง |
| **JWT sign payload** — `signAccessJwt()` / `lib/jwt-*.js` | **ทุก claim** ที่ยิงจริง (`sub`, role, `ou_id`, `branch_id`, `home_branch_id`, `token_gen`, `permissions`, …) | JWT contract section + ADR — claim list ต้องครบตาม code |
| `grep "event_type:"` ใน `*.service.js` | รายการ audit event ที่ยิงจริงทุกตัว | business-domain audit table |
| `.env.example` + `loadEnv()` ใน `config/env.js` | ทุก env var + required/default + production guard | technical §Configuration env table |
| `codes.yaml` / `error-codes.js` ↔ `problem*.js` | code ↔ HTTP status ↔ `type` URI | error section + openapi Problem examples |

**Output:** ตาราง extraction matrix ใน audit report — คอลัมน์สุดท้าย = `synced` / `DRIFT → <ทุก file:line ที่ค่าไม่ตรง>`; ทุกแถวที่ `DRIFT` เข้าคิว DOMAIN_INTERVIEW หรือแก้ตาม code default

**Cross-service consistency:** ถ้า service นี้ share contract กับ golden reference (`docs/specs/backend/staff/`) — เช่น role naming, password policy, internal API shape — ต้อง grep spec ของ consumer/golden แล้วยืนยันว่า **naming ตรงกัน**; ถ้าต่างคือ drift ที่ต้อง resolve ไม่ใช่ปล่อยสองมาตรฐาน

---

## Step 3 — Drift resolution default

เมื่อ code ≠ openapi ≠ legacy spec:

1. **Default:** spec ตาม **code** (`OBSERVED`)
2. บันทึก drift ใน audit
3. ถาม user ใน DOMAIN_INTERVIEW Round 2 ถ้า business intent อาจต่างจาก code (legacy design ยัง valid?)

---

## Anti-patterns (ห้าม)

- คัดลอก `*-spec.md` draft แล้วแค่จัดรูปแบบ
- อ่านแค่ openapi ไม่อ่าน `src/modules/**`
- เชื่อ `business-domain.md` เก่าโดยไม่เทียบ route handlers
- สร้าง AC ที่ไม่มี test และไม่มี code path รองรับ
- เดา package path แล้วอ่านผิด repo
- อ่าน route ครบแต่ไม่ propagate validator/collection/shared-role/audit/env เข้า section ที่ตรงกัน (drift เงียบทั้งที่ `read === total`)
- ย้าย legacy doc มา central folder แล้วปล่อยเนื้อหาไว้โดยไม่ relabel/ไม่ reconcile กับ code (เช่น role naming, password min length)
