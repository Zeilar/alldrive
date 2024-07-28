import { Inject, Injectable, Logger } from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";
import { DrizzleService } from "../db/orm/drizzle/drizzle.service";
import { AppService } from "../app/app..service";

@Injectable()
export class ScheduleService {
  private readonly logger = new Logger(ScheduleService.name);

  public constructor(
    @Inject(DrizzleService) private readonly drizzleService: DrizzleService,
    @Inject(AppService) private readonly appService: AppService
  ) {}

  @Cron(CronExpression.EVERY_MINUTE)
  public async deleteExpiredFiles(): Promise<void> {
    try {
      const files = await this.drizzleService.deleteExpiredFiles();
      if (!files.length) {
        return;
      }
      await Promise.all(
        files.map(({ externalId }) => this.appService.deleteFilesByExternalId(externalId))
      );
      this.logger.log(`Deleted ${files.length} expired files from the database`);
    } catch (error) {
      this.logger.error(
        "Failed deleting expired files",
        error && typeof error === "object" && "stack" in error && error.stack
      );
    }
  }
}
