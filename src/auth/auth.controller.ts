import {
  Body,
  Controller,
  Get,
  Ip,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Account } from 'src/account/entities/account.entity';
import { AuthService } from './auth.service';
import { CurrentUser } from './decorators/current-user.decorator';

import { OtpDto, SigninDto, ResetPasswordDto, MobLoginDto } from './dto/login.dto';

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("account/forgot")
  reset(@Body() dto: ResetPasswordDto) {
    return this.authService.reset(dto);
  }

  // Root and Root staff
  @Post("account/login")
  signin(@Body() dto: SigninDto) {
    console.log(dto);
    return this.authService.signIn(dto);
  }

  

  @Post("verify/otp")
  verifyOtp(@Body() dto: OtpDto) {
    return this.authService.verifyForgotOtp(dto.loginId, dto.otp);
  }
 
  @Post("verify")
  verifyUserOtp(@Body() dto: OtpDto, @Req() req, @Ip() ip) {
    return this.authService.verifyOtp(
      dto.loginId,
      dto.otp,
      req.headers.origin,
      ip
    );
  }

  @Get("logout")
  @UseGuards(AuthGuard("jwt"))
  logout(@CurrentUser() user: Account, @Req() req, @Ip() ip) {
    return this.authService.logout(user.id, req.headers.origin, ip);
  }

  @Post('user/login')
  userLogin(@Body() dto: MobLoginDto){
    return this.authService.userLogin(dto.loginId)
  }

}
