# Agent Skills Repo

นี่คือ **skills package** — ไม่ใช่ application ไม่มีโค้ดที่ต้อง run หรือ build หน้าที่ของ repo คือจัดเก็บและส่งมอบ skills, commands, agents, และ rules สำหรับ AI agents ใน 3 IDEs

## IDEs ที่รองรับ

| IDE | Config directory | Entry point |
|-----|-----------------|-------------|
| Claude Code | `.claude/` | `CLAUDE.md` (ไฟล์นี้) |
| Cursor | `.cursor/` | `.cursor/rules/agent-skills.mdc` |
| Gemini | `.gemini/` | `GEMINI.md` |

## โครงสร้าง `.claude/`

```
.claude/
├── commands/     ← SDLC slash commands (/spec /plan /code-build /test /review /code-simplify /ship)
├── skills/       ← 23 lifecycle skills + commit-push-with-changelog
├── agents/       ← code-reviewer, security-auditor, test-engineer
└── rules/        ← agent-skills.md (orchestration — โหลดทุก session)
```

ดูรายละเอียดใน [`.claude/USAGE.md`](.claude/USAGE.md)

## Authoring conventions

**แก้ไข skill:**
- แก้ที่ `.claude/skills/<name>/SKILL.md` แล้ว sync ไปยัง `.cursor/skills/<name>/SKILL.md` และ `.gemini/skills/<name>/` ด้วย
- ความแตกต่างระหว่าง IDE directories คือ path references เช่น `.claude/skills/` vs `.cursor/skills/`

**เพิ่ม slash command ใหม่:**
- สร้าง `.claude/commands/<name>.md` (flat file, ไม่ต้องมี directory)
- frontmatter: `name` และ `description` — ไม่ต้องใส่ `disable-model-invocation`

**เพิ่ม lifecycle skill ใหม่:**
- สร้าง `.claude/skills/<name>/SKILL.md` พร้อม `name` และ `description` frontmatter
- ถ้ามีไฟล์ประกอบ (checklist, reference) วางไว้ใน directory เดียวกัน

**เพิ่ม/แก้ไข agent:**
- แก้ที่ `.claude/agents/<name>.md` — frontmatter ต้องมี `name` และ `description`
- `tools:` optional — ถ้าไม่ระบุ agent รับ tools ทั้งหมด

## Shared resources

| Path | เนื้อหา |
|------|---------|
| `references/` | Checklists ที่ skills อ้างอิง (testing, security, performance, accessibility) |
| `coding-standard/` | มาตรฐานโค้ดแยกตาม domain (backend, frontend, auth, gateway) |
| `model-matrix.md` | เปรียบเทียบ models สำหรับการเลือกใช้งาน |
