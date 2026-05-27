---
name: code-simplification
description: ทำให้โค้ดอ่านง่ายชัดเจนยิ่งขึ้น ใช้เมื่อทำ refactor ปรับแต่งโค้ดให้กระจ่างชัดโดยไม่เปลี่ยนพฤติกรรมการทำงาน ใช้เมื่อโค้ดทำงานได้แต่ดูลึกลับซับซ้อน, รักษาดูแลยาก, หรือเอาไปต่อยอดได้ยากกว่าที่ควรจะเป็น
---

# Code Simplification

## Overview

ทำโค้ดให้เรียบง่ายโดยการลดความซับซ้อน แต่ยังคงรักษาพฤติกรรมการทำงานเดิมไว้เป๊ะๆ เป้าหมายไม่ใช่การทำให้บรรทัดน้อยลง — แต่เป็นโค้ดที่ต้องอ่านง่าย, ทำความเข้าใจง่าย, แก้ไขง่าย, และหาบั๊กง่าย

## The Five Principles (5 กฎเหล็ก)

### 1. Preserve Behavior Exactly (รักษาพฤติกรรมดั้งเดิมให้เป๊ะ)

ห้ามเปลี่ยนว่าโค้ด 'ทำอะไร' — ให้เปลี่ยนแค่โค้ด 'เขียนอย่างไร' ทั้งหมดไม่ว่าจะเป็น inputs, outputs, ผลข้างเคียง (side effects), พฤติกรรมเมื่อเกิด error, และพวก edge cases จะต้องแสดงผลลัพธ์แบบเดียวกันเป๊ะๆ

### 2. Follow Project Conventions (ทำตามธรรมเนียมของโปรเจกต์)

การทำให้อ่านง่าย (Simplification) หมายถึงการทำให้โค้ดสอดคล้องกับสภาพโค้ดโดยรวมของโปรเจกต์ ไม่ใช่การไปยัดเยียดรสนิยมส่วนตัวของคุณใส่เข้าไป

### 3. Prefer Clarity Over Cleverness (เลือกความกระจ่างชัด ดีกว่าโชว์ความล้ำ)

โค้ดที่เขียนแบบตรงๆ ทื่อๆ ย่อมดีกว่าโค้ดสั้นกุดแต่บีบอัดจนต้องหยุดคิดเพื่อทำความเข้าใจ

```typescript
// ดูไม่รู้เรื่อง: เขียนเงื่อนไข ternary อัดเป็นลูกโซ่
const label = isNew ? 'New' : isUpdated ? 'Updated' : isArchived ? 'Archived' : 'Active';

// ดูง่าย: การแปลงค่าที่อ่านเข้าใจทันที
function getStatusLabel(item: Item): string {
  if (item.isNew) return 'New';
  if (item.isUpdated) return 'Updated';
  if (item.isArchived) return 'Archived';
  return 'Active';
}
```

### 4. Maintain Balance (รักษาสมดุล)

หลุมพรางของการ simplify ที่ต้องระวัง:
- การอัดรวมโค้ดที่รุนแรงเกินไป (Inlining too aggressively)
- รวมเอาตรรกะที่ไม่เกี่ยวข้องกันมาอยู่ด้วยกัน
- ลบรูปแบบที่ดูเหมือนจะ "ไม่จำเป็น" ออกไปโดยไม่เข้าใจ
- พุ่งเป้าไปที่การลดจำนวนบรรทัด

### 5. Scope to What Changed (จำกัดขอบเขตอยู่แค่ตรงส่วนที่แก้ไข)

โดยปกติให้ตีกรอบการทำ simplify อยู่แค่เฉพาะจุดที่มีการแก้ไขโค้ดล่าสุด

## The Simplification Process (ขั้นตอนการทำ)

### Step 1: Understand Before Touching (Chesterton's Fence)

ก่อนที่จะเริ่มเปลี่ยนหรือลบอะไร, จงทำความเข้าใจก่อนว่าทำไมมันถึงมาอยู่ตรงนั้น:

```
ก่อนจะทำการ SIMPLIFYING, ให้ตอบคำถามนี้:
- โค้ดก้อนนี้ทำหน้าที่อะไร?
- ใครเรียกใช้มัน? มันไปเรียกใช้อะไรต่อไหม?
- มีเคสขอบหลืบ (edge cases) หรือ เส้นทาง error อันไหนบ้าง?
- มี tests ตัวไหนที่อธิบายความคาดหวังพฤติกรรมนี้ไว้ไหม?
- ทำไมเขาถึงเขียนมาท่านี้แต่แรก?
```

### Step 2: Identify Simplification Opportunities

**ความซับซ้อนเชิงโครงสร้าง:**

| แพทเทิร์น | สัญญาณเตือน | วิธีการทำ Simplify |
|---------|--------|----------------|
| ซ้อนลึกจัดๆ (Deep nesting 3 ชั้นขึ้นไป) | ตามอ่านตรรกะเงื่อนไขไม่ไหว | สกัดเอาเงื่อนไขออกมาเป็น guard clauses |
| ฟังก์ชันยาวเป็นหางว่าว (50 บรรทัดขึ้น) | เหมาทำงานหลายหน้าที่เกิน | แตกฟังก์ชันใหม่ให้โฟกัสทำแค่หน้าที่เดียว |
| ซ้อน ternary มั่วตั้ว | สมองมนุษย์แปลผลไม่ทัน | แทนที่ด้วย if/else หรือ switch |
| โค้ดเหมือนกันเป๊ะ | โค้ด 5 บรรทัดหน้าตาเหมือนกันในหลายๆ ที่ | ดึงออกไปเป็น shared function |

### Step 3: Apply Changes Incrementally

```
ทุกๆ ครั้งที่จะทำ SIMPLIFICATION:
1. แก้ไขโค้ด
2. รันระบบ test
3. ถ้า tests ผ่าน → commit
4. ถ้า tests พัง → revert แล้วคิดทบทวนใหม่
```

**กฎ 500 บรรทัด:** ถ้าการ refactoring ครั้งนี้ต้องไปแก้โค้ดเกิน 500 บรรทัด ให้ใช้เครื่องมืออัตโนมัติ (codemods, sed scripts, AST transforms)

### Step 4: Verify the Result

```
เปรียบเทียบ ก่อน และ หลัง:
- เวอร์ชันใหม่มันดูอ่านง่ายขึ้นอย่างแท้จริงใช่ไหม?
- คุณเผลอเอาแพทเทิร์นประหลาดๆ เข้ามาไหม?
- ข้อมูลความต่าง (diff) คลีนและง่ายต่อการรีวิวไหม?
```

## Language-Specific Guidance

### TypeScript / JavaScript

```typescript
// SIMPLIFY: ครอบ async เอาไว้แบบไม่ได้ประโยชน์
// ก่อนแก้
async function getUser(id: string): Promise<User> {
  return await userService.findById(id);
}
// หลังแก้
function getUser(id: string): Promise<User> {
  return userService.findById(id);
}

// SIMPLIFY: แมนวลสร้าง array เอง
// ก่อนแก้
const activeUsers: User[] = [];
for (const user of users) {
  if (user.isActive) { activeUsers.push(user); }
}
// หลังแก้
const activeUsers = users.filter((user) => user.isActive);
```

### Python

```python
# SIMPLIFY: เงื่อนไขซ้อน, ให้เตะออกก่อนเลย (early return)
# ก่อนแก้
def process(data):
    if data is not None:
        if data.is_valid():
            return do_work(data)
        else:
            raise ValueError("Invalid data")
    else:
        raise TypeError("Data is None")
# หลังแก้
def process(data):
    if data is None:
        raise TypeError("Data is None")
    if not data.is_valid():
        raise ValueError("Invalid data")
    return do_work(data)
```

## Verification

- [ ] ทุกๆ existing tests รันผ่านโดยไม่ต้องแก้ไขโค้ด test
- [ ] Build สำเร็จโดยไม่มีคำแจ้งเตือน (warnings) โผล่มาใหม่
- [ ] ทุกๆ simplification ที่ทำ สามารถรีวิวได้แยกชิ้น
- [ ] ข้อมูลความต่างโค้ด (diff) คลีนสะอาดตา
- [ ] ไม่มีการแอบลบหรือทำให้ระบบจัดการ error อ่อนแอลง
- [ ] ไม่ทิ้งซากโค้ดตายไว้ข้างหลัง


## Related Coding Standards
When performing this skill or role, strictly adhere to the following standards:
- `coding-standard/backend/13-code-quality.md`
- `coding-standard/backend/2-folder-structure.md`
