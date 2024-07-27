FROM node:20 as build

WORKDIR /app

COPY . .

RUN npm i

FROM node:alpine as main

WORKDIR /app

COPY --from=build /app .

EXPOSE 5555

CMD ["npx", "nx", "serve", "api"]
