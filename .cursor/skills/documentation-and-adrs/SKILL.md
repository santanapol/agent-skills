---
name: documentation-and-adrs
description: บันทึกการตัดสินใจและการเขียนเอกสารคู่มือ ใช้เมื่อต้องการตัดสินใจทางสถาปัตยกรรม (architectural decisions), การปรับแก้ APIs ภายนอก, ปล่อยของ(shipping features), หรือเมื่อคุณจำเป็นต้องบันทึกบริบทให้วิศวกรในอนาคตและตัว agents ได้ทำความเข้าใจ codebase ของคุณ
---

# Documentation and ADRs

## Overview

บันทึกการตัดสินใจ, ไม่ใช่บันทึกแค่โค้ด เอกสารที่มีค่าที่สุดคือเอกสารที่สามารถอธิบายได้ว่า *ทำไม (why)* — ด้วยการจับเอาบริบท, ข้อจำกัด, และข้อชดเชยแลกเปลี่ยน (trade-offs) ที่นำไปสู่การตัดสินใจนั้นๆ โค้ดมีหน้าที่โชว์ว่า *เราสร้างอะไร (what)*; แต่เอกสารมีหน้าที่อธิบายว่า *ทำไมเราถึงสร้างมาท่านี้* และ *มีทางเลือกไหนบ้างที่เราโยนทิ้งไป* บริบทเหล่านี้เป็นสิ่งสำคัญยิ่งยวดสำหรับมนุษย์ในอนาคตและตัว agents ที่จะต้องเข้ามารับช่วงต่อใน codebase แห่งนี้

## When to Use

- เมื่อมีการตัดสินใจที่ส่งผลกระทบต่อสถาปัตยกรรม (architectural decision) อย่างมีนัยสำคัญ
- เมื่อต้องเลือกวิธีการ ท่ามกลางแนวทางคู่แข่งที่มีมากมาย
- ตอนเพิ่มหรือแก้ไข APIs ภายนอก (public API)
- ตอนนำฟีเจอร์ออกสู่สายตาประชาชน ซึ่งอาจจะไปเปลี่ยนพฤติกรรมการใช้งานหน้าเว็บ
- ตอนที่กำลังบรีฟงาน (onboarding) ทีมงานคนใหม่ (หรือ agents) ให้รู้จักตัวโปรเจกต์
- เมื่อคุณจับได้ว่าตัวเองต้องมานั่งอธิบายเรื่องเดิมๆ ซ้ำแล้วซ้ำเล่า

**เมื่อใดที่ไม่ควรใช้:** อย่าไปเสียเวลาเขียนเอกสารอธิบายโค้ดที่ใครเห็นก็เข้าใจอยู่แล้ว อย่าเขียนคอมเมนต์ที่อธิบายซ้ำกับสิ่งที่ตัวโค้ดทำไปแล้ว อย่าเสียเวลาทำเอกสารให้กับงาน prototype ที่เขียนมาเพื่อทดลองเดี๋ยวก็ลบทิ้ง

## Architecture Decision Records (ADRs - บันทึกการตัดสินใจทางสถาปัตยกรรม)

ADRs ใช้สำหรับบันทึกเหตุผลเบื้องหลังการตัดสินใจเชิงเทคนิคที่มีความสำคัญ นี่คือสุดยอดคัมภีร์เอกสารที่ทรงคุณค่าที่สุดที่คุณควรจะเขียน

### When to Write an ADR (เมื่อไหร่ที่ต้องเขียน ADR)

- เมื่อต้องเลือก framework, library, หรือ major dependency
- เมื่อกำลังร่างหน้าตาตารางเก็บข้อมูล (data model หรือ database schema)
- ตอนเลือกท่าในการทำระบบล็อกอิน (authentication strategy)
- ตอนสถาปนาสถาปัตยกรรม API (REST ปะทะ GraphQL ปะทะ tRPC)
- เมื่อต้องเลือกเครื่องมือ build tools, สถานที่ฝากเซิร์ฟเวอร์, หรือการวางโครงสร้าง infrastructure
- การตัดสินใจหน้าสิ่วหน้าขวานใดๆ ที่หากจะพลิกลิ้นทีหลังต้องจ่ายเงินชดใช้แพงมหาศาล

### ADR Template (ฟอร์มร่าง ADR)

เก็บสะสม ADRs เหล่านี้ไว้ใน `docs/decisions/` โดยรันหมายเลขตัวเลขตามลำดับ:

```markdown
# ADR-001: Use PostgreSQL for primary database (ตกลงใช้ PostgreSQL เป็นฐานข้อมูลหลัก)

## Status (สถานะ)
Accepted (อนุมัติ) | Superseded by ADR-XXX (โดนคว่ำโดย ADR-XXX) | Deprecated (ปลดระวาง)

## Date (วันที่)
2025-01-15

## Context (บริบทความต้องการ)
We need a primary database for the task management application. Key requirements:
เราต้องการฐานข้อมูลหลักสำหรับตัวแอปจัดการงาน ความต้องการที่สำคัญได้แก่:
- Relational data model (users, tasks, teams with relationships) (อยากได้โมเดลข้อมูลที่มีความสัมพันธ์กัน)
- ACID transactions for task state changes (สามารถการันตีการทำธุรกรรม ACID ได้)
- Support for full-text search on task content (รองรับการค้นหาข้อความแบบ full-text)
- Managed hosting available (for small team, limited ops capacity) (มีเจ้าภาพรับฝากโฮสต์ให้)

## Decision (การตัดสินใจ)
Use PostgreSQL with Prisma ORM. (เราขอเลือก PostgreSQL คู่กับ Prisma ORM)

## Alternatives Considered (ทางเลือกอื่นๆ ที่เคยมอง)

### MongoDB
- ข้อดี(Pros): โครงสร้างยืดหยุ่น(Flexible schema), เริ่มต้นง่าย
- ข้อเสีย(Cons): ข้อมูลของเราโดยพื้นฐานแล้วต้องสัมพันธ์กัน; มันจะทำให้เราต้องมาจัดการความสัมพันธ์ด้วยมือเองเหนื่อยเปล่าๆ
- ปัดตก(Rejected): การเอาข้อมูลที่มีความสัมพันธ์กันไปยัดใส่ document store มีแต่จะนำพาความวิบัติ (complex joins) ไม่ก็ต้องก๊อปปี้ข้อมูลซ้ำซ้อน 

### SQLite
- ข้อดี(Pros): ไม่ต้องตั้งค่าปวดหัว(Zero config), ฝังตัวไปได้เลย, อ่านข้อมูลเร็วปรี๊ด
- ข้อเสีย(Cons): ไม่เหมาะกับการเขียนพร้อมๆ กัน (concurrent write) หลายคน, ไม่มีโฮสติ้งมารับรองบน production
- ปัดตก(Rejected): ไม่เหมาะสำหรับทำเว็บแอปพลิเคชันให้คนเยอะๆ รุมใช้

### MySQL
- ข้อดี(Pros): อยู่มายาวนาน, ใครๆ ก็รองรับ
- ข้อเสีย(Cons): ฝั่งของ PostgreSQL ดูจะซัพพอร์ตระบบ JSON ได้ดีกว่า, มี full-text search, และระบบเครื่องมือที่ครอบคลุมกว่า
- ปัดตก(Rejected): PostgreSQL คือเนื้อคู่ที่เหมาะสมที่สุดกับระบบหน้าตาที่เราอยากได้

## Consequences (ผลสืบเนื่องจากการตัดสินใจ)
- Prisma สามารถให้ระบบดึงข้อมูลแบบบังคับ Type และมีระบบช่วยจัดการเวอร์ชันของข้อมูล (migration)
- เราจะได้หยิบเอาตัว PostgreSQL's full-text search มาใช้แทนที่จะต้องไปเสียเงินติด Elasticsearch
- ทีมงานต้องมีความรู้เรื่อง PostgreSQL (ซึ่งเป็นความรู้พื้นฐานอยู่แล้ว, เสี่ยงต่ำ)
- เลือกใช้บริการโฮสติ้งของเจ้า (Supabase, Neon, หรือ RDS)
```

### ADR Lifecycle (วงจรชีวิต ADR)

```
PROPOSED (นำเสนอ) → ACCEPTED (อนุมัติ) → (SUPERSEDED (โดนคว่ำ) หรือ DEPRECATED (โละทิ้ง))
```

- **ห้ามลบ ADRs อันเก่าทิ้งเด็ดขาด.** มันคือบันทึกประวัติศาสตร์บริบท
- ถ้าหากเกิดการเปลี่ยนใจภายหลัง, ให้เขียนร่าง ADR อันใหม่ขึ้นมาอ้างอิง แล้วคว่ำหน้าอันเก่าซะ (supersedes)

## Inline Documentation (คู่มือแทรกตามโค้ด)

### When to Comment (เมื่อไหร่ค่อยคอมเมนต์)

ให้เขียนอธิบายว่า *ทำไม(why)*, อย่าอธิบายว่า *กำลังทำอะไร(what)*:

```typescript
// แย่ (BAD): ไปอธิบายซ้ำซ้อนกับสิ่งที่โค้ดโชว์
// เพิ่มตัวคูณเข้าไป 1 (Increment counter by 1)
counter += 1;

// ดี (GOOD): อธิบายเจตนาที่มองไม่เห็น (non-obvious intent)
// ตัวกันรัว (Rate limit) ใช้ระบบเลื่อนหน้าต่าง(sliding window) — ให้ล้างค่าหน้าต่างเมื่อครบวงรอบ,
// ไม่ใช่ทำล้างค่าเป็นเวลา (fixed schedule), เพื่อป้องกันพวกบอทรัวยิงตรงขอบรอยต่อหน้าต่าง
if (now - windowStart > WINDOW_SIZE_MS) {
  counter = 0;
  windowStart = now;
}
```

### When NOT to Comment (เมื่อไหร่ห้ามคอมเมนต์)

```typescript
// อย่าคอมเมนต์อธิบายโค้ดที่อธิบายตัวมันเองอยู่แล้ว
function calculateTotal(items: CartItem[]): number {
  return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

// อย่าทิ้งรอยมาร์ก TODO คอมเมนต์ไว้ กับเรื่องที่คุณน่าจะจัดการให้มันเสร็จๆไปได้เลย
// TODO: add error handling  ← ก็เติมมันไปเดี๋ยวนี้เลยสิเว้ย

// อย่าทิ้งซากโค้ดที่ถูกคอมเมนต์ปิดการใช้งานไว้ (commented-out code)
// const oldImplementation = () => { ... }  ← ลบทิ้งไปเลย, git มันจำประวัติไว้ให้แล้ว
```

### Document Known Gotchas (บันทึกกับดักที่รู้ๆ กันอยู่)

```typescript
/**
 * ด่วน (IMPORTANT): ฟังก์ชันนี้จะต้องถูกเรียกใช้งานก่อนการเรนเดอร์(render) ครั้งแรกเท่านั้น
 * ถ้าขืนเรียกหลังจากลงกระทะ (hydration), มันจะทำให้หน้าจอเพี้ยนเละเทะวูบวาบ
 * เพราะตัว theme context มันจะยังหาไม่เจอในช่วง SSR.
 *
 * กลับไปดู ADR-003 สำหรับการออกแบบเหตุผลที่แท้จริง
 */
export function initializeTheme(theme: Theme): void {
  // ...
}
```

## API Documentation (คู่มือ API)

สำหรับการเขียน APIs สาธารณะ (REST, GraphQL, หน้าตาของ library):

### Inline with Types (แทรกไปกับ Types - แนะนำสำหรับ TypeScript)

```typescript
/**
 * สร้าง task ชิ้นใหม่.
 *
 * @param input - ข้อมูลในการสร้าง task (บังคับกรอกหัวข้อ title, ส่วน description ปล่อยว่างได้)
 * @returns ค่าของตัว task พร้อมด้วย ID จากเซิร์ฟเวอร์ และเวลาที่ถูกสร้าง
 * @throws {ValidationError} จะพ่นเออเร่อถ้าหัวข้อ title ปล่อยโล่ง หรือมีความยาวเกิน 200 ตัวอักษร
 * @throws {AuthenticationError} จะพ่นเออเร่อถ้าผู้ใช้งานยังไม่ยืนยันตัวตน (unauthenticated)
 *
 * @example
 * const task = await createTask({ title: 'Buy groceries' });
 * console.log(task.id); // "task_abc123"
 */
export async function createTask(input: CreateTaskInput): Promise<Task> {
  // ...
}
```

### OpenAPI / Swagger for REST APIs

```yaml
paths:
  /api/tasks:
    post:
      summary: Create a task
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/CreateTaskInput'
      responses:
        '201':
          description: Task created
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Task'
        '422':
          description: Validation error
```

## README Structure (โครงสร้าง README)

ทุกโปรเจกต์คู่ควรกับการมี README ครอบคลุมเรื่องดังนี้:

```markdown
# Project Name

อธิบายสรรพคุณแบบหนึ่งย่อหน้า ว่าโปรเจกต์นี้เสกมาทำไม.

## Quick Start (เริ่มด่วน)
1. โคลนมันลงมา (Clone the repo)
2. ติดตั้งของ (Install dependencies): `npm install`
3. เตรียมสภาพแวดล้อม (Set up environment): `cp .env.example .env`
4. ปลุกมันขึ้นมา (Run the dev server): `npm run dev`

## Commands (คำสั่ง)
| Command | Description |
|---------|-------------|
| `npm run dev` | สตาร์ตโหมดพัฒนา (Start development server) |
| `npm test` | รันตัวทดสอบ (Run tests) |
| `npm run build` | ห่อของเตรียมขาย (Production build) |
| `npm run lint` | สั่งลูกน้องกวาดขยะ (Run linter) |

## Architecture (สถาปัตยกรรม)
สรุปสั้นๆ ให้เห็นโครงสร้างและเหตุผลการตัดสินใจ 
แปะลิงก์ ADRs ให้ตามไปเผือกเอาเอง

## Contributing (การเข้ามามีส่วนร่วม)
ทำอย่างไรถึงจะช่วยคอนทริบิวต์ได้, มาตรฐานที่ยึดถือ(coding standards), ขั้นตอนการรับ PR.
```

## Changelog Maintenance (การดูแลสมุดพก Changelog)

สำหรับฟีเจอร์ที่ปล่อยของไปแล้ว:

```markdown
# Changelog

## [1.2.0] - 2025-01-20
### Added (สิ่งที่งอกเพิ่มมา)
- หน้าต่างแชร์ (Task sharing): users can share tasks with team members (#123)
- แจ้งเตือนเมล (Email notifications): สำหรับการมอบหมายงาน (#124)

### Fixed (สิ่งที่ซ่อมเสร็จ)
- แก้อาการ task ซ้ำๆ เวลาใครไปรัวปุ่มกดคลิกสร้างรัวๆ (#125)

### Changed (สิ่งที่ถูกปรับแต่ง)
- หน้าลิสต์ task ปรับใหม่ให้ดึงมาโชว์ทีละ 50 รายการ (จากเดิม 20) เพื่อ UX ที่ดีกว่า (#126)
```

## Documentation for Agents (คู่มือสำหรับ Agents)

การพิจารณาพิเศษสำหรับบริบทของ AI agent:

- **ไฟล์ CLAUDE.md / rules files** — ทำบันทึกข้อตกลงร่วมกันของโปรเจกต์ เพื่อให้ agents ทำตามธรรมเนียม
- **ไฟล์ Specs** — พยายามอัปเดต specs ให้เป็นปัจจุบันเสมอ เพื่อให้ agents เสกงานออกมาได้ถูกทาง
- **ADRs** — ช่วยเล่าให้ agents ฟังว่าทำไมอดีตเราถึงทำมาแบบนี้ (ป้องกันการเถียงเรื่องเดิมซ้ำๆ)
- **Inline gotchas** — วางกับดักป้องกันไม่ให้ agents เดินลงหลุมที่เรารู้ๆ กันอยู่

## Common Rationalizations (ข้ออ้างทั่วไป)

| ข้ออ้าง | ความเป็นจริง |
|---|---|
| "โค้ดมันอธิบายตัวเองอยู่แล้วแหละ" | โค้ดบอกแค่ว่าเอ็งกำลังทำอะไร (what). มันไม่ได้บอกว่าทำไม (why), ทางเลือกอื่นที่คุณโยนทิ้งไปคืออะไร, หรือคุณเจอข้อจำกัดแบบไหนมา. |
| "รอให้ API มันนิ่งก่อนค่อยมาปั่นคู่มือละกัน" | APIs จะนิ่งไวกว่าถ้าคุณเริ่มเขียนสเปกให้มัน การร่างคู่มือคือบททดสอบแรกของการเริ่มต้นดีไซน์เลยล่ะ. |
| "ใครเค้ามานั่งอ่านคู่มือกันวะ" | ตัว Agents ไง. รวมไปถึงเหล่าวิศวกรในอนาคต. และก็อีตัวคุณเองนั่นแหละอีก 3 เดือนข้างหน้า. |
| "การเขียน ADRs มันคืองานงอก" | เสียเวลา 10 นาทีเขียน ADR ช่วยตัดปัญหาต้องมานั่งโต้วาทีเถียงเรื่องเดิมๆ 2 ชั่วโมง ในอีก 6 เดือนข้างหน้า. |
| "คอมเมนต์ชอบหลุดไม่อัปเดตตามกาลเวลา" | ถ้าคอมเมนต์ว่า *ทำไม(why)* มันไม่ค่อยล้าหลังหรอก. ไอ้ที่เก่าไวคือคอมเมนต์ที่มัวแต่อธิบายว่า *ทำอะไร(what)* ต่างหาก — นี่แหละเหตุผลที่เราสนับสนุนให้เขียนอย่างแรกแทน. |

## Red Flags (สัญญาณเตือนภัย)

- มีการตัดสินใจใหญ่ระดับสถาปัตยกรรม แต่ไม่มีเศษกระดาษโน้ตเขียนเหตุผลเก็บไว้เลย
- ปล่อย Public APIs ออกสู่สาธารณะโดยไม่มีคู่มือหรือ types แปะไว้
- README หน้าแรกดันไม่บอกว่าต้องรันโปรเจกต์ยังไง
- โค้ดที่โดนทิ้งร้าง (Commented-out code) กลับไม่โดนลบทิ้ง แต่ยังแอบหมกซ่อนอยู่
- ทิ้งซากคอมเมนต์ TODO ไว้ข้ามเดือนข้ามปี
- โปรเจกต์ที่มีโครงสร้างซับซ้อนใหญ่โต แต่ไม่มี ADRs ติดตัวสักใบ
- เอกสารคู่มือที่มัวแต่ก๊อปปี้เอาโค้ดมาอธิบายซ้ำ แทนที่จะบอกเจตนาที่ซ่อนอยู่

## Verification

หลังจากการทำเอกสารสิ้นสุดลง:

- [ ] ทุกๆ การตัดสินใจครั้งใหญ่ด้านสถาปัตยกรรม มี ADRs ประกบอยู่ครบถ้วน
- [ ] ไฟล์ README ครอบคลุมเรื่อง quick start, commands, และ ภาพรวมสถาปัตยกรรม
- [ ] ฟังก์ชันใน API ต้องมีรายละเอียด(documentation) อธิบาย พารามิเตอร์และผลลัพธ์(return type) แนบไว้เสมอ
- [ ] กับดัก(gotchas) หรือทริกต่างๆ ถูกโน้ต(documented inline) ตามบรรทัดที่มีนัยสำคัญ
- [ ] ไม่มีเศษซากการกดสแลชปิดโค้ด (commented-out code) หลงเหลือ
- [ ] ตัวคู่มือบัญญัติ (CLAUDE.md ฯลฯ) ยังคงทันสมัยและแม่นยำ


## Related Coding Standards
When performing this skill or role, strictly adhere to the following standards:
- `coding-standard/backend/7-openapi-contract.md`
- `coding-standard/backend/1-tech-stack.md`
