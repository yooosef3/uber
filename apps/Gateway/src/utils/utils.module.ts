import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { TokenService } from './handlers/token.service';
import { UtilsService } from './utils.service';
@Global()
@Module({
  imports: [
    ConfigModule,
    JwtModule.register({
      global: true,
    }),
  ],
  providers: [TokenService, UtilsService],
  exports: [TokenService, UtilsService],
})
export class UtilsModule {}
