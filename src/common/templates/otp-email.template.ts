export const otpEmailTemplate = (otp: string): string => `
<!DOCTYPE html>
<html lang="en">
  <body style="font-family: Arial, sans-serif; text-align: center; background-color: #f7f7f7; padding: 30px;">
    <div style="background-color: white; border-radius: 10px; padding: 20px;">
      <h2 style="color: #333;">Verify Your Email</h2>
      <p style="font-size: 16px;">Use the following code to verify your account:</p>
      <h1 style="color: #4CAF50; letter-spacing: 4px;">${otp}</h1>
      <p style="color: #777;">This code will expire in 5 minutes.</p>
    </div>
  </body>
</html>
`;
