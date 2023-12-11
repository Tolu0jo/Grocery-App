FROM node:18-alpine as transpilation

WORKDIR /transpile

COPY . .

RUN yarn

RUN yarn tsc

#stage 2
FROM  node:18-alpine

WORKDIR /app/products

COPY --from=transpilation /transpile/dist  ./dist

COPY .env.dev .

COPY package.json .

RUN yarn --prod

COPY yarn.lock .

EXPOSE 8002

CMD ["node","dist/index.js"]

 