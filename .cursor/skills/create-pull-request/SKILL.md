---
name: create-pull-request
description: สร้าง Branch ใหม่ ทำการ Commit, Push และเตรียมสร้าง Pull Request (PR) พร้อมบังคับอัปเดต CHANGELOG เสมอ เพื่อป้องกันการแก้ไขโค้ดลง main โดยตรง
disable-model-invocation: true
---

# Create Pull Request พร้อมอัปเดต CHANGELOG

## เมื่อไหร่ที่ควรใช้ (When to use)

- เมื่อผู้ใช้เรียกคำสั่ง `/create-pull-request` หรือ `/pr` หรือต้องการส่งโค้ดขึ้นระบบผ่าน Pull Request ตามระเบียบ CI Quality Gate (ห้าม push ลง main ตรงๆ)
- ใช้ Skill นี้เมื่อมีการแก้ไขโค้ดเสร็จสิ้นและพร้อมที่จะนำโค้ดไปให้ทีมรีวิว

## กฎเหล็กที่ต้องผ่าน (Hard gates — ต้องทำทุกครั้ง ห้ามยกเว้น)

1. **ยืนยันสถานะโค้ด:** ตรวจสอบก่อนว่าทำงานอยู่ที่ **folder / repo root** ไหน และเช็กสถานะ `git status` 
2. **สร้าง Branch ใหม่:** **ห้าม commit ลง main โดยเด็ดขาด** ให้สร้าง Branch ใหม่เสมอ (เช่น `feature/add-ci`, `fix/login-bug`) ด้วยคำสั่ง `git checkout -b <branch-name>`
3. **ตรวจสอบความถูกต้องภายในเครื่อง (Local CI Check):** รันคำสั่งตรวจสอบของโปรเจกต์ภายในเครื่องของโฟลเดอร์หรือบริการที่มีการแก้ไข เช่น **`npm run ci`** (ซึ่งประกอบไปด้วย `npm run lint`, `npm run format:check`, `npm test` และ `npm run audit:check`) เพื่อเช็คความเรียบร้อยก่อนเสมอ เพื่อป้องกันไม่ให้เกิดความผิดพลาดเมื่อโค้ดขึ้นไปบน GitHub Actions
4. **CHANGELOG:** อัปเดตไฟล์ **`CHANGELOG.md`** ใน Repository นั้น (ให้เนื้อหาสอดคล้องกับ diff จริง) และบันทึกให้อยู่ในหมวด `[Unreleased]`
5. **Commit & Push:** รันคำสั่งเพิ่มไฟล์และ commit (`git add .`, `git commit -m "..."`) จากนั้น push branch ขึ้นไปที่ origin (`git push -u origin <branch-name>`)
6. **แจ้งเตือนสร้าง PR:** เนื่องจากเครื่องอาจไม่มี `gh` CLI ติดตั้งไว้ หลังจาก Push สำเร็จ ให้แจ้งเตือนผู้ใช้พร้อม **ให้ URL สำหรับกดเปิด PR บนเว็บ GitHub** (ปกติ Git จะพิมพ์ลิงก์สำหรับสร้าง PR ให้ in Terminal ผลลัพธ์ตอน push ให้คัดลอกลิงก์นั้นมาแสดงให้ผู้ใช้กดได้เลย)

## กฎการออกเวอร์ชันและ Release (Release / version rules)

เมื่อทำการเพิ่มบล็อก **versioned release** (ไม่ใช่แค่ใส่ bullet ภายใต้ `[Unreleased]`):

- ต้องใช้ **Semantic Versioning** เท่านั้น: `MAJOR.MINOR.PATCH` (เช่น `1.0.0`, `2.3.1`)
- รูปแบบของ Heading ต้องเป็น `## [<version>] - <YYYY-MM-DD>` — **ห้ามใส่ prefix `v`** ใน Heading (เช่นใช้ `1.0.0` ห้ามใช้ `v1.0.0`)

สำหรับ Template และตัวอย่าง: ดูที่ `reference.md` ในโฟลเดอร์ของ Skill นี้

## การเตือนเรื่องมาตรฐาน (Standards reminder — ทางเลือก)

หาก diff มีการแตะต้อง API, OpenAPI หรือโครงสร้าง Package ให้แจ้งเตือนผู้ใช้ (หากยังไม่ได้ทำ): ให้ใช้ **`/test`** (รัน `npm run ci`), Spectral, **`/review-code-standard`** และสำหรับงานที่เตรียมขึ้น Production ให้ใช้ **`/ship`** ทั้งนี้ห้าม Block การสร้าง PR ยกเว้นผู้ใช้จะสั่ง
