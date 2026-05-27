# agent-skills

นี่คือโปรเจกต์ agent-skills — คลังรวบรวมทักษะวิศวกรรมระดับ production สำหรับ AI coding agents

## Project Structure (โครงสร้างโปรเจกต์)

```
skills/       → ทักษะหลัก (แต่ละโฟลเดอร์มีไฟล์ SKILL.md)
agents/       → Agent personas ที่สามารถเรียกใช้ซ้ำได้ (code-reviewer, test-engineer, security-auditor)
hooks/        → Hooks สำหรับวงจรชีวิตของเซสชัน (Session lifecycle)
.claude/commands/ → Slash commands (/spec, /plan, /build, /test, /review, /code-simplify, /ship)
references/   → เช็คลิสต์เสริม (testing, performance, security, accessibility)
docs/         → คู่มือการติดตั้งสำหรับเครื่องมือต่างๆ
```

## Skills by Phase (ทักษะแบ่งตามระยะ)

**Define (นิยาม):** interview-me, idea-refine, spec-driven-development
**Plan (วางแผน):** planning-and-task-breakdown
**Build (สร้าง):** incremental-implementation, test-driven-development, context-engineering, source-driven-development, doubt-driven-development, frontend-ui-engineering, api-and-interface-design
**Verify (ตรวจสอบคุณภาพ):** browser-testing-with-devtools, debugging-and-error-recovery
**Review (รีวิวงาน):** code-review-and-quality, code-simplification, security-and-hardening, performance-optimization
**Ship (ปล่อยของ):** git-workflow-and-versioning, ci-cd-and-automation, deprecation-and-migration, documentation-and-adrs, shipping-and-launch

## Conventions (ข้อตกลงในการเขียน)

- ทุกๆ ทักษะจะอาศัยอยู่ใน `skills/<name>/SKILL.md`
- ส่วนหัว YAML frontmatter ต้องมีฟิลด์ `name` และ `description`
- คำอธิบาย (Description) ต้องเริ่มต้นด้วยสิ่งที่ทักษะนี้ทำได้ (มุมมองบุรุษที่สาม), ตามด้วยเงื่อนไขกระตุ้นให้ใช้งาน ("ใช้เมื่อ / Use when...")
- ทุกๆ ทักษะต้องมีหัวข้อ: Overview, When to Use, Process, Common Rationalizations, Red Flags, Verification
- ไฟล์อ้างอิงต่างๆ ให้อยู่ใน `references/`, ห้ามเอาไปไว้ในโฟลเดอร์ของทักษะ (skill directories)
- ไฟล์เนื้อหาเสริมต่างๆ จะถูกสร้างขึ้นก็ต่อเมื่อเนื้อหามีความยาวเกิน 100 บรรทัดเท่านั้น

## Commands (คำสั่ง)

- `npm test` — ไม่สามารถใช้งานได้ (เพราะโปรเจกต์นี้มีแต่ไฟล์เอกสารคู่มือ)
- ตรวจสอบความถูกต้อง (Validate): เช็คว่าไฟล์ SKILL.md ทุกไฟล์มีข้อมูล YAML frontmatter พร้อมระบุ `name` และ `description` ถูกต้องสมบูรณ์

## Boundaries (ขอบเขตข้อบังคับ)

- ต้องทำเสมอ (Always): ทำตามรูปแบบโครงสร้างใน skill-anatomy.md ทุกครั้งเมื่อจะสร้างทักษะใหม่
- ห้ามทำเด็ดขาด (Never): เพิ่มทักษะที่เป็นแค่คำแนะนำลอยๆ กว้างๆ โดยไม่มีกระบวนการที่เป็นขั้นเป็นตอนให้นำไปปฏิบัติจริงได้
- ห้ามทำเด็ดขาด (Never): คัดลอกเนื้อหาซ้ำซ้อนกันไปมาระหว่างทักษะ — ให้ใช้วิธีโยงลิงก์อ้างอิงไปยังทักษะอื่นแทน
