---
name: ci-cd-and-automation
description: ระบบอัตโนมัติของ CI/CD pipeline ใช้เมื่อต้องการตั้งค่าหรือเปลี่ยนแปลงระบบการ build และการปล่อยตัวระบบ(deployment pipelines) ใช้เมื่อคุณต้องการสร้างระบบคัดกรองอัตโนมัติ (quality gates), กำหนดค่าตัวรัน test อัตโนมัติ (test runners) ใน CI, หรือใช้สำหรับสร้างกลยุทธ์การ deploy
---

# CI/CD and Automation

## Overview

วางระบบด่านตรวจอัตโนมัติ (quality gates) เพื่อให้มั่นใจว่าจะไม่มีการเปลี่ยนแปลงใดหลุดรอดไปถึง production โดยที่ไม่ผ่านการตรวจ test, lint, type checking, และ build ไปได้ CI/CD เป็นเสมือนมือปราบของกฎระเบียบและทักษะอื่นๆ ทั้งหมด — มันช่วยดักจับสิ่งที่มนุษย์หรือ agents มองข้ามไป และมันจะทำหน้าที่นี้อย่างซื่อสัตย์กับทุกๆ ความเปลี่ยนแปลง

**Shift Left (ถอยกลับมาซ้ายให้สุด):** ดักจับปัญหาให้ได้ตั้งแต่ช่วงต้นๆ ของ pipeline บั๊กที่โดนระบบ lint ตรวจเจอใช้เวลาแก้หลักนาที; แต่บั๊กตัวเดียวกันถ้าหลุดไปถึง production อาจจะผลาญเวลาเป็นชั่วโมง เลื่อนการตรวจสอบมาอยู่ต้นทาง — ปล่อยให้ static analysis รันก่อน tests, รัน tests ก่อนลง staging, ลง staging ก่อนลง production

**Faster is Safer (ยิ่งไวยิ่งปลอดภัย):** ทำการปล่อยระบบ(releases)ด้วยจำนวนงานครั้งละน้อยๆ แต่บ่อยๆ จะช่วยลดความเสี่ยง ไม่ใช่เพิ่มความเสี่ยง การ deploy พร้อมกัน 3 จุดแก้ย่อมหาทางซ่อมง่ายกว่า deploy พร้อมกัน 30 จุด การปล่อยระบบบ่อยๆ จะช่วยสร้างความมั่นใจในขั้นตอนกระบวนการของมันเอง

## When to Use

- ตั้งค่า CI pipeline ให้กับโปรเจกต์ใหม่
- เพิ่มหรือแก้ไขจุดดักจับอัตโนมัติต่างๆ
- ตั้งค่าท่อส่ง (deployment pipelines) 
- เมื่อมีการเปลี่ยนโค้ดแล้วควรจะเรียกให้ตัวตรวจอัตโนมัติทำงาน
- งมหาบั๊กเมื่อระบบ CI พัง (CI failures)

## The Quality Gate Pipeline (ด่านตรวจคุณภาพ)

ทุกๆ การเปลี่ยนแปลงต้องผ่านด่านเหล่านี้ก่อนที่จะไป merge:

```
เปิด Pull Request (Pull Request Opened)
    │
    ▼
┌─────────────────┐
│   LINT CHECK     │  eslint, prettier
│   ↓ รันผ่าน (pass)│
│   TYPE CHECK     │  tsc --noEmit
│   ↓ รันผ่าน (pass)│
│   UNIT TESTS     │  jest/vitest
│   ↓ รันผ่าน (pass)│
│   BUILD          │  npm run build
│   ↓ รันผ่าน (pass)│
│   INTEGRATION    │  API/DB tests
│   ↓ รันผ่าน (pass)│
│   E2E (เผื่อไว้)   │  Playwright/Cypress
│   ↓ รันผ่าน (pass)│
│   SECURITY AUDIT │  npm audit
│   ↓ รันผ่าน (pass)│
│   BUNDLE SIZE    │  bundlesize check
└─────────────────┘
    │
    ▼
  พร้อมสำหรับการรีวิว (Ready for review)
```

**ห้ามกระโดดข้ามด่านใดด่านหนึ่งโดยเด็ดขาด** ถ้า lint ไม่ผ่าน, ก็ไปแก้ lint ซะ — อย่าไปปิดการตั้งค่า ถ้าระบบ test พัง, ก็ไปแก้โค้ดซะ — ไม่ใช่มักง่ายข้าม test

## GitHub Actions Configuration (การตั้งค่า)

### Basic CI Pipeline (ท่อ CI เบื้องต้น)

```yaml
# .github/workflows/ci.yml
name: CI

on:
  pull_request:
    branches: [main]
  push:
    branches: [main]

jobs:
  quality:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: '22'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Lint
        run: npm run lint

      - name: Type check
        run: npx tsc --noEmit

      - name: Test
        run: npm test -- --coverage

      - name: Build
        run: npm run build

      - name: Security audit
        run: npm audit --audit-level=high
```

### With Database Integration Tests (พ่วงระบบเทส Integration Database)

```yaml
  integration:
    runs-on: ubuntu-latest
    services:
      postgres:
        image: postgres:16
        env:
          POSTGRES_DB: testdb
          POSTGRES_USER: ci_user
          POSTGRES_PASSWORD: ${{ secrets.CI_DB_PASSWORD }}
        ports:
          - 5432:5432
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5

    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '22'
          cache: 'npm'
      - run: npm ci
      - name: Run migrations
        run: npx prisma migrate deploy
        env:
          DATABASE_URL: postgresql://ci_user:${{ secrets.CI_DB_PASSWORD }}@localhost:5432/testdb
      - name: Integration tests
        run: npm run test:integration
        env:
          DATABASE_URL: postgresql://ci_user:${{ secrets.CI_DB_PASSWORD }}@localhost:5432/testdb
```

> **Note:** แม้ว่าจะเป็นแค่ระบบฐานข้อมูลสำหรับการรันเทสบน CI, ให้ทำเป็นนิสัยด้วยการเก็บรหัส(credentials) ไว้ในระบบ GitHub Secrets เสมอ แทนการเอามาแปะโต้งๆ การฝึกนิสัยเหล่านี้ช่วยป้องกันการเผลอหลุดเอาความลับไปใช้ผิดที่ผิดทาง

### E2E Tests

```yaml
  e2e:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '22'
          cache: 'npm'
      - run: npm ci
      - name: Install Playwright
        run: npx playwright install --with-deps chromium
      - name: Build
        run: npm run build
      - name: Run E2E tests
        run: npx playwright test
      - uses: actions/upload-artifact@v4
        if: failure()
        with:
          name: playwright-report
          path: playwright-report/
```

## Feeding CI Failures Back to Agents (ป้อนข้อมูลที่พังจาก CI กลับไปให้ Agents ดู)

พลังที่แท้จริงของการจับคู่ CI เข้ากับ AI agents คือระบบฟีดแบค เมื่อ CI พัง:

```
ระบบ CI พัง
    │
    ▼
ก๊อปปี้รายงานส่วนที่พัง (failure output)
    │
    ▼
ป้อนคำสั่งไปบอก agent:
"ระบบ CI รันพังพร้อมรายงานก้อนนี้:
[แปะตัว error เฉพาะจุดเข้าไป]
แก้จุดนี้ให้หน่อย แล้วรันเทสบนเครื่องให้ชัวร์ก่อนจะ push กลับมาอีกรอบนะ"
    │
    ▼
Agent ทำการซ่อม → กด push → ระบบ CI เริ่มทำงานอีกรอบ
```

**แพทเทิร์นหลัก:**

```
Lint รันพัง → Agent เรียก `npm run lint --fix` แล้ว commit ส่งกลับมา
Type พ่น error  → Agent อ่านตำแหน่งจุดบอด แล้วทำการเติม type ให้
Test ไม่ผ่าน → Agent เรียกใช้ทักษะ debugging-and-error-recovery เข้าช่วย
Build ขัดข้อง → Agent รีบไปตรวจเช็คพวก config และ dependencies 
```

## Deployment Strategies (กลยุทธ์การนำขึ้นระบบ)

### Preview Deployments (ฉายหนังตัวอย่าง)

ทำของตัวอย่างส่งให้ดูก่อนในทุกๆ PR สำหรับให้ทีมงานใช้มือคลิกเทส:

```yaml
# Deploy ตัวอย่างใน PR (Vercel/Netlify/etc.)
deploy-preview:
  runs-on: ubuntu-latest
  if: github.event_name == 'pull_request'
  steps:
    - uses: actions/checkout@v4
    - name: Deploy preview
      run: npx vercel --token=${{ secrets.VERCEL_TOKEN }}
```

### Feature Flags (สวิตช์ปิดเปิดฟีเจอร์)

ระบบ Feature flags เป็นการแยกขาดการ deploy ออกจาก release เราสามารถ deploy งานที่ยังทำไม่เสร็จหรือฟีเจอร์เสี่ยงๆ ซ่อนไว้ข้างหลังธง เพื่อที่คุณจะได้:

- **ส่งโค้ดขึ้นระบบโดยไม่ต้องเปิดเผยตัว** Merge กลับไปที่กิ่ง main ก่อนเวลาอันควร, เปิดเมื่อฟีเจอร์เสร็จ
- **ถอยทัพคืนได้โดยไม่ต้อง deploy ใหม่ (Roll back without redeploying).** แค่ปิดธงซะ แทนที่จะไปนั่งรื้อโค้ดคืน
- **ทยอยปล่อยฟีเจอร์ (Canary).** ลองเปิดให้ผู้ใช้เห็นแค่ 1%, ขยับเป็น 10%, แล้วทะยานสู่ 100%
- **ทดลอง A/B tests.** เปรียบเทียบผลลัพธ์พฤติกรรม ตอนเปิดฟีเจอร์นี้ กับไม่เปิด

```typescript
// แพทเทิร์น feature flag พื้นฐานง่ายๆ
if (featureFlags.isEnabled('new-checkout-flow', { userId })) {
  return renderNewCheckout();
}
return renderLegacyCheckout();
```

**วงจรชีวิตของ Flag (Flag lifecycle):** สร้าง → เปิดให้ลองเทส → เริ่มทยอยปล่อย Canary → ปล่อยเต็มพิกัด → ลบระบบธงทิ้งพร้อมหางเสี้ยวซากโค้ด ธงที่ปล่อยให้สิงสถิตย์ตลอดกาลจะกลายร่างเป็นหนี้เทคนิคในอนาคต — ฉะนั้นกรุณากำหนดวันหมดอายุให้มันตั้งแต่ตอนที่สร้างมันขึ้นมา

### Staged Rollouts (ปล่อยของทีละระดับชั้น)

```
PR merge เข้าเส้น main แล้ว
    │
    ▼
  ระบบ Staging deployment (ออโต้)
    │ ใช้มนุษย์เช็คซ้ำอีกรอบ
    ▼
  ระบบ Production deployment (มนุษย์กดเอง หรือออโต้หลังผ่าน staging)
    │
    ▼
  ระบบเฝ้ามองหาสัญญาณชีพความผิดปกติ (ในหน้าต่าง 15 นาที)
    │
    ├── จับได้ว่ามี Errors → ถอยทัพด่วน (Rollback)
    └── ใสสะอาดปกติ → จบงาน (Done)
```

### Rollback Plan (แผนถอยทัพ)

ทุกๆ การนำขึ้น deploy ควรจะสามารถย้อนกระบวนการได้เสมอ:

```yaml
# ท่าไม้ตายกดมือ ย้อนเวลากลับ (Manual rollback workflow)
name: Rollback
on:
  workflow_dispatch:
    inputs:
      version:
        description: 'Version to rollback to'
        required: true

jobs:
  rollback:
    runs-on: ubuntu-latest
    steps:
      - name: Rollback deployment
        run: |
          # ย้อนไปเวอร์ชันก่อนหน้าที่ระบุไว้
          npx vercel rollback ${{ inputs.version }}
```

## Environment Management (การจัดการตัวแปรระบบ)

```
.env.example       → โยนเข้า version control (เทมเพลตตัวอย่างให้นักพัฒนา)
.env                → ห้ามโยนเข้าเด็ดขาด (ของเทสในเครื่องตัวเอง)
.env.test           → โยนเข้า version control (ของโหมด test ล้วนๆ, ไม่มีความลับของจริง)
ความลับของระบบ CI (CI secrets)          → ยัดเข้าไปแอบใน GitHub Secrets / ตู้เซฟ vault
ความลับของ Production (Production secrets)  → ยัดเข้าไปแอบในระบบแพลตฟอร์ม deployment / ตู้เซฟ vault
```

ระบบ CI ไม่ควรจับตัวเลขความลับของ production เด็ดขาด แยกตู้เซฟ secrets ไว้ต่างหากเลยสำหรับใช้ของระบบ CI

## Automation Beyond CI (ระบบอัตโนมัติอื่นๆ นอกเหนือจาก CI)

### Dependabot / Renovate

```yaml
# .github/dependabot.yml
version: 2
updates:
  - package-ecosystem: npm
    directory: /
    schedule:
      interval: weekly
    open-pull-requests-limit: 5
```

### Build Cop Role (บทบาทนายอำเภอบิลด์)

มอบหมายหน้าที่ใครสักคนให้เป็นเจ้าภาพดูแลให้ CI แสงสีเขียวอยู่เสมอ เมื่อมีใครทำบิลด์ระบบพัง, หน้าที่ของนายอำเภอก็คือจับซ่อมหรือกด revert คืน — ไม่ใช่หน้าที่ของคนทำพัง สิ่งนี้ช่วยป้องกันพฤติกรรมโยนหินถามทางและดองปัญหาพังๆ ทิ้งไว้ เพราะทุกคนต่างก็คิดว่า "เดี๋ยวก็มีคนอื่นมาแก้เองแหละ"

### PR Checks (ด่านสกัด PR)

- **บังคับตรวจ (Required reviews):** ต้องมีอย่างน้อย 1 คนกดอนุมัติก่อนถึงจะให้ merge ได้
- **บังคับสถานะ (Required status checks):** ระบบ CI ทั้งหมดต้องไฟเขียวก่อนถึงจะให้ merge
- **คุ้มครอง branch (Branch protection):** สั่งห้ามดัน (force-pushes) อัดหน้าเส้น main
- **รวมร่างออโต้ (Auto-merge):** ถ้าระบบไฟเขียวผ่านหมด แถมมีคนรีวิวกดให้ผ่านแล้ว, ให้ยัดรวมร่างเองเลย (merge automatically)

## CI Optimization (ทำ CI ให้ซิ่ง)

เมื่อท่อ pipeline ทำงานนานทะลุ 10 นาที, ให้ทำตามขั้นตอนเร่งประสิทธิภาพนี้ (เรียงตามผลกระทบจากหนักสุด):

```
ท่อระบบ CI อืดใช่ไหม?
├── จดจำแคชของพึ่งพา (Cache dependencies)
│   └── ไปเรียกใช้ actions/cache หรือตัวเลือก setup-node สำหรับเรื่อง node_modules
├── รันแบบคู่ขนานหลายๆ เส้น (Run jobs in parallel)
│   └── จับแยกเรื่อง lint, typecheck, test, build ออกจากกันให้ไปวิ่งคู่ขนานกันซะ
├── ให้วิ่งเฉพาะที่เกี่ยวเท่านั้น (Only run what changed)
│   └── ตั้งด่านใช้ path filters ข้ามบรรดางานที่ไม่เกี่ยว (เช่น งานไหนแค่มาแก้ตัวหนังสือใน doc, ก็สั่งข้ามระบบ e2e ซะ)
├── พึ่งพาบิลด์เมทริกซ์ (Use matrix builds)
│   └── แยก test suites ไปวิ่งทำงานพร้อมกันในหน้าต่าง runner หลายๆ ตัว 
├── หั่นชิ้นงานเทสให้เข้ารูป (Optimize the test suite)
│   └── ตัดบรรดาเส้นทางวิบากที่ทำให้เครื่องมือเทสรันอืดๆ ทิ้งไป แล้วจัดตั้งเวลาให้มันวิ่งในรอบที่ตั้งเวลาไว้แทน
└── ใช้รถตักขนาดใหญ่ขึ้น (Use larger runners)
│   └── เปลี่ยนมาใช้ GitHub-hosted ที่ใหญ่ขึ้น หรือจะใช้ self-hosted ถ้าเป็นบิลด์ประเภทสวาปามพลัง CPU มหาศาล
```

**ตัวอย่าง: การวิ่งคู่ขนานและแอบจดจำแคช (caching and parallelism)**
```yaml
jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: '22', cache: 'npm' }
      - run: npm ci
      - run: npm run lint

  typecheck:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: '22', cache: 'npm' }
      - run: npm ci
      - run: npx tsc --noEmit

  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: '22', cache: 'npm' }
      - run: npm ci
      - run: npm test -- --coverage
```

## Common Rationalizations (ข้ออ้างทั่วไป)

| ข้ออ้าง | ความเป็นจริง |
|---|---|
| "ตัว CI มันเต่าจะตาย" | ทำ pipeline ให้มันซิ่งขึ้นสิ (อ่านดูข้อ CI Optimization ขีดเส้นใต้ข้างบน), อย่าปิดการใช้งานข้ามด่านไปเฉยๆ ระบบ pipeline ช้า 5 นาที ช่วยประหยัดเวลาซ่อมบั๊กได้เป็นชั่วโมงๆ เลยนะ |
| "ไอ้ที่แก้ไปเนี่ยเรื่องขี้ปะติ๋วเอง, ข้าม CI ไปเลยเหอะน่า" | ไอ้พวกแก้ขี้ปะติ๋วๆ นี่แหละตัวทำบิลด์ระบบบรรลัยเลย ยังไง CI มันก็วิ่งจับของขี้ปะติ๋วได้ไวอยู่แล้วนี่ |
| "การ test บางอันมันก็ผีเข้าผีออกนะ, กดให้มันวิ่งซ้ำๆ เดี๋ยวก็ติดเอง" | ปล่อยให้มันผีเข้าผีออก (Flaky tests) มีแต่จะซ่อนบั๊กของจริงเอาไว้ แล้วก็สูบเวลาชาวบ้านชาวเมือง ไปซ่อมให้มันนิ่งซะเถอะ |
| "เดี๋ยวเราค่อยจับยัด CI ตามเข้าไปทีหลังละกัน" | โปรเจกต์ไร้พรมแดน CI มักจะกลายเป็นสุสานของความพังพินาศ จับมันฝังเข้าไปตั้งแต่วันแรกที่เริ่มเลยดีกว่า |
| "ใช้มือกดเทสเอาก็ถมเถละมั้ง" | ระบบมือมันต่อยอดขยับขยายอะไรต่อไม่ได้ แถมเอาแน่เอานอนให้ทำซ้ำก็ยาก จับมันทำออโต้เข้าเถอะนะ เท่าที่จะทำได้ |

## Red Flags (สัญญาณเตือนภัย)

- ในโปรเจกต์ไม่มีวางท่อ CI pipeline ไว้
- สัญญาณไฟพังของ CI โดนเพิกเฉยหรือโดนอุ้มปิดปากเงียบ
- แอบปิด tests ไม่ให้ CI รัน เพื่อโกงให้ผ่าน
- พุ่งหลาวนำขึ้น production โดยไม่ผ่านด่านเช็คในระดับ staging ก่อน
- ไม่มีแผนระบบถอยหลังคืนชีพ (rollback mechanism)
- เอาข้อมูลความลับ(Secrets) ยัดไส้ปะปนใน source code หรือ ไฟล์ CI config (ไม่ได้เอาใส่ระบบ secrets manager)
- ปล่อย CI อืดเป็นชั่วโมงๆ โดยไม่ทำ optimization เลย

## Verification

หลังจากลงมือติดตั้ง หรือเปลี่ยนแปลงแก้ไข CI:

- [ ] ด่านตรวจทุกด่านครบเครื่องต้มยำ (lint, types, tests, build, audit)
- [ ] Pipeline ขยับทำงานทันทีที่มี PR และตอน push ไปเส้น main
- [ ] เมื่อมีปัญหาพัง สั่งปิดกั้นการควบรวม (branch protection configured)
- [ ] ผลลัพธ์ของ CI สามารถโต้กลับเตือนสู่ระบบพัฒนา
- [ ] ของลับแอบซ่อนมิดชิดใน secrets manager, ไม่โชว์หลาใน source code
- [ ] ระบบป้อนลง deployment มีกลไกเผื่อถอยทัพ
- [ ] ท่อ Pipeline ใช้เวลารันสั้นกว่า 10 นาทีสำหรับรอบชุดการทำ test


## Related Coding Standards
When performing this skill or role, strictly adhere to the following standards:
- `coding-standard/backend/9-operations-and-deployment.md`
- `coding-standard/backend/13-code-quality.md`
- `coding-standard/backend/10-observability-and-logging.md`
