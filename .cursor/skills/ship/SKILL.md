---
name: ship
description: เช็คลิสต์ก่อนการ Launch ผ่านการกระจายงาน (Fan-out) แบบคู่ขนานไปยัง code-reviewer, security-auditor, และ test-engineer แล้วสังเคราะห์ผลเพื่อตัดสินใจ go/no-go เรียกใช้ด้วย /ship ก่อนขึ้น Production
disable-model-invocation: true
---

# /ship — ผู้ดูแลการ Launch (Launch orchestrator)

อ่านและปฏิบัติตาม **`shipping-and-launch`** (`skills/shipping-and-launch/SKILL.md`) อย่างครบถ้วน

`/ship` คือ **Fan-out orchestrator** สั่งให้ Subagents ผู้เชี่ยวชาญทั้งสามทำงานแบบคู่ขนาน (Parallel) เพื่อตรวจสอบความเปลี่ยนแปลงปัจจุบัน จากนั้นนำมารวมกัน (Merge) เป็นการตัดสินใจแบบ go/no-go เดียว พร้อมกับแผน Rollback

## Phase A — การกระจายงานแบบคู่ขนาน (Parallel fan-out)

เรียกใช้ Subagents ทั้งสาม **ใน Turn เดียวกัน** (ผ่าน Task tool calls แบบขนาน):

1. **`code-reviewer`** — ทำการตรวจสอบ (Review) ทั้ง 5 แกนกับการเปลี่ยนแปลงที่อยู่ใน Staged หรือ Recent commits
2. **`security-auditor`** — ตรวจสอบ OWASP, Secrets, Auth/Authz, และ Dependency CVEs
3. **`test-engineer`** — ตรวจหาช่องโหว่ของ Coverage: Happy path, Edge cases, Errors, และ Concurrency

Subagents จะอยู่ใน `.cursor/agents/` ข้อกำหนดของโปรเจกต์ (Project definitions) จะมีความสำคัญมากกว่าค่า Defaults

ข้อจำกัด (Constraints):

- Subagents จะไม่มอบหมายงาน (Delegate) ให้กันเอง — เป็นการ Fan-out แบบทางราบ (Flat) เท่านั้น
- หากไม่สามารถใช้งาน Subagents แบบขนานได้ ให้รัน Persona แต่ละตัวตามลำดับ (Sequentially) โดยยังคงต้องมีขั้นตอน Merge ตามปกติ

**ข้ามการ Fan-out ได้ต่อเมื่อเข้าเงื่อนไขทั้งหมดนี้เท่านั้น:** มีไฟล์ที่มีการเปลี่ยนแปลง ≤2 ไฟล์, Diff &lt;50 บรรทัด, และไม่มีเรื่อง Auth/Payments/Data-access/Config-env หากไม่เป็นไปตามนี้ ให้ใช้ Fan-out เป็นค่าเริ่มต้น (Default)

## Phase B — การรวมผลลัพธ์ (Merge (main agent))

1. **คุณภาพของโค้ด (Code quality)** — รวบรวม Critical/Important จาก code-reviewer + Tests/Lint/Build ที่ไม่ผ่าน
2. **ความปลอดภัย (Security)** — ยกระดับสิ่งที่ security-auditor พบในระดับ Critical/High ให้เป็น Blockers
3. **ประสิทธิภาพ (Performance)** — จากแกน Performance ของ code-reviewer; รวมถึง Core Web Vitals (หากมี)
4. **การเข้าถึง (Accessibility)** — คีย์บอร์ด, Screen readers, ความคมชัด (จัดการในขั้นตอนนี้ หรือใช้ `references/accessibility-checklist.md`)
5. **โครงสร้างพื้นฐาน (Infrastructure)** — Env vars, Migrations, Monitoring, Feature flags
6. **เอกสารประกอบ (Documentation)** — README, ADRs, Changelog

## Phase C — การตัดสินใจ (Decision)

```markdown
## การตัดสินใจ Ship: GO | NO-GO

### Blockers (ต้องแก้ไขก่อน Ship)
- [persona: สิ่งที่พบ (finding) + file:line]

### Recommended fixes (ควรแก้ไข)
- [persona: สิ่งที่พบ (finding) + file:line]

### Acknowledged risks (รับทราบความเสี่ยง แต่ดำเนินการ Ship ต่อ)
- [ความเสี่ยง (risk) + วิธีการบรรเทา (mitigation)]

### Rollback plan
- เงื่อนไขที่ทำให้ต้องเริ่ม Rollback (Trigger conditions):
- ขั้นตอนการ Rollback (Rollback procedure):
- เป้าหมายเวลาการฟื้นฟู (Recovery time objective):

### Specialist reports (ฉบับเต็ม)
- [รายงานจาก code-reviewer]
- [รายงานจาก security-auditor]
- [รายงานจาก test-engineer]
```

กฎกติกา (Rules):

1. Personas ใน Phase A จะทำงานขนานกันเมื่อเป็นไปได้
2. ต้องมี Rollback plan ก่อนเสมอ ถึงจะให้ GO ได้
3. หากพบปัญหา Critical → ให้เริ่มต้นด้วย NO-GO ยกเว้นว่าผู้ใช้จะยอมรับความเสี่ยงอย่างชัดเจน


## มาตรฐานการเขียนโค้ดที่เกี่ยวข้อง (Related Coding Standards)
เมื่อดำเนินการด้วย Skill หรือ Role นี้ ต้องปฏิบัติตามมาตรฐานต่อไปนี้อย่างเคร่งครัด:
- `coding-standard/backend/9-operations-and-deployment.md`
- `coding-standard/backend/13-code-quality.md`
- `coding-standard/backend/10-observability-and-logging.md`
