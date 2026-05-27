# Accessibility Checklist

คู่มืออ้างอิงฉบับย่อสำหรับการทำให้ได้ตามมาตรฐาน WCAG 2.1 AA ใช้ควบคู่กับทักษะ `frontend-ui-engineering`

## Table of Contents

- [Essential Checks](#essential-checks)
- [Common HTML Patterns](#common-html-patterns)
- [Testing Tools](#testing-tools)
- [Quick Reference: ARIA Live Regions](#quick-reference-aria-live-regions)
- [Common Anti-Patterns](#common-anti-patterns)

## Essential Checks

### Keyboard Navigation
- [ ] องค์ประกอบที่โต้ตอบได้ทั้งหมดสามารถโฟกัสได้ด้วยปุ่ม Tab
- [ ] ลำดับการโฟกัสเป็นไปตามลำดับการมองเห็น/ตรรกะ
- [ ] การโฟกัสสามารถมองเห็นได้ (มีกรอบ/วงแหวนบนองค์ประกอบที่ถูกโฟกัส)
- [ ] วิดเจ็ตแบบกำหนดเองรองรับการใช้คีย์บอร์ด (Enter เพื่อเปิดใช้งาน, Escape เพื่อปิด)
- [ ] ไม่มีกับดักคีย์บอร์ด (ผู้ใช้สามารถกด Tab ออกจาก Component ได้เสมอ)
- [ ] มีลิงก์ Skip-to-content ที่ด้านบนสุดของหน้า - มองเห็นได้ (อย่างน้อย) เมื่อใช้คีย์บอร์ดโฟกัส
- [ ] Modals กักการโฟกัสไว้ขณะเปิด และคืนการโฟกัสเมื่อปิด

### Screen Readers
- [ ] รูปภาพทั้งหมดมีข้อความ `alt` (หรือ `alt=""` สำหรับรูปภาพเพื่อการตกแต่ง)
- [ ] ช่องป้อนข้อมูลฟอร์มทั้งหมดมีป้ายกำกับที่เชื่อมโยงกัน (`<label>` หรือ `aria-label`)
- [ ] ปุ่มและลิงก์มีข้อความอธิบาย (ไม่ใช่ "คลิกที่นี่")
- [ ] ปุ่มที่มีแต่ไอคอนมี `aria-label`
- [ ] หน้าเว็บมี `<h1>` หนึ่งอันและหัวข้อไม่ข้ามระดับชั้น
- [ ] มีการประกาศเมื่อเนื้อหาแบบไดนามิกเปลี่ยนแปลง (`aria-live` regions)
- [ ] ตารางมี `<th>` headers พร้อมระบุ scope

### Visual
- [ ] คอนทราสต์ของข้อความ ≥ 4.5:1 (ข้อความปกติ) หรือ ≥ 3:1 (ข้อความขนาดใหญ่, 18px ขึ้นไป)
- [ ] คอนทราสต์ของ UI components ≥ 3:1 เทียบกับพื้นหลัง
- [ ] สีไม่ใช่เพียงวิธีเดียวในการสื่อสารข้อมูล
- [ ] ข้อความสามารถปรับขนาดได้ถึง 200% โดยที่เลย์เอาต์ไม่พัง
- [ ] ไม่มีเนื้อหาที่กระพริบมากกว่า 3 ครั้งต่อวินาที

### Forms
- [ ] ทุกช่องป้อนข้อมูลมีป้ายกำกับที่มองเห็นได้
- [ ] มีการระบุช่องที่จำเป็นต้องกรอก (ไม่ใช่ด้วยสีเพียงอย่างเดียว)
- [ ] ข้อความแสดงข้อผิดพลาดมีความเฉพาะเจาะจงและเชื่อมโยงกับช่องนั้นๆ
- [ ] สถานะข้อผิดพลาดมองเห็นได้ด้วยวิธีอื่นนอกจากสี (ไอคอน, ข้อความ, เส้นขอบ)
- [ ] ข้อผิดพลาดในการส่งฟอร์มถูกสรุปและสามารถโฟกัสได้
- [ ] ช่องข้อมูลที่ทราบประเภทใช้ระบบเติมคำอัตโนมัติ (autocomplete) (เช่น `type="email" autocomplete="email"`)

### Content
- [ ] มีการประกาศภาษา (`<html lang="th">`)
- [ ] หน้าเว็บมี `<title>` ที่อธิบายชัดเจน
- [ ] ลิงก์มีความแตกต่างจากข้อความรอบข้าง (ไม่ใช่ด้วยสีเพียงอย่างเดียว)
- [ ] เป้าหมายการสัมผัส (Touch targets) ≥ 44x44px บนมือถือ
- [ ] หน้าจอที่ไม่มีข้อมูล (Empty states) มีความหมาย (ไม่ใช่ปล่อยหน้าจอขาวเปล่าๆ)

## Common HTML Patterns

### Buttons vs. Links

```html
<!-- ใช้ <button> สำหรับการกระทำต่างๆ (actions) -->
<button onClick={handleDelete}>Delete Task</button>

<!-- ใช้ <a> สำหรับการนำทาง (navigation) -->
<a href="/tasks/123">View Task</a>

<!-- ห้ามใช้ div/span แทนปุ่มเด็ดขาด -->
<div onClick={handleDelete}>Delete</div>  <!-- แย่มาก (BAD) -->
```

### Form Labels

```html
<!-- การเชื่อมโยงป้ายกำกับแบบชัดเจน (Explicit) -->
<label htmlFor="email">Email address</label>
<input id="email" type="email" required />

<!-- การห่อหุ้มแบบโดยนัย (Implicit) -->
<label>
  Email address
  <input type="email" required />
</label>

<!-- ป้ายกำกับที่ซ่อนอยู่ (แนะนำให้ใช้ป้ายกำกับที่มองเห็นได้มากกว่า) -->
<input type="search" aria-label="Search tasks" />
```

### ARIA Roles

```html
<!-- การนำทาง (Navigation) -->
<nav aria-label="Main navigation">...</nav>
<nav aria-label="Footer links">...</nav>

<!-- ข้อความสถานะ -->
<div role="status" aria-live="polite">Task saved</div>

<!-- ข้อความแจ้งเตือน -->
<div role="alert">Error: Title is required</div>

<!-- กล่องข้อความ (Modal dialogs) -->
<dialog aria-modal="true" aria-labelledby="dialog-title">
  <h2 id="dialog-title">Confirm Delete</h2>
  ...
</dialog>

<!-- สถานะกำลังโหลด -->
<div aria-busy="true" aria-label="Loading tasks">
  <Spinner />
</div>
```

### Accessible Lists

```html
<ul role="list" aria-label="Tasks">
  <li>
    <input type="checkbox" id="task-1" aria-label="Complete: Buy groceries" />
    <label htmlFor="task-1">Buy groceries</label>
  </li>
</ul>
```

## Testing Tools

```bash
# การตรวจสอบอัตโนมัติ (Automated audit)
npx axe-core          # ทดสอบ Accessibility ผ่านโปรแกรม
npx pa11y             # เครื่องมือตรวจสอบ Accessibility แบบ CLI

# ในเบราว์เซอร์
# Chrome DevTools → Lighthouse → Accessibility
# Chrome DevTools → Elements → Accessibility tree

# การทดสอบโปรแกรมอ่านหน้าจอ (Screen reader)
# macOS: VoiceOver (Cmd + F5)
# Windows: NVDA (ฟรี) หรือ JAWS
# Linux: Orca
```

## Quick Reference: ARIA Live Regions

| ค่า (Value) | พฤติกรรม (Behavior) | ใช้สำหรับ (Use For) |
|-------|----------|---------|
| `aria-live="polite"` | ประกาศเมื่อถึงช่วงหยุดพักถัดไป | อัปเดตสถานะ, ยืนยันการบันทึก |
| `aria-live="assertive"` | ประกาศทันที | ข้อผิดพลาด, การแจ้งเตือนที่เวลาเป็นเรื่องสำคัญ |
| `role="status"` | เหมือนกับ `polite` | ข้อความสถานะ |
| `role="alert"` | เหมือนกับ `assertive` | ข้อความแสดงข้อผิดพลาด |

## Common Anti-Patterns

| ข้อผิดพลาดทั่วไป (Anti-Pattern) | ปัญหา | วิธีแก้ |
|---|---|---|
| ใช้ `div` แทนปุ่ม | ไม่สามารถโฟกัสได้, ไม่รองรับคีย์บอร์ด | ใช้ `<button>` |
| ไม่มีข้อความ `alt` | โปรแกรมอ่านหน้าจอมองไม่เห็นรูปภาพ | เพิ่ม `alt` ที่ใช้อธิบายรูปภาพ |
| ใช้สีบอกสถานะอย่างเดียว | ผู้ใช้ตาบอดสีมองไม่เห็น | เพิ่มไอคอน, ข้อความ, หรือลวดลาย |
| มีเดียเล่นอัตโนมัติ | ทำให้สับสน, หยุดไม่ได้ | เพิ่มปุ่มควบคุม, ห้ามเล่นอัตโนมัติ |
| Dropdown แบบกำหนดเองที่ไม่มี ARIA | ใช้งานด้วยคีย์บอร์ด/โปรแกรมอ่านหน้าจอไม่ได้ | ใช้ `<select>` พื้นฐาน หรือ ARIA listbox ที่ถูกต้อง |
| ลบเส้นกรอบโฟกัสออก | ผู้ใช้ไม่รู้ว่าโฟกัสอยู่ที่ไหน | แต่งสไตล์ของเส้นกรอบโฟกัส, ห้ามลบออก |
| ลิงก์/ปุ่มที่ว่างเปล่า | ประกาศว่า "ลิงก์" โดยไม่มีคำอธิบาย | เพิ่มข้อความ หรือ `aria-label` |
| ใช้ `tabindex > 0` | ทำให้ลำดับการกด Tab ตามธรรมชาติพัง | ใช้ `tabindex="0"` หรือ `-1` เท่านั้น |
