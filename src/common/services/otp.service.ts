import { BadRequestException, Injectable } from '@nestjs/common';
import { RedisService } from '../redis/redis.service';

@Injectable()
export class OTPService {
  constructor(private readonly redisService: RedisService) {}

  generateOTP(length = 6): string {
    let otp = '';
    for (let i = 0; i < length; i++) {
      otp += Math.floor(Math.random() * 10).toString();
    }
    return otp;
  }

  async saveOTP(email: string, otp: string) {
    await this.redisService.set(`otp:${email}`, otp, 300); // expires in 5 min
  }

  async verifyOTP(email: string, otp: string): Promise<boolean> {
    const storedOtp = await this.redisService.get(`otp:${email}`);
    if (!storedOtp) throw new BadRequestException('OTP expired or invalid');
    return storedOtp === otp;
  }

  async deleteOTP(email: string) {
    await this.redisService.del(`otp:${email}`);
  }
}
