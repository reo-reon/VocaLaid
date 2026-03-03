import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  UsePipes,
  ValidationPipe,
  Logger,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateRsvpBatchDto } from '../application/dto/create-rsvp.dto';
import { CreateRsvpUseCase } from '../application/use-cases/create-rsvp.use-case';

@Controller('rsvp')
export class RsvpController {
  private readonly logger = new Logger(RsvpController.name);

  constructor(private readonly createRsvpUseCase: CreateRsvpUseCase) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  )
  async create(@Body() createRsvpDto: CreateRsvpBatchDto) {
    const primary = createRsvpDto.guests?.[0];
    this.logger.log(
      `[POST /api/rsvp] リクエスト受信 - guestCategory=${primary?.guestCategory}, status=${primary?.status}, email=${primary?.email}, guestsTotal=${createRsvpDto.guests?.length ?? 0}名`,
    );

    try {
      const result = await this.createRsvpUseCase.execute(createRsvpDto);
      this.logger.log(
        `[POST /api/rsvp] 登録成功 - guestId=${result.id}, email=${result.email}`,
      );
      return {
        statusCode: HttpStatus.CREATED,
        message: 'ご出欠情報の登録が完了しました',
        data: result,
      };
    } catch (error) {
      this.logger.error(
        `[POST /api/rsvp] エラー発生 - ${(error as Error).message}`,
        (error as Error).stack,
      );
      throw new InternalServerErrorException(
        '登録処理中にエラーが発生しました。しばらく時間をおいて再度お試しください。',
      );
    }
  }
}
