FROM node:18-alpine

WORKDIR /nodejs2023Q2-service

COPY package.json package-lock.json ./

RUN npm install

COPY . .

RUN npx prisma generate

RUN npm run build

EXPOSE 4000

CMD ["node", "dist/src/main.js"]