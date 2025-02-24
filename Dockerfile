# مرحله اول: ساخت (Build Stage)
FROM node:20-alpine AS builder

# تنظیم دایرکتوری کاری
WORKDIR /app

# کپی فایل‌های package و نصب وابستگی‌ها (شما می‌توانید برای محیط توسعه از --production=false استفاده کنید)
COPY package.json package-lock.json ./
RUN npm install -f

# کپی بقیه کدهای پروژه
COPY . .

# تنظیم محیط به حالت production
ENV NODE_ENV=production

# اجرای build برنامه (این مرحله خروجی build را در پوشه .next ایجاد می‌کند)
RUN npm run build

---

# مرحله دوم: ساخت تصویر نهایی (Production Stage)
FROM node:20-alpine

WORKDIR /app

# کپی خروجی build و node_modules از مرحله builder
COPY --from=builder /app ./

# تنظیم محیط به production
ENV NODE_ENV=production

# باز کردن پورت مورد نیاز (مثلاً 3000)
EXPOSE 3000

# اجرای برنامه
CMD ["npm", "start"]
