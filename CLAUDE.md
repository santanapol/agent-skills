# Agent Skills — Project Instructions

Repository นี้เป็นแหล่งรวบรวมทักษะระดับ Production engineering **ห้ามด้นสด (Do not improvise workflows)** หากมีทักษะ (skill) ที่ตรงกับงานอยู่แล้ว — ให้อ่านไฟล์ `SKILL.md` ของทักษะนั้นและปฏิบัติตามอย่างเคร่งครัด

## SDLC Flow

```
/spec → /plan → /build → /test → /review → /code-simplify → /ship
```

| Command | ใช้เมื่อ (When to use) |
|---------|-------------|
| `/spec` | ฟีเจอร์ใหม่หรือมีการเปลี่ยนแปลง — ให้เขียน SPEC.md ก่อนเสมอ |
| `/plan` | มี Spec อยู่แล้ว — นำมาแตกเป็น tasks |
| `/build` | ลงมือทำ (Execute) task ในแผนงานถัดไปทีละขั้นตอน |
| `/test` | ทำ TDD หรือเพื่อพิสูจน์ (Prove-It) บั๊ก |
| `/review` | ก่อนการ merge |
| `/code-simplify` | โค้ดทำงานได้แต่อ่านทำความเข้าใจยาก |
| `/ship` | เตรียม Launch ขึ้น Production — ทำการรีวิวแบบคู่ขนาน (parallel review) + ตัดสินใจ go/no-go |

## Intent → Skill Mapping

- คำสั่งคลุมเครือ (Vague ask) → `interview-me` หรือ `idea-refine`
- ฟีเจอร์ใหม่ (New feature) → `spec-driven-development` → `planning-and-task-breakdown` → `incremental-implementation` + `test-driven-development`
- บั๊ก / พฤติกรรมที่ไม่คาดคิด (Bug / unexpected behavior) → `debugging-and-error-recovery`
- ตรวจทานโค้ด (Code review) → `code-review-and-quality`
- ปรับโครงสร้างให้อ่านง่าย (Refactor for clarity) → `code-simplification`
- ออกแบบ API (API design) → `api-and-interface-design`
- งานหน้าบ้าน (UI work) → `frontend-ui-engineering`
- เริ่มต้นเซสชัน (Session start) / ควรใช้ skill ไหนดี? → `using-agent-skills`

## Subagents (`.claude/agents/`)

- `code-reviewer` — ตรวจสอบ 5 แกนหลักก่อนทำการ merge
- `security-auditor` — ตรวจสอบ OWASP, secrets, auth
- `test-engineer` — วิเคราะห์ Coverage, พิสูจน์บั๊ก (Prove-It)

Agents จะไม่เรียกใช้ agents ตัวอื่น; มีเพียงผู้ใช้ (user) หรือคำสั่ง `/ship` เท่านั้นที่จะเป็นผู้ควบคุมสั่งการ (orchestrates)

## Skill References

Lifecycle skills: `.cursor/skills/<name>/SKILL.md`
Checklists: `references/`

## มาตรฐานการเขียนโค้ดที่เกี่ยวข้อง (Related Coding Standards)

เมื่อปฏิบัติงานในทักษะ (skill) หรือบทบาท (role) ใดๆ ให้ปฏิบัติตามมาตรฐานต่อไปนี้อย่างเคร่งครัด:
- `coding-standard/backend/1-tech-stack.md`
- `coding-standard/backend/2-folder-structure.md`
