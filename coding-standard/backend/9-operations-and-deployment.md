# 9. Operations & Deployment

มาตรฐานด้านระบบปฏิบัติการ (Operations) และการ Deploy ขึ้น Production เพื่อให้ระบบมีความเสถียรและมั่นคง

## 📉 Service Level Objectives (SLO Baseline)
การวัดประสิทธิภาพความน่าเชื่อถือของระบบ:
* **Latency p95:** ต้องทำงานตอบสนองเร็วกว่า `< 1000 ms`
* **Error Rate:** ต้องน้อยกว่า `< 2%` (สัดส่วน 5xx ต่อ Request ทั้งหมด)
* **Availability (Uptime):** ต้องเปิดใช้งานได้มากกว่า `≥ 99.5%`

## 🛡️ Security SLA (กำหนดเวลาแก้ไขช่องโหว่)
หากตรวจพบช่องโหว่ความปลอดภัย (Vulnerability) จาก `npm audit` หรือ Dependabot ให้แก้ไขภายในเวลาที่กำหนด:
* **Critical:** ภายใน **48 ชั่วโมง**
* **High:** ภายใน **7 วัน** (หากพบระดับ High หรือ Critical จะถูกบล็อกการ Merge ทันทีใน CI Pipeline)
* **Medium:** ภายใน **30 วัน**

## 🏥 Liveness & Readiness Probes
ทุก Service ต้องเตรียม Endpoint พื้นฐานไว้สำหรับตรวจสอบสถานะ:
* **`GET /healthz` (Liveness):** เช็คว่าแอปพลิเคชันยังทำงานอยู่หรือไม่
* **`GET /readyz` (Readiness):** เช็คว่าแอปพลิเคชันพร้อมรับ Request แล้วหรือไม่ (เช่น เชื่อม Database สำเร็จแล้ว)

## 🗄️ Database Index Rollout (ข้อกำหนดเรื่องการสร้าง Index)
* **ห้าม** ให้ Application Code แอบสร้าง Index เองโดยอัตโนมัติ (Bootstrap) บน Production
* การสร้าง Index ต้องสร้างด้วยคำสั่ง `{ background: true }` ในช่วงเวลาที่มี Traffic ต่ำเสมอ เพื่อป้องกัน Database ล็อกการทำงาน
