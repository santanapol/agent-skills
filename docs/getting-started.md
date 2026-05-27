# Getting Started with agent-skills (เริ่มต้นใช้งาน agent-skills)

โปรเจกต์ `agent-skills` ถูกออกแบบมาให้สามารถเชื่อมต่อกับสารพัด AI coding agent ตัวไหนก็ได้ที่รองรับคำสั่งแบบ Markdown. คู่มือฉบับนี้จะครอบคลุมวิธีการใช้งานแบบพื้นฐานครอบจักรวาล (universal approach). ถ้าอยากได้วิธีตั้งค่าเจาะจงเฉพาะเครื่องมือไหน, ให้ไปดูในคู่มือเฉพาะของแต่ละตัวเอานะ

## How Skills Work (ระบบ Skills ทำงานยังไง)

ในแต่ละ skill จะมาเป็นไฟล์ Markdown (`SKILL.md`) ที่ทำหน้าที่บรรยายขั้นตอนกระบวนการทางวิศวกรรมเฉพาะทาง (engineering workflow). เมื่อไฟล์นี้ถูกป้อนเข้าไปในสมอง(context) ของ agent, ตัว agent จะโดนบังคับให้เดินตาม workflow ที่วางไว้ — รวมไปถึงขั้นตอนตรวจสอบ (verification steps), สัญญาณอันตรายห้ามทำ (anti-patterns), และเกณฑ์การชี้วัดว่างานเสร็จหรือยัง (exit criteria)

**ท่องไว้ว่า Skills ไม่ใช่แค่เอกสารอ้างอิง (reference docs)** แต่มันคือตำราสอน step-by-step ที่เอาไว้ให้ agent เดินตาม

## Quick Start (Any Agent) (คู่มือเร่งด่วนสำหรับใช้งานร่วมกับ Agent ทุกยี่ห้อ)

### 1. Clone the repository (โคลนเอาลงเครื่อง)

```bash
git clone https://github.com/addyosmani/agent-skills.git
```

### 2. Choose a skill (เลือกจิ้มเอาสัก skill)

ไล่ดูในโฟลเดอร์ `skills/`. ข้างในแต่ละโฟลเดอร์ย่อยจะมีไฟล์ `SKILL.md` อาศัยอยู่ ซึ่งประกอบด้วย:
- **When to use (จังหวะที่ควรหยิบมาใช้)** — สัญญาณกระตุ้นว่างานแบบไหนควรจะดึง skill นี้มาใช้
- **Process (กระบวนการ)** — ขั้นตอนเวิร์กโฟลว์บอกแบบสเตปต่อสเตป
- **Verification (การตรวจทาน)** — วิธีการเช็คให้ชัวร์ว่างานเสร็จหรือยัง
- **Common rationalizations (ข้ออ้างยอดฮิต)** — ข้ออ้างที่ agents ชอบใช้เพื่อแอบข้ามขั้นตอน
- **Red flags (สัญญาณเตือนภัย)** — สัญญาณเตือนว่ากฎของ skill นี้กำลังถูกทำลาย

### 3. Load the skill into your agent (ส่ง skill จับยัดใส่สมอง agent)

ให้ก๊อปปี้เอาเนื้อหาในไฟล์ `SKILL.md` ตัวที่ต้องการไปแปะใส่หน้าต่าง system prompt ของ agent, หรือจะใส่ใน rules file, หรือจะอัดลงกลางบทสนทนา (conversation) เลยก็ได้ ท่าที่คนนิยมใช้กันคือ:

**System prompt:** โยนก้อนเนื้อหาของ skill ไปตั้งไว้ตอนช่วงเริ่มต้นของการเปิดใช้งาน (session) เลย

**Rules file:** เอาเนื้อหาของ skill ไปยัดลงในตัว rules file ของโปรเจกต์ (พวก CLAUDE.md, .cursorrules, ฯลฯ)

**Conversation:** สั่งระบุอ้างอิงชื่อ skill เอาดื้อๆ กลางแชตเลย: "ช่วยทำตามกฎกระบวนการ test-driven-development เพื่อทำงานแก้ไขชิ้นนี้นะ"

### 4. Use the meta-skill for discovery (ใช้ตัวทักษะแม่ (meta-skill) ช่วยเป็นหน้าต่างนำทาง)

เริ่มต้นด้วยการอัดทักษะ `using-agent-skills` ใส่เข้าไป. ภายในตัวมันจะมีแผนผัง flowchart ที่ใช้บอกทิศทาง (maps) พาไปหาว่างานประเภทไหนควรจะเรียกใช้ skill ตัวใด

## Recommended Setup (การติดตั้งที่แนะนำ)

### Minimal (Start here) (ฉบับมินิมอล - เริ่มตรงนี้)

ยัดแค่ skills มหาเทพ 3 ตัวนี้ เข้าไปใน rules file ของคุณ:

1. **spec-driven-development** — เอาไว้วาดภาพกำหนดว่าจะสร้างอะไร
2. **test-driven-development** — เอาไว้เป็นหลักฐานพิสูจน์ว่าของที่สร้างมันรันได้จริง
3. **code-review-and-quality** — เอาไว้ตาข่ายเช็คคุณภาพรวบยอดก่อนจะกด merge

ของวิเศษ 3 ชิ้นนี้ จะช่วยปิดรอยรั่วและอุดช่องโหว่ปัญหาคุณภาพงาน ที่มักเกิดจากการปล่อยให้ AI พัฒนาระบบแบบตามยถากรรม

### Full Lifecycle (จัดเต็มครบวงจร)

ถ้าอยากได้การครอบคลุมที่ทะลุปรุโปร่ง, ให้แบ่งโหลด skills ไปตามระยะของเนื้องาน:

```
ตอนเพิ่งเริ่มโปรเจกต์:     spec-driven-development → planning-and-task-breakdown
ตอนกำลังรัวโค้ดพัฒนางาน:  incremental-implementation + test-driven-development
ก่อนจะกดควบรวม (merge): code-review-and-quality + security-and-hardening
ก่อนจะขึ้นระบบ (deploy):  shipping-and-launch
```

### Context-Aware Loading (โหลดให้ถูกจังหวะ)

อย่ามักง่ายโหลด skills ทุกอันพร้อมกันรวดเดียว — มันผลาญ context เปล่าๆ ให้โหลด skills เฉพาะตัวที่เกี่ยวข้องกับงานหน้าตักปัจจุบัน:

- กำลังทาสีทำหน้าจอ UI หรอ? โหลด `frontend-ui-engineering`
- กำลังนั่งสืบหาบั๊ก Debug หรอ? โหลด `debugging-and-error-recovery`
- กำลังนั่งต่อสาย CI หรอ? โหลด `ci-cd-and-automation`

## Skill Anatomy (โครงสร้างกายวิภาคของ Skill)

ทุกๆ skill จะเดินตามรูปแบบโครงสร้างชุดเดียวกันเป๊ะ:

```
โผล่หน้าต่างมาด้วย YAML frontmatter (ระบุ name, description)
├── Overview — ภาพรวมว่า skill นี้ทำอะไรได้บ้าง
├── When to Use — เงื่อนไขกระตุ้นให้ใช้งาน (Triggers)
├── Core Process — ขั้นตอนเวิร์กโฟลว์บอกแบบสเตปต่อสเตป
├── Examples — ยกตัวอย่างพฤติกรรมโค้ด
├── Common Rationalizations — ข้ออ้างยอดฮิต พร้อมคำด่าสวน
├── Red Flags — สัญญาณเตือนว่ากฎกำลังถูกแหก
└── Verification — เช็คลิสต์ตรวจสอบว่าจบงานได้แล้วนะ
```

เข้าไปดูคู่มือตัวเต็มได้ที่ [skill-anatomy.md](skill-anatomy.md)

## Using Agents (การใช้งาน Agents)

โฟลเดอร์ `agents/` ข้างในจะเก็บรวบรวมตัวละครร่างทรง (agent personas) ที่ถูกจูนตั้งค่ามาให้แล้ว:

| Agent | Purpose (เอาไว้ทำอะไร) |
|-------|---------|
| `code-reviewer.md` | ตาข่ายกรองรีวิวงาน 5 มิติ |
| `test-engineer.md` | วางกลยุทธ์ test และลุยเขียน tests |
| `security-auditor.md` | ตามล่าส่องหาช่องโหว่ความปลอดภัย |

เรียกใช้ตัวละครเมื่อไหร่ที่คุณอยากได้การรีวิวระดับผู้เชี่ยวชาญ (specialized review). ตัวอย่างเช่น, โยนคำสั่งด่า coding agent ไปว่า "ช่วยใช้มุมมองจาก persona ตัว code-reviewer มาสแกนรีวิวงานแก้ชิ้นนี้ให้หน่อย" แล้วก็แนบรายละเอียดบทบาทลงไป

## Using Commands (การใช้งานคำสั่ง Commands)

โฟลเดอร์ `.claude/commands/` เก็บรวบรวมของวิเศษคำสั่งลัด (slash commands) เตรียมไว้ให้สำหรับ Claude Code:

| Command | Skill Invoked (ทักษะที่ถูกปลุกเรียก) |
|---------|---------------|
| `/spec` | spec-driven-development |
| `/plan` | planning-and-task-breakdown |
| `/build` | incremental-implementation + test-driven-development |
| `/test` | test-driven-development |
| `/review` | code-review-and-quality |
| `/ship` | shipping-and-launch |

## Using References (การใช้งานไฟล์อ้างอิง References)

โฟลเดอร์ `references/` เก็บรวบรวมบรรดาข้อมูลเช็คลิสต์เสริมทัพต่างๆ:

| Reference | Use With (เอาไปใช้คู่กับ) |
|-----------|----------|
| `testing-patterns.md` | test-driven-development |
| `performance-checklist.md` | performance-optimization |
| `security-checklist.md` | security-and-hardening |
| `accessibility-checklist.md` | frontend-ui-engineering |

ลากพวกไฟล์เอกสารอ้างอิง(reference) ไปใช้เวลาที่คุณต้องการเจาะลึกเฉพาะทางแบบดำดิ่งกว่าสิ่งที่หน้า skill สรุปมาให้

## Spec and task artifacts (วัตถุโบราณสาย Spec และ Task)

พวกคำสั่ง `/spec` และ `/plan` จะเป็นตัวสร้างแผ่นจารึกของชิ้นงาน (`SPEC.md`, `tasks/plan.md`, `tasks/todo.md`) ออกมา. ขอให้ทำตัวกับมันประหนึ่งว่าเป็น **เอกสารมีชีวิตชีวา (living documents)** ในขณะที่กำลังทำภารกิจนั้นๆ:

- ให้จับมันโยนเข้าเวอร์ชันคุมโค้ด (version control) ระหว่างการพัฒนา เพื่อให้ทั้งคนและ agent ได้ใช้เป็นคัมภีร์หลักร่วมกัน (shared source of truth)
- หมั่นอัปเดตมันทุกครั้งที่มีการเปลี่ยนขอบเขต (scope) หรือเปลี่ยนทิศทางเป้าหมาย
- ถ้าโปรเจกต์คุณขี้เกียจแบกไฟล์พวกนี้ไว้หลังจากจบงาน, จะลบทิ้งก่อนกด merge หรือจะโยนเข้าโฟลเดอร์ไปฝากฝังไว้ใน `.gitignore` ก็ได้นะ — พวกนี้เป็นแค่งานชั่วคราว ไม่ต้องเก็บถาวรหรอก

## Tips (เคล็ดลับ)

1. **Start with spec-driven-development (ตั้งต้นด้วยทักษะเสก spec ก่อนเสมอ)** ถ้างานที่รับมามันไม่ใช่งานก๊อกแก๊กไก่กา
2. **Always load test-driven-development (พกปืน TDD ไว้เสมอ)** ทุกครั้งที่ต้องเขียนตรรกะโค้ด
3. **Don't skip verification steps (อย่ามักง่ายข้ามด่านตรวจสอบ)** — เพราะนั่นแหละคือเป้าหมายสูงสุดของการมีมัน
4. **Load skills selectively (เลือกหน้าไพ่ skill ให้ดี)** — การมีข้อมูลล้นสมอง ใช่ว่าจะดีเสมอไป
5. **Use the agents for review (ปล่อย agents ออกไปรีวิว)** — ส่องจากหลายมุม ย่อมดีกว่าเจอจุดอ่อนแค่มุมเดียว
