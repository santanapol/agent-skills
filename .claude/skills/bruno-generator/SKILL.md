---
name: bruno-generator
description: แนวทางการสร้าง อัปเดต และจัดการ API Testing Collection ของ Bruno (รองรับ .bru และ .yml สำหรับ v3+)
---

# Bruno Generator Skill

## Context & Purpose (บริบทและวัตถุประสงค์)

Skill นี้รวบรวมแนวทางและข้อควรปฏิบัติที่ดีที่สุด (Best Practices) สำหรับการสร้าง อัปเดต และจัดการ API Testing Collection ของ Bruno โดยจะมีประโยชน์อย่างยิ่งในการจัดการกับ Collection ที่ยังใช้ไฟล์รูปแบบ `.yml` เดิมบน Bruno เวอร์ชันใหม่ (v3.x.x ขึ้นไป) รวมไปถึงการจัดการไฟล์รูปแบบ `.bru` ในปัจจุบัน

## Core Concepts (แนวคิดหลัก)

### 1. File Formats (รูปแบบไฟล์)

Bruno มีรูปแบบไฟล์หลัก 2 แบบสำหรับการเขียน Request:

- **`.bru` (Modern)**: เป็นรูปแบบมาตรฐานและเป็นที่แนะนำสำหรับ Bruno v3+
- **`.yml` (Legacy/Exported)**: รูปแบบเดิมที่ยังรองรับเพื่อความเข้ากันได้ (Backward Compatibility) มักใช้กับ Collection เก่าๆ หรือในการเชื่อมต่อกับ CI/CD Pipeline บางประเภท

### 2. Environment Variables & Credentials (ตัวแปรและข้อมูลยืนยันตัวตน)

ในการสร้าง Request **ห้ามระบุข้อมูลสำคัญหรือรหัสประจำตัวต่างๆ แบบฝังตัวตายตัว (Hardcode)** เช่น `ou_id`, `branch_id`, `user_id`, `username`, `password`
ให้เรียกใช้งานผ่านตัวแปร Environment ของ Bruno เสมอ โดยครอบด้วยวงเล็บปีกกาคู่:

- `{{ou_id}}`
- `{{branch_id}}`
- `{{username}}`
- `{{password}}`

### 3. Scripting & Token Extraction (การเขียนสคริปต์และการดึง Token)

เพื่อทำระบบอัตโนมัติ (เช่น การดึง `access_token` และ `refresh_token` ออกมาหลังจากที่ Login สำเร็จ) เราจะใช้ Post-Response scripts

#### สำหรับรูปแบบ `.bru` (Modern)

ให้เขียน Script ไว้ใน Block ที่กำหนดไว้เฉพาะ:

```bru
script:post-response {
  if (res.status === 200 || (typeof res.getStatus === 'function' && res.getStatus() === 200)) {
    var body = typeof res.getBody === 'function' ? res.getBody() : res.body;
    if (body && body.access_token) {
      bru.setEnvVar("access_token", body.access_token);
    }
    if (body && body.refresh_token) {
      bru.setEnvVar("refresh_token", body.refresh_token);
    }
  }
}
```

#### สำหรับรูปแบบ `.yml` (Bruno v3+)

ใน Bruno v3+ ไฟล์ `.yml` จะไม่ใช้คำสั่ง `script: res:` หรือ `tests:` อีกต่อไป Script ทั้งหมดจะต้องถูกย้ายไปไว้ใน Block `runtime` โดยกำหนด `type: after-response`:

```yaml
runtime:
  scripts:
    - type: after-response
      code: |-
        if (res.status === 200 || (typeof res.getStatus === 'function' && res.getStatus() === 200)) {
          var body = typeof res.getBody === 'function' ? res.getBody() : res.body;
          if (body && body.access_token) {
            bru.setEnvVar("access_token", body.access_token);
          }
          if (body && body.refresh_token) {
            bru.setEnvVar("refresh_token", body.refresh_token);
          }
        }
```

## Best Practices (ข้อควรปฏิบัติที่ดีที่สุด)

1. **Robust Response Parsing (การอ่านค่า Response ให้เสถียร)**: API ของ Bruno มีการอัปเดตและเปลี่ยนแปลงไปตามเวอร์ชัน ดังนั้นเพื่อให้สคริปต์ทำงานได้เสมอ ควรตรวจสอบก่อนว่าเมธอดอย่าง `res.getStatus` หรือ `res.getBody` นั้นมีให้เรียกใช้หรือไม่ (เป็นฟังก์ชันหรือเปล่า) หากไม่มีให้สลับไปดึงค่าจาก Property โดยตรง เช่น `res.status` และ `res.body`
2. **Environment Synchronization (การซิงค์ Environment)**: ควรกำหนดค่าเริ่มต้น (Default values) ของตัวแปรต่างๆ เสมอ (เช่น `ou_id`, `branch_id`, `username`) ภายในไฟล์ตั้งค่า Environment (`environments/Local.bru` หรือ `environments/Local.yml`)
3. **Idempotent Updates (การอัปเดตไฟล์แบบปลอดภัย)**: เมื่อต้องอัปเดต Collection แบบกลุ่มหลายๆ ไฟล์ ควรเตรียมข้อมูล String หรือใช้ตัวแปลง (AST parsing) อย่างรัดกุม เพื่อป้องกันไม่ให้โครงสร้างไวยากรณ์ (Syntax) ของไฟล์ YAML หรือ Bru พังเสียหาย
