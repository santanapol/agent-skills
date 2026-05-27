# Cursor Agent Skills

ชุด **Agent Skills** สำหรับ [Cursor](https://cursor.com) — Workflow วิศวกรรมแบบ SDLC พร้อม slash commands, lifecycle skills และ subagents สำหรับรีวิวก่อน merge / ship

เปิด repo นี้ใน Cursor แล้วใช้งานได้ทันที — การตั้งค่าอยู่ใน `.cursor/`

---

## เริ่มใช้

1. Clone หรือเปิด workspace นี้ใน Cursor
2. **Settings → Rules** — ตรวจว่า skills ปรากฏใต้ **Agent Decides**
3. ใน Agent chat พิมพ์ `/` แล้วเลือกคำสั่ง เช่น `/spec`, `/plan`, `/build`, `/review`, `/ship`
4. คู่มือทีมเต็ม: [.cursor/USAGE.md](.cursor/USAGE.md)

---

## โครงสร้างใน repo

| Path | บทบาท |
|------|--------|
| [`.cursor/skills/`](.cursor/skills/) | Skills ที่ Cursor ค้นพบ — 23 lifecycle + 7 slash commands |
| [`.cursor/rules/`](.cursor/rules/) | กฎ orchestration (`agent-skills.mdc`) — intent → skill |
| [`.cursor/agents/`](.cursor/agents/) | Subagents: `code-reviewer`, `security-auditor`, `test-engineer` |
| [`references/`](references/) | Checklists ที่ skills อ้างอิงเมื่อจำเป็น |

```
cursor-skill/
├── .cursor/
│   ├── skills/          # SKILL.md ทุกตัว + wrappers /spec … /ship
│   ├── agents/          # 3 subagents
│   ├── rules/           # agent-skills.mdc (always apply)
│   ├── README.md
│   └── USAGE.md
└── references/          # testing, security, performance, accessibility
```

---

## SDLC — Slash commands

คำสั่งหลักเชื่อมกับ lifecycle การพัฒนา — เรียกด้วย `/` ใน Agent chat (ไม่โหลดทุก message โดยอัตโนมัติ)

```
/spec → /plan → /build → /test → /review → /code-simplify → /ship
```

| Command | ใช้เมื่อ | Skill ที่เกี่ยวข้อง |
|---------|----------|-------------------|
| `/spec` | ฟีเจอร์หรือการเปลี่ยนแปลงใหม่ — เขียน spec ก่อนโค้ด | spec-driven-development |
| `/plan` | มี spec แล้ว — แตกเป็น tasks | planning-and-task-breakdown |
| `/build` | ลงมือ implement ทีละส่วน | incremental-implementation + test-driven-development |
| `/test` | TDD หรือพิสูจน์ว่า behavior ถูกต้อง | test-driven-development |
| `/review` | ก่อน merge | code-review-and-quality |
| `/code-simplify` | โค้ดรันได้แต่อ่านยาก | code-simplification |
| `/ship` | พร้อมขึ้น production — รีวิวขนาน + go/no-go | shipping-and-launch + subagents |

ดัชนี slash commands: [.cursor/skills/README.md](.cursor/skills/README.md)

---

## Lifecycle skills

นอกจาก 7 slash commands ยังมี skills ตาม phase ที่ Agent อาจเลือกอัตโนมัติจาก intent (ดู [`.cursor/rules/agent-skills.mdc`](.cursor/rules/agent-skills.mdc))

| Phase | Skills |
|-------|--------|
| **Meta** | using-agent-skills |
| **Define** | interview-me, idea-refine, spec-driven-development |
| **Plan** | planning-and-task-breakdown |
| **Build** | incremental-implementation, test-driven-development, context-engineering, source-driven-development, doubt-driven-development, frontend-ui-engineering, api-and-interface-design |
| **Verify** | browser-testing-with-devtools, debugging-and-error-recovery |
| **Review** | code-review-and-quality, code-simplification, security-and-hardening, performance-optimization |
| **Ship** | git-workflow-and-versioning, ci-cd-and-automation, deprecation-and-migration, documentation-and-adrs, shipping-and-launch |

**เรียก skill โดยตรง:** พิมพ์ `/` แล้วค้นชื่อ เช่น `/debugging-and-error-recovery` หรือบอก Agent ว่า "Follow the test-driven-development skill"

---

## Intent → skill (อัตโนมัติ)

Rule [`agent-skills.mdc`](.cursor/rules/agent-skills.mdc) ช่วย map งานที่คุณขอไปยัง skill ที่เหมาะสม:

| สถานการณ์ | Skill |
|-----------|--------|
| คำขอคลุมเครือ | interview-me, idea-refine |
| ฟีเจอร์ใหม่ | spec-driven-development → planning-and-task-breakdown → incremental-implementation + test-driven-development |
| Bug / พฤติกรรมผิดปกติ | debugging-and-error-recovery |
| Code review | code-review-and-quality |
| Refactor ให้อ่านง่าย | code-simplification |
| ออกแบบ API | api-and-interface-design |
| งาน UI | frontend-ui-engineering |
| ไม่แน่ใจว่าใช้ skill ไหน | using-agent-skills |

เมื่อมี skill ที่ตรงงาน — Agent **ต้อง** อ่าน `SKILL.md` แล้วทำตาม workflow ครบ ไม่ improvise แทน

---

## Subagents

| Subagent | ใช้เมื่อ |
|----------|---------|
| `code-reviewer` | รีวิว 5 แกนก่อน merge |
| `security-auditor` | OWASP, secrets, auth |
| `test-engineer` | coverage, Prove-It |

- **เรียกตรง:** "Use the security-auditor subagent on `auth.ts`"
- **ผ่าน `/ship`:** รันทั้งสามแบบขนาน แล้วรวมรายงาน

Persona หนึ่งไม่เรียก persona อื่น — มีแค่คุณหรือ `/ship` ที่ orchestrate

---

## Checklists

| ไฟล์ | หัวข้อ |
|------|--------|
| [testing-patterns.md](references/testing-patterns.md) | โครงสร้าง test, mocking, anti-patterns |
| [security-checklist.md](references/security-checklist.md) | Auth, input validation, OWASP |
| [performance-checklist.md](references/performance-checklist.md) | Core Web Vitals, profiling |
| [accessibility-checklist.md](references/accessibility-checklist.md) | WCAG, keyboard, ARIA |

โหลดเมื่อ skill หรืองานต้องการ — ไม่ต้องใส่ใน rules ทั้งชุด

---

## แก้ไข skills

แก้ที่ `.cursor/skills/<name>/SKILL.md` แล้ว reload Cursor (หรือเปิด chat ใหม่) เพื่อให้ discovery อัปเดต

Slash wrappers (`spec/`, `plan/`, `build/` ฯลฯ) ชี้ไป lifecycle skill หลัก — ดู mapping ใน [.cursor/skills/README.md](.cursor/skills/README.md)

---

## นำไปใช้ใน project อื่น

```bash
# คัดลอก skill ที่ต้องการ
cp -r /path/to/cursor-skill/.cursor/skills/test-driven-development  your-project/.cursor/skills/

# คัดลอก subagent
cp /path/to/cursor-skill/.cursor/agents/code-reviewer.md your-project/.cursor/agents/

# คัดลอก rule orchestration (ถ้าต้องการ intent mapping เต็มชุด)
cp /path/to/cursor-skill/.cursor/rules/agent-skills.mdc your-project/.cursor/rules/
```

หรือ **Cursor Settings → Rules → Add Rule → Remote Rule (GitHub)** ชี้มาที่ repo นี้

---

## เอกสารเพิ่มเติม

| เอกสาร | เนื้อหา |
|--------|---------|
| [.cursor/USAGE.md](.cursor/USAGE.md) | SDLC flow, context discipline, การ verify การติดตั้ง |
| [.cursor/README.md](.cursor/README.md) | ภาพรวม layout ของ `.cursor/` |
| [.cursor/skills/README.md](.cursor/skills/README.md) | ดัชนี slash commands + lifecycle skills |
