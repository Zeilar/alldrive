import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Res,
  UploadedFiles,
  UseInterceptors,
} from "@nestjs/common";
import { AnyFilesInterceptor } from "@nestjs/platform-express";
import { AppService } from "./app..service";
import { MAX_DB_SIZE, MAX_EXPIRATION } from "@alldrive/config";
import type { Response } from "express";
import type { UploadFilesDto } from "@alldrive/dtos";
import z from "zod";
import { DrizzleService } from "../db/orm/drizzle/drizzle.service";
import { createReadStream } from "fs";

@Controller("/files")
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly drizzleService: DrizzleService
  ) {}
  @Get("/:externalId/unlock")
  public async unlock(
    @Res() res: Response,
    @Param("externalId") externalId: string,
    @Query("password") password: string
  ) {
    const files = await this.appService.getFilesByExternalId(externalId);
    if (files == null) {
      return res.status(404).end();
    }
    if (files.password == null) {
      return res.json(files);
    }
    const result = await this.appService.checkPassword(z.string().parse(password), files.password);
    return result ? res.status(204).end() : res.status(403).end();
  }

  @Get("/:externalId/is_protected")
  public async isFilePasswordProtected(
    @Res() res: Response,
    @Param("externalId") externalId: string
  ) {
    return res.json({
      isFilePasswordProtected: await this.drizzleService.isFilePasswordProtected(externalId),
    });
  }

  @Get("/:externalId")
  public async getFileById(
    @Res() res: Response,
    @Param("externalId") externalId: string,
    @Query("password") password?: string
  ) {
    const files = await this.appService.getFilesByExternalId(externalId);
    if (files == null) {
      return res.status(404).end();
    }
    if (files.password == null) {
      return res.json(files);
    }
    const result = await this.appService.checkPassword(z.string().parse(password), files.password);
    const fileStream = createReadStream(`${__dirname}/uploads/${externalId}.zip`);
    return result ? fileStream.pipe(res) : res.status(403).end();
  }

  @UseInterceptors(
    AnyFilesInterceptor({
      limits: {
        parts: 100,
        fields: 100,
        files: 100,
        fileSize: 1000 * 1000 * 1000, // 1GB
      },
    })
  )
  @Post("/")
  public async uploadFiles(
    @Body() body: UploadFilesDto,
    @UploadedFiles() files: Array<Express.Multer.File>,
    @Res() res: Response
  ) {
    const expires = z.number().max(MAX_EXPIRATION).parse(parseInt(body.expires));
    const totalSize = files.reduce((accumulated, { size }) => accumulated + size, 0);
    const currentDbSize = await this.drizzleService.totalDbSize();
    if (totalSize > MAX_DB_SIZE || currentDbSize + totalSize > MAX_DB_SIZE) {
      return res.status(413).end();
    }
    return res.json({
      externalId: await this.appService.uploadFiles(
        files,
        totalSize,
        Date.now() + expires,
        z.string().min(3).optional().parse(body.password)
      ),
    });
  }
}
