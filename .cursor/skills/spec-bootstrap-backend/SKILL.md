---
name: spec-bootstrap-backend
description: Bootstrap backend service specs from legacy code — reverse-engineer, consolidate, domain interview, harden until spec-driven ready. Invoke with /spec-bootstrap-backend.
disable-model-invocation: true
---

# /spec-bootstrap-backend — Bootstrap backend spec from code

อ่านและปฏิบัติตาม **`backend-service-spec-bootstrap`** (`.cursor/skills/backend-service-spec-bootstrap/SKILL.md`) อย่างครบถ้วน รวม references และ templates ในโฟลเดอร์เดียวกัน

## ขั้นตอน (Steps)

Pipeline เต็ม (ห้ามข้าม phase — ดู `SKILL.md` ของ `backend-service-spec-bootstrap`):

```
LOCATE → CLASSIFY → DISCOVER → REVERSE_ENGINEER → GAP_ANALYSIS
    → DOMAIN_INTERVIEW → MERGE → RESTATE & CONFIRM → HARDEN → CI → VERIFY
```

0. **LOCATE** — ยืนยัน service name + **package root** + สร้าง **file inventory ครบ** (`find src test scripts`); **ถาม user** ถ้าไม่รู้ path หรือมีหลาย candidate — ดู `references/source-code-discovery.md`
1. **CLASSIFY** tier — ดู `references/service-tier-classification.md`
2. **DISCOVER** — **อ่าน `src/` ครบทุกไฟล์เต็ม ๆ (ไม่ skim)** + tests + openapi; ส่ง **source scan report** + **behavioral walkthrough** (trace ว่าระบบเดิมทำงานจริงอย่างไร end-to-end พร้อม `file:line`) + drift table; **ห้ามเชื่อ spec เก่า** โดยไม่ verify ด้วย code
3. **REVERSE_ENGINEER** — สร้าง/ย้าย docs ไป `code-base/zero-platform/docs/specs/backend/<service>/` (หลัง G1)
4. **GAP_ANALYSIS** — confidence map จาก `templates/confidence-map.md`
5. **DOMAIN_INTERVIEW** — ถาม user เติมช่องว่าง (`references/domain-interview-questions.md`); ใช้รูปแบบ GUESS + EVIDENCE จาก `interview-me`
6. **MERGE** — รวมคำตอบเข้า spec ทันทีหลังแต่ละรอบ + อัปเดต confidence + upgrade labels `INFERRED` → `USER_CONFIRMED`
7. **RESTATE & CONFIRM** — รอ user ยืนยัน "ใช่" ก่อน harden
8. **HARDEN** — `status: implemented`, sync backlinks, CI gates
9. **CI** — `npm run ci` ใน package path
10. **VERIFY** — deliverables checklist + no broken links + human sign-off

## Golden reference

`code-base/zero-platform/docs/specs/backend/staff/` — ดู `references/staff-golden-path.md`

## ห้าม

- เขียน spec จาก `*-spec.md` เก่าโดยไม่อ่าน `src/` ครบ
- ตั้ง `status: implemented` ก่อน domain interview + user confirm
- แก้ business logic / API behavior โดยไม่ได้รับมอบหมาย
- ใช้ skill นี้สำหรับฟีเจอร์ใหม่ — ใช้ `/spec` (`spec-driven-development`) แทน

## มาตรฐานการเขียนโค้ดที่เกี่ยวข้อง

เมื่อแตะ runtime artifacts ใน package ปฏิบัติตาม coding-standard ตาม domain:

**Backend service:**

- `coding-standard/backend/1-tech-stack.md`
- `coding-standard/backend/2-folder-structure.md`
- `coding-standard/backend/3-api-routing.md`
- `coding-standard/backend/6-api-response-codes.md`
- `coding-standard/backend/12-data-management.md`

**Auth:**

- `coding-standard/auth/1-tech-stack.md` … (ชุดเดียวกัน)

**Gateway:**

- `coding-standard/gateway/1-tech-stack.md` … (ชุดเดียวกัน)
