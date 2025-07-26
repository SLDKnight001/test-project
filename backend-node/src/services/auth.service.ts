import { User } from '../model/User';
import { JWTUtil } from '../utils/jwt';
import { EmailUtil } from '../utils/email';
import { LoginDto, RegisterDto, ChangePasswordDto } from '../dto/Auth.dto';
import { IUser } from '../types';
import bcrypt from 'bcrypt';

export class AuthService {
  static async login(loginData: LoginDto) {
    const { email, password } = loginData;

    // Find user by email
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      throw new Error('Invalid email or password');
    }

    if (user.status === 'inactive') {
      throw new Error('Account is inactive. Please contact support.');
    }

    // Compare password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new Error('Invalid email or password');
    }

    // Generate tokens
    const tokenPayload = {
      userId: user._id.toString(),
      email: user.email,
      role: user.role
    };

    const accessToken = JWTUtil.generateAccessToken(tokenPayload);
    const refreshToken = JWTUtil.generateRefreshToken(tokenPayload);

    const userResponse = user.toJSON();

    return {
      user: userResponse,
      accessToken,
      refreshToken
    };
  }

  static async register(registerData: RegisterDto) {
    const { firstName, lastName, email, password, phone, address, role } = registerData;

    // Check if user already exists
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      throw new Error('User with this email already exists');
    }

    // Hash password before saving
    const hashedPassword = await bcrypt.hash(password, 12); // 12 is the salt rounds

    // Create new user
    const user = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword, // Store the hashed password
      phone,
      address,
      role: role || 'customer'
    });

    await user.save();

    // Send welcome email
    try {
      await EmailUtil.sendWelcomeEmail(email, firstName);
    } catch (error) {
      console.error('Failed to send welcome email:', error);
    }

    // Generate tokens
    const tokenPayload = {
      userId: user._id.toString(),
      email: user.email,
      role: user.role
    };

    const accessToken = JWTUtil.generateAccessToken(tokenPayload);
    const refreshToken = JWTUtil.generateRefreshToken(tokenPayload);

    const userResponse = user.toJSON();

    return {
      user: userResponse,
      accessToken,
      refreshToken
    };
  }

  static async refreshToken(refreshToken: string) {
    try {
      const decoded = JWTUtil.verifyRefreshToken(refreshToken);

      const user = await User.findById(decoded.userId);

      if (!user) {
        throw new Error('User not found');
      }

      if (user.status === 'inactive') {
        throw new Error('Account is inactive');
      }

      const tokenPayload = {
        userId: user._id.toString(),
        email: user.email,
        role: user.role
      };

      const newAccessToken = JWTUtil.generateAccessToken(tokenPayload);
      const newRefreshToken = JWTUtil.generateRefreshToken(tokenPayload);

      const userResponse = user.toJSON();

      return {
        user: userResponse,
        accessToken: newAccessToken,
        refreshToken: newRefreshToken
      };
    } catch (error) {
      throw new Error('Invalid or expired refresh token');
    }
  }

  static async changePassword(userId: string, passwordData: ChangePasswordDto) {
    const { currentPassword, newPassword, confirmPassword } = passwordData;

    if (newPassword !== confirmPassword) {
      throw new Error('New password and confirm password do not match');
    }

    if (newPassword.length < 6) {
      throw new Error('New password must be at least 6 characters long');
    }

    const user = await User.findById(userId).select('+password');

    if (!user) {
      throw new Error('User not found');
    }

    // Compare current password
    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);

    if (!isCurrentPasswordValid) {
      throw new Error('Current password is incorrect');
    }

    // Hash new password before saving
    const hashedNewPassword = await bcrypt.hash(newPassword, 12);
    user.password = hashedNewPassword;
    await user.save();

    return { message: 'Password changed successfully' };
  }

  static async getUserProfile(userId: string): Promise<IUser> {
    const user = await User.findById(userId);

    if (!user) {
      throw new Error('User not found');
    }

    return user;
  }

  static async updateProfile(userId: string, updateData: Partial<IUser>) {
    const user = await User.findById(userId);

    if (!user) {
      throw new Error('User not found');
    }

    // Update allowed fields only
    const allowedFields = ['firstName', 'lastName', 'phone', 'address', 'profileImage'];

    for (const field of allowedFields) {
      if (updateData[field as keyof IUser] !== undefined) {
        (user as any)[field] = updateData[field as keyof IUser];
      }
    }

    await user.save();
    return user.toJSON();
  }
}