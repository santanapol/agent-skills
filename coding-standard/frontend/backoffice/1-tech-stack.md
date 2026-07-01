# 1. Tech Stack & Dependencies

| Layer | Technology / Specification |
| :--- | :--- |
| **Framework** | `React v19` |
| **Build Tool** | `Vite v8` |
| **Language** | `TypeScript` (Strict Mode) |
| **Routing** | `react-router-dom v7` |
| **UI Library (antd)** | `Ant Design (antd)` + `@ant-design/icons` — legacy app at `backoffice/` |
| **UI Library (shadcn)** | `shadcn/ui` + `Tailwind CSS v4` + `lucide-react` — migrated app at `backoffice-shadcn/` |
| **HTTP Client** | `axios` |
| **Testing** | `vitest` + `@testing-library/react` |
| **Toasts / feedback** | antd `message` / `notification` (antd app) · `sonner` (shadcn app) |

## Variants

| App | Path | UI stack |
| :--- | :--- | :--- |
| **backoffice** (legacy) | `code-base/zero-platform/frontend/backoffice` | Ant Design + ConfigProvider tokens |
| **backoffice-shadcn** (target) | `code-base/zero-platform/frontend/backoffice-shadcn` | shadcn/ui + CSS variables in `index.css` |
| **live-demo-shadcn** (template) | `coding-standard/frontend/backoffice/live-demo-shadcn` | Reference scaffold for new shadcn pages |

New features should land in **backoffice-shadcn** unless explicitly scoped to the legacy app.

## 📦 Package Management (both variants)
* บังคับให้ใช้คำสั่งที่อ่านจาก Lockfile (`npm ci`) เมื่ออยู่บนระบบ CI/CD
* อนุญาตให้อัปเดตเวอร์ชันระดับ `minor` และ `patch` ได้อิสระ แต่หากเป็น `major` ต้องมีการรีวิวผลกระทบเสมอ
