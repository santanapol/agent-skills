# 6. UI & Styling

เพื่อความเร็วและความสอดคล้อง (Consistency) เราใช้ **Ant Design (antd)** เป็น UI Library หลัก

## 🎨 Design Tokens (`ConfigProvider`)
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

## 🚫 ห้ามเขียน Custom CSS พร่ำเพรื่อ
- **[Forbidden]** ห้ามสร้างไฟล์ `.css` หรือเขียน Custom Style เพื่อ Override รูปร่างหน้าตาของ AntD หากสามารถปรับผ่าน Design Tokens ได้
- การจัดตำแหน่ง, เว้นระยะ (Spacing), หรือ Grid ควรใช้ Component สำเร็จรูปอย่าง `<Row>`, `<Col>`, `<Flex>`, หรือ `<Space>` ของ AntD ให้มากที่สุด
