# Security Checklist

คู่มืออ้างอิงฉบับย่อสำหรับความปลอดภัยของเว็บแอปพลิเคชัน ใช้ควบคู่กับทักษะ `security-and-hardening`

## Table of Contents

- [Pre-Commit Checks](#pre-commit-checks)
- [Authentication](#authentication)
- [Authorization](#authorization)
- [Input Validation](#input-validation)
- [Security Headers](#security-headers)
- [CORS Configuration](#cors-configuration)
- [Data Protection](#data-protection)
- [Dependency Security](#dependency-security)
- [Error Handling](#error-handling)
- [OWASP Top 10 Quick Reference](#owasp-top-10-quick-reference)

## Pre-Commit Checks

- [ ] ไม่มีข้อมูลความลับในโค้ด (`git diff --cached | grep -i "password\|secret\|api_key\|token"`)
- [ ] `.gitignore` ครอบคลุม: `.env`, `.env.local`, `*.pem`, `*.key`
- [ ] `.env.example` ใช้ค่าตัวอย่าง (ไม่ใช่ความลับจริง)

## Authentication

- [ ] รหัสผ่านถูกแฮชด้วย bcrypt (≥12 rounds), scrypt, หรือ argon2
- [ ] Session cookies: `httpOnly`, `secure`, `sameSite: 'lax'`
- [ ] กำหนดเวลาหมดอายุของเซสชัน (ตั้งค่า max-age อย่างสมเหตุสมผล)
- [ ] จำกัดอัตราการส่งคำขอ (Rate limiting) ที่ Endpoint เข้าสู่ระบบ (≤10 ครั้งต่อ 15 นาที)
- [ ] โทเคนรีเซ็ตรหัสผ่าน: จำกัดเวลา (≤1 ชั่วโมง), ใช้ได้ครั้งเดียว
- [ ] ล็อกบัญชีเมื่อพยายามเข้าสู่ระบบผิดพลาดหลายครั้ง (ทางเลือก, พร้อมการแจ้งเตือน)
- [ ] รองรับ MFA สำหรับการกระทำที่สำคัญ (ทางเลือกแต่แนะนำอย่างยิ่ง)

## Authorization

- [ ] ทุก Endpoint ที่ป้องกันไว้มีการตรวจสอบการยืนยันตัวตน (Authentication)
- [ ] ทุกการเข้าถึงทรัพยากรมีการตรวจสอบความเป็นเจ้าของ/สิทธิ์ (ป้องกัน IDOR)
- [ ] Endpoint สำหรับผู้ดูแลระบบ (Admin) ต้องตรวจสอบสิทธิ์ Admin
- [ ] API keys ถูกจำกัดสิทธิ์ให้เหลือน้อยที่สุดที่จำเป็น
- [ ] ตรวจสอบความถูกต้องของโทเคน JWT (signature, วันหมดอายุ, ผู้ออกโทเคน)

## Input Validation

- [ ] ข้อมูลผู้ใช้ทั้งหมดถูกตรวจสอบความถูกต้องที่ขอบเขตของระบบ (API routes, form handlers)
- [ ] การตรวจสอบใช้รายการที่อนุญาต (allowlists) ไม่ใช่รายการที่แบน (denylists)
- [ ] ความยาวของสตริงถูกจำกัด (min/max)
- [ ] ช่วงของตัวเลขถูกตรวจสอบความถูกต้อง
- [ ] รูปแบบอีเมล, URL, และวันที่ถูกตรวจสอบด้วย Library ที่เหมาะสม
- [ ] การอัปโหลดไฟล์: จำกัดประเภทไฟล์, จำกัดขนาด, และตรวจสอบเนื้อหา
- [ ] SQL queries ใช้แบบ parameterized (ห้ามต่อสตริงตรงๆ)
- [ ] เอาต์พุต HTML ถูกเข้ารหัส (ใช้การ auto-escaping ของ framework)
- [ ] URL ถูกตรวจสอบก่อนการเปลี่ยนเส้นทาง (ป้องกัน open redirect)

## Security Headers

```
Content-Security-Policy: default-src 'self'; script-src 'self'
Strict-Transport-Security: max-age=31536000; includeSubDomains
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 0  (ปิดใช้งาน, อาศัย CSP แทน)
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: camera=(), microphone=(), geolocation=()
```

## CORS Configuration

```typescript
// แบบจำกัดสิทธิ์ (แนะนำ)
cors({
  origin: ['https://yourdomain.com', 'https://app.yourdomain.com'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
})

// ห้ามใช้ใน Production เด็ดขาด:
cors({ origin: '*' })  // อนุญาตทุกโดเมน (Any origin)
```

## Data Protection

- [ ] ข้อมูลที่ละเอียดอ่อนถูกนำออกจาก API responses (`passwordHash`, `resetToken`, เป็นต้น)
- [ ] ข้อมูลที่ละเอียดอ่อนไม่ถูกเก็บลงใน Logs (รหัสผ่าน, โทเคน, หมายเลขบัตรเครดิตแบบเต็ม)
- [ ] ข้อมูลส่วนบุคคล (PII) ถูกเข้ารหัสขณะจัดเก็บ (หากกฎหมายข้อบังคับกำหนด)
- [ ] ใช้ HTTPS สำหรับการสื่อสารภายนอกทั้งหมด
- [ ] ไฟล์สำรองฐานข้อมูล (Database backups) ถูกเข้ารหัส

## Dependency Security

```bash
# ตรวจสอบการพึ่งพา (Audit dependencies)
npm audit

# แก้ไขอัตโนมัติเท่าที่เป็นไปได้
npm audit fix

# ตรวจสอบหาช่องโหว่ระดับวิกฤต (Critical vulnerabilities)
npm audit --audit-level=critical

# อัปเดต dependencies ให้เป็นเวอร์ชันล่าสุดเสมอ
npx npm-check-updates
```

## Error Handling

```typescript
// Production: ใช้ข้อผิดพลาดทั่วไป, ไม่แสดงข้อมูลภายใน
res.status(500).json({
  error: { code: 'INTERNAL_ERROR', message: 'Something went wrong' }
});

// ห้ามใช้ใน Production เด็ดขาด:
res.status(500).json({
  error: err.message,
  stack: err.stack,         // เปิดเผยข้อมูลการทำงานภายในระบบ
  query: err.sql,           // เปิดเผยรายละเอียดฐานข้อมูล
});
```

## OWASP Top 10 Quick Reference

| # | ช่องโหว่ (Vulnerability) | วิธีป้องกัน (Prevention) |
|---|---|---|
| 1 | Broken Access Control | ตรวจสอบ Auth ทุก Endpoint, ตรวจสอบความเป็นเจ้าของข้อมูล |
| 2 | Cryptographic Failures | ใช้ HTTPS, แฮชด้วยวิธีที่แข็งแกร่ง, ไม่มีข้อมูลความลับในโค้ด |
| 3 | Injection | Parameterized queries, ตรวจสอบ Input |
| 4 | Insecure Design | Threat modeling, การพัฒนาที่อิงตามข้อกำหนด (spec-driven development) |
| 5 | Security Misconfiguration | Security headers, ให้สิทธิ์น้อยที่สุด, ตรวจสอบ dependencies |
| 6 | Vulnerable Components | `npm audit`, อัปเดต deps เสมอ, ใช้ deps ให้น้อยที่สุด |
| 7 | Auth Failures | รหัสผ่านที่คาดเดายาก, จำกัดอัตราคำขอ, จัดการเซสชัน |
| 8 | Data Integrity Failures | ตรวจสอบการอัปเดต/dependencies, เซ็นชื่อกำกับ artifacts |
| 9 | Logging Failures | บันทึก Log เหตุการณ์ความปลอดภัย, ห้าม Log ความลับ |
| 10 | SSRF | ตรวจสอบ/จำกัดรายชื่อ URL, จำกัดคำขอส่งออกภายนอก (outbound requests) |
