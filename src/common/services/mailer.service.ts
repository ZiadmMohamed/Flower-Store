import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { otpEmailTemplate } from '../templates/otp-email.template';

@Injectable()
export class MailerService {
  private transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: +process.env.SMTP_PORT,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    });
  }

  async sendOTPEmail(email: string, otp: string) {
    const html = otpEmailTemplate(otp);
    await this.transporter.sendMail({
      from: `"Flower Store 🌸" <${process.env.SMTP_USER}>`,
      to: email,
      subject: 'Your Verification Code',
      html,
    });
  }
}
