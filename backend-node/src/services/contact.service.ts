import { ContactDto } from '../dto/Contact.dto';
import { EmailUtil } from '../utils/email';

export class ContactService {
    static async sendContactMessage(contactData: ContactDto) {
        const { name, email, subject, message } = contactData;

        // Validate required fields
        if (!name || !email || !subject || !message) {
            throw new Error('All fields are required');
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            throw new Error('Please provide a valid email address');
        }

        // Prepare email options
        const adminMailOptions = {
            from: process.env.EMAIL_USER,
            to: process.env.EMAIL_USER, // Send to admin email
            subject: `Contact Form: ${subject}`,
            html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb;">New Contact Form Submission</h2>
          <div style="background-color: #f3f4f6; padding: 20px; margin: 20px 0; border-radius: 5px;">
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Subject:</strong> ${subject}</p>
          </div>
          <div style="background-color: #ffffff; padding: 20px; border: 1px solid #e5e7eb; border-radius: 5px;">
            <h3>Message:</h3>
            <p style="white-space: pre-wrap;">${message}</p>
          </div>
          <hr style="margin: 30px 0;">
          <p style="color: #6b7280; font-size: 14px;">
            This message was sent from the Techno Computers contact form.
          </p>
        </div>
      `
        };

        const customerMailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Thank you for contacting Techno Computers',
            html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb;">Thank you for your message!</h2>
          <p>Dear ${name},</p>
          <p>We have received your message and will get back to you as soon as possible.</p>
          <div style="background-color: #f3f4f6; padding: 20px; margin: 20px 0; border-radius: 5px;">
            <p><strong>Your message:</strong></p>
            <p style="white-space: pre-wrap;">${message}</p>
          </div>
          <p>Our team typically responds within 24-48 hours during business days.</p>
          <p>Best regards,<br>Techno Computers Support Team</p>
          <hr style="margin: 30px 0;">
          <div style="text-align: center;">
            <p style="color: #6b7280; font-size: 14px;">
              Techno Computers - Your Technology Partner
            </p>
          </div>
        </div>
      `
        };

        // Send emails
        const transporter = (EmailUtil as any).transporter;
        await Promise.all([
            transporter.sendMail(adminMailOptions),
            transporter.sendMail(customerMailOptions)
        ]);

        return {
            name,
            email,
            subject,
            sentAt: new Date().toISOString()
        };
    }

    static getContactInfo() {
        return {
            company: 'Techno Computers',
            address: '123 Technology Street, Digital City, DC 12345',
            phone: '+1 (555) 123-4567',
            email: 'info@technocomputers.com',
            supportEmail: 'support@technocomputers.com',
            salesEmail: 'sales@technocomputers.com',
            businessHours: {
                monday: '9:00 AM - 6:00 PM',
                tuesday: '9:00 AM - 6:00 PM',
                wednesday: '9:00 AM - 6:00 PM',
                thursday: '9:00 AM - 6:00 PM',
                friday: '9:00 AM - 6:00 PM',
                saturday: '10:00 AM - 4:00 PM',
                sunday: 'Closed'
            },
            socialMedia: {
                facebook: 'https://facebook.com/technocomputers',
                twitter: 'https://twitter.com/technocomputers',
                instagram: 'https://instagram.com/technocomputers',
                linkedin: 'https://linkedin.com/company/technocomputers'
            }
        };
    }
}