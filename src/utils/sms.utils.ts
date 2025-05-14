import { NotAcceptableException } from '@nestjs/common';
import axios from 'axios';

export async function sendOtp(phone: string, otp: number) {
  try {
    const payload = await axios.get(
      `http://103.150.136.120:6005/api/v2/SendSMS?SenderId=${process.env.OTP_SENDER_ID}&Is_Unicode=false&Is_Flash=false&Message=Your phone verification code is: ${otp} Thanks HEALING GAMUT PRIVATE LIMITED&MobileNumbers=${phone}&ApiKey=${process.env.OTP_API_KEY}&ClientId=${process.env.OTP_CLIENT_ID}`,
    );
    if (payload.data.ErrorCode == 0) {
      return true;
    } else {
      throw new NotAcceptableException(
        'Otp not sent please check your number or try after some time!',
      );
    }
  } catch (error) {
    throw new NotAcceptableException(
      'Otp not sent please check your number or try after some time!',
    );
  }
}
