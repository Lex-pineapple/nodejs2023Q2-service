# FROM node:18-alpine AS development

# WORKDIR /nodejs2023Q2-service

# COPY package*.json ./

# RUN npm install --only=development

# COPY . .

# RUN npx prisma generate

# RUN npm run build

# FROM node:18-alpine AS production

# ARG NODE_ENV=production
# ENV NODE_ENV=${NODE_ENV}

# WORKDIR /nodejs2023Q2-service

# COPY package*.json ./

# RUN npm install --only=production

# COPY . .

# RUN npx prisma generate

# COPY --from=development /nodejs2023Q2-service/dist ./dist

# CMD [ "node", "dist/src/main"]


FROM node:18-alpine

WORKDIR /nodejs2023Q2-service

COPY package.json package-lock.json ./

RUN npm install && npm cache clean --force

COPY . .

RUN npx prisma generate

EXPOSE 4000

CMD ["npm", "run", "migrate:start:dev"]