---
name: commit-push-with-changelog
description: การทำ git commit และ optional push อย่างปลอดภัย พร้อมบังคับยืนยันและอัปเดต CHANGELOG เสมอ ใช้เมื่อผู้ใช้ต้องการ commit, push หรือเตรียม release ตามระเบียบของ changelog (ใช้รูปแบบ SemVer release headings)
disable-model-invocation: true
---

# Commit / push พร้อมอัปเดต CHANGELOG

## เมื่อไหร่ที่ควรใช้ (When to use)

- เมื่อผู้ใช้เรียกคำสั่ง `/commit-push-with-changelog` หรือร้องขอ Workflow สำหรับการ commit/push ที่มีขั้นตอนป้องกันและเคร่งครัดเรื่อง CHANGELOG
- **ให้เลือกใช้ Skill นี้** แทนการ commit แบบเฉพาะกิจ (ad-hoc) จาก `/build` เสมอ หาก Repository นั้นมีไฟล์ **`CHANGELOG.md`** (รวมถึง Workspace ปัจจุบันนี้ด้วย)

## กฎเหล็กที่ต้องผ่าน (Hard gates — ต้องทำทุกครั้ง ห้ามยกเว้น)

1. **โหมดการทำงาน (Mode):** ต้องถามให้ชัดเจนว่าเลือก **`commit only`** หรือ **`commit & push`** ห้าม push เด็ดขาดหากผู้ใช้เลือกแค่ commit only
2. **ขอบเขต (Scope):** ถามว่าการดำเนินการนี้ใช้กับ **folder / repo root** ไหน; ให้ `cd` ไปที่นั่นก่อนรันคำสั่ง git ที่มีการเขียนข้อมูลใดๆ
3. **ตรวจสอบ Repository (Repo identity):** ยืนยัน **path**, ผลลัพธ์ของ `git remote -v` และ **branch** ปัจจุบันก่อนที่จะ stage/commit
4. **CHANGELOG:** อัปเดตไฟล์ **`CHANGELOG.md`** ใน Repository นั้นก่อนการ commit ทุกครั้ง (ให้เนื้อหาสอดคล้องกับ diff จริง) หากไม่มีเนื้อหาที่เป็นชิ้นเป็นอันให้บันทึก ให้ถามผู้ใช้ก่อนว่าจะดำเนินการต่อไหม หรือต้องการให้บันทึกอะไรลงไป

## กฎการออกเวอร์ชันและ Release (Release / version rules)

เมื่อทำการเพิ่มบล็อก **versioned release** (ไม่ใช่แค่ใส่ bullet ภายใต้ `[Unreleased]`):

- ต้องใช้ **Semantic Versioning** เท่านั้น: `MAJOR.MINOR.PATCH` (เช่น `1.0.0`, `2.3.1`)
- รูปแบบของ Heading ต้องเป็น `## [<version>] - <YYYY-MM-DD>` — **ห้ามใส่ prefix `v`** ใน Heading (เช่นใช้ `1.0.0` ห้ามใช้ `v1.0.0`)

สำหรับ Template และตัวอย่าง: ดูที่ `reference.md` ในโฟลเดอร์ของ Skill นี้

## การเตือนเรื่องมาตรฐาน (Standards reminder — ทางเลือก)

หาก diff มีการแตะต้อง API, OpenAPI หรือโครงสร้าง Package ให้แจ้งเตือนผู้ใช้ (หากยังไม่ได้ทำ): ให้ใช้ **`/test`** (รัน `npm run ci`), Spectral, **`/review-code-standard`** และสำหรับงานที่เตรียมขึ้น Production ให้ใช้ **`/ship`** ทั้งนี้ห้าม Block การ commit ยกเว้นผู้ใช้จะสั่ง

## ขั้นตอนการทำงานที่แนะนำ (Suggested workflow)

1. ผ่านกฎเหล็กทั้งหมดก่อน (ยืนยัน mode, folder และ repo)
2. แสดง `git status` และ `git diff` ที่เกี่ยวข้อง (หรือสรุปความ); ตกลงเรื่องไฟล์ที่จะนำเข้า scope
3. แก้ไข `CHANGELOG.md` — ควรใช้ `[Unreleased]` สำหรับงานที่กำลังทำอยู่; ใช้ release heading เฉพาะตอนที่จะตัด versioned release ตามกฎข้างต้นเท่านั้น
4. Stage การเปลี่ยนแปลง; เสนอ commit message ที่ชัดเจน; เมื่อได้รับการอนุมัติ จึงรัน **`git commit`**
5. รัน **`git push`** ไปยัง remote/branch ที่ยืนยันไว้ **ก็ต่อเมื่อ** โหมดคือ **`commit & push`** และผู้ใช้อนุมัติขั้นตอนการ push แล้วเท่านั้น

## ความปลอดภัย (Safety)

- ห้ามรันคำสั่ง git ที่ทำลายข้อมูล (`reset --hard`, force push, branch delete) ยกเว้นผู้ใช้จะสั่งแยกต่างหากอย่างชัดเจนและยืนยันว่ารับทราบความเสี่ยง
- ห้ามทำงานข้าม Repository: การยืนยันแต่ละชุดต้องทำต่อ 1 target root เท่านั้น
