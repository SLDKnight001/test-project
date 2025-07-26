import { Request, Response, NextFunction } from 'express';
import { ResponseUtil } from '../utils/response';

export class ValidationMiddleware {
  static validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  static validatePassword(password: string): boolean {
    return !!password && password.length >= 6;
  }

  static validatePhone(phone: string): boolean {
    const phoneRegex = /^[0-9+\-\s()]+$/;
    return phoneRegex.test(phone);
  }

  static validateRequired(fields: string[]): (req: Request, res: Response, next: NextFunction) => void {
    return (req: Request, res: Response, next: NextFunction): void => {
      const missingFields: string[] = [];

      for (const field of fields) {
        if (!req.body[field] || req.body[field].toString().trim() === '') {
          missingFields.push(field);
        }
      }

      if (missingFields.length > 0) {
        ResponseUtil.validation(
            res,
            'Required fields are missing',
            `Missing fields: ${missingFields.join(', ')}`
        );
        return;
      }

      next();
      return;
    };
  }

  static validateLogin(req: Request, res: Response, next: NextFunction): void {
    const { email, password } = req.body;

    if (!email || !password) {
      ResponseUtil.validation(res, 'Email and password are required');
      return;
    }

    if (!ValidationMiddleware.validateEmail(email)) {
      ResponseUtil.validation(res, 'Please provide a valid email');
      return;
    }

    next();
    return;
  }

  static validateRegister(req: Request, res: Response, next: NextFunction): void {
    const { firstName, lastName, email, password, phone } = req.body;

    if (!firstName || !lastName || !email || !password) {
      ResponseUtil.validation(res, 'First name, last name, email, and password are required');
      return;
    }

    if (!ValidationMiddleware.validateEmail(email)) {
      ResponseUtil.validation(res, 'Please provide a valid email');
      return;
    }

    if (!ValidationMiddleware.validatePassword(password)) {
      ResponseUtil.validation(res, 'Password must be at least 6 characters long');
      return;
    }

    if (phone && !ValidationMiddleware.validatePhone(phone)) {
      ResponseUtil.validation(res, 'Please provide a valid phone number');
      return;
    }

    next();
    return;
  }

  static validateProduct(req: Request, res: Response, next: NextFunction): void {
    const { name, description, price, category, brand, stock } = req.body;

    if (!name || !description || !price || !category || !brand || stock === undefined) {
      ResponseUtil.validation(res, 'Name, description, price, category, brand, and stock are required');
      return;
    }

    if (isNaN(price) || price < 0) {
      ResponseUtil.validation(res, 'Price must be a positive number');
      return;
    }

    if (isNaN(stock) || stock < 0) {
      ResponseUtil.validation(res, 'Stock must be a non-negative number');
      return;
    }

    next();
    return;
  }

  static validateCategory(req: Request, res: Response, next: NextFunction): void {
    const { name } = req.body;

    if (!name || name.trim() === '') {
      ResponseUtil.validation(res, 'Category name is required');
      return;
    }

    next();
    return;
  }

  static validateOrder(req: Request, res: Response, next: NextFunction): void {
    const { items, shippingAddress, paymentMethod } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      ResponseUtil.validation(res, 'Order items are required');
      return;
    }

    if (
        !shippingAddress ||
        !shippingAddress.firstName ||
        !shippingAddress.lastName ||
        !shippingAddress.address ||
        !shippingAddress.city ||
        !shippingAddress.postalCode ||
        !shippingAddress.phone
    ) {
      ResponseUtil.validation(res, 'Complete shipping address is required');
      return;
    }

    if (
        !paymentMethod ||
        !['cash_on_delivery', 'card', 'bank_transfer'].includes(paymentMethod)
    ) {
      ResponseUtil.validation(res, 'Valid payment method is required');
      return;
    }

    next();
    return;
  }
}
