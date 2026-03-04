/**
 * RSVP Client for handling RSVP-related API calls
 */

import { RestClient } from './restClient';
import { RSVPFormData } from '@/feature/wedding/types';
import type { components } from './schema';

/**
 * バックエンドへ送信するゲスト1名分のDTO
 * ※ openapi-typescript で自動生成された型を使用
 *    型を変更したい場合は backend の DTO を修正し `npm run generate:schema` → `npm run generate:api` を実行すること
 */
export type RSVPGuestItemDTO = components['schemas']['CreateRsvpGuestItemDto'];

/**
 * RSVP バッチ送信DTO（配列形式）
 * ※ 自動生成型
 */
export type RSVPSubmissionDTO = components['schemas']['CreateRsvpBatchDto'];

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
