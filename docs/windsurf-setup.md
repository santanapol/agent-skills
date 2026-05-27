# Using agent-skills with Windsurf (การใช้ agent-skills ร่วมกับ Windsurf)

## Setup (การติดตั้ง)

### Project Rules (การใช้กับระดับเฉพาะโปรเจกต์)

ระบบ Windsurf จะคอยตรวจจับหาไฟล์ `.windsurfrules` เพื่อนำไปสั่งเป็นคำสั่งปฏิบัติการแก่เอเจนต์ให้รันเฉพาะเจาะจงกับโปรเจกต์นั้นๆ:

```bash
# ปั้นไฟล์รวมร่างกฎ (rules) จากพวกสกิลตัวท็อปๆ 
cat /path/to/agent-skills/skills/test-driven-development/SKILL.md > .windsurfrules
echo "\n---\n" >> .windsurfrules
cat /path/to/agent-skills/skills/incremental-implementation/SKILL.md >> .windsurfrules
echo "\n---\n" >> .windsurfrules
cat /path/to/agent-skills/skills/code-review-and-quality/SKILL.md >> .windsurfrules
```

### Global Rules (การใช้กับครอบจักรวาล)

สำหรับทักษะ (skills) ดีๆ ที่อยากให้ติดทนผูกฝังข้ามสายไปทุกๆ โปรเจกต์, ให้เพิ่มมันเข้าไปในกฎใหญ่ (Global Rules) ของ Windsurf ได้เลย:

1. เปิดที่ Windsurf → จิ้มไปที่ Settings → จิ้มต่อที่ AI → ไปที่ Global Rules
2. สาดก๊อปปี้ทักษะเนื้อหาที่คุณดึงใช้งานบ่อยที่สุด โยนยัดเข้าไปเลย

## Recommended Configuration (ค่าติดตั้งที่แนะนำ)

เพื่อการดูแลสุขภาพขอบเขตสมองของ Windsurf (context limits), ให้คุมจำนวนของกฎที่อยู่ในไฟล์ `.windsurfrules` ให้จำกัดวงโฟกัสอยู่แค่พวกทักษะตัวเก๋าติดตัว (essential skills) 2-3 อันก็พอ:

```
# .windsurfrules
# แหล่งรวมทักษะวิเศษประจำตัวของ agent สำหรับโปรเจกต์นี้

[สาดแปะเนื้อหาของ test-driven-development SKILL.md ลงตรงนี้]

---

[สาดแปะเนื้อหาของ incremental-implementation SKILL.md ลงตรงนี้]

---

[สาดแปะเนื้อหาของ code-review-and-quality SKILL.md ลงตรงนี้]
```

## Usage Tips (เคล็ดลับการใช้งาน)

1. **Be selective (หัดคัดเลือกก่อนลงสนาม)** — โควตาสมองของ Windsurf มีจำกัดนะ ให้หยิบดึงเอา skills เฉพาะตัวที่ตอบโจทย์ช่องโหว่พังๆ ของตัวคุณได้ดีที่สุดมาใช้ก็พอ
2. **Reference in conversation (อ้างอิงสดๆ ตอนแชตสนทนา)** — ให้ลากก๊อปปี้เนื้อหาทักษะ (skill) ตัวอื่นๆ สาดแปะเข้าไปในหน้าต่างแชตแบบดื้อๆ ตอนที่คุณเผชิญหน้ากับงานเฉพาะเจาะจง (specific phases) (เช่น อัดเนื้อหาของ `security-and-hardening` ตอนที่คุณกำลังพัวพันอยู่กับการทำระบบล็อคอิน auth)
3. **Use references as checklists (จงใช้งานเช็คลิสต์อ้างอิงให้เป็นประโยชน์)** — สาดแปะลิสต์ของ `references/security-checklist.md` เข้าไปกลางวง แล้วป้อนคำสั่งบังคับ Windsurf ให้ไล่ตรวจประเมินยืนยัน(verify) ไปทีละข้อซะ
