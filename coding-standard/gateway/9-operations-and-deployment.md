# 5. Operations & Deployment

## Health และ Readiness (การตรวจสอบสถานะบริการ)
| Path | ประเภท | บทบาท / ข้อกำหนด (Rule) |
| :--- | :--- | :--- |
| **`GET /healthz`** | Liveness | ตรวจสอบว่า Process Gateway ทำงานอยู่ (ห้ามเปิดเผยข้อมูล Sensitive หรือค่า Config) |
| **`GET /readyz`** | Readiness | **[Required]** ตรวจสอบว่าพร้อมรับ Traffic โดย **ต้องมีการเช็ค `PING` ไปยัง Redis ด้วย** หาก Gateway มีการเปิดใช้ JWT Revocation Gate |

## Process Lifecycle และ NPM Scripts
| Item | Rule |
| :--- | :--- |
| **Graceful Shutdown** | **[Required]** ต้องตอบสนองต่อ Event `SIGINT` / `SIGTERM` ➔ หยุดรับ Request ใหม่ ➔ รอให้ In-flight request ทำงานเสร็จ ➔ ปิด Upstream client |
| **Environment Flags** | **[Required]** รันแอปพลิเคชันด้วยฟีเจอร์ Native ของ Node.js ผ่าน flag `--env-file=.env` |
| **Experimental Flags** | **[Forbidden]** ห้ามใช้ `--experimental-*` ใน Production โดยเด็ดขาด |
