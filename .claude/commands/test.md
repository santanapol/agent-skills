---
name: test
description: รัน TDD workflow — เขียน Test ที่ไม่ผ่าน, นำไป Implement, และตรวจสอบความถูกต้อง สำหรับ Bugs ให้ใช้รูปแบบ Prove-It เรียกใช้ด้วย /test
---

# /test — พิสูจน์ว่ามันใช้งานได้จริง (Prove it works)

อ่านและปฏิบัติตาม **`test-driven-development`** (`.claude/skills/test-driven-development/SKILL.md`) อย่างครบถ้วน

## ฟีเจอร์ใหม่ (New features)

1. เขียน Tests เพื่ออธิบายพฤติกรรมที่คาดหวัง (โดยมันควรจะ FAIL)
2. เขียน Code เพื่อทำให้ Tests เหล่านั้นผ่าน (Pass)
3. ปรับปรุงโค้ด (Refactor) โดยที่ยังต้องรักษาให้ Tests เป็นสีเขียว (Green/Pass)

## การแก้ไขบั๊ก (Bug fixes - Prove-It)

1. เขียน Test เพื่อจำลอง Bug ที่เกิดขึ้น (ต้อง FAIL)
2. ยืนยันว่า Test นั้นไม่ผ่าน (Fails)
3. เขียน Code เพื่อแก้ไขปัญหา (Fix)
4. ยืนยันว่า Test นั้นผ่าน (Passes)
5. รัน Test suite ทั้งหมดเพื่อตรวจสอบ Regressions

สำหรับปัญหาที่เกี่ยวข้องกับ Browser ให้เรียกใช้ **`browser-testing-with-devtools`** ร่วมด้วย หากมีการตั้งค่า Chrome DevTools MCP ไว้


## มาตรฐานการเขียนโค้ดที่เกี่ยวข้อง (Related Coding Standards)
เมื่อดำเนินการด้วย Skill หรือ Role นี้ ต้องปฏิบัติตามมาตรฐานต่อไปนี้อย่างเคร่งครัด:
- `coding-standard/backend/8-openapi-validation.md`
- `coding-standard/backend/6-api-response-codes.md`
- `coding-standard/backend/3-api-routing.md`
- `coding-standard/backend/12-data-management.md`
- `coding-standard/backend/4-request-headers.md`
