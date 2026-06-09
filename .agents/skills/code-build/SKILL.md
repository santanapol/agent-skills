---
name: code-build
description: ดำเนินการ Task ถัดไปแบบทีละขั้นตอน — build, test, ตรวจสอบ, และ commit ใช้เมื่อเริ่มทำงานตามแผน เรียกใช้ด้วย /code-build
disable-model-invocation: true
---

# /code-build — การทำงานแบบทีละขั้นตอน (Incremental implementation)

อ่านและปฏิบัติตาม **`incremental-implementation`** และ **`test-driven-development`** อย่างครบถ้วน

เลือก Task ถัดไปที่ค้างอยู่จากแผนงาน สำหรับแต่ละ Task ให้ทำดังนี้:

1. อ่านเกณฑ์การยอมรับ (Acceptance Criteria) ของ Task
2. โหลด Context ที่เกี่ยวข้อง (Code ที่มีอยู่, Patterns, Types)
3. เขียน Test ที่ยังไม่ผ่านสำหรับพฤติกรรมที่คาดหวัง (RED)
4. เขียน Code ที่น้อยที่สุดเพื่อให้ผ่าน Test นั้น (GREEN)
5. รัน Test Suite ทั้งหมดเพื่อตรวจสอบหา Regressions
6. รันการ Build เพื่อตรวจสอบ Compilation
7. Commit พร้อมกับเขียนข้อความอธิบายที่ชัดเจน
8. ทำเครื่องหมายว่า Task นี้เสร็จสิ้น แล้วย้ายไปยัง Task ถัดไป

หากมีขั้นตอนใดเกิดข้อผิดพลาด ให้ปฏิบัติตาม **`debugging-and-error-recovery`**

## มาตรฐานการเขียนโค้ดที่เกี่ยวข้อง (Related Coding Standards)

เมื่อดำเนินการด้วย Skill หรือ Role นี้ ต้องปฏิบัติตามมาตรฐานตาม Domain ที่ทำงานอยู่อย่างเคร่งครัด:

**Backend:**
- `coding-standard/backend/1-tech-stack.md`
- `coding-standard/backend/2-folder-structure.md`
- `coding-standard/backend/3-api-routing.md`
- `coding-standard/backend/4-request-headers.md`
- `coding-standard/backend/5-security-and-validation.md`
- `coding-standard/backend/6-api-response-codes.md`
- `coding-standard/backend/7-openapi-contract.md`
- `coding-standard/backend/8-openapi-validation.md`
- `coding-standard/backend/11-database-connection.md`
- `coding-standard/backend/12-data-management.md`
- `coding-standard/backend/13-code-quality.md`

**Auth:**
- `coding-standard/auth/1-tech-stack.md`
- `coding-standard/auth/2-folder-structure.md`
- `coding-standard/auth/3-api-routing.md`
- `coding-standard/auth/4-request-headers.md`
- `coding-standard/auth/5-security-and-validation.md`
- `coding-standard/auth/6-api-response-codes.md`
- `coding-standard/auth/7-openapi-contract.md`
- `coding-standard/auth/8-openapi-validation.md`
- `coding-standard/auth/11-database-connection.md`
- `coding-standard/auth/12-data-management.md`
- `coding-standard/auth/13-code-quality.md`

**Frontend (Backoffice):**
- `coding-standard/frontend/backoffice/1-tech-stack.md`
- `coding-standard/frontend/backoffice/2-folder-structure.md`
- `coding-standard/frontend/backoffice/3-routing-and-pages.md`
- `coding-standard/frontend/backoffice/4-state-management.md`
- `coding-standard/frontend/backoffice/5-api-integration.md`
- `coding-standard/frontend/backoffice/6-ui-and-styling.md`
- `coding-standard/frontend/backoffice/7-authentication.md`
- `coding-standard/frontend/backoffice/8-error-handling.md`
- `coding-standard/frontend/backoffice/10-code-quality.md`

**Gateway:**
- `coding-standard/gateway/1-tech-stack.md`
- `coding-standard/gateway/2-folder-structure.md`
- `coding-standard/gateway/3-api-routing.md`
- `coding-standard/gateway/4-request-headers.md`
- `coding-standard/gateway/5-security-and-validation.md`
- `coding-standard/gateway/6-api-response-codes.md`
- `coding-standard/gateway/7-openapi-contract.md`
- `coding-standard/gateway/8-openapi-validation.md`
- `coding-standard/gateway/11-code-quality.md`
