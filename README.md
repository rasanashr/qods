# شبکه قدس — سوپر اپ شهروندان

سوپر اپ یکپارچه شهروندان شهر قدس، شامل:

- 🏠 صفحه اصلی موبایل‌محور با ۱۲ سرویس
- 🏢 املاک (فروش + رهن و اجاره)
- 🔍 اشیاء گمشده (گم‌شده + پیدا‌شده)
- 📞 سامانه ۱۳۷ (ثبت و پیگیری درخواست‌های شهری)
- 🍽️ سفارش غذا (۸ دسته‌بندی + رستوران‌ها)
- 🛍️ فروشگاه لوازم خانگی
- 🔐 ورود/ثبت‌نام با شماره موبایل و OTP
- 👤 پروفایل کامل کاربر (کیف پول، آگهی‌ها، سوابق)
- 🛠️ پنل ادمین کامل (CRUD همه منابع)

## تکنولوژی‌ها

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 4 + shadcn/ui
- **Database**: Prisma ORM (SQLite/PostgreSQL)
- **Auth**: JWT با `jose` + OTP با bcryptjs
- **Runtime**: Bun

## راه‌اندازی محلی

```bash
# نصب وابستگی‌ها
bun install

# تنظیم متغیرهای محیطی
cp .env.example .env

# ایجاد دیتابیس
bun run db:push

# seed داده‌های اولیه (ادمین + محصولات + ...)
bun run scripts/seed.ts
bun run scripts/seed-pricing.ts
bun run scripts/seed-user-data.ts

# اجرای سرور توسعه
bun run dev
```

### اطلاعات ورود پیش‌فرض

- **پنل ادمین**: `/admin/login`
  - نام کاربری: `admin`
  - رمز عبور: `admin123`
- **کاربر نمونه**: شماره `09123456789` (در محیط سندباکس، کد OTP در بنر زرد نمایش داده می‌شود)

## دیپلوی روی Vercel

### مرحله ۱: آماده‌سازی پایگاه داده

SQLite روی Vercel کار نمی‌کند (filesystem فقط در زمان build قابل نوشتن است). برای production، یک PostgreSQL استفاده کنید:

- **Vercel Postgres** (توصیه شده) — از داشبورد Vercel
- **Neon** (رایگان) — neon.tech
- **Supabase** (رایگان) — supabase.com
- **PlanetScale** (MySQL)

پس از ساخت DB، connection string را کپی کنید.

### مرحله ۲: تنظیم `prisma/schema.prisma`

فایل `prisma/schema.prisma` را باز کنید و datasource را از SQLite به PostgreSQL تغییر دهید:

```prisma
datasource db {
  provider = "postgresql"   // به‌جای "sqlite"
  url      = env("DATABASE_URL")
}
```

### مرحله ۳: تنظیم Environment Variables در Vercel

در داشبورد Vercel → Project → Settings → Environment Variables، این‌ها را اضافه کنید:

| Key | Value |
|---|---|
| `DATABASE_URL` | postgresql://user:pass@host:port/dbname?schema=public |
| `ADMIN_JWT_SECRET` | یک رشته تصادفی ۳۲+ کاراکتر (با `openssl rand -hex 32` تولید کنید) |
| `USER_JWT_SECRET` | یک رشته تصادفی ۳۲+ کاراکتر (با `openssl rand -hex 32` تولید کنید) |
| `OTP_SANDBOX` | برای production: `false` (کد از طریق SMS ارسال شود) |

### مرحله ۴: Push به GitHub

```bash
git init
git add .
git commit -m "Initial commit - شبکه قدس super app"
git branch -M main
git remote add origin https://github.com/YOUR_USER/quds-superapp.git
git push -u origin main
```

### مرحله ۵: Import در Vercel

1. به [vercel.com](https://vercel.com) بروید
2. **Add New → Project** را بزنید
3. Repo را import کنید
4. Framework: Next.js (به‌صورت خودکار تشخیص داده می‌شود)
5. Build Command: `bun run build` (یا `npm run build`)
6. Install Command: `bun install` (یا `npm install`)
7. **Deploy** را بزنید

### مرحله ۶: ایجاد schema و seed

بعد از دیپلوی اول، باید schema را در DB ایجاد کنید. دو راه:

**راه ۱: از Vercel CLI**
```bash
npm i -g vercel
vercel login
vercel link  # به پروژه‌تان لینک کنید
vercel env pull .env  # متغیرهای محیطی Vercel را به فایل .env محلی بکشید
bun run db:push  # schema را در DB واقعی اعمال کنید
bun run scripts/seed.ts  # ادمین + داده‌های نمونه
bun run scripts/seed-pricing.ts
bun run scripts/seed-user-data.ts  # اختیاری
```

**راه ۲: از صفحه وب Vercel** — یک migration endpoint بسازید و در آن `prisma db push` را اجرا کنید.

### مرحله ۷: تست

- سایت دیپلوی‌شده را باز کنید
- به `/admin/login` بروید و با `admin/admin123` وارد شوید
- در صفحه اصلی، روی تب «پروفایل» بزنید و با شماره `09123456789` وارد شوید (در سندباکس کد در بنر زرد نمایش داده می‌شود)

## ساختار پروژه

```
.
├── prisma/
│   └── schema.prisma          # ۱۲+ مدل: AdminUser, AppUser, Product, Property, LostFoundItem, Restaurant, Sama137Request, NewsItem, Banner, Classified, ClassifiedPricing, OtpCode, WalletTransaction, PageVisit, Order, OrderItem, AdminLog
├── public/                    # فایل‌های استاتیک
├── scripts/
│   ├── seed.ts                # ادمین + داده‌های پایه
│   ├── seed-pricing.ts        # قیمت‌گذاری آگهی‌ها
│   ├── seed-user-data.ts      # داده‌های نمونه کاربر
│   └── update-product-bg.ts   # اسکریپت نگهداری
├── src/
│   ├── app/
│   │   ├── admin/             # پنل ادمین (با layout و ۱۰+ صفحه)
│   │   ├── api/
│   │   │   ├── admin/         # ۱۷ endpoint ادمین (با JWT auth)
│   │   │   ├── public/        # ۹ endpoint عمومی (بدون auth)
│   │   │   └── user/          # ۱۲ endpoint کاربر (با JWT auth)
│   │   ├── layout.tsx         # layout ریشه با RTL + Vazirmatn
│   │   ├── page.tsx           # صفحه اصلی سوپر اپ
│   │   └── globals.css        # استایل‌های گلوبال
│   ├── components/
│   │   ├── admin/             # ۱۳ کامپوننت ادمین
│   │   └── app/               # ۲۰+ کامپوننت سوپر اپ
│   ├── lib/
│   │   ├── admin-auth.ts      # JWT و session ادمین
│   │   ├── admin-utils.ts     # helper های ادمین
│   │   ├── auth-store.ts      # Zustand store احراز هویت کاربر (persist)
│   │   ├── data.ts            # داده‌های استاتیک (categories، services)
│   │   ├── db.ts              # Prisma client
│   │   ├── nav-store.ts       # Zustand store ناوبری
│   │   ├── queries.ts         # توابع query عمومی
│   │   ├── user-auth.ts       # JWT و OTP و کیف پول کاربر
│   │   └── utils.ts           # utils
│   └── hooks/                 # React hooks
├── package.json
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
├── vercel.json                # تنظیمات Vercel
└── .env.example               # نمونه متغیرهای محیطی
```

## API Endpoints

### عمومی (بدون auth) `/api/public/*`
- `GET /banners?position=` — بنرها
- `GET /news` — اخبار
- `GET /products` — محصولات
- `GET /products-by-id?id=` — یک محصول
- `GET /properties` — آگهی املاک
- `GET /lost-found` — اشیاء گمشده
- `GET /restaurants` — رستوران‌ها
- `GET /sama137` — درخواست‌های سامانه ۱۳۷
- `GET /sama137-by-code?code=` — جستجو با کد رهگیری

### ادمین (با JWT) `/api/admin/*`
- `POST/GET/DELETE /auth` — ورود/session/خروج
- `GET /dashboard` — آمار داشبورد
- `GET /logs` — لاگ اقدامات
- `GET/POST + PATCH/DELETE` برای: users, products, properties, restaurants, sama137, news, banners, lost-found

### کاربر (با JWT) `/api/user/*`
- `POST/GET/DELETE /auth` — send_code/verify_code/session/logout
- `GET/PATCH /me` — اطلاعات + آمار + ویرایش نام
- `GET/POST /wallet` — موجودی + شارژ + تراکنش‌ها
- `GET/POST + GET/PATCH/DELETE /classifieds` — آگهی‌های کاربر
- `GET /classifieds/pricing` — قیمت‌گذاری
- `GET/POST + GET/PATCH/DELETE /lost-found` — موارد کاربر
- `GET/POST + GET/DELETE /sama137` — درخواست‌های ۱۳۷ کاربر
- `GET/POST /visits` — سابقه بازدید
- `GET /orders` — سفارش‌های کاربر

## امکانات سوپر اپ

### برای شهروندان
- 📱 طراحی موبایل‌محور (حتی در دسکتاپ قاب گوشی شبیه‌سازی شده)
- 🌐 فارسی + راست‌چین + فونت Vazirmatn
- 🔐 ورود با شماره موبایل و OTP
- 💳 کیف پول با شارژ + تراکنش
- 📋 ثبت آگهی (رایگان/ویژه/فوری با پرداخت از کیف پول)
- 🔍 ثبت اشیاء گمشده
- 📞 ثبت درخواست ۱۳۷ با کد رهگیری
- 📊 پروفایل با ۷ تب: خلاصه، کیف پول، آگهی‌ها، اشیاء، ۱۳۷، سفارش‌ها، بازدیدها

### برای ادمین‌ها
- 🛡️ ۳ نقش: superadmin / admin / editor
- 📊 داشبورد با آمار کامل
- ✅ تأیید/رد آگهی‌ها و درخواست‌ها
- 📦 CRUD کامل همه منابع
- 📝 لاگ همه اقدامات

## امنیت

- JWT در cookie HTTP-only
- OTP با انقضای ۲ دقیقه + brute-force protection (max ۵ تلاش)
- رمز عبور ادمین با bcryptjs هش می‌شود
- همه API های ادمین با `requireAdmin` محافظت می‌شوند
- همه API های کاربر با `requireUser` محافظت می‌شوند

## مجوز

این پروژه برای شهر قدس توسعه یافته است. برای استفاده در شهر دیگر، با توسعه‌دهنده در ارتباط باشید.

---

**ارائه شده توسط رسا نشر © ۱۴۰۴**
