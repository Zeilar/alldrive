FROM node:20 as build

WORKDIR /app

COPY . .

RUN npm i

RUN npx nx build frontend

RUN npx nx reset

FROM node:alpine as main

WORKDIR /app

COPY --from=build /app .

EXPOSE ${FRONTEND_PORT}

CMD ["npx", "nx", "start", "frontend", "-p", "${FRONTEND_PORT}"]
