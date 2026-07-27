import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../users/users.service';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(
    private readonly configService: ConfigService,
    private readonly usersService: UsersService,
  ) {
    super({
      clientID: configService.get<string>('GOOGLE_CLIENT_ID', 'your-google-client-id'),
      clientSecret: configService.get<string>('GOOGLE_CLIENT_SECRET', 'your-google-client-secret'),
      callbackURL: configService.get<string>('GOOGLE_CALLBACK_URL', 'http://localhost:5000/api/auth/google/callback'),
      scope: ['email', 'profile'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ): Promise<any> {
    const { id, name, emails, photos } = profile;
    const userProfile = {
      googleId: id,
      email: emails[0].value,
      name: `${name.givenName || ''} ${name.familyName || ''}`.trim(),
      avatar: photos[0]?.value,
    };

    const user = await this.usersService.findOrCreateGoogleUser(userProfile);
    done(null, user);
  }
}
