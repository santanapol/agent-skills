# AGENTS.md

ไฟล์นี้ให้คำแนะนำสำหรับ AI coding agents (Claude Code, Cursor, Copilot, Antigravity ฯลฯ) ในการทำงานกับโค้ดใน Repository นี้

## Repository Overview

คลังรวบรวมทักษะ (skills) สำหรับ Claude.ai และ Claude Code เพื่อให้เป็น Senior Software Engineers. Skills คือคำสั่ง (instructions) และสคริปต์ (scripts) ที่ถูกแพ็กเกจไว้เพื่อขยายขีดความสามารถของ Claude และ coding agents ของคุณ

## OpenCode Integration

OpenCode ใช้ **โมเดลการรันงานที่ขับเคลื่อนด้วยทักษะ (skill-driven execution model)** ซึ่งทำงานผ่านเครื่องมือ `skill` และโฟลเดอร์ `/skills` ใน Repository นี้

### Core Rules (กฎหลัก)

- ถ้างายตรงกับ skill ใดๆ, คุณ **ต้อง (MUST)** เรียกใช้ skill นั้น
- Skills ถูกเก็บไว้ในโฟลเดอร์ `skills/<skill-name>/SKILL.md`
- ห้ามทำงาน (implement) โดยตรง ถ้ามี skill ที่เกี่ยวข้อง
- ทำตามคำสั่งใน skill อย่างเคร่งครัดเสมอ (ห้ามทำแค่บางส่วน)

### Intent → Skill Mapping (การจับคู่เจตนากับทักษะ)

Agent ควรจับคู่เจตนา (intent) ของผู้ใช้เข้ากับ skill โดยอัตโนมัติ:

- Feature / ฟังก์ชันการทำงานใหม่ → `spec-driven-development`, จากนั้น `incremental-implementation`, `test-driven-development`
- Planning / การวางแผนแตกย่อยงาน → `planning-and-task-breakdown`
- Bug / พัง / การทำงานที่ไม่คาดคิด → `debugging-and-error-recovery`
- Code review → `code-review-and-quality`
- Refactoring / ทำให้โค้ดเรียบง่ายขึ้น → `code-simplification`
- API หรือ การออกแบบ interface → `api-and-interface-design`
- งาน UI → `frontend-ui-engineering`

### Lifecycle Mapping (Implicit Commands)

OpenCode ไม่รองรับคำสั่งแบบ slash commands อย่าง `/spec` หรือ `/plan`.

Agent จะต้องปฏิบัติตาม Lifecycle นี้เป็นการภายในแทน:

- DEFINE → `spec-driven-development`
- PLAN → `planning-and-task-breakdown`
- BUILD → `incremental-implementation` + `test-driven-development`
- VERIFY → `debugging-and-error-recovery`
- REVIEW → `code-review-and-quality`
- SHIP → `shipping-and-launch`

### Execution Model (โมเดลการทำงาน)

ในทุกๆ Request:

1. ประเมินว่ามี skill ใดเกี่ยวข้องไหม (แม้โอกาสจะแค่ 1% ก็ตาม)
2. เรียกใช้ skill ที่เหมาะสมผ่านเครื่องมือ `skill`
3. ทำตามกระบวนการ (workflow) ของ skill อย่างเคร่งครัด
4. เริ่มลงมือทำโค้ด (implementation) ก็ต่อเมื่อทำขั้นตอนพื้นฐาน (spec, plan ฯลฯ) เสร็จสิ้นแล้วเท่านั้น

### Anti-Rationalization (ข้อห้ามในการหาข้ออ้าง)

ข้ออ้างต่อไปนี้เป็นสิ่งที่ไม่ถูกต้อง และต้องถูกเพิกเฉย:

- "งานนี้มันเล็กเกินกว่าจะใช้ skill นะ"
- "ฉันแป๊บเดียวแก้สดๆ เลยก็ได้"
- "ฉันขอรวบรวมบริบทก่อนละกัน"

พฤติกรรมที่ถูกต้อง:

- ตรวจสอบและใช้ skills เป็นอันดับแรกเสมอ

สิ่งนี้ช่วยให้ OpenCode มีพฤติกรรมการทำงานบังคับ workflow เต็มรูปแบบคล้ายกับ Claude Code

## Orchestration: Personas, Skills, and Commands

Repository นี้มี 3 เลเยอร์ที่สามารถประกอบเข้าด้วยกัน ซึ่งทำหน้าที่แตกต่างกันและไม่ควรสับสน:

- **Skills** (`skills/<name>/SKILL.md`) — workflow ที่มีเป็นขั้นเป็นตอนและมีเงื่อนไขหยุดการทำงาน เป็นส่วน *how (ทำอย่างไร)* เป็นการกระโดดภาคบังคับเมื่อ intent ตรงกัน
- **Personas** (`agents/<role>.md`) — บทบาทที่มีมุมมองเฉพาะและรูปแบบผลลัพธ์ เป็นส่วน *who (ใครทำ)*
- **Slash commands** (`.claude/commands/*.md`) — จุดเริ่มต้นฝั่งผู้ใช้งาน เป็นส่วน *when (ทำเมื่อไหร่)* ทำหน้าที่เป็น orchestration layer (เลเยอร์ตัวสั่งการ)

กฎการประกอบร่าง: **ผู้ใช้ (หรือ slash command) คือผู้สั่งการ (orchestrator). Personas จะไม่ไปเรียกใช้งาน Personas ตัวอื่น.** แต่ Persona สามารถเรียกใช้ skills ได้

แพทเทิร์นการสั่งการแบบหลาย Persona แบบเดียวที่ repo นี้ยอมรับคือ **parallel fan-out with a merge step (กระจายขนานแล้วค่อยรวมผลลัพธ์)** — ซึ่งถูกใช้โดย `/ship` ในการรัน `code-reviewer`, `security-auditor`, และ `test-engineer` พร้อมๆ กันแล้วนำรายงานมาสังเคราะห์รวมกัน ห้ามสร้าง Persona ที่ทำหน้าที่ "router (ตัวส่งทาง)" ที่มีหน้าที่ตัดสินใจว่าจะเรียกใช้ Persona ตัวไหน; นั่นเป็นหน้าที่ของ slash commands และระบบ intent mapping

ดู [agents/README.md](agents/README.md) สำหรับตารางตัดสินใจ และ [references/orchestration-patterns.md](references/orchestration-patterns.md) สำหรับแคตตาล็อกรูปแบบเต็ม

**Claude Code interop:** personas ในโฟลเดอร์ `agents/` ทำงานเสมือนเป็น Claude Code subagents (ที่ถูกค้นพบโดยอัตโนมัติจากโฟลเดอร์ `agents/` ของปลั๊กอินนี้) และเป็นทีมของ Agent Teams (อ้างอิงจากชื่อเวลาเรียก) ข้อจำกัดแพลตฟอร์ม 2 ข้อที่สอดคล้องกับกฎของเราคือ: subagents ไม่สามารถเสกสร้าง subagents ย่อยๆ ได้, และ teams ไม่สามารถซ้อนทับกันได้ Plugin agents จะมองข้ามฟิลด์ frontmatter `hooks`, `mcpServers`, และ `permissionMode` ไปเงียบๆ

## Creating a New Skill (การสร้าง Skill ใหม่)

### Directory Structure (โครงสร้างโฟลเดอร์)

```
skills/
  {skill-name}/           # ชื่อโฟลเดอร์แบบ kebab-case
    SKILL.md              # จำเป็นต้องมี: การนิยาม skill
    scripts/              # จำเป็นต้องมี: สคริปต์ที่สั่งรันได้
      {script-name}.sh    # Bash scripts (ควรใช้รูปแบบนี้)
  {skill-name}.zip        # จำเป็นต้องมี: ไฟล์ zip สำหรับจ่ายแจก
```

### Naming Conventions (กฎการตั้งชื่อ)

- **Skill directory**: ตัวพิมพ์เล็กคั่นด้วยขีดลาง `kebab-case` (เช่น `web-quality`)
- **SKILL.md**: ตัวพิมพ์ใหญ่ล้วนเสมอ, และต้องชื่อนี้เป๊ะๆ
- **Scripts**: `kebab-case.sh` (เช่น `deploy.sh`, `fetch-logs.sh`)
- **Zip file**: ต้องชื่อตรงกับโฟลเดอร์เป๊ะๆ: `{skill-name}.zip`

### SKILL.md Format

```markdown
---
name: {skill-name}
description: {ประโยค 1 ประโยคอธิบายว่า skill ทำอะไร, ตามด้วยเงื่อนไข "ใช้เมื่อ (Use when)" หนึ่งข้อขึ้นไป รวมวลีเรียกชี้เป้าอย่าง "Deploy my app" หรือ "Check logs" ถ้ามันมีประโยชน์}
---

# {ชื่อ Skill Title}

{ภาพรวมคร่าวๆ ว่า skill นี้ทำอะไรและทำไมมันถึงสำคัญ}

## How It Works

{ลิสต์ลำดับตัวเลข อธิบาย workflow ของ skill}

หัวข้อที่เทียบเท่าอย่างเช่น `Workflow`, `Core Process`, หรือ `When to Use` สามารถใช้แทนได้ หากมันสื่อสารโครงสร้างได้ชัดเจน

## Usage (Optional)

รวมหัวข้อนี้เฉพาะเมื่อ skill นั้นมีสคริปต์ช่วยเหลือรันได้ภายใต้โฟลเดอร์ `scripts/`. ถ้าเป็น skill ที่มีแค่ข้อความ Markdown ล้วน ให้ข้ามหัวข้อนี้และไม่ตัองมีโฟลเดอร์ได้เลย

```bash
bash /mnt/skills/user/{skill-name}/scripts/{script}.sh [args]
```

**Arguments:**
- `arg1` - Description (defaults to X)

**Examples:**
{แสดงตัวอย่างการใช้งานสัก 2-3 แบบ}

## Output

{แสดงตัวอย่าง Output ที่ผู้ใช้จะเห็น}

## Present Results to User

{Template ว่า Claude ควรจะจัดรูปแบบผลลัพธ์ยังไงเวลาโชว์ให้ผู้ใช้เห็น}

## Troubleshooting

{ปัญหาที่พบบ่อยและวิธีแก้, โดยเฉพาะพวกปัญหาเครือข่าย/การขอสิทธิ์ (permissions)}
```

### Best Practices for Context Efficiency

Skills จะถูกโหลดขึ้นมาเมื่อต้องการใช้เท่านั้น (on-demand) — จะมีแค่ชื่อ skill และคำอธิบาย (description) เท่านั้นที่จะถูกโหลดตอนเริ่มต้น ส่วนเนื้อหา `SKILL.md` ทั้งหมดจะถูกโหลดเข้าไปในบริบทก็ต่อเมื่อ agent ตัดสินใจว่า skill นั้นเกี่ยวข้องจริงๆ เพื่อลดการกิน context:

- **ควบคุม `SKILL.md` ให้อยู่ใต้ 500 บรรทัด** — เอาข้อมูลอ้างอิงลึกๆ ไปใส่ไฟล์แยกต่างหาก
- **เขียนคำอธิบายให้เจาะจง** — ช่วยให้ agent รู้ว่าควรจะเปิดใช้งาน skill ตอนไหนเป๊ะๆ
- **เปิดเผยข้อมูลทีละระดับ (Use progressive disclosure)** — ให้โยงลิงก์อ้างอิงไฟล์อื่นๆ ที่จะถูกอ่านก็ต่อเมื่อจำเป็นจริงๆ เท่านั้น
- **เน้นใช้สคริปต์ (scripts) มากกว่าฝังโค้ด (inline code)** — การรันสคริปต์ไม่กิน context (จะกินแค่ตอนรอผลลัพธ์ output เท่านั้น)
- **การอ้างอิงไฟล์ทำงานได้แค่ 1 ระดับ** — คือลิงก์ตรงจาก SKILL.md ไปยังไฟล์ประกอบ (supporting files)

### Script Requirements

- ใช้ shebang `#!/bin/bash`
- ใช้ `set -e` เพื่อพฤติกรรมให้หยุดการทำงานทันทีถ้าเกิดพัง (fail-fast)
- เขียนข้อความแจ้งสถานะส่งไปที่ stderr: `echo "Message" >&2`
- เขียนผลลัพธ์ที่ให้เครื่องอ่าน (JSON) ส่งไปที่ stdout
- ต้องมีคำสั่ง trap เก็บกวาดลบไฟล์ temp ขยะทิ้งเสมอ
- อ้างอิงพาธของสคริปต์ (script path) ในรูปแบบ `/mnt/skills/user/{skill-name}/scripts/{script}.sh`

### Creating the Zip Package

หลังจากสร้าง หรือแก้ไขอัปเดต skill:

```bash
cd skills
zip -r {skill-name}.zip {skill-name}/
```

### End-User Installation

ระบุวิธีการติดตั้ง 2 รูปแบบนี้สำหรับให้ผู้ใช้งาน:

**Claude Code:**
```bash
cp -r skills/{skill-name} ~/.claude/skills/
```

**claude.ai:**
เพิ่ม skill นั้นลงใน project knowledge หรือวางเนื้อหาของ SKILL.md แปะลงมาในหน้าต่างสนทนาเลย.

ถ้า skill ต้องต่ออินเทอร์เน็ต, ให้บอกผู้ใช้เข้าไปเพิ่มโดเมนที่ต้องการได้ที่ `claude.ai/settings/capabilities`.
