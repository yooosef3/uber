import {
  Body,
  Controller,
  Post,
  UseGuards,
  UseFilters,
  UseInterceptors,
  Request,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { PassengerAuthGuard } from '../auth/auth.guard';
import { HttpExceptionFilter } from 'src/response/httpException.filter';
import { ResponseInterceptor } from 'src/response/response.intercptors';
import { PassengerTripService } from './trip.service';
import { CreateTripInputDto } from 'src/dto/passengers/trip.dto';

@ApiTags('Passenger:Trip')
@ApiBearerAuth('Authorization')
@Controller('/trips')
@UseGuards(PassengerAuthGuard)
@UseFilters(HttpExceptionFilter)
@UseInterceptors(ResponseInterceptor)
export class PassengerTripController {
  constructor(private readonly tripService: PassengerTripService) {}

  @Post()
  @ApiOperation({ summary: 'Create new trip' })
  async createTrip(@Body() body: CreateTripInputDto, @Request() req) {
    return this.tripService.createTrip({
      passengerId: req.passenger.id,
      ...body,
    });
  }
}
