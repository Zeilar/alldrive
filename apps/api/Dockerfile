FROM node:20 as build

WORKDIR /app

COPY . .

RUN npm i

RUN npx nx build api

RUN npx nx reset

FROM node:alpine as main

WORKDIR /app

COPY --from=build /app .

EXPOSE ${API_PORT}

CMD ["npx", "nx", "serve", "api", "--prod"]
