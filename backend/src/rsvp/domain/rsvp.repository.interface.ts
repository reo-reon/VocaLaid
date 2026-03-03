import { RsvpGuest } from '../domain/rsvp-guest.entity';

export interface IRsvpRepository {
  create(primaryGuest: RsvpGuest, companions: RsvpGuest[]): Promise<RsvpGuest>;
  findById(id: number): Promise<RsvpGuest | null>;
  findByEmail(email: string): Promise<RsvpGuest | null>;
}
