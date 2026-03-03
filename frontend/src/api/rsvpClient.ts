/**
 * RSVP Client for handling RSVP-related API calls
 */

import { RestClient } from './restClient';
import { RSVPFormData } from '@/feature/wedding/types';

/**
 * バックエンドへ送信するゲスト1名分のDTO（主ゲスト・お連れ様共通）
 */
export interface RSVPGuestItemDTO {
  status: 'ATTENDING' | 'NOT_ATTENDING';
  guestCategory: 'GROOM' | 'BRIDE';
  japaneseLastName: string;
  japaneseFirstName: string;
  kanaLastName: string;
  kanaFirstName: string;
  email?: string;
  ageCategory?: 'ADULT' | 'CHILD' | 'INFANT' | 'BABY';
  zipcode?: string;
  address?: string;
  building?: string;
  phone?: string;
  dietaryRestrictions: 'WITH' | 'WITHOUT';
  allergyInfo?: string;
  afterParty?: boolean;
  message?: string;
}

/**
 * RSVP バッチ送信DTO（配列形式）
 */
export interface RSVPSubmissionDTO {
  guests: RSVPGuestItemDTO[];
}

/**
 * API Response for RSVP submission
 */
export interface RSVPSubmissionResponse {
  statusCode: number;
  message: string;
  data?: Record<string, unknown>;
}

export class RSVPClient extends RestClient {
  constructor(baseUrl?: string) {
    super(baseUrl);
  }

  /**
   * RSVPFormData を APIへ送信するDTOに変換
   */
  private convertGuestToDTO(guest: RSVPFormData): RSVPGuestItemDTO {
    const toUpper = (v?: string) => v?.toUpperCase().replace(/-/g, '_') as never;
    return {
      status: toUpper(guest.status),
      guestCategory: toUpper(guest.guestCategory),
      japaneseFirstName: guest.japaneseFirstName,
      japaneseLastName: guest.japaneseLastName,
      kanaFirstName: guest.kanaFirstName,
      kanaLastName: guest.kanaLastName,
      email: guest.email,
      ageCategory: toUpper(guest.ageCategory),
      zipcode: guest.zipcode,
      address: guest.address,
      building: guest.building,
      phone: guest.phone,
      dietaryRestrictions: toUpper(guest.dietaryRestrictions),
      allergyInfo: guest.allergyInfo,
      afterParty: guest.afterParty,
      message: guest.message,
    };
  }

  /**
   * 主ゲスト＋お連れ様を配列としてまとめてPOST送信
   */
  async submitRSVP(primaryGuest: RSVPFormData, companions?: RSVPFormData[]): Promise<RSVPSubmissionResponse> {
    const dto: RSVPSubmissionDTO = {
      guests: [
        this.convertGuestToDTO(primaryGuest),
        ...(companions ?? []).map((c) => this.convertGuestToDTO(c)),
      ],
    };
    return this.post<RSVPSubmissionResponse>('/rsvp', dto);
  }

  /**
   * Get RSVP submission status
   */
  async getRSVPStatus(email: string): Promise<RSVPSubmissionResponse> {
    return this.get<RSVPSubmissionResponse>(`/rsvp/status?email=${encodeURIComponent(email)}`);
  }
}

/**
 * Singleton instance of RSVPClient
 */
export const rsvpClient = new RSVPClient();
