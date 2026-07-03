# Plans folder

เก็บ plan files สำหรับฟีเจอร์ใหม่หลัง bootstrap — ใช้ร่วมกับ [WORKFLOW.md](../WORKFLOW.md)

## Naming

```
plans/YYYY-MM-DD-<feature-slug>.md
```

Examples:

- `plans/2026-07-15-department-filter.md`
- `plans/2026-08-01-internal-webhook.md`

## Plan file template

```markdown
# Plan: <feature name>

## Objective
<one paragraph>

## Spec changes
- business-domain.md: §X
- openapi.yaml: <operationId>

## Tasks
1. ...
2. ...

## Risks
- ...
```

## Rules

- Plan ไม่แทน `*-spec.md` — spec ยังเป็น SoT
- ฟีเจอร์เล็ก (แก้บรรทัดเดียว) ไม่ต้องสร้าง plan file
- หลัง implement เสร็จ — ลบหรือ archive plan ตามทีม convention
