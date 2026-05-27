# 2. API Routing & Proxy

กฎการทำ Routing ของ Gateway ไปยัง Upstream (Internal Services)

## นโยบายการตรวจสอบ Routing
| สถานการณ์ | HTTP | `code` (ถ้ามี problem body) | ข้อกำหนด (Rule) |
| :--- | :--- | :--- | :--- |
| **Route Not Found** (Client ยิง Path ที่ไม่ตรงกับ Route Table ที่ Gateway ตั้งไว้) | **`404`** | ไม่บังคับ | **[Forbidden]** ห้ามส่ง `GATEWAY_ROUTE_NOT_CONFIGURED` เพื่อป้องกันการเปิดเผย Topology ภายใน |
| **Route Misconfigured** (Operator ตั้งค่า Path หรือ Upstream ผิดพลาด เช่น ว่างเปล่าหรือไม่สมบูรณ์ตาม ADR) | **`502`** | `GATEWAY_ROUTE_NOT_CONFIGURED` | **[Required]** ใช้จับข้อผิดพลาดระดับ Configuration ภายใน Gateway เองเท่านั้น |
