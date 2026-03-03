import { Injectable, Inject, Logger, BadRequestException } from '@nestjs/common';
import { IRsvpRepository } from '../../domain/rsvp.repository.interface';
import { RsvpGuest } from '../../domain/rsvp-guest.entity';
import { CreateRsvpBatchDto } from '../dto/create-rsvp.dto';
import { RSVP_REPOSITORY } from '../../rsvp.module';

@Injectable()
export class CreateRsvpUseCase {
  private readonly logger = new Logger(CreateRsvpUseCase.name);

  constructor(
    @Inject(RSVP_REPOSITORY)
    private readonly rsvpRepository: IRsvpRepository,
  ) {}

  async execute(dto: CreateRsvpBatchDto): Promise<RsvpGuest> {
    if (!dto.guests || dto.guests.length === 0) {
      throw new BadRequestException('ゲスト情報が含まれていません');
    }

    const [primaryDto, ...companionDtos] = dto.guests;

    // 主ゲストのメールアドレス必須チェック
    if (!primaryDto.email) {
      throw new BadRequestException('主ゲストのメールアドレスは必須です');
    }

    this.logger.debug(`[UseCase] 主ゲストエンティティ生成開始 - email=${primaryDto.email}`);

    const primaryGuest = new RsvpGuest({
      status: primaryDto.status,
      guestCategory: primaryDto.guestCategory,
      japaneseLastName: primaryDto.japaneseLastName,
      japaneseFirstName: primaryDto.japaneseFirstName,
      kanaLastName: primaryDto.kanaLastName,
      kanaFirstName: primaryDto.kanaFirstName,
      email: primaryDto.email,
      zipcode: primaryDto.zipcode,
      address: primaryDto.address,
      building: primaryDto.building,
      phone: primaryDto.phone,
      ageCategory: primaryDto.ageCategory,
      dietaryRestrictions: primaryDto.dietaryRestrictions,
      allergyInfo: primaryDto.allergyInfo,
      message: primaryDto.message,
    });

    this.logger.debug(
      `[UseCase] 主ゲストエンティティ生成完了 - status=${primaryGuest.status}, guestCategory=${primaryGuest.guestCategory}`,
    );

    const companions: RsvpGuest[] = companionDtos.map(
      (companionDto) =>
        new RsvpGuest({
          status: companionDto.status,
          guestCategory: companionDto.guestCategory,
          japaneseLastName: companionDto.japaneseLastName,
          japaneseFirstName: companionDto.japaneseFirstName,
          kanaLastName: companionDto.kanaLastName,
          kanaFirstName: companionDto.kanaFirstName,
          email: companionDto.email,
          zipcode: companionDto.zipcode,
          address: companionDto.address,
          building: companionDto.building,
          phone: companionDto.phone,
          ageCategory: companionDto.ageCategory,
          dietaryRestrictions: companionDto.dietaryRestrictions,
          allergyInfo: companionDto.allergyInfo,
          message: companionDto.message,
        }),
    );

    this.logger.debug(
      `[UseCase] お連れ様エンティティ生成完了 - ${companions.length}名`,
    );

    // リポジトリを通じて永続化
    this.logger.debug('[UseCase] リポジトリへの保存開始');
    const saved = await this.rsvpRepository.create(primaryGuest, companions);
    this.logger.debug(`[UseCase] リポジトリへの保存完了 - guestId=${saved.id}`);
    return saved;
  }
}
