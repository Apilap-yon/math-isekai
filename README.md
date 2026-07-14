# 🌟 Math Isekai: ผู้ถูกเรียกข้ามโลก

แบบทดสอบเชิงนิทานเพื่อค้นหาว่าคุณคือ **นักคณิตศาสตร์ประเภทใด** จากการเดินทางข้ามมิติสู่โลกแห่งคณิตศาสตร์

---

## เกี่ยวกับโปรเจกต์

Math Isekai Quiz เป็น Interactive Narrative Quiz ที่พาคุณเดินทางผ่าน 10 ข้อคำถาม โดยแต่ละข้อมีเรื่องราวและฉากประกอบ ระบบจะวิเคราะห์รูปแบบการคิดและคำตอบของคุณเพื่อระบุ **Archetype นักคณิตศาสตร์** ที่เหมาะสมที่สุด พร้อมแนะนำ "Best Friend" Archetype ที่คุณจะปรึกษาได้

### 8 Archetype นักคณิตศาสตร์

| Archetype | สัญลักษณ์ | จุดเด่น |
|---|---|---|
| Hero | ⚔️ | ลุยทุกปัญหาด้วยพลังและความกล้า |
| Sage | 🧠 | เข้าใจลึก มองเห็นภาพรวมและสาระสำคัญ |
| Mage | ✨ | สร้างระบบและสูตร มองเห็นรูปแบบที่ลึกซึ้ง |
| Rogue | 🎯 | หาทางลัดและ trick เก่ง มีสติไว |
| Knight | 🛡️ | ทำตามขั้นตอนอย่างเป็นระบบ เชื่อถือได้ |
| Priestess | 💝 | สร้างสมดุลและความสัมพันธ์ ใจเย็น |
| Bard | 🎨 | อธิบายและ visualize ได้เก่ง สร้างสรรค์ |
| Seeker | 🔍 | อยากรู้อยากเห็น ชอบขุดหาคำตอบ เจาะลึก |

---

## คุณสมบัติ

- **10 คำถามเชิงนิทาน** — แต่ละข้อมีฉากและเรื่องราวประกอบ พร้อม Q7 Tiebreaker (8 ตัวเลือก)
- **ระบบคะแนน 8 Archetype** — วิเคราะห์รูปแบบการคิดและให้คะแนนแต่ละประเภท
- **ระบบ Best Friend** — แนะนำ Archetype คู่ซี้ที่เหมาะสมสำหรับแต่ละประเภท
- **หน้าผลลัพธ์แบบไพ่** — แสดง Strengths และ Areas for Growth พร้อมรูปคาแรกเตอร์ที่ปรับแต่ง
- **ธีม Parchment Beige** (#F5F5DC) + ฟอนต์ Google Fonts (Kanit + Sarabun)
- **เสียงพื้นหลัง (BGM)** — Howler.js จัดการเพลงตามแต่ละเฟส (intro/quiz/result)
- **ปุ่ม Mute** — มุมขวาบนเพื่อปิดเสียง + จัดการนโยบาย autoplay ของเบราว์เซอร์
- **Export PNG (1080×1920)** — บันทึกผลลัพธ์สำหรับ Instagram Stories ผ่าน html2canvas
- **Animation** — fade-in, orbit-spin, ring-spin, portrait-glow, floaty สำหรับประสบการณ์ที่ดี
- **Responsive Design** — รองรับมือถือและ desktop

---

## Quiz Flow & Phases

1. **Intro** — แสดงโลโก้กับไอคอน Archetype ที่ลอยหมุนรอบ
2. **Scene 1** — ฉากนิทาน "เสียงครูสอนดังแว่วมา..."
3. **Scene 2** — ฉากนิทาน "จู่ๆ แสงสว่างวาบขึ้น..."
4. **Quiz** — 10 คำถามพร้อม progress bar + Q7 Tiebreaker (เลือกได้ 1 คณสมบัติ)
5. **Outro** — ฉากเก็บเกี่ยว "ดาราศาสตร์กำลังเผยพลังของคุณ..."
6. **Result** — แสดง Archetype หลัก, Strengths, Growth, Best Friend, คะแนนรวม, ปุ่มบันทึกรูป

---

## การติดตั้งและรัน

### ติดตั้ง dependencies

```bash
npm install
```

### รันในโหมด development

```bash
npm start
```

เปิดเบราว์เซอร์ที่ [http://localhost:3000](http://localhost:3000)

### Build สำหรับ production

```bash
npm run build
```

ไฟล์ที่ build แล้วจะอยู่ในโฟลเดอร์ `build/`

### รันทดสอบ

```bash
npm test
```

---

## โครงสร้างโปรเจกต์

```
src/
├── data/
│   └── quiz.ts              — ข้อมูลคำถาม 10 ข้อ, 8 Archetype, และข้อมูล Best Friend
├── hooks/
│   ├── useQuiz.ts           — State management สำหรับ quiz flow
│   └── useAudio.ts          — Howler.js BGM/SFX management + autoplay unlock
├── components/
│   ├── IntroScreen.tsx      — หน้าแรกพร้อม archetype icons orbit animation
│   ├── SceneScreen.tsx      — ฉากนิทาน (scene1/scene2/outro)
│   ├── QuizScreen.tsx       — หน้าคำถาม progress bar และปุ่มตัวเลือก
│   ├── ResultScreen.tsx     — ผลลัพธ์พร้อม portrait, strengths, growth, best friend, export PNG
│   └── MuteButton.tsx       — ปุ่ม Mute มุมขวาบน
├── App.tsx                  — Routing ระหว่าง phase
└── App.css                  — ธีม animation และ styling ทั้งหมด

public/
├── archetypes/              — ไฟล์รูปคาแรกเตอร์ (hero.png ฯลฯ) สำหรับแต่ละ Archetype
└── ...
```

---

## เทคโนโลยีที่ใช้

- **React 18** + **TypeScript** — UI framework
- **Howler.js** — Audio management (BGM loops, SFX, muting)
- **html2canvas** — Export ผลลัพธ์เป็น PNG (1080×1920)
- **Google Fonts** — [Kanit](https://fonts.google.com/specimen/Kanit) (headings) + [Sarabun](https://fonts.google.com/specimen/Sarabun) (body text)
- **Create React App** — Development tooling
- **Vercel** — Hosting & deployment

### Audio Files

- `src/hooks/sigmamusicart-background-music-inspiring-525840.mp3` — Background music (bundled)

---

## Deployment

โปรเจกต์ deploy ผ่าน **Vercel** โดยเชื่อมกับ branch `claude/friendly-pascal-hfccfm` บน GitHub

### Deploy Steps

1. Push commits ไปยัง branch `claude/friendly-pascal-hfccfm`
2. Vercel จะ auto-deploy เมื่อมี push ใหม่
3. ดู deployment status ที่หน้า GitHub PR หรือ Vercel dashboard

---

## หมายเหตุสำคัญ

- **Browser Autoplay Policy**: เสียง BGM จะปลดล็อก (unlock) เมื่อผู้ใช้กดปุ่ม "เริ่มเกม" ครั้งแรก
- **PNG Export**: บันทึกเป็นรูปขนาด 1080×1920 พิกเซล (ใช้ได้เลยเป็น Instagram Story)
- **Character Images**: รูปคาแรกเตอร์ทั้ง 8 ประเภท ต้องเป็นไฟล์ PNG ขนาด 2048×2048 พิกเซล ไว้ในโฟลเดอร์ `public/archetypes/`
- **Animation Remount**: QuizScreen component จะ remount ใหม่สำหรับแต่ละคำถาม (ด้วย `key` prop) เพื่อให้ animation state ไม่ค้างจากข้อก่อนหน้า
