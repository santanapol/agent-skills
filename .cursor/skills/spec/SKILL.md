---
name: spec
description: เริ่มต้นการพัฒนาแบบใช้ Spec เป็นตัวนำ (Spec-driven development) — เขียนโครงสร้าง Specification ก่อนเริ่มเขียน Code ใช้เมื่อต้องการกำหนด Feature ใหม่, โปรเจกต์, หรือการเปลี่ยนแปลงที่สำคัญ เรียกใช้ด้วย /spec
disable-model-invocation: true
---

# /spec — กำหนดรายละเอียดก่อนเริ่มสร้าง (Define before build)

อ่านและปฏิบัติตาม **`spec-driven-development`** (`skills/spec-driven-development/SKILL.md`) อย่างครบถ้วน

## ขั้นตอน (Steps)

1. ทำความเข้าใจว่าผู้ใช้ต้องการสร้างอะไร ถามคำถามเพื่อความชัดเจนเกี่ยวกับ:
   - วัตถุประสงค์และกลุ่มผู้ใช้เป้าหมาย (Objective and target users)
   - ฟีเจอร์หลัก (Core features) และ Acceptance criteria
   - ความต้องการและข้อจำกัดของ Tech stack
   - ขอบเขต (สิ่งที่จะทำเสมอ, สิ่งที่ต้องถามก่อนทำ, สิ่งที่จะไม่ทำเด็ดขาด) (Boundaries)
2. สร้าง Spec ที่มีโครงสร้างชัดเจนครอบคลุมถึง: วัตถุประสงค์ (Objective), คำสั่ง (Commands), โครงสร้างโปรเจกต์ (Project structure), สไตล์ของ Code (Code style), กลยุทธ์การทดสอบ (Testing strategy), และขอบเขต (Boundaries)
3. บันทึก Spec เป็นไฟล์ `SPEC.md` ในโฟลเดอร์ `_mission-control/` ของโปรเจกต์ และยืนยันกับผู้ใช้ก่อนดำเนินการต่อ

ห้ามเขียน Code การทำงาน (Implementation) จนกว่า Spec จะได้รับการอนุมัติ


## มาตรฐานการเขียนโค้ดที่เกี่ยวข้อง (Related Coding Standards)
เมื่อดำเนินการด้วย Skill หรือ Role นี้ ต้องปฏิบัติตามมาตรฐานต่อไปนี้อย่างเคร่งครัด:
- `coding-standard/backend/1-tech-stack.md`
- `coding-standard/backend/2-folder-structure.md`
- `coding-standard/backend/12-data-management.md`
- `coding-standard/backend/3-api-routing.md`
- `coding-standard/backend/6-api-response-codes.md`
