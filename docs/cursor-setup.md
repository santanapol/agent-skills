# Using agent-skills with Cursor (การใช้ agent-skills ร่วมกับ Cursor)

## Setup (การติดตั้ง)

### Option 1: Rules Directory (Recommended) (ทางเลือกที่ 1: ตั้งค่าในโฟลเดอร์ rules - แนะนำ)

ระบบ Cursor รองรับการทำงานกับโฟลเดอร์ `.cursor/rules/` เพื่อใช้ในการกำหนดกฎเกณฑ์เฉพาะตัวในแต่ละโปรเจกต์:

```bash
# เสกโฟลเดอร์ rules ขึ้นมา
mkdir -p .cursor/rules

# คัดลอก skills ตัวที่คุณอยากจับตั้งเป็นกฎ
cp /path/to/agent-skills/skills/test-driven-development/SKILL.md .cursor/rules/test-driven-development.md
cp /path/to/agent-skills/skills/code-review-and-quality/SKILL.md .cursor/rules/code-review-and-quality.md
cp /path/to/agent-skills/skills/incremental-implementation/SKILL.md .cursor/rules/incremental-implementation.md
```

กฎกติกาที่อยู่ในโฟลเดอร์นี้ จะถูกดูดกลืนเข้าสู่สมอง (context) ของ Cursor ให้เองแบบอัตโนมัติ

### Option 2: .cursorrules File (ทางเลือกที่ 2: ใช้ไฟล์ .cursorrules ก้อนเดียว)

สร้างไฟล์ `.cursorrules` โยนแหมะไว้ในโฟลเดอร์หลัก (project root) แล้วจัดการเท skills สำคัญๆ รวมมิตรใส่ลงไป:

```bash
# รวมร่าง rules กลายเป็นไฟล์เดียว
cat /path/to/agent-skills/skills/test-driven-development/SKILL.md > .cursorrules
echo "\n---\n" >> .cursorrules
cat /path/to/agent-skills/skills/code-review-and-quality/SKILL.md >> .cursorrules
```

## Recommended Configuration (ค่าติดตั้งที่แนะนำ)

### Essential Skills (Always Load) (วิชาติดตัวที่ต้องโหลดเสมอ)

ให้ใส่ของพวกนี้ลงไปใน `.cursor/rules/`:

1. `test-driven-development.md` — เวทมนตร์ TDD และคาถา Prove-It
2. `code-review-and-quality.md` — ตาข่ายกรองงาน 5 มิติ
3. `incremental-implementation.md` — วิชาก่อร่างสร้างตัวทีละชิ้นเล็กๆ

### Phase-Specific Skills (Load on Demand) (วิชาเฉพาะกิจ โหลดมาเฉพาะตอนจำเป็น)

สำหรับงานที่ต้องเจาะจงเฉพาะช่วง (phase-specific work), ให้สร้าง rule files งอกขึ้นมาใหม่เมื่อถึงคราวที่ต้องใช้:

- `spec-development.md` -> `spec-driven-development/SKILL.md`
- `frontend-ui.md` -> `frontend-ui-engineering/SKILL.md`
- `security.md` -> `security-and-hardening/SKILL.md`
- `performance.md` -> `performance-optimization/SKILL.md`

ให้ยัดไฟล์พวกนี้ลงไปใน `.cursor/rules/` เมื่อต้องเผชิญหน้ากับด่านนั้นๆ, และเมื่อจบงานก็ลบมันทิ้งเพื่อรักษาพื้นที่สมอง (context limits) ให้ปลอดโปร่ง

## Usage Tips (เคล็ดลับการใช้งาน)

1. **Don't load all skills at once (อย่าทะลึ่งยัดโหลดทุกอันพร้อมกัน)** - สมอง Cursor มีข้อจำกัด (context limits) ให้เลือกโหลดแค่วิชาติดตัว(essential skills) 2-3 อันเป็นกฎตั้งต้น แล้วส่วนวิชาเฉพาะกิจ (phase-specific skills) ค่อยทยอยป้อนตอนจำเป็นเอา
2. **Reference skills explicitly (สั่งระบุชื่อ skill ให้เป๊ะ)** - ตะโกนบอก Cursor ให้ชัดๆ ว่า "ทำตามกฎ test-driven-development เพื่อทำงานแก้ไขชิ้นนี้นะ" เพื่อบังคับให้มันกลับไปอ่านกฎที่ถูกโหลดค้างไว้
3. **Use agents for review (ใช้ agents ให้ช่วยรีวิว)** - ก๊อปปี้เนื้อหาใน `agents/code-reviewer.md` ออกมาแล้วฟาดใส่ Cursor พร้อมสั่งว่า "ช่วยรีวิวไอ้ส่วนที่แก้มานี้หน่อย โดยใช้มุมมองจากกรอบแนวคิดนี้เลยนะ"
4. **Load references on demand (โหลดตัวอ้างอิงตอนจำเป็นเท่านั้น)** - ตอนกำลังง่วนอยู่กับการทำ performance, ให้ลากไฟล์ `performance.md` ยัดเข้า `.cursor/rules/` หรือไม่ก็ก๊อปปี้พวกเนื้อหาเช็คลิสต์ มาแปะดื้อๆ กลางหน้าจอเลยก็ได้
