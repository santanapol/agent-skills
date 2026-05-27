# Using agent-skills with GitHub Copilot (การใช้ agent-skills ร่วมกับ GitHub Copilot)

## Setup (การติดตั้ง)

### Copilot Instructions (คู่มือยัดคำสั่งใส่ Copilot)

Copilot รองรับการดึง agent skills จากโฟลเดอร์ `.github/skills`, `.claude/skills`, หรือ `.agents/skills` ภายในคลัง repository ของคุณ

```bash
mkdir -p .github

# สร้างไฟล์ดึง skills ขั้นเทพต่างๆ มาใช้งาน
cat /path/to/agent-skills/skills/test-driven-development/SKILL.md > .github/skills/test-driven-development/SKILL.md
cat /path/to/agent-skills/skills/code-review-and-quality/SKILL.md > .github/skills/code-review-and-quality/SKILL.md
```

ถ้าอยากรู้รายละเอียดเชิงลึก, ให้ไปดูที่ [Creating agent skills for GitHub Copilot](https://docs.github.com/en/copilot/how-tos/use-copilot-agents/coding-agent/create-skills)

### Agent Personas (*.agent.md) (การสร้างตัวละครให้ Agent)

Copilot สามารถรองรับการสวมบทบาทเฉพาะทาง (specialized agent personas) ให้ลองจับเอา agents ของโปรเจกต์ agent-skills ไปลองดูสิ:

> **ด่วน (Important):** GitHub Copilot บังคับว่าไฟล์ของ agent ต้องลงท้ายนามสกุลชื่อว่า `*.agent.md`.
> ถ้าตั้งชื่อแค่ `*.md` เฉยๆ มันจะโดน Copilot เมินแบบไร้เยื่อใย
> ดูรายละเอียดใน [VS Code custom agents docs](https://code.visualstudio.com/docs/copilot/customization/custom-agents#_custom-agent-file-structure)

```bash
# สร้างโฟลเดอร์ agents ไว้เตรียมคัดลอกร่างทรง
mkdir -p .github/agents
cp /path/to/agent-skills/agents/code-reviewer.md .github/agents/code-reviewer.agent.md
cp /path/to/agent-skills/agents/test-engineer.md .github/agents/test-engineer.agent.md
cp /path/to/agent-skills/agents/security-auditor.md .github/agents/security-auditor.agent.md
```

วิธีการเรียกใช้งานร่างทรง agents ภายในหน้าต่าง Copilot Chat:
- `@code-reviewer ช่วยรีวิว PR นี้ให้หน่อย`
- `@test-engineer ช่วยวิเคราะห์ขอบเขตเทส (test coverage) ในโมดูลนี้ให้หน่อย`
- `@security-auditor ส่องหาช่องโหว่ความปลอดภัยใน endpoint นี้ให้ที`

### Custom Instructions (User Level) (การฝังคำสั่งกำหนดเองระดับผู้ใช้)

สำหรับ skills ที่คุณอยากพกติดตัวไปใช้กับทุก repositories:

1. เปิด VS Code → ไปที่ Settings → พิมพ์หา GitHub Copilot → Custom Instructions
2. เอาเนื้อหาสรุปของ skill ที่คุณใช้ประจำไปแปะใส่ซะ

## Recommended Configuration (ค่าติดตั้งที่แนะนำ)

### .github/copilot-instructions.md

GitHub Copilot ซัพพอร์ตการป้อนคำสั่งให้คลุมทั้งโปรเจกต์ (project-level instructions) ผ่านไฟล์ `.github/copilot-instructions.md`

```markdown
# Project Coding Standards (มาตรฐานการเขียนโค้ดประจำโปรเจกต์)

## Testing (เรื่องการเทส)
- เขียนเทสล่วงหน้าก่อนจะลงมือเขียนโค้ดเสมอ (วิถี TDD)
- สำหรับงานแก้บั๊ก: ให้เขียนเทสตัวสีแดงให้มันพังคามือก่อน, แล้วค่อยแก้โค้ดให้มันเขียว (แพทเทิร์น Prove-It)
- ระดับชั้นการเทส: unit > integration > e2e (ให้เทสที่ชั้นต่ำสุดเท่าที่จะคุมพฤติกรรมนั้นอยู่)
- สั่งรัน `npm test` หลังจากมีการแก้ไขทุกครั้ง

## Code Quality (เรื่องคุณภาพโค้ด)
- กวาดตามองรีวิวทั้ง 5 แกนหลัก: correctness, readability, architecture, security, performance
- ทุกๆ PR จะต้องฝ่าด่านพวกนี้ให้ผ่าน: lint, type check, tests, build
- ห้ามมีความลับ (secrets) หลุดไปในโค้ด หรือ version control เด็ดขาด

## Implementation (การลงมือสร้าง)
- ค่อยๆ สร้างเป็นชิ้นเล็กๆ ที่ตรวจสอบได้
- ในแต่ละชิ้นงาน: เขียนโค้ด → เทส → ตรวจสอบความชัวร์ → กด commit
- ห้ามเอาการแก้ไขพฤติกรรมโค้ดไปยำรวมกับการจัดหน้าเว้นวรรค (formatting) เด็ดขาด

## Boundaries (เส้นแบ่งขอบเขต)
- บังคับทำเสมอ: รัน tests ก่อนสั่ง commits, ตั้งด่านกรอง input จากผู้ใช้งาน
- ถามก่อนทำเสมอ: การเปลี่ยนแปลงรูปแบบโครงสร้างดาต้าเบส, การลาก dependencies หน้าใหม่เข้ามา
- ห้ามทำเด็ดขาด: เอาของลับใส่ใน commit, ลบ tests ที่แดงทิ้งเพื่อหนีปัญหา, ข้ามขั้นตอนตรวจสอบ (verification)
```

### Specialized Agents (หน่วยรบพิเศษ Agents)

ใช้บรรดา agents เพื่อส่งมันลงพื้นที่ไปทำหน้าที่ตรวจสอบเฉพาะทางใน Copilot Chat

## Usage Tips (เคล็ดลับการใช้งาน)

1. **Keep instructions concise (เก็บคำสั่งให้กระชับ)** — คำสั่งของ Copilot จะทำงานได้ดีที่สุดตอนที่มันจับประเด็นโฟกัสได้ชัดเจน สรุปเอากฎข้อสำคัญๆ มาใส่แทนที่จะเอาเนื้อหา skill มาโยนใส่ทั้งหมด
2. **Use agents for review (ใช้ agents มารีวิว)** — ตัว `code-reviewer`, `test-engineer`, และ `security-auditor` ถูกออกแบบร่างมาให้เข้ากับสไตล์การทำงานของ Copilot อยู่แล้ว
3. **Reference in chat (อ้างอิงตรงๆ กลางแชต)** — ตอนที่กำลังทำงานอยู่ในช่วงหัวเลี้ยวหัวต่อ (specific phase), ให้ก๊อปปี้เนื้อหา skill ที่เกี่ยวข้อง ไปแปะอัดใส่หน้าต่าง Copilot Chat เพื่อให้บริบทมันแน่นๆ ไปเลย
4. **Combine with PR reviews (ผูกติดระบบช่วยรีวิว PR)** — จับ Copilot ยัดเข้าไปรันช่วยรีวิวใน PR โดยให้มันสวมบทเป็นร่างทรง `code-reviewer` agent ซะ
