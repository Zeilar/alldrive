import { Inject, Injectable } from "@nestjs/common";
import { NodePgDatabase } from "drizzle-orm/node-postgres";
import { files, schema } from "./schema";
import { and, count, eq, isNotNull, lt } from "drizzle-orm";

@Injectable()
export class DrizzleService {
  public constructor(@Inject("DB") private readonly db: NodePgDatabase<typeof schema>) {}

  public async getFilesByExternalId(externalId: string) {
    return this.db.query.files.findFirst({
      where: (fields) => eq(fields.externalId, externalId),
      columns: {
        expires: true,
        externalId: true,
        password: true,
      },
    });
  }

  public async insertFile(
    externalId: string,
    size: number,
    expires: number,
    hashedPassword?: string
  ) {
    await this.db.insert(files).values({ externalId, size, expires, password: hashedPassword });
  }

  public async deleteFileById(externalId: string) {
    await this.db.delete(files).where(eq(files.externalId, externalId));
  }

  public async totalDbSize(): Promise<number> {
    const sizes = await this.db.select({ size: files.size }).from(files);
    return sizes.reduce((accumulated, { size }) => accumulated + size, 0);
  }

  public deleteExpiredFiles() {
    return this.db
      .delete(files)
      .where(lt(files.expires, Date.now()))
      .returning({ externalId: files.externalId });
  }

  public async isFilePasswordProtected(externalId: string): Promise<boolean> {
    const [result] = await this.db
      .select({ count: count() })
      .from(files)
      .where(and(eq(files.externalId, externalId), isNotNull(files.password)));
    return result.count > 0;
  }

  public async fileExists(externalId: string): Promise<boolean> {
    const [result] = await this.db
      .select({ count: count() })
      .from(files)
      .where(eq(files.externalId, externalId));
    return result.count > 0;
  }
}
