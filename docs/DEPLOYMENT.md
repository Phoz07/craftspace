# คู่มือการนำ CraftSpace ขึ้นสู่ Production (Vercel + Neon PostgreSQL)

คู่มือนี้สรุปขั้นตอนทีละขั้น (Step-by-Step) ในการ Deploy ระบบ **CraftSpace Interior & Built-in Studio** ขึ้นสู่ Production แบบ 100% Free-Tier บน **Vercel** และ **Neon Serverless PostgreSQL**

---

## 📋 ภาพรวมสถาปัตยกรรม Production

- **Hosting & Edge Routing**: Vercel (Next.js 16 App Router + Turbopack + Middleware)
- **Database**: Neon Serverless PostgreSQL (Autoscaling + Connection Pooling via PgBouncer)
- **Image Generation**: Next.js `ImageResponse` (Satori + Resvg) พร้อมฟอนต์ LINE Seed Sans TH
- **Authentication**: Studio Passcode Gate พร้อมคุกกี้เซ็นชื่อ HMAC SHA-256 (Web Crypto)

---

## 🚀 ขั้นตอนที่ 1: สร้างฐานข้อมูลบน Neon (Neon Serverless PostgreSQL)

1. เข้าไปที่ [https://neon.tech](https://neon.tech) และล็อกอินเข้าสู่ระบบ (รองรับ Sign in with GitHub)
2. กด **Create a project**:
   - **Project Name**: `craftspace-db`
   - **Postgres Version**: `16` หรือ `17`
   - **Region**: เลือกภูมิภาคใกล้ไทย เช่น `ap-southeast-1` (Singapore)
3. เมื่อสร้างเสร็จ ที่หน้า **Dashboard** ให้สังเกตกล่อง **Connection Details**:
   - ติ๊กเลือก **Pooled connection** -> คัดลอก Connection String ไว้เป็นค่า `DATABASE_URL`  
     *(มี `-pooler` ใน URL สำหรับรันบน Vercel Serverless)*
   - เอาติ๊กออก หรือเลือก **Direct connection** -> คัดลอก Connection String ไว้เป็นค่า `DIRECT_URL`  
     *(สำหรับใช้รัน Migration หรือ `prisma db push`)*

---

## 📦 ขั้นตอนที่ 2: ซิงก์ Schema เข้าสู่ฐานข้อมูลจริง (Database Migration)

รันคำสั่งจากเครื่องของคุณเพื่อสร้าง Table บน Neon Postgres:

```bash
# กำหนด Environment Variables ของ Neon ชั่วคราวใน Terminal
export DATABASE_URL="postgresql://[user]:[password]@[neon-hostname]-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require"
export DIRECT_URL="postgresql://[user]:[password]@[neon-hostname].ap-southeast-1.aws.neon.tech/neondb?sslmode=require"

# ดัน Schema ขึ้นฐานข้อมูล Neon ทันที
pnpm --filter apps exec prisma db push

# (ทางเลือก) หากต้องการใส่ข้อมูลเริ่มต้น 12 ลีดเสมือนจริงสำหรับทดสอบ
pnpm --filter apps exec tsx prisma/seed.ts
```

---

## ☁️ ขั้นตอนที่ 3: Deploy ขึ้น Vercel

1. เข้าไปที่ [https://vercel.com](https://vercel.com) แล้วกด **Add New...** -> **Project**
2. เลือก Import Repository: **`Phoz07/craftspace`**
3. **การตั้งค่า Project Settings (สำคัญมาก)**:
   - **Framework Preset**: `Next.js`
   - **Root Directory**: กด Edit แล้วเลือกโฟลเดอร์ **`apps`**
   - **Build Command**: `prisma generate && next build` (ระบบจะดึงจาก `package.json` อัตโนมัติ)
4. **Environment Variables**: กรอกตัวแปรให้ครบถ้วนตามรายการด้านล่าง:

| Variable Name | ตัวอย่างค่าที่ใส่ | คำอธิบาย |
| :--- | :--- | :--- |
| `DATABASE_URL` | `postgresql://...@...-pooler.../neondb?sslmode=require` | Connection String แบบ Pooled จาก Neon |
| `DIRECT_URL` | `postgresql://...@.../neondb?sslmode=require` | Connection String แบบ Direct จาก Neon |
| `ADMIN_PASSCODE` | `CraftSpace#2026!Studio` | รหัสผ่านสตูดิโอสำหรับเข้าใช้งาน `/admin` |
| `ADMIN_SECRET` | `a8f5c9e2b1d4e7f0123456789abcdef0` | Secret Key สุ่ม 32 ตัวอักษรสำหรับเซ็นคุกกี้ |
| `NEXT_PUBLIC_LINE_OA_ID` | `@craftspace` *(ใส่ @ นำหน้า)* | LINE Official Account Basic ID ของสตูดิโอ |
| `NEXT_PUBLIC_BASE_URL` | `https://craftspace.vercel.app` | โดเมนของระบบ (อัปเดตหลังได้ URL จริง) |

5. กด **Deploy** แล้วรอประมาณ 1–2 นาที Vercel จะคอมไพล์และเปิดให้บริการ Production URL ทันที

---

## 🔍 ขั้นตอนที่ 4: การตรวจสอบและทดสอบระบบบน Production (Smoke Test)

เมื่อ Deploy สำเร็จ ให้ทดสอบ Checklist 5 ข้อดังนี้:

- [ ] **เปิดหน้า Landing Page**: โหลดหน้าแรก ตรวจสอบความลื่นไหลของ Before & After Slider
- [ ] **ทดสอบคำนวณราคา**: เลื่อนสไลเดอร์ขนาดพื้นที่ และเลือกโซนบิวท์อิน ตัวเลขราคาต้องคำนวณสด
- [ ] **ทดสอบ Lead Capture**: กรอกชื่อและเบอร์โทรศัพท์ -> ตรวจสอบว่าระบบออก Ref Code `#CS-YYMM-XXXX` ได้ถูกต้อง
- [ ] **ทดสอบ 9:16 Slip Generation**: กดปุ่ม "ดาวน์โหลดสลิป (9:16)" ภาพต้องเรนเดอร์คมชัดด้วยฟอนต์ LINE Seed Sans TH
- [ ] **ทดสอบ LINE Deep Link & Dynamic QR Code**: 
  - บนมือถือ: กดปุ่มเปิด LINE ข้อความสรุปสเปกและ Ref ID ต้องเด้งเข้าหน้าแชท
  - บนเดสก์ท็อป: กล้องมือถือต้องสแกน QR Code แล้วพาเข้าแชทพร้อมข้อความสรุปได้จริง
- [ ] **ทดสอบ Sales Pipeline Dashboard**: 
  - เข้าสู่ [https://your-domain.vercel.app/admin](https://your-domain.vercel.app/admin)
  - กรอก `ADMIN_PASSCODE` ที่ตั้งไว้
  - ตรวจสอบว่าลีดที่เพิ่งส่งเข้าไปแสดงผลในตาราง (Table View) และกระดานคัมบัง (Kanban Board)

---

## 🌐 ขั้นตอนที่ 5: การผูก Custom Domain (Optional)

1. ในหน้าโปรเจกต์บน Vercel ไปที่ **Settings** -> **Domains**
2. ป้อนโดเมนของคุณ เช่น `craftspace.studio` หรือ `www.craftspace.co.th`
3. ทำตามคำแนะนำ DNS Records (A Record หรือ CNAME) บนผู้ให้บริการโดเมนของคุณ (เช่น Cloudflare, GoDaddy, Namecheap)
4. Vercel จะออกใบรับรอง SSL/HTTPS ฟรีให้อัตโนมัติในไม่กี่นาที
