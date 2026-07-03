# Domain Interview — Question Bank

Use after GAP_ANALYSIS. Every question includes **GUESS** (from code) and **EVIDENCE** (file:line or test name).

Format (from `interview-me`):

```
Q: <specific question>
GUESS: <hypothesis + why>
EVIDENCE: <path or test>
OPTIONS: A) ... B) ... C) ...  (when applicable)
```

## Round 1 — Meta (batch OK)

| # | Question |
|---|----------|
| M1 | Service นี้มีหน้าที่หลักอะไร (หนึ่งประโยค)? |
| M2 | ใครเป็น **owner** รับผิดชอบ spec (ชื่อ)? |
| M3 | Consumer หลักมีใครบ้าง (นอกจาก grep เจอ)? |
| M4 | มี docs เก่าใน package ที่ยังถือเป็น truth ไหม? ไฟล์ไหน? |
| M5 | Service นี้ production / template / deprecated? |

## Round 2 — Drift (one at a time)

For each drift row from audit:

```
Q: <endpoint/rule> — code ทำ X แต่ <doc/openapi> บอก Y  spec ควรตามอะไร?
GUESS: ตาม openapi เพราะ ...
EVIDENCE: openapi.yaml vs business-domain.md §N
```

Record resolution in `*-spec.md` SoT table footnote or business-domain changelog.

## Round 3 — Business rules (batch by module)

### Lifecycle

- Entity หลักมี state อะไรบ้าง? transition ไหนห้ามข้าม?
- Archive vs delete — policy จริงคืออะไร?
- Side effects (revoke session, notify, etc.) — ตั้งใจหรือ side effect?

### RBAC / permissions

- Permission keys ครบตาม code ไหม? มี role fallback ไหม?
- Exception cases (own profile, admin bypass)?

### Errors

- เมื่อไหร่คืน 503 vs 409 vs 422?
- Retry policy สำหรับ internal calls?

### Data

- Shared DB กับ service อื่น — ใคร owner schema?
- Read-only vs read-write boundaries?

## Round 4 — Boundaries (batch OK)

| # | Question |
|---|----------|
| B1 | อะไร **out of scope** ชัดเจน (ห้าม implement ใน service นี้)? |
| B2 | Known tech debt ที่ spec ควรบันทึก? |
| B3 | ใครรัน quarterly drift audit (`last-verified`)? |
| B4 | AC/test ไหนที่ **ต้องมี** แต่ยังไม่มี? |
| B5 | มี production behavior ที่ยังไม่มีใน code/tests ไหม? |

## Per-file prompts

### `<service>-spec.md`

- Success criteria ระดับ production นอกจาก CI ผ่าน?
- Gateway prefix ถูกต้องไหม?

### `business-domain.md`

- Rule ไหนใน code เป็น workaround ชั่วคราว vs policy จริง?
- เหตุผลทางธุรกิจของ rule สำคัญ (ทำไม archive ไม่ลบ)?

### `database-erd.md`

- Collection/index ไหน INFERRED ต้อง verify?
- Retention / TTL policy?

### `technical-architecture.md`

- Internal API ใครเรียกได้บ้าง?
- Planned deprecation?

## After each round

1. Merge answers into spec files
2. Upgrade labels: `INFERRED` → `USER_CONFIRMED` (+ date)
3. Recompute confidence map
4. If all sections ≥ threshold and blocking questions = 0 → RESTATE & CONFIRM

## Stop condition

Same as `interview-me` 95% test: can you predict user's answer to the next 3 drift/business questions? If not, continue or escalate: "ขาดข้อมูล domain — ต้องการ owner หรือเอกสารเพิ่ม"
