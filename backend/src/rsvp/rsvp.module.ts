import { Module } from '@nestjs/common';
import { RsvpController } from './presentation/rsvp.controller';
import { CreateRsvpUseCase } from './application/use-cases/create-rsvp.use-case';
import { PrismaRsvpRepository } from './infrastructure/prisma-rsvp.repository';
import { PrismaService } from '../shared/infrastructure/prisma.service';

export const RSVP_REPOSITORY = 'RSVP_REPOSITORY';

@Module({
  controllers: [RsvpController],
  providers: [
    PrismaService,
    {
      provide: RSVP_REPOSITORY,
      useClass: PrismaRsvpRepository,
    },
    {
      provide: CreateRsvpUseCase,
      useFactory: (rsvpRepository: PrismaRsvpRepository) => {
        return new CreateRsvpUseCase(rsvpRepository);
      },
      inject: [RSVP_REPOSITORY],
    },
  ],
})
export class RsvpModule {}
