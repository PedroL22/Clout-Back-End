FROM node:latest

WORKDIR /usr/src/api

COPY . .

RUN npm install -g pnpm

RUN pnpm i

RUN pnpm build

EXPOSE 3000

CMD ["pnpm", "start:prod"]
