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
