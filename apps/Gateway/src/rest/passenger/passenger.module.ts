import { Module } from '@nestjs/common';
import { PassengerAuthController } from './auth/auth.controller';
import { PassengerAuthService } from './auth/auth.service';
import { PassengerAuthGuard } from './auth/auth.guard';
import { PassengerTripController } from './trip/trip.controller';
import { PassengerTripService } from './trip/trip.service';

@Module({
  controllers: [PassengerAuthController, PassengerTripController],
  providers: [PassengerAuthService, PassengerAuthGuard, PassengerTripService],
})
export class PassengerModule {}
