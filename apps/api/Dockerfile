FROM node:20 as build

WORKDIR /app

COPY . .

RUN npm i

RUN npx nx build api

FROM node:alpine as main

WORKDIR /app

COPY --from=build /app/dist/apps/api .
COPY --from=build /app/.env .

RUN npm i -g dotenv-cli

EXPOSE ${API_PORT}

CMD ["dotenv", "-e", ".env", "--", "node", "main.js"]
