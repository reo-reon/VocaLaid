// 結婚式招待ページの型定義

export interface Person {
  japaneseFirstName: string;
  japaneseLastName: string;
  romanFirstName: string;
  romanLastName: string;
  birthDate: string;
  bloodType: string;
  introduction: string;
  profileImage: string;
}

export interface Venue {
  name: string;
  address?: string;
  phone?: string;
  website?: string;
  mapUrl?: string;
}

export interface Event {
  type: 'ceremony' | 'reception';
  date: string;
  weekday: string;
  time: string;
  venue: Venue;
}

export interface RSVPFormData {
  status: 'attending' | 'not-attending';
  guestCategory: 'groom' | 'bride';
  japaneseFirstName: string;
  japaneseLastName: string;
  kanaFirstName: string;
  kanaLastName: string;
  email?: string;
  ageCategory?: 'adult' | 'child' | 'infant' | 'baby';
  zipcode?: string;
  address?: string;
  building?: string;
  phone?: string;
  dietaryRestrictions: 'with' | 'without';
  allergyInfo?: string;
  afterParty?: boolean;
  message?: string;
}

export interface WeddingInvitationConfig {
  groom: Person;
  bride: Person;
  greetingMessage: string;
  ceremony: Event;
  reception: Event;
  rsvpDeadline: string;
  rsvpDeadlineDate: string;
}
