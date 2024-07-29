FROM node:20 as build

WORKDIR /app

COPY . .

RUN npm i

RUN npx nx build frontend

FROM node:alpine as main

WORKDIR /app

COPY --from=build /app/dist/apps/frontend .
COPY --from=build /app/.env .
COPY --from=build /app/apps/frontend/ci.js .

RUN npm i

RUN npm i -g dotenv-cli

RUN dotenv -e .env -- node ci.js

EXPOSE ${FRONTEND_PORT}

CMD ["npm", "start"]
