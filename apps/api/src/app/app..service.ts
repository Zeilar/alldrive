import { Injectable, Logger } from "@nestjs/common";
import { DrizzleService } from "../db/orm/drizzle/drizzle.service";
import base58 from "base58-random";
import { EXTERNAL_ID_LENGTH } from "@alldrive/config";
import { compare, hash } from "bcrypt";
import { mkdir, rm } from "fs/promises";
import archiver from "archiver";
import { createWriteStream, existsSync } from "fs";

@Injectable()
export class AppService {
  private readonly logger = new Logger(AppService.name);

  public constructor(private readonly drizzleService: DrizzleService) {}

  public async uploadFiles(
    files: Array<Express.Multer.File>,
    size: number,
    expires: number,
    password?: string
  ): Promise<string> {
    const externalId = base58(EXTERNAL_ID_LENGTH);
    let hashedPassword: string | undefined;
    if (password) {
      hashedPassword = await hash(password, 10);
    }
    const uploadsPath = `${__dirname}/uploads`;
    const path = `${uploadsPath}/${externalId}.zip`;
    try {
      if (!existsSync(uploadsPath)) {
        await mkdir(uploadsPath);
      }
      const zip = archiver("zip", { zlib: { level: 9 } });
      zip.pipe(createWriteStream(path));
      files.forEach(({ buffer, originalname }) => {
        zip.append(buffer, { name: originalname });
      });
      await zip.finalize();
      await this.drizzleService.insertFile(externalId, size, expires, hashedPassword);
      return externalId;
    } catch (error) {
      if (existsSync(path)) {
        await rm(path, { recursive: true });
      }
      await this.drizzleService.deleteFileById(externalId);
      throw error;
    }
  }

  public getFilesByExternalId(externalId: string) {
    return this.drizzleService.getFilesByExternalId(externalId);
  }

  public async deleteFilesByExternalId(externalId: string) {
    try {
      const filePath = `${__dirname}/uploads/${externalId}.zip`;
      const fileExists = existsSync(filePath);
      if (!fileExists) {
        this.logger.warn(`Failed to delete ${externalId} as it does not exist.`);
        return;
      }
      await rm(filePath, { recursive: true });
    } catch (error) {
      this.logger.error(
        `Failed to delete ${externalId}`,
        error && typeof error === "object" && "stack" in error && error.stack
      );
    }
  }

  public checkPassword(password: string, encrypted: string) {
    return compare(password.trim(), encrypted.trim());
  }
}
