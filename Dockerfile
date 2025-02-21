# مرحله اول: بیلد پروژه
FROM node:18-alpine AS builder

WORKDIR /app

# نصب وابستگی‌ها
COPY package.json package-lock.json ./
RUN npm install

# کپی بقیه فایل‌ها و بیلد پروژه
COPY . .
RUN npm run build

# مرحله دوم: اجرای پروژه در محیط production
FROM node:18-alpine AS runner

WORKDIR /app

# فقط فایل‌های ضروری را کپی کن تا ایمیج سبک‌تر باشد
COPY --from=builder /app/package.json ./
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.ts ./
COPY --from=builder /app/tailwind.config.ts ./
COPY --from=builder /app/postcss.config.mjs ./
COPY --from=builder /app/tsconfig.json ./
COPY --from=builder /app/next-env.d.ts ./

# نصب فقط وابستگی‌های مورد نیاز برای اجرا
RUN npm install --omit=dev

EXPOSE 3000
ENV NODE_ENV production

CMD ["node", "server.js"]
