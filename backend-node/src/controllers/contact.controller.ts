import { Request, Response } from 'express';
import { ResponseUtil } from '../utils/response';
import { ErrorHandler } from '../middleware/errorHandler';
import { ContactService } from '../services/contact.service';

export class ContactController {
  static sendContactMessage = ErrorHandler.asyncHandler(async (req: Request, res: Response) => {
    try {
      const result = await ContactService.sendContactMessage(req.body);
      return ResponseUtil.success(
          res,
          'Your message has been sent successfully. We will get back to you soon!',
          result
      );
    } catch (error) {
      console.error('Email sending error:', error);
      if (error instanceof Error) {
        return ResponseUtil.validation(res, error.message);
      }
      return ResponseUtil.serverError(
          res,
          'Failed to send message. Please try again later.',
          'Email service error'
      );
    }
  });

  static getContactInfo = ErrorHandler.asyncHandler(async (req: Request, res: Response) => {
    const contactInfo = ContactService.getContactInfo();
    return ResponseUtil.success(
        res,
        'Contact information retrieved successfully',
        contactInfo
    );
  });
}