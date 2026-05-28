# AI Model Matrix & Strategy

## Model Selection by SDLC Stage

| SDLC Stage | Entry | Key Principle | Quality | Budget | Strategy / Reasoning |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **DEFINE** | User prompt / package `docs/` | Spec before code | **Claude 4.7 Opus**<br>*(Autonomous, วางแผน/หา Edge Case ก่อนเริ่ม)* | **Gemini 3.1 Pro**<br>*(ราคาคุ้มค่า, อ่าน UI/UX Design Mockup ได้)* | เน้น Context Window กว้างและใช้วิเคราะห์ภาพ/เอกสารเพื่อแปลงไอเดียเป็น Scope |
| **PLAN** | User prompt / แชท | Small, atomic tasks | **Claude 4.7 Opus**<br>*(ขับเคลื่อนงาน Multi-step ซับซ้อนได้ดีที่สุด)* | **GPT-5**<br>*(คุ้มค่า ไม่มี Cache Write)* | Analytical Depth สูงสุดสำหรับ Architecture/ADR |
| **BUILD** | `_coding-standards/` + โค้ด | One slice at a time | **GPT-5.4**<br>*(เก่งอันดับ 1 ของ Cursor, ไม่ต้องรองานนาน)* | **GPT-5.3 Codex**<br>*(เร็วกว่าและเก่งเทียบเท่า Opus 4.6 ในราคาถูกกว่า 3 เท่า)* | เน้น Coding Performance, การตัดสินใจเด็ดขาด และ Low Latency |
| **VERIFY** | Tests + `_coding-standards/backend/testing.md` | Tests are proof | **Claude 4.6 Sonnet**<br>*(เก่งเรื่อง Logic, รองรับ Thinking Mode สำหรับงานยาก)* | **GPT-5.3 Codex**<br>*(รัน Unit Test/Debug ยาวๆ ทั่วไปประหยัด)* | ตรวจสอบ Logic, Edge Cases และเขียน Unit Tests |
| **REVIEW** | Peer / แชท | Improve code health | **Grok 4.20**<br>*(รองรับ Context สูงสุด 2M สำหรับ Repo ขนาดใหญ่)* | **Gemini 2.5 Flash** (ไฟล์เยอะ)<br>**GPT-5 Mini** (ไฟล์น้อย) | ตรวจ Security/PII อ่านโค้ดทั้งโปรเจกต์ (Low Cache Write Cost) |
| **COMPLIANCE** | `/review-code-standard` | Org SoT audit | **Grok 4.20** | **Gemini 2.5 Flash** | อ่าน diff + `_coding-standards/` กว้าง |
| **SIMPLIFY** | Refactor slice | Clarity over cleverness | **Claude 4.6 Sonnet**<br>*(เก่ง Logic เชิงลึก, Refactor โค้ดได้ปลอดภัย)* | **GPT-5.3 Codex**<br>*(แก้โค้ดได้แม่นยำ ประหยัด และรวดเร็ว)* | การ Refactor โค้ดต้องมีการแก้ไขและรันเทส จึงต้องการ Model ที่มีความสามารถด้าน Coding สูง |
| **SHIP** | `/commit-push-with-changelog` | Faster is safer | **Composer 2**<br>*(สรุปงานดีเยี่ยม, เร็ว, เป็น Native ของ Cursor)* | **Gemini 3 Flash**<br>*(รวดเร็วและราคาถูกที่สุด)* | งานเอกสาร (Docs/Release Notes) เน้นประหยัด Cost |

## Cost Optimization (Caching Policy)

- **Zero Cache Write Strategy**: สำหรับงานที่ต้อง Review โค้ดทั้ง Repository หรืออ่าน Context จำนวนมหาศาล ให้หลีกเลี่ยงตระกูล Claude และสลับมาใช้ **Grok 4.20** หรือ **Gemini 3.1 Pro** แทน เพื่อเลี่ยงค่า Cache Write ที่มีราคาสูง ($3.75 - $6.25)
- **Batching Task**: รวมงานยิบย่อยอย่างการเขียน Docs หรือทำ Unit Test ทั่วไปไว้ทำทีเดียว โดยใช้ Model รุ่นประหยัดอย่าง **Gemini 3 Flash**, **GPT-5.1 Codex** หรือ **Composer 2** เพื่อเซฟ Budget

> **Incident / Hotfix:** หากเกิดเหตุการณ์ Incident ที่ต้องการการแก้ไขด่วน (Hotfix) ให้ข้ามข้อจำกัดเรื่อง Cost และเรียกใช้ **GPT-5.4** หรือ **Claude 4.7 Opus** ทันที เพื่อให้ได้ Root Cause Analysis และการแก้ปัญหาที่รวดเร็ว/เด็ดขาดที่สุด

## Model Pricing

*All prices are per million tokens, sourced from each provider's API pricing:*

| Provider | Name | Input | Cache Write | Cache Read | Output |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Anthropic** | Claude 4 Sonnet | $3 | $3.75 | $0.3 | $15 |
| **Anthropic** | Claude 4 Sonnet 1M | $6 | $7.5 | $0.6 | $22.5 |
| **Anthropic** | Claude 4.5 Haiku | $1 | $1.25 | $0.1 | $5 |
| **Anthropic** | Claude 4.5 Opus | $5 | $6.25 | $0.5 | $25 |
| **Anthropic** | Claude 4.5 Sonnet | $3 | $3.75 | $0.3 | $15 |
| **Anthropic** | Claude 4.6 Opus | $5 | $6.25 | $0.5 | $25 |
| **Anthropic** | Claude 4.6 Opus (Fast mode) | $30 | $37.5 | $3 | $150 |
| **Anthropic** | Claude 4.6 Sonnet | $3 | $3.75 | $0.3 | $15 |
| **Anthropic** | Claude 4.7 Opus | $5 | $6.25 | $0.5 | $25 |
| **Cursor** | Composer 1 | $1.25 | - | $0.125 | $10 |
| **Cursor** | Composer 1.5 | $3.5 | - | $0.35 | $17.5 |
| **Cursor** | Composer 2 | $0.5 | - | $0.2 | $2.5 |
| **Google** | Gemini 2.5 Flash | $0.3 | - | $0.03 | $2.5 |
| **Google** | Gemini 3 Flash | $0.5 | - | $0.05 | $3 |
| **Google** | Gemini 3 Pro | $2 | - | $0.2 | $12 |
| **Google** | Gemini 3 Pro Image Preview | $2 | - | $0.2 | $12 |
| **Google** | Gemini 3.1 Pro | $2 | - | $0.2 | $12 |
| **OpenAI** | GPT-5 | $1.25 | - | $0.125 | $10 |
| **OpenAI** | GPT-5 Fast | $2.5 | - | $0.25 | $20 |
| **OpenAI** | GPT-5 Mini | $0.25 | - | $0.025 | $2 |
| **OpenAI** | GPT-5-Codex | $1.25 | - | $0.125 | $10 |
| **OpenAI** | GPT-5.1 Codex | $1.25 | - | $0.125 | $10 |
| **OpenAI** | GPT-5.1 Codex Max | $1.25 | - | $0.125 | $10 |
| **OpenAI** | GPT-5.1 Codex Mini | $0.25 | - | $0.025 | $2 |
| **OpenAI** | GPT-5.2 | $1.75 | - | $0.175 | $14 |
| **OpenAI** | GPT-5.2 Codex | $1.75 | - | $0.175 | $14 |
| **OpenAI** | GPT-5.3 Codex | $1.75 | - | $0.175 | $14 |
| **OpenAI** | GPT-5.4 | $2.5 | - | $0.25 | $15 |
| **OpenAI** | GPT-5.4 Mini | $0.75 | - | $0.075 | $4.5 |
| **OpenAI** | GPT-5.4 Nano | $0.2 | - | $0.02 | $1.25 |
| **xAI** | Grok 4.20 | $2 | - | $0.2 | $6 |
| **Moonshot** | Kimi K2.5 | $0.6 | - | $0.1 | $3 |