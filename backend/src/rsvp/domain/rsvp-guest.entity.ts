export enum RsvpStatus {
  ATTENDING = 'ATTENDING',
  NOT_ATTENDING = 'NOT_ATTENDING',
}

export enum GuestCategory {
  GROOM = 'GROOM',
  BRIDE = 'BRIDE',
}

export enum AgeCategory {
  ADULT = 'ADULT',
  CHILD = 'CHILD',
  INFANT = 'INFANT',
}

export enum DietaryRestriction {
  WITH = 'WITH',
  WITHOUT = 'WITHOUT',
}

export class RsvpGuest {
  id?: number;
  status: RsvpStatus;
  guestCategory: GuestCategory;
  japaneseLastName: string;
  japaneseFirstName: string;
  kanaLastName: string;
  kanaFirstName: string;
  email?: string;
  zipcode?: string;
  address?: string;
  building?: string;
  phone?: string;
  ageCategory?: AgeCategory;
  dietaryRestrictions: DietaryRestriction;
  allergyInfo?: string;
  message?: string;
  primaryGuestId?: number;
  createdAt?: Date;
  updatedAt?: Date;

  constructor(partial: Partial<RsvpGuest>) {
    Object.assign(this, partial);
  }
}

