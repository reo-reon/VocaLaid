import { Injectable, Logger } from '@nestjs/common';
import { IRsvpRepository } from '../domain/rsvp.repository.interface';
import {
  RsvpGuest,
  RsvpStatus,
  GuestCategory,
  AgeCategory,
  DietaryRestriction,
} from '../domain/rsvp-guest.entity';
import { PrismaService } from '../../shared/infrastructure/prisma.service';

@Injectable()
export class PrismaRsvpRepository implements IRsvpRepository {
  private readonly logger = new Logger(PrismaRsvpRepository.name);

  constructor(private readonly prisma: PrismaService) {}

  async create(
    primaryGuest: RsvpGuest,
    companions: RsvpGuest[],
  ): Promise<RsvpGuest> {
    this.logger.debug(
      `[Repository] prisma.rsvpGuest.create 開始 - email=${primaryGuest.email}, companions=${companions.length}名`,
    );
    let createdGuest: Awaited<ReturnType<typeof this.prisma.rsvpGuest.create>>;
    try {
      createdGuest = await this.prisma.rsvpGuest.create({
        data: {
          status: primaryGuest.status,
          guestCategory: primaryGuest.guestCategory,
          japaneseLastName: primaryGuest.japaneseLastName,
          japaneseFirstName: primaryGuest.japaneseFirstName,
          kanaLastName: primaryGuest.kanaLastName,
          kanaFirstName: primaryGuest.kanaFirstName,
          email: primaryGuest.email,
          zipcode: primaryGuest.zipcode,
          address: primaryGuest.address,
          building: primaryGuest.building,
          phone: primaryGuest.phone,
          ageCategory: primaryGuest.ageCategory,
          dietaryRestrictions: primaryGuest.dietaryRestrictions,
          allergyInfo: primaryGuest.allergyInfo,
          afterParty: primaryGuest.afterParty,
          message: primaryGuest.message,
          companions: {
            create: companions.map((companion) => ({
              status: companion.status,
              guestCategory: companion.guestCategory,
              japaneseLastName: companion.japaneseLastName,
              japaneseFirstName: companion.japaneseFirstName,
              kanaLastName: companion.kanaLastName,
              kanaFirstName: companion.kanaFirstName,
              email: companion.email,
              zipcode: companion.zipcode,
              address: companion.address,
              building: companion.building,
              phone: companion.phone,
              ageCategory: companion.ageCategory,
              dietaryRestrictions: companion.dietaryRestrictions,
              allergyInfo: companion.allergyInfo,
              afterParty: companion.afterParty,
              message: companion.message,
            })),
          },
        },
        include: {
          companions: true,
        },
      });
    } catch (error) {
      this.logger.error(
        `[Repository] prisma.rsvpGuest.create 失敗 - ${(error as Error).message}`,
        (error as Error).stack,
      );
      throw error;
    }

    this.logger.debug(
      `[Repository] prisma.rsvpGuest.create 成功 - guestId=${createdGuest.id}`,
    );

    return new RsvpGuest({
      ...createdGuest,
      status: createdGuest.status as RsvpStatus,
      guestCategory: createdGuest.guestCategory as GuestCategory,
      ageCategory: createdGuest.ageCategory as AgeCategory | undefined,
      dietaryRestrictions: createdGuest.dietaryRestrictions as DietaryRestriction,
      email: createdGuest.email ?? undefined,
      zipcode: createdGuest.zipcode ?? undefined,
      address: createdGuest.address ?? undefined,
      building: createdGuest.building ?? undefined,
      phone: createdGuest.phone ?? undefined,
      allergyInfo: createdGuest.allergyInfo ?? undefined,
      afterParty: createdGuest.afterParty,
      message: createdGuest.message ?? undefined,
      primaryGuestId: createdGuest.primaryGuestId ?? undefined,
    });
  }

  async findById(id: number): Promise<RsvpGuest | null> {
    const guest = await this.prisma.rsvpGuest.findUnique({
      where: { id },
      include: {
        companions: true,
      },
    });

    if (!guest) return null;

    return new RsvpGuest({
      ...guest,
      status: guest.status as RsvpStatus,
      guestCategory: guest.guestCategory as GuestCategory,
      ageCategory: guest.ageCategory as AgeCategory | undefined,
      dietaryRestrictions: guest.dietaryRestrictions as DietaryRestriction,
      email: guest.email ?? undefined,
      zipcode: guest.zipcode ?? undefined,
      address: guest.address ?? undefined,
      building: guest.building ?? undefined,
      phone: guest.phone ?? undefined,
      allergyInfo: guest.allergyInfo ?? undefined,
      message: guest.message ?? undefined,
      primaryGuestId: guest.primaryGuestId ?? undefined,
    });
  }

  async findByEmail(email: string): Promise<RsvpGuest | null> {
    const guest = await this.prisma.rsvpGuest.findFirst({
      where: { email },
      include: {
        companions: true,
      },
    });

    if (!guest) return null;

    return new RsvpGuest({
      ...guest,
      status: guest.status as RsvpStatus,
      guestCategory: guest.guestCategory as GuestCategory,
      ageCategory: guest.ageCategory as AgeCategory | undefined,
      dietaryRestrictions: guest.dietaryRestrictions as DietaryRestriction,
      email: guest.email ?? undefined,
      zipcode: guest.zipcode ?? undefined,
      address: guest.address ?? undefined,
      building: guest.building ?? undefined,
      phone: guest.phone ?? undefined,
      allergyInfo: guest.allergyInfo ?? undefined,
      message: guest.message ?? undefined,
      primaryGuestId: guest.primaryGuestId ?? undefined,
    });
  }
}
