# Spec Bootstrap — Common Phases

Shared workflow phases for backend (and future frontend) spec bootstrap skills.

## Phase sequence

```
LOCATE → CLASSIFY → DISCOVER → REVERSE_ENGINEER → GAP_ANALYSIS
    → DOMAIN_INTERVIEW → MERGE → RESTATE & CONFIRM
    → HARDEN → CI → VERIFY
```

## Human gates (mandatory)

| Gate | When | Blocker if skipped |
|------|------|-------------------|
| **G0 — Package root** | Before DISCOVER | อ่านผิด repo / ไม่มี `src/` |
| **G1 — Drift review** | After DISCOVER (full source scan + extraction matrix), before bulk edits | Wrong SoT; drift เงียบใน validator/collection/shared/audit/env |
| **G2 — Domain interview** | After GAP_ANALYSIS, confidence < threshold | Invented business rules |
| **G3 — RESTATE confirm** | Before HARDEN | `implemented` without owner approval |
| **G4 — Sign-off** | After CI + link/consistency check | Spec marked done with broken links or DRIFT ค้าง |

## Confidence thresholds

| Level | Action |
|-------|--------|
| ≥ 85% | May proceed; note source labels |
| 70–84% | Ask user in next interview round |
| < 70% | Blocking — must get `USER_CONFIRMED` |

## Evidence labels

| Label | Meaning |
|-------|---------|
| `OBSERVED` | Directly from code or tests |
| `DOCUMENTED` | From legacy docs merged in |
| `INFERRED` | Agent inference — needs confirmation |
| `USER_CONFIRMED` | User answered in domain interview |

## RESTATE template

```markdown
นี่คือสิ่งที่เราจะ harden สำหรับ <service>:

- Outcome: spec พร้อม spec-driven ที่ docs/specs/backend/<service>/
- Owner: ...
- Consumers: ...
- Drift resolutions: ...
- Out of scope: ...
- Open Questions (non-blocking): ...

ใช่ / ไม่ใช่ / มีอะไรที่อยู่ปรับ?
```

Valid confirmation: explicit **ใช่** — not "แล้วแต่คุณ", "ฟังดูดี", or silence.

## Status lifecycle

```
(none) → reverse-engineered → implemented
                  ↑                  │
                  └──── re-audit ─────┘   (drift found → downgrade → gate → re-harden)
```

Never skip `reverse-engineered` when content was generated from code without full interview.

**Re-audit (spec ที่ `implemented` แล้ว):** พบ drift → **downgrade เป็น `reverse-engineered`** ก่อน แล้ววิ่ง DISCOVER (extraction matrix grep-driven) → อัปเดต/สร้าง `plans/confidence-map.md` → resolve ทุก DRIFT + `spec:consistency` ผ่าน → re-harden กลับ `implemented` — **ห้าม** patch ทีละ drift แบบ ad-hoc โดยคง `implemented` ไว้ (spec จะโฆษณาว่าเชื่อถือได้ทั้งที่ยังมี drift)

## What bootstrap does NOT do

- Trust legacy `*-spec.md` without verifying against full `src/` read
- Skip any `src/**/*.js` file without documenting why
- Read routes only — leave validator/collection/shared-role/audit/env drift unpropagated to spec sections
- Move legacy docs to central folder without relabel/reconcile against code
- Sync a shared constant (role list, password minLength) only to listed targets — must grep it everywhere it appears (incl. `design-*.md`, ADR, prose)
- Rely on `spec:lint`/`spec:codes`/`spec:roles` alone for consistency — they cover machine-readable only; prose/links need `spec:consistency` (automated, in `npm run ci`)
- Patch an `implemented` spec drift-by-drift without downgrading + re-running the gate (re-audit lifecycle)
- Mark `implemented` without `plans/confidence-map.md`, with unresolved DRIFT, or with broken cross-doc links
- Rewrite application code or API behavior
- Replace `spec-driven-development` for new features
- Commit without user request
- Invent acceptance criteria without test evidence
