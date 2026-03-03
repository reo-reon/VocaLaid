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
import {
  RsvpStatus,
  GuestCategory,
  AgeCategory,
  DietaryRestriction,
} from '../../domain/rsvp-guest.entity';

/** ゲスト1名分のDTO（主ゲスト・お連れ様共通） */
export class CreateRsvpGuestItemDto {
  @Transform(({ value }) => value?.toUpperCase())
  @IsEnum(RsvpStatus)
  status: RsvpStatus;

  @Transform(({ value }) => value?.toUpperCase())
  @IsEnum(GuestCategory)
  guestCategory: GuestCategory;

  @IsNotEmpty({ message: '姓を入力してください' })
  @IsString()
  japaneseLastName: string;

  @IsNotEmpty({ message: '名を入力してください' })
  @IsString()
  japaneseFirstName: string;

  @IsNotEmpty({ message: '姓（かな）を入力してください' })
  @IsString()
  kanaLastName: string;

  @IsNotEmpty({ message: '名（かな）を入力してください' })
  @IsString()
  kanaFirstName: string;

  /** 主ゲストは必須、お連れ様は任意（空文字はundefinedとして扱う） */
  @IsOptional()
  @Transform(({ value }) => (value === '' ? undefined : value))
  @IsEmail({}, { message: 'Valid email is required' })
  email?: string;

  @IsOptional()
  @IsString()
  @MaxLength(8)
  zipcode?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsString()
  building?: string;

  @IsOptional()
  @IsString()
  @MaxLength(13)
  phone?: string;

  @IsOptional()
  @Transform(({ value }) => value?.toUpperCase())
  @IsEnum(AgeCategory)
  ageCategory?: AgeCategory;

  @Transform(({ value }) => value?.toUpperCase())
  @IsEnum(DietaryRestriction)
  dietaryRestrictions: DietaryRestriction;

  @IsOptional()
  @IsString()
  @MaxLength(15)
  allergyInfo?: string;

  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => (value == null ? false : Boolean(value)))
  afterParty?: boolean;

  @IsOptional()
  @IsString()
  message?: string;
}

/** バッチ登録DTO：[0] = 主ゲスト、[1..] = お連れ様 */
export class CreateRsvpBatchDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateRsvpGuestItemDto)
  guests: CreateRsvpGuestItemDto[];
}
