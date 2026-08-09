import { Controller, Post, Get, Body, UseGuards, Req, Res, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body('email') email: string, @Body('password') pass: string) {
    const user = await this.authService.validateUser(email, pass);
    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }
    return this.authService.login(user);
  }

  @Post('register')
  async register(@Body('email') email: string, @Body('password') pass: string) {
    return this.authService.register(email, pass);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async getProfile(@Req() req: any) {
    return req.user;
  }

  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth(@Req() req: any) {
    // Redirects automatically to Google Login page
  }

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(@Req() req: any, @Res() res: any) {
    const authData = await this.authService.googleLogin(req);
    const host = req.get('host') || '';
    const isProdDomain = host.includes('web-taklifnoma.uz') || host.includes('taklifnoma');
    const defaultUrl = isProdDomain ? 'https://web-taklifnoma.uz' : 'http://localhost:5173';
    const frontendUrl = process.env.FRONTEND_URL || defaultUrl;
    return res.redirect(`${frontendUrl}/auth/callback?token=${authData.access_token}`);
  }
}
