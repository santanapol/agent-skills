# Performance Checklist

คู่มืออ้างอิงฉบับย่อสำหรับประสิทธิภาพของเว็บแอปพลิเคชัน ใช้ควบคู่กับทักษะ `performance-optimization`

## Table of Contents

- [Core Web Vitals Targets](#core-web-vitals-targets)
- [TTFB Diagnosis](#ttfb-diagnosis)
- [Frontend Checklist](#frontend-checklist)
- [Backend Checklist](#backend-checklist)
- [Measurement Commands](#measurement-commands)
- [Common Anti-Patterns](#common-anti-patterns)

## Core Web Vitals Targets

| Metric | ดี (Good) | ต้องปรับปรุง (Needs Work) | แย่ (Poor) |
|--------|------|------------|------|
| LCP (Largest Contentful Paint) | ≤ 2.5s | ≤ 4.0s | > 4.0s |
| INP (Interaction to Next Paint) | ≤ 200ms | ≤ 500ms | > 500ms |
| CLS (Cumulative Layout Shift) | ≤ 0.1 | ≤ 0.25 | > 0.25 |

## TTFB Diagnosis

เมื่อ TTFB (Time to First Byte) ช้า (> 800ms) ให้ตรวจสอบแต่ละองค์ประกอบในหน้า Network waterfall ของ DevTools:

- [ ] **DNS resolution** ช้า → เพิ่ม `<link rel="dns-prefetch">` หรือ `<link rel="preconnect">` สำหรับโดเมนที่รู้จัก
- [ ] **TCP/TLS handshake** ช้า → เปิดใช้งาน HTTP/2, พิจารณาใช้ Edge deployment, ตรวจสอบ keep-alive
- [ ] **Server processing** ช้า → ตรวจสอบการทำงาน (profile) ของ backend, ตรวจสอบ query ที่ทำงานช้า, เพิ่ม Caching

## Frontend Checklist

### Images
- [ ] รูปภาพใช้รูปแบบสมัยใหม่ (WebP, AVIF)
- [ ] รูปภาพมีขนาดที่ตอบสนองตามหน้าจอ (ใช้ `srcset` และ `sizes`)
- [ ] รูปภาพและองค์ประกอบ `<source>` มีการระบุ `width` และ `height` อย่างชัดเจน (ป้องกัน CLS)
- [ ] รูปภาพที่อยู่ส่วนล่างของหน้า (Below-the-fold) ใช้ `loading="lazy"` และ `decoding="async"`
- [ ] รูปภาพหลัก (Hero/LCP) ใช้ `fetchpriority="high"` และไม่ใช้ Lazy loading

### JavaScript
- [ ] ขนาด Bundle ต่ำกว่า 200KB แบบบีบอัด gzip (สำหรับการโหลดครั้งแรก)
- [ ] การแยกโค้ด (Code splitting) ด้วย `import()` แบบไดนามิกสำหรับเส้นทางหรือฟีเจอร์ที่กินทรัพยากรสูง
- [ ] เปิดใช้งาน Tree shaking (ตรวจสอบว่า dependency รองรับ ESM และมี `sideEffects: false`)
- [ ] ไม่มี JavaScript ที่บล็อกการเรนเดอร์ใน `<head>` (ให้ใช้ `defer` หรือ `async`)
- [ ] ย้ายการประมวลผลหนักๆ ไปให้ Web Workers (ถ้าเป็นไปได้)
- [ ] ใช้ `React.memo()` กับ Component ที่กินทรัพยากรสูงซึ่งต้อง Render ใหม่ด้วย Props เดิม
- [ ] ใช้ `useMemo()` / `useCallback()` เฉพาะจุดที่มีข้อมูลแสดงให้เห็นว่ามีประโยชน์จริงๆ
- [ ] งานที่ใช้เวลานาน (Long tasks > 50ms) ถูกแบ่งย่อยออก เพื่อให้ Main thread ทำงานอื่นได้ — นี่คือปัจจัยหลักในการปรับ INP
- [ ] ใช้รูปแบบ `yieldToMain` ในการทำงานแบบวนลูปที่ใช้เวลานาน เพื่อให้อีเวนต์ Input แทรกการทำงานได้ในแต่ละรอบ
- [ ] ใช้ Scheduling APIs สมัยใหม่เมื่อทำได้: `scheduler.yield()` (แนะนำ), `scheduler.postTask()` พร้อมกำหนดลำดับความสำคัญ, `isInputPending()` เพื่อหลีกทางเมื่อจำเป็นเท่านั้น
- [ ] ใช้ `requestIdleCallback` สำหรับงานที่เลื่อนออกไปได้ ไม่เร่งด่วน (เช่น การส่ง Analytics, Prefetch, Warmup)
- [ ] เลื่อนงานที่ไม่สำคัญออกไปจาก Event handlers (เช่น Analytics, Logging) เพื่อให้การตอบสนองต่อการโต้ตอบของผู้ใช้ไม่ล่าช้า
- [ ] สคริปต์จากบุคคลที่สามถูกโหลดด้วย `async` / `defer`, ตรวจสอบขนาด, และใช้ Facade ห่อหุ้มไว้หากกินทรัพยากรสูง (เช่น วิดเจ็ตแชท, ไฟล์ฝัง (embeds))

### CSS
- [ ] CSS ที่จำเป็น (Critical CSS) ถูกทำเป็น Inline หรือมีการ Preload
- [ ] ไม่มี CSS ที่บล็อกการเรนเดอร์สำหรับสไตล์ที่ไม่สำคัญ
- [ ] ไม่ให้มีค่าใช้จ่ายเรื่อง Runtime สำหรับ CSS-in-JS บน Production (ใช้วิธี Extraction)

### Fonts
- [ ] จำกัดครอบครัวฟอนต์ที่ 2–3 แบบ, แบบละ 2–3 น้ำหนัก (น้ำหนักที่เพิ่มขึ้น 1 อันเท่ากับ 1 request เสมอ)
- [ ] ใช้ฟอนต์รูปแบบ WOFF2 เท่านั้น (เล็กสุด, รองรับครอบคลุมสุด — ข้าม WOFF/TTF/EOT ไปเลย)
- [ ] โฮสต์ด้วยตัวเอง (Self-hosted) เมื่อเป็นไปได้ (การใช้ CDN แบบ Third-party เพิ่มการทำงานของ DNS + TCP + TLS)
- [ ] ฟอนต์ที่จำเป็นต่อ LCP ถูกตั้งเป็น Preload: `<link rel="preload" as="font" type="font/woff2" crossorigin>`
- [ ] ตั้ง `font-display: swap` (หรือ `optional` สำหรับอันที่ไม่สำคัญ) เพื่อหลีกเลี่ยง FOIT ที่บล็อกการเรนเดอร์
- [ ] มีการกำหนด Subset ผ่าน `unicode-range` เพื่อโหลดเฉพาะตัวอักษรที่แต่ละหน้าต้องการ
- [ ] ลองพิจารณา Variable fonts หากต้องการหลายน้ำหนัก/หลายสไตล์ (ไฟล์เดียวทดแทนได้ทั้งหมด)
- [ ] ปรับเมตริกของ Fallback font ด้วย `size-adjust`, `ascent-override`, `descent-override` เพื่อลด CLS ตอนฟอนต์เปลี่ยน
- [ ] ควรพิจารณากลุ่ม System font ก่อนที่จะใช้ฟอนต์ปรับแต่งเอง (Custom font)

### Network
- [ ] ไฟล์ Static (ภาพ, สคริปต์) ถูกตั้ง Cache ด้วย `max-age` นานๆ + การทำ Content hashing
- [ ] การตอบสนองของ API มีการทำ Cache ตามความเหมาะสม (`Cache-Control`)
- [ ] เปิดใช้งาน HTTP/2 หรือ HTTP/3
- [ ] รีซอร์สมีการ Preconnect (`<link rel="preconnect">`) ไว้ล่วงหน้าสำหรับโดเมนที่รู้จัก
- [ ] ใช้ `fetchpriority` กับรีซอร์สสำคัญๆ ที่ไม่ใช่รูปภาพ (เช่น `<link rel="preload">` หลักๆ หรือ `<script>` ที่แสดงเหนือส่วน Above-the-fold) — ไม่ใช่ใช้แค่บน `<img>`
- [ ] ไม่มีการทำ Redirect ที่ไม่จำเป็น

### Rendering
- [ ] ไม่เกิด Layout thrashing (การบังคับจัดหน้าแบบซิงโครนัส)
- [ ] แอนิเมชันใช้ `transform` และ `opacity` (เพื่อใช้ GPU ช่วยเร่งความเร็ว)
- [ ] รายการ (List) ที่ยาวมากๆ ใช้ Virtualization (เช่น `react-window`)
- [ ] ไม่มีการ Re-render ทั้งหน้าที่ไม่จำเป็น
- [ ] ส่วนที่อยู่หลุดจอไป (Off-screen) ใช้ `content-visibility: auto` ร่วมกับ `contain-intrinsic-size` เพื่อข้ามการ Layout/Paint ส่วนที่ไม่เห็น
- [ ] ไม่มีตัวจัดการ `unload` event และไม่มี `Cache-Control: no-store` ที่ฝั่ง HTML responses — เพื่อรักษาคุณสมบัติการรองรับ Back/forward cache (bfcache)

## Backend Checklist

### Database
- [ ] ไม่มีรูปแบบการคิวรีแบบ N+1 (ใช้ Eager loading / Joins แทน)
- [ ] คิวรีมี Indexes ที่เหมาะสม
- [ ] Endpoint ของ List ข้อมูล มีการทำ Pagination เสมอ (ห้ามใช้ `SELECT * FROM table` เด็ดขาด)
- [ ] มีการตั้งค่า Connection pooling
- [ ] เปิดใช้งาน Slow query logging

### API
- [ ] ใช้เวลาตอบสนอง < 200ms (p95)
- [ ] ไม่มีการประมวลผลหนักๆ แบบซิงโครนัส (Synchronous) ใน Request handlers
- [ ] ทำ Bulk operations แทนการวนลูปเรียกฟังก์ชันทีละตัว
- [ ] บีบอัดข้อมูลตอบสนอง (Response compression) (gzip/brotli)
- [ ] ใช้ระบบ Caching ที่เหมาะสม (in-memory, Redis, CDN)

### Infrastructure
- [ ] มี CDN สำหรับไฟล์ Static
- [ ] เซิร์ฟเวอร์ตั้งอยู่ใกล้ผู้ใช้ (หรือใช้ Edge deployment)
- [ ] กำหนดค่า Horizontal scaling เผื่อไว้ (ถ้าจำเป็น)
- [ ] มี Endpoint สำหรับเช็คสถานะ (Health check) ให้ Load balancer ใช้งาน

## Measurement Commands

### ข้อมูลภาคสนาม (Field data) ของ INP และ Workflow ของ DevTools

1. **เช็คข้อมูลภาคสนามก่อน** — ดูที่ [CrUX Vis](https://developer.chrome.com/docs/crux/vis) หรือเครื่องมือ RUM ของคุณ เพื่อดู INP ของผู้ใช้จริงก่อนที่จะลงมือปรับจูน
2. **ระบุส่วนโต้ตอบที่ช้า** — เปิด DevTools → แท็บ Performance → ทำการ Record ขณะทดลองโต้ตอบ ค้นหางานที่ใช้เวลานาน (Long tasks) ที่เกิดจากการคลิก/กดคีย์บอร์ด
3. **ทดสอบบนอุปกรณ์ Android ระดับกลาง** — ปัญหา INP มักปรากฏในฮาร์ดแวร์ที่ช้ากว่า ให้ใช้อุปกรณ์จริง หรือเปิด CPU throttling ใน DevTools (หน่วงประมาณ 4×–6×)

```bash
# เครื่องมือ Lighthouse CLI
npx lighthouse https://localhost:3000 --output json --output-path ./report.json

# วิเคราะห์ขนาด Bundle
npx webpack-bundle-analyzer stats.json
# หรือสำหรับ Vite:
npx vite-bundle-visualizer

# ตรวจสอบขนาด Bundle โดยรวม
npx bundlesize

# เช็ค Web Vitals จากโค้ด
import { onLCP, onINP, onCLS } from 'web-vitals';
onLCP(console.log);
onINP(console.log);
onCLS(console.log);

# เช็ค INP พร้อมรายละเอียดเชิงลึกแบบโต้ตอบ (Attribution build)
import { onINP } from 'web-vitals/attribution';
onINP(({ value, attribution }) => {
  const { interactionTarget, inputDelay, processingDuration, presentationDelay } = attribution;
  console.log({ value, interactionTarget, inputDelay, processingDuration, presentationDelay });
});
```

## Common Anti-Patterns

| ข้อผิดพลาดทั่วไป (Anti-Pattern) | ผลกระทบ | วิธีแก้ |
|---|---|---|
| การคิวรีแบบ N+1 | ภาระของ DB โตแบบเชิงเส้น | ใช้ Joins, Includes, หรือ Batch loading |
| คิวรีที่ไม่มีขอบเขต | ทรัพยากรหน่วยความจำหมด, เกิด Timeouts | ทำ Pagination เสมอ, ใส่ LIMIT |
| ไม่มี Indexes | การอ่านช้าเมื่อข้อมูลโตขึ้น | เพิ่ม Indexes ให้คอลัมน์ที่ถูกฟิลเตอร์หรือจัดเรียง |
| Layout thrashing | เกิดอาการกระตุก (Jank), เฟรมร่วง | ทำ Batch ให้กับการอ่าน DOM แล้วค่อยเขียนทีเดียว |
| รูปภาพไม่ผ่านการปรับขนาด | ทำให้ LCP ช้า, สิ้นเปลือง Bandwidth | ใช้ WebP, ระบุ Responsive sizes, ใช้ Lazy load |
| Bundle ใหญ่เกินไป | Time to Interactive ช้า | ใช้ Code split, Tree shake, ตรวจสอบ Dependencies |
| การบล็อก Main thread | INP แย่, UI ไม่ตอบสนอง | ซอยย่อย Long tasks ด้วย `scheduler.yield()` / `yieldToMain`, โยนงานให้ Web Workers |
| อาการหน่วยความจำรั่วไหล (Memory leaks) | กินเมมมอรี่สะสม, ส่งผลให้โปรแกรมค้าง/แครช | ล้าง Listeners, Intervals, Refs เมื่อไม่ใช้งานแล้ว |
