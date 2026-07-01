# 6. UI & Styling

เรามีสอง UI stack ตาม variant ของแอป — เลือกแนวทางที่ตรงกับโปรเจกต์ที่กำลังแก้ไข

---

## Ant Design variant (`backoffice/`)

เพื่อความเร็วและความสอดคล้อง (Consistency) แอป legacy ใช้ **Ant Design (antd)** เป็น UI Library หลัก

### 🎨 Design Tokens (`ConfigProvider`)
- การปรับเปลี่ยนสีสัน ธีม หรือฟอนต์ (Typography) ของทั้งแอปพลิเคชัน จะต้องทำผ่าน Component `<ConfigProvider>` ของ AntD ที่หุ้มอยู่ระดับสูงสุด (`App.tsx`) เท่านั้น
- **ตัวอย่างการตั้งค่าโทนสี:**
  ```tsx
  token: {
    colorPrimary: '#2563EB',
    colorSuccess: '#10B981',
    colorError: '#EF4444',
    fontFamily: "'Inter', 'Sarabun', sans-serif",
    borderRadius: 6,
  }
  ```

### 🚫 ห้ามเขียน Custom CSS พร่ำเพรื่อ
- **[Forbidden]** ห้ามสร้างไฟล์ `.css` หรือเขียน Custom Style เพื่อ Override รูปร่างหน้าตาของ AntD หากสามารถปรับผ่าน Design Tokens ได้
- การจัดตำแหน่ง, เว้นระยะ (Spacing), หรือ Grid ควรใช้ Component สำเร็จรูปอย่าง `<Row>`, `<Col>`, `<Flex>`, หรือ `<Space>` ของ AntD ให้มากที่สุด

---

## shadcn variant (`backoffice-shadcn/`)

แอปที่ migrate แล้วใช้ **shadcn/ui** + **Tailwind CSS v4** แทน Ant Design โดยอ้างอิง scaffold จาก `live-demo-shadcn/`

### 🎨 Design Tokens (CSS variables)
- โทนสีและ radius อยู่ที่ `src/index.css` ผ่าน CSS custom properties (`--primary`, `--destructive`, `--radius`, …)
- TypeScript mirror สำหรับค่าที่ใช้ใน logic อยู่ที่ `src/theme/tokens.ts`
- ธีม light/dark สลับผ่าน `ThemeProvider` (`src/components/theme-provider.tsx`) — **ไม่ใช้** AntD `ConfigProvider`

### 📐 Layout & spacing
- ใช้ Tailwind utility classes และ layout templates ใน `src/components/layout/` (`PageContainer`, `DetailContainer`, …)
- ตาราง: `@tanstack/react-table` ผ่าน `src/components/data-table.tsx`
- Toast / feedback: `sonner` ผ่าน `useAppFeedback` และ `<Toaster />` ใน `App.tsx`
- Confirm dialogs: `useConfirmDialog` + `AlertDialog` (แทน `Modal.confirm`)

### 🧩 เพิ่ม component
- ใช้ shadcn CLI / MCP ตาม `components.json`
- Component พื้นฐานอยู่ใน `src/components/ui/` — ห้าม duplicate ไปที่ path อื่น

### 🚫 ห้าม
- **[Forbidden]** นำ `antd` กลับเข้า `backoffice-shadcn` ยกเว้น migration ชั่วคราวที่มี ticket ชัดเจน
- **[Forbidden]** override shadcn ด้วย global CSS แทนการใช้ variants / `cn()` / tokens
