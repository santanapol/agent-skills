# 1. Tech Stack & Dependencies

| Layer | Technology / Specification |
| :--- | :--- |
| **Framework** | `React v19` |
| **Build Tool** | `Vite v8` |
| **Language** | `TypeScript` (Strict Mode) |
| **Routing** | `react-router-dom v7` |
| **UI Library** | `Ant Design (antd)` + `@ant-design/icons` |
| **HTTP Client** | `axios` |
| **Testing** | `vitest` |

## 📦 Package Management
* บังคับให้ใช้คำสั่งที่อ่านจาก Lockfile (`npm ci`) เมื่ออยู่บนระบบ CI/CD
* อนุญาตให้อัปเดตเวอร์ชันระดับ `minor` และ `patch` ได้อิสระ แต่หากเป็น `major` ต้องมีการรีวิวผลกระทบเสมอ
