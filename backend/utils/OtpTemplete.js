const OtpTemplete = (userName, otp) => {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Your OTP Code</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: Arial, Helvetica, sans-serif; background-color: #f4f4f4;">
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #f4f4f4; padding: 20px;">
        <tr>
          <td align="center">
            <table role="presentation" width="100%" max-width="600px" cellspacing="0" cellpadding="0" border="0" style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 5px rgba(0,0,0,0.1); overflow: hidden;">
              <tr>
                <td style="background-color: #007bff; padding: 20px; text-align: center;">
                  <h1 style="color: #ffffff; margin: 0; font-size: 24px;">Your OTP Code</h1>
                </td>
              </tr>
              <tr>
                <td style="padding: 30px; text-align: center;">
                  <p style="color: #333333; font-size: 16px; margin: 0 0 20px;">Hello <strong>${userName}</strong>,</p>
                  <p style="color: #333333; font-size: 16px; margin: 0 0 20px;">Use the following One-Time Password (OTP) to verify your account. It expires in 10 minutes.</p>
                  <div style="display: inline-block; background-color: #f0f0f0; padding: 15px 25px; border-radius: 5px; margin: 20px 0;">
                    <h2 style="color: #007bff; font-size: 32px; margin: 0; letter-spacing: 5px;">${otp}</h2>
                  </div>
                  <p style="color: #666666; font-size: 14px; margin: 0 0 20px;">If you didn’t request this, please ignore this email or contact support.</p>
                </td>
              </tr>
              <tr>
                <td style="background-color: #f8f9fa; padding: 20px; text-align: center;">
                  <p style="color: #666666; font-size: 12px; margin: 0;">© 2025 MERN_AUTH. All rights reserved.</p>
                  <p style="color: #666666; font-size: 12px; margin: 5px 0 0;">
                    <a href="mailto:support@yourdomain.com" style="color: #007bff; text-decoration: none;">Contact Us</a>
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
};

export default OtpTemplete;