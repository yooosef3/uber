import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  Res,
  UseFilters,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { DriverAuthService } from './auth.service';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import {
  DriverRequestOtpInputDto,
  DriverVerifyOtpInputDto,
} from 'src/dto/driver/driver.dto';
import { HttpExceptionFilter } from 'src/response/httpException.filter';
import { ResponseInterceptor } from 'src/response/response.intercptors';
import { Response } from 'express';
import { DriverAuthGuard } from './auth.guard';
@ApiTags('Driver:Auth')
@Controller('Auth')
@UseFilters(HttpExceptionFilter)
@UseInterceptors(ResponseInterceptor)
export class DriverAuthController {
  constructor(private readonly driverAuthService: DriverAuthService) {}

  @Post('request-otp')
  @ApiOperation({ summary: 'request otp in app by phone number' })
  async requestOtp(@Body() body: DriverRequestOtpInputDto) {
    const requestOtpData = await this.driverAuthService.requestOtp(body);
    return requestOtpData;
  }

  @Post('verify-otp')
  @ApiOperation({ summary: 'verify otp sent to driver phone number' })
  async verifyOtp(
    @Body() body: DriverVerifyOtpInputDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const verifyOtpData = await this.driverAuthService.verifyOtp(body);
    // const tokenData = verifyOtpData.accessToken;
    // res.cookie(tokenData.name, tokenData.token, {
    //   maxAge: tokenData.ttl,
    //   httpOnly: true,
    //   secure: true,
    //   sameSite: 'strict',
    //   path: '/',
    // });
    // delete verifyOtpData.accessToken;
    return verifyOtpData;
  }

  @ApiBearerAuth('Authorization')
  @UseGuards(DriverAuthGuard)
  @Get('profile')
  @ApiOperation({ summary: 'Get driver profile' })
  async getProfile(@Request() req) {
    return req.driver;
  }
}
