import nodemailer from 'nodemailer';

export class EmailUtil {
  private static transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.EMAIL_PORT || '465'),
    secure: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  static async sendWelcomeEmail(email: string, firstName: string): Promise<void> {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Welcome to Techno Computers!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb;">Welcome to Techno Computers!</h2>
          <p>Dear ${firstName},</p>
          <p>Thank you for registering with Techno Computers. We're excited to have you as part of our community!</p>
          <p>Explore our wide range of computers, laptops, and tech accessories.</p>
          <div style="margin: 30px 0; text-align: center;">
            <a href="#" style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px;">Start Shopping</a>
          </div>
          <p>Best regards,<br>Techno Computers Team</p>
        </div>
      `
    };

    await this.transporter.sendMail(mailOptions);
  }

  static async sendOrderConfirmation(email: string, orderNumber: string, totalAmount: number): Promise<void> {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: `Order Confirmation - ${orderNumber}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #16a34a;">Order Confirmed!</h2>
          <p>Your order has been successfully placed.</p>
          <div style="background-color: #f3f4f6; padding: 20px; margin: 20px 0; border-radius: 5px;">
            <p><strong>Order Number:</strong> ${orderNumber}</p>
            <p><strong>Total Amount:</strong> $${totalAmount.toFixed(2)}</p>
          </div>
          <p>We'll send you another email when your order ships.</p>
          <p>Thank you for shopping with Techno Computers!</p>
        </div>
      `
    };

    await this.transporter.sendMail(mailOptions);
  }

  static async sendPasswordResetEmail(email: string, resetToken: string): Promise<void> {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Password Reset Request',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #dc2626;">Password Reset Request</h2>
          <p>You requested to reset your password. Click the button below to set a new password:</p>
          <div style="margin: 30px 0; text-align: center;">
            <a href="#" style="background-color: #dc2626; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px;">Reset Password</a>
          </div>
          <p>If you didn't request this, please ignore this email.</p>
          <p>This link will expire in 1 hour.</p>
        </div>
      `
    };

    await this.transporter.sendMail(mailOptions);
  }
}