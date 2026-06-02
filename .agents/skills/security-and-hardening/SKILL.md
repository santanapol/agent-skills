---
name: security-and-hardening
description: เสริมความแข็งแกร่งให้โค้ดต่อต้านช่องโหว่ ใช้เมื่อต้องรับมือกับข้อมูลนำเข้าจากผู้ใช้, ระบบการล็อกอินยืนยันตัวตน, ระบบการจัดเก็บข้อมูล, หรือการเชื่อมต่อกับระบบภายนอกต่างๆ ใช้เมื่อต้องการสร้างฟีเจอร์ทุกรูปแบบที่เปิดรับข้อมูลที่ดูไม่น่าไว้ใจ, การจัดการผู้ใช้ในระบบ(sessions), หรือตอนที่จะสื่อสารกับ services แหล่งที่สาม (third-party)
---

# Security and Hardening

## Overview

หลักปฏิบัติในการพัฒนาแบบเน้นความปลอดภัยเป็นอันดับแรกสำหรับเว็บแอปพลิเคชัน (Security-first) จงมองว่าทุกๆ ข้อมูลที่รับมาจากภายนอกคือภัยคุกคาม, จงมองว่าความลับทุกอย่างคือสิ่งศักดิ์สิทธิ์ที่ห้ามรั่วไหล, และมองว่าทุกการตรวจสิทธิ์ (authorization) คือเรื่องคอขาดบาดตายที่ห้ามข้าม ความปลอดภัยไม่ใช่ "ช่วงเวลา" — แต่มันคือ "ข้อบังคับ" สำหรับการเขียนโค้ดทุกๆ บรรทัดที่มีความเกี่ยวข้องกับข้อมูลผู้ใช้, ระบบล็อกอิน (authentication), หรือเมื่อระบบของคุณต้องไปเชื่อมต่อกับระบบอื่น

## When to Use

- เมื่อพัฒนาอะไรก็ตามที่เปิดรับ input ของผู้ใช้
- เมื่อทำระบบล็อกอิน (authentication) หรือระบบจัดสิทธิ์ (authorization)
- ตอนจัดเก็บ หรือ ส่งข้อมูลที่ละเอียดอ่อน (sensitive data)
- ตอนทำการเชื่อมต่อกับ APIs หรือ services ภายนอก
- ตอนเพิ่มฟีเจอร์อัปโหลดไฟล์, webhooks, หรือระบบ callbacks
- เมื่อต้องยุ่งเกี่ยวกับข้อมูลการชำระเงิน หรือข้อมูลส่วนบุคคล (PII data)

## The Three-Tier Boundary System (ระบบเขตแดนสามชั้น)

### Always Do (No Exceptions) (ต้องทำเสมอ ห้ามมีข้อยกเว้น)

- **ต้องตรวจสอบข้อมูลที่มาจากภายนอกทุกครั้ง (Validate)** ณ จุดพรมแดนระบบ (เช่น API routes, ด่านฟอร์ม handlers)
- **การคิวรีฐานข้อมูลต้องเป็น Parameterize เสมอ** — ห้ามเอาข้อความ (string) ที่มาจาก input ของผู้ใช้มาจับต่อกันลงไปในคิวรี SQL เด็ดขาด
- **ต้องเข้ารหัสข้อความก่อนแสดงผลหน้าจอ (Encode output)** เพื่อป้องกันหลอกรันสคริปต์ (XSS) (ให้พึ่งพาระบบเข้ารหัสอัตโนมัติ(auto-escaping)ของ framework, อย่าไปแอบปิดการใช้งานมัน)
- **ใช้ HTTPS เสมอ** กับทุกการสื่อสารที่ออกสู่ภายนอก
- **ต้อง Hash รหัสผ่าน** ด้วย bcrypt/scrypt/argon2 (ห้ามเก็บรหัสผ่านเป็นข้อความธรรมดา - plaintext - ในฐานข้อมูลเด็ดขาด)
- **กำหนด security headers ให้ครบ** (เช่น CSP, HSTS, X-Frame-Options, X-Content-Type-Options)
- **เปิดใช้ httpOnly, secure, sameSite กับคุกกี้ (cookies)** เพื่อดูแลเซสชันการล็อกอิน
- **สั่งรัน `npm audit`** (หรือตัวเช็คของภาษาอื่นๆ) ก่อนทำการขึ้นระบบใหม่(release) ทุกครั้ง

### Ask First (Requires Human Approval) (ถามก่อนเสมอ จำเป็นต้องให้มนุษย์อนุมัติ)

- เพิ่มเส้นทางการล็อกอินใหม่ๆ (authentication flows) หรือเปลี่ยนตรรกะระบบล็อกอิน 
- จัดเก็บข้อมูลที่มีความอ่อนไหวเป็นพิเศษแบบใหม่ (PII, ข้อมูลการจ่ายเงิน)
- กำลังจะเชื่อมต่อกับระบบ service ตัวใหม่จากภายนอก
- การดัดแปลงระบบสิทธิ์ CORS (Cross-Origin Resource Sharing)
- การเพิ่มระบบจัดการการอัปโหลดไฟล์ (file upload handlers)
- การเปลี่ยนแปลงความเข้มงวดการจำกัดความเร็ว หรือจำนวนครั้ง (rate limiting หรือ throttling)
- จะทำการยกระดับเพิ่มสิทธิ์ หรือให้บทบาทพิเศษ (elevated permissions/roles) แก่บัญชีใดๆ

### Never Do (ห้ามทำเด็ดขาด)

- **ห้ามบันทึกความลับใดๆ (commit secrets)** ลงไปในระบบจัดเก็บเวอร์ชัน(version control) เป็นอันขาด (พวก API keys, รหัสผ่าน, tokens)
- **ห้ามบันทึกล็อก(log) ข้อมูลที่มีความอ่อนไหว** (รหัสผ่าน, tokens, เลขบัตรเครดิตฉบับเต็ม)
- **ห้ามไว้ใจระบบตรวจความถูกต้องฝั่งหน้าบ้าน (client-side validation)** ว่าเป็นด่านความปลอดภัยสุดท้าย
- **ห้ามปิด security headers** เพียงเพราะรู้สึกว่ามันกวนใจ
- **ห้ามใช้คำสั่ง `eval()` หรือ `innerHTML`** ร่วมกับข้อมูลที่ป้อนมาจากผู้ใช้เด็ดขาด
- **ห้ามจัดเก็บตัวเซสชัน ไว้ในที่ที่หน้าบ้านสามารถล้วงแคะได้** (เช่น แอบเก็บ auth tokens ใน localStorage)
- **ห้ามเปิดเผยบันทึกข้อมูลการพัง (stack traces)** หรือรายละเอียดการพังที่อยู่เบื้องลึกหลังบ้านให้ผู้ใช้ทั่วไปเห็น

## OWASP Top 10 Prevention (การป้องกัน OWASP 10 อันดับยอดฮิต)

### 1. Injection (การหลอกฝังคำสั่งอันตราย - SQL, NoSQL, OS Command)

```typescript
// แย่มาก (BAD): ยอมให้โดน SQL injection เพราะดันเอา string มาจับต่อกันดื้อๆ
const query = `SELECT * FROM users WHERE id = '${userId}'`;

// ดีเยี่ยม (GOOD): การทำ Parameterized query
const user = await db.query('SELECT * FROM users WHERE id = $1', [userId]);

// ดีเยี่ยม (GOOD): ใช้ ORM ช่วยจับทำ parameterized input ให้เลย
const user = await prisma.user.findUnique({ where: { id: userId } });
```

### 2. Broken Authentication (ระบบล็อกอินหละหลวม)

```typescript
// การบดบังรหัสผ่าน (Password hashing)
import { hash, compare } from 'bcrypt';

const SALT_ROUNDS = 12;
const hashedPassword = await hash(plaintext, SALT_ROUNDS);
const isValid = await compare(plaintext, hashedPassword);

// การดูแลเซสชัน (Session management)
app.use(session({
  secret: process.env.SESSION_SECRET,  // ให้ดึงจากตัวแปรระบบ, ไม่ใส่ฝังไว้ในโค้ด
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,     // ห้ามจาวาสคริปต์แอบล้วงข้อมูลจากตรงนี้
    secure: true,       // บังคับผ่านสายด่วน HTTPS เท่านั้น
    sameSite: 'lax',    // ป้องกันการโจมตีแบบ CSRF
    maxAge: 24 * 60 * 60 * 1000,  // มีอายุ 24 ชั่วโมง
  },
}));
```

### 3. Cross-Site Scripting (XSS) (การหลอกฝังจาวาสคริปต์ให้รันบนเว็บ)

```typescript
// แย่มาก (BAD): นำข้อมูลของตัวผู้ใช้ไปเรนเดอร์ลงใน HTML โดยตรง
element.innerHTML = userInput;

// ดีเยี่ยม (GOOD): ปล่อยให้ระบบเข้ารหัสอัตโนมัติ (auto-escaping) ของ Framework ทำให้ (อย่าง React มันตั้งให้เป็นค่าตั้งต้นอยู่แล้ว)
return <div>{userInput}</div>;

// ในกรณีถ้าจำเป็นต้องเสกเป็น HTML จริงๆ, จงชะล้างทำความสะอาดก่อน (sanitize)
import DOMPurify from 'dompurify';
const clean = DOMPurify.sanitize(userInput);
```

### 4. Broken Access Control (ตรวจสิทธิ์หละหลวม ใครอยากเข้าก็เข้า)

```typescript
// เช็คสิทธิ์ด้วยเสมอ (authorization), อย่ามัวแต่เช็คแค่สถานะการล็อกอิน (authentication)
app.patch('/api/tasks/:id', authenticate, async (req, res) => {
  const task = await taskService.findById(req.params.id);

  // เช็คให้ชัวร์ว่าผู้ที่ล็อกอินเข้ามา เป็นเจ้าของข้อมูลนี้จริงๆ
  if (task.ownerId !== req.user.id) {
    return res.status(403).json({
      error: { code: 'FORBIDDEN', message: 'Not authorized to modify this task' }
    });
  }

  // มั่นใจแล้ว, จัดการอัปเดตข้อมูลต่อไปได้
  const updated = await taskService.update(req.params.id, req.body);
  return res.json(updated);
});
```

### 5. Security Misconfiguration (การตั้งค่าความปลอดภัยหลวมๆ)

```typescript
// การตั้งค่า Security headers (สำหรับ Express แนะนำให้ใช้ helmet)
import helmet from 'helmet';
app.use(helmet());

// นโยบายควบคุมสิ่งที่รันบนหน้าเว็บ (Content Security Policy)
app.use(helmet.contentSecurityPolicy({
  directives: {
    defaultSrc: ["'self'"],
    scriptSrc: ["'self'"],
    styleSrc: ["'self'", "'unsafe-inline'"],  // ทำให้แคบลงกว่านี้อีกนะ ถ้าเป็นไปได้
    imgSrc: ["'self'", 'data:', 'https:'],
    connectSrc: ["'self'"],
  },
}));

// CORS — จำกัดวงให้อนุญาตเฉพาะแหล่งเว็บที่รู้จัก(known origins)เท่านั้น
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || 'http://localhost:3000',
  credentials: true,
}));
```

### 6. Sensitive Data Exposure (ข้อมูลลับสุดยอดหลุดออกไป)

```typescript
// ห้ามปนเอาฟิลด์ข้อมูลสำคัญส่งพ่นกลับไปพร้อมกับการตอบกลับ(API responses) เด็ดขาด
function sanitizeUser(user: UserRecord): PublicUser {
  const { passwordHash, resetToken, ...publicFields } = user;
  return publicFields;
}

// ใช้ตัวแปรระบบ (environment variables) ในการจัดเก็บความลับเสมอ
const API_KEY = process.env.STRIPE_API_KEY;
if (!API_KEY) throw new Error('STRIPE_API_KEY not configured');
```

## Input Validation Patterns (แพทเทิร์นการตรวจสอบข้อมูลป้อนเข้า)

### Schema Validation at Boundaries (ตรวจสอบตัวข้อมูล ณ ขอบพรมแดน)

```typescript
import { z } from 'zod';

const CreateTaskSchema = z.object({
  title: z.string().min(1).max(200).trim(),
  description: z.string().max(2000).optional(),
  priority: z.enum(['low', 'medium', 'high']).default('medium'),
  dueDate: z.string().datetime().optional(),
});

// ตรวจสอบที่หน้าด่าน route handler
app.post('/api/tasks', async (req, res) => {
  const result = CreateTaskSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(422).json({
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Invalid input',
        details: result.error.flatten(),
      },
    });
  }
  // หลังจากนี้ข้อมูลใน result.data จะเป็นตัวแปรมี type ชัดเจน และได้รับการรับรองแล้ว
  const task = await taskService.create(result.data);
  return res.status(201).json(task);
});
```

### File Upload Safety (การอัปโหลดไฟล์ให้ปลอดภัย)

```typescript
// จำกัดประเภทไฟล์(types) และขนาด (sizes) เอาไว้
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_SIZE = 5 * 1024 * 1024; // 5MB

function validateUpload(file: UploadedFile) {
  if (!ALLOWED_TYPES.includes(file.mimetype)) {
    throw new ValidationError('File type not allowed');
  }
  if (file.size > MAX_SIZE) {
    throw new ValidationError('File too large (max 5MB)');
  }
  // อย่าไปไว้ใจแค่ชื่อนามสกุลไฟล์ — ให้ทะลวงลงไปเช็คถึงระดับ magic bytes เลย ถ้ามันคอขาดบาดตายจริงๆ
}
```

## Triaging npm audit Results (การประเมินคัดกรองผลลัพธ์ของ npm audit)

ไม่ใช่ทุกข้อบกพร่องที่ audit เจอจะเรียกร้องให้เราแก้ไขในทันที ใช้แผนภาพตัดสินใจนี้เพื่อพิจารณา:

```
เมื่อ npm audit รายงานว่าพบช่องโหว่ความปลอดภัย
├── ระดับความรุนแรง: วิกฤต(critical) หรือ สูง(high)
│   ├── ช่องโหว่นี้สามารถถูกทะลวงเข้าถึง(reachable)จากตัวแอปของเราได้ไหม?
│   │   ├── ใช่ (YES) --> ซ่อมมันเดี๋ยวนี้ (อัปเดตเวอร์ชัน, ลงแพทช์, หรือหาตัวอื่นมาแทน)
│   │   └── ไม่ใช่ (NO) (เช่น ของที่ใช้แค่ใน dev, โค้ดในส่วนนั้นไม่ได้ถูกเอามาใช้จริง) --> เอาไว้ว่างๆ ค่อยซ่อม, ไม่ต้องรีบร้อน
│   └── มันมีตัวแก้แล้วหรือยัง (a fix available)?
│       ├── มี (YES) --> รีบอัปเดตเป็นตัวที่ซ่อมแล้ว
│       └── ยังไม่มี (NO) --> ลองหาวิธีอ้อมแก้ดู, พิจารณาหาตัวอื่นมาแทน, หรือเพิ่มมันลงในรายชื่อยกเว้น(allowlist) พร้อมปักวันที่จะกลับมาตรวจดูอีกรอบ
├── ระดับความรุนแรง: กลาง(moderate)
│   ├── ทะลวงถึงโปรเจกต์งานบน Production ได้ไหม? --> ให้รอแก้ไขในการทำอัปเดตเวอร์ชันรอบถัดไป
│   └── เกิดเฉพาะในส่วนของ Dev เท่านั้นหรือเปล่า? --> ทำตอนที่ว่างๆ ก็ได้, จับยัดลงรายการคิวงาน (backlog) ไว้ก่อน
└── ระดับความรุนแรง: ต่ำ(low)
    └── ตามอัปเดตแก้ไขไปพร้อมๆ กับรอบที่อัปเดตเวอร์ชันระบบปกติ
```

**คำถามเจาะประเด็น:**
- ฟังก์ชันที่มีปัญหานั้น ถูกเรียกใช้งานให้เดินเครื่องในระบบของเราจริงๆ หรือเปล่า?
- Dependency ตัวนี้ทำหน้าที่อยู่ในระดับของระบบรันไทม์ (runtime dependency) หรือเป็นแค่โปรแกรมผู้ช่วยสำหรับ Dev?
- ช่องโหว่ตัวนี้ สามารถถูกบุกรุกเจาะเข้ามาได้ในสภาพแวดล้อมระบบของคุณจริงๆ หรือเปล่า (เช่น มีช่องโหว่ความปลอดภัยของระบบหลังบ้าน แต่ระบบแอปของคุณดันเป็นส่วนของฝั่งลูกค้า (client-only) ล้วนๆ แบบนี้ก็เจาะไม่เข้า)?

เวลาที่คุณผัดผ่อนข้ามการแก้ไขไป, จงบันทึกเหตุผลว่าทำไมถึงข้าม และจดวันนัดหมายที่จะต้องกลับมาประเมินอีกครั้งเอาไว้ด้วย

## Rate Limiting (การจำกัดความเร็ว/ความถี่)

```typescript
import rateLimit from 'express-rate-limit';

// จำกัดความถี่การใช้งาน API หลัก
app.use('/api/', rateLimit({
  windowMs: 15 * 60 * 1000, // ในช่วง 15 นาที
  max: 100,                   // ใช้งานได้สูงสุด 100 ครั้งต่อรอบ
  standardHeaders: true,
  legacyHeaders: false,
}));

// สำหรับจุดที่เกี่ยวกับล็อกอิน ต้องทำเข้มงวดกว่าเดิม
app.use('/api/auth/', rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,  // ยอมให้กรอกผิดได้แค่ 10 ครั้งต่อ 15 นาที
}));
```

## Secrets Management (การบริหารจัดการของลับ)

```
รูปแบบไฟล์ .env :
  ├── .env.example  → ฝากไว้ใน version control ได้ (ใช้สำหรับใส่เป็นเทมเพลตตัวแปรไว้เฉยๆ)
  ├── .env          → ห้าม commit โยนเข้า version control เด็ดขาด (ข้างในนี้มีความลับจริงๆ)
  └── .env.local    → ห้าม commit โยนเข้า version control (เก็บไว้เพื่อแก้ไขทับเฉพาะเวลาเทสในเครื่องตัวเอง)

รายชื่อไฟล์ .gitignore จะต้องมีพวกนี้รวมอยู่ด้วยเสมอ:
  .env
  .env.local
  .env.*.local
  *.pem
  *.key
```

**ต้องเช็คเสมอ ก่อนจะทำการกด Commit:**
```bash
# เช็คเผื่อเผลอเอาของลับติดร่างเข้าไป
git diff --cached | grep -i "password\|secret\|api_key\|token"
```

## Security Review Checklist (เช็คลิสต์ตรวจความปลอดภัย)

```markdown
### Authentication (ระบบล็อกอินยืนยันตัวตน)
- [ ] รหัสผ่านถูก Hash สับเละเรียบร้อยด้วย bcrypt/scrypt/argon2 (ด้วยจำนวนรอบ salt rounds ≥ 12)
- [ ] ระบบตัวโทเค็นในคุกกี้ (Session tokens) มีการป้องกันด้วย httpOnly, secure, sameSite
- [ ] หน้าเพจ Login มีระบบกันคนมารัวกระหน่ำกด (rate limiting)
- [ ] ตัวโทเค็นที่ใช้สำหรับการรีเซ็ตรหัสผ่าน มีวันหมดอายุ

### Authorization (ระบบตรวจสิทธิ์การเข้าถึง)
- [ ] ทุกๆ endpoint ต้องตรวจสอบสิทธิ์ผู้ใช้เสมอ
- [ ] ผู้ใช้สามารถเข้าถึงได้เฉพาะข้อมูลที่ตัวเองเป็นเจ้าของเท่านั้น
- [ ] โหมดแอดมิน (Admin actions) ต้องผ่านการยืนยันตัวก่อนว่าเป็นแอดมินจริงๆ

### Input (ข้อมูลนำเข้า)
- [ ] ตรวจเช็คข้อมูลที่ผู้ใช้กรอกเข้ามาตั้งแต่ด่านแรก (boundary) อย่างเข้มงวด
- [ ] การใช้ SQL queries ต้องใช้การครอบตัวแปรแบบ parameterize แล้วเท่านั้น
- [ ] ผลลัพธ์ที่จะโชว์บนหน้า HTML ถูกเข้ารหัสป้องกัน(encoded/escaped) ไว้แล้ว

### Data (ข้อมูลเนื้อหา)
- [ ] ไม่มีความลับใดๆ แอบฝังแฝงตัวอยู่ในโค้ดหรือหลุดไปอยู่ในระบบจัดการเวอร์ชัน(version control) 
- [ ] กันฟิลด์ข้อมูลที่อ่อนไหวสุดๆ ออกจากผลลัพธ์ของ API responses
- [ ] ข้อมูลส่วนบุคคล (PII) ถูกเข้ารหัสเอาไว้ให้เรียบร้อยตั้งแต่ตอนเก็บลงในคลัง (ถ้าเกี่ยวข้อง)

### Infrastructure (โครงสร้างพื้นฐาน)
- [ ] มีการตั้งค่า Security headers ต่างๆ ครบแล้ว (CSP, HSTS ฯลฯ)
- [ ] จำกัดวงการเชื่อมต่อ CORS ให้อนุญาตเฉพาะแหล่งเชื่อมต่อที่เรารู้จักเท่านั้น
- [ ] ทำการ Audit พวกของเสริม (Dependencies) เพื่อหาช่องโหว่ความปลอดภัยอย่างละเอียดแล้ว
- [ ] ข้อความเมื่อเจอ Error ต้องไม่พ่นเรื่องลึกๆ ไส้ในภายในของเราโชว์ออกมาให้เห็น
```
## See Also (ดูเพิ่มเติม)

สำหรับคู่มือตรวจทานช่องโหว่ความปลอดภัยฉบับเต็ม และขั้นตอนการตรวจสอบก่อนกด commit ให้เปิดดู `references/security-checklist.md`.

## Common Rationalizations (ข้ออ้างทั่วไป)

| ข้ออ้าง | ความเป็นจริง |
|---|---|
| "นี่มันเป็นโปรแกรมที่ใช้กันแค่ลึกๆ ภายในออฟฟิศเท่านั้น ความปลอดภัยไม่ต้องเน้นหรอกน่า" | โปรแกรมสำหรับใช้ภายในก็โดนแฮกยับเยินมาเยอะแล้ว พวกแฮกเกอร์มันชอบเล็งตีตรงจุดที่อ่อนแอที่สุดนี่แหละ |
| "ไว้ทีหลังเถอะ เดี๋ยวค่อยมาเพิ่มความปลอดภัย" | การจะไปนั่งแก้ตามเสริมความปลอดภัยทีหลังเนี่ย มันยากกว่าการสร้างขึ้นมาด้วยตั้งแต่แรกตั้ง 10 เท่าเลยนะ ยัดใส่ตั้งแต่ตอนนี้แหละ |
| "ไม่มีใครเค้ามานั่งแฮกของแบบนี้หรอก" | เดี๋ยวพวกโปรแกรมสแกนออโต้ตามจับเอาได้เองแหละ การซ่อนเร้นเอาตัวรอด (Security by obscurity) มันไม่ใช่ความปลอดภัยที่แท้จริงหรอกนะ |
| "ตัว Framework ก็จัดการความปลอดภัยให้แล้วนี่" | Frameworks มีแค่เครื่องมือไว้ให้เฉยๆ ไม่ได้แจกบัตรรับประกัน คุณเองก็ยังต้องใช้พวกมันให้ถูกวิธีด้วย |
| "ก็แค่งานตัวอย่าง (prototype) เฉยๆ" | งานตัวอย่างนี่แหละ มักจะถูกลากเอาไปใช้งานจริงบน production เสมอ ปลูกฝังนิสัยรักความปลอดภัยตั้งแต่วันแรกไปเลย |

## Red Flags (สัญญาณเตือนภัย)

- ข้อมูล Input ของผู้ใช้ถูกปล่อยไหลเข้าไปยุ่งกับตัวคิวรีตาราง(database queries), คำสั่งหน้าจอ(shell commands), หรือขึ้นโชว์หราอยู่บน HTML อย่างหน้าตาเฉย
- พบเจอข้อมูลความลับสุดยอดโผล่อยู่ใน source code หรืองอกอยู่ในประวัติของระบบ git
- API endpoints ไร้การป้องกัน ปล่อยปละละเลยเรื่องการเช็คสถานะล็อกอิน (authentication) หรือการเช็คสิทธิ์ (authorization)
- ไม่ยอมตั้งค่า CORS ให้รัดกุม หรืออนุญาตให้ใครก็ตามมาใช้ (`*`) ทั่วอาณาจักร
- หน้าเพจระบบล็อกอิน(authentication) ปล่อยให้คนมารัวกดได้รัวๆ โดยไม่มีการจำกัดอัตราความเร็ว (rate limiting)
- ข้อมูลความผิดพลาดไส้ในลึกๆ หรือบันทึกข้อผิดพลาด (Stack traces) ถูกประจานหราให้ผู้ใช้งานทั่วไปเห็น
- พบส่วนเสริมพึ่งพา (Dependencies) ที่มีชื่อเสียงเรื่องช่องโหว่ความปลอดภัยร้ายแรงติดมาด้วย

## Verification

หลังจากลงมือเขียนโค้ดที่ผูกติดอยู่กับความเป็นความตายด้านความปลอดภัย:

- [ ] รันคำสั่ง `npm audit` แล้วไม่พบช่องโหว่ในระดับวิกฤต (critical) หรือ ระดับสูง (high) โผล่ขึ้นมา
- [ ] ไม่มีความลับใดๆ โผล่อยู่ในซอร์สโค้ด หรือในประวัติการแก้โค้ด git history
- [ ] ข้อมูลทุกชนิดที่ผู้ใช้ป้อนมา ถูกตรวจสอบที่เขตแดนด่านแรกเรียบร้อยแล้ว
- [ ] ระบบมีการตรวจสอบเรื่องของ Authentication และ Authorization ณ จุดที่สงวนสิทธิ์ endpoints ครบถ้วน
- [ ] ตัว Security headers ปรากฏอยู่ในผลตอบรับ (ตรวจเช็คกับ browser DevTools ได้เลย)
- [ ] ผลตอบรับเวลาเจอ Errors ต้องไม่คายความลับไส้ในของระบบออกมา
- [ ] ระบบจำกัดความถี่ (Rate limiting) พร้อมทำงานในหน้า endpoints ของการล็อกอิน (auth endpoints)


## Related Coding Standards
When performing this skill or role, strictly adhere to the following standards:
- `coding-standard/backend/11-database-connection.md`
- `coding-standard/backend/4-request-headers.md`
- `coding-standard/backend/12-data-management.md`
- `coding-standard/backend/13-code-quality.md`
- `coding-standard/backend/6-api-response-codes.md`
