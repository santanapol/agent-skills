# Testing Patterns Reference

คู่มืออ้างอิงฉบับย่อสำหรับรูปแบบการทดสอบ (Testing patterns) ทั่วไปในระดับ Stack ใช้ควบคู่กับทักษะ `test-driven-development`

## Table of Contents

- [Test Structure (Arrange-Act-Assert)](#test-structure-arrange-act-assert)
- [Test Naming Conventions](#test-naming-conventions)
- [Common Assertions](#common-assertions)
- [Mocking Patterns](#mocking-patterns)
- [React/Component Testing](#reactcomponent-testing)
- [API / Integration Testing](#api--integration-testing)
- [E2E Testing (Playwright)](#e2e-testing-playwright)
- [Test Anti-Patterns](#test-anti-patterns)

## Test Structure (Arrange-Act-Assert)

```typescript
it('describes expected behavior', () => {
  // Arrange (เตรียม): ตั้งค่าข้อมูลและเงื่อนไขล่วงหน้า
  const input = { title: 'Test Task', priority: 'high' };

  // Act (กระทำ): ดำเนินการที่ต้องการทดสอบ
  const result = createTask(input);

  // Assert (ตรวจสอบ): ยืนยันผลลัพธ์ที่ได้
  expect(result.title).toBe('Test Task');
  expect(result.priority).toBe('high');
  expect(result.status).toBe('pending');
});
```

## Test Naming Conventions

```typescript
// รูปแบบ: [unit] [expected behavior] [condition]
describe('TaskService.createTask', () => {
  it('creates a task with default pending status', () => {});
  it('throws ValidationError when title is empty', () => {});
  it('trims whitespace from title', () => {});
  it('generates a unique ID for each task', () => {});
});
```

## Common Assertions

```typescript
// ความเท่ากัน (Equality)
expect(result).toBe(expected);           // ความเท่ากันแบบตายตัว (===)
expect(result).toEqual(expected);        // ความเท่ากันเชิงลึก (deep equality สำหรับ objects/arrays)
expect(result).toStrictEqual(expected);  // ความเท่ากันเชิงลึก + ตรวจสอบ Type ด้วย

// ความเป็นจริง (Truthiness)
expect(result).toBeTruthy();
expect(result).toBeFalsy();
expect(result).toBeNull();
expect(result).toBeDefined();
expect(result).toBeUndefined();

// ตัวเลข (Numbers)
expect(result).toBeGreaterThan(5);
expect(result).toBeLessThanOrEqual(10);
expect(result).toBeCloseTo(0.3, 5);      // Floating point (จุดทศนิยม)

// สตริง (Strings)
expect(result).toMatch(/pattern/);
expect(result).toContain('substring');

// อาเรย์ / อ็อบเจกต์ (Arrays / Objects)
expect(array).toContain(item);
expect(array).toHaveLength(3);
expect(object).toHaveProperty('key', 'value');

// ข้อผิดพลาด (Errors)
expect(() => fn()).toThrow();
expect(() => fn()).toThrow(ValidationError);
expect(() => fn()).toThrow('specific message');

// ทำงานแบบ Async
await expect(asyncFn()).resolves.toBe(value);
await expect(asyncFn()).rejects.toThrow(Error);
```

## Mocking Patterns

### Mock Functions

```typescript
const mockFn = jest.fn();
mockFn.mockReturnValue(42);
mockFn.mockResolvedValue({ data: 'test' });
mockFn.mockImplementation((x) => x * 2);

expect(mockFn).toHaveBeenCalled();
expect(mockFn).toHaveBeenCalledWith('arg1', 'arg2');
expect(mockFn).toHaveBeenCalledTimes(3);
```

### Mock Modules

```typescript
// ทำ Mock ให้ทั้ง Module
jest.mock('./database', () => ({
  query: jest.fn().mockResolvedValue([{ id: 1, title: 'Test' }]),
}));

// ทำ Mock แบบเจาะจงเฉพาะบางส่วน
jest.mock('./utils', () => ({
  ...jest.requireActual('./utils'),
  generateId: jest.fn().mockReturnValue('test-id'),
}));
```

### Mock at Boundaries Only (ทำ Mock เฉพาะบริเวณขอบเขตของระบบ)

```
ทำ Mock สิ่งเหล่านี้:                 ห้ามทำ Mock สิ่งเหล่านี้:
├── การเรียกฐานข้อมูล (Database)     ├── ฟังก์ชันอำนวยความสะดวกในระบบ (Internal utility)
├── HTTP requests               ├── ลอจิกธุรกิจ (Business logic)
├── การจัดการไฟล์ (File system)      ├── การแปลงข้อมูล (Data transformations)
├── การเรียก API ภายนอก            ├── ฟังก์ชันการตรวจสอบ (Validation functions)
└── วันที่/เวลา (เมื่อจำเป็น)            └── ฟังก์ชันแท้ (Pure functions)
```

## React/Component Testing

```tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';

describe('TaskForm', () => {
  it('submits the form with entered data', async () => {
    const onSubmit = jest.fn();
    render(<TaskForm onSubmit={onSubmit} />);

    // หาองค์ประกอบหน้าเว็บด้วย Role/Label ที่คนอ่านเข้าใจ (ไม่ใช้ test IDs)
    await screen.findByRole('textbox', { name: /title/i });
    fireEvent.change(screen.getByRole('textbox', { name: /title/i }), {
      target: { value: 'New Task' },
    });
    fireEvent.click(screen.getByRole('button', { name: /create/i }));

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith({ title: 'New Task' });
    });
  });

  it('shows validation error for empty title', async () => {
    render(<TaskForm onSubmit={jest.fn()} />);

    fireEvent.click(screen.getByRole('button', { name: /create/i }));

    expect(await screen.findByText(/title is required/i)).toBeInTheDocument();
  });
});
```

## API / Integration Testing

```typescript
import request from 'supertest';
import { app } from '../src/app';

describe('POST /api/tasks', () => {
  it('creates a task and returns 201', async () => {
    const response = await request(app)
      .post('/api/tasks')
      .send({ title: 'Test Task' })
      .set('Authorization', `Bearer ${testToken}`)
      .expect(201);

    expect(response.body).toMatchObject({
      id: expect.any(String),
      title: 'Test Task',
      status: 'pending',
    });
  });

  it('returns 422 for invalid input', async () => {
    const response = await request(app)
      .post('/api/tasks')
      .send({ title: '' })
      .set('Authorization', `Bearer ${testToken}`)
      .expect(422);

    expect(response.body.error.code).toBe('VALIDATION_ERROR');
  });

  it('returns 401 without authentication', async () => {
    await request(app)
      .post('/api/tasks')
      .send({ title: 'Test' })
      .expect(401);
  });
});
```

## E2E Testing (Playwright)

```typescript
import { test, expect } from '@playwright/test';

test('user can create and complete a task', async ({ page }) => {
  // เข้าสู่เว็บและเข้าสู่ระบบ
  await page.goto('/');
  await page.fill('[name="email"]', 'test@example.com');
  await page.fill('[name="password"]', 'testpass123');
  await page.click('button:has-text("Log in")');

  // สร้าง Task ใหม่
  await page.click('button:has-text("New Task")');
  await page.fill('[name="title"]', 'Buy groceries');
  await page.click('button:has-text("Create")');

  // ตรวจสอบว่า Task แสดงขึ้นมา
  await expect(page.locator('text=Buy groceries')).toBeVisible();

  // ทำ Task ให้เสร็จ
  await page.click('[aria-label="Complete Buy groceries"]');
  await expect(page.locator('text=Buy groceries')).toHaveCSS(
    'text-decoration-line', 'line-through'
  );
});
```

## Test Anti-Patterns

| ข้อผิดพลาดทั่วไป (Anti-Pattern) | ปัญหา | วิธีแก้ |
|---|---|---|
| ทดสอบรายละเอียดการ Implementation | โค้ดจะพังเวลามีการ Refactor | ให้ทดสอบที่ Input/Output |
| ทำ Snapshot ไปซะทุกอย่าง | ไม่มีใครมานั่งดู Snapshot diffs | ให้ระบุเฉพาะเจาะจงที่ค่า (Values) |
| ใช้สถานะ (state) ร่วมกัน | เทสต์หนึ่งจะไปกวนอีกเทสต์ | ให้ใช้ Setup/Teardown แยกสำหรับแต่ละเทสต์ |
| ไปนั่งทดสอบโค้ด Third-party | เสียเวลาเปล่า, มันไม่ใช่ Bug ของคุณ | ให้ทำ Mock เอา |
| กดข้ามเทสต์ไปเพื่อให้ CI ผ่าน | ปล่อยผ่าน Bug ของจริง | ไปแก้บักซะ ไม่ก็ลบเทสต์ทิ้ง |
| ปล่อยให้มี `test.skip` ถาวร | กลายเป็นขยะหรือ Dead code | เอาออก ไม่ก็ไปแก้ให้ผ่าน |
| การระบุผลลัพธ์แบบกว้างเกินไป | มันจะไม่จับเวลาระบบถอยหลัง (regressions) | ระบุให้เฉพาะเจาะจง |
| ไม่ใช้ Async error handling | โค้ดไม่แจ้งเตือน หรือปล่อยผ่านปลอมๆ | ใช้ `await` เสมอกับ Async tests |
