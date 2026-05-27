# 4. Request Headers (Header Injection)

## ลำดับ Headers ที่ถูกส่งต่อไปยัง Upstream (Canonical Trusted Header Order)
Gateway เป็นผู้รับผิดชอบหลักในการ **Inject (ฉีด)** Headers เข้าไปใน Request ก่อนจะส่งต่อไปให้ Internal Services โดยดึงข้อมูลมาจาก JWT Claims การเรียงลำดับ Headers บังคับให้เป็นไปตามลำดับนี้เสมอ (หากไม่มีค่าให้ข้ามได้ แต่ห้ามสลับลำดับ):

1. **`x-gateway-secret`** (Shared secret จาก Env ที่ให้ Upstream มั่นใจว่ามาจาก Gateway จริง)
2. **`x-user-ou`** 
3. **`x-user-branch`** 
4. **`x-user-id`** 
5. **`x-user-role`** (ดึงจาก Claim ตามที่ระบุใน Config เพื่อทำ RBAC)
6. **`If-Match`** (ถ้ามี Forward มาจาก Client)
7. **`x-request-id`** (Forward ต่อ หรือสร้าง UUID ขึ้นมาใหม่)

> **[Forbidden]** Gateway ต้อง **ห้าม** ยอมรับ `x-gateway-secret` ที่ถูกแนบมาจาก Client โดยตรงเด็ดขาด ค่านี้ต้องมาจาก Configuration ของ Gateway ล้วน ๆ เพื่อป้องกัน Spoofing
