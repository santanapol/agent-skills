# Using agent-skills with Gemini CLI (การใช้ agent-skills ร่วมกับ Gemini CLI)

## Setup (การติดตั้ง)

### Option 1: Install as Skills (Recommended) (ทางเลือกที่ 1: ติดตั้งเป็น Skills - แนะนำ)

ระบบ Gemini CLI มีระบบทักษะในตัวเครื่อง (native skills system) ที่จะทำการไล่ส่องหาไฟล์ `SKILL.md` ในโฟลเดอร์ `.gemini/skills/` หรือ `.agents/skills/` โดยอัตโนมัติ ทุกๆ skill จะตื่นขึ้นมาทำงานทันที (activates on demand) เมื่อมันส่องเห็นว่าภารกิจตรงหน้ามันตรงกับหน้างานของมัน

**ติดตั้งดึงมาจาก repo เลย:**

```bash
gemini skills install https://github.com/addyosmani/agent-skills.git --path skills
```

**หรือติดตั้งจากเครื่องตัวเองที่ clone ไว้แล้ว:**

```bash
git clone https://github.com/addyosmani/agent-skills.git
gemini skills install /path/to/agent-skills/skills/
```

**ติดตั้งเฉพาะบนกรอบ workspace ของโปรเจกต์นี้เท่านั้น:**

```bash
gemini skills install /path/to/agent-skills/skills/ --scope workspace
```

Skills ที่ถูกสั่งยัดเข้าในระดับ workspace จะไปนอนรออยู่ใน `.gemini/skills/` (หรือ `.agents/skills/`). ส่วน skills ในระดับเครื่อง(user-level) จะไปตกที่ `~/.gemini/skills/`

พอลงเสร็จ, ให้ไปยืนยันดูว่าของเข้าไหมด้วยคำสั่ง:

```
/skills list
```

ตัว Gemini CLI จะเป็นคนจัดการฉีดเอาตัวชื่อและคำอธิบายของ skill เข้าไปใน prompt แบบอัตโนมัติ. เมื่อมันมองตาแล้วรู้ใจว่าเข้าทางภารกิจไหน, มันจะเด้งหน้าต่างมาขออนุญาต (ask permission) คุณก่อนที่จะเปิดใช้งานและโหลดคำสั่งชุดใหญ่เต็มรูปแบบลงมา

### Option 2: GEMINI.md (Persistent Context) (ทางเลือกที่ 2: ใช้ไฟล์ GEMINI.md - โหลดคาถาวางไว้ตลอดกาล)

สำหรับ skills ที่คุณอยากให้โหลดค้างทิ้งไว้เป็นส่วนหนึ่งของวิญญาณโปรเจกต์ (persistent project context) ตลอดเวลา (แทนที่จะรอเรียกใช้แค่ชั่วครั้งชั่วคราว), ให้ยัดมันลงไปในไฟล์ `GEMINI.md` ของโปรเจกต์คุณเลย:

```bash
# เสกไฟล์ GEMINI.md ขึ้นมา แล้วยัด core skills ให้นอนเป็นบริบทถาวร
cat /path/to/agent-skills/skills/incremental-implementation/SKILL.md > GEMINI.md
echo -e "\n---\n" >> GEMINI.md
cat /path/to/agent-skills/skills/code-review-and-quality/SKILL.md >> GEMINI.md
```

หรือคุณอยากจะจัดระเบียบให้หล่อหน่อย โดยใช้วิธีดึงนำเข้า (importing) จากไฟล์ที่แยกกันเอาไว้:

```markdown
# Project Instructions (คำสั่งประจำโปรเจกต์)

@skills/test-driven-development/SKILL.md
@skills/incremental-implementation/SKILL.md
```

ใช้คำสั่ง `/memory show` ส่องดูบริบท (context) ที่ถูกฝังลงไป, และกดคำสั่ง `/memory reload` เพื่อรีเฟรชอัปเดตหลังจากมีการแก้ไฟล์แล้ว

> **Skills vs GEMINI.md:** Skills เปรียบเสมือนผู้เชี่ยวชาญรอแสตนด์บาย ที่จะทำงานเฉพาะตอนที่โดนเรียกใช้เท่านั้น, ซึ่งช่วยให้หน้าต่างสมองของคุณไม่รกรุงรัง (context window clean). ส่วนตัว GEMINI.md คือบริบทที่ติดตัวถาวร (persistent context) โหลดแช่ไว้ทุกๆ การพิมพ์ prompt. ให้หยิบ skills มาใช้เวลาจะลุยงานเป็นฉากๆ (phase-specific workflows) และใช้ GEMINI.md เอาไว้กางกฎเหล็กมารยาทของโปรเจกต์ที่ต้องปฏิบัติตามตลอดเวลา

## Recommended Configuration (ค่าติดตั้งที่แนะนำ)

### Always-On (GEMINI.md) (คาถาติดตัว)

ยัดของเหล่านี้เป็นบริบทค้างไว้ตลอดยามใช้งานทุก session:

- `incremental-implementation` — วิชาก่อร่างสร้างตัวทีละชิ้นเล็กๆ ที่ตรวจสอบได้
- `code-review-and-quality` — ตาข่ายกรองงาน 5 มิติ

### On-Demand (Skills) (วิชาเฉพาะกิจ)

ลงของเหล่านี้ในฐานะ skills ซะ เพื่อที่มันจะได้โผล่มาเฉพาะช่วงที่จำเป็น:

- `test-driven-development` — ใช้งานตอนที่กำลังลุยลงมือเขียนโค้ดตรรกะ หรือตอนปราบเดาะบั๊ก
- `spec-driven-development` — ใช้งานยามที่กำลังเริ่มโปรเจกต์ใหม่ หรือคลอดฟีเจอร์ใหม่
- `frontend-ui-engineering` — ใช้งานยามที่กำลังลงสีสาดโค้ดหน้าตา UI
- `security-and-hardening` — ใช้งานในจังหวะส่องหาช่องโหว่ (security reviews)
- `performance-optimization` — ใช้งานตอนเข้าสู่หมวดปรับจูนเครื่องให้ซิ่ง (performance work)

## Advanced Configuration (การตั้งค่าขั้นสูง)

### MCP Integration (พ่วงปลั๊กอิน MCP)

บรรดาทักษะจำนวนมากที่อยู่ในแพ็กนี้ ถูกออกแบบมาให้ใช้พึ่งพาพวกปืนใหญ่ของ [Model Context Protocol (MCP)](https://modelcontextprotocol.io/) เพื่อส่งเข้าไปโต้ตอบกับพื้นที่ภายนอก (environment). ตัวอย่างเช่น:

- `browser-testing-with-devtools` จะต้องใช้เครื่องมือของสาย `chrome-devtools` แบบ MCP extension เข้ามาเสริมบารมี
- `performance-optimization` ก็จะได้ประโยชน์เต็มที่หากจับคู่เข้ากับเครื่องมือ MCP สาย performance

เพื่อจะปลดล็อกพลังเหล่านี้, กรุณาเช็คให้ชัวร์ก่อนว่าในตัวปรับแต่งของ Gemini CLI (`~/.gemini/config.json`) มีการติดตั้งตัว MCP extensions ที่เกี่ยวข้องเรียบร้อยแล้ว

### Session Hooks (กลไกตะขอร้อย Session)

Gemini CLI รองรับระบบดักฟังสัญญาณชีพ (session lifecycle hooks) คุณสามารถใช้ของเล่นนี้เพื่อทำการฉีดตัวแวดล้อมบริบทอัตโนมัติ (auto-inject context) หรือสั่งให้ระบบรันสคริปต์ตรวจความถูกต้อง ตอนที่กำลังเริ่มต้นเปิดหน้า session ใหม่ได้

เพื่อที่จะทำสำเนารสชาติบรรยากาศ (replicate) ประสบการณ์ของ `agent-skills` ที่ได้รับจากเหล่า tools ตัวอื่นๆ, คุณสามารถเข้าไปกำหนดตัว `SessionStart` hook ให้มาสะกิดเตือนว่าเรามีทักษะอะไรบ้างรออยู่ หรือสั่งโหลดทักษะแม่ (meta-skill) มารอไว้เลยก็ได้

### Explicit Context Loading (การสั่งบังคับโหลด Context)

คุณสามารถสั่งให้โหลดเอาทักษะ (skill) ตัวไหนก็ได้ โดดลงมาในรอบ session ปัจจุบันแบบชัดเจน ด้วยการใส่สัญลักษณ์ `@` เรียกชื่อมันลงไปใน prompt ซะ:

```markdown
กรุณาใช้ท่าของ @skills/test-driven-development/SKILL.md เพื่อสร้างงานตัวนี้ให้เสร็จ
```

วิธีการนี้โคตรจะมีประโยชน์ ตอนที่คุณกระหายอยากจะบังคับรันเส้นทาง (workflow) สายนั้นให้สำเร็จแบบไม่ต้องการรอให้ระบบไปค้นหาตัวเอาเอง (auto-discovery)

## Slash Commands (คำสั่งทางลัด Slash)

ใน repo แอบซุกเครื่องมือคำสั่งทางลัด (slash commands) 7 ตัว ภายใต้แคมป์ `.gemini/commands/` ที่โยงแผนผังเข้าสู่ชีพจรการทำงานของระบบ. ตัว Gemini CLI จะจัดการหาพวกมันเจอแบบอัตโนมัติเมื่อคุณกดสั่งรันจากโฟลเดอร์หลักของโปรเจกต์ (project root)

| Command | What it does (มันทำอะไร) |
|---------|--------------|
| `/spec` | ร่างโครงสร้าง spec ให้เสร็จสรรพ ก่อนจะไปลงมือเขียนโค้ดจริง |
| `/planning` | จับงานมาหั่นเป็นชิ้นเล็กๆ ที่ตรวจสอบได้ |
| `/build` | เดินหน้าทุบโค้ดก้อนถัดไปทีละขั้น |
| `/test` | วิ่งเข้าระบบ TDD เต็มตัว — ไฟแดง, ไฟเขียว, จัดรูปทรง (refactor) |
| `/review` | ตาข่ายกรองรีวิวคุณภาพโค้ด 5 มิติ |
| `/code-simplify` | หั่นตรรกะที่ซับซ้อนทิ้ง โดยที่ผลลัพธ์ยังทำงานเหมือนเดิม |
| `/ship` | เปิดเช็คลิสต์ตรวจความพร้อมก่อนปล่อยยาน โดยใช้ตัวละคร Persona รุมสแกนช่วยคู่ขนาน |

ตัว command แต่ละอันจะเรียกทักษะ (skill) ที่คู่ขนานกันขึ้นมาให้ออโต้เลย — ไม่ต้องลำบากกดยกมือเรียก skill ขึ้นมาเอง

> **Note:** ใช้แค่คำสั่ง `/planning` ห้ามใช้ `/plan` เด็ดขาด — เพราะ `/plan` มันไปขัดแข้งขัดขากับคำสั่งหลักข้างในของตัว Gemini CLI.

## Usage Tips (เคล็ดลับการใช้งาน)

1. **Prefer skills over GEMINI.md (แนะนำให้ใช้ skills มากกว่า GEMINI.md)** — Skills จะเด้งขึ้นมาก็ต่อเมื่อต้องการใช้งานเท่านั้น มันช่วยให้หน้าสมอง(context window) โล่งตา โยน skills เข้าไฟล์ GEMINI.md เฉพาะตัวที่คุณอยากให้โหลดติดตัวไว้ตลอดเวลาก็พอ
2. **Skill descriptions matter (คำอธิบายโคตรสำคัญ)** — หน้า `SKILL.md` ทุกๆ ตัวจะมีช่อง `description` นอนอยู่ในแผงควบคุม (frontmatter) เพื่อคอยกระซิบอธิบายบอก agents ว่าควรจะโผล่หัวมาทำงานตอนไหน. ไอ้พวก descriptions ท้ังหมดใน repo นี้ผ่านการคัดสรรจูนมาอย่างดี เพื่อให้ระบบต่างๆ (Claude Code, Gemini CLI, ฯลฯ) ค้นหามันเจอแบบออโต้ ด้วยการระบุอย่างชัดเจนว่ามันทำอะไร (*what*) และเมื่อไหร่ที่มันสมควรโดนปลุก (*when*)
3. **Use agents for review (ใช้ agents ให้ช่วยรีวิว)** — ลากก๊อปปี้เนื้อหาของ `agents/code-reviewer.md` โยนเข้าไปตอนที่ต้องการให้โค้ดมันโดนรีวิวแบบจัดระเบียบโครงสร้างหนักๆ
4. **Combine with references (ผสมผสานเข้ากับของอ้างอิง)** — ลากการอ้างอิงของพวกข้อมูลเช็คลิสต์ จากหน้าโฟลเดอร์ `references/` ไปใช้ตอนที่กำลังลงพื้นที่หน้างานเฉพาะทางอย่างเรื่อง test หรือเรื่อง performance
