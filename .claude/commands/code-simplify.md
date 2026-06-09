---
name: code-simplify
description: ลดความซับซ้อนของ Code เพื่อความชัดเจนและดูแลรักษาง่าย — ลดความซับซ้อนโดยไม่เปลี่ยนพฤติกรรมการทำงาน เรียกใช้ด้วย /code-simplify
---

# /code-simplify — เน้นความชัดเจนมากกว่าความซับซ้อน (Clarity over cleverness)

อ่านและปฏิบัติตาม **`code-simplification`** (`.claude/skills/code-simplification/SKILL.md`) อย่างครบถ้วน

ลดความซับซ้อนของ Code ที่เพิ่งมีการเปลี่ยนแปลง (หรือตามขอบเขตที่ระบุ) โดยที่ต้องคงพฤติกรรมการทำงานให้เหมือนเดิมเป๊ะ:

1. อ่านข้อตกลงของโปรเจกต์ (Project conventions เช่น `.claude/rules/`, Coding standards)
2. ระบุเป้าหมายของ Code — โดยปกติคือ Code ที่เพิ่งถูกเปลี่ยนแปลง ยกเว้นว่าจะมีการระบุขอบเขตที่กว้างกว่านั้น
3. ทำความเข้าใจจุดประสงค์, Callers, Edge cases, และ Test coverage ก่อนทำการแก้ไข
4. สแกนหา: การซ้อนทับที่ลึกเกินไป (Deep nesting), ฟังก์ชันที่ยาวเกินไป, Nested ternaries, การตั้งชื่อที่ไม่ชัดเจน, Code ที่ซ้ำซ้อน, และ Dead code
5. นำการลดความซับซ้อนไปใช้แบบทีละขั้นตอน — รัน Tests หลังจากทำการเปลี่ยนแปลงแต่ละครั้ง
6. ตรวจสอบว่า Tests ทั้งหมดผ่าน, การ Build สำเร็จ, และ Diff มีความสะอาดตา (Clean)

หาก Tests ไม่ผ่านหลังจากการลดความซับซ้อน ให้ Revert การเปลี่ยนแปลงนั้น และสามารถเลือกรัน **`code-review-and-quality`** กับผลลัพธ์นั้นได้


## มาตรฐานการเขียนโค้ดที่เกี่ยวข้อง (Related Coding Standards)

เมื่อดำเนินการด้วย Skill หรือ Role นี้ ต้องปฏิบัติตามมาตรฐานตาม Domain ที่ทำงานอยู่อย่างเคร่งครัด:

**Backend:**
- `coding-standard/backend/13-code-quality.md`
- `coding-standard/backend/2-folder-structure.md`

**Auth:**
- `coding-standard/auth/13-code-quality.md`
- `coding-standard/auth/2-folder-structure.md`

**Frontend (Backoffice):**
- `coding-standard/frontend/backoffice/10-code-quality.md`
- `coding-standard/frontend/backoffice/2-folder-structure.md`

**Gateway:**
- `coding-standard/gateway/11-code-quality.md`
- `coding-standard/gateway/2-folder-structure.md`
