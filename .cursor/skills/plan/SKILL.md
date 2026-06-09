---
name: plan
description: แบ่งงานออกเป็น Task เล็กๆ ที่สามารถตรวจสอบได้ พร้อมกับ Acceptance criteria และการจัดลำดับ Dependency ใช้เมื่อมี Spec และต้องการ Implementation plan เรียกใช้ด้วย /plan
disable-model-invocation: true
---

# /plan — การแบ่งย่อย Task (Task breakdown)

อ่านและปฏิบัติตาม **`planning-and-task-breakdown`** (`.cursor/skills/planning-and-task-breakdown/SKILL.md`) อย่างครบถ้วน

## ขั้นตอน (Steps)

1. อ่าน Spec ที่มีอยู่ (`SPEC.md` หรือสิ่งที่เทียบเท่ากัน) และส่วนของ Codebase ที่เกี่ยวข้อง
2. เข้าสู่ Plan mode — ให้อ่านอย่างเดียว (Read only) ห้ามแก้ไข Code จนกว่า Plan จะได้รับการอนุมัติ
3. ระบุ Dependency graph ระหว่าง Components ต่างๆ
4. แบ่งการทำงานในแนวตั้ง หรือ Vertical slice (หนึ่งเส้นทางแบบสมบูรณ์ต่อหนึ่ง Task, ไม่แบ่งตามแนวนอน)
5. เขียน Tasks โดยระบุ Acceptance criteria และขั้นตอนการ Verification
6. เพิ่ม Checkpoints ระหว่าง Phases ต่างๆ
7. นำเสนอ Plan เพื่อให้คน (Human) ตรวจสอบและรีวิว

บันทึก Plan ลงในไฟล์ `_mission-control/tasks/plan.md` และรายการ Task ลงในไฟล์ `_mission-control/tasks/todo.md`

## มาตรฐานการเขียนโค้ดที่เกี่ยวข้อง (Related Coding Standards)

เมื่อดำเนินการด้วย Skill หรือ Role นี้ ต้องปฏิบัติตามมาตรฐานตาม Domain ที่ทำงานอยู่อย่างเคร่งครัด:

**Backend:**
- `coding-standard/backend/1-tech-stack.md`
- `coding-standard/backend/2-folder-structure.md`
- `coding-standard/backend/3-api-routing.md`
- `coding-standard/backend/6-api-response-codes.md`
- `coding-standard/backend/12-data-management.md`

**Auth:**
- `coding-standard/auth/1-tech-stack.md`
- `coding-standard/auth/2-folder-structure.md`
- `coding-standard/auth/3-api-routing.md`
- `coding-standard/auth/6-api-response-codes.md`
- `coding-standard/auth/12-data-management.md`

**Frontend (Backoffice):**
- `coding-standard/frontend/backoffice/1-tech-stack.md`
- `coding-standard/frontend/backoffice/2-folder-structure.md`
- `coding-standard/frontend/backoffice/3-routing-and-pages.md`
- `coding-standard/frontend/backoffice/4-state-management.md`
- `coding-standard/frontend/backoffice/5-api-integration.md`

**Gateway:**
- `coding-standard/gateway/1-tech-stack.md`
- `coding-standard/gateway/2-folder-structure.md`
- `coding-standard/gateway/3-api-routing.md`
- `coding-standard/gateway/6-api-response-codes.md`
