---
name: performance-optimization
description: ทำแอปพลิเคชันให้ทำงานได้เร็วขึ้น ปรับแต่งรีดประสิทธิภาพให้ถึงขีดสุด ใช้เมื่อมีข้อกำหนดสเปกด้านความเร็วที่ต้องทำ, เมื่อแอบสงสัยว่ามันเริ่มอืด(performance regressions), หรือต้องการให้คะแนน Core Web Vitals รวมทั้งความเร็วการโหลดดีขึ้น ใช้เมื่อเครื่องมือโปรไฟล์แสดงให้เห็นปัญหาคอขวดที่ต้องได้รับการแก้ไข
---

# Performance Optimization

## Overview

ต้องจับเวลาวัดผลก่อนที่จะเริ่มดัดแปลงให้ทำงานเร็วขึ้น (optimize) การทำงานเกี่ยวกับความเร็วที่ไม่ได้จับเวลาวัดผลก็คือการนั่งเดาสุ่ม — และการเดาสุ่มมักจะนำไปสู่การด่วนสรุปทำก่อนเวลาอันควร (premature optimization) ซึ่งเป็นการเพิ่มความซับซ้อนให้โค้ดโดยไม่ได้ไปช่วยพัฒนาจุดที่สำคัญเลย จงเริ่มด้วยการทำ profile วัดสถิติ, ชี้เป้าคอขวดตัวต้นเหตุให้เจอ, ซ่อมมัน, แล้วจับเวลาวัดผลอีกรอบ ลงมือปรับปรุงแก้ไขเฉพาะจุดที่มีผลการวัดชี้ชัดแล้วว่ามันมีความสำคัญจริงๆ เท่านั้น

## When to Use

- มีข้อบังคับเรื่องประสิทธิภาพระบบโผล่อยู่ใน spec (เช่น จำกัดโควต้าเวลาดาวน์โหลดหน้าโหลด (load time budgets), หรือข้อตกลงเรื่องความเร็วในการโต้ตอบ (response time SLAs))
- ผู้ใช้หรือระบบหลังบ้านโวยวายรายงานเข้ามาว่าระบบมีอาการอืดและหน่วง
- คะแนน Core Web Vitals ตกเกณฑ์มาตรฐาน
- คุณสงสัยว่าการแก้โค้ดรอบล่าสุดอาจจะทำให้ระบบอืดลง (regression)
- กำลังพัฒนารองรับฟีเจอร์ที่ต้องรับมือกับข้อมูลขนาดมหึมา หรือคนที่เข้ามาใช้งานพร้อมกันเยอะๆ (high traffic)

**เมื่อใดที่ไม่ควรใช้:** อย่าเพิ่งรีบไปอัปเกรดปรับปรุง (optimize) จนกว่าคุณจะมีหลักฐานยืนยันว่ามีปัญหาเกิดขึ้นจริงๆ การไปทำ premature optimization นำพามาซึ่งความซับซ้อนที่ต้องจ่ายแพงกว่าประสิทธิภาพที่ได้รับกลับมา

## Core Web Vitals Targets (เป้าหมายมาตรฐานของเว็บ)

| เกณฑ์ชี้วัด (Metric) | ดีเยี่ยม (Good) | ต้องพัฒนาอีก (Needs Improvement) | แย่มาก (Poor) |
|--------|------|-------------------|------|
| **LCP** (ชิ้นส่วนหลักโหลดเสร็จ) | ≤ 2.5 วินาที | ≤ 4.0 วินาที | > 4.0 วินาที |
| **INP** (ดีเลย์หลังจากปุ่มโดนกด) | ≤ 200 ms | ≤ 500 ms | > 500 ms |
| **CLS** (อาการเว็บกระตุกขยับ) | ≤ 0.1 | ≤ 0.25 | > 0.25 |

## The Optimization Workflow (ขั้นตอนการทำงาน)

```
1. MEASURE (จับเวลา)   → สร้างบรรทัดฐานตัวเลขเปรียบเทียบ(baseline)โดยใช้ข้อมูลจริง
2. IDENTIFY (ชี้เป้า)  → ค้นหาจุดคอขวดตัวจริงเสียงจริง (อย่าไปทึกทักเดาเอาเอง)
3. FIX (ลงมือซ่อม)       → เข้าจัดการกับคอขวดที่พบเจอ
4. VERIFY (ตรวจสอบซ้ำ)    → จับเวลาวัดผลอีกรอบ, และยืนยันว่าสถิติดีขึ้นจริงๆ
5. GUARD (วางเวรยาม)     → เพิ่มระบบแจ้งเตือนมอนิเตอร์ หรือทำ tests ไม่ให้มันกลับมาอืดอีก
```

### Step 1: Measure (จับเวลา)

สองวิธีการที่ช่วยหนุนเสริมกัน — จงใช้มันทั้งคู่เลย:

- **จำลองการจับเวลาแบบสังเคราะห์ (Synthetic เช่น Lighthouse, แถบ Performance ของ DevTools):** อยู่ภายใต้สภาพแวดล้อมควบคุม, ตรวจสอบซ้ำได้ เหมาะแก่การทำ CI regression detection (จับโกหกว่าอืดไหม) และแยกแยะตัวปัญหาออกจากชาวบ้าน
- **ดึงจากสถานการณ์จริง (RUM เช่น web-vitals library, CrUX):** ตัวเลขของจริงในสภาพแวดล้อมการใช้งานจริง เป็นสิ่งที่ขาดไม่ได้สำหรับใช้อ้างอิงว่าการซ่อมครั้งนี้ทำให้ผู้ใช้งานได้ประสบการณ์ที่ดีขึ้นจริงๆ หรือไม่

**หน้าบ้าน (Frontend):**
```bash
# Synthetic: รัน Lighthouse ใน Chrome DevTools (หรือทำใน CI)
# ไปที่ Chrome DevTools → แถบ Performance → กด Record (บันทึก)
# Chrome DevTools MCP → ดูประวัติ Performance trace

# RUM: ฝัง Web Vitals library ในโค้ด
import { onLCP, onINP, onCLS } from 'web-vitals';

onLCP(console.log);
onINP(console.log);
onCLS(console.log);
```

**หลังบ้าน (Backend):**
```bash
# บันทึกล็อกระยะเวลาตอบกลับของระบบ (Response time logging)
# ติดตั้งตัว APM (Application Performance Monitoring) สำหรับติดตามสถานะประสิทธิภาพแอป 
# ดูล็อกระยะเวลาการดึงคิวรีข้อมูล (Database query logging)

# การจับเวลาแบบง่ายๆ
console.time('db-query');
const result = await db.query(...);
console.timeEnd('db-query');
```

### Where to Start Measuring (เริ่มจับเวลาที่ตรงไหนก่อนดี)

ดูตามอาการ เพื่อตัดสินใจว่าจะเริ่มจับเวลาที่ตรงไหน:

```
อะไรที่มันช้าล่ะ?
├── จังหวะโหลดหน้าเว็บครั้งแรก
│   ├── ไฟล์ก้อนโตเกินไปหรือเปล่า? --> เช็คขนาดไฟล์ bundle, ตรวจสอบการหั่นแบ่งโค้ด (code splitting)
│   ├── เซิร์ฟเวอร์ส่งการโต้ตอบมาช้าไหม? --> จับเวลา TTFB ผ่านหน้าต่างน้ำตก (Network waterfall) ใน DevTools
│   │   ├── DNS ช้าไหม? --> ทำระบบเตรียม dns-prefetch / preconnect สำหรับแหล่งเว็บไซต์ที่ใช้งานบ่อยๆ
│   │   ├── TCP/TLS ช้าไหม? --> เปิดใช้ HTTP/2, ตรวจสอบจุดวางเซิร์ฟเวอร์ย่อย(edge deployment), และเปิด keep-alive
│   │   └── เซิร์ฟเวอร์ดองงานนานไปไหม? --> ไปตรวจสอบหลังบ้าน(Profile backend), เช็คเรื่องการค้นคิวรี(queries)และการแคชข้อมูล(caching)
│   └── โดนทรัพยากรตัวอื่นบล็อกการแสดงผล (Render-blocking) ไหม? --> ไปดูหน้าต่างน้ำตก เพื่อหา CSS/JS ตัวต้นเรื่อง
├── จังหวะตอบสนองผู้ใช้รู้สึกหนืดๆ
│   ├── หน้าจอค้างไปเลยตอนที่กดคลิก? --> ไปจับเวลาเธรดหลัก(Profile main thread), มองหางานที่ค้างเต่งนานๆ (long tasks นานกว่า >50ms)
│   ├── กรอกฟอร์มแล้วแล็ก(lag)? --> ตรวจสอบเรื่องหน้าจอกระพริบซ้ำ (re-renders), หรือต้นทุนความอืดของตัว controlled component
│   └── อนิเมชันกระตุกสะดุดกึกกัก (jank)? --> ตรวจดูอาการ Layout thrashing (เบียดกันกระจาย), หรือมีการบังคับให้หน้าจอต้องคำนวณตำแหน่งใหม่ (forced reflows)
├── หน้าเว็บตอนโหลดข้ามหน้าไปแล้ว
│   ├── จังหวะโหลดข้อมูลใหม่? --> จับเวลาดูความเร็ว API (API response times), เช็คเรื่องการรอดาวน์โหลดเป็นน้ำตก (waterfalls)
│   └── การวาดเรนเดอร์ฝั่งลูกค้า? --> จับเวลาความเร็วในการเรนเดอร์ของตัว Component(Profile component), และเช็คเพื่อป้องกันพวก N+1 fetches
└── ในส่วนของ Backend / API
    ├── ช้าแค่ endpoint ตัวเดียวหรือเปล่า? --> ไปจับเวลาดู Database queries, เช็คพวกเรื่อง indexes
    ├── หรือช้ามันทุก endpoints เลย? --> ไปเช็คส่วนของการกองเชื่อมต่อ (connection pool), เช็คแรม(memory), เช็ค CPU
    └── ผีเข้าผีออก ช้าบ้างเป็นบางทีหรือเปล่า? --> ไปเช็คเรื่องการแย่งทรัพยากร(lock contention), อาการกระตุกจากการเก็บขยะของระบบ(GC pauses), หรือพวก dependencies จากที่อื่น
```

### Step 2: Identify the Bottleneck (ชี้เป้าหาจุดคอขวด)

คอขวดทั่วไปแบ่งตามหมวดหมู่:

**หน้าบ้าน (Frontend):**

| อาการหน่วง | สาเหตุที่เป็นไปได้สูง | สิ่งที่ต้องสืบสวน |
|---------|-------------|---------------|
| LCP โผล่ช้ามาก | รูปภาพใหญ่เบ้อเริ่ม, โดนสกัดการโหลด(render-blocking), เซิร์ฟเวอร์เต่าคลาน | ไปเช็ค Network waterfall, ดูขนาดไฟล์รูปภาพ |
| CLS ขึ้นปรี๊ดสูงมาก | รูปภาพไม่ได้โดนบีบขนาด(dimensions), ข้อมูลตัวท้ายๆเพิ่งโผล่มาดัน, ฟอนต์แอบเปลี่ยน | เช็คว่าใครเป็นตัวก่อเรื่องให้เกิด Layout shift |
| INP แย่เกินรับไหว | ยัดจาวาสคริปต์ลงเธรดหลัก (main thread) หนักมือไปหน่อย, การดัดแปลง DOM ที่ใหญ่เกินเหตุ | ตรวจดูพวกกระบวนการอืดๆ (long tasks) ในตาราง Performance trace |
| โหลดครั้งแรกโคตรช้า | ก้อน Bundle มีขนาดมหาศาล, ร้องขอเน็ตเวิร์คจำนวนมากยิบย่อย | เช็คขนาดก้อน Bundle size, ตรวจการหั่นแบ่งโค้ด (code splitting) |

**หลังบ้าน (Backend):**

| อาการหน่วง | สาเหตุที่เป็นไปได้สูง | สิ่งที่ต้องสืบสวน |
|---------|-------------|---------------|
| ตัว APIs โต้ตอบช้า | N+1 queries ทะลัก, ลืมทำ indexes, หรือไม่ยอมปรับแต่ง queries | ตรวจดูประวัติล็อกของ Database query |
| เมมบวม แรมกระฉูด | ข้อมูลขยะไม่มีใครเคลียร์ (Leaked references), ทำระบบแคชแต่ไม่กำหนดลิมิต(unbounded caches), ก้อนข้อมูลหนักเกินพิกัด | ผ่าชันสูตรก้อนหน่วยความจำ (Heap snapshot analysis) |
| CPU พุ่งปรี๊ด (spikes) | เจอประมวลผลทางคณิตศาสตร์แบบ synchronous เพียวๆ, หรือ regex ดันกินเวลาตามหลัง (regex backtracking) | จับเวลาซีพียู (CPU profiling) |
| ค่าหน่วง Ping (latency) สูงทะลุเพดาน | ขาดการทำ แคชชิ่ง(caching), ขยันคำนวณซ้ำซ้อน(redundant computation), มัวแต่วิ่งอ้อมเน็ตเวิร์ค (network hops) | ไล่ล่าเส้นทางที่ Request วิ่งไปตามกองของ stack ทั้งหมด |

### Step 3: Fix Common Anti-Patterns (เข้าซ่อมแซมแพทเทิร์นแย่ๆ ยอดฮิต)

#### N+1 Queries (ของฝั่ง Backend)

```typescript
// แย่มาก (BAD): นี่แหละ N+1 — ไปไล่คิวรีหาชื่อเจ้าของให้กับ 1 งาน แถมต้องทำซ้ำสำหรับทุกงาน
const tasks = await db.tasks.findMany();
for (const task of tasks) {
  task.owner = await db.users.findUnique({ where: { id: task.ownerId } });
}

// ดีเยี่ยม (GOOD): รวบยอดคิวรีเดียวจบ ผ่านกระบวนการ join/include
const tasks = await db.tasks.findMany({
  include: { owner: true },
});
```

#### Unbounded Data Fetching (ตักข้อมูลมาแบบไม่บันยะบันยัง)

```typescript
// แย่มาก (BAD): กวาดข้อมูลกลับมาแบบไม่เหลียวแลพระอินทร์
const allTasks = await db.tasks.findMany();

// ดีเยี่ยม (GOOD): มีการทำหน้าแบ่งกั้น จำกัดลิมิตให้ชัดเจน (Paginated)
const tasks = await db.tasks.findMany({
  take: 20,
  skip: (page - 1) * 20,
  orderBy: { createdAt: 'desc' },
});
```

#### Missing Image Optimization (ของฝั่ง Frontend หลงลืมบีบอัดภาพ)

```html
<!-- แย่มาก (BAD): ไม่กะขนาดอะไรเลย, ไม่จัดการเรื่อง format สักนิด -->
<img src="/hero.jpg" />

<!-- ดีเยี่ยม (GOOD): ภาพฮีโร่ / องค์ประกอบแบบ LCP — ใช้ศิลปะเข้าสู้ (art direction) + ปรับความละเอียดให้ตรงกับเครื่อง (resolution switching), พร้อมสิทธิพิเศษลำดับต้น (high priority) -->
<!--
  การคอมโบ 2 เทคนิคประสาน:
  - Art direction (ผ่านมีเดีย media): จัดองค์ประกอบ/ตัดส่วน ให้เข้ากับจอแต่ละจุดตกกระทบ (breakpoint)
  - Resolution switching (ผ่าน srcset + sizes): สลับเรียกไฟล์ที่มีความละเอียดพอดีเป๊ะตามความคมชัดหน้าจอ
-->
<picture>
  <!-- โหมดมือถือ: ตัดมุมแนวตั้ง (8:10) -->
  <source
    media="(max-width: 767px)"
    srcset="/hero-mobile-400.avif 400w, /hero-mobile-800.avif 800w"
    sizes="100vw"
    width="800"
    height="1000"
    type="image/avif"
  />
  <source
    media="(max-width: 767px)"
    srcset="/hero-mobile-400.webp 400w, /hero-mobile-800.webp 800w"
    sizes="100vw"
    width="800"
    height="1000"
    type="image/webp"
  />
  <!-- โหมดพีซี Desktop: แนวนอนยาวๆ (2:1) -->
  <source
    srcset="/hero-800.avif 800w, /hero-1200.avif 1200w, /hero-1600.avif 1600w"
    sizes="(max-width: 1200px) 100vw, 1200px"
    width="1200"
    height="600"
    type="image/avif"
  />
  <source
    srcset="/hero-800.webp 800w, /hero-1200.webp 1200w, /hero-1600.webp 1600w"
    sizes="(max-width: 1200px) 100vw, 1200px"
    width="1200"
    height="600"
    type="image/webp"
  />
  <img
    src="/hero-desktop.jpg"
    width="1200"
    height="600"
    fetchpriority="high"
    alt="Hero image description"
  />
</picture>

<!-- ดีเยี่ยม (GOOD): ภาพล่างๆ ลงไป (Below-the-fold) — ค่อยๆ โหลดช้าๆ (lazy loaded) + จัดการถอดรหัสลับหลัง (async decoding) -->
<img
  src="/content.webp"
  width="800"
  height="400"
  loading="lazy"
  decoding="async"
  alt="Content image description"
/>
```

#### Unnecessary Re-renders (ใน React หน้าจอเรนเดอร์ย้ำๆ ทั้งที่ไม่มีอะไรเปลี่ยน)

```tsx
// แย่มาก (BAD): สร้างอ็อบเจกต์ใหม่กิ๊กออกมาทุกครั้งที่มีการ render, ทำลูกหลานพลอยซวยต้องเรนเดอร์ตัวเองใหม่ตามไปด้วย
function TaskList() {
  return <TaskFilters options={{ sortBy: 'date', order: 'desc' }} />;
}

// ดีเยี่ยม (GOOD): ตั้งค่าทิ้งไว้แบบนิ่งๆ คงทน (Stable reference)
const DEFAULT_OPTIONS = { sortBy: 'date', order: 'desc' } as const;
function TaskList() {
  return <TaskFilters options={DEFAULT_OPTIONS} />;
}

// ให้เรียกใช้งาน React.memo สำหรับ components ที่กินแรงเครื่องเยอะ
const TaskItem = React.memo(function TaskItem({ task }: Props) {
  return <div>{/* โค้ดเรนเดอร์กินแรงเครื่อง */}</div>;
});

// ให้เรียกใช้งาน useMemo สำหรับการคำนวณที่ดูดพลังเครื่องมหาศาล
function TaskStats({ tasks }: Props) {
  const stats = useMemo(() => calculateStats(tasks), [tasks]);
  return <div>{stats.completed} / {stats.total}</div>;
}
```

#### Large Bundle Size (ไฟล์ Bundle อ้วนบวมน้ำ)

```typescript
// พวก bundlers รุ่นใหม่ๆ (อย่าง Vite, webpack 5+) สามารถจัดการเขย่าโค้ดพวกตัวแปร named imports ที่ไม่มีใครใช้ให้ร่วงหลุดไปเองได้ (tree-shaking automatically),
// โดยมีข้อแม้ว่า dependency นั้นต้องรองรับ ESM และถูกแปะป้าย `sideEffects: false` ไว้ใน package.json แล้วนะ.
// อย่าลืมทำ Profile ดูก่อนที่จะรื้อวิธี imports — เพราะทางลัดกำไรสูงๆ จริงๆ แล้วมาจากการรื้อแบ่งโค้ด (splitting) และค่อยๆ ทยอยโหลด (lazy loading) ต่างหากล่ะ.

// ดีเยี่ยม (GOOD): เลือกนำเข้าข้อมูลตามสั่ง(Dynamic import) สำหรับฟีเจอร์ตัวบิ๊กเบิ้ม ที่นานๆ จะมีคนโผล่มาใช้ที
const ChartLibrary = lazy(() => import('./ChartLibrary'));

// ดีเยี่ยม (GOOD): หั่นโค้ดแบบ Route-level (Route-level code splitting) และครอบกันหนาวด้วย Suspense
const SettingsPage = lazy(() => import('./pages/Settings'));

function App() {
  return (
    <Suspense fallback={<Spinner />}>
      <SettingsPage />
    </Suspense>
  );
}
```

#### Missing Caching (ทางฝั่ง Backend ขาดการจดจำแคช)

```typescript
// หมั่นจดจำข้อมูลที่คนอ่านบ่อย แต่ข้อมูลไม่ค่อยขยับ (Cache frequently-read, rarely-changed data)
const CACHE_TTL = 5 * 60 * 1000; // ให้จำไว้ 5 นาที
let cachedConfig: AppConfig | null = null;
let cacheExpiry = 0;

async function getAppConfig(): Promise<AppConfig> {
  if (cachedConfig && Date.now() < cacheExpiry) {
    return cachedConfig;
  }
  cachedConfig = await db.config.findFirst();
  cacheExpiry = Date.now() + CACHE_TTL;
  return cachedConfig;
}

// แปะใบปะหน้า HTTP caching headers ไว้สำหรับเก็บของพวกไฟล์ตายตัว(static assets)
app.use('/static', express.static('public', {
  maxAge: '1y',           // สั่งให้จำใส่หัวไว้เลย 1 ปี
  immutable: true,        // ห้ามทบทวนตรวจสอบซ้ำใดๆ เด็ดขาด (ใช้การตีตรา content hashing ฝังเข้าไปในชื่อไฟล์เอา)
}));

// ควบคุมใบสั่งแคช (Cache-Control) ไว้สำหรับการตอบรับของ API
res.set('Cache-Control', 'public, max-age=300'); // ให้จำไว้ 5 นาที
```

## Performance Budget (งบประมาณด้านความเร็ว)

ตั้งงบประมาณจำกัดเอาไว้ แล้วบังคับใช้ให้จริงจัง:

```
ก้อน JavaScript bundle: < ต้องไม่เกิน 200KB เมื่อบีบอัด gzipped (สำหรับหน้าโหลดครั้งแรก)
โค้ด CSS: < ต้องไม่เกิน 50KB gzipped
รูปภาพ (Images): < ต้องไม่เกิน 200KB ต่อหนึ่งภาพ (เฉพาะส่วนบนของเว็บที่มองเห็นเลย without scrolling)
ฟอนต์ (Fonts): < ต้องไม่เกิน 100KB มัดรวมกัน
API โต้ตอบ (API response time): < ต้องไวกว่า 200ms (p95)
พร้อมสัมผัส (Time to Interactive): < ต้องไวกว่า 3.5s ภายใต้เน็ตมือถือ 4G
คะแนนความเร็วของ Lighthouse (Lighthouse Performance score): ≥ ต้องมากกว่าหรือเท่ากับ 90 คะแนน
```

**บังคับใช้ใน CI:**
```bash
# ตรวจหุ่นก้อน Bundle 
npx bundlesize --config bundlesize.config.json

# ระบบของ Lighthouse CI
npx lhci autorun
```

## See Also (ดูเพิ่มเติม)

สำหรับเช็คลิสต์ตรวจสอบประสิทธิภาพแบบละเอียดยิบ, คำสั่งลัดในการ optimization, และคู่มือแพทเทิร์นสุดสยองที่ควรหลีกเลี่ยง, โปรดดู `references/performance-checklist.md`.


## Common Rationalizations (ข้ออ้างทั่วไป)

| ข้ออ้าง | ความเป็นจริง |
|---|---|
| "เดี๋ยวเราค่อยมาเร่งความเร็วระบบวันหลังละกัน" | หนี้สินด้านความเร็วมันจะพอกพูนนะ ซ่อมพวกแพทเทิร์นห่วยๆ ที่เห็นกันชัดๆ ไปเลยตั้งแต่วันนี้ ส่วนพวกของจุ๊กจิ๊ก micro-optimizations เดี๋ยวค่อยทำก็ได้ |
| "รันในเครื่องฉันมันก็พุ่งปรี๊ดเลยนะ" | เครื่องของคุณไม่ใช่เครื่องของผู้ใช้นะสิ ไปลองทำ Profile บนฮาร์ดแวร์และเน็ตเวิร์คในระดับเดียวกันกับผู้ใช้ทั่วไปดูสิ |
| "อัปเกรดตัวนี้แหละ ใช่เลย เห็นๆ กันอยู่" | ถ้าคุณไม่ได้วัดสถิติจับเวลา คุณก็ไม่มีทางรู้หรอก ไปทำ Profile ดูก่อนเถอะ |
| "ผู้ใช้เขาไม่มานั่งรู้สึกตัวหรอกน่า กับอีแค่ 100ms เนี่ย" | งานวิจัยโชว์หลาเลยว่า 100ms ส่งผลต่อพฤติกรรมยอดซื้อ (conversion rates) นะ ผู้ใช้เขารู้สึกได้เยอะกว่าที่คุณคิด |
| "เรื่องความเร็วเดี๋ยวตัว framework มันจัดการให้เองแหละ" | Frameworks มันช่วยกันปัญหาได้บ้าง แต่มันไม่ได้เทพขนาดซ่อม N+1 queries หรือเสกให้ไฟล์ bundle ใหญ่ยักษ์เล็กลงได้หรอกนะ |

## Red Flags (สัญญาณเตือนภัย)

- มีการทำ Optimization ทั้งๆ ที่ยังไม่มีข้อมูลจากการโปรไฟล์(profiling data) มารับรองเลย
- พบเจอแพทเทิร์น N+1 query อยู่ในระบบการดึงข้อมูลเพียบ
- ปล่อย endpoints ที่ลิสต์รายการยาวๆ ออกไปโดยไม่มีระบบแบ่งหน้า (pagination)
- รูปภาพไม่มีการบีบขนาด(dimensions), ไม่มีการทำทยอยโหลด (lazy loading), หรือไม่ยอมปรับขนาดย่อขยายตามอุปกรณ์หน้าจอ(responsive sizes)
- ปล่อยปละละเลยให้ก้อน Bundle size อ้วนฉุเติบโตโดยไม่มีการตรวจสอบใดๆ
- ไม่ยอมติดตั้งระบบมอนิเตอร์ความเร็วในโปรเจกต์ที่ใช้งานจริงบน production
- พบคำสั่ง `React.memo` และ `useMemo` โผล่เกลื่อนเต็มไปหมด (การใช้มากไปก็พังพอๆ กับการไม่ใช้เลยนั่นแหละ)

## Verification

หลังจากการแก้ไขทุกครั้งที่ส่งผลต่อประสิทธิภาพ (performance):

- [ ] มีผลการวัดสถิติเปรียบเทียบทั้ง ก่อนทำ (Before) และ หลังทำ (After) ยืนยัน (ตัวเลขเฉพาะเจาะจง)
- [ ] ระบุตัวคอขวดได้อย่างชัดเจน และถูกเข้าซ่อมแซมเรียบร้อยแล้ว
- [ ] คะแนน Core Web Vitals ยังคงอยู่ในเกณฑ์ระดับ "ยอดเยี่ยม (Good)"
- [ ] ขนาดของ Bundle ต้องไม่ดีดตัวบวมฉุขึ้นอย่างเห็นได้ชัด
- [ ] ห้ามมี N+1 queries โผล่ในตรรกะระบบการดึงข้อมูลที่เขียนขึ้นใหม่เด็ดขาด
- [ ] สอบผ่านเกณฑ์ตัวเลขงบประมาณประสิทธิภาพ (Performance budget) ใน CI (ถ้ามีการตั้งค่าไว้)
- [ ] ตัว tests เก่าๆ ที่มีอยู่ ยังคงรันผ่านฉลุย (การ optimization ต้องไม่ไปทำพฤติกรรมของเก่าพัง)
