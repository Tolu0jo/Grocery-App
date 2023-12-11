FROM node:18-alpine as transpilation

WORKDIR /transpile

COPY . .

RUN yarn

RUN yarn tsc

#stage 2
FROM  node:18-alpine

WORKDIR /app/shopping

COPY --from=transpilation /transpile/dist  ./dist

COPY .env.dev .

COPY package.json .

RUN yarn --prod

COPY yarn.lock .

EXPOSE 8003

CMD ["node","dist/index.js"]