FROM node:20 as build

WORKDIR /app

COPY . .

RUN npm i && npx nx build api && cd dist/apps/api && npm i

FROM node:alpine as main

WORKDIR /app

COPY --from=build /app/node_modules .
COPY --from=build /app/dist/apps/api .
COPY --from=build /app/.env .

RUN npm i -g dotenv-cli

EXPOSE ${API_PORT}

CMD ["dotenv", "-e", ".env", "--", "node", "main.js"]
