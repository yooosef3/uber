import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

export interface AccessTokenPayload {
  driverId: string;
  sessionId: string;
  accessExpiresAt: number;
  refreshExpiresAt: number;
}

export interface AccessTokenResult {
  name: string;
  ttl: number;
  token: string;
  payload: AccessTokenPayload;
}

@Injectable()
export class TokenService {
  constructor(
    private readonly jwt: JwtService,
    private readonly config: ConfigService,
  ) {}

  generateAccessToken(params: {
    driverId: string;
    sessionId: string;
  }): AccessTokenResult {
    const now = Date.now();

    const accessExpiresInSeconds =
      this.config.get<number>('jwt.access.expiresInSeconds') ?? 3600;

    const refreshExpiresInSeconds =
      this.config.get<number>('jwt.refresh.expiresInSeconds') ?? 3600;

    const accessExpiresAt = now + accessExpiresInSeconds * 1000;
    const refreshExpiresAt = now + refreshExpiresInSeconds * 1000;

    const ttl = refreshExpiresInSeconds * 1000;

    const payload = {
      did: params.driverId,
      sid: params.sessionId,
      aea: accessExpiresAt,
      rea: refreshExpiresAt,
    };

    const token = this.jwt.sign(payload, {
      secret: this.config.get<string>('Jwt.access.secret'),
      expiresIn: accessExpiresInSeconds,
    });

    return {
      name: 'auth_driver',
      ttl,
      token,
      payload: {
        driverId: params.driverId,
        sessionId: params.sessionId,
        accessExpiresAt,
        refreshExpiresAt,
      },
    };
  }

  decode(token: string): any {
    try {
      return this.jwt.decode(token);
    } catch (e) {
      return null;
    }
  }
}
