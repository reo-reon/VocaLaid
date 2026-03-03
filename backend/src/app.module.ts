import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RsvpModule } from './rsvp/rsvp.module';

@Module({
  imports: [RsvpModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
