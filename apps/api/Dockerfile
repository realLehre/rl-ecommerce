# Line 1
FROM node:20-alpine as builder
# Line 2
ENV NODE_ENV build
# Line 3
WORKDIR /api
# Line 4
COPY package*.json ./
# Line 5
RUN npm install
# Line 6
COPY . .
# Line 7
RUN npx prisma generate && npx nx build api --prod

# Line 8
FROM node:20-alpine
# Line 9
ENV NODE_ENV production
# Line 10
WORKDIR /api
# Line 11
COPY --from=builder  /api/package*.json ./
COPY --from=builder  /api/node_modules/ ./node_modules/
COPY --from=builder  /api/dist/ ./dist/
# Line 12
CMD ["node", "dist/api/src/main.js"]