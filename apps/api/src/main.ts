// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { Multer } from "multer"; // Import library once anywhere in the app so that Express.Multer types work
import { Logger, ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app/app.module";
import { API_GLOBAL_PREFIX } from "@alldrive/config";

const { API_PORT, FRONTEND_HOST } = process.env;

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: { origin: FRONTEND_HOST },
  });
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.setGlobalPrefix(API_GLOBAL_PREFIX);
  await app.listen(API_PORT);
  Logger.log(`🚀 Application is running on: ${await app.getUrl()}/${API_GLOBAL_PREFIX}`);
}

bootstrap();
