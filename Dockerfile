FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./

# نصب پکیج‌ها
RUN npm install

COPY . .

RUN npm run build


FROM node:18-alpine AS runner

WORKDIR /app

COPY --from=builder /app/package*.json ./
RUN npm install --omit=dev

COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.js ./
COPY --from=builder /app/tailwind.config.ts ./
COPY --from=builder /app/postcss.config.mjs ./
COPY --from=builder /app/tsconfig.json ./
COPY --from=builder /app/next-env.d.ts ./


EXPOSE 3000

ENV NODE_ENV production

CMD ["npm", "run", "start"]
