---
name: frontend-ui-engineering
description: สร้าง UI ระดับ Production-quality ใช้เมื่อต้องสร้างหรือแก้ไขหน้าตาการใช้งานที่ผู้ใช้มองเห็น (user-facing interfaces) ใช้เมื่อต้องการสร้าง components, วางโครงสร้าง layouts, จัดการ state, หรือเมื่อผลลัพธ์ต้องการความสวยงามเนี๊ยบระดับมืออาชีพ มากกว่าจะดูเหมือนงานที่ถูกปั่นมาจาก AI
---

# Frontend UI Engineering

## Overview

สร้างหน้าตาของแอป (UI) ระดับโปรที่รองรับการใช้งานของคนพิการ (accessible), รวดเร็ว (performant), และสวยงามเนี๊ยบ (visually polished) เป้าหมายคือการสร้าง UI ที่ดูเหมือนถูกสร้างขึ้นโดยวิศวกรผู้มีหัวใจรักการออกแบบในบริษัทยักษ์ใหญ่ — ไม่ใช่งานที่ดูรู้เลยว่าใช้ AI ปั่นมา สิ่งนี้หมายความว่าคุณจะต้องทำตามระบบ Design System อย่างเคร่งครัด, รองรับ Accessibility เต็มรูปแบบ, ใส่ใจในพฤติกรรมการโต้ตอบของปุ่มต่างๆ, และบอกลา "ความสวยแบบ AI" (AI aesthetic) ที่ดาดดื่นทั่วไป

## When to Use

- เมื่อต้องการสร้าง UI components หรือสร้างเพจใหม่
- เมื่อต้องแก้ไขหน้าตาอินเทอร์เฟซในส่วนที่ผู้ใช้มองเห็น
- เมื่อต้องทำโครงสร้างให้รองรับหน้าจอหลายขนาด (responsive layouts)
- เมื่อต้องเพิ่มลูกเล่นการโต้ตอบ (interactivity) หรือการจัดการ state
- เมื่อต้องแก้ไขบั๊กทางสายตา (visual) หรือปัญหา UX

## Component Architecture

### File Structure (โครงสร้างไฟล์)

จัดเก็บทุกสิ่งที่เกี่ยวกับ Component นั้นๆ ให้อยู่ในที่เดียวกัน (Colocate):

```
src/components/
  TaskList/
    TaskList.tsx          # ไฟล์โค้ดหลักของ Component 
    TaskList.test.tsx     # ไฟล์ Tests
    TaskList.stories.tsx  # ไฟล์หน้าพรีวิว Storybook (ถ้ามี)
    use-task-list.ts      # Custom hook (ถ้ามี state ที่ซับซ้อน)
    types.ts              # ไฟล์เก็บ Type เฉพาะตัวของ Component (ถ้าจำเป็น)
```

### Component Patterns (รูปแบบการเขียนคอมโพเนนต์)

**เน้นการประกอบร่าง (composition) มากกว่าการส่งค่า Setting (configuration):**

```tsx
// ดี (Good): นำมาประกอบร่างกัน (Composable)
<Card>
  <CardHeader>
    <CardTitle>Tasks</CardTitle>
  </CardHeader>
  <CardBody>
    <TaskList tasks={tasks} />
  </CardBody>
</Card>

// ควรเลี่ยง (Avoid): ยัด Setting ทุกอย่างผ่าน Props (Over-configured)
<Card
  title="Tasks"
  headerVariant="large"
  bodyPadding="md"
  content={<TaskList tasks={tasks} />}
/>
```

**รักษาให้ Component มุ่งเน้นทำหน้าที่เดียว (Keep components focused):**

```tsx
// ดี (Good): ทำหน้าที่แค่อย่างเดียว
export function TaskItem({ task, onToggle, onDelete }: TaskItemProps) {
  return (
    <li className="flex items-center gap-3 p-3">
      <Checkbox checked={task.done} onChange={() => onToggle(task.id)} />
      <span className={task.done ? 'line-through text-muted' : ''}>{task.title}</span>
      <Button variant="ghost" size="sm" onClick={() => onDelete(task.id)}>
        <TrashIcon />
      </Button>
    </li>
  );
}
```

**แยกส่วนที่ไปดึงข้อมูล ออกจากส่วนแสดงผลหน้าจอ (Separate data fetching from presentation):**

```tsx
// กล่องบรรจุ (Container): จัดการเรื่องข้อมูล
export function TaskListContainer() {
  const { tasks, isLoading, error } = useTasks();

  if (isLoading) return <TaskListSkeleton />;
  if (error) return <ErrorState message="Failed to load tasks" retry={refetch} />;
  if (tasks.length === 0) return <EmptyState message="No tasks yet" />;

  return <TaskList tasks={tasks} />;
}

// ส่วนแสดงผล (Presentation): จัดการเรื่องหน้าตา
export function TaskList({ tasks }: { tasks: Task[] }) {
  return (
    <ul role="list" className="divide-y">
      {tasks.map(task => <TaskItem key={task.id} task={task} />)}
    </ul>
  );
}
```

## State Management (การจัดการ State)

**เลือกใช้วิธีที่ง่ายที่สุดเท่าที่จะทำได้:**

```
Local state (useState)           → ตัวแปร State ที่ใช้แค่เฉพาะภายใน Component นั้นๆ
Lifted state                     → ใช้แชร์ระหว่าง Component พี่น้อง ประมาณ 2-3 ตัว
Context                          → ตีมสี (Theme), สถานะล็อกอิน (auth), ภาษา (locale) (เน้นอ่านบ่อย, แก้ไขนานๆ ที)
URL state (searchParams)         → การกรอง (Filters), เลขหน้า (pagination), สถานะบนหน้าจอที่ต้องการก๊อปปี้ลิงก์แชร์ให้คนอื่น
Server state (React Query, SWR)  → ข้อมูลที่ดึงมาจากที่อื่น พร้อมมีระบบแคช (caching)
Global store (Zustand, Redux)    → State ของฝั่งลูกข่ายที่มีความซับซ้อน และต้องแชร์ใช้กันทั้งแอป
```

**หลีกเลี่ยงการเจาะส่ง props (prop drilling) ที่ลึกเกิน 3 ชั้น** หากคุณพบว่าตัวเองต้องส่ง props ผ่าน Component ตรงกลางที่ไม่ได้ใช้ค่านั้นเลย ให้พิจารณาใช้ context หรือจัดโครงสร้าง Component tree เสียใหม่

## Design System Adherence (ยึดมั่นในระบบ Design System)

### Avoid the AI Aesthetic (หลีกเลี่ยงความสวยแบบดาดๆ สไตล์ AI)

งาน UI ที่ถูกสร้างด้วย AI มักจะมีแพทเทิร์นที่เป็นเอกลักษณ์น่าเบื่อ หลีกเลี่ยงรูปแบบเหล่านี้ทั้งหมด:

| สไตล์ Default ของ AI | ทำไมมันถึงเป็นปัญหา | รูปแบบที่มืออาชีพเขาทำกัน (Production Quality) |
|---|---|---|
| ใช้สีม่วง/ครามไปซะทุกอย่าง | โมเดลมักจะเลือกใช้ชุดสี(palettes) ที่ดูแล้ว "ปลอดภัย" ไว้ก่อน, ทำให้ทุกแอปหน้าตาออกมาเหมือนกันหมด | ใช้ชุดสี (color palette) ของโปรเจกต์คุณของจริง |
| บ้ายัดสีไล่เฉด (gradients) เยอะๆ | การไล่เฉดสีก่อให้เกิดขยะทางสายตา และมักจะขัดแย้งกับ Design System ส่วนใหญ่ | ใช้สีพื้นเรียบๆ หรือไล่เฉดเบาๆ ที่ตรงตาม Design System |
| ขอบโค้งมนไปซะทุกสิ่ง (rounded-2xl) | การโค้งมนขอบแบบสุดหลอดเพื่อสื่อถึงความ "เป็นมิตร" แต่เป็นการทำลายลำดับขั้นความสำคัญของรัศมีขอบในงานออกแบบจริง | ใช้รัศมีความโค้ง (border-radius) ที่สม่ำเสมอ ตาม Design System |
| หน้า Hero sections ที่ดูซ้ำซาก | การจัดหน้าตาที่อิงจาก Template โหลๆ โดยไม่มีความเชื่อมโยงกับคอนเทนต์จริงๆ หรือความต้องการของผู้ใช้ | การจัดเลย์เอาต์โดยให้คอนเทนต์เป็นตัวนำ (Content-first layouts) |
| ก็อปข้อความ Lorem ipsum มาใช้ลวกๆ | การใช้ข้อความปลอมๆ (Placeholder text) เป็นการซ่อนปัญหาของการจัด Layout ที่เนื้อหาจริงจะเผยให้เห็น (เช่น ความยาว, การปัดบรรทัด, ข้อความล้นขอบ) | ใช้ข้อความจำลอง (Placeholder content) ที่สมจริง |
| ยัดขอบ padding กว้างๆ ไปหมดทุกที่ | การให้พื้นที่ padding กว้างๆ เท่ากันหมดเป็นการทำลายลำดับความสำคัญทางสายตา และเปลืองพื้นที่หน้าจอโดยใช่เหตุ | ใช้ระบบสเกลระยะห่าง (spacing scale) ที่สม่ำเสมอ |
| การจัด Card ข้อมูลแบบกริดตาราง | การจัดข้อมูลลงกริดสี่เหลี่ยมเท่าๆ กันคือทางลัดที่มองข้ามลำดับความสำคัญของข้อมูล และพฤติกรรมการกวาดสายตา | จัดเลย์เอาต์โดยอิงตามวัตถุประสงค์ของการใช้งาน (Purpose-driven layouts) |
| การออกแบบที่เน้นเงาหนาๆ (Shadow-heavy design) | การซ้อนเงาหลายชั้นเพิ่มมิติที่แข่งกับเนื้อหาหลัก แถมยังทำให้บราวเซอร์กระตุกบนอุปกรณ์สเปคต่ำ | ใช้เงาบางๆ หรือไม่ต้องใช้เงาเลย เว้นแต่ว่า Design System จะระบุไว้ |

### Spacing and Layout (ระยะห่าง และ การจัดวาง)

ใช้สเกลระยะห่างที่สม่ำเสมอ อย่าคิดค้นตัวเลขขึ้นมาเอง:

```css
/* ใช้ระบบสเกล: เพิ่มทีละ 0.25rem (หรือตามแต่สเกลที่โปรเจกต์ใช้งาน) */
/* ดี (Good) */  padding: 1rem;      /* 16px */
/* ดี (Good) */  gap: 0.75rem;       /* 12px */
/* แย่ (Bad) */   padding: 13px;      /* ไม่ตรงกับสเกลไหนเลย */
/* แย่ (Bad) */   margin-top: 2.3rem; /* ไม่ตรงกับสเกลไหนเลย */
```

### Typography (การจัดตัวอักษร)

เคารพลักษณะลำดับความสำคัญของตัวอักษร (type hierarchy):

```
h1 → หัวข้อหลักของเพจ (1 เพจ ควรมีอันเดียว)
h2 → หัวข้อรองของแต่ละ Section
h3 → หัวข้อย่อย (Subsection)
body → ข้อความธรรมดาทั่วไป
small → ข้อความเสริม/ข้อความช่วยเหลือขนาดเล็ก
```

ห้ามข้ามระดับความสำคัญของหัวข้อ (เช่น ข้าม h2 ไป h3) ห้ามเอาสไตล์ของ heading ไปใช้กับเนื้อหาที่ไม่ใช่ heading

### Color (สี)

- ใช้ตัวแปรสีที่มีความหมายในตัว (semantic color tokens): `text-primary`, `bg-surface`, `border-default` — ไม่ใช่ใส่เลขรหัสสี hex ลงไปตรงๆ
- ตรวจสอบให้แน่ใจว่าสีมีความตัดกันเพียงพอ (contrast 4.5:1 สำหรับข้อความปกติ, 3:1 สำหรับข้อความขนาดใหญ่)
- ห้ามใช้แค่ "สี" ในการสื่อความหมายเพียงอย่างเดียว (ให้ใช้ ไอคอน, ข้อความ, หรือลวดลาย ควบคู่ไปด้วย)

## Accessibility (WCAG 2.1 AA) (การเข้าถึงสำหรับคนพิการ)

ทุกคอมโพเนนต์จะต้องผ่านข้อกำหนดมาตรฐานเหล่านี้:

### Keyboard Navigation (การใช้งานด้วยคีย์บอร์ด)

```tsx
// ทุกองค์ประกอบที่ผู้ใช้กดโต้ตอบได้ ต้องสามารถเข้าถึงได้ผ่านคีย์บอร์ด (ปุ่ม Tab)
<button onClick={handleClick}>Click me</button>        // ✓ ได้รับ Focus อัตโนมัติโดยธรรมชาติ
<div onClick={handleClick}>Click me</div>               // ✗ กดปุ่ม Tab มาไม่ถึง
<div role="button" tabIndex={0} onClick={handleClick}    // ✓ แต่ขอแนะนำให้ใช้ <button> ไปเลยจะดีกว่า
     onKeyDown={e => {
       if (e.key === 'Enter') handleClick();
       if (e.key === ' ') e.preventDefault();
     }}
     onKeyUp={e => {
       if (e.key === ' ') handleClick();
     }}>
  Click me
</div>
```

### ARIA Labels (การแปะป้าย ARIA)

```tsx
// ใส่ป้ายบอกชื่อให้กับองค์ประกอบที่ไม่มีข้อความให้เห็นชัดเจน
<button aria-label="Close dialog"><XIcon /></button>

// ใส่ป้ายบอกให้กับ Form inputs
<label htmlFor="email">Email</label>
<input id="email" type="email" />

// หรือใช้ aria-label แทน ในกรณีที่ไม่อยากโชว์ป้ายชื่อ (label) ออกมาทางหน้าจอ
<input aria-label="Search tasks" type="search" />
```

### Focus Management (การควบคุมจุดโฟกัส)

```tsx
// ย้ายจุดโฟกัส เมื่อหน้าคอนเทนต์มีการเปลี่ยนแปลง
function Dialog({ isOpen, onClose }: DialogProps) {
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (isOpen) closeRef.current?.focus();
  }, [isOpen]);

  // Trap focus (ขังจุดโฟกัสไม่ให้กระโดดออกไปข้างนอก) เมื่อเปิด dialog 
  return (
    <dialog open={isOpen}>
      <button ref={closeRef} onClick={onClose}>Close</button>
      {/* เนื้อหาภายใน dialog */}
    </dialog>
  );
}
```

### Meaningful Empty and Error States (หน้าจอว่างเปล่า และ หน้าจอ Error ที่มีความหมาย)

```tsx
// อย่าปล่อยให้หน้าจอขาวโพลนเฉยๆ โดยไม่มีคำอธิบาย
function TaskList({ tasks }: { tasks: Task[] }) {
  if (tasks.length === 0) {
    return (
      <div role="status" className="text-center py-12">
        <TasksEmptyIcon className="mx-auto h-12 w-12 text-muted" />
        <h3 className="mt-2 text-sm font-medium">ไม่มีรายการ (No tasks)</h3>
        <p className="mt-1 text-sm text-muted">เริ่มต้นใช้งานโดยการสร้าง Task ใหม่สิ</p>
        <Button className="mt-4" onClick={onCreateTask}>สร้าง Task ใหม่</Button>
      </div>
    );
  }

  return <ul role="list">...</ul>;
}
```

## Responsive Design (การออกแบบให้รองรับหลายหน้าจอ)

ออกแบบให้มือถือเป็นอันดับแรก (mobile first), แล้วค่อยขยายขนาดขึ้น:

```tsx
// Tailwind: วิธีเขียน responsive แบบ mobile-first
<div className="
  grid grid-cols-1      /* ขนาดมือถือ (Mobile): คอลัมน์เดียว */
  sm:grid-cols-2        /* ขนาดเล็ก (Small): 2 คอลัมน์ */
  lg:grid-cols-3        /* ขนาดใหญ่ (Large): 3 คอลัมน์ */
  gap-4
">
```

ทดสอบการแสดงผลที่จุดแตกหัก (breakpoints) เหล่านี้: 320px, 768px, 1024px, 1440px.

## Loading and Transitions (สถานะกำลังโหลด และลูกเล่นเปลี่ยนผ่าน)

```tsx
// ใช้ Skeleton loading แทนที่การหมุนๆ (spinners) สำหรับเนื้อหา
function TaskListSkeleton() {
  return (
    <div className="space-y-3" aria-busy="true" aria-label="Loading tasks">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="h-12 bg-muted animate-pulse rounded" />
      ))}
    </div>
  );
}

// อัปเดตล่วงหน้า (Optimistic updates) เพื่อหลอกผู้ใช้ให้รู้สึกว่าระบบมันเร็ว
function useToggleTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: toggleTask,
    onMutate: async (taskId) => {
      await queryClient.cancelQueries({ queryKey: ['tasks'] });
      const previous = queryClient.getQueryData(['tasks']);

      queryClient.setQueryData(['tasks'], (old: Task[]) =>
        old.map(t => t.id === taskId ? { ...t, done: !t.done } : t)
      );

      return { previous };
    },
    onError: (_err, _taskId, context) => {
      queryClient.setQueryData(['tasks'], context?.previous);
    },
  });
}
```

## See Also (ดูเพิ่มเติม)

สำหรับข้อบังคับเชิงลึกเกี่ยวกับการเข้าถึง (accessibility) และเครื่องมือทดสอบ, ไปอ่านต่อที่ `references/accessibility-checklist.md`.

## Common Rationalizations (ข้ออ้างทั่วไป)

| ข้ออ้าง | ความเป็นจริง |
|---|---|
| "เรื่อง Accessibility เอาไว้ก่อน ทำทีหลังก็ได้" | มันเป็นข้อบังคับทางกฎหมายในหลายๆ ประเทศเลยนะ และยังเป็นมาตรฐานชี้วัดคุณภาพงานสายวิศวกรรมด้วย |
| "เดี๋ยวเราค่อยไปทำหน้าเว็บให้มัน Responsive วันหลังละกัน" | การไปนั่งแก้รื้อโครงเว็บเดิมให้กลายเป็น Responsive ทีหลัง มันยากกว่าการสร้างเตรียมไว้ตั้งแต่แรกถึง 3 เท่า |
| "หน้าตาดีไซน์มันยังไม่นิ่ง ฉันเลยขี้เกียจใส่สไตล์ลงไป (CSS)" | ใช้ค่าเริ่มต้นจาก Design System สิ การปล่อยให้ UI ขาวโล้น ไม่มีสไตล์ จะสร้างความประทับใจแรกที่ห่วยแตกมากให้กับคนมารีวิวงาน |
| "นี่มันเป็นแค่ตัวต้นแบบ (Prototype)" | โค้ดต้นแบบ มักจะถูกเอาไปสานต่อเป็นระบบ Production เสมอแหละ วางรากฐานให้มันถูกตั้งแต่แรกเถอะ |
| "หน้าตาสไตล์ AI แบบดาดๆ นี่ก็โอเคแล้วมั้ง ตอนนี้" | มันคือป้ายบอกทางที่ตะโกนว่า "งานห่วย" ใช้ Design System จริงของโปรเจกต์ตั้งแต่เริ่มเลยเถอะ |

## Red Flags (สัญญาณเตือนภัย)

- คอมโพเนนต์อ้วนบวมจนมีบรรทัดมากกว่า 200 บรรทัด (จับหั่นมันซะ)
- การใส่สไตล์สด (Inline styles) หรือการกะระยะเป็นพิกเซล (pixel values) แบบสุ่มๆ 
- ขาดหายหน้าจอแจ้งเตือน (error states), หน้าโหลด (loading states), หรือหน้าจอว่างเปล่า (empty states)
- ไม่มีการทดสอบการใช้คีย์บอร์ด (keyboard navigation)
- ใช้ "สี" เป็นตัวบอกสถานะแต่เพียงอย่างเดียว (มีแค่ แดง/เขียว โดยไม่มีข้อความหรือไอคอนประกอบ)
- ดีไซน์ออกมาดูโคตรจะ "เป็นงาน AI" (เช่นไล่เฉดสีม่วงจัดๆ, กล่องการ์ดใหญ่เบ้อเริ่ม, และแพทเทิร์นเลย์เอาต์โโหลๆ)

## Verification

หลังจากสร้าง UI เสร็จ:

- [ ] คอมโพเนนต์โชว์ผลรันได้ โดยไม่มีข้อความ error แดงๆ ใน console 
- [ ] สิ่งใดก็ตามที่กดโต้ตอบได้ ต้องสามารถควบคุมด้วยคีย์บอร์ดได้ทั้งหมด (ลองกด Tab กวาดไปทั่วเพจ)
- [ ] โปรแกรมอ่านหน้าจอ (Screen reader) สามารถอ่านเนื้อหาและโครงสร้างของเพจออกมาได้ครบ
- [ ] รองรับหลายหน้าจอ (Responsive): ทำงานได้ดีเยี่ยมที่ 320px, 768px, 1024px, 1440px
- [ ] จัดการดักหน้าจอครบทั้งหมด ทั้ง โหลดข้อมูล (Loading), มีปัญหา (Error), และไม่มีข้อมูล (Empty states) 
- [ ] ทำถูกต้องตามกฎระเบียบของ Design System ของโปรเจกต์ (ระยะห่าง, สี, รูปแบบตัวอักษร)
- [ ] ไม่มีคำเตือนเรื่อง Accessibility แจ้งเตือนใน dev tools หรือ axe-core

## Related Coding Standards
When performing this skill or role, strictly adhere to the following standards:
- `coding-standard/frontend/backoffice/1-tech-stack.md`
- `coding-standard/frontend/backoffice/2-folder-structure.md`
- `coding-standard/frontend/backoffice/3-routing-and-pages.md`
- `coding-standard/frontend/backoffice/4-state-management.md`
- `coding-standard/frontend/backoffice/5-api-integration.md`
- `coding-standard/frontend/backoffice/6-ui-and-styling.md`
- `coding-standard/frontend/backoffice/7-authentication.md`
- `coding-standard/frontend/backoffice/8-error-handling.md`
- `coding-standard/frontend/backoffice/9-operations-and-deployment.md`
- `coding-standard/frontend/backoffice/10-code-quality.md`
