---
name: api-and-interface-design
description: คู่มือแนวทางการออกแบบ API และ Interface ให้เสถียร ใช้เมื่อต้องการออกแบบ APIs, กำหนดขอบเขตเชื่อมต่อโมดูล (module boundaries), หรือการสร้าง public interface ทุกรูปแบบ ใช้เมื่อสร้าง REST หรือ GraphQL endpoints, หรือตอนกำหนดรูปแบบข้อตกลงชนิดข้อมูล (type contracts) ระหว่างหน้าบ้านกับหลังบ้าน (frontend และ backend)
---

# API and Interface Design

## Overview

จงออกแบบอินเทอร์เฟซ (Interfaces) ให้มีเอกสารกำกับอย่างดี มีความเสถียร และยากที่คนจะนำไปใช้งานผิดวิธี อินเทอร์เฟซที่ดีจะช่วยให้ผู้ใช้ทำสิ่งที่ถูกต้องได้ง่ายดาย และขัดขวางไม่ให้ทำในสิ่งที่ผิด กฎนี้ใช้ได้กับการออกแบบ REST APIs, โครงสร้าง GraphQL schemas, ขอบเขตการทำงานร่วมกันของแต่ละโมดูล (module boundaries), โครงสร้าง props ของคอมโพเนนต์, รวมไปถึงทุกๆ พื้นที่ที่มีการใช้โค้ดชุดหนึ่งไปสั่งการให้โค้ดอีกชุดทำงาน

## When to Use

- ตอนออกแบบ API endpoints ตัวใหม่
- กำหนดขอบเขตเชื่อมต่อระหว่างโมดูล (module boundaries) หรือข้อตกลงในการส่งมอบงานระหว่างทีม
- สร้างอินเทอร์เฟซ props ให้กับคอมโพเนนต์
- วางโครงสร้างสคีมาฐานข้อมูล (database schema) ซึ่งจะส่งผลไปถึงรูปร่างของ API 
- เมื่อต้องแก้ไขอินเทอร์เฟซสาธารณะเดิม (public interfaces) ที่มีอยู่แล้ว

## Core Principles (หลักการพื้นฐาน)

### Hyrum's Law (กฎของไฮรัม)

> เมื่อจำนวนผู้ใช้งาน API มีมากพอ พฤติกรรมทั้งหมดที่สามารถสังเกตเห็นได้จากระบบของคุณ จะมีผู้ใช้งานบางคนยึดเป็นหลักพึ่งพาเสมอ ไม่ว่าคุณจะแอบสัญญาไว้ในข้อตกลง (contract) หรือไม่ก็ตาม

นั่นหมายความว่า: ทุกๆ พฤติกรรมที่เปิดเผยสู่สาธารณะ — ไม่ว่าจะเป็นบั๊กที่ไม่ได้บันทึกไว้ในคู่มือ, ข้อความของ error, จังหวะเวลา (timing), และลำดับการทำงาน (ordering) — จะกลายร่างเป็น "ข้อตกลงทางพฤตินัย (de facto contract)" ไปในทันทีที่มีผู้ใช้มายึดโยงพึ่งพามัน สิ่งที่ส่งผลกระทบต่อการออกแบบคือ:

- **จงตั้งใจกับสิ่งที่คุณจะเปิดเผย (expose).** เพราะทุกพฤติกรรมที่คนนอกเห็นได้ คือสิ่งที่คุณอาจจะต้องรับผิดชอบตามมา
- **อย่าทำความลับของระบบรั่วไหล (leak implementation details).** ถ้าผู้ใช้มองเห็นมันได้ พวกเขาก็จะมายึดโยงเอาไปใช้
- **วางแผนเผื่อวันที่จะต้องเลิกใช้งาน (deprecation) ไว้ตั้งแต่ตอนออกแบบ.** ดูที่ `deprecation-and-migration` สำหรับวิธีการลบบางสิ่งที่ผู้ใช้งานยังพึ่งพาอยู่ออกอย่างปลอดภัย
- **แค่การเขียน Test มันไม่พอหรอก.** แม้คุณจะมี contract tests ที่สมบูรณ์แบบ กฎของ Hyrum บอกไว้ว่า การแก้ไขระบบแบบ "ปลอดภัย (safe)" ก็สามารถทำให้ระบบของผู้ใช้พังทลายได้ หากพวกเขาดันแอบไปผูกโยงกับพฤติกรรมที่คุณไม่ได้ระบุไว้ในคู่มือ

### The One-Version Rule (กฎ 1 เวอร์ชัน)

อย่าบังคับให้ผู้บริโภค(consumers)ต้องมานั่งเลือกว่าจะใช้เวอร์ชันไหนของชุด API หรือส่วนเสริม (dependency) ตัวเดียวกัน ปัญหาที่เรียกว่า 'Diamond dependency' จะเกิดขึ้นเมื่อผู้บริโภคหลายคนต้องการใช้เวอร์ชันที่แตกต่างกันของสิ่งเดียวกัน จงออกแบบโลกให้มีแค่เวอร์ชันเดียวที่มีอยู่ ณ ช่วงเวลานั้น — ใช้วิธีต่อยอดส่วนขยายออกไป (extend) แทนที่จะแยกทางแยกใหม่ (fork)

### 1. Contract First (ข้อตกลงต้องมาก่อน)

กำหนดอินเทอร์เฟซให้ชัดเจนก่อนที่จะไปนั่งปั่นโค้ดทำงาน ตัวข้อตกลง (contract) ก็คือสเปก — ส่วนการเขียนโค้ดคือส่วนที่ตามมาทีหลัง

```typescript
// กำหนดข้อตกลง(contract) ก่อนเป็นอันดับแรก
interface TaskAPI {
  // สร้างงาน(task) และส่งคืนข้อมูลงานที่สร้างสำเร็จพร้อมฟิลด์ที่ถูกสร้างมาจากฝั่งเซิร์ฟเวอร์
  createTask(input: CreateTaskInput): Promise<Task>;

  // ส่งคืนรายการงานที่แบ่งหน้า (paginated) ตามตัวกรอง (filters) ที่ระบุ
  listTasks(params: ListTasksParams): Promise<PaginatedResult<Task>>;

  // ส่งคืนงาน 1 รายการ หรือโยน NotFoundError กรณีหาไม่เจอ
  getTask(id: string): Promise<Task>;

  // อัปเดตบางส่วน (Partial update) — เปลี่ยนแปลงเฉพาะฟิลด์ที่ส่งเข้ามา
  updateTask(id: string, input: UpdateTaskInput): Promise<Task>;

  // ลบแบบไม่ซ้ำซ้อน (Idempotent delete) — ส่งผลสำเร็จออกมาต่อให้ข้อมูลจะถูกลบไปแล้วก็ตาม
  deleteTask(id: string): Promise<void>;
}
```

### 2. Consistent Error Semantics (รูปแบบ Error ต้องสม่ำเสมอเป็นมาตรฐาน)

เลือกวิธีกำหนด Error มาสัก 1 รูปแบบ แล้วใช้มันให้เหมือนกันทั้งระบบ:

```typescript
// REST: ใช้ HTTP status codes + โครงสร้าง error body 
// การตอบกลับ Error ทุกอันต้องมีหน้าตาโครงสร้างแบบเดียวกันหมด
interface APIError {
  error: {
    code: string;        // ภาษาคอมพิวเตอร์อ่าน: "VALIDATION_ERROR"
    message: string;     // ภาษามนุษย์อ่าน: "Email is required"
    details?: unknown;   // ข้อมูลแวดล้อมเพิ่มเติม เผื่อมีประโยชน์ (ใส่หรือไม่ใส่ก็ได้)
  };
}

// แผนผัง Status code 
// 400 → ฝั่งลูกค้ายิงข้อมูลมาผิด
// 401 → ยังไม่ได้เข้าสู่ระบบ (Not authenticated)
// 403 → เข้าสู่ระบบแล้ว แต่ไม่มีสิทธิ์ (Not authorized)
// 404 → หาของชิ้นนั้นไม่เจอ (Resource not found)
// 409 → ข้อมูลขัดแย้ง (เช่น ข้อมูลซ้ำ, หรือเวอร์ชันไม่ตรงกัน)
// 422 → ข้อมูลผิดรูปแบบ (Validation failed - เช่นอีเมลผิด)
// 500 → เซิร์ฟเวอร์พังเอง (ห้ามเปิดเผยข้อมูลระบบภายในออกไปเด็ดขาด)
```

**ห้ามผสมรูปแบบมั่วซั่ว (Don't mix patterns).** ถ้า endpoint บางตัวใช้วิธี throw, ในขณะที่อีกตัวส่งค่ากลับเป็น `null`, แถมอีกตัวส่งมาเป็น `{ error }` — ผู้บริโภคก็จะไม่สามารถคาดเดาพฤติกรรมระบบของคุณได้เลย

### 3. Validate at Boundaries (ตรวจสอบความถูกต้องที่หน้าด่าน)

ไว้ใจโค้ดภายในของคุณ แต่จงตรวจค้นอย่างเข้มงวดที่ชายแดน (หน้าด่าน) จุดที่ข้อมูลจากภายนอกพยายามจะเข้ามา:

```typescript
// ตรวจสอบข้อมูล(Validate) ณ พรมแดนของ API
app.post('/api/tasks', async (req, res) => {
  const result = CreateTaskSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(422).json({
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Invalid task data',
        details: result.error.flatten(),
      },
    });
  }

  // หลังจากผ่านเครื่องตรวจมาแล้ว, โค้ดที่อยู่ลึกเข้าไปสามารถไว้ใจ(trust)ชนิดข้อมูลนี้ได้เลย
  const task = await taskService.create(result.data);
  return res.status(201).json(task);
});
```

จุดที่ควรมีระบบตรวจข้อมูล (validation) ประจำอยู่:
- API route handlers (ข้อมูลจากผู้ใช้)
- Form submission handlers (ข้อมูลจากผู้ใช้)
- ระบบแปลก้อนข้อมูล(parsing)ที่ดึงมาจาก Service ภายนอก (Third-party data -- **ต้องมองว่ามันเป็นตัวอันตรายที่ไม่น่าไว้ใจเสมอ**)
- ระบบโหลดตัวแปรตั้งค่า Environment (configuration)

> **การตอบกลับของ Third-party API ถือเป็นข้อมูลที่ไม่น่าเชื่อถือ (untrusted data).** จงตรวจสอบรูปร่างและเนื้อหาของพวกมันก่อนที่จะจับมันไปคำนวณในตรรกะ, เอาขึ้นไปวาดแสดงผลบนจอ(rendering), หรือใช้ประกอบการตัดสินใจ Service จากภายนอกที่ถูกแฮกหรือทำงานผิดพลาด สามารถส่งของแปลกๆ กลับมาได้ เช่น ข้อมูลผิดชนิด, ข้อความมุ่งร้าย (malicious content), หรือข้อความคำสั่งสั่งการซ่อนอยู่

จุดที่ไม่สมควรมีระบบตรวจข้อมูล (validation):
- ระหว่างฟังก์ชันภายใน (internal functions) ที่มีการทำสัญญากำหนดชนิดข้อมูล (type contracts) ชัดเจนไว้แล้ว
- ในฟังก์ชันของเครื่องมือช่วยเหลือ (utility functions) ที่ถูกเรียกใช้งานมาจากโค้ดที่ผ่านด่านตรวจสอบมาแล้วอีกที
- ข้อมูลที่เพิ่งดึงออกมาสดๆ จากฐานข้อมูลของระบบคุณเอง

### 4. Prefer Addition Over Modification (เน้นเพิ่มของใหม่ ดีกว่าแก้ของเก่า)

ขยายข้อจำกัดของอินเทอร์เฟซ โดยต้องไม่ทำให้ระบบของผู้ใช้รายเดิมพัง:

```typescript
// ดี (Good): เพิ่มฟิลด์แบบมีก็ได้ไม่มีก็ได้ (optional) ลงไป
interface CreateTaskInput {
  title: string;
  description?: string;
  priority?: 'low' | 'medium' | 'high';  // เพิ่มเข้ามาทีหลัง, เป็น optional
  labels?: string[];                       // เพิ่มเข้ามาทีหลัง, เป็น optional
}

// แย่ (Bad): เปลี่ยนชนิดข้อมูลของตัวแปรเก่าทิ้งซะงั้น หรืออยู่ดีๆ ก็ลบมันทิ้ง
interface CreateTaskInput {
  title: string;
  // description: string;  // ลบทิ้งไปเฉย — ทำให้คนที่เคยใช้ฟิลด์นี้พังยับเยิน
  priority: number;         // เปลี่ยนชนิดข้อมูลจาก string มาเป็น number — ทำให้คนที่เคยใช้พังยับเยิน
}
```

### 5. Predictable Naming (การตั้งชื่อให้คาดเดาง่าย)

| รูปแบบ | หลักการตั้งชื่อ | ตัวอย่าง |
|---------|-----------|---------|
| REST endpoints | นามพหูพจน์ (เติม s), ไม่มีคำกริยา | `GET /api/tasks`, `POST /api/tasks` |
| Query params | ตัวพิมพ์เล็กผสมใหญ่ (camelCase) | `?sortBy=createdAt&pageSize=20` |
| Response fields | ตัวพิมพ์เล็กผสมใหญ่ (camelCase) | `{ createdAt, updatedAt, taskId }` |
| Boolean fields | เติม is/has/can นำหน้า | `isComplete`, `hasAttachments` |
| Enum values | ตัวพิมพ์ใหญ่ล้วนคั่นด้วยขีดล่าง (UPPER_SNAKE) | `"IN_PROGRESS"`, `"COMPLETED"` |

## REST API Patterns (รูปแบบ REST API)

### Resource Design (การออกแบบแหล่งข้อมูล)

```
GET    /api/tasks              → ดึงรายชื่อ tasks ทั้งหมด (ใช้ query params ในการช่วยกรอง)
POST   /api/tasks              → สร้าง task ขึ้นมา 1 ตัว
GET    /api/tasks/:id          → ดึงข้อมูล task แค่ 1 ตัว
PATCH  /api/tasks/:id          → อัปเดตข้อมูล task (อัปเดตเฉพาะบางส่วน - partial)
DELETE /api/tasks/:id          → ลบ task

GET    /api/tasks/:id/comments → ดึงรายชื่อความเห็น (comments) ของ task นั้นๆ (ข้อมูลลูก - sub-resource)
POST   /api/tasks/:id/comments → เพิ่ม comment เข้าไปใน task นั้นๆ
```

### Pagination (การทำระบบแบ่งหน้า)

แบ่งหน้าให้กับ endpoint ที่มีการลิสต์ข้อมูล:

```typescript
// ฝั่งขอ (Request)
GET /api/tasks?page=1&pageSize=20&sortBy=createdAt&sortOrder=desc

// ฝั่งตอบรับ (Response)
{
  "data": [...],
  "pagination": {
    "page": 1,
    "pageSize": 20,
    "totalItems": 142,
    "totalPages": 8
  }
}
```

### Filtering (การทำตัวกรอง)

ใช้ query parameters เพื่อทำฟิลเตอร์:

```
GET /api/tasks?status=in_progress&assignee=user123&createdAfter=2025-01-01
```

### Partial Updates (PATCH) (การอัปเดตเฉพาะบางส่วน)

ยอมรับอ็อบเจกต์ที่มีแค่เสี้ยวเดียว — ให้ไปอัปเดตข้อมูลเฉพาะที่ถูกส่งมาให้เท่านั้น:

```typescript
// อัปเดตแค่ชื่อ title นอกนั้นคงไว้เหมือนเดิม
PATCH /api/tasks/123
{ "title": "Updated title" }
```

## TypeScript Interface Patterns (รูปแบบการใช้อินเทอร์เฟซใน TypeScript)

### Use Discriminated Unions for Variants (แยกความแตกต่างของข้อมูลด้วยตัวแปรกลาง)

```typescript
// ดี (Good): การแบ่งแยกแต่ละแบบ มีความชัดเจนมากๆ
type TaskStatus =
  | { type: 'pending' }
  | { type: 'in_progress'; assignee: string; startedAt: Date }
  | { type: 'completed'; completedAt: Date; completedBy: string }
  | { type: 'cancelled'; reason: string; cancelledAt: Date };

// คนใช้ก็จะสามารถระบุเจาะจงประเภท (type narrowing) ได้เลย
function getStatusLabel(status: TaskStatus): string {
  switch (status.type) {
    case 'pending': return 'Pending';
    case 'in_progress': return `In progress (${status.assignee})`;
    case 'completed': return `Done on ${status.completedAt}`;
    case 'cancelled': return `Cancelled: ${status.reason}`;
  }
}
```

### Input/Output Separation (แบ่งแยกข้อมูลเข้า/ออก)

```typescript
// Input: สิ่งที่คนส่ง ส่งข้อมูลมา
interface CreateTaskInput {
  title: string;
  description?: string;
}

// Output: สิ่งที่ระบบพ่นคืนกลับไปให้ (รวมฟิลด์พิเศษที่เซิร์ฟเวอร์เป็นคนปั้นมาให้ด้วย)
interface Task {
  id: string;
  title: string;
  description: string | null;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
}
```

### Use Branded Types for IDs (ประทับตรายี่ห้อ (Branded) ให้กับประเภทข้อมูล)

```typescript
type TaskId = string & { readonly __brand: 'TaskId' };
type UserId = string & { readonly __brand: 'UserId' };

// ช่วยป้องกันความเอ๋อเผลอส่ง UserId เข้ามา ทั้งๆ ที่ช่องนี้มันต้องการ TaskId
function getTask(id: TaskId): Promise<Task> { ... }
```

## Common Rationalizations (ข้ออ้างทั่วไป)

| ข้ออ้าง | ความเป็นจริง |
|---|---|
| "เดี๋ยวเราค่อยไปทำคู่มือ API (document) วันหลังละกัน" | ชนิดตัวแปร(Types) นั่นแหละ 'คือ' คู่มือ. จงประกาศมันเป็นอันดับแรก |
| "ตอนนี้เรายังไม่ต้องทำระบบแบ่งหน้า(pagination)หรอก" | คุณได้ใช้แน่ ทันทีที่ข้อมูลทะลุ 100 รายการ ใส่ระบบนี้เผื่อไว้ตั้งแต่วันแรกเลย |
| "PATCH มันดูทำยากไป, งั้นใช้แค่ PUT ก็พอละกัน" | PUT บังคับให้ต้องส่งข้อมูลชุดเต็มมาให้ทุกๆ ครั้ง แต่ PATCH นี่แหละคือสิ่งที่ฝั่งลูกค้าร้องขอจริงๆ |
| "เดี๋ยวเราค่อยทำระบบแตกเวอร์ชัน (version API) วันหลังตอนที่มันจำเป็น" | การแก้โค้ดที่ทำให้ของเก่าพัง โดยที่ไม่ได้ทำระบบแบ่งเวอร์ชันไว้ มันจะไปทำลายระบบของผู้ใช้คนอื่นๆ ทิ้งหมด จงออกแบบเพื่อการขยายระบบตั้งแต่วันแรก |
| "ไม่มีใครมาใช้พฤติกรรมที่เราไม่ได้ระบุในคู่มือหรอก" | Hyrum's Law ชี้แจงไว้: ถ้าพฤติกรรมมันโชว์ให้เห็นได้, ย่อมต้องมีใครสักคนพึ่งพามัน. ให้ระลึกเสมอว่าพฤติกรรมสาธารณะทุกอย่าง คือสัญญาระหว่างเรากับผู้ใช้ |
| "เราก็แค่เลี้ยงดูมันพร้อมกันสองเวอร์ชันไปเลยก็ได้" | การมีเวอร์ชันเยอะๆ จะทำให้ค่าใช้จ่ายในการซ่อมบำรุงแพงทวีคูณ และก่อให้เกิดปัญหา Diamond dependency จงเชื่อในกฎ One-Version |
| "API ภายใน(Internal)ใช้กันเอง ไม่ต้องมีข้อตกลงหรอก" | ผู้ใช้ภายใน(Internal) ก็ถือว่าเป็นผู้ใช้เหมือนกันนะ ข้อตกลงจะช่วยป้องกันไม่ให้ระบบผูกติดกันเป็นตังเม (coupling) และช่วยให้ทำงานคู่ขนานกันไปได้ |

## Red Flags (สัญญาณเตือนภัย)

- Endpoints ที่ส่งคืนหน้าตาข้อมูลไม่เหมือนกัน โดยขึ้นอยู่กับเงื่อนไขบางอย่าง
- รูปแบบข้อมูล Error ไม่สม่ำเสมอ แตกต่างกันไปในแต่ละ Endpoints
- ระบบตรวจสอบข้อมูล (Validation) กระจัดกระจายไปทั่วโค้ดภายใน แทนที่จะมาทำหน้าที่แค่เฉพาะที่พรมแดนหน้าด่าน (boundaries)
- มีการเปลี่ยนแปลงฟิลด์เดิมในชนิดที่ทำให้ของเก่าพัง (เปลี่ยน Types, ลบตัวแปรเก่าทิ้ง)
- Endpoints ที่เป็นประเภทลิสต์รายชื่อ แต่ดันไม่มีระบบแบ่งหน้า (pagination)
- มีคำกริยา โผล่มาใน URLs ของ REST API (`/api/createTask`, `/api/getUsers`)
- นำข้อมูลตอบกลับของ Third-party API มาใช้งานโดยไม่ได้กรอง (validation) หรือทำความสะอาด (sanitization) ก่อน

## Verification

หลังจากออกแบบ API:

- [ ] ทุกๆ endpoint มีการระบุ Types โครงสร้างสคีมาของ Input และ Output เรียบร้อยแล้ว
- [ ] ผลตอบกลับกรณี Error (Error responses) เป็นแพทเทิร์นเดียวกันหมดทั่วระบบ
- [ ] ระบบตรวจสอบข้อมูล (Validation) ทำงานเฉพาะจุดที่ขอบเขตพรมแดนระบบ (system boundaries) เท่านั้น
- [ ] Endpoints ประเภทลิตส์รายการ รองรับการใช้งานระบบแบ่งหน้า (pagination)
- [ ] ฟิลด์ใหม่ๆ ที่จะเพิ่มเข้ามา ต้องเป็นแบบ Additive (พอกพูน) และ Optional (ไม่ต้องมีก็ได้) (เพื่อคงสภาพความเข้ากันได้ย้อนหลัง backward compatible)
- [ ] การตั้งชื่อในทุกๆ Endpoints ใช้มาตรฐานเดียวกันหมด
- [ ] มีการทำ Commit เอกสารคู่มือ API หรือ Types ไปควบคู่กับการเปลี่ยนแปลงโค้ด
