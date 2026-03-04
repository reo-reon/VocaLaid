import {
  IsArray,
  IsBoolean,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  ValidateNested,
} from 'class-validator';
import { Type, Transform } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  RsvpStatus,
  GuestCategory,
  AgeCategory,
  DietaryRestriction,
} from '../../domain/rsvp-guest.entity';

/** ゲスト1名分のDTO（主ゲスト・お連れ様共通） */
export class CreateRsvpGuestItemDto {
  @ApiProperty({ enum: RsvpStatus, enumName: 'RsvpStatus' })
  @Transform(({ value }) => value?.toUpperCase())
  @IsEnum(RsvpStatus)
  status: RsvpStatus;

  @ApiProperty({ enum: GuestCategory, enumName: 'GuestCategory' })
  @Transform(({ value }) => value?.toUpperCase())
  @IsEnum(GuestCategory)
  guestCategory: GuestCategory;

  @ApiProperty()
  @IsNotEmpty({ message: '姓を入力してください' })
  @IsString()
  japaneseLastName: string;

  @ApiProperty()
  @IsNotEmpty({ message: '名を入力してください' })
  @IsString()
  japaneseFirstName: string;

  @ApiProperty()
  @IsNotEmpty({ message: '姓（かな）を入力してください' })
  @IsString()
  kanaLastName: string;

  @ApiProperty()
  @IsNotEmpty({ message: '名（かな）を入力してください' })
  @IsString()
  kanaFirstName: string;

  /** 主ゲストは必須、お連れ様は任意（空文字はundefinedとして扱う） */
  @ApiPropertyOptional()
  @IsOptional()
  @Transform(({ value }) => (value === '' ? undefined : value))
  @IsEmail({}, { message: 'Valid email is required' })
  email?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(8)
  zipcode?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  address?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  building?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(13)
  phone?: string;

  @ApiPropertyOptional({ enum: AgeCategory, enumName: 'AgeCategory' })
  @IsOptional()
  @Transform(({ value }) => value?.toUpperCase())
  @IsEnum(AgeCategory)
  ageCategory?: AgeCategory;

  @ApiProperty({ enum: DietaryRestriction, enumName: 'DietaryRestriction' })
  @Transform(({ value }) => value?.toUpperCase())
  @IsEnum(DietaryRestriction)
  dietaryRestrictions: DietaryRestriction;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(15)
  allergyInfo?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => (value == null ? false : Boolean(value)))
  afterParty?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  message?: string;
}

/** バッチ登録DTO：[0] = 主ゲスト、[1..] = お連れ様 */
export class CreateRsvpBatchDto {
  @ApiProperty({ type: [CreateRsvpGuestItemDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateRsvpGuestItemDto)
  guests: CreateRsvpGuestItemDto[];
}

