# {{SERVICE_TITLE}} Service — Spec-Driven Workflow

Entry point: [{{service}}-spec.md](./{{service}}-spec.md)

## Gated workflow

```
SPECIFY → PLAN → TASKS → IMPLEMENT
```

ห้ามข้ามไป IMPLEMENT จนกว่า spec ที่เกี่ยวข้องจะอัปเดตและ review แล้ว

## เมื่อไหร่ต้องแก้ spec ก่อน code

| การเปลี่ยนแปลง | แก้ไฟล์ |
|----------------|---------|
| Business rule, RBAC, lifecycle | `business-domain.md` (this folder) |
| HTTP contract (path, body, status) | `{{PACKAGE_PATH}}/openapi.yaml`{{#if HAS_GATEWAY_OPENAPI}}, `openapi-via-gateway.yaml`{{/if}} |
| Error codes | `{{PACKAGE_PATH}}/codes.yaml`, `error-codes.js` |
| Schema / indexes | `database-erd.md` (this folder), `{{PACKAGE_PATH}}/scripts/init-db.mjs` |
| Acceptance criteria | `{{service}}-spec.md` (AC table) in this folder |
| ฟีเจอร์ใหม่หลายขั้น | plan file ใน `plans/` |

## last-verified policy

- อัปเดต `last-verified` ใน [{{service}}-spec.md](./{{service}}-spec.md) frontmatter ทุกครั้งที่ merge PR ที่แตะ business logic, OpenAPI, หรือ acceptance criteria
- Quarterly audit (ทุก 3 เดือน) ถ้าไม่มี PR — owner รัน `npm run ci` และตรวจ drift กับ docs

## PR checklist

- [ ] อัปเดต spec ที่เกี่ยวข้อง (business-domain / openapi / {{service}}-spec AC)
- [ ] เปลี่ยน OpenAPI ถ้า API behavior เปลี่ยน (`npm run spec:lint`)
- [ ] เพิ่มหรืออัปเดต tests ที่ map กับ AC
- [ ] `npm run ci` ผ่านใน `{{PACKAGE_PATH}}`
- [ ] อัปเดต `last-verified` ใน {{service}}-spec frontmatter (ถ้าแตะ business/API)

## Task template

```markdown
- [ ] Task: <description>
  - Acceptance: <measurable outcome — reference AC-XX if applicable>
  - Verify: <command or manual step>
  - Files: <likely paths>
```

## Plan file template

เก็บที่ `plans/YYYY-MM-DD-<feature>.md` — ดู [plans/README.md](./plans/README.md)

## Related

- [{{service}}-spec.md](./{{service}}-spec.md) — central spec
- Skill: `spec-driven-development` (repo `.cursor/skills/`)
- Bootstrap: `backend-service-spec-bootstrap` (`/spec-bootstrap-backend`)
