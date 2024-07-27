import { Module } from "@nestjs/common";
import { ThrottlerGuard, ThrottlerModule } from "@nestjs/throttler";
import { AppController } from "./app.controller";
import { AppService } from "./app..service";
import { DrizzlePGModule } from "@knaadh/nestjs-drizzle-pg";
import { DrizzleService } from "../db/orm/drizzle/drizzle.service";
import { schema } from "../db/orm/drizzle/schema";
import { ScheduleModule } from "@nestjs/schedule";
import { ScheduleService } from "../schedule/schedule.service";

@Module({
  imports: [
    ThrottlerModule.forRoot([
      {
        ttl: 1000 * 60, // 1 minute
        limit: 10,
      },
    ]),
    ScheduleModule.forRoot(),
    DrizzlePGModule.register({
      pg: {
        connection: "client",
        config: {
          database: process.env.DB_NAME,
          host: process.env.DB_HOST,
          port: parseInt(process.env.DB_PORT),
          password: process.env.DB_PASSWORD,
          user: process.env.DB_USER,
        },
      },
      config: {
        schema,
        logger: process.env.NODE_ENV === "development",
      },
      tag: "DB",
    }),
  ],
  controllers: [AppController],
  providers: [AppService, DrizzleService, ScheduleService, ThrottlerGuard],
})
export class AppModule {}
