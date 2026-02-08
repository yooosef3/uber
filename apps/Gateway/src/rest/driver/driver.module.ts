import { Module } from '@nestjs/common';
import { DriverAuthController } from './auth/auth.controller';
import { DriverAuthService } from './auth/auth.service';
import { DriverAuthGuard } from './auth/auth.guard';
import { DriverTripController } from './trip/trip.controller';
import { DriverTripService } from './trip/trip.service';

@Module({
  controllers: [DriverAuthController,DriverTripController],
  providers: [DriverAuthService, DriverAuthGuard, DriverTripService],
})
export class DriverModule {}
