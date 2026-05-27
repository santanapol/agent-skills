# 2. Folder Structure

```text
service-name/                           ← Root ของ Service
├── src/
│   ├── config/                         # ไฟล์ตั้งค่า (Database, Environments)
│   ├── controllers/                    # รับ Request / คืนค่า Response
│   ├── middlewares/                    # Middleware กลาง (Auth, Error Handling)
│   ├── models/                         # Database Schema / เชื่อมต่อ Database
│   ├── routes/                         # จัดการ Routing (API Endpoints)
│   ├── services/                       # Business Logic การทำงานหลัก
│   ├── utils/                          # ฟังก์ชันตัวช่วยส่วนกลาง (Helpers)
│   ├── app.js                          # ตั้งค่า Express & Middleware ทั้งหมด
│   └── server.js                       # Entry Point (รัน Server & ต่อ DB)
├── .env.example                        # Template ของ Environment Variables
└── package.json                        # ข้อมูลโปรเจกต์และ Dependencies
```
