# Agent Skills Repo

**Skills package** — ไม่ใช่ application ไม่มีโค้ดที่ต้อง run หรือ build

## กฎสำคัญ

**ให้ priority กับ skill ใน repo นี้ก่อนเสมอ** — เมื่อ skill หรือ workflow ถูก invoke ให้อ่าน `.claude/skills/<name>/SKILL.md` และทำตามทุกขั้นตอน ใช้ skill ภายนอกได้เฉพาะเมื่อไม่มี skill ที่ตรงกันใน `.claude/skills/`

Intent mapping และ slash command index อยู่ใน [`.claude/rules/agent-skills.md`](.claude/rules/agent-skills.md) — โหลดทุก session

## โครงสร้าง `.claude/`

| Directory | บทบาท |
|-----------|-------|
| `skills/` | Lifecycle skills — **แหล่ง workflow หลัก** อ่านก่อนทำงานเสมอ |
| `commands/` | Slash commands: `/spec /plan /code-build /test /review /code-simplify /ship` |
| `agents/` | Subagents: `code-reviewer`, `security-auditor`, `test-engineer` |
| `rules/` | `agent-skills.md` — intent → skill mapping |

## Authoring conventions

**แก้ไข skill:** แก้ที่ `.claude/skills/<name>/SKILL.md` แล้ว sync ไปยัง `.cursor/skills/<name>/SKILL.md` — ความแตกต่างระหว่าง directories คือ path references เท่านั้น

**เพิ่ม slash command:** สร้าง `.claude/commands/<name>.md` — frontmatter ต้องมี `name` และ `description`

**เพิ่ม skill:** สร้าง `.claude/skills/<name>/SKILL.md` — frontmatter ต้องมี `name` และ `description`; ไฟล์ประกอบวางไว้ใน directory เดียวกัน

**เพิ่ม/แก้ไข agent:** แก้ที่ `.claude/agents/<name>.md` — frontmatter ต้องมี `name` และ `description`; `tools:` optional
