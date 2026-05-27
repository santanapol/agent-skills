# Agent Skills

**ทักษะวิศวกรรมระดับ Production สำหรับ AI coding agents**

Skills หรือ ทักษะเหล่านี้ เป็นการรวบรวม Workflow, มาตรฐานคุณภาพ (Quality gates), และ Best practices ที่ Senior engineers ใช้ในการพัฒนาซอฟต์แวร์ ทักษะเหล่านี้ถูกจัดแพ็กเกจเพื่อให้ AI agents สามารถปฏิบัติตามได้อย่างสม่ำเสมอในทุกขั้นตอนของการพัฒนา

![Addy's Agent Skills](https://addyosmani.com/assets/images/addys-agent-skills.jpg)

---

## Commands

7 Slash commands ที่เชื่อมโยงกับ Lifecycle การพัฒนาซอฟต์แวร์ แต่ละคำสั่งจะเรียกใช้ทักษะที่เหมาะสมโดยอัตโนมัติ

| สิ่งที่คุณกำลังทำ | Command | หลักการสำคัญ |
|-------------------|---------|---------------|
| กำหนดสิ่งที่จะสร้าง | `/spec` | Spec before code |
| วางแผนวิธีการสร้าง | `/plan` | Small, atomic tasks |
| สร้างทีละส่วน | `/build` | One slice at a time |
| พิสูจน์ว่ามันทำงานได้ | `/test` | Tests are proof |
| รีวิวก่อนรวมโค้ด | `/review` | Improve code health |
| ทำให้โค้ดเรียบง่าย | `/code-simplify` | Clarity over cleverness |
| นำขึ้น Production | `/ship` | Faster is safer |

ทักษะเหล่านี้ยังสามารถทำงานอัตโนมัติขึ้นอยู่กับสิ่งที่คุณกำลังทำ — เช่น การออกแบบ API จะเรียกใช้ `api-and-interface-design`, การสร้าง UI จะเรียกใช้ `frontend-ui-engineering`, และอื่นๆ

---

## Quick Start

<details>
<summary><b>Claude Code (แนะนำ)</b></summary>

**ติดตั้งผ่าน Marketplace:**

```
/plugin marketplace add addyosmani/agent-skills
/plugin install agent-skills@addy-agent-skills
```

> **ปัญหา SSH (SSH errors)?** Marketplace จะโคลน Repositories ผ่าน SSH หากคุณไม่ได้ตั้งค่า SSH keys บน GitHub ให้ [เพิ่ม SSH key ของคุณ](https://docs.github.com/en/authentication/connecting-to-github-with-ssh/adding-a-new-ssh-key-to-your-github-account) หรือใช้ HTTPS URL แบบเต็มเพื่อบังคับให้โคลนผ่าน HTTPS:
> ```bash
> /plugin marketplace add https://github.com/addyosmani/agent-skills.git
> /plugin install agent-skills@addy-agent-skills
> ```

**Local / development:**

```bash
git clone https://github.com/addyosmani/agent-skills.git
claude --plugin-dir /path/to/agent-skills
```

</details>

<details>
<summary><b>Cursor</b></summary>

คัดลอกไฟล์ `SKILL.md` ใดๆ ไปไว้ใน `.cursor/rules/`, หรืออ้างอิง Directory `skills/` ทั้งหมด ดูเพิ่มเติมที่ [docs/cursor-setup.md](docs/cursor-setup.md).

</details>

<details>
<summary><b>Gemini CLI</b></summary>

ติดตั้งเป็นทักษะดั้งเดิมสำหรับการค้นพบอัตโนมัติ (auto-discovery) หรือเพิ่มเข้าไปใน `GEMINI.md` สำหรับบริบทแบบต่อเนื่อง (persistent context) ดูเพิ่มเติมที่ [docs/gemini-cli-setup.md](docs/gemini-cli-setup.md).

**ติดตั้งจาก Repo:**

```bash
gemini skills install https://github.com/addyosmani/agent-skills.git --path skills
```

**ติดตั้งจากการโคลน Local:**

```bash
gemini skills install ./agent-skills/skills/
```

</details>

<details>
<summary><b>Windsurf</b></summary>

เพิ่มเนื้อหาทักษะไปยังการตั้งค่า Rules ของ Windsurf ดูเพิ่มเติมที่ [docs/windsurf-setup.md](docs/windsurf-setup.md).

</details>

<details>
<summary><b>OpenCode</b></summary>

ใช้การทำงานของทักษะที่ขับเคลื่อนโดย Agent ผ่าน AGENTS.md และเครื่องมือ `skill`

ดูเพิ่มเติมที่ [docs/opencode-setup.md](docs/opencode-setup.md).

</details>

<details>
<summary><b>GitHub Copilot</b></summary>

ใช้คำจำกัดความ Agent จาก `agents/` เป็น Personas ของ Copilot และเนื้อหาทักษะใน `.github/copilot-instructions.md` ดูเพิ่มเติมที่ [docs/copilot-setup.md](docs/copilot-setup.md).

</details>

<details>
  <summary><b>Kiro IDE & CLI </b></summary>
  ทักษะสำหรับ Kiro อยู่ภายใต้ ".kiro/skills/" และสามารถจัดเก็บในระดับ Project หรือ Global Kiro ยังรองรับ Agents.md ดูเอกสาร Kiro ได้ที่ https://kiro.dev/docs/skills/
</details>

<details>
<summary><b>Codex / Other Agents</b></summary>

ทักษะถูกเขียนในรูปแบบ Markdown ธรรมดา - สามารถใช้งานได้กับ Agent ใดๆ ที่รองรับ System prompts หรือไฟล์คำสั่ง ดูเพิ่มเติมที่ [docs/getting-started.md](docs/getting-started.md).

</details>



---

## All 23 Skills

คำสั่งด้านบนเป็นเพียงจุดเริ่มต้น ในแพ็กเกจมีทักษะทั้งหมด 23 ทักษะ — เป็น Lifecycle skills 22 ทักษะ บวกกับ Meta-skill 1 ทักษะคือ `using-agent-skills` แต่ละทักษะคือ Workflow ที่มีโครงสร้างเป็นขั้นตอน การตรวจสอบความถูกต้อง (Verification gates) และตารางเพื่อป้องกันการหาข้ออ้าง (Anti-rationalization) คุณยังสามารถเรียกอ้างอิงแต่ละทักษะได้โดยตรง

### Meta - ค้นหาทักษะที่เหมาะสม

| Skill | สิ่งที่มันทำ | ใช้เมื่อ |
|-------|-------------|----------|
| [using-agent-skills](skills/using-agent-skills/SKILL.md) | จับคู่งานที่เข้ามากับ Workflow ของทักษะที่ถูกต้อง และกำหนดกฎการทำงานร่วมกัน | เริ่มต้นเซสชั่นหรือกำลังตัดสินใจว่าจะใช้ทักษะไหน |

### Define - กำหนดสิ่งที่ต้องการสร้าง

| Skill | สิ่งที่มันทำ | ใช้เมื่อ |
|-------|-------------|----------|
| [interview-me](skills/interview-me/SKILL.md) | สัมภาษณ์ทีละคำถามเพื่อดึงสิ่งที่ผู้ใช้ต้องการจริงๆ ออกมา แทนที่จะเป็นสิ่งที่พวกเขาคิดว่าต้องการ จนกว่าจะมีความมั่นใจประมาณ ~95% | คำขอยังไม่ชัดเจน, หรือผู้ใช้เรียก "interview me" / "grill me" |
| [idea-refine](skills/idea-refine/SKILL.md) | คิดแบบแยกส่วน/รวบรวมอย่างมีโครงสร้างเพื่อเปลี่ยนไอเดียที่คลุมเครือให้เป็นข้อเสนอที่เป็นรูปธรรม | คุณมีคอนเซ็ปต์คร่าวๆ ที่ต้องการการสำรวจเพิ่มเติม |
| [spec-driven-development](skills/spec-driven-development/SKILL.md) | เขียน PRD (Product Requirements Document) ที่ครอบคลุมวัตถุประสงค์ คำสั่ง โครงสร้าง รูปแบบโค้ด การทดสอบ และขอบเขต ก่อนที่จะเริ่มเขียนโค้ดใดๆ | เริ่มต้นโปรเจกต์ ฟีเจอร์ หรือการเปลี่ยนแปลงที่สำคัญ |

### Plan - การแบ่งย่อยงาน

| Skill | สิ่งที่มันทำ | ใช้เมื่อ |
|-------|-------------|----------|
| [planning-and-task-breakdown](skills/planning-and-task-breakdown/SKILL.md) | แตก Specs เป็นงานเล็กๆ ที่ตรวจสอบได้ พร้อมกับ Acceptance criteria และลำดับความเชื่อมโยงของงาน (Dependency ordering) | คุณมี Spec แล้วและต้องการหน่วยงานที่สามารถนำไปทำได้ |

### Build - เขียนโค้ด

| Skill | สิ่งที่มันทำ | ใช้เมื่อ |
|-------|-------------|----------|
| [incremental-implementation](skills/incremental-implementation/SKILL.md) | พัฒนาทีละส่วนแคบๆ - implement, test, verify, commit ใช้ Feature flags, การตั้งค่าเริ่มต้นที่ปลอดภัย (safe defaults) และการเปลี่ยนแปลงที่ Rollback กลับได้ง่าย | มีการเปลี่ยนแปลงที่กระทบมากกว่า 1 ไฟล์ |
| [test-driven-development](skills/test-driven-development/SKILL.md) | Red-Green-Refactor, test pyramid (80/15/5), test sizes, DAMP over DRY, Beyonce Rule, browser testing | กำลังวาง Logic, แก้ไข Bugs, หรือเปลี่ยนพฤติกรรมการทำงาน |
| [context-engineering](skills/context-engineering/SKILL.md) | ป้อนข้อมูลที่ถูกต้องให้กับ Agents ในเวลาที่เหมาะสม - ไฟล์กฎ, Context packing, MCP integrations | เริ่มต้นเซสชั่น, สลับงาน, หรือเมื่อคุณภาพของ Output ลดลง |
| [source-driven-development](skills/source-driven-development/SKILL.md) | นำทุกการตัดสินใจเกี่ยวกับ Framework ไปอ้างอิงจากเอกสารทางการ - ตรวจสอบ อ้างอิงแหล่งที่มา และแจ้งเตือนสิ่งที่ไม่ได้รับการยืนยัน | คุณต้องการโค้ดที่ถูกต้อง อ้างอิงจากแหล่งที่มาที่น่าเชื่อถือสำหรับ Framework หรือ Library ใดๆ |
| [doubt-driven-development](skills/doubt-driven-development/SKILL.md) | การรีวิวบริบทใหม่ในเชิงตรงข้ามกับการตัดสินใจสำคัญๆ ที่กำลังดำเนินการอยู่ - CLAIM → EXTRACT → DOUBT → RECONCILE → STOP, รวมถึงการยกระดับข้ามโมเดลที่ได้รับอนุญาตจากผู้ใช้ | การทำงานมีความเสี่ยงสูง (production, ความปลอดภัย, ย้อนกลับไม่ได้), ทำงานในโค้ดที่ไม่คุ้นเคย, หรือการสร้าง Output ที่ตรวจสอบตอนนี้จะคุ้มค่ากว่าไปตามหา Bug ทีหลัง |
| [frontend-ui-engineering](skills/frontend-ui-engineering/SKILL.md) | สถาปัตยกรรม Component, Design systems, State management, Responsive design, ความสามารถในการเข้าถึงระดับ WCAG 2.1 AA (accessibility) | กำลังสร้างหรือปรับเปลี่ยน UI |
| [api-and-interface-design](skills/api-and-interface-design/SKILL.md) | การออกแบบแบบ Contract-first, Hyrum's Law, One-Version Rule, Error semantics, การตรวจสอบขอบเขต (boundary validation) | กำลังออกแบบ APIs, ขอบเขตของโมดูล, หรือ Public interfaces |

### Verify - พิสูจน์ว่าทำงานได้

| Skill | สิ่งที่มันทำ | ใช้เมื่อ |
|-------|-------------|----------|
| [browser-testing-with-devtools](skills/browser-testing-with-devtools/SKILL.md) | ใช้ Chrome DevTools MCP สำหรับตรวจสอบข้อมูลขณะรันไทม์ (runtime data) - การตรวจสอบ DOM, Console logs, Network traces, Performance profiling | กำลังสร้างหรือแก้ไขสิ่งที่ทำงานบน Browser |
| [debugging-and-error-recovery](skills/debugging-and-error-recovery/SKILL.md) | 5 ขั้นตอนในการแก้ไขปัญหา: ทำซ้ำ, ระบุตำแหน่ง, ลดขอบเขต, แก้ไข, และป้องกัน กฎ Stop-the-line, ทางเลือกสำรองที่ปลอดภัย | เมื่อการทดสอบไม่ผ่าน, บิลด์พัง, หรือเกิดพฤติกรรมที่ไม่คาดคิด |

### Review - ตรวจสอบคุณภาพก่อนรวมโค้ด

| Skill | สิ่งที่มันทำ | ใช้เมื่อ |
|-------|-------------|----------|
| [code-review-and-quality](skills/code-review-and-quality/SKILL.md) | รีวิวแบบ 5 แกน, ขนาดของการเปลี่ยนแปลง (~100 บรรทัด), ป้ายกำกับความรุนแรง (Nit/Optional/FYI), มาตรฐานความเร็วในการรีวิว, กลยุทธ์การแบ่งโค้ด | ก่อนการรวมการเปลี่ยนแปลงใดๆ |
| [code-simplification](skills/code-simplification/SKILL.md) | Chesterton's Fence, Rule of 500, ลดความซับซ้อนในขณะที่ยังคงรักษาการทำงานที่เหมือนเดิมไว้ | โค้ดทำงานได้ แต่การอ่านหรือบำรุงรักษานั้นยากเกินความจำเป็น |
| [security-and-hardening](skills/security-and-hardening/SKILL.md) | การป้องกันความปลอดภัยตาม OWASP Top 10, Auth patterns, Secrets management, Dependency auditing, โครงสร้างขอบเขต 3 ชั้น | การจัดการอินพุตของผู้ใช้, ระบบ Auth, การจัดเก็บข้อมูล, หรือ External integrations |
| [performance-optimization](skills/performance-optimization/SKILL.md) | เน้นที่การวัดผลเป็นสิ่งแรก - เป้าหมาย Core Web Vitals, การทำ Profiling workflows, Bundle analysis, ตรวจจับ Anti-pattern | เมื่อมีข้อกำหนดด้านประสิทธิภาพหรือสงสัยว่ามีปัญหา |

### Ship - นำขึ้นระบบด้วยความมั่นใจ

| Skill | สิ่งที่มันทำ | ใช้เมื่อ |
|-------|-------------|----------|
| [git-workflow-and-versioning](skills/git-workflow-and-versioning/SKILL.md) | Trunk-based development, Atomic commits, ขนาดของการเปลี่ยนแปลง (~100 บรรทัด), รูปแบบ commit-as-save-point | สำหรับทุกการเปลี่ยนแปลงโค้ด (เสมอ) |
| [ci-cd-and-automation](skills/ci-cd-and-automation/SKILL.md) | Shift Left, Faster is Safer, Feature flags, ท่อของการทดสอบคุณภาพ, รอบตอบรับความล้มเหลว | เมื่อตั้งค่าหรือปรับแต่งขั้นตอน Build และ Deploy |
| [deprecation-and-migration](skills/deprecation-and-migration/SKILL.md) | มองโค้ดเป็นภาระ, การเลิกใช้งานแบบบังคับหรือเชิงแนะนำ, Migration patterns, การเอา Zombie code ออก | เมื่อลบระบบเก่า, ย้ายฐานผู้ใช้, หรือยกเลิกฟีเจอร์ต่างๆ |
| [documentation-and-adrs](skills/documentation-and-adrs/SKILL.md) | การบันทึกการตัดสินใจสถาปัตยกรรม (ADRs), API docs, มาตรฐาน Inline documentation - สร้างเอกสารบันทึกเหตุผลว่า *ทำไม* | เมื่อตัดสินใจด้านสถาปัตยกรรม, แก้ไข APIs, หรือเพิ่มฟีเจอร์ |
| [shipping-and-launch](skills/shipping-and-launch/SKILL.md) | Checklists ก่อนการเปิดตัว, วงจรชีวิตของ Feature flag, การเปิดให้ใช้งานแบบมีลำดับขั้น (staged rollouts), ขั้นตอนการ Rollback, การตั้งค่า Monitoring | เมื่อเตรียมตัว Deploy ขึ้น Production |

---

## Agent Personas

บุคลิกภาพเฉพาะทางที่ถูกเตรียมไว้สำหรับการรีวิวแบบเจาะจง:

| Agent | บทบาท | มุมมอง |
|-------|------|-------------|
| [code-reviewer](agents/code-reviewer.md) | Senior Staff Engineer | การรีวิวโค้ด 5 แกนด้วยมาตรฐาน "Staff engineer จะอนุมัติไหม?" |
| [test-engineer](agents/test-engineer.md) | QA Specialist | กลยุทธ์การทดสอบ, การวิเคราะห์ความครอบคลุม, และกระบวนการแบบ Prove-It (พิสูจน์มันสิ) |
| [security-auditor](agents/security-auditor.md) | Security Engineer | ตรวจจับช่องโหว่, Threat modeling, การประเมินตาม OWASP |

---

## Reference Checklists

ข้อมูลอ้างอิงรวดเร็วที่ทักษะต่างๆ จะดึงมาใช้งานเมื่อจำเป็น:

| อ้างอิง | ครอบคลุม |
|-----------|--------|
| [testing-patterns.md](references/testing-patterns.md) | โครงสร้าง Test, การตั้งชื่อ, Mocking, ตัวอย่างของ React/API/E2E, Anti-patterns |
| [security-checklist.md](references/security-checklist.md) | Pre-commit checks, ระบบ Auth, การตรวจสอบอินพุต, Headers, CORS, OWASP Top 10 |
| [performance-checklist.md](references/performance-checklist.md) | เป้าหมาย Core Web Vitals, Frontend/backend checklists, คำสั่งสำหรับวัดผล |
| [accessibility-checklist.md](references/accessibility-checklist.md) | Navigation ด้วย Keyboard, Screen readers, การออกแบบทางสายตา, ARIA, เครื่องมือทดสอบ |

---

## How Skills Work

ทุกทักษะมีโครงสร้างกายวิภาคที่สม่ำเสมอ:

```
┌─────────────────────────────────────────────────┐
│  SKILL.md                                       │
│                                                 │
│  ┌─ Frontmatter ─────────────────────────────┐  │
│  │ name: lowercase-hyphen-name               │  │
│  │ description: Guides agents through [task].│  │
│  │              Use when…                    │  │
│  └───────────────────────────────────────────┘  │                                                                                                
│  Overview         → สิ่งที่ทักษะนี้ทำ           │
│  When to Use      → เงื่อนไขในการเรียกใช้       │
│  Process          → ขั้นตอนการทำงานทีละสเต็ป    │
│  Rationalizations → ข้ออ้าง + ข้อโต้แย้ง        │
│  Red Flags        → สัญญาณบอกว่ามีบางอย่างผิดปกติ│
│  Verification     → หลักฐานที่ใช้ในการตรวจสอบ   │
└─────────────────────────────────────────────────┘
```

**ทางเลือกหลักในการออกแบบ:**

- **กระบวนการ ไม่ใช่ข้อเขียน.** ทักษะคือ Workflow ให้ Agents ปฏิบัติตาม ไม่ใช่คู่มือเอกสารให้อ่าน แต่ละอันมีขั้นตอน มีจุดเช็คและเกณฑ์ในการจบงาน
- **การต่อต้านข้ออ้าง.** ทุกทักษะมีตารางข้ออ้างยอดฮิตที่ Agents ใช้เพื่อข้ามขั้นตอน (เช่น "เดี๋ยวฉันค่อยเพิ่ม Test ทีหลัง") พร้อมกับข้อโต้แย้งที่เตรียมไว้
- **การตรวจสอบไม่สามารถต่อรองได้.** ทุกทักษะต้องจบลงด้วยหลักฐานการตรวจสอบเสมอ - Tests ต้องผ่าน, Build ออกมาได้, ได้ข้อมูลจากระบบรันไทม์ คำว่า "ดูเหมือนจะถูกต้อง" ไม่เคยเพียงพอ
- **Progressive disclosure.** ไฟล์ `SKILL.md` คือจุดเริ่มต้น การอ้างอิงต่างๆ จะโหลดเมื่อจำเป็นเท่านั้น ซึ่งช่วยให้ใช้ Token ให้น้อยที่สุด

---

## Project Structure

```
agent-skills/
├── skills/                            # 23 ทักษะ (22 lifecycle + 1 meta)
│   ├── interview-me/                  #   Define
│   ├── idea-refine/                   #   Define
│   ├── spec-driven-development/       #   Define
│   ├── planning-and-task-breakdown/   #   Plan
│   ├── incremental-implementation/    #   Build
│   ├── context-engineering/           #   Build
│   ├── source-driven-development/     #   Build
│   ├── doubt-driven-development/      #   Build
│   ├── frontend-ui-engineering/       #   Build
│   ├── test-driven-development/       #   Build
│   ├── api-and-interface-design/      #   Build
│   ├── browser-testing-with-devtools/ #   Verify
│   ├── debugging-and-error-recovery/  #   Verify
│   ├── code-review-and-quality/       #   Review
│   ├── code-simplification/          #   Review
│   ├── security-and-hardening/        #   Review
│   ├── performance-optimization/      #   Review
│   ├── git-workflow-and-versioning/   #   Ship
│   ├── ci-cd-and-automation/          #   Ship
│   ├── deprecation-and-migration/     #   Ship
│   ├── documentation-and-adrs/        #   Ship
│   ├── shipping-and-launch/           #   Ship
│   └── using-agent-skills/            #   Meta: วิธีใช้แพ็กเกจนี้
├── agents/                            # 3 บุคลิกเฉพาะทาง (specialist personas)
├── references/                        # 4 checklists เพิ่มเติม
├── hooks/                             # Session lifecycle hooks
├── .claude/commands/                  # 7 slash commands (สำหรับ Claude Code)
├── .gemini/commands/                  # 7 slash commands (สำหรับ Gemini CLI)
└── docs/                              # คู่มือติดตั้งแยกตามเครื่องมือ
```

---

## Why Agent Skills?

AI coding agents มักจะเลือกทางที่สั้นที่สุด - ซึ่งบ่อยครั้งหมายถึงการข้าม Specs, ข้ามการเขียน Tests, ข้ามการรีวิวระบบความปลอดภัย และแนวทางที่ทำให้ซอฟต์แวร์นั้นเชื่อถือได้ ทักษะ Agent (Agent Skills) นี้มอบ Workflow เชิงโครงสร้างที่บังคับให้ Agents รักษาวินัยแบบเดียวกับ Senior engineers เพื่อให้ได้โค้ดระดับ Production.

แต่ละทักษะได้ถูกบรรจุการตัดสินใจเชิงวิศวกรรมที่ผ่านการคิดมาอย่างดี: *เมื่อไหร่* ควรเขียน Spec, *อะไร* ที่ต้องถูก Test, *รีวิว* แบบไหน และ *เมื่อไหร่* ถึงพร้อมนำขึ้นระบบ ทักษะเหล่านี้ไม่ใช่แค่ Prompt กว้างๆ - แต่มันเป็นแนวทางปฏิบัติแบบมีมุมมองที่เป็นระบบ ซึ่งเป็นตัวแยกความแตกต่างระหว่างผลงานที่มีคุณภาพในระดับ Production กับ ผลงานที่อยู่แค่ระดับ Prototype.

ทักษะเหล่านี้ยังฝัง Best practices มาจากวัฒนธรรมของวิศวกรที่ Google ไว้ด้วย — รวมไปถึงคอนเซ็ปต์จาก [Software Engineering at Google](https://abseil.io/resources/swe-book) และ [Engineering practices guide](https://google.github.io/eng-practices/) ของ Google คุณจะได้เจอ Hyrum's Law ในการออกแบบ API, Beyonce Rule และ Test pyramid ในส่วนของการทดสอบ, การจำกัดขนาดของการเปลี่ยนแปลงและมาตรฐานความเร็วในการรีวิวโค้ด, Chesterton's Fence ในส่วนการทำให้เรียบง่าย, Trunk-based development ในส่วนของการทำงานด้วย git, Shift Left และ Feature flags ในส่วน CI/CD, และทักษะการลดละการใช้งานแบบเฉพาะเจาะจง ที่มองโค้ดเป็นภาระ (liability) สิ่งเหล่านี้ไม่ใช่หลักการลอยๆ — แต่ถูกฝังเข้าไปโดยตรงใน Workflow แต่ละขั้นที่ Agents ปฏิบัติตาม.

---

## Contributing

ทักษะต้องมีความ **เฉพาะเจาะจง (specific)** (มีขั้นตอนที่ปฏิบัติได้ ไม่ใช่แค่คำแนะนำกว้างๆ), **ตรวจสอบได้ (verifiable)** (เกณฑ์การจบงานชัดเจนและต้องมีหลักฐาน), **ผ่านการทดสอบมาแล้ว (battle-tested)** (ตั้งอยู่บนฐานการทำงานจริง) และ **เรียบง่าย (minimal)** (มีแค่สิ่งที่จำเป็นเพื่อแนะนำ Agent).

ดูเพิ่มเติมเกี่ยวกับรูปแบบ Specification ได้ที่ [docs/skill-anatomy.md](docs/skill-anatomy.md) และแนวทางปฏิบัติตาม [CONTRIBUTING.md](CONTRIBUTING.md).

---

## License

MIT - ใช้ทักษะเหล่านี้ใน Project, ภายในทีม, และใช้ร่วมกับเครื่องมือของคุณได้เลย
