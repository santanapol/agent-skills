---
name: review
description: ดำเนินการ Code review ใน 5 แกนหลัก — ความถูกต้อง (Correctness), ความสามารถในการอ่าน (Readability), สถาปัตยกรรม (Architecture), ความปลอดภัย (Security), และประสิทธิภาพ (Performance) เรียกใช้ด้วย /review ก่อนที่จะ Merge
disable-model-invocation: true
---

# /review — การตรวจสอบโค้ด (Code review)

อ่านและปฏิบัติตาม **`code-review-and-quality`** (`.cursor/skills/code-review-and-quality/SKILL.md`) อย่างครบถ้วน

ทำการ Review การเปลี่ยนแปลงปัจจุบัน (Staged หรือ Recent commits) ผ่านทั้ง 5 แกนหลัก:

1. **ความถูกต้อง (Correctness)** — ตรงตาม Spec ไหม? ครอบคลุม Edge cases ไหม? Tests เพียงพอหรือเปล่า?
2. **ความสามารถในการอ่าน (Readability)** — ตั้งชื่อได้ชัดเจนไหม? Logic ตรงไปตรงมาหรือเปล่า? จัดระเบียบได้ดีไหม?
3. **สถาปัตยกรรม (Architecture)** — ตรงตาม Patterns ที่มีอยู่หรือเปล่า? ขอบเขต (Boundaries) ชัดเจนไหม? ใช้ Abstraction ที่ถูกต้องไหม?
4. **ความปลอดภัย (Security)** — ใช้ **`security-and-hardening`** สำหรับ Input, Secrets, และ Auth
5. **ประสิทธิภาพ (Performance)** — ใช้ **`performance-optimization`** สำหรับ Bottlenecks

จัดหมวดหมู่สิ่งที่ค้นพบเป็น Critical, Important, หรือ Suggestion แสดงผลลัพธ์การ Review แบบมีโครงสร้าง (Structured review) พร้อมระบุตำแหน่งเป็น `file:line` และคำแนะนำในการแก้ไข (Fix recommendations)


## มาตรฐานการเขียนโค้ดที่เกี่ยวข้อง (Related Coding Standards)
เมื่อดำเนินการด้วย Skill หรือ Role นี้ ต้องปฏิบัติตามมาตรฐานต่อไปนี้อย่างเคร่งครัด:
- `coding-standard/backend/13-code-quality.md`
- `coding-standard/backend/2-folder-structure.md`
- `coding-standard/backend/3-api-routing.md`
- `coding-standard/backend/6-api-response-codes.md`
- `coding-standard/backend/12-data-management.md`
